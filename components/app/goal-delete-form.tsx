"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";

import { deleteGoalAction } from "@/lib/actions/goals";

function SubmitButton({ label, pending }: { label: string; pending: boolean }) {
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[rgba(197,60,60,0.18)] bg-white px-5 text-sm font-medium text-[var(--danger)] transition hover:bg-[rgba(197,60,60,0.04)] disabled:opacity-70 sm:w-auto"
    >
      {pending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
      {label}
    </button>
  );
}

export function GoalDeleteForm({ goalId, label }: { goalId: string; label: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          const result = await deleteGoalAction(formData);
          if (result.success) {
            router.replace("/app/goals?mode=new");
            router.refresh();
          } else {
            console.error("Goal delete did not persist", result.error);
          }
        });
      }}
    >
      <input type="hidden" name="goalId" value={goalId} />
      <SubmitButton label={label} pending={pending} />
    </form>
  );
}
