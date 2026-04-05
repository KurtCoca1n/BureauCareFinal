import OpenAI from "openai";
import { z } from "zod";

import { getServerEnv } from "@/lib/env";
import { getLanguageLabel, normalizePreferredLanguage } from "@/lib/languages";
import type {
  ContractClauseCategory,
  ContractQuestionFormat,
  ContractQuestionTone,
  DocumentAnalysisRecord,
  DocumentRecord
} from "@/lib/types";

const contractQuestionSchema = z.object({
  question_text_de: z.string().min(60).max(4000),
  question_text_translated: z.string().nullable(),
  subject_line: z.string().nullable()
});

function buildJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      question_text_de: { type: "string" },
      question_text_translated: { type: ["string", "null"] },
      subject_line: { type: ["string", "null"] }
    },
    required: ["question_text_de", "question_text_translated", "subject_line"]
  };
}

export async function generateContractQuestionWithOpenAI({
  document,
  analysis,
  tone,
  format,
  selectedCategories,
  preferredLanguage
}: {
  document: DocumentRecord;
  analysis: DocumentAnalysisRecord;
  tone: ContractQuestionTone;
  format: ContractQuestionFormat;
  selectedCategories: ContractClauseCategory[];
  preferredLanguage: string | null;
}) {
  const env = getServerEnv();
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const languageCode = normalizePreferredLanguage(preferredLanguage);
  const shouldTranslate = languageCode !== "de";
  const targetLanguageLabel = getLanguageLabel(languageCode);

  const selectedClauses = (analysis.contract_flagged_clauses ?? []).filter((clause) =>
    selectedCategories.includes(clause.category)
  );

  const clarificationCategories = new Set((analysis.contract_clarification_points ?? []).map((item) => item.category));

  const toneLabel =
    tone === "formal"
      ? "etwas formeller"
      : tone === "careful_firm"
        ? "vorsichtig, aber bestimmt"
        : tone === "factual"
          ? "sachlich"
          : "freundlich";

  const formatInstruction =
    format === "question_list"
      ? "Schreibe eine kurze Nachricht mit Einleitung und dann einer klar nummerierten Liste mit Rueckfragen."
      : format === "message"
        ? "Schreibe eine kurze formelle Nachricht zum Kopieren."
        : "Schreibe eine kurze, direkt nutzbare E-Mail.";

  const selectedContext =
    selectedClauses.length > 0
      ? selectedClauses
          .map(
            (clause) =>
              `Kategorie: ${clause.category}
Zusammenfassung: ${clause.clause_summary_simple}
Warum auffaellig: ${clause.clause_reason_simple}
Risikostufe: ${clause.clause_risk_level}
Sollte geklaert werden: ${clarificationCategories.has(clause.category) ? "ja" : "nein"}`
          )
          .join("\n\n")
      : selectedCategories.join(", ");

  const response = await client.responses.create({
    model: env.OPENAI_MODEL ?? "gpt-5.4",
    instructions:
      "Du schreibst fuer BureauCare kurze Rueckfragen zu Vertragsstellen. Formuliere ruhig, hoeflich, sachlich und klar. Keine Drohungen, keine aggressive Verhandlungssprache, keine Behauptung, dass etwas rechtswidrig oder unwirksam sei. Die Nachricht soll nur um Erklaerung, Klarstellung oder Bestaetigung bitten. Wenn mehrere Punkte ausgewaehlt sind, fasse sie ordentlich zusammen. Nutze natuerliches Deutsch mit echten Umlauten.",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Erstelle eine Rueckfrage zu einem Vertrag.

Dokumentname: ${document.original_filename}
Vertragsart: ${analysis.contract_type ?? analysis.document_type ?? "Vertrag"}
Kurzfassung: ${analysis.contract_summary_simple ?? analysis.summary_simple}
Gewuenschter Ton: ${toneLabel}
Format: ${format}
Anweisung zum Format: ${formatInstruction}

Diese Punkte sollen angesprochen werden:
${selectedContext}

Die Nachricht soll fuer eine normale Privatperson in Deutschland brauchbar sein.
Bitte kurz bleiben, aber konkret.
Keine rechtlichen Urteile.
Wenn sinnvoll, beginne mit einer kurzen freundlichen Einleitung wie:
"Ich haette noch ein paar Rueckfragen zu dem Vertrag."
${shouldTranslate ? `Erstelle zusaetzlich eine sinngleiche Uebersetzung in ${targetLanguageLabel}.` : "Erstelle keine zusaetzliche Uebersetzung."}`
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "bureaucare_contract_question",
        strict: true,
        schema: buildJsonSchema()
      }
    }
  });

  const rawText = response.output_text;
  if (!rawText) {
    throw new Error("Die Vertragsrueckfrage war leer.");
  }

  const parsed = contractQuestionSchema.safeParse(JSON.parse(rawText));
  if (!parsed.success) {
    throw new Error("Die Vertragsrueckfrage war unvollstaendig.");
  }

  return parsed.data;
}

