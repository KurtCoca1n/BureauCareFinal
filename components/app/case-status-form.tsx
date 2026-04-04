"use client";

import { useFormStatus } from "react-dom";
import { Check, LoaderCircle, Send, TimerReset, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { deleteCaseAction, markCaseDoneAction, markDocumentSentAction, markDocumentWaitingAction } from "@/lib/actions/cases";

function SubmitButton({
  icon,
  label,
  savingLabel,
  variant = "secondary"
}: {
  icon: "sent" | "waiting" | "done" | "delete";
  label: string;
  savingLabel?: string;
  variant?: "secondary" | "danger";
}) {
  const { pending } = useFormStatus();
  const Icon = icon === "sent" ? Send : icon === "waiting" ? TimerReset : icon === "delete" ? Trash2 : Check;

  return (
    <Button
      type="submit"
      variant="secondary"
      className={
        variant === "danger"
          ? "w-full border-[rgba(197,60,60,0.18)] text-[var(--danger)] hover:bg-[rgba(197,60,60,0.04)] sm:w-auto"
          : "w-full sm:w-auto"
      }
      disabled={pending}
    >
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

export function CaseDoneAndDeleteForm({
  caseId,
  label,
  savingLabel,
  confirmText
}: {
  caseId: string;
  label?: string;
  savingLabel?: string;
  confirmText: string;
}) {
  return (
    <form
      action={markCaseDoneAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="caseId" value={caseId} />
      <input type="hidden" name="deleteAfterDone" value="1" />
      <SubmitButton icon="delete" label={label ?? "Erledigen und löschen"} savingLabel={savingLabel} variant="danger" />
    </form>
  );
}

export function CaseDeleteForm({
  caseId,
  label,
  savingLabel,
  confirmText
}: {
  caseId: string;
  label?: string;
  savingLabel?: string;
  confirmText: string;
}) {
  return (
    <form
      action={deleteCaseAction}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="caseId" value={caseId} />
      <SubmitButton icon="delete" label={label ?? "Fall löschen"} savingLabel={savingLabel} variant="danger" />
    </form>
  );
}
