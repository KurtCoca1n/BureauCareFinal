"use client";

import { useActionState, useMemo, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePasswordAfterRecoveryAction, type AuthFormState } from "@/lib/actions/auth";
import type { SupportedLanguage } from "@/lib/languages";
import { cn } from "@/lib/utils";

const initialState: AuthFormState = { error: "", success: "" };
const MIN_PASSWORD_LENGTH = 8;

export function ResetPasswordForm({
  locale,
  submitLabel,
  pendingLabel
}: {
  locale: SupportedLanguage;
  submitLabel: string;
  pendingLabel: string;
}) {
  const [state, action, pending] = useActionState(updatePasswordAfterRecoveryAction, initialState);
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordRepeat, setShowPasswordRepeat] = useState(false);

  const inputClassName =
    "login-auth-input min-h-[3.75rem] rounded-[22px] border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] px-5 py-3.5 text-[0.9375rem] leading-snug shadow-[0_2px_12px_rgba(25,40,60,0.04)] transition-[box-shadow,border-color,transform] duration-200 focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(95,163,163,0.18),0_4px_20px_rgba(25,40,60,0.06)]";

  const passwordsMatch = useMemo(() => {
    const a = password.trim();
    const b = passwordRepeat.trim();
    if (!a && !b) return true;
    if (!a || !b) return true;
    return a === b;
  }, [password, passwordRepeat]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="locale" value={locale} />

      <label className="block space-y-2.5">
        <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">{locale === "de" ? "Neues Passwort" : "New password"}</span>
        <div className="relative">
          <Input
            name="password"
            type={showPassword ? "text" : "password"}
            required
            minLength={MIN_PASSWORD_LENGTH}
            placeholder={locale === "de" ? "Mindestens 8 Zeichen" : "At least 8 characters"}
            className={cn(inputClassName, "pr-20")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label={
              showPassword ? (locale === "de" ? "Passwort verbergen" : "Hide password") : locale === "de" ? "Passwort anzeigen" : "Show password"
            }
          >
            {showPassword ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
          </button>
        </div>
      </label>

      <label className="block space-y-2.5">
        <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">
          {locale === "de" ? "Passwort wiederholen" : "Repeat password"}
        </span>
        <div className="relative">
          <Input
            name="passwordRepeat"
            type={showPasswordRepeat ? "text" : "password"}
            required
            minLength={MIN_PASSWORD_LENGTH}
            placeholder={locale === "de" ? "Nochmal eingeben" : "Enter again"}
            className={cn(inputClassName, "pr-20")}
            value={passwordRepeat}
            onChange={(e) => setPasswordRepeat(e.target.value)}
          />
          <button
            type="button"
            onClick={() => setShowPasswordRepeat((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[var(--muted)] transition hover:text-[var(--foreground)]"
            aria-label={
              showPasswordRepeat
                ? locale === "de"
                  ? "Passwort verbergen"
                  : "Hide password"
                : locale === "de"
                  ? "Passwort anzeigen"
                  : "Show password"
            }
          >
            {showPasswordRepeat ? <EyeOff className="h-5 w-5" aria-hidden /> : <Eye className="h-5 w-5" aria-hidden />}
          </button>
        </div>
        {!passwordsMatch ? (
          <p className="text-xs text-[var(--danger)]">{locale === "de" ? "Die Passwörter stimmen nicht überein." : "Passwords do not match."}</p>
        ) : null}
      </label>

      {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
      {state.success ? <p className="text-sm text-[var(--accent)]">{state.success}</p> : null}

      <Button type="submit" className="min-h-14 w-full rounded-2xl text-base" disabled={pending || !passwordsMatch}>
        {pending ? pendingLabel : submitLabel}
      </Button>
    </form>
  );
}

