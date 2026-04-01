"use client";

import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction, signupAction, type AuthFormState } from "@/lib/actions/auth";
import { LANGUAGE_OPTIONS, type SupportedLanguage } from "@/lib/languages";

const initialState: AuthFormState = { error: "", success: "" };

export function AuthForm({
  nextPath,
  locale,
  defaultLanguage,
  copy
}: {
  nextPath?: string;
  locale: SupportedLanguage;
  defaultLanguage: SupportedLanguage;
  copy: {
    badge: string;
    title: string;
    text: string;
    email: string;
    password: string;
    fullName: string;
    language: string;
    emailPlaceholder: string;
    namePlaceholder: string;
    passwordPlaceholder: string;
    login: string;
    loginPending: string;
    signup: string;
    signupPending: string;
  };
}) {
  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, initialState);
  const [signupState, signupFormAction, signupPending] = useActionState(signupAction, initialState);

  return (
    <Card className="space-y-6 border-[var(--line-strong)] bg-[var(--surface-strong)] p-6">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.24em] text-[var(--muted)]">{copy.badge}</p>
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">{copy.title}</h2>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.text}</p>
      </div>

      <form action={loginFormAction} className="space-y-4">
        <input type="hidden" name="next" value={nextPath?.startsWith("/app") ? nextPath : "/app"} />
        <label className="block space-y-2">
          <span className="text-sm font-medium">{copy.email}</span>
          <Input name="email" type="email" required placeholder={copy.emailPlaceholder} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{copy.password}</span>
          <Input name="password" type="password" required minLength={8} placeholder={copy.passwordPlaceholder} />
        </label>
        {loginState.error ? <p className="text-sm text-[var(--danger)]">{loginState.error}</p> : null}
        {loginState.success ? <p className="text-sm text-[var(--accent)]">{loginState.success}</p> : null}
        <Button type="submit" className="w-full" disabled={loginPending}>
          {loginPending ? copy.loginPending : copy.login}
        </Button>
      </form>

      <div className="h-px bg-[var(--line)]" />

      <form action={signupFormAction} className="space-y-4">
        <input type="hidden" name="browserLanguage" value={locale} />
        <label className="block space-y-2">
          <span className="text-sm font-medium">{copy.fullName}</span>
          <Input name="fullName" required placeholder={copy.namePlaceholder} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{copy.language}</span>
          <select
            name="preferredLanguage"
            defaultValue={defaultLanguage}
            className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{copy.email}</span>
          <Input name="email" type="email" required placeholder={copy.emailPlaceholder} />
        </label>
        <label className="block space-y-2">
          <span className="text-sm font-medium">{copy.password}</span>
          <Input name="password" type="password" required minLength={8} placeholder={copy.passwordPlaceholder} />
        </label>
        {signupState.error ? <p className="text-sm text-[var(--danger)]">{signupState.error}</p> : null}
        {signupState.success ? <p className="text-sm text-[var(--accent)]">{signupState.success}</p> : null}
        <Button type="submit" variant="secondary" className="w-full" disabled={signupPending}>
          {signupPending ? copy.signupPending : copy.signup}
        </Button>
      </form>
    </Card>
  );
}
