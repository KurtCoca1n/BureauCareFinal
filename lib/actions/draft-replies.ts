"use server";

import { revalidatePath } from "next/cache";

import { createCaseEvent } from "@/lib/case-events";
import { normalizePreferredLanguage } from "@/lib/languages";
import { generateReplyWithOpenAI } from "@/lib/openai/reply-generator";
import { getReplyToneRecommendation, type ReplyToneRecommendation } from "@/lib/reply-tone";
import { createClient } from "@/lib/supabase/server";
import { recordUsageEvent } from "@/lib/usage";

export type DraftReplyState = {
  error: string;
  success: string;
  recommendedTone?: ReplyToneRecommendation;
  generatedReply?: {
    primaryId: string;
    translatedId?: string;
    tone: string;
    formatType: string;
    replyTextDe: string;
    replyTextTranslated?: string | null;
    translatedLanguage?: string | null;
  };
};

export async function generateDraftReplyAction(_: DraftReplyState, formData: FormData): Promise<DraftReplyState> {
  const documentId = String(formData.get("documentId") ?? "").trim();
  const tone = String(formData.get("tone") ?? "").trim();
  const toneDetails = String(formData.get("toneDetails") ?? "").trim();
  const recommendedToneTone = String(formData.get("recommendedToneTone") ?? "").trim();
  const recommendedToneDetails = String(formData.get("recommendedToneDetails") ?? "").trim();
  const formatType = String(formData.get("formatType") ?? "brief").trim() as "brief" | "email";
  const includeSignature = String(formData.get("includeSignature") ?? "") === "1";

  if (!documentId || (!tone && !toneDetails)) {
    return { error: "Bitte waehle zuerst einen Antwortton aus.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!document) {
    return { error: "Dieses Dokument wurde nicht gefunden oder gehoert dir nicht.", success: "" };
  }

  const { data: analysis } = await supabase.from("document_analyses").select("*").eq("document_id", documentId).maybeSingle();
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).maybeSingle();

  if (!analysis?.summary_simple) {
    return { error: "Bitte analysiere das Dokument zuerst, bevor du eine Antwort erstellst.", success: "" };
  }

  const recommendedTone =
    recommendedToneTone || recommendedToneDetails
      ? {
          tone: recommendedToneTone || getReplyToneRecommendation(analysis, profile?.preferred_language ?? "de").tone,
          toneDetails: recommendedToneDetails,
          displayLabel: [recommendedToneTone, recommendedToneDetails].filter(Boolean).join(" + ")
        }
      : getReplyToneRecommendation(analysis, profile?.preferred_language ?? "de");

  try {
    const generated = await generateReplyWithOpenAI({
      document,
      analysis,
      tone,
      toneDetails,
      formatType,
      includeSignature,
      profileName: profile?.full_name ?? null,
      preferredLanguage: profile?.preferred_language ?? null
    });

    const now = new Date().toISOString();
    const savedToneLabel = [tone, toneDetails].filter(Boolean).join(" + ") || tone;
    const inserts = [
      {
        document_id: documentId,
        tone: savedToneLabel,
        format_type: formatType,
        language_code: "de",
        reply_text: generated.reply_text_de,
        updated_at: now
      }
    ];

    const preferredLanguage = normalizePreferredLanguage(profile?.preferred_language);

    if (generated.reply_text_translated && preferredLanguage !== "de") {
      inserts.push({
        document_id: documentId,
        tone: savedToneLabel,
        format_type: formatType,
        language_code: preferredLanguage,
        reply_text: generated.reply_text_translated,
        updated_at: now
      });
    }

    const { data: insertedReplies, error: insertError } = await supabase
      .from("draft_replies")
      .insert(inserts)
      .select("id, tone, format_type, language_code, reply_text");

    if (insertError || !insertedReplies?.length) {
      return { error: "Der Antwortentwurf konnte nicht gespeichert werden. Bitte versuche es erneut.", success: "" };
    }

    const germanReply = insertedReplies.find((reply) => reply.language_code === "de") ?? insertedReplies[0];
    const translatedReply = insertedReplies.find((reply) => reply.language_code !== "de");

    await recordUsageEvent({
      userId: user.id,
      eventType: "reply_generated",
      documentId
    });

    await supabase.from("documents").update({ status: "antwort_erstellt" }).eq("id", documentId).eq("user_id", user.id);

    if (document.case_id) {
      await supabase.from("cases").update({ status: "open", updated_at: now }).eq("id", document.case_id);
      await createCaseEvent({
        caseId: document.case_id,
        documentId,
        eventType: "reply_created",
        note: `Antwortentwurf im Ton "${savedToneLabel || "Eigener Wunsch"}" erstellt.`
      });
    }

    revalidatePath(`/app/documents/${documentId}`);
    revalidatePath(`/app/documents/${documentId}/reply`);
    revalidatePath("/app/cases");

    return {
      error: "",
      success: "Antwort erfolgreich erstellt.",
      recommendedTone,
      generatedReply: {
        primaryId: germanReply.id,
        translatedId: translatedReply?.id,
        tone: germanReply.tone ?? savedToneLabel,
        formatType: germanReply.format_type ?? formatType,
        replyTextDe: germanReply.reply_text,
        replyTextTranslated: translatedReply?.reply_text ?? null,
        translatedLanguage: translatedReply?.language_code ?? null
      }
    };
  } catch (error) {
    console.error("Reply generation failed", { documentId, error });
    return {
      error: "Die Antwort konnte gerade nicht erstellt werden. Bitte versuche es in einem Moment erneut.",
      success: "",
      recommendedTone
    };
  }
}
