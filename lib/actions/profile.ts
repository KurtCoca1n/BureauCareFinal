"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { normalizePreferredLanguage } from "@/lib/languages";
import { LOCALE_COOKIE_NAME } from "@/lib/request-locale";
import { createClient } from "@/lib/supabase/server";
import type { ReplyDefaultTone, ReplyTranslationMode } from "@/lib/types";

export type ProfileSettingsState = {
  error: string;
  success: string;
};

export type ProfileDetailsState = {
  error: string;
  success: string;
};

export type ReplySettingsState = {
  error: string;
  success: string;
};

function normalizeReplyDefaultTone(value: string | null | undefined): ReplyDefaultTone {
  switch ((value ?? "").trim()) {
    case "neutral":
    case "friendly":
    case "very_formal":
    case "simple":
      return value as ReplyDefaultTone;
    default:
      return "automatic";
  }
}

function normalizeReplyTranslationMode(value: string | null | undefined): ReplyTranslationMode {
  return (value ?? "").trim() === "german_only" ? "german_only" : "app_language";
}

export async function updateProfileSettingsAction(
  _: ProfileSettingsState,
  formData: FormData
): Promise<ProfileSettingsState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const preferredLanguage = normalizePreferredLanguage(String(formData.get("preferredLanguage") ?? "de"));

  if (!fullName) {
    return { error: "Bitte gib deinen Namen ein.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      preferred_language: preferredLanguage
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Die Einstellungen konnten nicht gespeichert werden.", success: "" };
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, preferredLanguage, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });

  revalidatePath("/app");
  revalidatePath("/app/settings");
  revalidatePath("/app/documents");

  return {
    error: "",
    success: "Deine Einstellungen wurden gespeichert."
  };
}

export async function updateProfileDetailsAction(
  _: ProfileDetailsState,
  formData: FormData
): Promise<ProfileDetailsState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  const phoneNumberRaw = String(formData.get("phoneNumber") ?? "").trim();
  const phoneNumber = phoneNumberRaw || null;
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  if (!firstName || !lastName) {
    return { error: "Bitte gib Vorname und Nachname ein.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      phone_number: phoneNumber
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Dein Profil konnte nicht gespeichert werden.", success: "" };
  }

  const { error: authUpdateError } = await supabase.auth.updateUser({
    data: {
      first_name: firstName,
      last_name: lastName,
      full_name: fullName,
      phone_number: phoneNumber
    }
  });

  if (authUpdateError) {
    console.error("Updating auth profile metadata failed", { userId: user.id, authUpdateError });
  }

  revalidatePath("/app");
  revalidatePath("/app/settings");
  revalidatePath("/app/documents");
  revalidatePath("/app/documents/[id]/reply", "page");
  revalidatePath("/app/cases");

  return {
    error: "",
    success: "Dein Profil wurde gespeichert."
  };
}

export async function updateReplySettingsAction(
  _: ReplySettingsState,
  formData: FormData
): Promise<ReplySettingsState> {
  const defaultTone = normalizeReplyDefaultTone(String(formData.get("defaultTone") ?? "automatic"));
  const styleNote = String(formData.get("styleNote") ?? "").trim() || null;
  const includeSignature = String(formData.get("includeSignature") ?? "") === "1";
  const signature = String(formData.get("signature") ?? "").trim() || null;
  const translationMode = normalizeReplyTranslationMode(String(formData.get("translationMode") ?? "app_language"));

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      reply_default_tone: defaultTone,
      reply_style_note: styleNote,
      reply_include_signature: includeSignature,
      reply_signature: signature,
      reply_translation_mode: translationMode
    })
    .eq("id", user.id);

  if (error) {
    return { error: "Deine Antwort-Einstellungen konnten nicht gespeichert werden.", success: "" };
  }

  const { error: authUpdateError } = await supabase.auth.updateUser({
    data: {
      reply_default_tone: defaultTone,
      reply_style_note: styleNote,
      reply_include_signature: includeSignature,
      reply_signature: signature,
      reply_translation_mode: translationMode
    }
  });

  if (authUpdateError) {
    console.error("Updating auth reply settings metadata failed", { userId: user.id, authUpdateError });
  }

  revalidatePath("/app");
  revalidatePath("/app/settings");
  revalidatePath("/app/documents");
  revalidatePath("/app/documents/[id]/reply", "page");

  return {
    error: "",
    success: "Deine Antwort-Einstellungen wurden gespeichert."
  };
}
