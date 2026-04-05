"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

import { createCaseEvent } from "@/lib/case-events";
import { normalizePreferredLanguage } from "@/lib/languages";
import { LOCALE_COOKIE_NAME } from "@/lib/request-locale";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { normalizeUserSettings } from "@/lib/user-settings";

type ActionState = {
  error: string;
  success: string;
};

export type SettingsActionState = ActionState;
export type SecurityActionState = ActionState;
export type PrivacyActionState = ActionState;

async function getAuthenticatedContext() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { supabase, user: null };
  }

  return { supabase, user };
}

async function loadSettingsOrDefault(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("user_settings").select("*").eq("user_id", userId).maybeSingle();
  return normalizeUserSettings(data as never, userId);
}

async function upsertSettings(userId: string, values: Record<string, unknown>) {
  const supabase = await createClient();
  const current = await loadSettingsOrDefault(userId);

  const { error } = await supabase.from("user_settings").upsert(
    {
      ...current,
      ...values,
      user_id: userId,
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id" }
  );

  return error;
}

function parseBoolean(formData: FormData, key: string) {
  return String(formData.get(key) ?? "") === "1";
}

function parseNullableNumber(value: FormDataEntryValue | null) {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }

  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export async function updateLanguageSettingsAction(_: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const appLanguage = normalizePreferredLanguage(String(formData.get("appLanguage") ?? "de"));
  const nativeLanguageRaw = String(formData.get("nativeLanguage") ?? "").trim();
  const nativeLanguage = nativeLanguageRaw ? normalizePreferredLanguage(nativeLanguageRaw) : null;
  const replyLanguageMode = String(formData.get("replyLanguageMode") ?? "app_language").trim();
  const simplifiedLanguage = parseBoolean(formData, "simplifiedLanguage");
  const explainTerms = parseBoolean(formData, "explainTerms");

  const { supabase, user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const settingsError = await upsertSettings(user.id, {
    language_preferences: {
      native_language: nativeLanguage,
      reply_language_mode:
        replyLanguageMode === "german_only" || replyLanguageMode === "native_only" ? replyLanguageMode : "app_language",
      simplified_language: simplifiedLanguage,
      explain_terms: explainTerms
    }
  });

  if (settingsError) {
    return { error: "Die Spracheinstellungen konnten nicht gespeichert werden.", success: "" };
  }

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      preferred_language: appLanguage,
      reply_translation_mode: replyLanguageMode === "german_only" ? "german_only" : "app_language"
    })
    .eq("id", user.id);

  if (profileError) {
    return { error: "Die Spracheinstellungen konnten nicht gespeichert werden.", success: "" };
  }

  const cookieStore = await cookies();
  cookieStore.set(LOCALE_COOKIE_NAME, appLanguage, {
    path: "/",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 365
  });

  revalidatePath("/app");
  revalidatePath("/app/settings");
  revalidatePath("/app/documents");

  return { error: "", success: "Die Spracheinstellungen wurden gespeichert." };
}

export async function updateDocumentSettingsAction(_: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const error = await upsertSettings(user.id, {
    document_preferences: {
      auto_case_assignment: parseBoolean(formData, "autoCaseAssignment"),
      auto_sort_by_sender: parseBoolean(formData, "autoSortBySender"),
      auto_merge_multi_page: parseBoolean(formData, "autoMergeMultiPage"),
      auto_rename: parseBoolean(formData, "autoRename"),
      keep_originals: parseBoolean(formData, "keepOriginals"),
      auto_update_status: parseBoolean(formData, "autoUpdateStatus")
    }
  });

  if (error) {
    return { error: "Die Dokument-Einstellungen konnten nicht gespeichert werden.", success: "" };
  }

  revalidatePath("/app/settings");
  revalidatePath("/app/upload");
  revalidatePath("/app/cases");
  return { error: "", success: "Die Dokument-Einstellungen wurden gespeichert." };
}

export async function updateLocationSettingsAction(_: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const current = await loadSettingsOrDefault(user.id);

  const error = await upsertSettings(user.id, {
    location_preferences: {
      ...current.location_preferences,
      enabled: parseBoolean(formData, "locationEnabled"),
      use_for_offices: parseBoolean(formData, "useForOffices"),
      use_for_dropoff: parseBoolean(formData, "useForDropoff"),
      use_for_appointments: parseBoolean(formData, "useForAppointments"),
      use_for_process_hints: parseBoolean(formData, "useForProcessHints"),
      latitude: parseNullableNumber(formData.get("locationLatitude")) ?? current.location_preferences.latitude,
      longitude: parseNullableNumber(formData.get("locationLongitude")) ?? current.location_preferences.longitude,
      granted_at: String(formData.get("locationGrantedAt") ?? "").trim() || current.location_preferences.granted_at,
      permission_status: String(formData.get("locationPermissionStatus") ?? "").trim() || current.location_preferences.permission_status
    }
  });

  if (error) {
    return { error: "Die Standort-Einstellungen konnten nicht gespeichert werden.", success: "" };
  }

  revalidatePath("/app/settings");
  revalidatePath("/app");
  revalidatePath("/app/welcome");
  return { error: "", success: "Die Standort-Einstellungen wurden gespeichert." };
}

export async function saveLocationSnapshotAction(input: {
  latitude: number;
  longitude: number;
  grantedAt?: string | null;
}): Promise<{ error: string; success: string }> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const current = await loadSettingsOrDefault(user.id);
  const grantedAt = input.grantedAt?.trim() || new Date().toISOString();

  const error = await upsertSettings(user.id, {
    location_preferences: {
      ...current.location_preferences,
      enabled: true,
      latitude: input.latitude,
      longitude: input.longitude,
      granted_at: grantedAt,
      permission_status: "granted"
    }
  });

  if (error) {
    return { error: "Der Standort konnte nicht gespeichert werden.", success: "" };
  }

  revalidatePath("/app/settings");
  revalidatePath("/app");
  revalidatePath("/app/welcome");
  return { error: "", success: "Der Standort wurde gespeichert." };
}

export async function markLocationDeniedAction(): Promise<{ error: string; success: string }> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const current = await loadSettingsOrDefault(user.id);

  const error = await upsertSettings(user.id, {
    location_preferences: {
      ...current.location_preferences,
      enabled: false,
      permission_status: "denied"
    }
  });

  if (error) {
    return { error: "Die Standortentscheidung konnte nicht gespeichert werden.", success: "" };
  }

  revalidatePath("/app/settings");
  revalidatePath("/app");
  revalidatePath("/app/welcome");
  return { error: "", success: "" };
}

export async function resetLocationSnapshotAction(): Promise<{ error: string; success: string }> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const current = await loadSettingsOrDefault(user.id);

  const error = await upsertSettings(user.id, {
    location_preferences: {
      ...current.location_preferences,
      enabled: false,
      latitude: null,
      longitude: null,
      granted_at: null,
      permission_status: "prompt"
    }
  });

  if (error) {
    return { error: "Der gespeicherte Standort konnte nicht zurueckgesetzt werden.", success: "" };
  }

  revalidatePath("/app/settings");
  revalidatePath("/app");
  revalidatePath("/app/welcome");
  return { error: "", success: "Der gespeicherte Standort wurde zurueckgesetzt." };
}

export async function updateGoalSettingsAction(_: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const error = await upsertSettings(user.id, {
    goal_preferences: {
      show_age: parseBoolean(formData, "showAge"),
      show_finance_tracker: parseBoolean(formData, "showFinanceTracker"),
      allow_ai_suggestions: parseBoolean(formData, "allowAiSuggestions"),
      show_progress: parseBoolean(formData, "showProgress"),
      reminders_enabled: parseBoolean(formData, "remindersEnabled")
    }
  });

  if (error) {
    return { error: "Die Ziel-Einstellungen konnten nicht gespeichert werden.", success: "" };
  }

  revalidatePath("/app/settings");
  revalidatePath("/app/goals");
  return { error: "", success: "Die Ziel-Einstellungen wurden gespeichert." };
}

export async function updateNotificationSettingsAction(_: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const error = await upsertSettings(user.id, {
    notification_preferences: {
      deadlines: { in_app: parseBoolean(formData, "deadlinesInApp"), email: parseBoolean(formData, "deadlinesEmail") },
      analysis_ready: { in_app: parseBoolean(formData, "analysisInApp"), email: parseBoolean(formData, "analysisEmail") },
      reply_ready: { in_app: parseBoolean(formData, "replyInApp"), email: parseBoolean(formData, "replyEmail") },
      case_status: { in_app: parseBoolean(formData, "caseInApp"), email: parseBoolean(formData, "caseEmail") },
      suggestions: { in_app: parseBoolean(formData, "suggestionsInApp"), email: parseBoolean(formData, "suggestionsEmail") },
      goal_reminders: { in_app: parseBoolean(formData, "goalInApp"), email: parseBoolean(formData, "goalEmail") }
    }
  });

  if (error) {
    return { error: "Die Benachrichtigungseinstellungen konnten nicht gespeichert werden.", success: "" };
  }

  revalidatePath("/app/settings");
  return { error: "", success: "Die Benachrichtigungseinstellungen wurden gespeichert." };
}

export async function updateTesterSettingsAction(_: SettingsActionState, formData: FormData): Promise<SettingsActionState> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const error = await upsertSettings(user.id, {
    tester_preferences: {
      feature_goals_enabled: parseBoolean(formData, "featureGoalsEnabled"),
      feature_modules_enabled: parseBoolean(formData, "featureModulesEnabled"),
      beta_features_enabled: parseBoolean(formData, "betaFeaturesEnabled")
    }
  });

  if (error) {
    return { error: "Die Tester-Einstellungen konnten nicht gespeichert werden.", success: "" };
  }

  revalidatePath("/app/settings");
  return { error: "", success: "Die Tester-Einstellungen wurden gespeichert." };
}

export async function updatePasswordAction(_: SecurityActionState, formData: FormData): Promise<SecurityActionState> {
  const password = String(formData.get("password") ?? "").trim();
  const confirmPassword = String(formData.get("confirmPassword") ?? "").trim();

  if (password.length < 8) {
    return { error: "Bitte verwende mindestens 8 Zeichen.", success: "" };
  }

  if (password !== confirmPassword) {
    return { error: "Die beiden Passwortfelder stimmen nicht ueberein.", success: "" };
  }

  const { supabase, user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const { error } = await supabase.auth.updateUser({ password });
  if (error) {
    return { error: "Das Passwort konnte gerade nicht aktualisiert werden.", success: "" };
  }

  return { error: "", success: "Dein Passwort wurde aktualisiert." };
}

export async function updateEmailAction(_: SecurityActionState, formData: FormData): Promise<SecurityActionState> {
  const email = String(formData.get("email") ?? "").trim();

  if (!email || !email.includes("@")) {
    return { error: "Bitte gib eine gueltige E-Mail-Adresse ein.", success: "" };
  }

  const { supabase, user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const { error } = await supabase.auth.updateUser({
    email
  });

  if (error) {
    return { error: "Die E-Mail-Adresse konnte gerade nicht geaendert werden.", success: "" };
  }

  return { error: "", success: "Wir haben dir eine Bestaetigung fuer die neue E-Mail-Adresse geschickt." };
}

export async function signOutEverywhereAction(_: SecurityActionState): Promise<SecurityActionState> {
  const { supabase, user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const { error } = await supabase.auth.signOut({ scope: "global" });
  if (error) {
    return { error: "Das Abmelden auf allen Geraeten hat gerade nicht funktioniert.", success: "" };
  }

  return { error: "", success: "Du wurdest auf allen Geraeten abgemeldet." };
}

export async function clearAllBureauCareDataAction(_: PrivacyActionState): Promise<PrivacyActionState> {
  const { user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  try {
    const admin = createAdminClient();
    const { data: docs } = await admin.from("documents").select("id,file_path,case_id").eq("user_id", user.id);
    const docPaths = (docs ?? []).map((doc) => doc.file_path).filter(Boolean);
    if (docPaths.length) {
      await admin.storage.from("documents").remove(docPaths);
    }

    await admin.from("usage_events").delete().eq("user_id", user.id);
    await admin.from("mobile_upload_tokens").delete().eq("user_id", user.id);
    await admin.from("tasks").delete().eq("user_id", user.id);
    await admin.from("goals").delete().eq("user_id", user.id);
    await admin.from("process_sessions").delete().eq("user_id", user.id);
    await admin.from("user_personal_data").delete().eq("user_id", user.id);
    await admin.from("user_settings").delete().eq("user_id", user.id);
    await admin.from("documents").delete().eq("user_id", user.id);
    await admin.from("cases").delete().eq("user_id", user.id);

    revalidatePath("/app");
    revalidatePath("/app/settings");
    revalidatePath("/app/cases");
    revalidatePath("/app/documents");

    return { error: "", success: "Deine gespeicherten BureauCare-Daten wurden entfernt." };
  } catch (error) {
    console.error("Clearing BureauCare data failed", { userId: user.id, error });
    return { error: "Das Loeschen deiner Daten hat gerade nicht funktioniert.", success: "" };
  }
}

export async function deleteAccountAction(_: PrivacyActionState): Promise<PrivacyActionState> {
  const { supabase, user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  try {
    const admin = createAdminClient();
    await clearAllBureauCareDataAction({ error: "", success: "" });
    const { error } = await admin.auth.admin.deleteUser(user.id);
    if (error) {
      return { error: "Das Konto konnte gerade nicht geloescht werden.", success: "" };
    }

    await supabase.auth.signOut({ scope: "global" });
    return { error: "", success: "Dein Konto wurde geloescht." };
  } catch (error) {
    console.error("Deleting account failed", { userId: user.id, error });
    return { error: "Die Kontoloeschung ist gerade nicht verfuegbar.", success: "" };
  }
}

export async function createTesterDummyDocumentAction(_: SettingsActionState): Promise<SettingsActionState> {
  const { supabase, user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const now = new Date().toISOString();
  const { data: doc, error } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      file_path: `${user.id}/tester/dummy-document.txt`,
      original_filename: "tester_dummy_document.txt",
      mime_type: "text/plain",
      sender: "BureauCare Test",
      subject: "Tester Dummy-Dokument",
      status: "neu"
    })
    .select("id, case_id")
    .maybeSingle();

  if (error || !doc) {
    return { error: "Das Dummy-Dokument konnte nicht erstellt werden.", success: "" };
  }

  await supabase.from("document_analyses").upsert({
    document_id: doc.id,
    sender: "BureauCare Test",
    document_type: "Testdokument",
    subject: "Tester Dummy-Dokument",
    summary_simple: "Dies ist eine kleine Testanalyse fuer interne Checks.",
    summary_simple_short: "Testanalyse fuer interne Checks.",
    summary_simple_long: "Dies ist eine kleine Testanalyse fuer interne Checks.",
    is_action_required: false,
    urgency: "low",
    next_steps: ["Keine Aktion notwendig"]
  });

  if (doc.case_id) {
    await createCaseEvent({
      caseId: doc.case_id,
      documentId: doc.id,
      eventType: "document_analyzed",
      note: `Tester-Dummyanalyse am ${now} erstellt.`
    });
  }

  revalidatePath("/app/documents");
  revalidatePath("/app/settings");
  return { error: "", success: "Ein Dummy-Dokument mit Testanalyse wurde erstellt." };
}

export async function createTesterCaseAction(_: SettingsActionState): Promise<SettingsActionState> {
  const { supabase, user } = await getAuthenticatedContext();
  if (!user) return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };

  const { data: createdCase, error } = await supabase
    .from("cases")
    .insert({
      user_id: user.id,
      title: "Tester-Fall",
      organization: "BureauCare Intern",
      status: "open"
    })
    .select("id")
    .maybeSingle();

  if (error || !createdCase) {
    return { error: "Der Testfall konnte nicht erstellt werden.", success: "" };
  }

  await createCaseEvent({
    caseId: createdCase.id,
    eventType: "task_created",
    note: "Testfall fuer BureauCare QA erstellt."
  });

  revalidatePath("/app/cases");
  revalidatePath("/app/settings");
  return { error: "", success: "Ein Testfall wurde erstellt." };
}
