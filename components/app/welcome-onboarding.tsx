"use client";

import { useActionState, useMemo, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { saveWelcomeOnboardingAction, type WelcomeActionState } from "@/lib/actions/welcome";
import { formatWelcomeText, getWelcomeCopy } from "@/lib/welcome-ui";

const initialState: WelcomeActionState = {
  error: "",
  success: ""
};

type Answers = {
  reason: string;
  nationality: string;
  city: string;
  housing_status: string;
  registration_status: string;
  health_insurance_status: string;
  work_status: string;
  has_children: string;
  german_level: string;
};

const defaults: Answers = {
  reason: "",
  nationality: "",
  city: "",
  housing_status: "",
  registration_status: "",
  health_insurance_status: "",
  work_status: "",
  has_children: "",
  german_level: ""
};

export function WelcomeOnboarding({ locale }: { locale: string }) {
  const copy = getWelcomeCopy(locale);
  const [state, formAction, pending] = useActionState(saveWelcomeOnboardingAction, initialState);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Answers>(defaults);

  const question = copy.questions[index];
  const total = copy.questions.length;
  const progressLabel = formatWelcomeText(copy.progress, { current: index + 1, total });

  const canContinue = useMemo(() => {
    switch (question.id) {
      case "nationality":
        return true;
      case "city":
        return answers.city.trim().length > 0;
      default:
        return Boolean(answers[question.id]);
    }
  }, [answers, question]);

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.08fr)_minmax(280px,0.92fr)]">
      <Card className="space-y-6 p-5 sm:p-6">
        <div className="space-y-3">
          <div className="inline-flex w-fit items-center rounded-full border border-[rgba(205,216,229,0.9)] bg-[rgba(241,245,249,0.95)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(78,94,114,0.86)]">
            {copy.onboardingBadge}
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.onboardingTitle}</h2>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">{copy.onboardingText}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[var(--foreground)]">{progressLabel}</p>
            <span className="text-sm text-[var(--muted)]">{Math.round(((index + 1) / total) * 100)}%</span>
          </div>
          <div className="h-2 rounded-full bg-[rgba(226,233,240,0.9)]">
            <div className="h-2 rounded-full bg-[image:var(--accent-gradient)] transition-all duration-300" style={{ width: `${((index + 1) / total) * 100}%` }} />
          </div>
        </div>

        <form action={formAction} className="space-y-5">
          {Object.entries(answers).map(([key, value]) => (
            <input key={key} type="hidden" name={key} value={value} />
          ))}

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-[var(--foreground)]">{question.title}</h3>
            <p className="text-sm leading-7 text-[var(--muted)]">
              {question.text} {"optional" in question && question.optional ? <span className="ml-2 text-xs uppercase tracking-[0.14em]">{question.optional}</span> : null}
            </p>
          </div>

          {"options" in question ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {question.options.map((option) => {
                const active = answers[question.id] === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.value }))}
                    className={[
                      "rounded-[24px] border p-4 text-left transition duration-300",
                      active
                        ? "border-[rgba(165,192,217,0.92)] bg-[linear-gradient(180deg,rgba(239,245,250,0.98),rgba(255,255,255,0.98))] shadow-[0_18px_36px_rgba(29,58,90,0.08)]"
                        : "border-[rgba(223,229,236,0.94)] bg-[rgba(255,255,255,0.94)] hover:-translate-y-0.5 hover:border-[rgba(208,220,234,0.92)]"
                    ].join(" ")}
                  >
                    <span className="block font-semibold text-[var(--foreground)]">{option.label}</span>
                    {option.description ? <span className="mt-1 block text-sm leading-6 text-[var(--muted)]">{option.description}</span> : null}
                  </button>
                );
              })}
            </div>
          ) : (
            <input
              value={answers[question.id]}
              onChange={(event) => setAnswers((current) => ({ ...current, [question.id]: event.target.value }))}
              placeholder={question.placeholder}
              className="min-h-12 w-full rounded-[24px] border border-[var(--line)] bg-white px-4 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          )}

          {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button type="button" variant="ghost" onClick={() => setIndex((current) => Math.max(0, current - 1))} disabled={index === 0 || pending}>
              {copy.back}
            </Button>

            {index < total - 1 ? (
              <Button type="button" onClick={() => setIndex((current) => Math.min(total - 1, current + 1))} disabled={!canContinue || pending}>
                {copy.next}
              </Button>
            ) : (
              <Button type="submit" disabled={!canContinue || pending}>
                {pending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {copy.saving}
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    {copy.finish}
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.roadmapTitle}</h3>
          <p className="text-sm leading-7 text-[var(--muted)]">{copy.roadmapText}</p>
        </div>
      </Card>
    </div>
  );
}
