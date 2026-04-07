"use server";

import { revalidatePath } from "next/cache";

import { createEarlyCaseForDocument } from "@/lib/cases";
import { ensureDocumentKindDetection } from "@/lib/document-kind-service";
import { getKindDetectionHeadline } from "@/lib/document-kind-ui";
import { createClient } from "@/lib/supabase/server";
import type { AppLocale } from "@/lib/i18n";

export type SaveDocumentCaseState = {
  error: string;
  success: string;
  caseId?: string;
};

function normalizeLocale(raw: string): AppLocale {
  const v = raw.trim();
  if (v === "de" || v === "en" || v === "es" || v === "zh" || v === "tr" || v === "uk") {
    return v;
  }
  return "de";
}

export async function saveDocumentAsCaseAction(_: SaveDocumentCaseState, formData: FormData): Promise<SaveDocumentCaseState> {
  const documentId = String(formData.get("documentId") ?? "").trim();
  const locale = normalizeLocale(String(formData.get("locale") ?? "de"));

  if (!documentId) {
    return { error: "Dokument fehlt.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sitzung abgelaufen. Bitte neu anmelden.", success: "" };
  }

  const { data: document, error: docErr } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (docErr || !document) {
    return { error: "Dokument nicht gefunden.", success: "" };
  }

  if (document.case_id) {
    return { error: "", success: "", caseId: document.case_id };
  }

  const detection = await ensureDocumentKindDetection(documentId);

  const title =
    detection != null
      ? getKindDetectionHeadline(locale, detection)
      : String(document.original_filename ?? "Dokument").trim() || "Dokument";
  const organization =
    detection?.signals?.length ? detection.signals[0]!.slice(0, 120) : null;

  try {
    const result = await createEarlyCaseForDocument({
      userId: user.id,
      document,
      detection,
      title,
      organization
    });

    revalidatePath("/app/cases");
    revalidatePath(`/app/cases/${result.caseRecord.id}`);
    revalidatePath(`/app/documents/${documentId}`);
    revalidatePath(`/app/documents/${documentId}/decision`);
    revalidatePath("/app");

    return {
      error: "",
      success: result.created ? "saved" : "exists",
      caseId: result.caseRecord.id
    };
  } catch (e) {
    return {
      error: e instanceof Error ? e.message : "Fall konnte nicht gespeichert werden.",
      success: ""
    };
  }
}
