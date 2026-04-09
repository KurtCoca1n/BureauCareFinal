import { normalizeDocumentKindDetection } from "@/lib/document-kind";
import type { CaseStatus } from "@/lib/types";
import type { DocumentAnalysisRecord, DocumentRecord, TaskRecord } from "@/lib/types";

/** Einheitliche Ampel: hoch / mittel / niedrig (ROT / GELB / GRÜN). */
export type TrafficLightLevel = "high" | "medium" | "low";

export function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Kalendertage bis zur Frist (negativ = überfällig). */
export function calendarDaysUntilDue(iso: string, reference: Date = new Date()): number {
  const due = new Date(`${iso}T12:00:00`);
  const a = startOfLocalDay(reference).getTime();
  const b = startOfLocalDay(due).getTime();
  return Math.round((b - a) / 86400000);
}

/**
 * MVP-Logik nur aus Frist (relativ zu reference):
 * überfällig oder ≤3 Tage → hoch, ≤14 Tage → mittel, sonst niedrig.
 */
export function computeTrafficLightFromDeadline(iso: string, reference: Date = new Date()): TrafficLightLevel {
  const diff = calendarDaysUntilDue(iso, reference);
  if (diff < 0) return "high";
  if (diff <= 3) return "high";
  if (diff <= 14) return "medium";
  return "low";
}

export function documentSuggestsOfficialOrUrgent(document: DocumentRecord, analysis: DocumentAnalysisRecord | null): boolean {
  try {
    if (!analysis) return false;
    if (analysis.urgency === "high") return true;
    const kind = normalizeDocumentKindDetection(document.kind_detection);
    if (kind?.kind === "authority_notice") return true;
    const dt = analysis.document_type?.trim();
    if (dt && /behörde|finanzamt|\bamt\b|gericht|jobcenter|bundesagentur|authority|official/i.test(dt)) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export function buildCasePrioritySignals(
  caseDocuments: DocumentRecord[],
  caseTasks: TaskRecord[],
  analysesByDocumentId: Map<string, DocumentAnalysisRecord>
): { nearestDeadlineIso: string | null; hasOfficialOrUrgentDocument: boolean } {
  const deadlines: string[] = [];
  for (const t of caseTasks) {
    if (t.status !== "done" && t.due_date) {
      deadlines.push(t.due_date);
    }
  }
  for (const d of caseDocuments) {
    if (d.status === "erledigt" || d.status === "gesendet") continue;
    const a = analysesByDocumentId.get(d.id);
    if (a?.deadline_date) deadlines.push(a.deadline_date);
  }

  const nearestDeadlineIso = deadlines.length ? deadlines.reduce((a, b) => (a <= b ? a : b)) : null;

  let hasOfficialOrUrgentDocument = false;
  for (const d of caseDocuments) {
    const a = analysesByDocumentId.get(d.id) ?? null;
    if (documentSuggestsOfficialOrUrgent(d, a)) {
      hasOfficialOrUrgentDocument = true;
      break;
    }
  }

  return { nearestDeadlineIso, hasOfficialOrUrgentDocument };
}

export type CaseTrafficLightInput = {
  status: CaseStatus;
  openTasksCount: number;
  nearestDeadlineIso: string | null;
  hasOfficialOrUrgentDocument: boolean;
};

export function resolveCaseTrafficLight(
  caseItem: CaseTrafficLightInput,
  reference: Date = new Date()
): { level: TrafficLightLevel; settled: boolean } {
  if (caseItem.status === "done") {
    return { level: "low", settled: true };
  }
  if (caseItem.hasOfficialOrUrgentDocument) {
    return { level: "high", settled: false };
  }
  if (caseItem.nearestDeadlineIso) {
    return { level: computeTrafficLightFromDeadline(caseItem.nearestDeadlineIso, reference), settled: false };
  }
  if (caseItem.openTasksCount > 0 || caseItem.status === "in_progress") {
    return { level: "medium", settled: false };
  }
  if (caseItem.status === "waiting") {
    return { level: "medium", settled: false };
  }
  return { level: "medium", settled: false };
}

export function computeTrafficLightForDocument(
  document: DocumentRecord,
  analysis: DocumentAnalysisRecord | null,
  reference: Date = new Date()
): { level: TrafficLightLevel; settled: boolean } {
  if (document.status === "erledigt" || document.status === "gesendet") {
    return { level: "low", settled: true };
  }
  if (!analysis) {
    return { level: "medium", settled: false };
  }
  if (documentSuggestsOfficialOrUrgent(document, analysis)) {
    return { level: "high", settled: false };
  }
  const purelyInformative =
    analysis.urgency === "low" && !analysis.deadline_date && analysis.is_action_required !== true;
  if (purelyInformative) {
    return { level: "low", settled: false };
  }
  if (analysis.deadline_date) {
    return { level: computeTrafficLightFromDeadline(analysis.deadline_date, reference), settled: false };
  }
  return { level: "medium", settled: false };
}

export function computeTrafficLightForTask(task: TaskRecord, reference: Date = new Date()): { level: TrafficLightLevel; settled: boolean } {
  if (task.status === "done") {
    return { level: "low", settled: true };
  }
  if (task.due_date) {
    return { level: computeTrafficLightFromDeadline(task.due_date, reference), settled: false };
  }
  return { level: "medium", settled: false };
}

/** Analyse-Fristzeile in „Deine Woche“ – gleiche Regeln wie Dokumentseite. */
export function computeTrafficLightForAnalysisRow(
  document: DocumentRecord,
  analysis: DocumentAnalysisRecord,
  reference: Date = new Date()
): TrafficLightLevel {
  return computeTrafficLightForDocument(document, analysis, reference).level;
}

export function getTrafficLightBadgeText(lang: "de" | "en", level: TrafficLightLevel, settled?: boolean): string {
  if (settled) {
    return lang === "de" ? "Erledigt" : "Done";
  }
  if (lang === "de") {
    switch (level) {
      case "high":
        return "Sofort handeln";
      case "medium":
        return "Bald erledigen";
      default:
        return "Kein Stress";
    }
  }
  switch (level) {
    case "high":
      return "Act soon";
    case "medium":
      return "Tackle when you can";
    default:
      return "No rush";
  }
}
