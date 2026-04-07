import "server-only";

import { getDeadlineBody } from "@/lib/document-decision-ui";
import type {
  DeadlineSituation,
  DocumentKindDetection,
  DocumentKindId,
  PriorityBand,
  SuggestedModuleId
} from "@/lib/document-kind";
import { isNoticeScannerLeadFlow } from "@/lib/document-kind";
import type { AppLocale } from "@/lib/i18n";

/** Stabile Schlüssel für spätere To-dos / Erinnerungen (nicht lokalisiert) */
export const routingMicroStepKeys = [
  "run_analysis",
  "recheck_deadline_in_original",
  "explain_with_bureaucare",
  "review_contract_points",
  "check_refund_angle",
  "open_tasks_overview",
  "keep_documents_ready",
  "calm_readthrough"
] as const;

export type RoutingMicroStepKey = (typeof routingMicroStepKeys)[number];

/** Anschluss für künftiges Fristen- / Aufgaben-Backend */
export type ReactionDisposition =
  | "likely_action"
  | "possibly_reply"
  | "mostly_informational"
  | "needs_review"
  | "unclear";

export type RoutingHintsForTasksPayload = {
  schema_version: 1;
  deadline_situation: DeadlineSituation;
  deadline_date_iso: string | null;
  priority_band: PriorityBand;
  reaction_disposition: ReactionDisposition;
  primary_module: SuggestedModuleId | null;
  document_kind: DocumentKindId;
  micro_step_keys: RoutingMicroStepKey[];
  urgency_hint: "high" | "medium" | "low" | "unknown";
};

function isDe(locale: AppLocale) {
  return locale === "de";
}

export function deriveReactionDisposition(detection: DocumentKindDetection): ReactionDisposition {
  const { priority_band, deadline_situation } = detection;
  const deadlinePressures =
    deadline_situation === "time_sensitive" ||
    deadline_situation === "date_seen";

  if (priority_band === "unclear") {
    return "unclear";
  }
  if (priority_band === "informative" && !deadlinePressures) {
    return "mostly_informational";
  }
  if (priority_band === "urgent" || (priority_band === "important" && deadlinePressures)) {
    return "likely_action";
  }
  if (deadlinePressures || priority_band === "important") {
    return "possibly_reply";
  }
  if (priority_band === "relevant") {
    return "needs_review";
  }
  return "needs_review";
}

function urgencyFromDetection(detection: DocumentKindDetection): RoutingHintsForTasksPayload["urgency_hint"] {
  if (detection.priority_band === "urgent") {
    return "high";
  }
  if (detection.priority_band === "important" || detection.deadline_situation === "time_sensitive") {
    return "medium";
  }
  if (detection.priority_band === "informative" && detection.deadline_situation === "no_clear_hint") {
    return "low";
  }
  return "unknown";
}

export function buildRoutingHintsPayload(detection: DocumentKindDetection): RoutingHintsForTasksPayload {
  const primary = detection.suggested_modules[0] ?? null;
  const micro = collectMicroStepKeys(detection, primary);
  return {
    schema_version: 1,
    deadline_situation: detection.deadline_situation,
    deadline_date_iso: detection.deadline_date_iso,
    priority_band: detection.priority_band,
    reaction_disposition: deriveReactionDisposition(detection),
    primary_module: primary,
    document_kind: detection.kind,
    micro_step_keys: micro,
    urgency_hint: urgencyFromDetection(detection)
  };
}

function collectMicroStepKeys(
  detection: DocumentKindDetection,
  primary: SuggestedModuleId | null
): RoutingMicroStepKey[] {
  const keys = new Set<RoutingMicroStepKey>();
  keys.add("run_analysis");

  if (detection.deadline_situation === "date_seen" || detection.deadline_situation === "time_sensitive") {
    keys.add("recheck_deadline_in_original");
  }
  if (isNoticeScannerLeadFlow(detection) || primary === "notice_scanner") {
    keys.add("explain_with_bureaucare");
  }
  if (primary === "contract_scanner" || detection.kind === "termination") {
    keys.add("review_contract_points");
  }
  if (primary === "money_back_finder") {
    keys.add("check_refund_angle");
  }
  if (primary === "deadlines_tasks") {
    keys.add("open_tasks_overview");
  }
  if (detection.kind === "authority_notice" || detection.kind === "form") {
    keys.add("keep_documents_ready");
  }
  if (detection.priority_band === "informative" || detection.priority_band === "unclear") {
    keys.add("calm_readthrough");
  }

  return Array.from(keys).slice(0, 6);
}

function labelForMicroKey(locale: AppLocale, key: RoutingMicroStepKey): string {
  const de = isDe(locale);
  switch (key) {
    case "run_analysis":
      return de ? "Nächsten Schritt starten (Analyse)" : "Start the next step (analysis)";
    case "recheck_deadline_in_original":
      return de ? "Frist im Original kurz gegenlesen" : "Double-check any deadline in the original";
    case "explain_with_bureaucare":
      return de ? "Inhalt erklären lassen" : "Get a clear explanation";
    case "review_contract_points":
      return de ? "Vertragspunkte sinnvoll prüfen" : "Review key contract points calmly";
    case "check_refund_angle":
      return de ? "Rückerstattung prüfen" : "Check refund angles";
    case "open_tasks_overview":
      return de ? "Aufgaben & Fristen im Blick" : "Keep tasks and deadlines in view";
    case "keep_documents_ready":
      return de ? "Unterlagen bereithalten" : "Keep related documents handy";
    case "calm_readthrough":
      return de ? "In Ruhe kurz durchlesen" : "Read through calmly when you have a moment";
    default:
      return key;
  }
}

export function getReactionHandlungBlock(locale: AppLocale, detection: DocumentKindDetection): {
  title: string;
  detail: string;
} {
  const disposition = deriveReactionDisposition(detection);
  const de = isDe(locale);
  switch (disposition) {
    case "likely_action":
      return {
        title: de ? "Handlungsbedarf wahrscheinlich" : "Action may be needed",
        detail: de
          ? "Aus dem schnellen Überblick wirkt das Thema eher dringend oder zeitkritisch. Eine zeitnahe Prüfung ist vernünftig – ohne in Panik zu geraten."
          : "From a quick pass this looks time-sensitive or pressing. A timely review makes sense – without jumping to worst cases."
      };
    case "possibly_reply":
      return {
        title: de ? "Reaktion oder Antwort denkbar" : "A reply or reaction may be needed",
        detail: de
          ? "Es kann sein, dass die Stelle auf dich wartet oder eine Frist im Spiel ist. Die Analyse hilft dir, das klarer zu sehen."
          : "The sender may expect something from you or a deadline may apply. Analysis helps make that clearer."
      };
    case "mostly_informational":
      return {
        title: de ? "Eher informativ" : "Mostly informational",
        detail: de
          ? "Es wirkt vorerst wie eine Mitteilung ohne starken Handlungsdruck. Trotzdem lohnt sich ein kurzer Check mit der Analyse."
          : "This looks more like information than urgent action. A quick pass with analysis still helps if you want certainty."
      };
    case "unclear":
      return {
        title: de ? "Reaktion noch unklar" : "Next step still unclear",
        detail: de
          ? "Aus der Einordnung allein geht nicht sicher hervor, ob du etwas tun musst. Die ausführliche Auswertung gibt dir Orientierung."
          : "From this pass alone it is not clear whether you must act. The full review adds orientation."
      };
    default:
      return {
        title: de ? "Gut in Ruhe prüfen" : "Worth a calm review",
        detail: de
          ? "Wenn du unsicher bist, was von dir erwartet wird, ist der nächste Schritt: Inhalt klären und dann entscheiden – BureauCare führt dich durch."
          : "If you are unsure what is expected, clarify the content first, then decide – BureauCare guides you through that."
      };
  }
}

/** Kurz-Badge zur Fristlage (vorsichtige Sprache) */
export function getDeadlineSituationBadge(locale: AppLocale, detection: DocumentKindDetection): string {
  const de = isDe(locale);
  switch (detection.deadline_situation) {
    case "date_seen":
      return de ? "Mögliche Frist – bitte im Original prüfen" : "Possible deadline – check the original";
    case "time_sensitive":
      return de ? "Zeit oder Reaktion vermutlich relevant" : "Timing or response likely matters";
    case "no_clear_hint":
      return de ? "Aktuell kein klarer Frist-Hinweis" : "No clear deadline hint yet";
    default:
      return de ? "Fristlage aus Einordnung unklar" : "Deadline situation unclear from this pass";
  }
}

export function getOrientationMicroSteps(locale: AppLocale, detection: DocumentKindDetection): string[] {
  const primary = detection.suggested_modules[0] ?? null;
  const keys = collectMicroStepKeys(detection, primary);
  return keys.map((k) => labelForMicroKey(locale, k));
}

export function getNextStepOrientationLine(locale: AppLocale, primary: SuggestedModuleId): string {
  const de = isDe(locale);
  switch (primary) {
    case "notice_scanner":
      return de ? "Sinnvoll jetzt: offizielles Schreiben verstehen und einordnen." : "Sensible next: understand the official letter.";
    case "contract_scanner":
      return de ? "Sinnvoll jetzt: Vertrag ruhig prüfen." : "Sensible next: review the contract calmly.";
    case "money_back_finder":
      return de ? "Sinnvoll jetzt: Erstattung oder Gebühren prüfen." : "Sensible next: check refunds or fees.";
    case "deadlines_tasks":
      return de ? "Sinnvoll jetzt: Aufgaben und Fristen sammeln." : "Sensible next: gather tasks and deadlines.";
    default:
      return de ? "Sinnvoll jetzt: Dokument zusammenfassen und nächste Schritte klären." : "Sensible next: summarise the document and clarify steps.";
  }
}

export function getSectionFristReaktionOrientierung(locale: AppLocale): string {
  return isDe(locale) ? "Frist, Reaktion & Orientierung" : "Deadlines, response & your focus";
}

export function buildRoutingOrientationView(
  locale: AppLocale,
  detection: DocumentKindDetection,
  dateLocale: string
): {
  sectionTitle: string;
  deadlineBadge: string;
  deadlineBlock: { title: string; detail: string };
  reactionBlock: { title: string; detail: string };
  microStepsTitle: string;
  microSteps: string[];
  nextStepLine: string;
} {
  const primary = detection.suggested_modules[0] ?? "document_summary";
  return {
    sectionTitle: getSectionFristReaktionOrientierung(locale),
    deadlineBadge: getDeadlineSituationBadge(locale, detection),
    deadlineBlock: getDeadlineBody(locale, detection.deadline_situation, detection.deadline_date_iso, dateLocale),
    reactionBlock: getReactionHandlungBlock(locale, detection),
    microStepsTitle: isDe(locale) ? "Was jetzt hilft" : "What helps now",
    microSteps: getOrientationMicroSteps(locale, detection),
    nextStepLine: getNextStepOrientationLine(locale, primary)
  };
}
