import { createClient } from "@/lib/supabase/server";
import { getProcedureBySlug } from "@/lib/process-details";
import { getProcedureTitle } from "@/lib/processes-ui";
import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type {
  DocumentAnalysisRecord,
  DocumentRecord,
  PersonalDataSuggestion,
  TaskRecord,
  UserPersonalDataRecord,
  WelcomeProfileRecord,
  WelcomeStepDocumentRecord,
  WelcomeStepPreparationRecord,
  WelcomeStepRecord,
  WelcomeStepTaskRecord
} from "@/lib/types";
import { getWelcomeGuidance, getWelcomeGuidanceText } from "@/lib/welcome-guidance";
import { type WelcomeStepKey, isWelcomeStepKey } from "@/lib/welcome";
import { getWelcomeCopy } from "@/lib/welcome-ui";

export type WelcomeReminder = {
  id: string;
  stepKey: WelcomeStepKey;
  kind: "deadline_soon" | "deadline_overdue" | "missing_documents" | "stale_step" | "appointment";
  title: string;
  text: string;
  href: string;
  badgeTone: "warning" | "accent" | "neutral";
};

export type WelcomeNextStep = {
  stepKey: WelcomeStepKey;
  title: string;
  text: string;
  href: string;
  showCreateTask: boolean;
};

export type WelcomeSuggestion = {
  id: string;
  title: string;
  text: string;
  href: string;
  source: "welcome" | "process";
};

export type WelcomeAssistantOverview = {
  nextStep: WelcomeNextStep | null;
  reminders: WelcomeReminder[];
  suggestions: WelcomeSuggestion[];
  openCount: number;
};

type StepContext = {
  step: WelcomeStepRecord & { step_key: WelcomeStepKey };
  documents: DocumentRecord[];
  analyses: Map<string, DocumentAnalysisRecord | null>;
  tasks: TaskRecord[];
  preparation: WelcomeStepPreparationRecord | null;
};

const COMPLETION_KEYWORDS: Record<WelcomeStepKey, string[]> = {
  city_registration: ["meldebescheinigung", "anmeldung bestaetigung", "anmeldebestatigung"],
  tax_id: ["steuer-id", "steuer id", "identifikationsnummer", "tax id"],
  health_insurance: ["mitgliedsbescheinigung", "versicherung", "health insurance", "insurance confirmation"],
  bank_account: ["iban", "kontoeroffnung", "kontoeroeffnung", "bank account", "kontobestaetigung"],
  residence_permit: ["aufenthaltstitel", "residence permit", "elektronischer aufenthaltstitel"],
  work_permit: ["arbeitserlaubnis", "work permit", "beschaftigung erlaubt", "beschaeftigung erlaubt"],
  broadcast_fee: ["beitragsnummer", "rundfunkbeitrag", "broadcast fee"],
  child_benefit: ["kindergeld", "familienkasse", "child benefit", "bewilligung"],
  university_enrollment: ["immatrikulationsbescheinigung", "enrollment", "matrikel", "studentenausweis"]
};

function normalizeText(value: string | null | undefined) {
  return (value ?? "").trim().toLowerCase();
}

function hasCompletionDocument(stepKey: WelcomeStepKey, documents: DocumentRecord[], analyses: Map<string, DocumentAnalysisRecord | null>) {
  const keywords = COMPLETION_KEYWORDS[stepKey];
  return documents.some((document) => {
    const analysis = analyses.get(document.id);
    const haystack = [document.original_filename, document.subject, document.sender, analysis?.summary_simple, analysis?.required_action]
      .map((part) => normalizeText(part))
      .join(" ");

    return keywords.some((keyword) => haystack.includes(keyword));
  });
}

function daysBetween(fromIso: string | null | undefined, to = new Date()) {
  if (!fromIso) return null;
  const value = new Date(fromIso);
  if (Number.isNaN(value.getTime())) return null;
  return Math.floor((to.getTime() - value.getTime()) / (1000 * 60 * 60 * 24));
}

export async function syncDerivedWelcomeStatuses(input: {
  steps: WelcomeStepRecord[];
  documentLinks: WelcomeStepDocumentRecord[];
  taskLinks: WelcomeStepTaskRecord[];
  documents: DocumentRecord[];
  analyses: Map<string, DocumentAnalysisRecord | null>;
  tasks: TaskRecord[];
  preparations: WelcomeStepPreparationRecord[];
}) {
  const userStepIds = input.steps.map((step) => step.id);
  if (!userStepIds.length) {
    return;
  }

  const documentsById = new Map(input.documents.map((document) => [document.id, document]));
  const tasksById = new Map(input.tasks.map((task) => [task.id, task]));
  const preparationByStep = new Map(input.preparations.map((item) => [item.step_key, item]));
  const updates: Array<{ id: string; status: WelcomeStepRecord["status"] }> = [];

  for (const step of input.steps) {
    if (!isWelcomeStepKey(step.step_key) || step.status === "done") {
      continue;
    }

    const stepDocuments = input.documentLinks
      .filter((link) => link.step_key === step.step_key)
      .map((link) => documentsById.get(link.document_id))
      .filter((document): document is DocumentRecord => Boolean(document));
    const stepTasks = input.taskLinks
      .filter((link) => link.step_key === step.step_key)
      .map((link) => tasksById.get(link.task_id))
      .filter((task): task is TaskRecord => Boolean(task));
    const hasPreparation = Boolean(preparationByStep.get(step.step_key));
    const hasDoneTask = stepTasks.some((task) => task.status === "done");
    const completionDocument = hasCompletionDocument(step.step_key, stepDocuments, input.analyses);

    if (completionDocument || (stepTasks.length > 0 && stepTasks.every((task) => task.status === "done") && hasDoneTask)) {
      updates.push({ id: step.id, status: "done" });
      continue;
    }

    if (step.status === "open" && (hasPreparation || stepDocuments.length > 0 || stepTasks.length > 0)) {
      updates.push({ id: step.id, status: "in_progress" });
    }
  }

  if (!updates.length) {
    return input.steps;
  }

  const supabase = await createClient();
  for (const update of updates) {
    await supabase
      .from("welcome_steps")
      .update({ status: update.status, updated_at: new Date().toISOString() })
      .eq("id", update.id);
  }

  return input.steps.map((step) => {
    const changed = updates.find((update) => update.id === step.id);
    return changed ? { ...step, status: changed.status, updated_at: new Date().toISOString() } : step;
  });
}

function buildStepContexts(input: {
  steps: WelcomeStepRecord[];
  documentLinks: WelcomeStepDocumentRecord[];
  taskLinks: WelcomeStepTaskRecord[];
  documents: DocumentRecord[];
  analyses: Map<string, DocumentAnalysisRecord | null>;
  tasks: TaskRecord[];
  preparations: WelcomeStepPreparationRecord[];
}) {
  const documentsById = new Map(input.documents.map((document) => [document.id, document]));
  const tasksById = new Map(input.tasks.map((task) => [task.id, task]));
  const preparationByStep = new Map(input.preparations.map((item) => [item.step_key, item]));

  return input.steps
    .filter((step): step is WelcomeStepRecord & { step_key: WelcomeStepKey } => isWelcomeStepKey(step.step_key))
    .map((step) => ({
      step,
      documents: input.documentLinks
        .filter((link) => link.step_key === step.step_key)
        .map((link) => documentsById.get(link.document_id))
        .filter((document): document is DocumentRecord => Boolean(document)),
      analyses: input.analyses,
      tasks: input.taskLinks
        .filter((link) => link.step_key === step.step_key)
        .map((link) => tasksById.get(link.task_id))
        .filter((task): task is TaskRecord => Boolean(task)),
      preparation: preparationByStep.get(step.step_key) ?? null
    })) satisfies StepContext[];
}

function buildReminderList(contexts: StepContext[], locale: SupportedLanguage) {
  const copy = getWelcomeCopy(locale);
  const reminders: WelcomeReminder[] = [];
  const priorityMap: Record<WelcomeReminder["kind"], number> = {
    deadline_overdue: 4,
    deadline_soon: 3,
    appointment: 2,
    missing_documents: 1,
    stale_step: 0
  };

  for (const context of contexts) {
    if (context.step.status === "done") continue;

    const stepTitle = copy.steps[context.step.step_key].title;
    const overdueTask = context.tasks.find((task) => task.status !== "done" && task.due_date && daysBetween(task.due_date) !== null && daysBetween(task.due_date)! > 0);
    const soonTask = context.tasks.find((task) => {
      if (task.status === "done" || !task.due_date) return false;
      const diff = daysBetween(task.due_date);
      return diff !== null && diff >= -5 && diff <= 0;
    });
    const age = daysBetween(context.step.updated_at);
    const guidance = getWelcomeGuidance(context.step.step_key);

    if (overdueTask) {
      reminders.push({
        id: `${context.step.id}-overdue`,
        stepKey: context.step.step_key,
        kind: "deadline_overdue",
        title: stepTitle,
        text: overdueTask.title,
        href: `/app/welcome/${context.step.step_key}`,
        badgeTone: "warning"
      });
      continue;
    }

    if (soonTask) {
      reminders.push({
        id: `${context.step.id}-soon`,
        stepKey: context.step.step_key,
        kind: "deadline_soon",
        title: stepTitle,
        text: soonTask.title,
        href: `/app/welcome/${context.step.step_key}`,
        badgeTone: "accent"
      });
      continue;
    }

    if (!context.documents.length && (context.preparation || context.tasks.length > 0)) {
      reminders.push({
        id: `${context.step.id}-documents`,
        stepKey: context.step.step_key,
        kind: "missing_documents",
        title: stepTitle,
        text: getWelcomeGuidanceText(guidance.nextStep, locale),
        href: `/app/welcome/${context.step.step_key}`,
        badgeTone: "neutral"
      });
      continue;
    }

    if (!context.tasks.length && guidance.appointmentMode === "usually_required") {
      reminders.push({
        id: `${context.step.id}-appointment`,
        stepKey: context.step.step_key,
        kind: "appointment",
        title: stepTitle,
        text: getWelcomeGuidanceText(guidance.nextStep, locale),
        href: `/app/welcome/${context.step.step_key}`,
        badgeTone: "accent"
      });
      continue;
    }

    if (age !== null && age >= 30) {
      reminders.push({
        id: `${context.step.id}-stale`,
        stepKey: context.step.step_key,
        kind: "stale_step",
        title: stepTitle,
        text: getWelcomeGuidanceText(guidance.nextStep, locale),
        href: `/app/welcome/${context.step.step_key}`,
        badgeTone: "neutral"
      });
    }
  }

  return reminders.sort((left, right) => priorityMap[right.kind] - priorityMap[left.kind]).slice(0, 3);
}

function pickNextStep(contexts: StepContext[], reminders: WelcomeReminder[], locale: SupportedLanguage): WelcomeNextStep | null {
  const copy = getWelcomeCopy(locale);
  const reminder = reminders[0];
  if (reminder) {
    const relatedContext = contexts.find((context) => context.step.step_key === reminder.stepKey);
    return {
      stepKey: reminder.stepKey,
      title: copy.steps[reminder.stepKey].title,
      text: reminder.text,
      href: reminder.href,
      showCreateTask: Boolean(relatedContext && relatedContext.tasks.length === 0 && relatedContext.step.status !== "done")
    };
  }

  const ordered = [...contexts].sort((left, right) => left.step.sort_order - right.step.sort_order);
  const candidate =
    ordered.find((context) => context.step.status === "in_progress") ?? ordered.find((context) => context.step.status === "open") ?? null;

  if (!candidate) {
    return null;
  }

  const guidance = getWelcomeGuidance(candidate.step.step_key);
  return {
    stepKey: candidate.step.step_key,
    title: copy.steps[candidate.step.step_key].title,
    text: getWelcomeGuidanceText(guidance.nextStep, locale),
    href: `/app/welcome/${candidate.step.step_key}`,
    showCreateTask: candidate.tasks.length === 0
  };
}

function buildWelcomeSuggestions(input: {
  locale: SupportedLanguage;
  welcomeProfile: WelcomeProfileRecord | null;
  personalData: UserPersonalDataRecord | null;
  personalSuggestions: PersonalDataSuggestion[];
  steps: WelcomeStepRecord[];
}) {
  const suggestions: WelcomeSuggestion[] = input.personalSuggestions.map((suggestion) => ({
    id: suggestion.id,
    title: suggestion.title,
    text: suggestion.reason,
    href: `/app/processes/${suggestion.procedure_id}`,
    source: "process"
  }));

  const existingIds = new Set(suggestions.map((item) => item.id));
  const push = (id: string, procedureId: string, text: string) => {
    if (existingIds.has(id)) return;
    const procedure = getProcedureBySlug(procedureId);
    if (!procedure) return;
    existingIds.add(id);
    suggestions.push({
      id,
      title: getProcedureTitle(procedure, input.locale),
      text,
      href: `/app/processes/${procedureId}`,
      source: "welcome"
    });
  };

  if (input.welcomeProfile?.reason === "study") {
    push(
      "welcome-bafoeg",
      "bafoeg-antrag",
      input.locale === "de"
        ? "Wenn du in Deutschland studierst, koennte BAfoeG oder eine aehnliche Studienhilfe fuer dich interessant sein."
        : input.locale === "zh"
          ? "如果你在德国读书，BAföG 或类似的学习资助可能值得你了解一下。"
          : "If you study in Germany, student aid such as BAfoeG could be worth checking."
    );
  }

  if (input.welcomeProfile?.has_children) {
    push(
      "welcome-kindergeld",
      "kindergeld",
      input.locale === "de"
        ? "Mit Kindern in deinem Haushalt koennte Kindergeld oder ein aehnlicher Familienvorgang wichtig fuer dich sein."
        : input.locale === "zh"
          ? "如果你家里有孩子，儿童金或类似的家庭支持可能和你有关。"
          : "If children are part of your household, child benefit or a similar family process could matter for you."
    );
  }

  if (input.welcomeProfile?.housing_status !== "no" && input.welcomeProfile?.registration_status === "yes") {
    push(
      "welcome-wohngeld",
      "wohngeld",
      input.locale === "de"
        ? "Sobald deine Wohnung und Anmeldung geklaert sind, koennte es sich lohnen, Wohngeld zu pruefen."
        : input.locale === "zh"
          ? "当你的住址和登记已经稳定后，可能值得看看住房补贴是否和你有关。"
          : "Once your housing and registration are settled, it could be worth checking housing benefit."
    );
  }

  return suggestions.slice(0, 3);
}

export function buildWelcomeAssistantOverview(input: {
  locale: string | null | undefined;
  welcomeProfile: WelcomeProfileRecord | null;
  steps: WelcomeStepRecord[];
  documentLinks: WelcomeStepDocumentRecord[];
  taskLinks: WelcomeStepTaskRecord[];
  documents: DocumentRecord[];
  analyses: Map<string, DocumentAnalysisRecord | null>;
  tasks: TaskRecord[];
  preparations: WelcomeStepPreparationRecord[];
  personalSuggestions: PersonalDataSuggestion[];
  personalData: UserPersonalDataRecord | null;
}): WelcomeAssistantOverview {
  const locale = normalizePreferredLanguage(input.locale);
  const contexts = buildStepContexts(input);
  const reminders = buildReminderList(contexts, locale);
  const nextStep = pickNextStep(contexts, reminders, locale);
  const suggestions = buildWelcomeSuggestions({
    locale,
    welcomeProfile: input.welcomeProfile,
    personalData: input.personalData,
    personalSuggestions: input.personalSuggestions,
    steps: input.steps
  });

  return {
    nextStep,
    reminders,
    suggestions,
    openCount: input.steps.filter((step) => step.status !== "done").length
  };
}
