"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { normalizePreferredLanguage } from "@/lib/languages";
import { ensureProfile } from "@/lib/profile";
import { LOCALE_COOKIE_NAME } from "@/lib/request-locale";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error: string;
  success: string;
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export async function loginAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const nextPath = getString(formData, "next") || "/app";

  if (!email || !password) {
    return { error: "Bitte E-Mail und Passwort eingeben.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: error.message, success: "" };
  }

  if (user) {
    const profile = await ensureProfile(user);
    const cookieStore = await cookies();
    cookieStore.set(LOCALE_COOKIE_NAME, normalizePreferredLanguage(profile?.preferred_language ?? user.user_metadata?.preferred_language), {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  revalidatePath("/", "layout");
  const safeNextPath = (nextPath.startsWith("/app") ? nextPath : "/app") as Route;
  redirect(safeNextPath);
}

export async function signupAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const fullName = getString(formData, "fullName");
  const preferredLanguage = normalizePreferredLanguage(getString(formData, "preferredLanguage") || "de");

  if (!email || !password || !fullName) {
    return { error: "Bitte alle Pflichtfelder ausfüllen.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        preferred_language: preferredLanguage
      }
    }
  });

  if (error) {
    return { error: error.message, success: "" };
  }

  if (user) {
    await ensureProfile(user);
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, preferredLanguage, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });

  return {
    error: "",
    success: "Konto erstellt. Wenn E-Mail-Bestätigung aktiv ist, bitte zuerst bestätigen."
  };
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(LOCALE_COOKIE_NAME);
  revalidatePath("/", "layout");
  redirect("/login");
}
