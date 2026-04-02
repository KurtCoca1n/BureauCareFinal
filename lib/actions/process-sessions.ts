"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import type { ProcessSessionAnswers, ProcessSessionRecord, ProcessSessionStatus } from "@/lib/types";

type SaveProcessSessionInput = {
  processSlug: string;
  procedureId: string;
  currentStepId: string | null;
  currentStepIndex: number;
  answers: ProcessSessionAnswers;
  status: ProcessSessionStatus;
};

type SaveProcessSessionResult =
  | { ok: true; storageMode: "remote" | "local"; session: ProcessSessionRecord | null }
  | { ok: false; error: string; storageMode: "local" };

export async function saveProcessSessionAction(input: SaveProcessSessionInput): Promise<SaveProcessSessionResult> {
  const processSlug = input.processSlug.trim();
  const procedureId = input.procedureId.trim();

  if (!processSlug || !procedureId) {
    return { ok: false, error: "missing_process", storageMode: "local" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, error: "not_authenticated", storageMode: "local" };
  }

  const payload = {
    user_id: user.id,
    process_slug: processSlug,
    procedure_id: procedureId,
    current_step_id: input.currentStepId,
    current_step_index: Math.max(0, input.currentStepIndex),
    answers: input.answers,
    status: input.status,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase
    .from("process_sessions")
    .upsert(payload, { onConflict: "user_id,process_slug" })
    .select("*")
    .maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("process_sessions")) {
      return { ok: true, storageMode: "local", session: null };
    }

    console.error("Saving process session failed", { userId: user.id, processSlug, error });
    return { ok: false, error: error.message, storageMode: "local" };
  }

  revalidatePath(`/app/processes/${processSlug}/start`);
  revalidatePath(`/app/processes/${processSlug}`);

  return {
    ok: true,
    storageMode: "remote",
    session: (data as ProcessSessionRecord | null) ?? null
  };
}
