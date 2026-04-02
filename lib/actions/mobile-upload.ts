"use server";

import { PDFDocument } from "pdf-lib";
import { revalidatePath } from "next/cache";

import { createMobileUploadToken, getMobileUploadToken, isMobileUploadTokenValid } from "@/lib/mobile-upload";
import { createClient } from "@/lib/supabase/server";
import { storeUploadedDocumentForUser } from "@/lib/actions/documents";
import { createAdminClient } from "@/lib/supabase/admin";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

export type MobileUploadState = {
  error: string;
  success: string;
  documentId?: string;
};

export async function createMobileUploadTokenAction({
  caseId
}: {
  caseId?: string | null;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.");
  }

  if (caseId) {
    const { data: linkedCase } = await supabase.from("cases").select("id").eq("id", caseId).eq("user_id", user.id).maybeSingle();
    if (!linkedCase) {
      throw new Error("Der ausgewählte Fall wurde nicht gefunden.");
    }
  }

  return createMobileUploadToken({ userId: user.id, caseId });
}

async function combineImagesToPdf(files: File[]) {
  const pdf = await PDFDocument.create();

  for (const file of files) {
    const bytes = await file.arrayBuffer();
    const image =
      file.type === "image/png"
        ? await pdf.embedPng(bytes)
        : await pdf.embedJpg(bytes);
    const page = pdf.addPage([image.width, image.height]);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    });
  }

  const bytes = await pdf.save();
  return new Uint8Array(bytes).buffer as ArrayBuffer;
}

export async function completeMobileUploadAction(
  _: MobileUploadState,
  formData: FormData
): Promise<MobileUploadState> {
  const rawToken = String(formData.get("token") ?? "").trim();
  const files = formData.getAll("pages").filter((value): value is File => value instanceof File && value.size > 0);

  if (!rawToken) {
    return { error: "Der Upload-Link ist ungültig.", success: "" };
  }

  const tokenRecord = await getMobileUploadToken(rawToken);
  if (!isMobileUploadTokenValid(tokenRecord)) {
    return { error: "Dieser Upload-Link ist abgelaufen oder wurde schon verwendet.", success: "" };
  }

  if (!files.length) {
    return { error: "Bitte füge mindestens eine Seite hinzu.", success: "" };
  }

  if (files.some((file) => file.size > MAX_IMAGE_SIZE)) {
    return { error: "Mindestens eine Seite ist größer als 15 MB.", success: "" };
  }

  if (files.some((file) => !file.type.startsWith("image/"))) {
    return { error: "Bitte lade auf dem Handy nur Bilder oder Fotos hoch.", success: "" };
  }

  try {
    const fileBuffer =
      files.length === 1
        ? await files[0].arrayBuffer()
        : await combineImagesToPdf(files);
    const mimeType = files.length === 1 ? files[0].type : "application/pdf";
    const originalFilename =
      files.length === 1
        ? files[0].name || "handy-upload.jpg"
        : `mobile-scan-${new Date().toISOString().slice(0, 10)}.pdf`;

    const { documentId } = await storeUploadedDocumentForUser({
      userId: tokenRecord.user_id,
      caseId: tokenRecord.case_id,
      fileBuffer,
      mimeType,
      originalFilename,
      useAdmin: true
    });

    const admin = createAdminClient();
    await admin
      .from("mobile_upload_tokens")
      .update({ used_at: new Date().toISOString(), document_id: documentId })
      .eq("id", tokenRecord.id);

    revalidatePath("/app");
    revalidatePath("/app/upload");
    revalidatePath("/app/tasks");
    revalidatePath("/app/cases");
    revalidatePath(`/app/documents/${documentId}`);

    return {
      error: "",
      success: "Das Dokument wurde erfolgreich von deinem Handy hochgeladen.",
      documentId
    };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Der mobile Upload ist fehlgeschlagen.",
      success: ""
    };
  }
}
