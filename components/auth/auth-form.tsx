"use client";

import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction, signupAction, type AuthFormState } from "@/lib/actions/auth";
import { LANGUAGE_OPTIONS, type SupportedLanguage } from "@/lib/languages";

const initialState: AuthFormState = { error: "", success: "" };

type AuthTab = "login" | "signup";

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
    loginTab: string;
    signupTab: string;
    loginTitle: string;
    loginText: string;
    signupTitle: string;
    signupText: string;
    email: string;
    password: string;
    fullName: string;
    language: string;
    emailPlaceholder: string;
    namePlaceholder: string;
    passwordPlaceholder: string;
    passwordHint: string;
    login: string;
    loginPending: string;
    signup: string;
    signupPending: string;
    forgotPassword: string;
    trustNote: string;
  };
}) {
  const [activeTab, setActiveTab] = useState<AuthTab>("login");
  const [loginState, loginFormAction, loginPending] = useActionState(loginAction, initialState);
  const [signupState, signupFormAction, signupPending] = useActionState(signupAction, initialState);

  const activePanel = useMemo(
    () =>
      activeTab === "login"
        ? { title: copy.loginTitle, text: copy.loginText }
        : { title: copy.signupTitle, text: copy.signupText },
    [activeTab, copy.loginText, copy.loginTitle, copy.signupText, copy.signupTitle]
  );

  return (
    <Card className="rounded-[40px] border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,249,252,0.92))] p-5 shadow-[0_32px_90px_rgba(34,54,78,0.11)] sm:p-7">
      <div className="space-y-7">
        <div className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]/80">{copy.badge}</p>
          <div className="space-y-2.5">
            <h2 className="text-[1.95rem] font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-[2.1rem]">{copy.title}</h2>
            <p className="max-w-[34ch] text-sm leading-6 text-[var(--muted)]">{copy.text}</p>
          </div>
        </div>

        <div className="inline-grid w-full grid-cols-2 gap-2 rounded-[26px] border border-white/70 bg-[linear-gradient(180deg,rgba(225,235,244,0.76),rgba(235,242,248,0.64))] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]">
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`min-h-12 rounded-[18px] px-4 text-sm font-semibold transition ${
              activeTab === "login"
                ? "bg-white text-[var(--foreground)] shadow-[0_14px_26px_rgba(34,54,78,0.09)]"
                : "text-[var(--muted)] hover:bg-white/65 hover:text-[var(--foreground)]"
            }`}
          >
            {copy.loginTab}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("signup")}
            className={`min-h-12 rounded-[18px] px-4 text-sm font-semibold transition ${
              activeTab === "signup"
                ? "bg-white text-[var(--foreground)] shadow-[0_14px_26px_rgba(34,54,78,0.09)]"
                : "text-[var(--muted)] hover:bg-white/65 hover:text-[var(--foreground)]"
            }`}
          >
            {copy.signupTab}
          </button>
        </div>

        <div className="rounded-[30px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(255,255,255,0.66))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:p-6">
          <div className="mb-6 space-y-2">
            <h3 className="text-xl font-semibold tracking-[-0.03em]">{activePanel.title}</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">{activePanel.text}</p>
          </div>

          {activeTab === "login" ? (
            <form action={loginFormAction} className="space-y-4">
              <input type="hidden" name="next" value={nextPath?.startsWith("/app") ? nextPath : "/app"} />
              <input type="hidden" name="locale" value={locale} />
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--foreground)]">{copy.email}</span>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder={copy.emailPlaceholder}
                  className="min-h-14 rounded-[20px] border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.9))]"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--foreground)]">{copy.password}</span>
                <Input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder={copy.passwordPlaceholder}
                  className="min-h-14 rounded-[20px] border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.9))]"
                />
              </label>
              <div className="flex justify-end">
                <button type="button" className="text-sm font-medium text-[var(--muted)] underline-offset-4 transition hover:text-[var(--foreground)] hover:underline">
                  {copy.forgotPassword}
                </button>
              </div>
              {loginState.error ? <p className="text-sm text-[var(--danger)]">{loginState.error}</p> : null}
              {loginState.success ? <p className="text-sm text-[var(--accent)]">{loginState.success}</p> : null}
              <Button type="submit" className="min-h-14 w-full rounded-[20px] text-base" disabled={loginPending}>
                {loginPending ? copy.loginPending : copy.login}
              </Button>
            </form>
          ) : (
            <form action={signupFormAction} className="space-y-4">
              <input type="hidden" name="browserLanguage" value={locale} />
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--foreground)]">{copy.fullName}</span>
                <Input
                  name="fullName"
                  required
                  placeholder={copy.namePlaceholder}
                  className="min-h-14 rounded-[20px] border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.9))]"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--foreground)]">{copy.email}</span>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder={copy.emailPlaceholder}
                  className="min-h-14 rounded-[20px] border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.9))]"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--foreground)]">{copy.password}</span>
                <Input
                  name="password"
                  type="password"
                  required
                  minLength={8}
                  placeholder={copy.passwordPlaceholder}
                  className="min-h-14 rounded-[20px] border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.9))]"
                />
                <p className="text-sm text-[var(--muted)]">{copy.passwordHint}</p>
              </label>
              <label className="block space-y-2">
                <span className="text-sm font-medium text-[var(--foreground)]">{copy.language}</span>
                <select
                  name="preferredLanguage"
                  defaultValue={defaultLanguage}
                  className="min-h-14 w-full rounded-[20px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,255,255,0.9))] px-4 text-sm text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {signupState.error ? <p className="text-sm text-[var(--danger)]">{signupState.error}</p> : null}
              {signupState.success ? <p className="text-sm text-[var(--accent)]">{signupState.success}</p> : null}
              <Button type="submit" className="min-h-14 w-full rounded-[20px] text-base" disabled={signupPending}>
                {signupPending ? copy.signupPending : copy.signup}
              </Button>
            </form>
          )}
        </div>

        <div className="flex items-start gap-3 rounded-[24px] border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(180deg,rgba(95,163,163,0.1),rgba(95,163,163,0.06))] px-4 py-3.5 text-sm leading-6 text-[var(--muted)]">
          <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_rgba(95,163,163,0.12)]" />
          <span>{copy.trustNote}</span>
        </div>
      </div>
    </Card>
  );
}
