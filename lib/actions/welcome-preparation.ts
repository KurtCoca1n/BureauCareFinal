"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { WelcomeStepPreparationAnswers } from "@/lib/types";

export async function saveWelcomePreparationAction(input: {
  stepKey: string;
  currentSectionId: string | null;
  answers: WelcomeStepPreparationAnswers;
}) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user || !input.stepKey) {
    return { ok: false as const, storageMode: "local" as const };
  }

  const timestamp = new Date().toISOString();
  const { error } = await supabase.from("welcome_step_preparations").upsert(
    {
      user_id: user.id,
      step_key: input.stepKey,
      current_section_id: input.currentSectionId,
      answers: input.answers,
      updated_at: timestamp
    },
    { onConflict: "user_id,step_key" }
  );

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("welcome_step_preparations")) {
      return { ok: true as const, storageMode: "local" as const };
    }

    return { ok: false as const, storageMode: "local" as const };
  }

  revalidatePath("/app/welcome");
  revalidatePath(`/app/welcome/${input.stepKey}`);
  revalidatePath(`/app/welcome/${input.stepKey}/prepare`);

  return { ok: true as const, storageMode: "remote" as const };
}
