"use server";

import { revalidatePath } from "next/cache";

import { createCaseEvent } from "@/lib/case-events";
import { createClient } from "@/lib/supabase/server";

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

  const safeFilename = sanitizeFilename(file.name || "dokument");
  const storagePath = `${user.id}/${Date.now()}_${safeFilename}`;
  const arrayBuffer = await file.arrayBuffer();

  const { error: storageError } = await supabase.storage.from("documents").upload(storagePath, arrayBuffer, {
    contentType: file.type,
    upsert: false
  });

  if (storageError) {
    return { error: `Die Datei konnte nicht gespeichert werden: ${storageError.message}`, success: "" };
  }

  const { data: insertedDocument, error: insertError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      case_id: caseId,
      status: "neu",
      file_path: storagePath,
      original_filename: file.name,
      mime_type: file.type
    })
    .select("id")
    .single();

  if (insertError || !insertedDocument) {
    await supabase.storage.from("documents").remove([storagePath]);
    return { error: `Der Dokumenteintrag konnte nicht angelegt werden: ${insertError?.message ?? "Unbekannter Fehler"}`, success: "" };
  }

  if (caseId) {
    await supabase.from("cases").update({ updated_at: new Date().toISOString() }).eq("id", caseId).eq("user_id", user.id);
    await createCaseEvent({
      caseId,
      documentId: insertedDocument.id,
      eventType: "new_document_added",
      note: "Neues Dokument zu bestehendem Fall hochgeladen."
    });
  }

  revalidatePath("/app");
  revalidatePath("/app/cases");
  if (caseId) {
    revalidatePath(`/app/cases/${caseId}`);
  }
  revalidatePath("/app/upload");
  revalidatePath(`/app/documents/${insertedDocument.id}`);

  return { error: "", success: "Dokument erfolgreich hochgeladen. Du wirst weitergeleitet.", documentId: insertedDocument.id };
}
