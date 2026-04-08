"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  Download,
  FileStack,
  Languages,
  LoaderCircle,
  LockKeyhole,
  Save,
  Shield,
  Sparkles,
  Target,
  Trash2,
  WalletCards
} from "lucide-react";

import {
  clearAllBureauCareDataAction,
  createTesterCaseAction,
  createTesterDummyDocumentAction,
  deleteAccountAction,
  signOutEverywhereAction,
  updateDocumentSettingsAction,
  updateEmailAction,
  updateGoalSettingsAction,
  updateLanguageSettingsAction,
  updateLocationSettingsAction,
  updateNotificationSettingsAction,
  updatePasswordAction,
  updateTesterSettingsAction,
  type PrivacyActionState,
  type SecurityActionState,
  type SettingsActionState
} from "@/lib/actions/user-settings";
import { LANGUAGE_OPTIONS } from "@/lib/languages";
import { getRestSettingsCopy } from "@/lib/rest-settings-ui";
import type {
  AccountRole,
  DocumentPreferences,
  GoalPreferences,
  LocationPreferences,
  NotificationPreferences,
  UserSettingsRecord
} from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";

const initialSettingsState: SettingsActionState = { error: "", success: "" };
const initialSecurityState: SecurityActionState = { error: "", success: "" };
const initialPrivacyState: PrivacyActionState = { error: "", success: "" };

function ToggleField({
  name,
  defaultChecked,
  label,
  description
}: {
  name: string;
  defaultChecked: boolean;
  label: string;
  description: string;
}) {
  return (
    <label className="flex items-start justify-between gap-4 rounded-[24px] border border-[rgba(223,229,236,0.94)] bg-[rgba(252,252,253,0.96)] px-4 py-4">
      <div className="space-y-1">
        <p className="font-medium text-[var(--foreground)]">{label}</p>
        <p className="text-sm leading-6 text-[var(--muted)]">{description}</p>
      </div>
      <input type="checkbox" name={name} value="1" defaultChecked={defaultChecked} className="mt-1 h-5 w-5 rounded border-[var(--line)]" />
    </label>
  );
}

function SubmitRow({
  pending,
  saveLabel,
  savingLabel,
  error,
  success
}: {
  pending: boolean;
  saveLabel: string;
  savingLabel: string;
  error: string;
  success: string;
}) {
  return (
    <div className="space-y-3">
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      {success ? <p className="text-sm text-[var(--success)]">{success}</p> : null}
      <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
        {pending ? (
          <>
            <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
            {savingLabel}
          </>
        ) : (
          <>
            <Save className="mr-2 h-4 w-4" />
            {saveLabel}
          </>
        )}
      </Button>
    </div>
  );
}

export function LanguageSettingsPanel({
  locale,
  preferredLanguage,
  settings
}: {
  locale: string;
  preferredLanguage: string | null;
  settings: UserSettingsRecord;
}) {
  const copy = getRestSettingsCopy(locale);
  const [state, formAction, pending] = useActionState(updateLanguageSettingsAction, initialSettingsState);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
      <Card className="space-y-6 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.language.title}</h3>
          <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{copy.language.intro}</p>
        </div>
        <form action={formAction} className="space-y-5">
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--foreground)]">{copy.language.appLanguage}</span>
            <select
              name="appLanguage"
              defaultValue={preferredLanguage ?? "de"}
              className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)]"
            >
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--foreground)]">{copy.language.nativeLanguage}</span>
            <select
              name="nativeLanguage"
              defaultValue={settings.language_preferences.native_language ?? ""}
              className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)]"
            >
              <option value="">-</option>
              {LANGUAGE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-3">
            <p className="text-sm font-medium text-[var(--foreground)]">{copy.language.replyLanguage}</p>
            <div className="grid gap-3 sm:grid-cols-3">
              {(["german_only", "app_language", "native_only"] as const).map((mode) => {
                const option = copy.language.replyModes[mode];
                return (
                  <label key={mode} className="cursor-pointer">
                    <input className="peer sr-only" type="radio" name="replyLanguageMode" value={mode} defaultChecked={settings.language_preferences.reply_language_mode === mode} />
                    <span className="flex h-full rounded-[24px] border border-[rgba(223,229,236,0.94)] bg-white p-4 text-left transition peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent-soft)]">
                      <span className="space-y-1">
                        <span className="block font-semibold text-[var(--foreground)]">{option.label}</span>
                        <span className="block text-sm leading-6 text-[var(--muted)]">{option.description}</span>
                      </span>
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
          <ToggleField
            name="simplifiedLanguage"
            defaultChecked={settings.language_preferences.simplified_language}
            label={copy.language.simplifiedLanguage.label}
            description={copy.language.simplifiedLanguage.description}
          />
          <ToggleField
            name="explainTerms"
            defaultChecked={settings.language_preferences.explain_terms}
            label={copy.language.explainTerms.label}
            description={copy.language.explainTerms.description}
          />
          <SubmitRow pending={pending} saveLabel={copy.save} savingLabel={copy.saving} error={state.error} success={state.success} />
        </form>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[rgba(159,201,219,0.18)] p-3 text-[rgba(62,125,150,0.95)]">
            <Languages className="h-5 w-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.language.title}</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.language.intro}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function DocumentsSettingsPanel({ locale, preferences }: { locale: string; preferences: DocumentPreferences }) {
  const copy = getRestSettingsCopy(locale);
  const [state, formAction, pending] = useActionState(updateDocumentSettingsAction, initialSettingsState);
  const names = [
    "autoCaseAssignment",
    "autoSortBySender",
    "autoMergeMultiPage",
    "autoRename",
    "keepOriginals",
    "autoUpdateStatus"
  ] as const;
  const values = [
    preferences.auto_case_assignment,
    preferences.auto_sort_by_sender,
    preferences.auto_merge_multi_page,
    preferences.auto_rename,
    preferences.keep_originals,
    preferences.auto_update_status
  ];

  return (
    <Card className="space-y-6 p-5 sm:p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.documents.title}</h3>
        <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{copy.documents.intro}</p>
      </div>
      <form action={formAction} className="space-y-4">
        {copy.documents.toggles.map((toggle, index) => (
          <ToggleField key={names[index]} name={names[index]} defaultChecked={values[index]} label={toggle.label} description={toggle.description} />
        ))}
        <SubmitRow pending={pending} saveLabel={copy.save} savingLabel={copy.saving} error={state.error} success={state.success} />
      </form>
    </Card>
  );
}

export function LocationSettingsPanel({ locale, preferences }: { locale: string; preferences: LocationPreferences }) {
  const copy = getRestSettingsCopy(locale);
  const [state, formAction, pending] = useActionState(updateLocationSettingsAction, initialSettingsState);
  const names = ["useForOffices", "useForDropoff", "useForAppointments", "useForProcessHints"] as const;
  const values = [preferences.use_for_offices, preferences.use_for_dropoff, preferences.use_for_appointments, preferences.use_for_process_hints];

  return (
    <Card className="space-y-6 p-5 sm:p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.location.title}</h3>
        <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{copy.location.intro}</p>
      </div>
      <form action={formAction} className="space-y-4">
        <ToggleField name="locationEnabled" defaultChecked={preferences.enabled} label={copy.location.title} description={copy.location.localInfo} />
        <div className="space-y-3">
          <p className="text-sm font-medium text-[var(--foreground)]">{copy.location.usesTitle}</p>
          {copy.location.uses.map((toggle, index) => (
            <ToggleField key={names[index]} name={names[index]} defaultChecked={values[index]} label={toggle.label} description={toggle.description} />
          ))}
        </div>
        <SubmitRow pending={pending} saveLabel={copy.save} savingLabel={copy.saving} error={state.error} success={state.success} />
      </form>
    </Card>
  );
}

export function GoalsSettingsPanel({ locale, preferences }: { locale: string; preferences: GoalPreferences }) {
  const copy = getRestSettingsCopy(locale);
  const [state, formAction, pending] = useActionState(updateGoalSettingsAction, initialSettingsState);
  const names = ["showAge", "showFinanceTracker", "allowAiSuggestions", "showProgress", "remindersEnabled"] as const;
  const values = [
    preferences.show_age,
    preferences.show_finance_tracker,
    preferences.allow_ai_suggestions,
    preferences.show_progress,
    preferences.reminders_enabled
  ];

  return (
    <Card className="space-y-6 p-5 sm:p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.goals.title}</h3>
        <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{copy.goals.intro}</p>
      </div>
      <form action={formAction} className="space-y-4">
        {copy.goals.toggles.map((toggle, index) => (
          <ToggleField key={names[index]} name={names[index]} defaultChecked={values[index]} label={toggle.label} description={toggle.description} />
        ))}
        <SubmitRow pending={pending} saveLabel={copy.save} savingLabel={copy.saving} error={state.error} success={state.success} />
      </form>
    </Card>
  );
}

export function NotificationsSettingsPanel({
  locale,
  preferences
}: {
  locale: string;
  preferences: NotificationPreferences;
}) {
  const copy = getRestSettingsCopy(locale);
  const [state, formAction, pending] = useActionState(updateNotificationSettingsAction, initialSettingsState);
  const rows = [
    { key: "deadlines", values: preferences.deadlines, names: ["deadlinesInApp", "deadlinesEmail"] as const },
    { key: "analysis", values: preferences.analysis_ready, names: ["analysisInApp", "analysisEmail"] as const },
    { key: "replies", values: preferences.reply_ready, names: ["replyInApp", "replyEmail"] as const },
    { key: "cases", values: preferences.case_status, names: ["caseInApp", "caseEmail"] as const },
    { key: "suggestions", values: preferences.suggestions, names: ["suggestionsInApp", "suggestionsEmail"] as const },
    { key: "goals", values: preferences.goal_reminders, names: ["goalInApp", "goalEmail"] as const }
  ] as const;

  return (
    <Card className="space-y-6 p-5 sm:p-6">
      <div className="space-y-2">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.notifications.title}</h3>
        <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{copy.notifications.intro}</p>
      </div>
      <form action={formAction} className="space-y-4">
        {rows.map((row) => {
          const item = copy.notifications.channels[row.key];
          return (
            <div key={row.key} className="rounded-[24px] border border-[rgba(223,229,236,0.94)] bg-[rgba(252,252,253,0.96)] p-4">
              <div className="space-y-1">
                <p className="font-medium text-[var(--foreground)]">{item.title}</p>
                <p className="text-sm leading-6 text-[var(--muted)]">{item.description}</p>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                  <input type="checkbox" name={row.names[0]} value="1" defaultChecked={row.values.in_app} className="h-4 w-4 rounded border-[var(--line)]" />
                  <span className="text-sm text-[var(--foreground)]">{copy.inApp}</span>
                </label>
                <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
                  <input type="checkbox" name={row.names[1]} value="1" defaultChecked={row.values.email} className="h-4 w-4 rounded border-[var(--line)]" />
                  <span className="text-sm text-[var(--foreground)]">{copy.byEmail}</span>
                </label>
              </div>
            </div>
          );
        })}
        <SubmitRow pending={pending} saveLabel={copy.save} savingLabel={copy.saving} error={state.error} success={state.success} />
      </form>
    </Card>
  );
}

export function SecuritySettingsPanel({ locale, email }: { locale: string; email: string | null }) {
  const copy = getRestSettingsCopy(locale);
  const [passwordState, passwordAction, passwordPending] = useActionState(updatePasswordAction, initialSecurityState);
  const [emailState, emailAction, emailPending] = useActionState(updateEmailAction, initialSecurityState);
  const [signOutState, signOutAction, signOutPending] = useActionState(signOutEverywhereAction, initialSecurityState);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.security.passwordTitle}</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.security.passwordHint}</p>
        <form action={passwordAction} className="space-y-4">
          <input name="password" type="password" placeholder={copy.security.newPassword} className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm" />
          <input name="confirmPassword" type="password" placeholder={copy.security.confirmPassword} className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm" />
          <SubmitRow pending={passwordPending} saveLabel={copy.security.changePassword} savingLabel={copy.saving} error={passwordState.error} success={passwordState.success} />
        </form>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.security.emailTitle}</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.security.emailHint}</p>
        <p className="text-sm font-medium text-[var(--foreground)]">{email ?? "-"}</p>
        <form action={emailAction} className="space-y-4">
          <input name="email" type="email" placeholder={copy.security.newEmail} className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm" />
          <SubmitRow pending={emailPending} saveLabel={copy.security.changeEmail} savingLabel={copy.saving} error={emailState.error} success={emailState.success} />
        </form>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.security.sessionsTitle}</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.security.sessionsHint}</p>
        <form action={signOutAction} className="space-y-3">
          {signOutState.error ? <p className="text-sm text-[var(--danger)]">{signOutState.error}</p> : null}
          {signOutState.success ? <p className="text-sm text-[var(--success)]">{signOutState.success}</p> : null}
          <Button type="submit" variant="secondary" className="w-full sm:w-auto" disabled={signOutPending}>
            {signOutPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <LockKeyhole className="mr-2 h-4 w-4" />}
            {copy.security.signOutEverywhere}
          </Button>
        </form>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.security.twoFactorTitle}</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.security.twoFactorText}</p>
      </Card>
    </div>
  );
}

export function UsageSettingsPanel({
  locale,
  role,
  usage
}: {
  locale: string;
  role: AccountRole;
  usage: {
    analysisCount: number;
    analysisLimit: number | null;
    replyCount: number;
    replyLimit: number | null;
    uploadCount: number;
    uploadLimit: number | null;
  } | null;
}) {
  const copy = getRestSettingsCopy(locale);
  const planLabel =
    role === "tester"
      ? copy.usage.testerUnlimited
      : role === "admin" || role === "super_admin"
        ? copy.usage.adminPlan
        : copy.usage.freePlan;

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(280px,320px)]">
      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.usage.title}</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.usage.intro}</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[22px] border border-[rgba(223,229,236,0.94)] bg-[rgba(252,252,253,0.94)] p-4">
            <p className="text-lg font-semibold text-[var(--foreground)]">{usage ? `${usage.analysisCount} / ${usage.analysisLimit ?? "∞"}` : "-"}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{copy.usage.analyses}</p>
          </div>
          <div className="rounded-[22px] border border-[rgba(223,229,236,0.94)] bg-[rgba(252,252,253,0.94)] p-4">
            <p className="text-lg font-semibold text-[var(--foreground)]">{usage ? `${usage.replyCount} / ${usage.replyLimit ?? "∞"}` : "-"}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{copy.usage.replies}</p>
          </div>
          <div className="rounded-[22px] border border-[rgba(223,229,236,0.94)] bg-[rgba(252,252,253,0.94)] p-4">
            <p className="text-lg font-semibold text-[var(--foreground)]">{usage ? `${usage.uploadCount} / ${usage.uploadLimit ?? "∞"}` : "-"}</p>
            <p className="mt-1 text-sm text-[var(--muted)]">{copy.usage.uploads}</p>
          </div>
        </div>
      </Card>
      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.usage.currentPlan}</h3>
        <StatusBadge tone={role === "tester" || role === "admin" || role === "super_admin" ? "success" : "neutral"}>{planLabel}</StatusBadge>
        {role === "user" ? (
          <Button type="button" variant="secondary" className="w-full sm:w-auto">
            <WalletCards className="mr-2 h-4 w-4" />
            {copy.usage.upgrade}
          </Button>
        ) : null}
        {usage?.uploadLimit === null ? <p className="text-sm leading-6 text-[var(--muted)]">{copy.usage.noUploadLimit}</p> : null}
      </Card>
    </div>
  );
}

export function PrivacySettingsPanel({ locale }: { locale: string }) {
  const copy = getRestSettingsCopy(locale);
  const [clearState, clearAction, clearPending] = useActionState(clearAllBureauCareDataAction, initialPrivacyState);
  const [deleteState, deleteAction, deletePending] = useActionState(deleteAccountAction, initialPrivacyState);

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.privacy.title}</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.privacy.intro}</p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link href="/api/settings/export/data" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-5 text-sm font-semibold text-[var(--foreground)]">
            <Download className="mr-2 h-4 w-4" />
            {copy.privacy.exportData}
          </Link>
          <Link href="/api/settings/export/documents" className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-5 text-sm font-semibold text-[var(--foreground)]">
            <FileStack className="mr-2 h-4 w-4" />
            {copy.privacy.exportDocuments}
          </Link>
        </div>
      </Card>
      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.privacy.clearData}</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.privacy.clearDataHint}</p>
        <form action={clearAction} className="space-y-3">
          {clearState.error ? <p className="text-sm text-[var(--danger)]">{clearState.error}</p> : null}
          {clearState.success ? <p className="text-sm text-[var(--success)]">{clearState.success}</p> : null}
          <Button type="submit" variant="secondary" disabled={clearPending}>
            {clearPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
            {copy.privacy.clearData}
          </Button>
        </form>
      </Card>
      <Card className="space-y-4 p-5 sm:p-6">
        <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.privacy.deleteAccount}</h3>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.privacy.deleteAccountHint}</p>
        <form action={deleteAction} className="space-y-3">
          {deleteState.error ? <p className="text-sm text-[var(--danger)]">{deleteState.error}</p> : null}
          {deleteState.success ? <p className="text-sm text-[var(--success)]">{deleteState.success}</p> : null}
          <Button type="submit" variant="secondary" disabled={deletePending}>
            {deletePending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
            {copy.privacy.deleteAccount}
          </Button>
        </form>
      </Card>
      <Card className="space-y-4 p-5 sm:p-6">
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.privacy.policyTitle}</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.privacy.policyText}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.privacy.termsTitle}</h3>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.privacy.termsText}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

export function TesterAdminPanel({
  locale,
  role,
  features
}: {
  locale: string;
  role: AccountRole;
  features: { feature_goals_enabled: boolean; feature_modules_enabled: boolean; beta_features_enabled: boolean };
}) {
  const copy = getRestSettingsCopy(locale);
  const [settingsState, settingsAction, settingsPending] = useActionState(updateTesterSettingsAction, initialSettingsState);
  const [caseState, caseAction, casePending] = useActionState(createTesterCaseAction, initialSettingsState);
  const [docState, docAction, docPending] = useActionState(createTesterDummyDocumentAction, initialSettingsState);

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(300px,320px)]">
      <Card className="space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.tester.title}</h3>
          <p className="text-sm leading-7 text-[var(--muted)]">{copy.tester.intro}</p>
        </div>
        <StatusBadge tone="success">{copy.tester.badges[role]}</StatusBadge>
        <form action={settingsAction} className="space-y-4">
          <p className="text-sm font-medium text-[var(--foreground)]">{copy.tester.featureFlags}</p>
          <ToggleField name="featureGoalsEnabled" defaultChecked={features.feature_goals_enabled} label={copy.tester.toggles[0].label} description={copy.tester.toggles[0].description} />
          <ToggleField name="featureModulesEnabled" defaultChecked={features.feature_modules_enabled} label={copy.tester.toggles[1].label} description={copy.tester.toggles[1].description} />
          <ToggleField name="betaFeaturesEnabled" defaultChecked={features.beta_features_enabled} label={copy.tester.toggles[2].label} description={copy.tester.toggles[2].description} />
          <SubmitRow pending={settingsPending} saveLabel={copy.save} savingLabel={copy.saving} error={settingsState.error} success={settingsState.success} />
        </form>
      </Card>
      <Card className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.tester.roleLabel}</h3>
          <p className="text-sm leading-6 text-[var(--muted)]">{copy.tester.unlimited}</p>
        </div>
        <form action={caseAction} className="space-y-3">
          {caseState.error ? <p className="text-sm text-[var(--danger)]">{caseState.error}</p> : null}
          {caseState.success ? <p className="text-sm text-[var(--success)]">{caseState.success}</p> : null}
          <Button type="submit" variant="secondary" disabled={casePending}>
            {casePending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Target className="mr-2 h-4 w-4" />}
            {copy.tester.createCase}
          </Button>
        </form>
        <form action={docAction} className="space-y-3">
          {docState.error ? <p className="text-sm text-[var(--danger)]">{docState.error}</p> : null}
          {docState.success ? <p className="text-sm text-[var(--success)]">{docState.success}</p> : null}
          <Button type="submit" variant="secondary" disabled={docPending}>
            {docPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
            {copy.tester.createDocument}
          </Button>
        </form>
      </Card>
    </div>
  );
}
