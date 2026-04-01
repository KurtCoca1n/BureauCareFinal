"use client";

import { useActionState } from "react";
import { Globe, LoaderCircle, Save, UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { updateProfileSettingsAction, type ProfileSettingsState } from "@/lib/actions/profile";
import { LANGUAGE_OPTIONS } from "@/lib/languages";

const initialState: ProfileSettingsState = {
  error: "",
  success: ""
};

export function SettingsForm({
  fullName,
  preferredLanguage,
  labels
}: {
  fullName: string | null;
  preferredLanguage: string | null;
  labels: {
    fullName: string;
    translationLanguage: string;
    save: string;
    saving: string;
    placeholder: string;
  };
}) {
  const [state, formAction, pending] = useActionState(updateProfileSettingsAction, initialState);

  return (
    <Card className="space-y-5 p-6">
      <form action={formAction} className="space-y-5">
        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium">
            <UserRound className="h-4 w-4 text-[var(--muted)]" />
            {labels.fullName}
          </span>
          <input
            name="fullName"
            defaultValue={fullName ?? ""}
            placeholder={labels.placeholder}
            className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            required
          />
        </label>

        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Globe className="h-4 w-4 text-[var(--muted)]" />
            {labels.translationLanguage}
          </span>
          <select
            name="preferredLanguage"
            defaultValue={preferredLanguage ?? "de"}
            className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
          >
            {LANGUAGE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>

        {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}

        <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
          {pending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {labels.saving}
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              {labels.save}
            </>
          )}
        </Button>
      </form>
    </Card>
  );
}
