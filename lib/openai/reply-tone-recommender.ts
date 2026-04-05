import OpenAI from "openai";
import { z } from "zod";

import { getServerEnv } from "@/lib/env";
import { getReplyToneRecommendation, type ReplyToneRecommendation } from "@/lib/reply-tone";
import type { DocumentAnalysisRecord } from "@/lib/types";

const replyToneSchema = z.object({
  tone: z.string().min(1),
  toneDetails: z.string().max(160),
  reason: z.string().max(280),
  confidence: z.enum(["high", "medium", "low"])
});

function buildReplyToneSchema() {
  return {
    type: "object",
    additionalProperties: false,
      properties: {
        tone: { type: "string" },
        toneDetails: { type: "string" },
        reason: { type: "string" },
        confidence: { type: "string", enum: ["high", "medium", "low"] }
      },
    required: ["tone", "toneDetails", "reason", "confidence"]
  };
}

function buildDisplayLabel(tone: string, toneDetails: string) {
  return toneDetails ? `${tone} + ${toneDetails}` : tone;
}

export async function getReplyToneRecommendationWithAI({
  analysis,
  locale,
  allowedTones
}: {
  analysis: Pick<
    DocumentAnalysisRecord,
    | "urgency"
    | "is_action_required"
    | "subject"
    | "next_steps"
    | "summary_simple"
    | "summary_simple_long"
    | "required_action"
    | "risks_if_ignored"
    | "sender"
    | "document_type"
  >;
  locale: string;
  allowedTones: string[];
}): Promise<ReplyToneRecommendation> {
  const fallback = getReplyToneRecommendation(analysis, locale);

  try {
    const env = getServerEnv();
    const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

    const response = await client.responses.create({
      model: env.OPENAI_MODEL ?? "gpt-5.4",
      instructions:
        "Du waehlst fuer BureauCare nur den passendsten Antwortton fuer ein amtliches Schreiben. Bleibe vorsichtig, sachlich und zuverlaessig. Gib genau einen Hauptton aus der erlaubten Liste zurueck. toneDetails soll kurz erklaeren, wie der Text zusaetzlich klingen soll, zum Beispiel kurz, direkt, ruhig oder loesungsorientiert. reason soll in einfacher Sprache kurz erklaeren, warum dieser Ton hier passt. Erfinde keine harten Zusagen.",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `Waehle den passendsten Antwortton fuer dieses Dokument.

Erlaubte Haupttoene:
${allowedTones.join(" | ")}

Absender: ${analysis.sender ?? "unbekannt"}
Dokumenttyp: ${analysis.document_type ?? "unbekannt"}
Betreff: ${analysis.subject ?? "unbekannt"}
Handlungsbedarf: ${analysis.is_action_required === null ? "unklar" : analysis.is_action_required ? "ja" : "nein"}
Dringlichkeit: ${analysis.urgency ?? "unklar"}
Kurze Zusammenfassung: ${analysis.summary_simple ?? "unbekannt"}
Lange Zusammenfassung: ${analysis.summary_simple_long ?? "unbekannt"}
Naechste Schritte: ${(analysis.next_steps ?? []).join(" | ")}
Gefahr wenn ignoriert: ${analysis.risks_if_ignored ?? "unklar"}
Angeforderte Handlung: ${analysis.required_action ?? "unklar"}

Waehle lieber einen vorsichtigen, belastbaren Ton als einen uebertrieben genauen.`
            }
          ]
        }
      ],
      text: {
        format: {
          type: "json_schema",
          name: "bureaucare_reply_tone",
          strict: true,
          schema: buildReplyToneSchema()
        }
      }
    });

    const rawText = response.output_text;
    if (!rawText) {
      return fallback;
    }

    const parsed = replyToneSchema.safeParse(JSON.parse(rawText));
    if (!parsed.success) {
      return fallback;
    }

    const resolvedTone = allowedTones.includes(parsed.data.tone) ? parsed.data.tone : fallback.tone;
    const toneDetails = parsed.data.toneDetails.trim();

    return {
      tone: resolvedTone,
      toneDetails,
      displayLabel: buildDisplayLabel(resolvedTone, toneDetails),
      reason: parsed.data.reason.trim() || fallback.reason
    };
  } catch (error) {
    console.error("Reply tone recommendation failed", { error });
    return fallback;
  }
}
