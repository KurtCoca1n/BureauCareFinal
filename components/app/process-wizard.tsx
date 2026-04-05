"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Check, LoaderCircle, PlayCircle } from "lucide-react";

import { ProcessRealityPanel } from "@/components/app/process-reality-panel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExplanationRichText } from "@/components/ui/explanation-rich-text";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { saveProcessSessionAction } from "@/lib/actions/process-sessions";
import { saveUserPersonalDataSectionAction } from "@/lib/actions/user-personal-data";
import { getDateInputHint, getDateInputLocale } from "@/lib/date-input";
import {
  blockHasChangesAgainstSaved,
  blockHasKnownData,
  getKnownDataHintForBlock,
  getProcessDataBlocks,
  getProcessDataReuseCopy,
  getSavedAnswersForBlock,
  getSavePatchesForBlock,
  type ProcessDataBlockDefinition
} from "@/lib/process-personal-data";
import {
  getProcessWizardCopy,
  getWizardText,
  type ProcessWizardAnswers,
  type ProcessWizardDefinition,
  type ProcessWizardField,
  type ProcessWizardStep
} from "@/lib/process-wizard-v2";
import type { ProcessSessionAnswers, UserPersonalDataRecord, UserPersonalDataSectionKey } from "@/lib/types";
import { cn } from "@/lib/utils";

type ProcessWizardProps = {
  locale: string;
  processSlug: string;
  processTitle: string;
  backHref: string;
  definition: ProcessWizardDefinition;
  initialAnswers: ProcessWizardAnswers;
  initialStepIndex: number;
  initialStorageMode: "remote" | "local";
  initialPersonalData: UserPersonalDataRecord | null;
};

type DraftSnapshot = {
  answers: ProcessWizardAnswers;
  currentStepIndex: number;
  updatedAt: string;
};

type SaveState = "idle" | "saving" | "saved" | "local" | "error";

function getLocalStorageKey(processSlug: string) {
  return `bureaucare-process-draft:${processSlug}`;
}

function toFieldValue(value: ProcessWizardAnswers[string] | undefined) {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "boolean") return value ? "yes" : "no";
  return "";
}

function isFieldEmpty(value: ProcessWizardAnswers[string]) {
  return toFieldValue(value).trim().length === 0;
}

function getAnsweredValueLabel(field: ProcessWizardField, answers: ProcessWizardAnswers, locale: string) {
  const rawValue = toFieldValue(answers[field.id]);
  if (!rawValue) return "";

  if (field.options?.length) {
    const option = field.options.find((entry) => entry.value === rawValue);
    if (option) {
      return getWizardText(option.label, locale);
    }
  }

  return rawValue;
}

export function ProcessWizard({
  locale,
  processSlug,
  processTitle,
  backHref,
  definition,
  initialAnswers,
  initialStepIndex,
  initialStorageMode,
  initialPersonalData
}: ProcessWizardProps) {
  const copy = getProcessWizardCopy(locale);
  const reuseCopy = getProcessDataReuseCopy(locale);
  const router = useRouter();
  const steps = definition.steps;
  const [answers, setAnswers] = useState<ProcessWizardAnswers>(initialAnswers);
  const [personalData, setPersonalData] = useState<UserPersonalDataRecord | null>(initialPersonalData);
  const [currentStepIndex, setCurrentStepIndex] = useState(Math.min(initialStepIndex, Math.max(steps.length - 1, 0)));
  const [furthestStepIndex, setFurthestStepIndex] = useState(Math.min(initialStepIndex, Math.max(steps.length - 1, 0)));
  const [saveState, setSaveState] = useState<SaveState>(initialStorageMode === "remote" ? "saved" : "idle");
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [rememberChoices, setRememberChoices] = useState<Record<string, boolean>>({});
  const [dismissedReuseBlocks, setDismissedReuseBlocks] = useState<Record<string, true>>({});
  const [personalDataNotice, setPersonalDataNotice] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const readyRef = useRef(false);
  const lastSerializedRef = useRef("");
  const saveRequestRef = useRef(0);

  const currentStep = steps[currentStepIndex];
  const localStorageKey = getLocalStorageKey(processSlug);
  const status = currentStepIndex >= steps.length - 1 ? "ready" : "in_progress";
  const progressPercent = steps.length ? ((currentStepIndex + 1) / steps.length) * 100 : 0;
  const stepDataBlocks = useMemo(() => getProcessDataBlocks(processSlug, currentStep.id), [currentStep.id, processSlug]);
  const savedFieldHints = useMemo(() => {
    return stepDataBlocks.reduce<Record<string, string>>((accumulator, block) => {
      const savedAnswers = getSavedAnswersForBlock(block.id, personalData);
      for (const [fieldId, value] of Object.entries(savedAnswers)) {
        if (toFieldValue(value).trim()) {
          accumulator[fieldId] = getWizardText(block.title, locale);
        }
      }
      return accumulator;
    }, {});
  }, [locale, personalData, stepDataBlocks]);

  function buildSnapshot(nextAnswers = answers, nextStepIndex = currentStepIndex): DraftSnapshot {
    return {
      answers: nextAnswers,
      currentStepIndex: nextStepIndex,
      updatedAt: new Date().toISOString()
    };
  }

  async function persistSnapshot(snapshot: DraftSnapshot) {
    const serialized = JSON.stringify(snapshot);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(localStorageKey, serialized);
    }

    setSaveState("saving");
    const requestId = saveRequestRef.current + 1;
    saveRequestRef.current = requestId;

    const result = await saveProcessSessionAction({
      processSlug,
      procedureId: definition.procedureId,
      currentStepId: steps[snapshot.currentStepIndex]?.id ?? null,
      currentStepIndex: snapshot.currentStepIndex,
      answers: snapshot.answers as ProcessSessionAnswers,
      status: snapshot.currentStepIndex >= steps.length - 1 ? "ready" : "in_progress"
    });

    if (requestId !== saveRequestRef.current) {
      return;
    }

    if (!result.ok) {
      setSaveState("error");
      lastSerializedRef.current = "";
      return;
    }

    setSaveState(result.storageMode === "remote" ? "saved" : "local");
    lastSerializedRef.current = serialized;
  }

  useEffect(() => {
    if (typeof window === "undefined") return;

    const rawDraft = window.localStorage.getItem(localStorageKey);
    if (rawDraft && initialStorageMode !== "remote") {
      try {
        const parsed = JSON.parse(rawDraft) as DraftSnapshot;
        if (parsed?.answers && typeof parsed.currentStepIndex === "number") {
          setAnswers((current) => ({ ...current, ...parsed.answers }));
          setCurrentStepIndex(Math.min(parsed.currentStepIndex, Math.max(steps.length - 1, 0)));
          setFurthestStepIndex(Math.min(parsed.currentStepIndex, Math.max(steps.length - 1, 0)));
        }
      } catch {
        window.localStorage.removeItem(localStorageKey);
      }
    }

    readyRef.current = true;
  }, [initialStorageMode, localStorageKey, steps.length]);

  useEffect(() => {
    if (!readyRef.current) {
      return;
    }

    const snapshot = buildSnapshot();
    const serialized = JSON.stringify(snapshot);

    if (serialized === lastSerializedRef.current) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      void persistSnapshot(snapshot);
    }, 700);

    return () => window.clearTimeout(timeoutId);
  }, [answers, currentStepIndex]);

  const stepSummaries = useMemo(
    () =>
      steps
        .filter((step) => !step.summary)
        .map((step) => {
          const items =
            step.fields
              ?.map((field) => ({
                id: field.id,
                label: getWizardText(field.label, locale),
                value: getAnsweredValueLabel(field, answers, locale)
              }))
              .filter((entry) => entry.value) ?? [];

          return {
            id: step.id,
            title: getWizardText(step.title, locale),
            items
          };
        }),
    [answers, locale, steps]
  );

  function updateAnswer(fieldId: string, value: string) {
    setAnswers((current) => ({ ...current, [fieldId]: value }));
    setFieldErrors((current) => current.filter((entry) => entry !== fieldId));
  }

  function applyKnownData(block: ProcessDataBlockDefinition) {
    const savedAnswers = getSavedAnswersForBlock(block.id, personalData);
    const filteredSavedAnswers = Object.fromEntries(
      Object.entries(savedAnswers).filter(([, value]) => toFieldValue(value).trim().length > 0)
    ) as ProcessWizardAnswers;

    setAnswers((current) => ({
      ...current,
      ...filteredSavedAnswers
    }));
    setDismissedReuseBlocks((current) => ({ ...current, [block.id]: true }));
  }

  function dismissKnownData(blockId: string) {
    setDismissedReuseBlocks((current) => ({ ...current, [blockId]: true }));
  }

  function toggleRememberChoice(blockId: string, checked: boolean) {
    setRememberChoices((current) => ({ ...current, [blockId]: checked }));
  }

  function validateStep(step: ProcessWizardStep) {
    const missingFields =
      step.fields
        ?.filter((field) => field.required && isFieldEmpty(answers[field.id]))
        .map((field) => field.id) ?? [];

    setFieldErrors(missingFields);
    return missingFields.length === 0;
  }

  async function goToStep(nextStepIndex: number) {
    const boundedIndex = Math.max(0, Math.min(nextStepIndex, steps.length - 1));
    setCurrentStepIndex(boundedIndex);
    setFurthestStepIndex((current) => Math.max(current, boundedIndex));
    await persistSnapshot(buildSnapshot(answers, boundedIndex));
  }

  async function handleNext() {
    if (!currentStep.summary && !validateStep(currentStep)) {
      return;
    }

    const personalDataSaved = await persistSelectedPersonalData();
    if (!personalDataSaved) {
      return;
    }

    if (currentStepIndex >= steps.length - 1) {
      await persistSnapshot(buildSnapshot());
      router.push(`/app/processes/${processSlug}/result`);
      return;
    }

    await goToStep(currentStepIndex + 1);
  }

  async function handlePrevious() {
    if (currentStepIndex === 0) return;
    await goToStep(currentStepIndex - 1);
  }

  function renderField(field: ProcessWizardField) {
    const label = getWizardText(field.label, locale);
    const description = field.description ? getWizardText(field.description, locale) : "";
    const placeholder = field.placeholder ? getWizardText(field.placeholder, locale) : "";
    const value = toFieldValue(answers[field.id]);
    const hasError = fieldErrors.includes(field.id);
    const knownFieldLabel = savedFieldHints[field.id];

    if (field.type === "textarea") {
      return (
        <label key={field.id} className="block space-y-2">
          <span className="text-sm font-medium">
            <ExplanationRichText text={label} locale={locale} />
          </span>
          {description ? (
            <p className="text-sm leading-6 text-[var(--muted)]">
              <ExplanationRichText text={description} locale={locale} />
            </p>
          ) : null}
          {knownFieldLabel ? <p className="text-xs font-medium text-[var(--accent-strong)]">{reuseCopy.savedFromEarlierLabel}: {knownFieldLabel}</p> : null}
          <textarea
            value={value}
            onChange={(event) => updateAnswer(field.id, event.target.value)}
            placeholder={placeholder}
            rows={4}
            className={cn(
              "min-h-28 w-full rounded-[26px] border bg-white px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]",
              hasError ? "border-[var(--danger)]" : "border-[var(--line)]"
            )}
          />
        </label>
      );
    }

    if (field.type === "select") {
      return (
        <label key={field.id} className="block space-y-2">
          <span className="text-sm font-medium">
            <ExplanationRichText text={label} locale={locale} />
          </span>
          {description ? (
            <p className="text-sm leading-6 text-[var(--muted)]">
              <ExplanationRichText text={description} locale={locale} />
            </p>
          ) : null}
          {knownFieldLabel ? <p className="text-xs font-medium text-[var(--accent-strong)]">{reuseCopy.savedFromEarlierLabel}: {knownFieldLabel}</p> : null}
          <select
            value={value}
            onChange={(event) => updateAnswer(field.id, event.target.value)}
            className={cn(
              "min-h-14 w-full rounded-2xl border bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]",
              hasError ? "border-[var(--danger)]" : "border-[var(--line)]"
            )}
          >
            <option value="">{placeholder || label}</option>
            {field.options?.map((option) => (
              <option key={option.value} value={option.value}>
                {getWizardText(option.label, locale)}
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
            <p className="text-sm font-medium">
              <ExplanationRichText text={label} locale={locale} />
            </p>
            {description ? (
              <p className="text-sm leading-6 text-[var(--muted)]">
                <ExplanationRichText text={description} locale={locale} />
              </p>
            ) : null}
            {knownFieldLabel ? <p className="text-xs font-medium text-[var(--accent-strong)]">{reuseCopy.savedFromEarlierLabel}: {knownFieldLabel}</p> : null}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {field.options?.map((option) => {
              const selected = value === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => updateAnswer(field.id, option.value)}
                  className={cn(
                    "min-h-14 rounded-[24px] border px-4 py-3 text-left text-sm font-medium transition",
                    selected
                      ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                      : hasError
                        ? "border-[var(--danger)] bg-white"
                        : "border-[var(--line)] bg-white hover:border-[var(--line-strong)]"
                  )}
                >
                  {getWizardText(option.label, locale)}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <label key={field.id} className="block space-y-2">
        <span className="text-sm font-medium">
          <ExplanationRichText text={label} locale={locale} />
        </span>
        {description ? (
          <p className="text-sm leading-6 text-[var(--muted)]">
            <ExplanationRichText text={description} locale={locale} />
          </p>
        ) : null}
        {knownFieldLabel ? <p className="text-xs font-medium text-[var(--accent-strong)]">{reuseCopy.savedFromEarlierLabel}: {knownFieldLabel}</p> : null}
        <Input
          type={field.type === "currency" || field.type === "number" ? "number" : field.type}
          lang={field.type === "date" ? getDateInputLocale(locale) : undefined}
          value={value}
          min={field.min}
          max={field.max}
          step={field.step ?? (field.type === "currency" ? 0.01 : undefined)}
          inputMode={field.type === "currency" || field.type === "number" ? "decimal" : undefined}
          placeholder={placeholder}
          onChange={(event) => updateAnswer(field.id, event.target.value)}
          className={hasError ? "border-[var(--danger)]" : ""}
        />
        {field.type === "date" ? <p className="text-xs leading-5 text-[var(--muted)]">{getDateInputHint(locale)}</p> : null}
      </label>
    );
  }

  const saveIndicator =
    saveState === "saving" ? copy.savingLabel :
    saveState === "saved" ? copy.savedLabel :
    saveState === "local" ? copy.localSaveLabel :
    saveState === "error" ? copy.saveErrorLabel :
    copy.savedLabel;

  async function persistSelectedPersonalData() {
    const selectedBlocks = stepDataBlocks.filter((block) => rememberChoices[block.id]);
    if (!selectedBlocks.length) {
      return true;
    }

    setPersonalDataNotice("saving");

    let latestRecord = personalData;

    for (const block of selectedBlocks) {
      const patches = getSavePatchesForBlock(block.id, answers);
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
          setPersonalDataNotice("error");
          return false;
        }

        latestRecord = result.record ?? latestRecord;
      }
    }

    setPersonalData(latestRecord);
    setPersonalDataNotice("saved");

    return true;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-8">
      <section className="space-y-4 pt-2">
        <Link
          href={backHref as Route}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.startBackLabel}
        </Link>

        <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,251,251,0.92))] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-3">
            <StatusBadge tone="accent">{copy.progressLabel} {currentStepIndex + 1}</StatusBadge>
            <StatusBadge tone={saveState === "error" ? "neutral" : "success"}>{saveIndicator}</StatusBadge>
          </div>
          <div className="mt-5 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(260px,0.8fr)]">
            <div className="space-y-3">
              <h1 className="page-title page-title-accent text-3xl sm:text-5xl">{processTitle}</h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--foreground)]/88">{getWizardText(definition.intro, locale)}</p>
            </div>
            <div className="rounded-[28px] border border-[var(--line)] bg-white/82 p-5">
              <div className="flex items-center gap-3 text-[var(--accent-strong)]">
                <PlayCircle className="h-5 w-5" />
                <p className="text-sm font-semibold">
                  {copy.progressLabel} {currentStepIndex + 1} / {steps.length}
                </p>
              </div>
              <div className="mt-4 h-2.5 rounded-full bg-[var(--surface)]">
                <div
                  className="h-full rounded-full bg-[image:var(--accent-gradient)] transition-[width] duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{getWizardText(definition.nextStepHint, locale)}</p>
            </div>
          </div>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[260px_minmax(0,1fr)]">
        <aside className="space-y-4 xl:sticky xl:top-6">
          <Card className="border-[var(--line)] p-4">
            <div className="space-y-2">
              {steps.map((step, index) => {
                const isActive = index === currentStepIndex;
                const isOpenable = index <= furthestStepIndex;
                const isDone = index < currentStepIndex;

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      if (!isOpenable) return;
                      setCurrentStepIndex(index);
                      setFieldErrors([]);
                    }}
                    disabled={!isOpenable}
                    className={cn(
                      "w-full rounded-[22px] border px-4 py-3 text-left transition",
                      isActive
                        ? "border-[var(--accent)] bg-[var(--accent-soft)]"
                        : "border-[var(--line)] bg-white",
                      !isOpenable && "cursor-not-allowed opacity-55"
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">
                          {copy.progressLabel} {index + 1}
                        </p>
                        <p className="mt-1 text-sm font-semibold">{getWizardText(step.title, locale)}</p>
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
          <Card className="border-[var(--line-strong)] p-6 sm:p-8">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--accent-strong)]">
                {copy.progressLabel} {currentStepIndex + 1} / {steps.length}
              </p>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">{getWizardText(currentStep.title, locale)}</h2>
              <p className="max-w-3xl text-sm leading-6 text-[var(--muted)]">
                <ExplanationRichText text={getWizardText(currentStep.description, locale)} locale={locale} />
              </p>
            </div>

            {fieldErrors.length ? <p className="mt-5 text-sm text-[var(--danger)]">{copy.requiredError}</p> : null}

            {currentStep.summary ? (
              <div className="mt-6 space-y-4">
                <div className="rounded-[26px] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
                  <h3 className="text-lg font-semibold">{copy.summaryTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.summaryText}</p>
                </div>

                <div className="grid gap-4 lg:grid-cols-2">
                  {stepSummaries.map((step) => (
                    <Card key={step.id} className="border-[var(--line)] bg-white/88 p-5">
                      <h4 className="text-base font-semibold">{step.title}</h4>
                      {step.items.length ? (
                        <div className="mt-4 space-y-3">
                          {step.items.map((item) => (
                            <div key={item.id} className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{item.label}</p>
                              <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">
                                <ExplanationRichText text={item.value} locale={locale} />
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{copy.summaryEmpty}</p>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {stepDataBlocks.map((block) => {
                  const knownDataAvailable = blockHasKnownData(block.id, personalData);
                  const hint = getKnownDataHintForBlock(block.id, personalData);
                  const needsUpdate = blockHasChangesAgainstSaved(block.id, answers, personalData);
                  const dismissed = dismissedReuseBlocks[block.id];

                  return (
                    <div key={block.id} className="space-y-3">
                      {knownDataAvailable && !dismissed ? (
                        <Card className="border-[var(--accent)]/28 bg-[linear-gradient(180deg,rgba(237,246,253,0.94),rgba(255,255,255,0.96))] p-5">
                          <div className="space-y-2">
                            <p className="text-sm font-semibold text-[var(--accent-strong)]">{reuseCopy.knownDataTitle}</p>
                            <h3 className="text-base font-semibold">{getWizardText(block.title, locale)}</h3>
                            <p className="text-sm leading-6 text-[var(--muted)]">{reuseCopy.knownDataDescription}</p>
                            <p className="text-xs font-medium text-[var(--accent-strong)]">
                              {hint === "outdated" ? reuseCopy.outdatedHintLabel : reuseCopy.savedFromEarlierLabel}
                            </p>
                          </div>
                          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                            <Button type="button" onClick={() => applyKnownData(block)}>
                              {reuseCopy.useDataLabel}
                            </Button>
                            <Button type="button" variant="secondary" onClick={() => dismissKnownData(block.id)}>
                              {reuseCopy.reviewMyselfLabel}
                            </Button>
                            <Button type="button" variant="ghost" onClick={() => dismissKnownData(block.id)}>
                              {reuseCopy.skipForNowLabel}
                            </Button>
                          </div>
                        </Card>
                      ) : null}

                      <Card className="border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(246,250,252,0.92))] p-5">
                        <div className="flex items-start gap-3">
                          <input
                            id={`remember-${block.id}`}
                            type="checkbox"
                            checked={Boolean(rememberChoices[block.id])}
                            onChange={(event) => toggleRememberChoice(block.id, event.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-[var(--line-strong)] text-[var(--accent)] focus:ring-[var(--accent)]"
                          />
                          <label htmlFor={`remember-${block.id}`} className="space-y-1">
                            <p className="text-sm font-semibold">{reuseCopy.saveDataTitle}</p>
                            <p className="text-sm leading-6 text-[var(--muted)]">{reuseCopy.saveDataDescription}</p>
                            <p className="text-sm font-medium text-[var(--foreground)]">
                              {needsUpdate ? reuseCopy.saveUpdateToggleLabel : getWizardText(block.saveLabel, locale)}
                            </p>
                            {needsUpdate ? <p className="text-xs font-medium text-[var(--accent-strong)]">{reuseCopy.updateHintLabel}</p> : null}
                            {personalDataNotice === "saved" && rememberChoices[block.id] ? (
                              <p className="text-xs font-medium text-[var(--accent-strong)]">{copy.savedLabel}</p>
                            ) : null}
                            {personalDataNotice === "error" && rememberChoices[block.id] ? (
                              <p className="text-xs font-medium text-[var(--danger)]">{copy.saveErrorLabel}</p>
                            ) : null}
                          </label>
                        </div>
                      </Card>
                    </div>
                  );
                })}

                <div className="grid gap-5 md:grid-cols-2">
                  {currentStep.fields?.map((field) => renderField(field))}
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button variant="secondary" onClick={() => void handlePrevious()} disabled={currentStepIndex === 0 || saveState === "saving"}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                {copy.previousLabel}
              </Button>

              <Button onClick={() => void handleNext()} disabled={saveState === "saving"}>
                {saveState === "saving" ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                {currentStepIndex >= steps.length - 1 ? copy.finishLabel : copy.nextLabel}
              </Button>
            </div>
          </Card>

          <ProcessRealityPanel procedureId={definition.procedureId} locale={locale} compact />
        </div>
      </section>
    </div>
  );
}
