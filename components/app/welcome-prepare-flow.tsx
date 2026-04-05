"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, LoaderCircle, PlayCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveUserPersonalDataSectionAction } from "@/lib/actions/user-personal-data";
import { getDateInputHint, getDateInputLocale } from "@/lib/date-input";
import { updateWelcomeStepStatusAction } from "@/lib/actions/welcome";
import { saveWelcomePreparationAction } from "@/lib/actions/welcome-preparation";
import type { UserPersonalDataRecord, UserPersonalDataSectionKey, WelcomeProfileRecord, WelcomeStepRecord } from "@/lib/types";
import {
  getKnownWelcomePrepareAnswers,
  getLocalizedText,
  getWelcomePrepareCopy,
  getWelcomePrepareDefinition,
  getWelcomePrepareSavePatches,
  hasWelcomePrepareChanges
} from "@/lib/welcome-prepare";
import type { WelcomeStepKey } from "@/lib/welcome";

type WelcomePrepareFlowProps = {
  locale: string;
  step: WelcomeStepRecord;
  welcomeProfile: WelcomeProfileRecord | null;
  personalData: UserPersonalDataRecord | null;
  fullName: string | null | undefined;
  initialAnswers: Record<string, string | number | boolean>;
  initialSectionId: string | null;
  initialStorageMode: "remote" | "local";
};

type SaveState = "idle" | "saving" | "saved" | "local" | "error";

function getLocalStorageKey(stepKey: string) {
  return `bureaucare-welcome-prepare:${stepKey}`;
}

function toFieldValue(value: string | number | boolean | undefined) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "yes" : "no";
  return "";
}

export function WelcomePrepareFlow({
  locale,
  step,
  welcomeProfile,
  personalData: initialPersonalData,
  fullName,
  initialAnswers,
  initialSectionId,
  initialStorageMode
}: WelcomePrepareFlowProps) {
  const definition = getWelcomePrepareDefinition(step.step_key as WelcomeStepKey);
  const copy = getWelcomePrepareCopy(locale);
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string | number | boolean>>(initialAnswers);
  const [personalData, setPersonalData] = useState<UserPersonalDataRecord | null>(initialPersonalData);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(
    Math.max(0, definition ? definition.sections.findIndex((section) => section.id === initialSectionId) : 0)
  );
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [saveForLater, setSaveForLater] = useState(false);
  const [dismissKnownData, setDismissKnownData] = useState(false);
  const [saveState, setSaveState] = useState<SaveState>(initialStorageMode === "remote" ? "saved" : "idle");
  const [isPending, startTransition] = useTransition();
  const lastSerializedRef = useRef("");
  const readyRef = useRef(false);

  const currentSection = definition?.sections[currentSectionIndex] ?? definition?.sections[0];
  const localStorageKey = getLocalStorageKey(step.step_key);

  const knownAnswers = useMemo(() => {
    if (!definition) return {};
    return getKnownWelcomePrepareAnswers(definition, personalData, welcomeProfile, fullName);
  }, [definition, fullName, personalData, welcomeProfile]);

  const relevantKnownAnswerCount = Object.keys(knownAnswers).length;
  const saveHasChanges = definition ? hasWelcomePrepareChanges(definition.stepKey, answers, personalData) : false;
  const saveLabel = saveHasChanges ? copy.updateSavedToggle : copy.saveForLaterToggle;

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = window.localStorage.getItem(localStorageKey);
    if (raw && initialStorageMode !== "remote") {
      try {
        const parsed = JSON.parse(raw) as { answers: Record<string, string | number | boolean>; currentSectionId: string | null };
        if (parsed?.answers) {
          setAnswers((current) => ({ ...current, ...parsed.answers }));
        }
        if (definition && parsed?.currentSectionId) {
          const nextIndex = definition.sections.findIndex((section) => section.id === parsed.currentSectionId);
          if (nextIndex >= 0) {
            setCurrentSectionIndex(nextIndex);
          }
        }
      } catch {
        window.localStorage.removeItem(localStorageKey);
      }
    }
    readyRef.current = true;
  }, [definition, initialStorageMode, localStorageKey]);

  useEffect(() => {
    if (!readyRef.current || !definition) return;
    const payload = JSON.stringify({
      answers,
      currentSectionId: definition.sections[currentSectionIndex]?.id ?? null
    });

    if (payload === lastSerializedRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      if (typeof window !== "undefined") {
        window.localStorage.setItem(localStorageKey, payload);
      }

      setSaveState("saving");
      const result = await saveWelcomePreparationAction({
        stepKey: definition.stepKey,
        currentSectionId: definition.sections[currentSectionIndex]?.id ?? null,
        answers
      });

      if (!result.ok) {
        setSaveState("error");
        return;
      }

      setSaveState(result.storageMode === "remote" ? "saved" : "local");
      lastSerializedRef.current = payload;
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [answers, currentSectionIndex, definition, localStorageKey]);

  if (!definition || !currentSection) {
    return (
      <Card className="p-6 text-sm text-[var(--muted)]">
        <p>{copy.preparedText}</p>
      </Card>
    );
  }

  const activeDefinition = definition;
  const activeSection = currentSection;

  const saveIndicator =
    saveState === "saving"
      ? copy.saveStateSaving
      : saveState === "saved"
        ? copy.saveStateSaved
        : saveState === "local"
          ? copy.saveStateLocal
          : saveState === "error"
            ? copy.saveStateError
            : copy.saveStateSaved;

  function updateAnswer(fieldId: string, value: string) {
    setAnswers((current) => ({ ...current, [fieldId]: value }));
    setFieldErrors((current) => current.filter((entry) => entry !== fieldId));
  }

  function validateCurrentSection() {
    const missing = activeSection.fields.filter((field) => field.required && !toFieldValue(answers[field.id]).trim()).map((field) => field.id);
    setFieldErrors(missing);
    return missing.length === 0;
  }

  function applyKnownData() {
    setAnswers((current) => ({ ...current, ...knownAnswers }));
    setDismissKnownData(true);
  }

  async function savePersonalDataIfNeeded() {
    if (!saveForLater) {
      return true;
    }

    const patches = getWelcomePrepareSavePatches(activeDefinition.stepKey, answers);

    for (const [section, patch] of Object.entries(patches) as Array<[UserPersonalDataSectionKey, Record<string, unknown>]>) {
      if (!Object.keys(patch).length) {
        continue;
      }

      const result = await saveUserPersonalDataSectionAction({
        section,
        patch,
        source: "application_import",
        confirmedByUser: true
      });

      if (!result.ok) {
        return false;
      }

      if (result.record) {
        setPersonalData(result.record);
      }
    }

    return true;
  }

  function goToSection(nextIndex: number) {
    setCurrentSectionIndex(Math.max(0, Math.min(nextIndex, activeDefinition.sections.length - 1)));
    setFieldErrors([]);
  }

  async function handleNext() {
    if (!validateCurrentSection()) {
      return;
    }

    if (currentSectionIndex >= activeDefinition.sections.length - 1) {
      const personalDataSaved = await savePersonalDataIfNeeded();
      if (!personalDataSaved) {
        setSaveState("error");
        return;
      }

      startTransition(async () => {
        if (step.status === "open") {
          await updateWelcomeStepStatusAction(step.id, "in_progress");
        }
        router.push(`/app/welcome/${step.step_key}`);
        router.refresh();
      });
      return;
    }

    goToSection(currentSectionIndex + 1);
  }

  function renderField(field: (typeof activeSection.fields)[number]) {
    const label = getLocalizedText(field.label, locale);
    const description = field.description ? getLocalizedText(field.description, locale) : "";
    const placeholder = field.placeholder ? getLocalizedText(field.placeholder, locale) : "";
    const value = toFieldValue(answers[field.id]);
    const hasError = fieldErrors.includes(field.id);

    if (field.type === "select") {
      return (
        <label key={field.id} className="block space-y-2">
          <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
          {description ? <p className="text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
          <select
            value={value}
            onChange={(event) => updateAnswer(field.id, event.target.value)}
            className={[
              "min-h-14 w-full rounded-2xl border bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]",
              hasError ? "border-[var(--danger)]" : "border-[var(--line)]"
            ].join(" ")}
          >
            <option value="">{placeholder || label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {getLocalizedText(option.label, locale)}
              </option>
            ))}
          </select>
        </label>
      );
    }

    if (field.type === "radio") {
      return (
        <div key={field.id} className="space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-medium text-[var(--foreground)]">{label}</p>
            {description ? <p className="text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {field.options?.map((option) => {
              const selected = value === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateAnswer(field.id, option.value)}
                  className={[
                    "min-h-14 rounded-[24px] border px-4 py-3 text-left text-sm font-medium transition",
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                      : hasError
                        ? "border-[var(--danger)] bg-white"
                        : "border-[var(--line)] bg-white hover:border-[var(--line-strong)]"
                  ].join(" ")}
                >
                  {getLocalizedText(option.label, locale)}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <label key={field.id} className="block space-y-2">
        <span className="text-sm font-medium text-[var(--foreground)]">{label}</span>
        {description ? <p className="text-sm leading-6 text-[var(--muted)]">{description}</p> : null}
        <Input
          type={field.type === "number" ? "number" : field.type}
          lang={field.type === "date" ? getDateInputLocale(locale) : undefined}
          value={value}
          placeholder={placeholder}
          onChange={(event) => updateAnswer(field.id, event.target.value)}
          className={hasError ? "border-[var(--danger)]" : ""}
        />
        {field.type === "date" ? <p className="text-xs leading-5 text-[var(--muted)]">{getDateInputHint(locale)}</p> : null}
      </label>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <section className="space-y-4 pt-2">
        <Link
          href={`/app/welcome/${step.step_key}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.backToDetail}
        </Link>

        <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,251,251,0.92))] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-[rgba(95,163,163,0.16)] px-3 py-1 text-xs font-semibold text-[var(--accent-strong)] shadow-[var(--shadow-soft)]">
              {copy.progress.replace("{current}", String(currentSectionIndex + 1)).replace("{total}", String(activeDefinition.sections.length))}
            </span>
            <span className="inline-flex min-h-7 min-w-7 items-center justify-center rounded-full bg-[var(--success-soft)] px-3 py-1 text-xs font-semibold text-[var(--petrol)] shadow-[var(--shadow-soft)]">
              {saveIndicator}
            </span>
          </div>
          <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
            <div className="space-y-3">
              <h1 className="page-title page-title-accent text-3xl sm:text-5xl">{getLocalizedText(activeDefinition.title, locale)}</h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--foreground)]/88">{getLocalizedText(activeDefinition.intro, locale)}</p>
            </div>
            <div className="rounded-[28px] border border-[var(--line)] bg-white/82 p-5">
              <div className="flex items-center gap-3 text-[var(--accent-strong)]">
                <PlayCircle className="h-5 w-5" />
                <p className="text-sm font-semibold">{copy.pageTitle}</p>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-[var(--surface)]">
                <div
                  className="h-full rounded-full bg-[image:var(--accent-gradient)] transition-[width] duration-300"
                  style={{ width: `${((currentSectionIndex + 1) / activeDefinition.sections.length) * 100}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{copy.pageText}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-6">
          <Card className="border-[var(--line)] p-4">
            <div className="space-y-2">
              {activeDefinition.sections.map((section, index) => {
                const isActive = index === currentSectionIndex;
                const isDone = index < currentSectionIndex;
                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => goToSection(index)}
                    className={[
                      "w-full rounded-[22px] border px-4 py-3 text-left transition",
                      isActive ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-white"
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                          {copy.progress.replace("{current}", String(index + 1)).replace("{total}", String(activeDefinition.sections.length))}
                        </p>
                        <p className="mt-1 text-sm font-semibold">{getLocalizedText(section.title, locale)}</p>
                      </div>
                      {isDone ? (
                        <span className="rounded-full bg-[var(--accent-soft)] p-1 text-[var(--accent-strong)]">
                          <Check className="h-4 w-4" />
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>
        </aside>

        <div className="space-y-6">
          {relevantKnownAnswerCount && !dismissKnownData ? (
            <Card className="border-[var(--accent)]/28 bg-[linear-gradient(180deg,rgba(237,246,253,0.94),rgba(255,255,255,0.96))] p-5">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-[var(--accent-strong)]">{copy.knownDataTitle}</p>
                <p className="text-sm leading-6 text-[var(--muted)]">{copy.knownDataText}</p>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Button type="button" onClick={applyKnownData}>
                  {copy.useKnownData}
                </Button>
                <Button type="button" variant="secondary" onClick={() => setDismissKnownData(true)}>
                  {copy.reviewFirst}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setDismissKnownData(true)}>
                  {copy.skipKnownData}
                </Button>
              </div>
            </Card>
          ) : null}

          <Card className="border-[var(--line-strong)] p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--accent-strong)]">
                {copy.progress.replace("{current}", String(currentSectionIndex + 1)).replace("{total}", String(activeDefinition.sections.length))}
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{getLocalizedText(activeSection.title, locale)}</h2>
              <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">{getLocalizedText(activeSection.description, locale)}</p>
            </div>

            {fieldErrors.length ? <p className="mt-5 text-sm text-[var(--danger)]">{copy.missingError}</p> : null}

            <div className="mt-6 grid gap-5 md:grid-cols-2">{activeSection.fields.map((field) => renderField(field))}</div>

            <Card className="mt-6 border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,250,252,0.92))] p-5">
              <div className="flex items-start gap-3">
                <input
                  id="save-for-later"
                  type="checkbox"
                  checked={saveForLater}
                  onChange={(event) => setSaveForLater(event.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-[var(--line-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
                />
                <label htmlFor="save-for-later" className="space-y-1">
                  <p className="text-sm font-semibold">{copy.saveForLaterTitle}</p>
                  <p className="text-sm leading-6 text-[var(--muted)]">{copy.saveForLaterText}</p>
                  <p className="text-sm font-medium text-[var(--foreground)]">{saveLabel}</p>
                  {saveForLater && saveHasChanges ? <p className="text-xs font-medium text-[var(--accent-strong)]">{copy.savedForFuture}</p> : null}
                </label>
              </div>
            </Card>

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="secondary" onClick={() => goToSection(currentSectionIndex - 1)} disabled={currentSectionIndex === 0 || isPending}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {copy.previous}
              </Button>

              <Button onClick={() => void handleNext()} disabled={isPending}>
                {isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                {currentSectionIndex >= activeDefinition.sections.length - 1 ? copy.finish : copy.next}
              </Button>
            </div>
          </Card>

          <Card className="border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,250,252,0.92))] p-5 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[var(--accent-strong)]">
                  <CheckCircle2 className="h-4 w-4" />
                  <p className="text-sm font-semibold">{copy.preparedTitle}</p>
                </div>
                <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">{copy.preparedText}</p>
              </div>
              {activeDefinition.relatedProcessSlug ? (
                <Link href={`/app/processes/${activeDefinition.relatedProcessSlug}`} className="inline-flex">
                  <Button variant="secondary">{copy.openProcess}</Button>
                </Link>
              ) : null}
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
