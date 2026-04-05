import { cache } from "react";

import { ensureProfile } from "@/lib/profile";
import { buildPersonalDataSuggestions } from "@/lib/personal-data-suggestions";
import { groupTasksByReminder } from "@/lib/reminders";
import { createClient } from "@/lib/supabase/server";
import { normalizeUserSettings } from "@/lib/user-settings";
import type {
  CaseEventRecord,
  CaseRecord,
  DocumentAnalysisRecord,
  DocumentRecord,
  DraftReplyRecord,
  ContractQuestionDraftRecord,
  GoalRecord,
  PersonalDataSuggestion,
  ProcessSessionRecord,
  WelcomeProfileRecord,
  WelcomeStepPreparationRecord,
  WelcomeStepCaseRecord,
  WelcomeStepDocumentRecord,
  WelcomeStepRecord,
  WelcomeStepTaskRecord,
  UserSettingsRecord,
  UserPersonalDataRecord,
  TaskRecord
} from "@/lib/types";
import { getMonthlyUsageSummary } from "@/lib/usage";

export const getCurrentUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
});

export const getProfile = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return ensureProfile(user);
});

export const getRecentDocuments = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("documents").select("*").order("created_at", { ascending: false }).limit(5);
  return (data as DocumentRecord[] | null) ?? [];
});

export async function getAllTasks() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("tasks")
    .select("*")
    .order("status", { ascending: true })
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false });
  return (data as TaskRecord[] | null) ?? [];
}

export const getTaskReminderBuckets = cache(async () => {
  const tasks = await getAllTasks();
  return groupTasksByReminder(tasks);
});

export async function getDocumentById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("documents").select("*").eq("id", id).maybeSingle();
  return (data as DocumentRecord | null) ?? null;
}

export async function getDocumentAnalysisByDocumentId(documentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("document_analyses")
    .select("*")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return (data as DocumentAnalysisRecord | null) ?? null;
}

export async function getDraftRepliesByDocumentId(documentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("draft_replies")
    .select("*")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false });
  return (data as DraftReplyRecord[] | null) ?? [];
}

export async function getContractQuestionDraftsByDocumentId(documentId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contract_question_drafts")
    .select("*")
    .eq("document_id", documentId)
    .order("created_at", { ascending: false });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("contract_question_drafts")) {
      return [];
    }
    console.error("Loading contract question drafts failed", { documentId, error });
    return [];
  }

  return (data as ContractQuestionDraftRecord[] | null) ?? [];
}

export const getUsageSummaryForCurrentUser = cache(async () => {
  const user = await getCurrentUser();
  if (!user) return null;
  return getMonthlyUsageSummary(user.id);
});

export type CaseOverview = CaseRecord & {
  openTasksCount: number;
  latestActivityAt: string;
  latestDocumentSubject: string | null;
};

export async function getAllCases() {
  const supabase = await createClient();
  const [{ data: cases }, { data: tasks }, { data: documents }, { data: events }] = await Promise.all([
    supabase.from("cases").select("*").order("updated_at", { ascending: false }),
    supabase.from("tasks").select("*"),
    supabase.from("documents").select("*"),
    supabase.from("case_events").select("*")
  ]);

  const caseRows = (cases as CaseRecord[] | null) ?? [];
  const taskRows = (tasks as TaskRecord[] | null) ?? [];
  const documentRows = (documents as DocumentRecord[] | null) ?? [];
  const eventRows = (events as CaseEventRecord[] | null) ?? [];

  return caseRows.map((caseRecord) => {
    const caseTasks = taskRows.filter((task) => task.document_id && documentRows.some((doc) => doc.id === task.document_id && doc.case_id === caseRecord.id));
    const caseDocuments = documentRows.filter((document) => document.case_id === caseRecord.id);
    const latestDocument = caseDocuments.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))[0];
    const latestEvent = eventRows
      .filter((event) => event.case_id === caseRecord.id)
      .sort((a, b) => +new Date(b.event_date) - +new Date(a.event_date))[0];

    return {
      ...caseRecord,
      openTasksCount: caseTasks.filter((task) => task.status !== "done").length,
      latestActivityAt: latestEvent?.event_date ?? latestDocument?.created_at ?? caseRecord.updated_at,
      latestDocumentSubject: latestDocument?.subject ?? null
    } satisfies CaseOverview;
  });
}

export async function getCaseById(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("cases").select("*").eq("id", caseId).maybeSingle();
  return (data as CaseRecord | null) ?? null;
}

export async function getCaseEvents(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("case_events").select("*").eq("case_id", caseId).order("event_date", { ascending: false });
  return (data as CaseEventRecord[] | null) ?? [];
}

export async function getDocumentsByCaseId(caseId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("documents").select("*").eq("case_id", caseId).order("created_at", { ascending: false });
  return (data as DocumentRecord[] | null) ?? [];
}

export async function getDocumentsByIds(documentIds: string[]) {
  if (!documentIds.length) {
    return [];
  }

  const supabase = await createClient();
  const { data } = await supabase.from("documents").select("*").in("id", documentIds).order("created_at", { ascending: false });
  return (data as DocumentRecord[] | null) ?? [];
}

export async function getTasksByCaseId(caseId: string) {
  const documents = await getDocumentsByCaseId(caseId);
  const documentIds = documents.map((document) => document.id);
  if (!documentIds.length) return [];
  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select("*").in("document_id", documentIds).order("due_date", { ascending: true, nullsFirst: false });
  return (data as TaskRecord[] | null) ?? [];
}

export async function getTasksByIds(taskIds: string[]) {
  if (!taskIds.length) {
    return [];
  }

  const supabase = await createClient();
  const { data } = await supabase.from("tasks").select("*").in("id", taskIds).order("created_at", { ascending: false });
  return (data as TaskRecord[] | null) ?? [];
}

export const getCasesWithActionNeeded = cache(async () => {
  const cases = await getAllCases();
  return cases.filter((caseRecord) => caseRecord.status !== "done" || caseRecord.openTasksCount > 0).slice(0, 4);
});

export async function getGoals() {
  const supabase = await createClient();
  const { data } = await supabase.from("goals").select("*").order("updated_at", { ascending: false });
  return (data as GoalRecord[] | null) ?? [];
}

export async function getGoalById(goalId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("goals").select("*").eq("id", goalId).maybeSingle();
  return (data as GoalRecord | null) ?? null;
}

export async function getUserPersonalData() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("user_personal_data").select("*").eq("user_id", user.id).maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("user_personal_data")) {
      return null;
    }

    console.error("Loading user personal data failed", { userId: user.id, error });
    return null;
  }

  return (data as UserPersonalDataRecord | null) ?? null;
}

export async function getPersonalDataSuggestions(locale: string | null | undefined) {
  const personalData = await getUserPersonalData();
  return buildPersonalDataSuggestions(personalData, locale) as PersonalDataSuggestion[];
}

export async function getUserSettings() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("user_settings")) {
      return normalizeUserSettings(null, user.id);
    }

    console.error("Loading user settings failed", { userId: user.id, error });
    return normalizeUserSettings(null, user.id);
  }

  return normalizeUserSettings((data as UserSettingsRecord | null) ?? null, user.id);
}

export async function getWelcomeProfile() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("welcome_profiles").select("*").eq("user_id", user.id).maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_profiles")) {
      return null;
    }
    console.error("Loading welcome profile failed", { userId: user.id, error });
    return null;
  }

  return (data as WelcomeProfileRecord | null) ?? null;
}

export async function getWelcomeSteps() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("welcome_steps").select("*").eq("user_id", user.id).order("sort_order", { ascending: true });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_steps")) {
      return [];
    }
    console.error("Loading welcome steps failed", { userId: user.id, error });
    return [];
  }

  return (data as WelcomeStepRecord[] | null) ?? [];
}

export async function getWelcomeStepByKey(stepKey: string) {
  const user = await getCurrentUser();
  if (!user || !stepKey) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("welcome_steps")
    .select("*")
    .eq("user_id", user.id)
    .eq("step_key", stepKey)
    .maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_steps")) {
      return null;
    }
    console.error("Loading welcome step failed", { userId: user.id, stepKey, error });
    return null;
  }

  return (data as WelcomeStepRecord | null) ?? null;
}

export async function getWelcomeStepPreparationByKey(stepKey: string) {
  const user = await getCurrentUser();
  if (!user || !stepKey) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("welcome_step_preparations")
    .select("*")
    .eq("user_id", user.id)
    .eq("step_key", stepKey)
    .maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_step_preparations")) {
      return null;
    }
    console.error("Loading welcome step preparation failed", { userId: user.id, stepKey, error });
    return null;
  }

  return (data as WelcomeStepPreparationRecord | null) ?? null;
}

export async function getAllWelcomeStepPreparations() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("welcome_step_preparations")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", { ascending: false });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_step_preparations")) {
      return [];
    }
    console.error("Loading welcome step preparations failed", { userId: user.id, error });
    return [];
  }

  return (data as WelcomeStepPreparationRecord[] | null) ?? [];
}

export async function getWelcomeStepCaseByKey(stepKey: string) {
  const user = await getCurrentUser();
  if (!user || !stepKey) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase.from("welcome_step_cases").select("*").eq("user_id", user.id).eq("step_key", stepKey).maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_step_cases")) {
      return null;
    }
    console.error("Loading welcome step case failed", { userId: user.id, stepKey, error });
    return null;
  }

  return (data as WelcomeStepCaseRecord | null) ?? null;
}

export async function getWelcomeStepDocumentLinks(stepKey: string) {
  const user = await getCurrentUser();
  if (!user || !stepKey) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("welcome_step_documents")
    .select("*")
    .eq("user_id", user.id)
    .eq("step_key", stepKey)
    .order("created_at", { ascending: false });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_step_documents")) {
      return [];
    }
    console.error("Loading welcome step document links failed", { userId: user.id, stepKey, error });
    return [];
  }

  return (data as WelcomeStepDocumentRecord[] | null) ?? [];
}

export async function getAllWelcomeStepDocumentLinks() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("welcome_step_documents")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_step_documents")) {
      return [];
    }
    console.error("Loading welcome step document links failed", { userId: user.id, error });
    return [];
  }

  return (data as WelcomeStepDocumentRecord[] | null) ?? [];
}

export async function getWelcomeStepTaskLinks(stepKey: string) {
  const user = await getCurrentUser();
  if (!user || !stepKey) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("welcome_step_tasks")
    .select("*")
    .eq("user_id", user.id)
    .eq("step_key", stepKey)
    .order("created_at", { ascending: false });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_step_tasks")) {
      return [];
    }
    console.error("Loading welcome step task links failed", { userId: user.id, stepKey, error });
    return [];
  }

  return (data as WelcomeStepTaskRecord[] | null) ?? [];
}

export async function getAllWelcomeStepTaskLinks() {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("welcome_step_tasks")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_step_tasks")) {
      return [];
    }
    console.error("Loading welcome step task links failed", { userId: user.id, error });
    return [];
  }

  return (data as WelcomeStepTaskRecord[] | null) ?? [];
}

export async function getProcessSessionBySlug(processSlug: string) {
  const user = await getCurrentUser();
  if (!user || !processSlug) {
    return null;
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("process_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("process_slug", processSlug)
    .maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("process_sessions")) {
      return null;
    }
  }

  return (data as ProcessSessionRecord | null) ?? null;
}
