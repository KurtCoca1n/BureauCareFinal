"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { normalizePreferredLanguage } from "@/lib/languages";
import { LOCALE_COOKIE_NAME } from "@/lib/request-locale";
import { createClient } from "@/lib/supabase/server";

export type ProfileSettingsState = {
  error: string;
  success: string;
};

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
