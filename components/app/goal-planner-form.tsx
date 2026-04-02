"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { CalendarRange, CircleHelp, Coins, LoaderCircle, Sparkles, Target } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { createGoalAction } from "@/lib/actions/goals";
import { initialGoalPlannerState, type GoalPlannerState } from "@/lib/goal-planner-state";
import type { GoalClarificationQuestion } from "@/lib/goals-ui";

function NumericField({
  name,
  label,
  defaultValue,
  inputMode = "numeric",
  placeholder,
  hideLabel = false
}: {
  name: string;
  label: string;
  defaultValue?: string;
  inputMode?: "numeric" | "decimal";
  placeholder?: string;
  hideLabel?: boolean;
}) {
  return (
    <label className="block space-y-2">
      {!hideLabel ? <span className="text-sm font-medium">{label}</span> : null}
      <input
        name={name}
        type="text"
        inputMode={inputMode}
        pattern={inputMode === "decimal" ? "[0-9.,]*" : "[0-9]*"}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        className="min-h-12 w-full rounded-2xl border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
      />
    </label>
  );
}

function hasTargetHint(text: string) {
  const normalized = text.toLowerCase();
  return /\b(20\d{2}|19\d{2})\b/.test(normalized) || /\bbis\s+\d{1,3}\b/.test(normalized) || /\bmit\s+\d{1,3}\b/.test(normalized);
}

export function GoalPlannerForm({
  labels
}: {
  labels: {
    title: string;
    goalInput: string;
    currentAge: string;
    targetAge: string;
    targetYear: string;
    targetModeAge: string;
    targetModeYear: string;
    financialAmount: string;
    monthlyIncome: string;
    financialHint: string;
    analyze: string;
    analyzing: string;
    continue: string;
    restart: string;
    backToPlanner: string;
    goalPlaceholder: string;
    clarifyTitle: string;
    clarifyText: string;
    financePromptFallback: string;
  };
}) {
  const [state, formAction, pending] = useActionState<GoalPlannerState, FormData>(createGoalAction, initialGoalPlannerState);
  const [goalText, setGoalText] = useState(state.goalText);
  const [targetMode, setTargetMode] = useState<"age" | "year">(state.targetMode);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const hideTargetField = hasTargetHint(goalText);

  useEffect(() => {
    if (state.answers && Object.keys(state.answers).length) {
      setAnswers(state.answers);
    }
  }, [state.answers]);

  useEffect(() => {
    setGoalText(state.goalText);
    setTargetMode(state.targetMode);
  }, [state.goalText, state.targetMode]);

  useEffect(() => {
    if (!state.redirectTo) {
      return;
    }

    window.location.assign(state.redirectTo);
  }, [state.redirectTo]);

  const questionsJson = useMemo(() => JSON.stringify(state.questions), [state.questions]);
  const answersJson = useMemo(() => JSON.stringify(answers), [answers]);
  const submitLabel = state.requiresClarification || state.awaitingFinance ? labels.continue : labels.analyze;

  return (
    <Card className="space-y-5 p-6">
      <div className="space-y-1">
        <h2 className="text-2xl font-semibold tracking-[-0.03em]">{labels.title}</h2>
      </div>

      <form action={formAction} className="space-y-5">
        <input type="hidden" name="questionsJson" value={questionsJson} />
        <input type="hidden" name="answersJson" value={answersJson} />
        <input type="hidden" name="financeRelevant" value={state.financeRelevant ? "1" : "0"} />
        <input type="hidden" name="forceAnalyze" value={state.requiresClarification || state.awaitingFinance ? "1" : "0"} />
        <input type="hidden" name="targetMode" value={targetMode} />

        <label className="block space-y-2">
          <span className="flex items-center gap-2 text-sm font-medium">
            <Target className="h-4 w-4 text-[var(--muted)]" />
            {labels.goalInput}
          </span>
          <textarea
            name="goalText"
            rows={5}
            value={goalText}
            onChange={(event) => setGoalText(event.target.value)}
            placeholder={labels.goalPlaceholder}
            className="min-h-32 w-full rounded-3xl border border-[var(--line)] bg-white px-4 py-3 text-sm leading-6 text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            required
          />
        </label>

        <div className="grid items-start gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <span className="block text-sm font-medium">{labels.currentAge}</span>
            <div className="rounded-3xl border border-[var(--line)] bg-white px-4 py-4 shadow-[var(--shadow-soft)]">
              <NumericField name="currentAge" label={labels.currentAge} defaultValue={state.currentAge} hideLabel />
            </div>
          </div>
          {hideTargetField ? (
            <div className="space-y-2">
              <span className="block text-sm font-medium">{labels.targetModeAge} / {labels.targetModeYear}</span>
              <div className="rounded-3xl border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-4 text-sm leading-6 text-[var(--muted)]">
                <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                  <CalendarRange className="h-4 w-4 text-[var(--muted)]" />
                  Zeitraum schon erkannt
                </div>
                <p className="mt-2">Im Zieltext ist schon ein Zeitraum erkennbar. Deshalb musst du hier nichts mehr ergänzen.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <span className="block text-sm font-medium">{labels.targetModeAge} / {labels.targetModeYear}</span>
              <div className="space-y-3 rounded-3xl border border-[var(--line)] bg-white px-4 py-4 shadow-[var(--shadow-soft)]">
                <div className="inline-flex w-full rounded-2xl bg-[var(--surface)] p-1">
                  <button
                    type="button"
                    onClick={() => setTargetMode("age")}
                    className={`min-h-11 flex-1 rounded-2xl px-4 text-sm font-medium transition ${
                      targetMode === "age" ? "bg-[var(--accent-soft)] text-[var(--foreground)] shadow-[var(--shadow-soft)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {labels.targetModeAge}
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetMode("year")}
                    className={`min-h-11 flex-1 rounded-2xl px-4 text-sm font-medium transition ${
                      targetMode === "year" ? "bg-[var(--accent-soft)] text-[var(--foreground)] shadow-[var(--shadow-soft)]" : "text-[var(--muted)]"
                    }`}
                  >
                    {labels.targetModeYear}
                  </button>
                </div>

                {targetMode === "age" ? (
                  <NumericField name="targetAge" label={labels.targetAge} defaultValue={state.targetAge} />
                ) : (
                  <NumericField name="targetYear" label={labels.targetYear} defaultValue={state.targetYear} />
                )}
              </div>
            </div>
          )}
        </div>

        {state.requiresClarification ? (
          <div className="space-y-4 rounded-[28px] border border-[var(--line)] bg-[var(--surface-strong)] p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--accent)]">
                <CircleHelp className="h-4 w-4" />
                {labels.clarifyTitle}
              </div>
              <p className="text-sm leading-6 text-[var(--muted)]">{labels.clarifyText}</p>
            </div>
            <div className="space-y-4">
              {state.questions.map((question: GoalClarificationQuestion) => (
                <div key={question.id} className="space-y-3">
                  <p className="text-sm font-medium">{question.question}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {question.options.map((option) => {
                      const selected = answers[question.id] === option;

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => setAnswers((current) => ({ ...current, [question.id]: option }))}
                          className={`min-h-14 rounded-2xl border px-4 py-3 text-left text-sm transition ${
                            selected
                              ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--foreground)]"
                              : "border-[var(--line)] bg-white text-[var(--foreground)] hover:border-[var(--line-strong)]"
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {state.awaitingFinance || state.financeRelevant ? (
          <div className="space-y-4 rounded-[28px] border border-[rgba(123,191,159,0.24)] bg-[rgba(123,191,159,0.08)] p-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-sm font-medium text-[var(--petrol)]">
                <Coins className="h-4 w-4" />
                {state.financialPrompt || labels.financePromptFallback}
              </div>
              <p className="text-sm leading-6 text-[var(--muted)]">{labels.financialHint}</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <NumericField
                name="financialAmount"
                label={labels.financialAmount}
                defaultValue={state.financialAmount}
                inputMode="decimal"
                placeholder="0"
              />
              <NumericField
                name="monthlyIncome"
                label={labels.monthlyIncome}
                defaultValue={state.monthlyIncome}
                inputMode="decimal"
                placeholder="0"
              />
            </div>
          </div>
        ) : null}

        {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
            {pending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {labels.analyzing}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {submitLabel}
              </>
            )}
          </Button>

          {(state.requiresClarification || state.awaitingFinance || state.goalText) ? (
            <button
              type="button"
              onClick={() => {
                setAnswers({});
                setGoalText("");
                setTargetMode("age");
                window.location.assign("/app/goals?mode=new");
              }}
              className="min-h-12 rounded-2xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
            >
              {labels.restart}
            </button>
          ) : null}
        </div>
      </form>
    </Card>
  );
}
