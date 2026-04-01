"use client";

import { useFormStatus } from "react-dom";
import { CheckCircle2, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { markTaskDoneAction } from "@/lib/actions/tasks";

function SubmitButton({ savingLabel, doneLabel }: { savingLabel: string; doneLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" variant="secondary" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          {savingLabel}
        </>
      ) : (
        <>
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {doneLabel}
        </>
      )}
    </Button>
  );
}

export function TaskCompleteForm({
  taskId,
  savingLabel = "Wird gespeichert...",
  doneLabel = "Als erledigt markieren"
}: {
  taskId: string;
  savingLabel?: string;
  doneLabel?: string;
}) {
  return (
    <form action={markTaskDoneAction}>
      <input type="hidden" name="taskId" value={taskId} />
      <SubmitButton savingLabel={savingLabel} doneLabel={doneLabel} />
    </form>
  );
}
