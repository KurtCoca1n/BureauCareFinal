import type { DocumentKindDetection } from "@/lib/document-kind";
import type { DocumentAnalysisRecord, DocumentRecord, Json } from "@/lib/types";

export const CASE_BRIEF_SCHEMA_VERSION = 1 as const;

/** Denormalisierte, erweiterbare Kurzübersicht für Fälle (Liste + Detail) */
export type CaseBrief = {
  schema_version: typeof CASE_BRIEF_SCHEMA_VERSION;
  primary_document_id: string | null;
  document_kind_key?: string | null;
  document_kind_label?: string | null;
  document_uploaded_at?: string | null;
  analyzed_at?: string | null;
  summary_short?: string | null;
  deadline_date?: string | null;
  next_steps_preview?: string[];
  risk_hint?: string | null;
};

export function parseCaseBrief(raw: unknown): CaseBrief | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const o = raw as Record<string, unknown>;
  if (o.schema_version !== CASE_BRIEF_SCHEMA_VERSION) return null;
  if (o.primary_document_id != null && typeof o.primary_document_id !== "string") return null;
  return {
    schema_version: CASE_BRIEF_SCHEMA_VERSION,
    primary_document_id: (o.primary_document_id as string | null) ?? null,
    document_kind_key: typeof o.document_kind_key === "string" ? o.document_kind_key : o.document_kind_key == null ? null : undefined,
    document_kind_label:
      typeof o.document_kind_label === "string" ? o.document_kind_label : o.document_kind_label == null ? null : undefined,
    document_uploaded_at: typeof o.document_uploaded_at === "string" ? o.document_uploaded_at : undefined,
    analyzed_at: typeof o.analyzed_at === "string" ? o.analyzed_at : undefined,
    summary_short: typeof o.summary_short === "string" ? o.summary_short : o.summary_short == null ? null : undefined,
    deadline_date: typeof o.deadline_date === "string" ? o.deadline_date : o.deadline_date == null ? null : undefined,
    next_steps_preview: Array.isArray(o.next_steps_preview)
      ? o.next_steps_preview.filter((s): s is string => typeof s === "string")
      : undefined,
    risk_hint: typeof o.risk_hint === "string" ? o.risk_hint : o.risk_hint == null ? null : undefined
  };
}

export function caseBriefToJson(brief: CaseBrief): Json {
  return JSON.parse(JSON.stringify(brief)) as Json;
}

export function buildCaseBriefFromDetection(
  document: Pick<DocumentRecord, "id" | "created_at">,
  detection: DocumentKindDetection | null
): CaseBrief {
  const risk =
    detection?.signals?.length ? detection.signals.slice(0, 4).join(" · ") : null;
  return {
    schema_version: CASE_BRIEF_SCHEMA_VERSION,
    primary_document_id: document.id,
    document_kind_key: detection?.kind ?? null,
    document_uploaded_at: document.created_at,
    analyzed_at: null,
    summary_short: null,
    deadline_date: detection?.deadline_date_iso ?? null,
    next_steps_preview: [],
    risk_hint: risk
  };
}

type AnalysisBriefInput = Pick<
  DocumentAnalysisRecord,
  | "document_type"
  | "summary_simple"
  | "summary_simple_short"
  | "deadline_date"
  | "next_steps"
  | "risks_if_ignored"
>;

export function mergeCaseBriefWithAnalysis(
  existing: CaseBrief | null,
  document: Pick<DocumentRecord, "id" | "created_at">,
  analysis: AnalysisBriefInput
): CaseBrief {
  const summary =
    analysis.summary_simple_short?.trim() ||
    analysis.summary_simple?.trim().slice(0, 280) ||
    existing?.summary_short ||
    null;
  const rawSteps = analysis.next_steps;
  const steps = Array.isArray(rawSteps)
    ? rawSteps.filter((s): s is string => typeof s === "string" && s.trim().length > 0).slice(0, 4)
    : existing?.next_steps_preview ?? [];

  return {
    schema_version: CASE_BRIEF_SCHEMA_VERSION,
    primary_document_id: document.id,
    document_kind_key: existing?.document_kind_key ?? null,
    document_kind_label: analysis.document_type?.trim() || existing?.document_kind_label || null,
    document_uploaded_at: existing?.document_uploaded_at ?? document.created_at,
    analyzed_at: new Date().toISOString(),
    summary_short: summary,
    deadline_date: analysis.deadline_date ?? existing?.deadline_date ?? null,
    next_steps_preview: steps.length ? steps : existing?.next_steps_preview ?? [],
    risk_hint: analysis.risks_if_ignored?.trim() || existing?.risk_hint || null
  };
}
