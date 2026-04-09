"use client";

import { useActionState } from "react";

import type { SupportedLanguage } from "@/lib/languages";
import { checkEmailConfirmedAndContinueAction, type AuthFormState } from "@/lib/actions/auth";
import { Button } from "@/components/ui/button";

const initialState: AuthFormState = { error: "", success: "" };

export function EmailConfirmedCheckForm({
  email,
  locale,
  label,
  pendingLabel
}: {
  email: string;
  locale: SupportedLanguage;
  label: string;
  pendingLabel: string;
}) {
  const [state, formAction, pending] = useActionState(checkEmailConfirmedAndContinueAction, initialState);

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="locale" value={locale} />
      {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-[var(--accent-strong)]">{state.success}</p> : null}
      <Button type="submit" className="min-h-12 w-full" disabled={pending}>
        {pending ? pendingLabel : label}
      </Button>
    </form>
  );
}

