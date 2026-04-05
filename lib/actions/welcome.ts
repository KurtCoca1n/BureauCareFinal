"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { WelcomeStepStatus } from "@/lib/types";
import {
  buildWelcomeRoadmap,
  normalizeWelcomeAnswerStatus,
  normalizeWelcomeGermanLevel,
  normalizeWelcomeHousingStatus,
  normalizeWelcomeReason
} from "@/lib/welcome";

export type WelcomeActionState = {
  error: string;
  success: string;
};

export async function saveWelcomeOnboardingAction(_: WelcomeActionState, formData: FormData): Promise<WelcomeActionState> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  const city = String(formData.get("city") ?? "").trim();
  if (!city) {
    return { error: "Bitte gib deine Stadt an.", success: "" };
  }

  const answers = {
    reason: normalizeWelcomeReason(String(formData.get("reason") ?? "")),
    nationality: String(formData.get("nationality") ?? "").trim() || null,
    city,
    housing_status: normalizeWelcomeHousingStatus(String(formData.get("housing_status") ?? "")),
    registration_status: normalizeWelcomeAnswerStatus(String(formData.get("registration_status") ?? "")),
    health_insurance_status: normalizeWelcomeAnswerStatus(String(formData.get("health_insurance_status") ?? "")),
    work_status: normalizeWelcomeAnswerStatus(String(formData.get("work_status") ?? "")),
    has_children: String(formData.get("has_children") ?? "") === "yes",
    german_level: normalizeWelcomeGermanLevel(String(formData.get("german_level") ?? ""))
  };

  const now = new Date().toISOString();
  const { error: profileError } = await supabase.from("welcome_profiles").upsert(
    {
      user_id: user.id,
      ...answers,
      completed_at: now,
      updated_at: now
    },
    { onConflict: "user_id" }
  );

  if (profileError) {
    return { error: "Dein Welcome-Profil konnte nicht gespeichert werden.", success: "" };
  }

  const roadmap = buildWelcomeRoadmap(answers);

  const { error: deleteError } = await supabase.from("welcome_steps").delete().eq("user_id", user.id);
  if (deleteError) {
    return { error: "Deine Welcome-Schritte konnten nicht vorbereitet werden.", success: "" };
  }

  if (roadmap.length) {
    const { error: stepsError } = await supabase.from("welcome_steps").insert(
      roadmap.map((step) => ({
        user_id: user.id,
        step_key: step.key,
        sort_order: step.sortOrder,
        status: "open" as WelcomeStepStatus,
        updated_at: now
      }))
    );

    if (stepsError) {
      return { error: "Deine Welcome-Roadmap konnte nicht gespeichert werden.", success: "" };
    }
  }

  revalidatePath("/app");
  revalidatePath("/app/welcome");

  return {
    error: "",
    success: "Deine Welcome-Roadmap wurde erstellt."
  };
}

export async function updateWelcomeStepStatusAction(stepId: string, status: WelcomeStepStatus) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !stepId) {
    return { ok: false };
  }

  const { data } = await supabase
    .from("welcome_steps")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", stepId)
    .eq("user_id", user.id)
    .select("step_key")
    .maybeSingle();

  revalidatePath("/app/welcome");
  revalidatePath("/app");
  if (data?.step_key) {
    revalidatePath(`/app/welcome/${data.step_key}`);
  }

  return { ok: true };
}
