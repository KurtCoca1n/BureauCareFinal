"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, LoaderCircle, Sparkles } from "lucide-react";

import { completeGoalAction } from "@/lib/actions/goals";

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--success)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:brightness-[1.03] disabled:opacity-75 sm:w-auto"
    >
      {pending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle2 className="mr-2 h-4 w-4" />}
      {label}
    </button>
  );
}

export function GoalCompleteForm({ goalId, label }: { goalId: string; label: string }) {
  const [burst, setBurst] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    if (!burst) {
      return;
    }

    const timeout = window.setTimeout(() => setBurst(false), 1900);
    return () => window.clearTimeout(timeout);
  }, [burst]);

  return (
    <div className="relative w-full sm:w-auto">
      {burst ? (
        <div className="pointer-events-none absolute inset-0 overflow-visible">
          <div className="absolute inset-x-3 -top-4 h-10 rounded-full bg-[radial-gradient(circle,rgba(127,200,201,0.3),transparent_65%)] blur-xl" />
          <Sparkles className="absolute -left-3 -top-3 h-5 w-5 animate-bounce text-[var(--warning)]" />
          <Sparkles className="absolute left-10 -top-5 h-4 w-4 animate-pulse text-[var(--accent)]" />
          <Sparkles className="absolute right-10 -top-4 h-5 w-5 animate-bounce text-[var(--success)]" />
          <Sparkles className="absolute right-3 top-6 h-4 w-4 animate-pulse text-[var(--accent)]" />
        </div>
      ) : null}
      <form
        action={(formData) => {
          startTransition(async () => {
            setBurst(true);
            await completeGoalAction(formData);
            window.setTimeout(() => {
              router.refresh();
            }, 1600);
          });
        }}
      >
        <input type="hidden" name="goalId" value={goalId} />
        <SubmitButton label={label} pending={isPending} />
      </form>
    </div>
  );
}
