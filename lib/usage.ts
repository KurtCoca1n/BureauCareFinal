import { getAccountRoleForUser, isTesterRole } from "@/lib/account-access";
import { createClient } from "@/lib/supabase/server";
import type { AccountRole, UsageEventType } from "@/lib/types";

export const FREE_ANALYSIS_LIMIT = 3;
export const FREE_REPLY_LIMIT = 5;

export type MonthlyUsageSummary = {
  analysisCount: number;
  analysisLimit: number | null;
  replyCount: number;
  replyLimit: number | null;
  uploadCount: number;
  uploadLimit: number | null;
  role: AccountRole;
  isTester: boolean;
};

export function hasReachedAnalysisLimit(summary: MonthlyUsageSummary) {
  if (summary.analysisLimit === null) {
    return false;
  }
  return summary.analysisCount >= summary.analysisLimit;
}

export function hasReachedReplyLimit(summary: MonthlyUsageSummary) {
  if (summary.replyLimit === null) {
    return false;
  }

  return summary.replyCount >= summary.replyLimit;
}

function getMonthStartIso() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).toISOString();
}

export async function recordUsageEvent({
  userId,
  eventType,
  documentId
}: {
  userId: string;
  eventType: UsageEventType;
  documentId?: string | null;
}) {
  const supabase = await createClient();

  await supabase.from("usage_events").insert({
    user_id: userId,
    document_id: documentId ?? null,
    event_type: eventType
  });
}

export async function getMonthlyUsageSummary(userId: string): Promise<MonthlyUsageSummary> {
  const supabase = await createClient();
  const monthStart = getMonthStartIso();
  const role = await getAccountRoleForUser(userId);
  const isTester = isTesterRole(role);

  const [{ data: usageEvents }, { data: documents }] = await Promise.all([
    supabase
      .from("usage_events")
      .select("event_type")
      .eq("user_id", userId)
      .gte("created_at", monthStart),
    supabase.from("documents").select("id").eq("user_id", userId)
  ]);

  const documentIds = documents?.map((document) => document.id) ?? [];

  let fallbackAnalyses = 0;
  let fallbackReplies = 0;

  if (documentIds.length) {
    const [{ data: analyses }, { data: replies }] = await Promise.all([
      supabase.from("document_analyses").select("document_id").in("document_id", documentIds).gte("created_at", monthStart),
      supabase.from("draft_replies").select("document_id").in("document_id", documentIds).gte("created_at", monthStart)
    ]);

    fallbackAnalyses = analyses?.length ?? 0;
    fallbackReplies = replies?.length ?? 0;
  }

  const analysisEvents = usageEvents?.filter((event) => event.event_type === "analysis_generated").length ?? 0;
  const replyEvents = usageEvents?.filter((event) => event.event_type === "reply_generated").length ?? 0;

  return {
    analysisCount: analysisEvents || fallbackAnalyses || 0,
    analysisLimit: isTester ? null : FREE_ANALYSIS_LIMIT,
    replyCount: replyEvents || fallbackReplies || 0,
    replyLimit: isTester ? null : FREE_REPLY_LIMIT,
    uploadCount: documents?.length ?? 0,
    uploadLimit: null,
    role,
    isTester
  };
}
