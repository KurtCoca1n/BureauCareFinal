"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAction, requestPasswordResetAction, signupAction, type AuthFormState } from "@/lib/actions/auth";
import { LANGUAGE_OPTIONS, type SupportedLanguage } from "@/lib/languages";
import { cn } from "@/lib/utils";

const initialState: AuthFormState = { error: "", success: "" };

type AuthTab = "login" | "signup";

const MIN_PASSWORD_LENGTH = 8;

function passwordScore(pw: string) {
  const p = pw.trim();
  if (!p) return { level: "empty" as const, label: "", pct: 0 };
  if (p.length < MIN_PASSWORD_LENGTH) {
    return { level: "weak" as const, label: `Noch ${MIN_PASSWORD_LENGTH - p.length} Zeichen`, pct: Math.round((p.length / MIN_PASSWORD_LENGTH) * 70) };
  }
  // Simple, low-friction heuristic: length drives most of the security benefit.
  if (p.length < 14) return { level: "ok" as const, label: "Gut", pct: 82 };
  return { level: "strong" as const, label: "Sehr gut", pct: 100 };
}

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
  const [resetState, resetFormAction, resetPending] = useActionState(requestPasswordResetAction, initialState);
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordRepeat, setSignupPasswordRepeat] = useState("");
  const pw = useMemo(() => passwordScore(signupPassword), [signupPassword]);
  const [signupCooldownUntil, setSignupCooldownUntil] = useState<number | null>(null);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showSignupPasswordRepeat, setShowSignupPasswordRepeat] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const signupCooldownRemainingSec = useMemo(() => {
    if (!signupCooldownUntil) return 0;
    return Math.max(0, Math.ceil((signupCooldownUntil - nowMs) / 1000));
  }, [signupCooldownUntil, nowMs]);

  const signupPasswordsMatch = useMemo(() => {
    const a = signupPassword.trim();
    const b = signupPasswordRepeat.trim();
    if (!a && !b) return true;
    if (!a || !b) return true;
    return a === b;
  }, [signupPassword, signupPasswordRepeat]);

  useEffect(() => {
    if (signupState.code !== "RATE_LIMITED") return;

    // Low-friction backoff: discourage repeated clicks after rate limit.
    const ms = 30_000;
    setSignupCooldownUntil(Date.now() + ms);
  }, [signupState.code]);

  useEffect(() => {
    if (!signupCooldownUntil) return;
    const t = window.setInterval(() => setNowMs(Date.now()), 250);
    return () => window.clearInterval(t);
  }, [signupCooldownUntil]);

  useEffect(() => {
    if (!signupCooldownUntil) return;
    if (signupCooldownRemainingSec <= 0) setSignupCooldownUntil(null);
  }, [signupCooldownRemainingSec, signupCooldownUntil]);

  const activePanel = useMemo(
    () =>
      activeTab === "login"
        ? { title: copy.loginTitle, text: copy.loginText }
        : { title: copy.signupTitle, text: copy.signupText },
    [activeTab, copy.loginText, copy.loginTitle, copy.signupText, copy.signupTitle]
  );

  const inputClassName =
    "login-auth-input min-h-[3.75rem] rounded-[22px] border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] px-5 py-3.5 text-[0.9375rem] leading-snug shadow-[0_2px_12px_rgba(25,40,60,0.04)] transition-[box-shadow,border-color,transform] duration-200 focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(95,163,163,0.18),0_4px_20px_rgba(25,40,60,0.06)]";

  const primaryBtnClassName =
    "login-auth-submit min-h-[3.75rem] w-full rounded-[22px] text-[1.0625rem] font-semibold shadow-[0_10px_32px_rgba(44,122,123,0.28)] transition-[transform,box-shadow,filter] duration-200 hover:translate-y-0 hover:scale-[1.02] hover:shadow-[0_14px_36px_rgba(44,122,123,0.34)] active:scale-[0.99]";

  return (
    <Card className="login-auth-panel relative overflow-hidden rounded-[40px] border border-white/75 bg-[linear-gradient(168deg,rgba(255,242,242,0.97),rgba(244,238,248,0.5)_42%,rgba(228,236,252,0.96))] p-6 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_10px_28px_rgba(25,40,60,0.08),0_28px_72px_rgba(41,64,90,0.14),0_56px_140px_rgba(41,64,90,0.1)] ring-1 ring-black/[0.04] backdrop-blur-[14px] sm:p-8 lg:p-9">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(180deg,rgba(255,246,246,0.45),transparent)]" />
      <div className="relative space-y-8">
        <div className="space-y-4">
          <h2 className="text-[1.75rem] font-semibold leading-[1.15] tracking-[-0.04em] text-[var(--foreground)] sm:text-[2rem]">
            {copy.title}
          </h2>
          <p className="max-w-[36ch] text-[0.9375rem] leading-relaxed text-[var(--muted)] sm:text-base">{copy.text}</p>
        </div>

        <div
          className="inline-grid w-full grid-cols-2 gap-2 rounded-[28px] border border-white/75 bg-[linear-gradient(180deg,rgba(218,230,240,0.55),rgba(232,241,248,0.5))] p-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]"
          role="tablist"
          aria-label={`${copy.loginTab} / ${copy.signupTab}`}
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "login"}
            onClick={() => setActiveTab("login")}
            className={cn(
              "min-h-[3.25rem] rounded-[20px] px-4 text-sm font-semibold transition-all duration-200",
              activeTab === "login"
                ? "relative z-[1] scale-[1.02] bg-white text-[var(--foreground)] shadow-[0_10px_28px_rgba(34,54,78,0.12)] ring-1 ring-white/90"
                : "text-[var(--muted)] hover:bg-white/55 hover:text-[var(--foreground)]"
            )}
          >
            {copy.loginTab}
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "signup"}
            onClick={() => setActiveTab("signup")}
            className={cn(
              "min-h-[3.25rem] rounded-[20px] px-4 text-sm font-semibold transition-all duration-200",
              activeTab === "signup"
                ? "relative z-[1] scale-[1.02] bg-white text-[var(--foreground)] shadow-[0_10px_28px_rgba(34,54,78,0.12)] ring-1 ring-white/90"
                : "text-[var(--muted)] hover:bg-white/55 hover:text-[var(--foreground)]"
            )}
          >
            {copy.signupTab}
          </button>
        </div>

        <div className="rounded-[32px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(252,253,255,0.82))] p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_8px_32px_rgba(25,40,60,0.04)] sm:p-7">
          <div className="mb-7 space-y-2.5">
            <h3 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{activePanel.title}</h3>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{activePanel.text}</p>
          </div>

          {activeTab === "login" ? (
            resetMode ? (
              <form key="reset" action={resetFormAction} className="space-y-5">
                <input type="hidden" name="locale" value={locale} />
                <label className="block space-y-2.5">
                  <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">{copy.email}</span>
                  <Input name="email" type="email" required placeholder={copy.emailPlaceholder} className={inputClassName} />
                </label>
                {resetState.error ? <p className="text-sm text-[var(--danger)]">{resetState.error}</p> : null}
                {resetState.success ? <p className="text-sm text-[var(--accent)]">{resetState.success}</p> : null}
                <Button type="submit" className={primaryBtnClassName} disabled={resetPending}>
                  {resetPending ? (locale === "de" ? "Sende Link…" : "Sending link…") : locale === "de" ? "Link senden" : "Send link"}
                </Button>
                <button
                  type="button"
                  onClick={() => setResetMode(false)}
                  className="w-full text-sm font-medium text-[var(--muted)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
                >
                  {locale === "de" ? "Zurück zum Login" : "Back to sign in"}
                </button>
              </form>
            ) : (
              <form key="login" action={loginFormAction} className="space-y-5">
                <input type="hidden" name="next" value={nextPath?.startsWith("/app") ? nextPath : "/app"} />
                <input type="hidden" name="locale" value={locale} />
                <label className="block space-y-2.5">
                  <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">{copy.email}</span>
                  <Input name="email" type="email" required placeholder={copy.emailPlaceholder} className={inputClassName} />
                </label>
                <label className="block space-y-2.5">
                  <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">{copy.password}</span>
                  <div className="relative">
                    <Input
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      required
                      minLength={MIN_PASSWORD_LENGTH}
                      placeholder={copy.passwordPlaceholder}
                      className={cn(inputClassName, "pr-20")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                      aria-label={
                        showLoginPassword
                          ? locale === "de"
                            ? "Passwort verbergen"
                            : "Hide password"
                          : locale === "de"
                            ? "Passwort anzeigen"
                            : "Show password"
                      }
                    >
                      {showLoginPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
                    </button>
                  </div>
                </label>
                <div className="flex justify-end pt-0.5">
                  <button
                    type="button"
                    onClick={() => setResetMode(true)}
                    className="text-sm font-medium text-[var(--muted)] underline-offset-4 transition-colors hover:text-[var(--foreground)] hover:underline"
                  >
                    {copy.forgotPassword}
                  </button>
                </div>
                {loginState.error ? <p className="text-sm text-[var(--danger)]">{loginState.error}</p> : null}
                {loginState.success ? <p className="text-sm text-[var(--accent)]">{loginState.success}</p> : null}
                {loginState.code === "EMAIL_NOT_CONFIRMED" && loginState.email ? (
                  <p className="text-sm">
                    <Link
                      href={`/login/verify-email?email=${encodeURIComponent(loginState.email)}&locale=${encodeURIComponent(locale)}` as Route}
                      className="font-medium text-[var(--accent-strong)] underline-offset-4 transition hover:underline"
                    >
                      {locale === "de" ? "Bestätigungs-E-Mail nochmal ansehen / neu senden" : "Review / resend confirmation email"}
                    </Link>
                  </p>
                ) : null}
                <Button type="submit" className={primaryBtnClassName} disabled={loginPending}>
                  {loginPending ? copy.loginPending : copy.login}
                </Button>
              </form>
            )
          ) : (
            <form key="signup" action={signupFormAction} className="space-y-5">
              <input type="hidden" name="browserLanguage" value={locale} />
              <label className="block space-y-2.5">
                <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">{copy.fullName}</span>
                <Input
                  name="fullName"
                  required
                  placeholder={copy.namePlaceholder}
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2.5">
                <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">{copy.email}</span>
                <Input
                  name="email"
                  type="email"
                  required
                  placeholder={copy.emailPlaceholder}
                  className={inputClassName}
                />
              </label>
              <label className="block space-y-2.5">
                <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">{copy.password}</span>
                <div className="relative">
                  <Input
                    name="password"
                    type={showSignupPassword ? "text" : "password"}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    placeholder={copy.passwordPlaceholder}
                    className={cn(inputClassName, "pr-20")}
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                    aria-label={
                      showSignupPassword
                        ? locale === "de"
                          ? "Passwort verbergen"
                          : "Hide password"
                        : locale === "de"
                          ? "Passwort anzeigen"
                          : "Show password"
                    }
                  >
                    {showSignupPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
                  </button>
                </div>
                <div className="space-y-2">
                  <p className="text-sm text-[var(--muted)]">{copy.passwordHint}</p>
                  {pw.level !== "empty" ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-medium text-[var(--muted)]">
                        <span>
                          {locale === "de" ? "Passwort-Stärke" : "Password strength"}
                        </span>
                        <span className="tabular-nums">{pw.label}</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[rgba(232,220,207,0.55)]">
                        <div
                          className={cn(
                            "h-full rounded-full transition-[width] duration-300 ease-out",
                            pw.level === "weak"
                              ? "bg-[rgba(242,166,90,0.9)]"
                              : pw.level === "ok"
                                ? "bg-[image:var(--accent-gradient)]"
                                : "bg-[rgba(123,191,159,0.95)]"
                          )}
                          style={{ width: `${pw.pct}%` }}
                        />
                      </div>
                    </div>
                  ) : null}
                </div>
              </label>

              <label className="block space-y-2.5">
                <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">
                  {locale === "de" ? "Passwort wiederholen" : "Repeat password"}
                </span>
                <div className="relative">
                  <Input
                    name="passwordRepeat"
                    type={showSignupPasswordRepeat ? "text" : "password"}
                    required
                    minLength={MIN_PASSWORD_LENGTH}
                    placeholder={locale === "de" ? "Nochmal eingeben" : "Enter again"}
                    className={cn(inputClassName, "pr-20")}
                    value={signupPasswordRepeat}
                    onChange={(e) => setSignupPasswordRepeat(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowSignupPasswordRepeat((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
                    aria-label={
                      showSignupPasswordRepeat
                        ? locale === "de"
                          ? "Passwort verbergen"
                          : "Hide password"
                        : locale === "de"
                          ? "Passwort anzeigen"
                          : "Show password"
                    }
                  >
                    {showSignupPasswordRepeat ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
                  </button>
                </div>
                {!signupPasswordsMatch ? (
                  <p className="text-xs text-[var(--danger)]">
                    {locale === "de" ? "Die Passwörter stimmen nicht überein." : "Passwords do not match."}
                  </p>
                ) : null}
              </label>
              <label className="block space-y-2.5">
                <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">{copy.language}</span>
                <select
                  name="preferredLanguage"
                  defaultValue={defaultLanguage}
                  className="login-auth-input min-h-[3.75rem] w-full rounded-[22px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] px-5 text-sm text-[var(--foreground)] shadow-[0_2px_12px_rgba(25,40,60,0.04)] outline-none transition-[box-shadow,border-color] duration-200 focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(95,163,163,0.18),0_4px_20px_rgba(25,40,60,0.06)]"
                >
                  {LANGUAGE_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {signupState.error ? <p className="text-sm text-[var(--danger)]">{signupState.error}</p> : null}
              {signupCooldownRemainingSec > 0 ? (
                <p className="text-xs text-[var(--muted)]">
                  {locale === "de"
                    ? `Du kannst es in ${signupCooldownRemainingSec}s nochmal versuchen.`
                    : `You can try again in ${signupCooldownRemainingSec}s.`}
                </p>
              ) : null}
              {signupState.success ? <p className="text-sm text-[var(--accent)]">{signupState.success}</p> : null}
              <Button
                type="submit"
                className={primaryBtnClassName}
                disabled={
                  signupPending ||
                  signupCooldownRemainingSec > 0 ||
                  !signupPasswordsMatch ||
                  (signupPassword.trim().length > 0 && signupPassword.trim().length < MIN_PASSWORD_LENGTH)
                }
              >
                {signupPending ? copy.signupPending : copy.signup}
              </Button>
            </form>
          )}
        </div>

        <div className="flex items-start gap-3.5 rounded-[26px] border border-[rgba(95,163,163,0.18)] bg-[linear-gradient(180deg,rgba(95,163,163,0.11),rgba(95,163,163,0.06))] px-5 py-4 text-sm leading-relaxed text-[var(--muted)]">
          <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_0_5px_rgba(95,163,163,0.14)]" />
          <span>{copy.trustNote}</span>
        </div>
      </div>
    </Card>
  );
}
