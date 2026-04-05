"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { CalendarDays, CheckCircle2, Globe, LoaderCircle, Mail, Phone, Save, ShieldCheck, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { updateProfileDetailsAction, type ProfileDetailsState } from "@/lib/actions/profile";
import { getProfileSettingsCopy } from "@/lib/profile-settings-ui";

const initialState: ProfileDetailsState = {
  error: "",
  success: ""
};

export function ProfileSettingsPanel({
  locale,
  firstName,
  lastName,
  email,
  phoneNumber,
  preferredLanguageLabel,
  createdAtLabel,
  emailConfirmed
}: {
  locale: string;
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneNumber: string | null;
  preferredLanguageLabel: string;
  createdAtLabel: string;
  emailConfirmed: boolean;
}) {
  const copy = getProfileSettingsCopy(locale);
  const [state, formAction, pending] = useActionState(updateProfileDetailsAction, initialState);
  const [firstNameValue, setFirstNameValue] = useState(firstName ?? "");
  const [lastNameValue, setLastNameValue] = useState(lastName ?? "");
  const fullNamePreview = [firstNameValue.trim(), lastNameValue.trim()].filter(Boolean).join(" ");

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)]">
      <Card className="space-y-6 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.basicCardTitle}</h3>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">{copy.basicCardText}</p>
        </div>

        <form action={formAction} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <UserRound className="h-4 w-4 text-[var(--muted)]" />
                {copy.firstName}
              </span>
              <input
                name="firstName"
                defaultValue={firstName ?? ""}
                onChange={(event) => setFirstNameValue(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                required
              />
            </label>

            <label className="block space-y-2">
              <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <UserRound className="h-4 w-4 text-[var(--muted)]" />
                {copy.lastName}
              </span>
              <input
                name="lastName"
                defaultValue={lastName ?? ""}
                onChange={(event) => setLastNameValue(event.target.value)}
                className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                required
              />
            </label>
          </div>

          <div className="rounded-[24px] border border-[rgba(223,229,236,0.94)] bg-[rgba(249,251,252,0.92)] p-4">
            <p className="text-sm font-medium text-[var(--foreground)]">{copy.fullNameLabel}</p>
            <p className="mt-2 text-base font-semibold text-[var(--foreground)]">{fullNamePreview || "-"}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.fullNameHint}</p>
          </div>

          <label className="block space-y-2">
            <span className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
              <Phone className="h-4 w-4 text-[var(--muted)]" />
              {copy.phone}
            </span>
            <input
              name="phoneNumber"
              defaultValue={phoneNumber ?? ""}
              placeholder={copy.phonePlaceholder}
              className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.phoneHint}</p>
          </label>

          {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}

          <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
            {pending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {copy.saving}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {copy.save}
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="space-y-5">
        <Card className="space-y-4 p-5 sm:p-6">
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.title}</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.intro}</p>
          </div>

          <div className="space-y-4 text-sm">
            <div className="space-y-1">
              <p className="text-[var(--muted)]">{copy.email}</p>
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <Mail className="h-4 w-4 text-[var(--muted)]" />
                <span className="font-medium">{email ?? "-"}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[var(--muted)]">{copy.emailStatus}</p>
              <StatusBadge tone={emailConfirmed ? "success" : "neutral"}>
                {emailConfirmed ? copy.emailVerified : copy.emailNotVerified}
              </StatusBadge>
            </div>

            <div className="space-y-1">
              <p className="text-[var(--muted)]">{copy.memberSince}</p>
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <CalendarDays className="h-4 w-4 text-[var(--muted)]" />
                <span className="font-medium">{createdAtLabel}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[var(--muted)]">{copy.phone}</p>
              <div className="flex items-center gap-2 text-[var(--foreground)]">
                <Phone className="h-4 w-4 text-[var(--muted)]" />
                <span className="font-medium">{phoneNumber?.trim() || copy.noPhone}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.signatureTitle}</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.signatureText}</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(223,229,236,0.94)] bg-[rgba(249,251,252,0.92)] p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
              <CheckCircle2 className="h-4 w-4 text-[var(--success)]" />
              {fullNamePreview || "-"}
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.languageTitle}</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.languageText}</p>
          </div>
          <div className="flex items-center justify-between gap-3 rounded-[22px] border border-[rgba(223,229,236,0.94)] bg-[rgba(249,251,252,0.92)] p-4">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-[var(--muted)]" />
              <span className="text-sm font-medium text-[var(--foreground)]">{preferredLanguageLabel}</span>
            </div>
            <Link href="/app/settings?section=language" className="text-sm font-semibold text-[var(--accent)]">
              {copy.languageAction}
            </Link>
          </div>
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.emailChangeTitle}</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.emailChangeText}</p>
          </div>
          <Link
            href="/app/settings?section=security"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[rgba(232,220,207,0.85)] bg-[rgba(232,220,207,0.32)] px-5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-[rgba(232,220,207,0.48)]"
          >
            <ShieldCheck className="mr-2 h-4 w-4" />
            {copy.emailChangeAction}
          </Link>
        </Card>
      </div>
    </div>
  );
}
