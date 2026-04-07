"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Route } from "next";

import { saveDocumentAsCaseAction, type SaveDocumentCaseState } from "@/lib/actions/document-case";
import { cn } from "@/lib/utils";

type Props = {
  documentId: string;
  locale: string;
  copy: {
    cardTitle: string;
    cardIntro: string;
    button: string;
    pending: string;
    linkedBadge: string;
    linkedLead: string;
    linkedCta: string;
  };
  caseId: string | null;
};

const initial: SaveDocumentCaseState = { error: "", success: "" };

export function SaveDocumentCaseForm({ documentId, locale, copy, caseId }: Props) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(saveDocumentAsCaseAction, initial);

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  if (caseId) {
    return (
      <div className="space-y-3 rounded-[22px] border border-[rgba(95,163,163,0.22)] bg-[rgba(238,246,245,0.45)] p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{copy.linkedBadge}</p>
        <p className="text-sm leading-relaxed text-[var(--foreground)]/95">{copy.linkedLead}</p>
        <Link
          href={`/app/cases/${caseId}` as Route}
          className={cn(
            "inline-flex min-h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition",
            "border border-[rgba(95,163,163,0.4)] bg-white text-[var(--foreground)] hover:bg-[rgba(95,163,163,0.08)]"
          )}
        >
          {copy.linkedCta}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-3 rounded-[22px] border border-[var(--line)] bg-white/95 p-5 sm:p-6 shadow-[var(--shadow-soft)]">
      <h3 className="text-sm font-semibold text-[var(--foreground)]">{copy.cardTitle}</h3>
      <p className="text-sm leading-relaxed text-[var(--muted)]">{copy.cardIntro}</p>
      {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
      <form action={formAction} className="pt-1">
        <input type="hidden" name="documentId" value={documentId} />
        <input type="hidden" name="locale" value={locale} />
        <button
          type="submit"
          disabled={isPending}
          className={cn(
            "inline-flex min-h-11 w-full items-center justify-center rounded-2xl px-4 text-sm font-semibold transition sm:w-auto",
            "border border-[rgba(95,163,163,0.45)] bg-[rgba(248,252,251,0.9)] text-[var(--foreground)] hover:bg-[rgba(95,163,163,0.1)]",
            "disabled:pointer-events-none disabled:opacity-60"
          )}
        >
          {isPending ? copy.pending : copy.button}
        </button>
      </form>
    </div>
  );
}
