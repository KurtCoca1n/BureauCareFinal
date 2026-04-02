import { createCaseEvent } from "@/lib/case-events";
import { createClient } from "@/lib/supabase/server";
import type { DocumentAnalysisRecord, DocumentRecord } from "@/lib/types";

function buildTaskTitle(
  analysis: Pick<DocumentAnalysisRecord, "sender" | "subject" | "next_steps" | "action_mode" | "action_location_name">
) {
  const sender = analysis.sender?.trim();
  const subject = analysis.subject?.trim();
  const firstStep = analysis.next_steps?.[0]?.toLowerCase() ?? "";
  const locationName = analysis.action_location_name?.trim();

  if (analysis.action_mode === "vor_ort" && locationName) {
    return `Vor Ort bei ${locationName} erscheinen`;
  }

  if (firstStep.includes("unterlag")) {
    return `Unterlagen an ${sender ?? "den Absender"} senden`;
  }

  if (firstStep.includes("antwort") || firstStep.includes("reag")) {
    return `Auf Schreiben von ${sender ?? "dem Absender"} antworten`;
  }

  if (subject) {
    return `Frist: ${subject}`;
  }

  return `Auf Schreiben von ${sender ?? "dem Absender"} reagieren`;
}

function getImportanceReason(
  analysis: Pick<DocumentAnalysisRecord, "deadline_date" | "risks_if_ignored" | "urgency">
) {
  if (analysis.risks_if_ignored) {
    return analysis.risks_if_ignored;
  }

  if (analysis.deadline_date) {
    return `Es gibt eine erkennbare Frist bis zum ${new Date(analysis.deadline_date).toLocaleDateString("de-DE")}.`;
  }

  if (analysis.urgency === "high") {
    return "Das Schreiben wirkt dringend und sollte zeitnah erledigt werden.";
  }

  return null;
}

export async function upsertTaskFromAnalysis({
  document,
  analysis
}: {
  document: DocumentRecord;
  analysis: Pick<
    DocumentAnalysisRecord,
    | "sender"
    | "subject"
    | "deadline_date"
    | "is_action_required"
    | "next_steps"
    | "risks_if_ignored"
    | "action_location_name"
    | "action_location_address"
    | "action_url"
    | "action_mode"
    | "important_references"
    | "action_mode"
    | "action_location_name"
    | "urgency"
  >;
}) {
  const supabase = await createClient();

  if (!analysis.is_action_required || !analysis.deadline_date) {
    return;
  }

  const taskTitle = buildTaskTitle(analysis);
  const actionSummary = analysis.next_steps?.[0] ?? analysis.important_references?.[0]?.value ?? null;
  const importanceReason = getImportanceReason(analysis);

  const { data: existingTask } = await supabase
    .from("tasks")
    .select("id, status")
    .eq("document_id", document.id)
    .maybeSingle();

  const payload = {
    title: taskTitle,
    due_date: analysis.deadline_date,
    document_sender: analysis.sender,
    document_subject: analysis.subject,
    action_summary: actionSummary,
    importance_reason: importanceReason,
    action_location_name: analysis.action_location_name,
    action_location_address: analysis.action_location_address,
    action_url: analysis.action_url,
    action_mode: analysis.action_mode
  };

  if (existingTask) {
    await supabase
      .from("tasks")
      .update({
        ...payload,
        status: existingTask.status === "done" ? "done" : "open"
      })
      .eq("id", existingTask.id);

    return;
  }

  await supabase.from("tasks").insert({
    user_id: document.user_id,
    document_id: document.id,
    status: "open",
    ...payload
  });

  if (document.case_id) {
    await createCaseEvent({
      caseId: document.case_id,
      documentId: document.id,
      eventType: "task_created",
      note: taskTitle
    });
  }
}
