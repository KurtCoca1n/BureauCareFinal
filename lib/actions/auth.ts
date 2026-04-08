"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import type { Route } from "next";
import { redirect } from "next/navigation";

import { getClientEnv } from "@/lib/env";
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

function getAuthOrigin() {
  const env = getClientEnv();
  return env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

function toMessage(error: { message?: string } | null | undefined, locale: string, fallback: string) {
  const message = error?.message?.toLowerCase() ?? "";
  const isGerman = locale === "de";

  if (message.includes("invalid login credentials")) {
    return isGerman ? "Diese E-Mail oder dieses Passwort passt nicht." : "This email or password does not match.";
  }

  if (message.includes("email not confirmed")) {
    return isGerman
      ? "Bitte bestaetige zuerst deine E-Mail-Adresse. Danach kannst du dich anmelden."
      : "Please confirm your email address first. After that you can sign in.";
  }

  if (message.includes("user already registered") || message.includes("already been registered")) {
    return isGerman ? "Diese E-Mail wird bereits verwendet." : "This email is already in use.";
  }

  if (message.includes("password should be at least")) {
    return isGerman ? "Das Passwort ist zu kurz." : "The password is too short.";
  }

  if (message.includes("unable to validate email address") || message.includes("email address")) {
    return isGerman ? "Bitte gib eine gueltige E-Mail-Adresse ein." : "Please enter a valid email address.";
  }

  if (message.includes("expired") || message.includes("otp expired")) {
    return isGerman ? "Dieser Link ist abgelaufen. Bitte fordere eine neue E-Mail an." : "This link has expired. Please request a new email.";
  }

  if (message.includes("network") || message.includes("fetch")) {
    return isGerman
      ? "Die Verbindung hat gerade nicht funktioniert. Bitte versuche es noch einmal."
      : "The connection did not work just now. Please try again.";
  }

  return fallback;
}

export async function loginAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const password = getString(formData, "password");
  const nextPath = getString(formData, "next") || "/app";
  const locale = normalizePreferredLanguage(getString(formData, "locale") || "de");

  if (!email || !password) {
    return {
      error: locale === "de" ? "Bitte gib E-Mail und Passwort ein." : "Please enter your email and password.",
      success: ""
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return {
      error: toMessage(error, locale, locale === "de" ? "Anmelden war gerade nicht moeglich." : "Sign in is not possible right now."),
      success: ""
    };
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
    return {
      error:
        preferredLanguage === "de"
          ? "Bitte fuelle alle Pflichtfelder aus."
          : "Please complete all required fields.",
      success: ""
    };
  }

  if (password.length < 8) {
    return {
      error: preferredLanguage === "de" ? "Das Passwort ist zu kurz." : "The password is too short.",
      success: ""
    };
  }

  const supabase = await createClient();
  const {
    data: { user },
    error
  } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getAuthOrigin()}/auth/callback?locale=${preferredLanguage}`,
      data: {
        full_name: fullName,
        preferred_language: preferredLanguage
      }
    }
  });

  if (error) {
    return {
      error: toMessage(error, preferredLanguage, preferredLanguage === "de" ? "Registrierung war gerade nicht moeglich." : "Registration is not possible right now."),
      success: ""
    };
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

  redirect(
    `/onboarding?from=signup&email=${encodeURIComponent(email)}&locale=${encodeURIComponent(preferredLanguage)}`
  );
}

export async function resendSignupVerificationAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const locale = normalizePreferredLanguage(getString(formData, "locale") || "de");

  if (!email) {
    return {
      error: locale === "de" ? "Bitte gib zuerst deine E-Mail-Adresse ein." : "Please enter your email address first.",
      success: ""
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resend({
    type: "signup",
    email,
    options: {
      emailRedirectTo: `${getAuthOrigin()}/auth/callback?locale=${locale}`
    }
  });

  if (error) {
    return {
      error: toMessage(error, locale, locale === "de" ? "Die E-Mail konnte gerade nicht erneut gesendet werden." : "The email could not be sent again right now."),
      success: ""
    };
  }

  return {
    error: "",
    success: locale === "de" ? "Wir haben dir eine neue E-Mail geschickt." : "We sent you a new email."
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
