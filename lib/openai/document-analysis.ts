import OpenAI from "openai";
import { z } from "zod";

import { processDocumentForAnalysis } from "@/lib/document-processing";
import { getServerEnv } from "@/lib/env";
import type { ContractClauseCategory, ContractGuidanceItem, DocumentRecord } from "@/lib/types";

const difficultTermSchema = z.object({
  term: z.string().min(1),
  explanation_simple: z.string().min(1)
});

const pageSummarySchema = z.object({
  page: z.number().int().min(1),
  summary: z.string().min(1)
});

const importantReferenceSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  page: z.number().int().min(1)
});

const contractFlaggedPointSchema = z.object({
  title: z.string().min(1),
  explanation_simple: z.string().min(1),
  tone: z.enum(["notice", "watch", "caution"])
});

const contractFlaggedClauseSchema = z.object({
  category: z.enum([
    "duration",
    "termination",
    "auto_renewal",
    "costs",
    "liability",
    "user_duties",
    "provider_rights",
    "privacy",
    "unclear_language",
    "other"
  ]),
  secondary_categories: z
    .array(
      z.enum([
        "duration",
        "termination",
        "auto_renewal",
        "costs",
        "liability",
        "user_duties",
        "provider_rights",
        "privacy",
        "unclear_language",
        "other"
      ])
    )
    .max(3),
  clause_summary_simple: z.string().min(1),
  clause_reason_simple: z.string().min(1),
  clause_risk_level: z.enum(["low", "medium", "elevated"]),
  source_excerpt: z.string().nullable(),
  source_page: z.number().int().min(1).nullable(),
  source_section: z.string().nullable(),
  source_context_label: z.string().nullable(),
  source_context_reason: z.string().nullable()
});

const contractGuidanceItemSchema = z.object({
  category: z.enum([
    "duration",
    "termination",
    "auto_renewal",
    "costs",
    "liability",
    "user_duties",
    "provider_rights",
    "privacy",
    "unclear_language",
    "other"
  ]),
  priority: z.enum(["high", "medium", "general"])
});

const analysisSchema = z.object({
  sender: z.string().nullable(),
  document_type: z.string().nullable(),
  contract_type: z.string().nullable(),
  contract_parties: z.array(z.string().min(1)).max(4),
  subject: z.string().nullable(),
  summary_simple: z.string().min(1),
  contract_summary_simple: z.string().nullable(),
  summary_simple_short: z.string().min(1),
  summary_simple_long: z.string().min(1),
  is_action_required: z.boolean().nullable(),
  deadline_date: z.string().nullable(),
  urgency: z.enum(["low", "medium", "high"]).nullable(),
  key_points: z.array(z.string().min(1)).min(3).max(6),
  highlight_terms: z.array(z.string().min(1)).max(8),
  difficult_terms: z.array(difficultTermSchema).max(8),
  next_steps: z.array(z.string().min(1)).max(6),
  page_count: z.number().int().min(1),
  page_summaries: z.array(pageSummarySchema).max(24),
  important_references: z.array(importantReferenceSchema).max(8),
  action_location_name: z.string().nullable(),
  action_location_address: z.string().nullable(),
  action_url: z.string().nullable(),
  action_mode: z.enum(["online", "vor_ort", "per_post", "telefon", "unbekannt"]).nullable(),
  risks_if_ignored: z.string().nullable(),
  contract_action_points: z.array(contractGuidanceItemSchema).max(8),
  contract_duration: z.string().nullable(),
  contract_notice_period: z.string().nullable(),
  contract_recurring_costs: z.string().nullable(),
  contract_auto_renewal: z.string().nullable(),
  contract_clarification_points: z.array(contractGuidanceItemSchema).max(8),
  contract_flagged_clauses: z.array(contractFlaggedClauseSchema).max(8),
  contract_flagged_points: z.array(contractFlaggedPointSchema).max(6),
  contract_possible_disadvantages: z.array(contractGuidanceItemSchema).max(8),
  contract_pre_signing_checklist: z.array(contractGuidanceItemSchema).max(8),
  contract_watch_out_for: z.array(z.string().min(1)).max(6),
  contract_watch_out_points: z.array(z.string().min(1)).max(6),
  contract_unclear_points: z.array(z.string().min(1)).max(6),
  contract_risk_level_overview: z.string().nullable(),
  source_excerpt: z.string().nullable(),
  readability: z.enum(["readable", "partial", "unreadable"]),
  readability_reason: z.string().nullable()
});

export type DocumentAnalysisResult = z.infer<typeof analysisSchema>;

function extractAddressFromText(text: string | null) {
  if (!text) {
    return null;
  }

  const compact = text.replace(/\s+/g, " ");
  const patterns = [
    /\b([A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+){0,3}\s+\d{1,4}[a-zA-Z]?,\s*\d{5}\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)\b/,
    /\b(\d{5}\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+,\s*[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+){0,3}\s+\d{1,4}[a-zA-Z]?)\b/
  ];

  for (const pattern of patterns) {
    const match = compact.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function extractLocationNameFromText(text: string | null) {
  if (!text) {
    return null;
  }

  const compact = text.replace(/\s+/g, " ");
  const patterns = [
    /\b(Jobcenter(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)?)/i,
    /\b(Amtsgericht(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)?)/i,
    /\b(Landgericht(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)?)/i,
    /\b(Bürgeramt(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)?)/i,
    /\b(Finanzamt(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)?)/i,
    /\b(Sozialamt(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)?)/i,
    /\b(Familienkasse(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)?)/i,
    /\b(Krankenkasse(?:\s+[A-ZÄÖÜ][A-Za-zÄÖÜäöüß\-]+)?)/i
  ];

  for (const pattern of patterns) {
    const match = compact.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
}

function enrichActionLocation(result: DocumentAnalysisResult, extractedText: string | null): DocumentAnalysisResult {
  const inferredAddress = extractAddressFromText(extractedText);
  const inferredLocationName = extractLocationNameFromText(extractedText);

  if (result.action_mode === "vor_ort") {
    return {
      ...result,
      action_location_name: result.action_location_name ?? inferredLocationName ?? result.sender ?? null,
      action_location_address: result.action_location_address ?? inferredAddress
    };
  }

  if (result.action_mode === "per_post") {
    return {
      ...result,
      action_location_name: result.action_location_name ?? result.sender ?? inferredLocationName ?? "Postfiliale",
      action_location_address: result.action_location_address ?? inferredAddress
    };
  }

  return {
    ...result,
    action_location_name: result.action_location_name ?? inferredLocationName ?? null,
    action_location_address: result.action_location_address ?? inferredAddress
  };
}

function normalizeContractFields(result: DocumentAnalysisResult): DocumentAnalysisResult {
  const looksLikeContract =
    !!result.contract_type ||
    !!result.contract_summary_simple ||
    (result.contract_flagged_points?.length ?? 0) > 0 ||
    (result.document_type ?? "").toLowerCase().includes("vertrag");

  if (!looksLikeContract) {
    return {
      ...result,
      contract_action_points: [],
      contract_type: null,
      contract_parties: [],
      contract_summary_simple: null,
      contract_duration: null,
      contract_notice_period: null,
      contract_recurring_costs: null,
      contract_auto_renewal: null,
      contract_clarification_points: [],
      contract_flagged_clauses: [],
      contract_flagged_points: [],
      contract_possible_disadvantages: [],
      contract_pre_signing_checklist: [],
      contract_watch_out_for: [],
      contract_watch_out_points: [],
      contract_unclear_points: [],
      contract_risk_level_overview: null
    };
  }

  return {
    ...result,
    document_type: "Vertrag"
  };
}

function buildGuidanceItem(category: ContractClauseCategory, priority: ContractGuidanceItem["priority"]): ContractGuidanceItem {
  return { category, priority };
}

function pushUniqueGuidance(target: ContractGuidanceItem[], item: ContractGuidanceItem) {
  if (target.some((entry) => entry.category === item.category)) {
    return;
  }

  target.push(item);
}

function getPriorityFromClause(category: ContractClauseCategory, riskLevel: "low" | "medium" | "elevated"): ContractGuidanceItem["priority"] {
  if (category === "costs" || category === "auto_renewal") {
    return "high";
  }
  if (category === "duration" || category === "termination") {
    return riskLevel === "low" ? "medium" : "high";
  }
  if (riskLevel === "elevated") {
    return "medium";
  }
  return "general";
}

function rankGuidancePriority(priority: ContractGuidanceItem["priority"]) {
  if (priority === "high") return 0;
  if (priority === "medium") return 1;
  return 2;
}

function buildContractGuidance(result: DocumentAnalysisResult): DocumentAnalysisResult {
  const looksLikeContract =
    !!result.contract_type ||
    !!result.contract_summary_simple ||
    (result.contract_flagged_clauses?.length ?? 0) > 0 ||
    (result.contract_flagged_points?.length ?? 0) > 0 ||
    (result.document_type ?? "").toLowerCase().includes("vertrag");

  if (!looksLikeContract) {
    return {
      ...result,
      contract_action_points: [],
      contract_possible_disadvantages: [],
      contract_clarification_points: [],
      contract_pre_signing_checklist: []
    };
  }

  const actionPoints: ContractGuidanceItem[] = [];
  const disadvantages: ContractGuidanceItem[] = [];
  const clarificationPoints: ContractGuidanceItem[] = [];
  const checklist: ContractGuidanceItem[] = [];

  for (const clause of result.contract_flagged_clauses ?? []) {
    const priority = getPriorityFromClause(clause.category, clause.clause_risk_level);
    pushUniqueGuidance(actionPoints, buildGuidanceItem(clause.category, priority));
    pushUniqueGuidance(disadvantages, buildGuidanceItem(clause.category, priority));
    pushUniqueGuidance(checklist, buildGuidanceItem(clause.category, priority));

    if (clause.category === "unclear_language" || clause.category === "provider_rights" || clause.clause_risk_level === "elevated") {
      pushUniqueGuidance(clarificationPoints, buildGuidanceItem(clause.category, priority));
    }
  }

  if (result.contract_recurring_costs) {
    pushUniqueGuidance(actionPoints, buildGuidanceItem("costs", "high"));
    pushUniqueGuidance(disadvantages, buildGuidanceItem("costs", "high"));
    pushUniqueGuidance(checklist, buildGuidanceItem("costs", "high"));
  }

  if (result.contract_auto_renewal) {
    pushUniqueGuidance(actionPoints, buildGuidanceItem("auto_renewal", "high"));
    pushUniqueGuidance(checklist, buildGuidanceItem("auto_renewal", "high"));
  }

  if (result.contract_duration) {
    pushUniqueGuidance(actionPoints, buildGuidanceItem("duration", "high"));
    pushUniqueGuidance(checklist, buildGuidanceItem("duration", "high"));
  }

  if (result.contract_notice_period) {
    pushUniqueGuidance(actionPoints, buildGuidanceItem("termination", "high"));
    pushUniqueGuidance(checklist, buildGuidanceItem("termination", "high"));
  }

  if ((result.contract_unclear_points?.length ?? 0) > 0) {
    pushUniqueGuidance(clarificationPoints, buildGuidanceItem("unclear_language", "medium"));
    pushUniqueGuidance(checklist, buildGuidanceItem("unclear_language", "medium"));
  }

  const sortItems = (items: ContractGuidanceItem[]) =>
    [...items].sort((a, b) => rankGuidancePriority(a.priority) - rankGuidancePriority(b.priority));

  return {
    ...result,
    contract_action_points: sortItems(actionPoints),
    contract_possible_disadvantages: sortItems(disadvantages),
    contract_clarification_points: sortItems(clarificationPoints),
    contract_pre_signing_checklist: sortItems(checklist)
  };
}

function buildJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      sender: { type: ["string", "null"] },
      document_type: { type: ["string", "null"] },
      contract_type: { type: ["string", "null"] },
      contract_parties: {
        type: "array",
        items: { type: "string" },
        maxItems: 4
      },
      subject: { type: ["string", "null"] },
      summary_simple: { type: "string" },
      contract_summary_simple: { type: ["string", "null"] },
      summary_simple_short: { type: "string" },
      summary_simple_long: { type: "string" },
      is_action_required: { type: ["boolean", "null"] },
      deadline_date: { type: ["string", "null"] },
      urgency: { type: ["string", "null"], enum: ["low", "medium", "high", null] },
      key_points: {
        type: "array",
        items: { type: "string" },
        minItems: 3,
        maxItems: 6
      },
      highlight_terms: {
        type: "array",
        items: { type: "string" },
        maxItems: 8
      },
      difficult_terms: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            term: { type: "string" },
            explanation_simple: { type: "string" }
          },
          required: ["term", "explanation_simple"]
        },
        maxItems: 8
      },
      next_steps: {
        type: "array",
        items: { type: "string" },
        maxItems: 6
      },
      page_count: { type: "integer", minimum: 1 },
      page_summaries: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            page: { type: "integer", minimum: 1 },
            summary: { type: "string" }
          },
          required: ["page", "summary"]
        },
        maxItems: 24
      },
      important_references: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            label: { type: "string" },
            value: { type: "string" },
            page: { type: "integer", minimum: 1 }
          },
          required: ["label", "value", "page"]
        },
        maxItems: 8
      },
      action_location_name: { type: ["string", "null"] },
      action_location_address: { type: ["string", "null"] },
      action_url: { type: ["string", "null"] },
      action_mode: {
        type: ["string", "null"],
        enum: ["online", "vor_ort", "per_post", "telefon", "unbekannt", null]
      },
      risks_if_ignored: { type: ["string", "null"] },
      contract_action_points: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: {
              type: "string",
              enum: ["duration", "termination", "auto_renewal", "costs", "liability", "user_duties", "provider_rights", "privacy", "unclear_language", "other"]
            },
            priority: {
              type: "string",
              enum: ["high", "medium", "general"]
            }
          },
          required: ["category", "priority"]
        },
        maxItems: 8
      },
      contract_duration: { type: ["string", "null"] },
      contract_notice_period: { type: ["string", "null"] },
      contract_recurring_costs: { type: ["string", "null"] },
      contract_auto_renewal: { type: ["string", "null"] },
      contract_clarification_points: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: {
              type: "string",
              enum: ["duration", "termination", "auto_renewal", "costs", "liability", "user_duties", "provider_rights", "privacy", "unclear_language", "other"]
            },
            priority: {
              type: "string",
              enum: ["high", "medium", "general"]
            }
          },
          required: ["category", "priority"]
        },
        maxItems: 8
      },
      contract_flagged_clauses: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: {
              type: "string",
              enum: ["duration", "termination", "auto_renewal", "costs", "liability", "user_duties", "provider_rights", "privacy", "unclear_language", "other"]
            },
            secondary_categories: {
              type: "array",
              items: {
                type: "string",
                enum: ["duration", "termination", "auto_renewal", "costs", "liability", "user_duties", "provider_rights", "privacy", "unclear_language", "other"]
              },
              maxItems: 3
            },
            clause_summary_simple: { type: "string" },
            clause_reason_simple: { type: "string" },
            clause_risk_level: { type: "string", enum: ["low", "medium", "elevated"] },
            source_excerpt: { type: ["string", "null"] },
            source_page: { type: ["integer", "null"], minimum: 1 },
            source_section: { type: ["string", "null"] },
            source_context_label: { type: ["string", "null"] },
            source_context_reason: { type: ["string", "null"] }
          },
          required: [
            "category",
            "secondary_categories",
            "clause_summary_simple",
            "clause_reason_simple",
            "clause_risk_level",
            "source_excerpt",
            "source_page",
            "source_section",
            "source_context_label",
            "source_context_reason"
          ]
        },
        maxItems: 8
      },
      contract_flagged_points: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            title: { type: "string" },
            explanation_simple: { type: "string" },
            tone: { type: "string", enum: ["notice", "watch", "caution"] }
          },
          required: ["title", "explanation_simple", "tone"]
        },
        maxItems: 6
      },
      contract_possible_disadvantages: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: {
              type: "string",
              enum: ["duration", "termination", "auto_renewal", "costs", "liability", "user_duties", "provider_rights", "privacy", "unclear_language", "other"]
            },
            priority: {
              type: "string",
              enum: ["high", "medium", "general"]
            }
          },
          required: ["category", "priority"]
        },
        maxItems: 8
      },
      contract_pre_signing_checklist: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            category: {
              type: "string",
              enum: ["duration", "termination", "auto_renewal", "costs", "liability", "user_duties", "provider_rights", "privacy", "unclear_language", "other"]
            },
            priority: {
              type: "string",
              enum: ["high", "medium", "general"]
            }
          },
          required: ["category", "priority"]
        },
        maxItems: 8
      },
      contract_watch_out_for: {
        type: "array",
        items: { type: "string" },
        maxItems: 6
      },
      contract_watch_out_points: {
        type: "array",
        items: { type: "string" },
        maxItems: 6
      },
      contract_unclear_points: {
        type: "array",
        items: { type: "string" },
        maxItems: 6
      },
      contract_risk_level_overview: { type: ["string", "null"] },
      source_excerpt: { type: ["string", "null"] },
      readability: { type: "string", enum: ["readable", "partial", "unreadable"] },
      readability_reason: { type: ["string", "null"] }
    },
    required: [
      "sender",
      "document_type",
      "contract_type",
      "contract_parties",
      "subject",
      "summary_simple",
      "contract_summary_simple",
      "summary_simple_short",
      "summary_simple_long",
      "is_action_required",
      "deadline_date",
      "urgency",
      "key_points",
      "highlight_terms",
      "difficult_terms",
      "next_steps",
      "page_count",
      "page_summaries",
      "important_references",
      "action_location_name",
      "action_location_address",
      "action_url",
      "action_mode",
      "risks_if_ignored",
      "contract_action_points",
      "contract_duration",
      "contract_notice_period",
      "contract_recurring_costs",
      "contract_auto_renewal",
      "contract_clarification_points",
      "contract_flagged_clauses",
      "contract_flagged_points",
      "contract_possible_disadvantages",
      "contract_pre_signing_checklist",
      "contract_watch_out_for",
      "contract_watch_out_points",
      "contract_unclear_points",
      "contract_risk_level_overview",
      "source_excerpt",
      "readability",
      "readability_reason"
    ]
  };
}

function buildFileInput(document: DocumentRecord, buffer: Buffer) {
  const base64 = buffer.toString("base64");
  const mimeType = document.mime_type ?? "application/octet-stream";

  if (mimeType === "application/pdf") {
    return {
      type: "input_file" as const,
      filename: document.original_filename,
      file_data: `data:${mimeType};base64,${base64}`
    };
  }

  if (mimeType.startsWith("image/")) {
    return {
      type: "input_image" as const,
      image_url: `data:${mimeType};base64,${base64}`,
      detail: "auto" as const
    };
  }

  throw new Error("Dieses Dateiformat kann aktuell nicht analysiert werden.");
}

function clipExcerpt(value: string | null) {
  if (!value) {
    return null;
  }

  return value.length <= 4000 ? value : `${value.slice(0, 3999).trimEnd()}...`;
}

function buildUnreadablePdfFallback(processed: Awaited<ReturnType<typeof processDocumentForAnalysis>>): DocumentAnalysisResult {
  return {
    sender: null,
    document_type: "PDF-Dokument",
    contract_type: null,
    contract_parties: [],
    subject: null,
    summary_simple: "Dieses PDF konnte noch nicht zuverlässig gelesen werden.",
    contract_summary_simple: null,
    summary_simple_short: "Dieses PDF konnte noch nicht zuverlässig gelesen werden.",
    summary_simple_long:
      "Das Dokument scheint wenig direkt lesbaren Text zu enthalten, zum Beispiel weil es ein Scan oder Foto im PDF ist. Bitte lade möglichst eine klarere Datei oder ein einzelnes Bild hoch.",
    is_action_required: null,
    deadline_date: null,
    urgency: null,
    key_points: ["PDF enthält kaum lesbaren Text", "Analyse deshalb unsicher", "Bitte klarere Datei hochladen"],
    highlight_terms: [],
    difficult_terms: [],
    next_steps: ["Wenn möglich eine klarere PDF oder ein gut lesbares Bild hochladen"],
    page_count: Math.max(processed.pageCount, 1),
    page_summaries: [],
    important_references: [],
    action_location_name: null,
    action_location_address: null,
    action_url: null,
    action_mode: null,
    risks_if_ignored: null,
    contract_action_points: [],
    contract_duration: null,
    contract_notice_period: null,
    contract_recurring_costs: null,
    contract_auto_renewal: null,
    contract_clarification_points: [],
    contract_flagged_clauses: [],
    contract_flagged_points: [],
    contract_possible_disadvantages: [],
    contract_pre_signing_checklist: [],
    contract_watch_out_for: [],
    contract_watch_out_points: [],
    contract_unclear_points: [],
    contract_risk_level_overview: null,
    source_excerpt: clipExcerpt(processed.extractedText),
    readability: "unreadable",
    readability_reason:
      "Das PDF enthält zu wenig direkt lesbaren Text. Bitte nutze wenn möglich eine klarere PDF oder lade die Seiten als gut lesbares Bild hoch."
  };
}

export async function analyzeDocumentWithOpenAI(document: DocumentRecord, buffer: Buffer) {
  const env = getServerEnv();
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const processed = await processDocumentForAnalysis(document, buffer);

  const promptPrefix =
    "Analysiere dieses Dokument fuer eine Privatperson in Deutschland. Schreibe in sehr einfachem, ruhigem Deutsch mit echten Umlauten und natuerlichem ss. Klinge hilfreich, klar und stressarm. Erfinde nichts. Wenn etwas nicht sicher ist, gib null oder formuliere vorsichtig. summary_simple_short soll 2 bis 3 kurze Saetze enthalten. summary_simple_long darf etwas mehr Kontext geben, aber muss leicht verstaendlich bleiben. page_count muss die bekannte Seitenanzahl widerspiegeln. page_summaries sollen pro erkannter Seite eine kurze Zusammenfassung liefern. important_references sollen nur sichere Hinweise mit Seitenbezug enthalten, zum Beispiel Frist, Betrag, Termin oder Widerspruchshinweis. Wenn das Dokument wahrscheinlich ein Vertrag oder vertragsnahe Bedingungen sind, setze document_type auf Vertrag, fuelle contract_type moeglichst passend aus und erkenne typische Klauselarten auf hoher Ebene. contract_flagged_clauses soll konkrete, kurze Klauselhinweise mit Kategorie, moeglichen Nebenkategorien, einfacher Erklaerung und vorsichtigem Risikoniveau enthalten. Jede auffaellige Klausel soll wenn moeglich auch einen kurzen woertlichen oder fast woertlichen source_excerpt, einen source_page Bezug, eine source_section, einen source_context_label und einen sehr kurzen source_context_reason enthalten. Der Ausschnitt soll nur der relevante Satz oder kleine Absatz sein. Erkenne dabei vor allem Laufzeit, Kuendigung, automatische Verlaengerung, Kosten, Haftung, Pflichten des Nutzers, Rechte der Gegenseite, Datenschutz, unklare Sprache und sonstige Auffaelligkeiten. contract_flagged_points, contract_watch_out_for, contract_watch_out_points und contract_unclear_points muessen in einfacher Sprache bleiben und duerfen keine definitive Rechtsberatung behaupten. Wenn es kein Vertrag ist, lasse alle contract_* Felder leer oder null.";

  const content: Array<Record<string, unknown>> = [
    {
      type: "input_text" as const,
      text: processed.useStructuredText
        ? `${promptPrefix}

Bekannte Seitenanzahl: ${processed.pageCount}
Dokumentname: ${document.original_filename}

Hier ist der extrahierte Text, seitenweise geordnet:

${processed.extractedText}`
        : `${promptPrefix}

Bekannte Seitenanzahl: ${processed.pageCount}
Dokumentname: ${document.original_filename}

Nutze das beigefügte Dokument direkt. Wenn der Text nur teilweise lesbar ist, setze readability auf partial oder unreadable und erkläre kurz warum.`
    }
  ];

  if (!processed.useStructuredText) {
    content.push(buildFileInput(document, buffer));
  }

  try {
    const response = await client.responses.create({
      model: env.OPENAI_MODEL ?? "gpt-5.4",
      instructions:
        "Du analysierst offizielle Schreiben und Vertraege fuer BureauCare. Gib die wichtigsten Fakten zuerst an: Wer schreibt, worum es geht, ob etwas getan werden muss, bis wann und wie dringend es ist. summary_simple ist die Hauptzusammenfassung. key_points muessen sehr kurz sein. next_steps sollen alltagstauglich und konkret sein. difficult_terms sollen schwierige Begriffe mit sehr einfacher Erklaerung liefern. action_location_name, action_location_address, action_url und action_mode nur ausfuellen, wenn das verlaesslich im Dokument steht. Bei Vertraegen sollst du auffaellige Punkte nur vorsichtig beschreiben, zum Beispiel als streng, unklar oder nachteilig wirkend. contract_flagged_clauses muessen klar einer oder mehreren Risikokategorien zugeordnet werden und moeglichst einen kleinen, gut lesbaren Textausschnitt aus dem Vertrag mitliefern. Behaupte nie, dass eine Klausel sicher unwirksam oder rechtswidrig ist.",
      input: [
        {
          role: "user",
          content: content as never
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "bureaucare_document_analysis",
          strict: true,
          schema: buildJsonSchema()
        }
      }
    });

    const rawText = response.output_text;

    if (!rawText) {
      throw new Error("Die Analyse ist leer zurückgekommen.");
    }

    const parsed = analysisSchema.safeParse(JSON.parse(rawText));

    if (!parsed.success) {
      throw new Error("Die Analyseantwort war unvollständig.");
    }

    const pageCount = Math.max(parsed.data.page_count, processed.pageCount || 1);

    return enrichActionLocation(
      buildContractGuidance(
        normalizeContractFields({
          ...parsed.data,
          page_count: pageCount,
          contract_flagged_clauses: parsed.data.contract_flagged_clauses
            .map((item) => ({
              ...item,
              source_page: item.source_page && item.source_page <= pageCount ? item.source_page : null
            })),
          page_summaries: parsed.data.page_summaries.filter((item) => item.page <= pageCount).sort((a, b) => a.page - b.page),
          important_references: parsed.data.important_references.filter((item) => item.page <= pageCount).sort((a, b) => a.page - b.page),
          source_excerpt: parsed.data.source_excerpt ?? clipExcerpt(processed.extractedText)
        })
      ),
      processed.extractedText
    );
  } catch (error) {
    console.error("OpenAI document analysis failed", {
      documentId: document.id,
      mimeType: document.mime_type,
      pageCount: processed.pageCount,
      useStructuredText: processed.useStructuredText,
      extractedTextLength: processed.extractedText?.length ?? 0,
      error
    });

    if (document.mime_type === "application/pdf" && !processed.useStructuredText && (processed.extractedText?.length ?? 0) > 0) {
      return buildUnreadablePdfFallback(processed);
    }

    throw error;
  }
}

