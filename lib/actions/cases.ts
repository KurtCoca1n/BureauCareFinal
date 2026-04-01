"use server";

import { revalidatePath } from "next/cache";

import { createCaseEvent } from "@/lib/case-events";
import { createClient } from "@/lib/supabase/server";

export async function markDocumentSentAction(formData: FormData) {
  const documentId = String(formData.get("documentId") ?? "").trim();
  if (!documentId) return;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: document } = await supabase
    .from("documents")
    .select("id, case_id")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!document) return;

  await supabase.from("documents").update({ status: "gesendet" }).eq("id", document.id);

  if (document.case_id) {
    await supabase.from("cases").update({ status: "waiting", updated_at: new Date().toISOString() }).eq("id", document.case_id);
    await createCaseEvent({ caseId: document.case_id, documentId, eventType: "reply_sent", note: "Antwort als gesendet markiert." });
  }

  revalidatePath("/app");
  revalidatePath("/app/cases");
  revalidatePath(`/app/documents/${documentId}`);
}

export async function markDocumentWaitingAction(formData: FormData) {
  const documentId = String(formData.get("documentId") ?? "").trim();
  if (!documentId) return;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: document } = await supabase
    .from("documents")
    .select("id, case_id")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (!document) return;

  await supabase.from("documents").update({ status: "warten" }).eq("id", document.id);

  if (document.case_id) {
    await supabase.from("cases").update({ status: "waiting", updated_at: new Date().toISOString() }).eq("id", document.case_id);
    await createCaseEvent({ caseId: document.case_id, documentId, eventType: "status_changed", note: "Warten auf Antwort markiert." });
  }

  revalidatePath("/app");
  revalidatePath("/app/cases");
  revalidatePath(`/app/documents/${documentId}`);
}

export async function markCaseDoneAction(formData: FormData) {
  const caseId = String(formData.get("caseId") ?? "").trim();
  if (!caseId) return;

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from("cases").update({ status: "done", updated_at: new Date().toISOString() }).eq("id", caseId).eq("user_id", user.id);
  await supabase.from("documents").update({ status: "erledigt" }).eq("case_id", caseId).eq("user_id", user.id);
  await createCaseEvent({ caseId, eventType: "case_closed", note: "Fall manuell als erledigt markiert." });

  revalidatePath("/app");
  revalidatePath("/app/cases");
  revalidatePath(`/app/cases/${caseId}`);
}
