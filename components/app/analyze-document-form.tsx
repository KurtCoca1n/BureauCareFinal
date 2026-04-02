"use client";

import { useActionState, useEffect } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { analyzeDocumentAction, type AnalyzeDocumentState } from "@/lib/actions/document-analysis";

const initialState: AnalyzeDocumentState = {
  error: "",
  success: ""
};

export function AnalyzeDocumentForm({
  documentId,
  submitLabel = "Dokument analysieren",
  loadingLabel = "Dokument wird analysiert...",
  disabled = false,
  helperText
}: {
  documentId: string;
  submitLabel?: string;
  loadingLabel?: string;
  disabled?: boolean;
  helperText?: string;
}) {
  const [state, formAction, pending] = useActionState(analyzeDocumentAction, initialState);

  useEffect(() => {
    if (!state.redirectTo) {
      return;
    }

    window.location.assign(state.redirectTo);
  }, [state.redirectTo]);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="documentId" value={documentId} />
      <input type="hidden" name="forceRefresh" value="1" />
      {helperText ? <p className="text-sm text-[var(--muted)]">{helperText}</p> : null}
      {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}
      <Button type="submit" className="w-full" disabled={pending || disabled}>
        {pending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            {loadingLabel}
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-4 w-4" />
            {submitLabel}
          </>
        )}
      </Button>
    </form>
  );
}
