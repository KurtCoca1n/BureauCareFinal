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
  code?: "EMAIL_NOT_CONFIRMED" | "WEAK_PASSWORD" | "RATE_LIMITED" | "MFA_REQUIRED" | "UNKNOWN";
  email?: string;
};

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

const MIN_PASSWORD_LENGTH = 8;

function isPasswordAcceptable(password: string) {
  const p = password.trim();
  return p.length >= MIN_PASSWORD_LENGTH;
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
    return isGerman
      ? `Bitte waehle ein sicheres Passwort mit mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`
      : `Please choose a secure password with at least ${MIN_PASSWORD_LENGTH} characters.`;
  }

  if (message.includes("unable to validate email address") || message.includes("email address")) {
    return isGerman ? "Bitte gib eine gueltige E-Mail-Adresse ein." : "Please enter a valid email address.";
  }

  if (message.includes("rate limit") || message.includes("too many requests")) {
    return isGerman
      ? "Bitte warte einen Moment und versuche es dann nochmal."
      : "Please wait a moment and try again.";
  }

  if (message.includes("mfa") || message.includes("multi-factor")) {
    return isGerman
      ? "Es ist ein zweiter Schritt noetig. Bitte schliesse die Anmeldung ab."
      : "A second step is required. Please complete sign-in.";
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
    const message = error.message?.toLowerCase?.() ?? "";
    const code: AuthFormState["code"] =
      message.includes("email not confirmed")
        ? "EMAIL_NOT_CONFIRMED"
        : message.includes("rate limit") || message.includes("too many requests")
          ? "RATE_LIMITED"
          : message.includes("mfa") || message.includes("multi-factor")
            ? "MFA_REQUIRED"
            : "UNKNOWN";
    return {
      error: toMessage(error, locale, locale === "de" ? "Anmelden war gerade nicht moeglich." : "Sign in is not possible right now."),
      success: "",
      code,
      email: code === "EMAIL_NOT_CONFIRMED" ? email : undefined
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

  if (!isPasswordAcceptable(password)) {
    return {
      error:
        preferredLanguage === "de"
          ? `Bitte waehle ein sicheres Passwort mit mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`
          : `Please choose a secure password with at least ${MIN_PASSWORD_LENGTH} characters.`,
      success: "",
      code: "WEAK_PASSWORD"
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
      success: "",
      code:
        error.message?.toLowerCase?.().includes("rate limit") || error.message?.toLowerCase?.().includes("too many requests")
          ? "RATE_LIMITED"
          : "UNKNOWN"
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

  // After signup, guide users through email verification (no forced friction beyond the confirmation step).
  redirect(`/login/verify-email?email=${encodeURIComponent(email)}&locale=${encodeURIComponent(preferredLanguage)}`);
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

export async function requestPasswordResetAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const locale = normalizePreferredLanguage(getString(formData, "locale") || "de");

  if (!email) {
    return {
      error: locale === "de" ? "Bitte gib deine E-Mail-Adresse ein." : "Please enter your email address.",
      success: ""
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getAuthOrigin()}/auth/callback?locale=${locale}`
  });

  if (error) {
    return {
      error: toMessage(
        error,
        locale,
        locale === "de" ? "Das Zurücksetzen war gerade nicht möglich." : "Password reset is not possible right now."
      ),
      success: ""
    };
  }

  return {
    error: "",
    success:
      locale === "de"
        ? "Wenn ein Konto mit dieser E‑Mail existiert, haben wir dir einen Link zum Zurücksetzen geschickt."
        : "If an account exists for this email, we sent you a reset link."
  };
}

export async function updatePasswordAfterRecoveryAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const password = getString(formData, "password");
  const locale = normalizePreferredLanguage(getString(formData, "locale") || "de");

  if (!isPasswordAcceptable(password)) {
    return {
      error:
        locale === "de"
          ? `Bitte wähle ein Passwort mit mindestens ${MIN_PASSWORD_LENGTH} Zeichen.`
          : `Please choose a password with at least ${MIN_PASSWORD_LENGTH} characters.`,
      success: "",
      code: "WEAK_PASSWORD"
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return {
      error: toMessage(error, locale, locale === "de" ? "Das Passwort konnte gerade nicht gespeichert werden." : "Password could not be saved."),
      success: ""
    };
  }

  return {
    error: "",
    success: locale === "de" ? "Dein Passwort wurde aktualisiert. Du kannst dich jetzt anmelden." : "Your password was updated. You can sign in now."
  };
}

export async function checkEmailConfirmedAndContinueAction(_: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const email = getString(formData, "email");
  const locale = normalizePreferredLanguage(getString(formData, "locale") || "de");

  const supabase = await createClient();
  // Make sure we read the most current session/user state.
  await supabase.auth.getSession();
  const {
    data: { user },
    error
  } = await supabase.auth.getUser();

  if (error) {
    return {
      error: toMessage(error, locale, locale === "de" ? "Das hat gerade nicht funktioniert. Bitte versuche es nochmal." : "That did not work just now. Please try again."),
      success: ""
    };
  }

  if (!user) {
    return {
      error:
        locale === "de"
          ? "Ich sehe hier noch keine Bestätigung in dieser Sitzung. Öffne den Bestätigungslink aus der E‑Mail in diesem Browser – oder melde dich kurz an."
          : "I can’t see the confirmation in this session yet. Open the confirmation link in this browser — or sign in once.",
      success: ""
    };
  }

  if (!user.email_confirmed_at) {
    return {
      error: locale === "de" ? "Deine E‑Mail ist noch nicht bestätigt." : "Your email is not confirmed yet.",
      success: ""
    };
  }

  redirect(`/onboarding?from=signup&email=${encodeURIComponent(email || user.email || "")}&locale=${encodeURIComponent(locale)}`);
}

export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  const cookieStore = await cookies();
  cookieStore.delete(LOCALE_COOKIE_NAME);
  revalidatePath("/", "layout");
  redirect("/login");
}
