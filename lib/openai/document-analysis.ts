import OpenAI from "openai";
import { z } from "zod";

import { processDocumentForAnalysis } from "@/lib/document-processing";
import { getServerEnv } from "@/lib/env";
import type { DocumentRecord } from "@/lib/types";

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

const analysisSchema = z.object({
  sender: z.string().nullable(),
  document_type: z.string().nullable(),
  subject: z.string().nullable(),
  summary_simple: z.string().min(1),
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

function buildJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      sender: { type: ["string", "null"] },
      document_type: { type: ["string", "null"] },
      subject: { type: ["string", "null"] },
      summary_simple: { type: "string" },
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
      source_excerpt: { type: ["string", "null"] },
      readability: { type: "string", enum: ["readable", "partial", "unreadable"] },
      readability_reason: { type: ["string", "null"] }
    },
    required: [
      "sender",
      "document_type",
      "subject",
      "summary_simple",
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

  return value.length <= 4000 ? value : `${value.slice(0, 3999).trimEnd()}…`;
}

function buildUnreadablePdfFallback(processed: Awaited<ReturnType<typeof processDocumentForAnalysis>>): DocumentAnalysisResult {
  return {
    sender: null,
    document_type: "PDF-Dokument",
    subject: null,
    summary_simple: "Dieses PDF konnte noch nicht zuverlässig gelesen werden.",
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
    "Analysiere dieses Dokument für eine Privatperson in Deutschland. Schreibe in sehr einfachem, ruhigem Deutsch mit echten Umlauten und natürlichem ß. Klinge hilfreich, klar und stressarm. Erfinde nichts. Wenn etwas nicht sicher ist, gib null oder formuliere vorsichtig. summary_simple_short soll 2 bis 3 kurze Sätze enthalten. summary_simple_long darf etwas mehr Kontext geben, aber muss leicht verständlich bleiben. page_count muss die bekannte Seitenanzahl widerspiegeln. page_summaries sollen pro erkannter Seite eine kurze Zusammenfassung liefern. important_references sollen nur sichere Hinweise mit Seitenbezug enthalten, zum Beispiel Frist, Betrag, Termin oder Widerspruchshinweis.";

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
        "Du analysierst offizielle Schreiben für BureauCare. Gib die wichtigsten Fakten zuerst an: Wer schreibt, worum es geht, ob etwas getan werden muss, bis wann und wie dringend es ist. summary_simple ist die Hauptzusammenfassung. key_points müssen sehr kurz sein. next_steps sollen alltagstauglich und konkret sein. difficult_terms sollen schwierige Begriffe mit sehr einfacher Erklärung liefern. action_location_name, action_location_address, action_url und action_mode nur ausfüllen, wenn das verlässlich im Dokument steht.",
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

    return enrichActionLocation({
      ...parsed.data,
      page_count: pageCount,
      page_summaries: parsed.data.page_summaries.filter((item) => item.page <= pageCount).sort((a, b) => a.page - b.page),
      important_references: parsed.data.important_references.filter((item) => item.page <= pageCount).sort((a, b) => a.page - b.page),
      source_excerpt: parsed.data.source_excerpt ?? clipExcerpt(processed.extractedText)
    }, processed.extractedText);
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
