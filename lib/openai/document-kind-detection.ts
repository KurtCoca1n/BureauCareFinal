import OpenAI from "openai";
import { documentKindDetectionSchema, type DocumentKindDetection } from "@/lib/document-kind";
import { processDocumentForAnalysis } from "@/lib/document-processing";
import { getServerEnv } from "@/lib/env";
import type { DocumentRecord } from "@/lib/types";

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

  throw new Error("Dieses Dateiformat kann aktuell nicht eingestuft werden.");
}

function buildKindDetectionJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      kind: {
        type: "string",
        enum: [
          "contract",
          "authority_notice",
          "invoice",
          "reminder",
          "termination",
          "form",
          "travel_booking",
          "other"
        ]
      },
      confidence: { type: "string", enum: ["low", "medium", "high"] },
      priority_band: {
        type: "string",
        enum: ["urgent", "important", "relevant", "informative", "unclear"]
      },
      deadline_situation: {
        type: "string",
        enum: ["date_seen", "time_sensitive", "no_clear_hint", "unclear"]
      },
      deadline_date_iso: { type: ["string", "null"] },
      signals: {
        type: "array",
        items: { type: "string" },
        maxItems: 6
      },
      suggested_modules: {
        type: "array",
        items: {
          type: "string",
          enum: ["contract_scanner", "money_back_finder", "notice_scanner", "document_summary", "deadlines_tasks"]
        },
        maxItems: 5
      }
    },
    required: [
      "kind",
      "confidence",
      "priority_band",
      "deadline_situation",
      "deadline_date_iso",
      "signals",
      "suggested_modules"
    ]
  };
}

export async function classifyDocumentKindWithOpenAI(document: DocumentRecord, buffer: Buffer): Promise<DocumentKindDetection> {
  const env = getServerEnv();
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const processed = await processDocumentForAnalysis(document, buffer);

  const model = process.env.OPENAI_MODEL_KIND ?? "gpt-4o-mini";

  const instructions =
    "Du stufst ein hochgeladenes Dokument fuer BureauCare (Privatpersonen in Deutschland) ein. " +
    "Antworte nur als JSON. Sei vorsichtig: confidence nur dann hoch, wenn typische Merkmale klar erkennbar sind. " +
    "kind: contract = Vertrag/AGB/Vereinbarung, authority_notice = Behoerde, Bescheid, amtliches Schreiben, invoice = Rechnung, " +
    "reminder = Mahnung, Zahlungsaufforderung, Inkasso, termination = Kuendigung oder Beendigung, " +
    "form = Formular, Antrag, Merkblatt zum Ausfuellen, travel_booking = Flug, Bahn, Hotel, Ticket, Buchung, " +
    "other = sonstiges oder unklar. " +
    "priority_band: urgent = zeitlicher Druck, Mahnung, klare Androhung; important = Behoerdenbescheid oder aehnlich relevant; " +
    "relevant = Vertrag oder Zahlungsthema ohne Panik; informative = vorwiegend zur Info; unclear = wenig erkennbar. " +
    "deadline_situation: date_seen = konkretes Datum eindeutig, time_sensitive = Frist/Reaktion wahrscheinlich aber Datum unklar, " +
    "no_clear_hint = kein Fristhinweis erkennbar, unclear = Dokument schwer einzuschaetzen. " +
    "deadline_date_iso: nur YYYY-MM-DD setzen wenn ein Datum klar im Dokument steht, sonst null. Niemals raten. " +
    "signals: 2 bis 4 kurze deutsche Stichworte (welche Merkmale du siehst). " +
    "suggested_modules: waehle passende Module aus: contract_scanner (Vertraege), money_back_finder (Erstattungen, Gebuehren), " +
    "notice_scanner (Behoerden/Bescheide), document_summary (allgemeine Erklaerung), deadlines_tasks (Fristen, To-dos). " +
    "Wenn kind authority_notice ist (Behoerde, Bescheid, amtliches Schreiben, Aufforderung, fristbezogene Stellen-Mitteilung), " +
    "MUSS suggested_modules mit notice_scanner beginnen.";

  const content: Array<Record<string, unknown>> = [
    {
      type: "input_text" as const,
      text: processed.useStructuredText
        ? `${instructions}

Dateiname: ${document.original_filename}
Seiten: ${processed.pageCount}

Extrahierter Text:
${processed.extractedText ?? ""}`
        : `${instructions}

Dateiname: ${document.original_filename}
Seiten: ${processed.pageCount}

Nutze das angehaengte Dokument direkt. Wenn wenig erkennbar ist, setze kind auf other, confidence auf low, priority_band und deadline_situation auf unclear und deadline_date_iso auf null.`
    }
  ];

  if (!processed.useStructuredText) {
    content.push(buildFileInput(document, buffer));
  }

  const response = await client.responses.create({
    model,
    instructions:
      "Du bist ein vorsichtiger Dokumenten-Classifier. Du gibst keine Rechtsberatung. Du erfindest keine Details. Wenn unsicher, waehle niedrigere confidence und other.",
    input: [
      {
        role: "user",
        content: content as never
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "bureaucare_document_kind",
        strict: true,
        schema: buildKindDetectionJsonSchema()
      }
    }
  });

  const rawText = response.output_text;
  if (!rawText) {
    throw new Error("Die Einordnung ist leer zurueckgekommen.");
  }

  const parsedJson = JSON.parse(rawText);
  const base = documentKindDetectionSchema.safeParse(parsedJson);

  if (!base.success) {
    throw new Error("Die Einordnung war unvollstaendig.");
  }

  return base.data;
}
