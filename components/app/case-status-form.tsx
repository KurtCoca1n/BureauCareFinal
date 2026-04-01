"use client";

import { useFormStatus } from "react-dom";
import { Check, LoaderCircle, Send, TimerReset } from "lucide-react";

import { Button } from "@/components/ui/button";
import { markCaseDoneAction, markDocumentSentAction, markDocumentWaitingAction } from "@/lib/actions/cases";

function SubmitButton({
  icon,
  label,
  savingLabel
}: {
  icon: "sent" | "waiting" | "done";
  label: string;
  savingLabel?: string;
}) {
  const { pending } = useFormStatus();
  const Icon = icon === "sent" ? Send : icon === "waiting" ? TimerReset : Check;

  return (
    <Button type="submit" variant="secondary" className="w-full sm:w-auto" disabled={pending}>
      {pending ? (
        <>
          <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
          {savingLabel ?? "Wird gespeichert..."}
        </>
      ) : (
        <>
          <Icon className="mr-2 h-4 w-4" />
          {label}
        </>
      )}
    </Button>
  );
}

export function DocumentSentForm({ documentId, label, savingLabel }: { documentId: string; label?: string; savingLabel?: string }) {
  return (
    <form action={markDocumentSentAction}>
      <input type="hidden" name="documentId" value={documentId} />
      <SubmitButton icon="sent" label={label ?? "Antwort gesendet"} savingLabel={savingLabel} />
    </form>
  );
}

export function DocumentWaitingForm({ documentId, label, savingLabel }: { documentId: string; label?: string; savingLabel?: string }) {
  return (
    <form action={markDocumentWaitingAction}>
      <input type="hidden" name="documentId" value={documentId} />
      <SubmitButton icon="waiting" label={label ?? "Auf Antwort warten"} savingLabel={savingLabel} />
    </form>
  );
}

export function CaseDoneForm({ caseId, label, savingLabel }: { caseId: string; label?: string; savingLabel?: string }) {
  return (
    <form action={markCaseDoneAction}>
      <input type="hidden" name="caseId" value={caseId} />
      <SubmitButton icon="done" label={label ?? "Fall als erledigt markieren"} savingLabel={savingLabel} />
    </form>
  );
}
