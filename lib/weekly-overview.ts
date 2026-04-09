import type { CaseOverview } from "@/lib/queries";
import {
  calendarDaysUntilDue,
  computeTrafficLightForAnalysisRow,
  computeTrafficLightFromDeadline,
  type TrafficLightLevel
} from "@/lib/traffic-light-priority";
import type { DocumentAnalysisRecord, DocumentRecord, DraftReplyRecord, TaskRecord } from "@/lib/types";
import { getOptionalTaskTip } from "@/lib/task-tips";

export { calendarDaysUntilDue } from "@/lib/traffic-light-priority";

export type WeeklyOverviewItemType = "task" | "deadline" | "appointment";

export type WeeklyOverviewPriority = TrafficLightLevel;

export type WeeklyOverviewItem = {
  id: string;
  title: string;
  type: WeeklyOverviewItemType;
  priority: WeeklyOverviewPriority;
  dueDate?: string;
  completed: boolean;
  shortDescription?: string;
  tip?: string;
  href?: string;
  taskId?: string;
};

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function mondayOfWeek(reference: Date): Date {
  const d = new Date(reference);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(12, 0, 0, 0);
  return d;
}

function endOfWeekSunday(monday: Date): Date {
  return addDays(monday, 6);
}

function formatLocalYmd(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isDateInCurrentWeek(isoDate: string, reference: Date): boolean {
  const mon = mondayOfWeek(reference);
  const sun = endOfWeekSunday(mon);
  const t = new Date(`${isoDate}T12:00:00`).getTime();
  return t >= mon.getTime() && t <= sun.getTime() + 86400000;
}

function shouldIncludeTaskInWeeklyView(task: TaskRecord, reference: Date): boolean {
  if (task.status !== "done") return true;
  if (task.due_date && isDateInCurrentWeek(task.due_date, reference)) return true;
  const createdDay = formatLocalYmd(new Date(task.created_at));
  if (isDateInCurrentWeek(createdDay, reference)) return true;
  return false;
}

function truncate(text: string | null | undefined, max: number): string {
  const t = String(text ?? "").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1)}…`;
}

function priorityFromTask(task: TaskRecord, reference: Date): WeeklyOverviewPriority {
  if (task.due_date) {
    return computeTrafficLightFromDeadline(task.due_date, reference);
  }
  return "medium";
}

function taskToWeeklyItem(task: TaskRecord, reference: Date, lang: "de" | "en"): WeeklyOverviewItem {
  const completed = task.status === "done";
  const type: WeeklyOverviewItemType =
    task.action_mode === "vor_ort" && task.due_date ? "appointment" : task.due_date ? "deadline" : "task";
  const shortParts = [task.action_summary, task.document_subject].filter(Boolean);
  const shortDescription = shortParts[0] ? truncate(String(shortParts[0]), 140) : undefined;
  const href = task.document_id ? `/app/documents/${task.document_id}` : undefined;

  return {
    id: `task:${task.id}`,
    title: task.title,
    type,
    priority: priorityFromTask(task, reference),
    dueDate: task.due_date ?? undefined,
    completed,
    shortDescription,
    tip: getOptionalTaskTip(task, lang) ?? undefined,
    taskId: task.id,
    href
  };
}

function caseHasOpenTask(caseId: string, tasks: TaskRecord[], documents: DocumentRecord[]): boolean {
  const docIds = new Set(documents.filter((d) => d.case_id === caseId).map((d) => d.id));
  return tasks.some((t) => t.document_id && docIds.has(t.document_id) && t.status !== "done");
}

export type BuildWeeklyOverviewInput = {
  tasks: TaskRecord[];
  cases: CaseOverview[];
  documents: DocumentRecord[];
  analysesByDocumentId: Map<string, DocumentAnalysisRecord>;
  draftsByDocumentId: Map<string, DraftReplyRecord>;
  lang: "de" | "en";
  reference?: Date;
};

/** Baut die Liste nur aus Nutzerdaten (Tasks, Analysen, Entwürge, Fälle, ausstehende Uploads). */
export function buildWeeklyOverviewItems(input: BuildWeeklyOverviewInput): WeeklyOverviewItem[] {
  const reference = input.reference ?? new Date();
  const { tasks, cases, documents, analysesByDocumentId, draftsByDocumentId, lang } = input;
  const items: WeeklyOverviewItem[] = [];

  const taskDocIds = new Set<string>();
  for (const t of tasks) {
    if (t.document_id) taskDocIds.add(t.document_id);
  }

  for (const task of tasks) {
    if (!shouldIncludeTaskInWeeklyView(task, reference)) continue;
    items.push(taskToWeeklyItem(task, reference, lang));
  }

  for (const doc of documents) {
    if (doc.status === "erledigt" || doc.status === "gesendet") continue;
    if (taskDocIds.has(doc.id)) continue;

    const analysis = analysesByDocumentId.get(doc.id);
    if (analysis?.deadline_date) {
      const due = analysis.deadline_date;
      const priority = computeTrafficLightForAnalysisRow(doc, analysis, reference);
      const title = lang === "en" ? "Meet the deadline" : "Frist beachten";
      const subjectHint = analysis.subject?.trim() || doc.subject?.trim();
      const shortDescription =
        lang === "en"
          ? subjectHint
            ? truncate(`Document: ${subjectHint}`, 120)
            : truncate(analysis.summary_simple_short ?? analysis.summary_simple ?? "", 120)
          : subjectHint
            ? truncate(`Schreiben: ${subjectHint}`, 120)
            : truncate(analysis.summary_simple_short ?? analysis.summary_simple ?? "", 120);

      items.push({
        id: `analysis-deadline:${doc.id}`,
        title,
        type: "deadline",
        priority,
        dueDate: due,
        completed: false,
        shortDescription: shortDescription || undefined,
        href: `/app/documents/${doc.id}`
      });
    }
  }

  for (const doc of documents) {
    if (doc.status === "gesendet" || doc.status === "erledigt") continue;
    if (taskDocIds.has(doc.id)) continue;
    const draft = draftsByDocumentId.get(doc.id);
    if (!draft) continue;

    const sender = doc.sender?.trim();
    const title =
      lang === "en"
        ? sender
          ? `Send reply to ${sender}`
          : "Review & send reply"
        : sender
          ? `Antwort an ${sender} senden`
          : "Antwort senden";

    items.push({
      id: `draft:${doc.id}`,
      title,
      type: "task",
      priority: "medium",
      completed: false,
      shortDescription:
        lang === "en" ? "Generated reply — review before sending." : "Generierte Antwort — vor dem Versand prüfen.",
      tip:
        lang === "en"
          ? "Tip: You can send this reply by email from the document page."
          : "Tipp: Diese Antwort kannst du auf der Dokumentseite direkt per E-Mail senden.",
      href: `/app/documents/${doc.id}/reply`
    });
  }

  for (const caseItem of cases) {
    if (caseItem.status === "done") continue;
    if (caseItem.openTasksCount > 0) continue;
    if (caseHasOpenTask(caseItem.id, tasks, documents)) continue;
    const docsInCase = documents.filter((d) => d.case_id === caseItem.id);
    if (!docsInCase.length) continue;

    items.push({
      id: `case:${caseItem.id}`,
      title:
        lang === "en"
          ? `Continue case: ${truncate(caseItem.title, 80)}`
          : `Fall bearbeiten: ${truncate(caseItem.title, 80)}`,
      type: "task",
      priority: "medium",
      completed: false,
      shortDescription:
        lang === "en"
          ? `${docsInCase.length} document${docsInCase.length === 1 ? "" : "s"} in this case.`
          : `${docsInCase.length} Dokument${docsInCase.length === 1 ? "" : "e"} in diesem Fall.`,
      href: `/app/cases/${caseItem.id}`
    });
  }

  for (const doc of documents) {
    if (doc.status != null && doc.status !== "neu") continue;
    if (analysesByDocumentId.has(doc.id)) continue;
    if (taskDocIds.has(doc.id)) continue;

    items.push({
      id: `pending-doc:${doc.id}`,
      title: lang === "en" ? "Review document" : "Dokument prüfen",
      type: "task",
      priority: "medium",
      completed: false,
      shortDescription: truncate(doc.original_filename ?? (lang === "en" ? "Uploaded file" : "Hochgeladene Datei"), 100),
      href: `/app/documents/${doc.id}`
    });
  }

  return sortWeeklyOverviewItems(items).slice(0, 40);
}

const priorityRank: Record<WeeklyOverviewPriority, number> = {
  high: 0,
  medium: 1,
  low: 2
};

const typeRank: Record<WeeklyOverviewItemType, number> = {
  deadline: 0,
  appointment: 1,
  task: 2
};

export function sortWeeklyOverviewItems(items: WeeklyOverviewItem[]): WeeklyOverviewItem[] {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const p = priorityRank[a.priority] - priorityRank[b.priority];
    if (p !== 0) return p;
    const ty = typeRank[a.type] - typeRank[b.type];
    if (ty !== 0) return ty;
    const ta = a.dueDate ? new Date(`${a.dueDate}T12:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
    const tb = b.dueDate ? new Date(`${b.dueDate}T12:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
    if (ta !== tb) return ta - tb;
    return a.title.localeCompare(b.title, "de");
  });
}

export type WeeklyOverviewStats = {
  openCount: number;
  doneCount: number;
  total: number;
  criticalCount: number;
  appointmentsThisWeekCount: number;
  taskBackedDone: number;
  taskBackedTotal: number;
};

export function computeWeeklyOverviewStats(items: WeeklyOverviewItem[], reference = new Date()): WeeklyOverviewStats {
  const mon = mondayOfWeek(reference);
  const sun = endOfWeekSunday(mon);
  const weekStart = mon.getTime();
  const weekEnd = sun.getTime();

  const total = items.length;
  const doneCount = items.filter((i) => i.completed).length;
  const openCount = total - doneCount;

  const criticalCount = items.filter((i) => !i.completed && i.priority === "high").length;

  const appointmentsThisWeekCount = items.filter((i) => {
    if (i.completed || i.type !== "appointment" || !i.dueDate) return false;
    const t = new Date(`${i.dueDate}T12:00:00`).getTime();
    return t >= weekStart && t <= weekEnd + 86400000;
  }).length;

  const taskBacked = items.filter((i) => i.taskId);
  const taskBackedDone = taskBacked.filter((i) => i.completed).length;
  const taskBackedTotal = taskBacked.length;

  return {
    openCount,
    doneCount,
    total,
    criticalCount,
    appointmentsThisWeekCount,
    taskBackedDone,
    taskBackedTotal
  };
}

export function formatWeeklyDuePhrase(iso: string | undefined, dateLocale: string, lang: "de" | "en", reference = new Date()): string {
  if (!iso) return "";
  const diff = calendarDaysUntilDue(iso, reference);
  if (diff === 0) return lang === "en" ? "Due today" : "Heute fällig";
  if (diff === 1) return lang === "en" ? "Due tomorrow" : "Morgen fällig";
  if (diff >= 2 && diff <= 6) return lang === "en" ? `In ${diff} days` : `In ${diff} Tagen`;
  if (diff < 0) {
    if (lang === "en") return `Overdue · ${formatWeeklyDate(iso, dateLocale)}`;
    return `Überfällig · ${formatWeeklyDate(iso, dateLocale)}`;
  }
  return formatWeeklyDate(iso, dateLocale);
}

export function getWeeklyOverviewMicrocopy(locale: "de" | "en", stats: WeeklyOverviewStats): string {
  const { openCount, doneCount, total, criticalCount } = stats;
  const allDone = total > 0 && doneCount === total;

  if (allDone) {
    if (locale === "en") return "All done — you're on top of this week.";
    return "Alles erledigt – diese Woche bist du im Plan.";
  }
  if (criticalCount >= 1) {
    if (locale === "en") return "Something urgent needs your attention soon.";
    return "Etwas Dringendes braucht bald deine Aufmerksamkeit.";
  }
  if (openCount >= 4) {
    if (locale === "en") return "A few items are worth tackling this week.";
    return "Ein paar Punkte lohnen sich diese Woche – ruhig der Reihe nach.";
  }
  if (openCount <= 2 && criticalCount === 0) {
    if (locale === "en") return "This week looks quite manageable.";
    return "Diese Woche wirkt gut machbar.";
  }
  if (locale === "en") return "You're on track — one step at a time.";
  return "Du bist gut unterwegs – Schritt für Schritt.";
}

export function weeklyOverviewLabels(locale: "de" | "en") {
  const en = {
    title: "Your week",
    subtitle: "From your documents, deadlines, cases and replies — sorted by priority",
    summaryLine: (open: number, critical: number, appts: number) =>
      `${open} open · ${critical} critical · ${appts} appointment${appts === 1 ? "" : "s"}`,
    progress: (done: number, total: number) => `${done} of ${total} done`,
    progressTasksOnly: "Progress applies to tasks you can mark as done here.",
    openChip: (n: number) => `${n} open`,
    criticalChip: (n: number) => `${n} critical`,
    appointmentsChip: (n: number) => `${n} appointment${n === 1 ? "" : "s"} this week`,
    typeTask: "Task",
    typeDeadline: "Deadline",
    typeAppointment: "Appointment",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    due: "Due",
    markDone: "Done",
    view: "View",
    expandDetails: "Show list",
    collapseDetails: "Collapse",
    emptyLine1: "You have no open tasks right now.",
    emptyLine2: "Upload a document and we will show you what to do next.",
    dueHighlightSoon: "Due soon",
    dueHighlightOverdue: "Overdue"
  };
  if (locale === "en") return en;
  return {
    title: "Deine Woche",
    subtitle: "Aus deinen Dokumenten, Fristen, Fällen und Antworten – nach Priorität sortiert",
    summaryLine: (open: number, critical: number, appts: number) =>
      `${open} offen · ${critical} kritisch · ${appts} Termin${appts === 1 ? "" : "e"}`,
    progress: (done: number, total: number) => `${done} von ${total} erledigt`,
    progressTasksOnly: "Der Fortschritt bezieht sich auf Aufgaben, die du hier als erledigt markieren kannst.",
    openChip: (n: number) => `${n} offen`,
    criticalChip: (n: number) => `${n} kritisch`,
    appointmentsChip: (n: number) => `${n} Termin${n === 1 ? "" : "e"} diese Woche`,
    typeTask: "Aufgabe",
    typeDeadline: "Frist",
    typeAppointment: "Termin",
    priorityHigh: "Hoch",
    priorityMedium: "Mittel",
    priorityLow: "Niedrig",
    due: "Fällig",
    markDone: "Erledigt",
    view: "Ansehen",
    expandDetails: "Liste anzeigen",
    collapseDetails: "Einklappen",
    emptyLine1: "Du hast aktuell keine offenen Aufgaben.",
    emptyLine2: "Lade ein Dokument hoch und wir zeigen dir, was zu tun ist.",
    dueHighlightSoon: "Bald fällig",
    dueHighlightOverdue: "Überfällig"
  };
}

export function formatWeeklyDate(iso: string | undefined, dateLocale: string): string {
  if (!iso) return "";
  try {
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString(dateLocale, {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  } catch {
    return iso;
  }
}
