"use server";

import { revalidatePath } from "next/cache";

import { createCaseEvent } from "@/lib/case-events";
import { getInitialDocumentName } from "@/lib/document-name";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/jpg"]);

export type UploadFormState = {
  error: string;
  success: string;
  documentId?: string;
};

function sanitizeFilename(filename: string) {
  return filename
    .normalize("NFKD")
    .replace(/[^\w.\-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

async function createStoredDocumentRecord({
  userId,
  caseId,
  fileBuffer,
  mimeType,
  originalFilename,
  useAdmin = false
}: {
  userId: string;
  caseId?: string | null;
  fileBuffer: ArrayBuffer;
  mimeType: string;
  originalFilename: string;
  useAdmin?: boolean;
}) {
  const client = useAdmin ? createAdminClient() : await createClient();
  const safeFilename = sanitizeFilename(originalFilename || "dokument");
  const displayName = getInitialDocumentName(originalFilename || "dokument", mimeType);
  const storagePath = `${userId}/${Date.now()}_${safeFilename}`;

  const { error: storageError } = await client.storage.from("documents").upload(storagePath, fileBuffer, {
    contentType: mimeType,
    upsert: false
  });

  if (storageError) {
    throw new Error(`Die Datei konnte nicht gespeichert werden: ${storageError.message}`);
  }

  const { data: insertedDocument, error: insertError } = await client
    .from("documents")
    .insert({
      user_id: userId,
      case_id: caseId ?? null,
      status: "neu",
      file_path: storagePath,
      original_filename: displayName,
      mime_type: mimeType
    })
    .select("id")
    .single();

  if (insertError || !insertedDocument) {
    await client.storage.from("documents").remove([storagePath]);
    throw new Error(`Der Dokumenteintrag konnte nicht angelegt werden: ${insertError?.message ?? "Unbekannter Fehler"}`);
  }

  if (caseId) {
    await client.from("cases").update({ updated_at: new Date().toISOString() }).eq("id", caseId).eq("user_id", userId);
    await createCaseEvent({
      caseId,
      documentId: insertedDocument.id,
      eventType: "new_document_added",
      note: "Neues Dokument zu bestehendem Fall hochgeladen."
    });
  }

  return {
    documentId: insertedDocument.id as string,
    displayName
  };
}

export async function storeUploadedDocumentForUser({
  userId,
  caseId,
  fileBuffer,
  mimeType,
  originalFilename,
  useAdmin = false
}: {
  userId: string;
  caseId?: string | null;
  fileBuffer: ArrayBuffer;
  mimeType: string;
  originalFilename: string;
  useAdmin?: boolean;
}) {
  return createStoredDocumentRecord({
    userId,
    caseId,
    fileBuffer,
    mimeType,
    originalFilename,
    useAdmin
  });
}

export async function uploadDocumentAction(_: UploadFormState, formData: FormData): Promise<UploadFormState> {
  const file = formData.get("document");
  const caseId = String(formData.get("caseId") ?? "").trim() || null;

  if (!(file instanceof File)) {
    return { error: "Bitte wähle eine Datei aus.", success: "" };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Erlaubt sind PDF, JPG, JPEG und PNG.", success: "" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "Die Datei ist größer als 15 MB.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  if (caseId) {
    const { data: linkedCase } = await supabase
      .from("cases")
      .select("id")
      .eq("id", caseId)
      .eq("user_id", user.id)
      .maybeSingle();

    if (!linkedCase) {
      return { error: "Der ausgewählte Fall wurde nicht gefunden.", success: "" };
    }
  }

  const arrayBuffer = await file.arrayBuffer();
  let documentId = "";

  try {
    const result = await createStoredDocumentRecord({
      userId: user.id,
      caseId,
      fileBuffer: arrayBuffer,
      mimeType: file.type,
      originalFilename: file.name || "dokument"
    });
    documentId = result.documentId;
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Die Datei konnte nicht gespeichert werden.", success: "" };
  }

  revalidatePath("/app");
  revalidatePath("/app/cases");
  if (caseId) {
    revalidatePath(`/app/cases/${caseId}`);
  }
  revalidatePath("/app/upload");
  revalidatePath(`/app/documents/${documentId}`);

  return { error: "", success: "Dokument erfolgreich hochgeladen. Du wirst weitergeleitet.", documentId };
}
