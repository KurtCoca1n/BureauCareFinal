"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, Circle, LoaderCircle } from "lucide-react";

import { toggleGoalStepAction } from "@/lib/actions/goals";

function SubmitButton({ isDone, openLabel, doneLabel }: { isDone: boolean; openLabel: string; doneLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--accent)] hover:text-[var(--accent)] disabled:opacity-70"
    >
      {pending ? (
        <LoaderCircle className="h-4 w-4 animate-spin" />
      ) : isDone ? (
        <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
      ) : (
        <Circle className="h-4 w-4 text-[var(--muted)]" />
      )}
      {isDone ? doneLabel : openLabel}
    </button>
  );
}

export function GoalStepToggleForm({
  goalId,
  stepId,
  isDone,
  openLabel,
  doneLabel
}: {
  goalId: string;
  stepId: string;
  isDone: boolean;
  openLabel: string;
  doneLabel: string;
}) {
  return (
    <form action={toggleGoalStepAction}>
      <input type="hidden" name="goalId" value={goalId} />
      <input type="hidden" name="stepId" value={stepId} />
      <SubmitButton isDone={isDone} openLabel={openLabel} doneLabel={doneLabel} />
    </form>
  );
}
