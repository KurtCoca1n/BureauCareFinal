"use client";

import { useActionState, useState, useTransition } from "react";
import { LoaderCircle, Plus, UploadCloud } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  createWelcomeStepCaseAction,
  createWelcomeStepTaskAction,
  linkExistingDocumentToWelcomeStepAction,
  uploadWelcomeStepDocumentAction,
  type WelcomeDocumentUploadState
} from "@/lib/actions/welcome-workspace";
import type { SupportedLanguage } from "@/lib/languages";
import type { DocumentRecord } from "@/lib/types";
import type { WelcomeStepKey } from "@/lib/welcome";

const initialUploadState: WelcomeDocumentUploadState = {
  error: "",
  success: ""
};

export function WelcomeStepDocumentUploadForm({
  stepKey,
  locale,
  label
}: {
  stepKey: WelcomeStepKey;
  locale: SupportedLanguage;
  label: string;
}) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(uploadWelcomeStepDocumentAction, initialUploadState);

  return (
    <form
      action={async (formData) => {
        await formAction(formData);
        router.refresh();
      }}
      className="space-y-3"
    >
      <input type="hidden" name="stepKey" value={stepKey} />
      <input type="hidden" name="locale" value={locale} />
      <input
        type="file"
        name="document"
        accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
        className="block min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--foreground)]"
      />
      {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}
      <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            {label}
          </>
        ) : (
          <>
            <UploadCloud className="mr-2 h-4 w-4" />
            {label}
          </>
        )}
      </Button>
    </form>
  );
}

export function WelcomeLinkExistingDocumentForm({
  stepKey,
  locale,
  documents,
  label
}: {
  stepKey: WelcomeStepKey;
  locale: SupportedLanguage;
  documents: DocumentRecord[];
  label: string;
}) {
  const router = useRouter();
  const [selectedDocumentId, setSelectedDocumentId] = useState(documents[0]?.id ?? "");
  const [pending, startTransition] = useTransition();

  if (!documents.length) {
    return null;
  }

  return (
    <div className="space-y-3">
      <select
        value={selectedDocumentId}
        onChange={(event) => setSelectedDocumentId(event.target.value)}
        className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)]"
      >
        {documents.map((document) => (
          <option key={document.id} value={document.id}>
            {document.original_filename}
          </option>
        ))}
      </select>
      <Button
        variant="secondary"
        className="w-full"
        disabled={pending || !selectedDocumentId}
        onClick={() =>
          startTransition(async () => {
            await linkExistingDocumentToWelcomeStepAction({
              stepKey,
              documentId: selectedDocumentId,
              locale
            });
            router.refresh();
          })
        }
      >
        {pending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
        {label}
      </Button>
    </div>
  );
}

export function WelcomeCreateCaseButton({
  stepKey,
  locale,
  label
}: {
  stepKey: WelcomeStepKey;
  locale: SupportedLanguage;
  label: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await createWelcomeStepCaseAction(stepKey, locale);
          router.refresh();
        })
      }
    >
      {pending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}

export function WelcomeCreateTaskButton({
  stepKey,
  locale,
  label
}: {
  stepKey: WelcomeStepKey;
  locale: SupportedLanguage;
  label: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant="secondary"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await createWelcomeStepTaskAction({ stepKey, locale });
          router.refresh();
        })
      }
    >
      {pending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Plus className="mr-2 h-4 w-4" />}
      {label}
    </Button>
  );
}
