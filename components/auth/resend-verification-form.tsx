"use client";

import { useActionState } from "react";

import { resendSignupVerificationAction, type AuthFormState } from "@/lib/actions/auth";
import type { SupportedLanguage } from "@/lib/languages";

import { Button } from "@/components/ui/button";

const initialState: AuthFormState = { error: "", success: "" };

export function ResendVerificationForm({
  email,
  locale,
  resendLabel,
  resendPendingLabel
}: {
  email: string;
  locale: SupportedLanguage;
  resendLabel: string;
  resendPendingLabel: string;
}) {
  const [state, formAction, pending] = useActionState(resendSignupVerificationAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="locale" value={locale} />
      {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-[var(--accent-strong)]">{state.success}</p> : null}
      <Button type="submit" variant="secondary" className="min-h-12 w-full sm:w-auto" disabled={pending}>
        {pending ? resendPendingLabel : resendLabel}
      </Button>
    </form>
  );
}
