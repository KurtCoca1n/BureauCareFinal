import { z } from "zod";

/** BureauCare-interne Dokumentklasse (nach Upload, vor/vollständiger Analyse) */
export const documentKindIds = [
  "contract",
  "authority_notice",
  "invoice",
  "reminder",
  "termination",
  "form",
  "travel_booking",
  "other"
] as const;

export type DocumentKindId = (typeof documentKindIds)[number];

export const importanceHints = ["urgent", "relevant", "informative", "unclear"] as const;
export type ImportanceHint = (typeof importanceHints)[number];

/** Feinere Einordnung für den Decision Screen (5 Stufen) */
export const priorityBands = ["urgent", "important", "relevant", "informative", "unclear"] as const;
export type PriorityBand = (typeof priorityBands)[number];

export const deadlineSituations = ["date_seen", "time_sensitive", "no_clear_hint", "unclear"] as const;
export type DeadlineSituation = (typeof deadlineSituations)[number];

export const suggestedModuleIds = [
  "contract_scanner",
  "money_back_finder",
  "notice_scanner",
  "document_summary",
  "deadlines_tasks"
] as const;

export type SuggestedModuleId = (typeof suggestedModuleIds)[number];

/** Rohdaten aus KI oder älteren Einträgen (importance_hint optional) */
const documentKindDetectionPayloadSchema = z.object({
  kind: z.enum(documentKindIds),
  confidence: z.enum(["low", "medium", "high"]),
  importance_hint: z.enum(importanceHints).optional(),
  priority_band: z.enum(priorityBands).optional(),
  signals: z.array(z.string().min(1)).max(6),
  suggested_modules: z.array(z.enum(suggestedModuleIds)).max(5),
  deadline_situation: z.enum(deadlineSituations).optional(),
  deadline_date_iso: z.string().nullable().optional()
});

export type DocumentKindDetection = {
  kind: DocumentKindId;
  confidence: "low" | "medium" | "high";
  /** Abgeleitet für ältere Aufrufer */
  importance_hint: ImportanceHint;
  priority_band: PriorityBand;
  deadline_situation: DeadlineSituation;
  deadline_date_iso: string | null;
  signals: string[];
  suggested_modules: SuggestedModuleId[];
};

function legacyImportanceToPriority(hint: ImportanceHint): PriorityBand {
  switch (hint) {
    case "urgent":
      return "urgent";
    case "informative":
      return "informative";
    case "unclear":
      return "unclear";
    default:
      return "relevant";
  }
}

function priorityToLegacyImportance(band: PriorityBand): ImportanceHint {
  switch (band) {
    case "urgent":
      return "urgent";
    case "informative":
      return "informative";
    case "unclear":
      return "unclear";
    default:
      return "relevant";
  }
}

export function normalizeDocumentKindDetection(raw: unknown): DocumentKindDetection | null {
  const parsed = documentKindDetectionPayloadSchema.safeParse(raw);
  if (!parsed.success) {
    return null;
  }

  const d = parsed.data;
  const priority_band =
    d.priority_band ??
    (d.importance_hint ? legacyImportanceToPriority(d.importance_hint) : "unclear");
  const importance_hint = d.importance_hint ?? priorityToLegacyImportance(priority_band);
  const deadline_situation = d.deadline_situation ?? "unclear";
  const deadline_date_iso = d.deadline_date_iso ?? null;
  const merged = mergeSuggestedModules(d.kind, d.suggested_modules);

  return {
    kind: d.kind,
    confidence: d.confidence,
    importance_hint,
    priority_band,
    deadline_situation,
    deadline_date_iso,
    signals: d.signals,
    suggested_modules: merged
  };
}

/** Für strenges Parsing direkt nach der KI (alle neuen Felder gesetzt) */
export const documentKindDetectionSchema = z
  .object({
    kind: z.enum(documentKindIds),
    confidence: z.enum(["low", "medium", "high"]),
    priority_band: z.enum(priorityBands),
    signals: z.array(z.string().min(1)).max(6),
    suggested_modules: z.array(z.enum(suggestedModuleIds)).max(5),
    deadline_situation: z.enum(deadlineSituations),
    deadline_date_iso: z.string().nullable()
  })
  .transform(
    (d): DocumentKindDetection => ({
      ...d,
      importance_hint: priorityToLegacyImportance(d.priority_band),
      suggested_modules: mergeSuggestedModules(d.kind, d.suggested_modules)
    })
  );

/** Fallback-Routing wenn die KI keine Module liefert */
export function defaultSuggestedModulesForKind(kind: DocumentKindId): SuggestedModuleId[] {
  switch (kind) {
    case "contract":
      return ["contract_scanner", "document_summary", "deadlines_tasks"];
    case "authority_notice":
      return ["notice_scanner", "document_summary", "deadlines_tasks"];
    case "invoice":
      return ["money_back_finder", "document_summary", "deadlines_tasks"];
    case "reminder":
      return ["document_summary", "deadlines_tasks", "money_back_finder"];
    case "termination":
      return ["contract_scanner", "document_summary", "deadlines_tasks"];
    case "form":
      return ["notice_scanner", "document_summary", "deadlines_tasks"];
    case "travel_booking":
      return ["money_back_finder", "document_summary", "deadlines_tasks"];
    default:
      return ["document_summary", "deadlines_tasks"];
  }
}

export function mergeSuggestedModules(kind: DocumentKindId, fromAi: SuggestedModuleId[]): SuggestedModuleId[] {
  const allowed = new Set(suggestedModuleIds);
  const filtered = fromAi.filter((m) => allowed.has(m));
  const fallback = defaultSuggestedModulesForKind(kind);
  const merged = [...new Set([...filtered, ...fallback])];
  let result = merged.slice(0, 5);
  if (kind === "authority_notice") {
    const rest = result.filter((m) => m !== "notice_scanner");
    result = (["notice_scanner", ...rest] as SuggestedModuleId[]).slice(0, 5);
  }
  if (kind === "other") {
    const rest = result.filter((m) => m !== "document_summary");
    result = (["document_summary", ...rest] as SuggestedModuleId[]).slice(0, 5);
  }
  if (!result.includes("document_summary")) {
    result = [...result.slice(0, 4), "document_summary"] as SuggestedModuleId[];
  }
  return result;
}

/** Routing & UI: Bescheid-Scanner-Fokus bei Behörden- oder Bescheid-Dokumenten */
export function isNoticeScannerLeadFlow(detection: DocumentKindDetection): boolean {
  return detection.kind === "authority_notice" || detection.suggested_modules[0] === "notice_scanner";
}
