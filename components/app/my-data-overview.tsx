"use client";

import Link from "next/link";
import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, PencilLine, Save, ShieldCheck, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { clearUserPersonalDataFieldAction, clearUserPersonalDataSectionAction, deleteUserPersonalDataAction, saveUserPersonalDataSectionAction } from "@/lib/actions/user-personal-data";
import { PersonalDataSuggestionsSection } from "@/components/app/personal-data-suggestions-section";
import { getDateInputHint, getDateInputLocale } from "@/lib/date-input";
import {
  formatMetaTimestamp,
  formatMyDataValue,
  getMetaSourceLabel,
  getMyDataCopy,
  getMyDataText,
  getSectionFieldRows,
  getSectionMetaSummary,
  myDataSections
} from "@/lib/my-data-ui";
import type { PersonalDataSuggestion, UserPersonalDataRecord, UserPersonalDataSectionKey } from "@/lib/types";

function buildInitialDraft(record: UserPersonalDataRecord | null | undefined) {
  return Object.fromEntries(
    myDataSections.map((section) => [
      section.key,
      Object.fromEntries(section.fields.map((field) => [field.key, String((record?.[section.key] as Record<string, unknown> | undefined)?.[field.key] ?? "")]))
    ])
  ) as Record<UserPersonalDataSectionKey, Record<string, string>>;
}

export function MyDataOverview({
  locale,
  initialRecord,
  suggestions,
  embedded = false,
  showSuggestions = true,
  showSettingsLink = false
}: {
  locale: string;
  initialRecord: UserPersonalDataRecord | null;
  suggestions: PersonalDataSuggestion[];
  embedded?: boolean;
  showSuggestions?: boolean;
  showSettingsLink?: boolean;
}) {
  const copy = getMyDataCopy(locale);
  const [record, setRecord] = useState<UserPersonalDataRecord | null>(initialRecord);
  const [editingSection, setEditingSection] = useState<UserPersonalDataSectionKey | null>(null);
  const [draft, setDraft] = useState<Record<UserPersonalDataSectionKey, Record<string, string>>>(() => buildInitialDraft(initialRecord));
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasAnyValues = useMemo(
    () => myDataSections.some((section) => getSectionFieldRows(section, record).length > 0),
    [record]
  );

  function syncRecord(nextRecord: UserPersonalDataRecord | null) {
    setRecord(nextRecord);
    setDraft(buildInitialDraft(nextRecord));
  }

  function handleSaveSection(section: UserPersonalDataSectionKey) {
    const patch = draft[section];
    startTransition(async () => {
      const result = await saveUserPersonalDataSectionAction({
        section,
        patch,
        source: "user_input",
        confirmedByUser: true
      });

      if (!result.ok) {
        setMessage({ type: "error", text: copy.deleting });
        return;
      }

      syncRecord(result.record);
      setEditingSection(null);
      setMessage({ type: "success", text: copy.saved });
    });
  }

  function handleDeleteField(section: UserPersonalDataSectionKey, field: string) {
    if (!window.confirm(copy.confirmDeleteField)) {
      return;
    }

    startTransition(async () => {
      const result = await clearUserPersonalDataFieldAction({ section, field });

      if (!result.ok) {
        setMessage({ type: "error", text: copy.deleting });
        return;
      }

      syncRecord(result.record);
      setMessage({ type: "success", text: copy.deleted });
    });
  }

  function handleDeleteSection(section: UserPersonalDataSectionKey) {
    if (!window.confirm(copy.confirmDeleteSection)) {
      return;
    }

    startTransition(async () => {
      const result = await clearUserPersonalDataSectionAction(section);

      if (!result.ok) {
        setMessage({ type: "error", text: copy.deleting });
        return;
      }

      syncRecord(result.record);
      if (editingSection === section) {
        setEditingSection(null);
      }
      setMessage({ type: "success", text: copy.deleted });
    });
  }

  function handleDeleteAll() {
    if (!window.confirm(copy.confirmDeleteAll)) {
      return;
    }

    startTransition(async () => {
      const result = await deleteUserPersonalDataAction();
      if (!result.ok) {
        setMessage({ type: "error", text: copy.deleting });
        return;
      }

      syncRecord(null);
      setEditingSection(null);
      setMessage({ type: "success", text: copy.deleted });
    });
  }

  return (
    <div className="space-y-6">
      <section className={embedded ? "space-y-4" : "space-y-4 pt-2"}>
        {!embedded ? (
          <Link href="/app/settings" className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]">
            <ArrowLeft className="h-4 w-4" />
            {copy.backToSettings}
          </Link>
        ) : null}
        <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(243,249,250,0.92))] p-6 sm:p-8">
          <div className="space-y-3">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(95,163,163,0.22)] bg-[rgba(95,163,163,0.1)] px-3 py-1 text-sm font-semibold text-[var(--accent-strong)]">
              <ShieldCheck className="h-4 w-4" />
              {copy.title}
            </div>
            <h1 className="page-title page-title-accent text-3xl sm:text-5xl">{copy.title}</h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--foreground)]/86">{copy.intro}</p>
          </div>
          <div className="mt-6 rounded-[24px] border border-[rgba(214,224,235,0.92)] bg-[rgba(247,250,252,0.92)] p-4 sm:p-5">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[var(--foreground)]">{copy.trustTitle}</p>
              <p className="text-sm leading-7 text-[var(--muted)]">{copy.trustText}</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {showSettingsLink ? (
              <Link
                href="/app/settings?section=personal-data"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[rgba(232,220,207,0.85)] bg-[rgba(232,220,207,0.32)] px-5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 hover:bg-[rgba(232,220,207,0.48)]"
              >
                {copy.backToSettings}
              </Link>
            ) : null}
            <Button variant="secondary" onClick={handleDeleteAll} disabled={isPending || !hasAnyValues}>
              <Trash2 className="mr-2 h-4 w-4" />
              {copy.deleteAll}
            </Button>
          </div>
          {message ? (
            <p className={message.type === "error" ? "mt-4 text-sm text-[var(--danger)]" : "mt-4 text-sm text-[var(--success)]"}>
              {message.text}
            </p>
          ) : null}
        </Card>
      </section>

      {!hasAnyValues ? (
        <Card className="p-8">
          <h2 className="text-xl font-semibold">{copy.pageEmptyTitle}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)]">{copy.pageEmptyText}</p>
        </Card>
      ) : null}

      {showSuggestions ? <PersonalDataSuggestionsSection locale={locale} suggestions={suggestions} compact /> : null}

      <div className="grid gap-6 xl:grid-cols-2">
        {myDataSections.map((section) => {
          const rows = getSectionFieldRows(section, record);
          const sectionMeta = getSectionMetaSummary(section.key, record);
          const isEditing = editingSection === section.key;

          return (
            <Card key={section.key} className="flex h-full flex-col border-[var(--line)] p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-[-0.02em]">{getMyDataText(locale, section.title)}</h2>
                  <p className="text-sm leading-6 text-[var(--muted)]">{getMyDataText(locale, section.description)}</p>
                  <p className="text-xs font-medium uppercase tracking-[0.16em] text-[rgba(79,102,125,0.72)]">{copy.reuseHint}</p>
                  {sectionMeta ? (
                    <div className="flex flex-wrap gap-2 text-xs text-[var(--muted)]">
                      {sectionMeta.latestUpdatedAt ? <span>{copy.updatedAt}: {formatMetaTimestamp(locale, sectionMeta.latestUpdatedAt)}</span> : null}
                      {sectionMeta.latestSource ? <span>{getMetaSourceLabel(locale, sectionMeta.latestSource)}</span> : null}
                      <span>{sectionMeta.allConfirmed ? copy.confirmedByUser : copy.notConfirmed}</span>
                    </div>
                  ) : null}
                </div>
                <div className="flex shrink-0 gap-2">
                  <Button variant="secondary" onClick={() => setEditingSection(isEditing ? null : section.key)} disabled={isPending}>
                    <PencilLine className="mr-2 h-4 w-4" />
                    {copy.edit}
                  </Button>
                  {rows.length ? (
                    <Button variant="ghost" onClick={() => handleDeleteSection(section.key)} disabled={isPending}>
                      <Trash2 className="mr-2 h-4 w-4" />
                      {copy.deleteSection}
                    </Button>
                  ) : null}
                </div>
              </div>

              {isEditing ? (
                <div className="mt-6 space-y-4">
                  {section.fields.map((field) => (
                    <label key={field.key} className="block space-y-2">
                      <span className="text-sm font-medium">{getMyDataText(locale, field.label)}</span>
                      <input
                        type={field.type === "number" ? "number" : field.type ?? "text"}
                        lang={field.type === "date" ? getDateInputLocale(locale) : undefined}
                        value={draft[section.key]?.[field.key] ?? ""}
                        onChange={(event) =>
                          setDraft((current) => ({
                            ...current,
                            [section.key]: {
                              ...current[section.key],
                              [field.key]: event.target.value
                            }
                          }))
                        }
                        className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
                      />
                      {field.type === "date" ? <p className="text-xs leading-5 text-[var(--muted)]">{getDateInputHint(locale)}</p> : null}
                    </label>
                  ))}

                  <div className="flex flex-wrap gap-3 pt-2">
                    <Button onClick={() => handleSaveSection(section.key)} disabled={isPending}>
                      <Save className="mr-2 h-4 w-4" />
                      {isPending ? copy.saving : copy.save}
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        setDraft(buildInitialDraft(record));
                        setEditingSection(null);
                      }}
                      disabled={isPending}
                    >
                      {copy.cancel}
                    </Button>
                  </div>
                </div>
              ) : rows.length ? (
                <div className="mt-6 space-y-3">
                  {rows.map(({ field, value }) => (
                    <div key={field.key} className="flex items-start justify-between gap-4 rounded-[22px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4">
                      <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{getMyDataText(locale, field.label)}</p>
                        <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{formatMyDataValue(locale, value, field.type)}</p>
                      </div>
                      <Button variant="ghost" onClick={() => handleDeleteField(section.key, field.key)} disabled={isPending}>
                        {copy.deleteField}
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-6 rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-5 text-sm leading-6 text-[var(--muted)]">
                  <p>{getMyDataText(locale, section.empty)}</p>
                  <p className="mt-2">{copy.emptyInline}</p>
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
