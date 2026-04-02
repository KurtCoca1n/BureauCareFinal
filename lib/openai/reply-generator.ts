import OpenAI from "openai";
import { z } from "zod";

import { getServerEnv } from "@/lib/env";
import { getLanguageLabel, normalizePreferredLanguage } from "@/lib/languages";
import type { DocumentAnalysisRecord, DocumentRecord } from "@/lib/types";

const replySchema = z.object({
  subject_line: z.string().nullable(),
  reply_text_de: z.string().min(80).max(4000),
  reply_text_translated: z.string().nullable(),
  key_intent: z.string().min(1).max(180)
});

export type ReplyGenerationResult = z.infer<typeof replySchema>;

function buildReplyJsonSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      subject_line: { type: ["string", "null"] },
      reply_text_de: { type: "string" },
      reply_text_translated: { type: ["string", "null"] },
      key_intent: { type: "string" }
    },
    required: ["subject_line", "reply_text_de", "reply_text_translated", "key_intent"]
  };
}

export async function generateReplyWithOpenAI({
  document,
  analysis,
  tone,
  toneDetails,
  formatType,
  includeSignature,
  profileName,
  preferredLanguage
}: {
  document: DocumentRecord;
  analysis: DocumentAnalysisRecord;
  tone: string;
  toneDetails?: string | null;
  formatType: "brief" | "email";
  includeSignature: boolean;
  profileName: string | null;
  preferredLanguage: string | null;
}) {
  const env = getServerEnv();
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const languageCode = normalizePreferredLanguage(preferredLanguage);
  const shouldTranslate = languageCode !== "de";
  const targetLanguageLabel = getLanguageLabel(languageCode);

  const effectiveTone = [tone, toneDetails].filter(Boolean).join(" + ");

  const response = await client.responses.create({
    model: env.OPENAI_MODEL ?? "gpt-5.4",
    instructions:
      "Du schreibst für BureauCare eine direkt nutzbare Antwort auf ein offizielles Schreiben. Verwende natürliches Deutsch mit echten Umlauten. Sei höflich, klar und formal brauchbar. Erfinde keine Fakten. Wenn Details fehlen, formuliere allgemein und vorsichtig. Halte den Text eher kurz. Widerspruch oder Einspruch nur allgemein und ohne erfundene Begründungen. Wenn zusätzlich übersetzt wird, muss die Übersetzung natürlich, freundlich und einfach verständlich klingen.",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Erstelle eine ${formatType === "email" ? "E-Mail" : "schriftliche Antwort"} mit dem Ton "${effectiveTone || "neutral"}".

Dokumentname: ${document.original_filename}
Absender: ${analysis.sender ?? "unbekannt"}
Thema: ${analysis.subject ?? "unbekannt"}
Dokumenttyp: ${analysis.document_type ?? "unbekannt"}
Frist: ${analysis.deadline_date ?? "keine klare Frist"}
Handlungsbedarf: ${analysis.is_action_required === null ? "unklar" : analysis.is_action_required ? "ja" : "nein"}
Dringlichkeit: ${analysis.urgency ?? "unklar"}
Kurze Erklärung: ${analysis.summary_simple_short ?? analysis.summary_simple}
Längere Erklärung: ${analysis.summary_simple_long ?? analysis.summary_simple}
Nächste Schritte: ${(analysis.next_steps ?? []).join(" | ")}
Risiken: ${analysis.risks_if_ignored ?? "nicht klar"}

Berücksichtige neben dem Standardton auch diesen zusätzlichen Wunsch: ${toneDetails || "kein zusätzlicher Wunsch"}.
Die Antwort soll direkt nutzbar sein. Keine Platzhalter für unbekannte Fakten. Wenn etwas nicht belegt ist, bitte allgemein um Prüfung, Fristverlängerung oder Rückmeldung statt Details zu behaupten.
${includeSignature && profileName ? `Füge am Ende die Signatur "Mit freundlichen Grüßen,\\n${profileName}" ein.` : "Nutze keine persönliche Signatur."}
${shouldTranslate ? `Erstelle zusätzlich eine sinngleiche Übersetzung in ${targetLanguageLabel}.` : "Erstelle keine zusätzliche Übersetzung."}`
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "bureaucare_reply_generation",
        strict: true,
        schema: buildReplyJsonSchema()
      }
    }
  });

  const rawText = response.output_text;

  if (!rawText) {
    throw new Error("Die Antwortgenerierung war leer.");
  }

  const parsed = replySchema.safeParse(JSON.parse(rawText));

  if (!parsed.success) {
    throw new Error("Die Antwortgenerierung war unvollständig.");
  }

  return parsed.data;
}
