"use server";

import { revalidatePath } from "next/cache";

import { generateContractQuestionWithOpenAI } from "@/lib/openai/contract-question-generator";
import { createClient } from "@/lib/supabase/server";
import type { ContractClauseCategory, ContractQuestionFormat, ContractQuestionTone } from "@/lib/types";

export type GenerateContractQuestionState = {
  error: string;
  success: string;
  generatedQuestion?: {
    id: string;
    questionTextDe: string;
    questionTextTranslated?: string | null;
    translatedLanguageCode?: string | null;
    tone: ContractQuestionTone;
    messageType: ContractQuestionFormat;
    categories: ContractClauseCategory[];
  };
};

export async function generateContractQuestionAction(
  _: GenerateContractQuestionState,
  formData: FormData
): Promise<GenerateContractQuestionState> {
  const documentId = String(formData.get("documentId") ?? "").trim();
  const tone = (String(formData.get("questionTone") ?? "friendly").trim() || "friendly") as ContractQuestionTone;
  const messageType = (String(formData.get("messageType") ?? "email").trim() || "email") as ContractQuestionFormat;
  const selectedCategories = formData
    .getAll("selectedCategories")
    .map((value) => String(value).trim())
    .filter(Boolean) as ContractClauseCategory[];

  if (!documentId || !selectedCategories.length) {
    return { error: "Bitte waehle zuerst mindestens einen Punkt aus.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  const [{ data: document }, { data: analysis }, { data: profile }] = await Promise.all([
    supabase.from("documents").select("*").eq("id", documentId).eq("user_id", user.id).maybeSingle(),
    supabase.from("document_analyses").select("*").eq("document_id", documentId).maybeSingle(),
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle()
  ]);

  if (!document || !analysis) {
    return { error: "Dieses Vertragsdokument wurde nicht gefunden.", success: "" };
  }

  try {
    const generated = await generateContractQuestionWithOpenAI({
      document,
      analysis,
      tone,
      format: messageType,
      selectedCategories,
      preferredLanguage: profile?.preferred_language ?? null
    });

    const insertPayload = {
      document_id: documentId,
      question_tone: tone,
      message_type: messageType,
      question_context: { categories: selectedCategories },
      question_text_de: generated.question_text_de,
      question_text_translated: generated.question_text_translated,
      translated_language_code: profile?.preferred_language && profile.preferred_language !== "de" ? profile.preferred_language : null
    };

    const { data: inserted, error } = await supabase
      .from("contract_question_drafts")
      .insert(insertPayload)
      .select("*")
      .maybeSingle();

    if (error || !inserted) {
      return { error: "Die Rueckfrage konnte nicht gespeichert werden. Bitte versuche es erneut.", success: "" };
    }

    revalidatePath(`/app/documents/${documentId}`);

    return {
      error: "",
      success: "Rueckfrage erstellt.",
      generatedQuestion: {
        id: inserted.id,
        questionTextDe: inserted.question_text_de,
        questionTextTranslated: inserted.question_text_translated,
        translatedLanguageCode: inserted.translated_language_code,
        tone: (inserted.question_tone ?? tone) as ContractQuestionTone,
        messageType: (inserted.message_type ?? messageType) as ContractQuestionFormat,
        categories: selectedCategories
      }
    };
  } catch (error) {
    console.error("Contract question generation failed", { documentId, error });
    return {
      error: "Die Rueckfrage konnte gerade nicht erstellt werden. Bitte versuche es gleich noch einmal.",
      success: ""
    };
  }
}

