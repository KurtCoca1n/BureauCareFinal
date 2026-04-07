"use server";

import { revalidatePath } from "next/cache";

import { createCaseEvent } from "@/lib/case-events";
import { storeUploadedDocumentForUser } from "@/lib/actions/documents";
import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import { createClient } from "@/lib/supabase/server";
import type { CaseRecord } from "@/lib/types";
import { isWelcomeStepKey, type WelcomeStepKey } from "@/lib/welcome";
import { getWelcomeGuidance, getWelcomeGuidanceText } from "@/lib/welcome-guidance";
import { buildWelcomeCaseTitle } from "@/lib/welcome-workspace-v2";

const MAX_FILE_SIZE = 15 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["application/pdf", "image/jpeg", "image/png", "image/jpg"]);

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function ensureWelcomeStepCase(stepKey: WelcomeStepKey, locale: string) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) return null;
  const normalizedLocale = normalizePreferredLanguage(locale);

  const { data: existingLink } = await supabase
    .from("welcome_step_cases")
    .select("case_id, cases(*)")
    .eq("user_id", user.id)
    .eq("step_key", stepKey)
    .maybeSingle();

  const linkedCase = existingLink?.cases as CaseRecord | null | undefined;
  if (linkedCase) {
    return linkedCase;
  }

  const guidance = getWelcomeGuidance(stepKey);
  const organization = getWelcomeGuidanceText(guidance.institutionName, normalizedLocale);
  const title = buildWelcomeCaseTitle(stepKey, normalizedLocale);

  const { data: createdCase } = await supabase
    .from("cases")
    .insert({
      user_id: user.id,
      title,
      organization,
      status: "open"
    })
    .select("*")
    .maybeSingle();

  const caseItem = (createdCase as CaseRecord | null) ?? null;
  if (!caseItem) {
    return null;
  }

  await supabase.from("welcome_step_cases").upsert(
    {
      user_id: user.id,
      step_key: stepKey,
      case_id: caseItem.id,
      updated_at: new Date().toISOString()
    },
    { onConflict: "user_id,step_key" }
  );

  await createCaseEvent({
    caseId: caseItem.id,
    eventType: "status_changed",
    note: `Welcome-Schritt ${stepKey} wurde mit diesem Fall verknuepft.`
  });

  revalidatePath("/app/welcome");
  revalidatePath(`/app/welcome/${stepKey}`);

  return caseItem;
}

export async function createWelcomeStepCaseAction(stepKey: WelcomeStepKey, locale: string) {
  const caseItem = await ensureWelcomeStepCase(stepKey, locale);
  if (!caseItem) {
    return { ok: false as const };
  }
  return { ok: true as const, caseId: caseItem.id };
}

export async function linkExistingDocumentToWelcomeStepAction(input: {
  stepKey: WelcomeStepKey;
  documentId: string;
  locale: SupportedLanguage;
}) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) return { ok: false as const };

  const { data: document } = await supabase
    .from("documents")
    .select("*")
    .eq("id", input.documentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!document) {
    return { ok: false as const };
  }

  const caseItem = await ensureWelcomeStepCase(input.stepKey, input.locale);

  if (caseItem && !document.case_id) {
    await supabase.from("documents").update({ case_id: caseItem.id }).eq("id", document.id).eq("user_id", user.id);
  }

  await supabase.from("welcome_step_documents").upsert(
    {
      user_id: user.id,
      step_key: input.stepKey,
      document_id: document.id
    },
    { onConflict: "user_id,step_key,document_id" }
  );

  revalidatePath(`/app/welcome/${input.stepKey}`);
  return { ok: true as const };
}

export type WelcomeDocumentUploadState = {
  error: string;
  success: string;
};

export async function uploadWelcomeStepDocumentAction(
  _: WelcomeDocumentUploadState,
  formData: FormData
): Promise<WelcomeDocumentUploadState> {
  const rawStepKey = String(formData.get("stepKey") ?? "").trim();
  const locale = normalizePreferredLanguage(String(formData.get("locale") ?? "de"));
  const file = formData.get("document");

  if (!isWelcomeStepKey(rawStepKey)) {
    return { error: "Dieser Schritt konnte nicht erkannt werden.", success: "" };
  }

  const stepKey = rawStepKey;

  if (!(file instanceof File)) {
    return { error: "Bitte waehle eine Datei aus.", success: "" };
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return { error: "Erlaubt sind PDF, JPG, JPEG und PNG.", success: "" };
  }

  if (file.size > MAX_FILE_SIZE) {
    return { error: "Die Datei ist groesser als 15 MB.", success: "" };
  }

  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  const caseItem = await ensureWelcomeStepCase(stepKey, locale);
  const fileBuffer = await file.arrayBuffer();

  try {
    const result = await storeUploadedDocumentForUser({
      userId: user.id,
      caseId: caseItem?.id ?? null,
      fileBuffer,
      mimeType: file.type,
      originalFilename: file.name || "dokument"
    });

    await supabase.from("welcome_step_documents").upsert(
      {
        user_id: user.id,
        step_key: stepKey,
        document_id: result.documentId
      },
      { onConflict: "user_id,step_key,document_id" }
    );

    revalidatePath(`/app/welcome/${stepKey}`);
    revalidatePath(`/app/documents/${result.documentId}`);
    revalidatePath(`/app/documents/${result.documentId}/decision`);

    return { error: "", success: "Dokument wurde diesem Schritt hinzugefuegt." };
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Dokument konnte nicht hochgeladen werden.", success: "" };
  }
}

export async function createWelcomeStepTaskAction(input: { stepKey: WelcomeStepKey; locale: SupportedLanguage }) {
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) return { ok: false as const };

  const locale = normalizePreferredLanguage(input.locale);
  const guidance = getWelcomeGuidance(input.stepKey);
  const caseItem = await ensureWelcomeStepCase(input.stepKey, locale);
  const taskTitle = getWelcomeGuidanceText(guidance.nextStepTitle, locale);
  const taskSummary = getWelcomeGuidanceText(guidance.nextStep, locale);
  const routeQuery = guidance.nearbyQuery ? `${guidance.nearbyQuery}` : getWelcomeGuidanceText(guidance.institutionName, locale);
  const actionMode =
    guidance.channel === "online"
      ? "online"
      : guidance.channel === "post"
        ? "per_post"
        : guidance.channel === "automatic"
          ? "online"
          : "vor_ort";

  const { data: createdTask } = await supabase
    .from("tasks")
    .insert({
      user_id: user.id,
      title: taskTitle,
      action_summary: taskSummary,
      importance_reason: "Aus Welcome-Schritt abgeleitet.",
      action_location_name: routeQuery,
      action_url: routeQuery ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(routeQuery)}` : null,
      action_mode: actionMode,
      status: "open"
    })
    .select("*")
    .maybeSingle();

  if (!createdTask) {
    return { ok: false as const };
  }

  await supabase.from("welcome_step_tasks").upsert(
    {
      user_id: user.id,
      step_key: input.stepKey,
      task_id: createdTask.id
    },
    { onConflict: "user_id,step_key,task_id" }
  );

  if (caseItem) {
    await createCaseEvent({
      caseId: caseItem.id,
      eventType: "task_created",
      note: `Neue Welcome-Aufgabe: ${taskTitle}`
    });
  }

  revalidatePath("/app/tasks");
  revalidatePath(`/app/welcome/${input.stepKey}`);

  return { ok: true as const, taskId: createdTask.id };
}
