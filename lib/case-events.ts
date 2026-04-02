import { createClient } from "@/lib/supabase/server";
import type { CaseEventType } from "@/lib/types";

export async function createCaseEvent({
  caseId,
  eventType,
  documentId,
  note
}: {
  caseId: string;
  eventType: CaseEventType;
  documentId?: string | null;
  note?: string | null;
}) {
  const supabase = await createClient();

  await supabase.from("case_events").insert({
    case_id: caseId,
    document_id: documentId ?? null,
    event_type: eventType,
    note: note ?? null
  });
}
