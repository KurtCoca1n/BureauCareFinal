import { createCaseEvent } from "@/lib/case-events";
import { createClient } from "@/lib/supabase/server";
import type { CaseRecord, ProcessSessionRecord } from "@/lib/types";

export async function ensureProcessCase(options: {
  session: ProcessSessionRecord;
  title: string;
  organization: string | null;
  workflowStatusLabel: string;
  nextSteps: string[];
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  if (options.session.case_id) {
    const { data: existingCase } = await supabase
      .from("cases")
      .select("*")
      .eq("id", options.session.case_id)
      .eq("user_id", user.id)
      .maybeSingle();

    return (existingCase as CaseRecord | null) ?? null;
  }

  const { data: createdCase } = await supabase
    .from("cases")
    .insert({
      user_id: user.id,
      title: options.title,
      organization: options.organization,
      status: "open"
    })
    .select("*")
    .maybeSingle();

  const caseRecord = (createdCase as CaseRecord | null) ?? null;
  if (!caseRecord) {
    return null;
  }

  await createCaseEvent({
    caseId: caseRecord.id,
    eventType: "status_changed",
    note: `Prozess gespeichert. Status: ${options.workflowStatusLabel}.`
  });

  await createCaseEvent({
    caseId: caseRecord.id,
    eventType: "task_created",
    note: `Nächste Schritte: ${options.nextSteps.join(" | ")}`
  });

  await supabase
    .from("process_sessions")
    .update({
      case_id: caseRecord.id,
      answers: {
        ...(options.session.answers ?? {}),
        workflow_status: options.workflowStatusLabel
      },
      updated_at: new Date().toISOString()
    })
    .eq("id", options.session.id)
    .eq("user_id", user.id);

  return caseRecord;
}
