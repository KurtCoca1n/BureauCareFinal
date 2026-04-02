import Link from "next/link";
import { ArrowLeft, CheckCircle2, ChevronRight, Coins, Flag, Sparkles, Target } from "lucide-react";
import type { Route } from "next";

import { GoalCompleteForm } from "@/components/app/goal-complete-form";
import { GoalDeleteForm } from "@/components/app/goal-delete-form";
import { GoalsCollectionCard } from "@/components/app/goals-collection-card";
import { GoalPlannerForm } from "@/components/app/goal-planner-form";
import { GoalStepLocationHint } from "@/components/app/goal-step-location-hint";
import { GoalStepToggleForm } from "@/components/app/goal-step-toggle-form";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { computeGoalProgress, getGoalFinancialSummary, getGoalImportanceLabel, getGoalsCopy, normalizeGoalAnalysis } from "@/lib/goals-ui";
import { getGoals, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

function ProgressBar({ value, tone = "accent" }: { value: number; tone?: "accent" | "success" }) {
  const bgClass = tone === "success" ? "bg-[var(--success)]" : "bg-[var(--accent)]";

  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-alt)]">
      <div className={`${bgClass} h-full rounded-full transition-all`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function hasExplicitTargetHint(text: string) {
  return /\b(19\d{2}|20\d{2}|21\d{2})\b/.test(text) || /\b(?:bis|mit)\s+\d{1,3}\b/i.test(text);
}

export default async function GoalsPage({
  searchParams
}: {
  searchParams?: Promise<{ goal?: string; mode?: string; deleted?: string; step?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const [profile, goals] = await Promise.all([getProfile(), getGoals()]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getGoalsCopy(locale);
  const mode = resolvedSearchParams?.mode ?? "";
  const selectedGoalId = resolvedSearchParams?.goal ?? "";
  const deletedGoalId = resolvedSearchParams?.deleted ?? "";
  const selectedStepId = resolvedSearchParams?.step ?? "";
  const selectedGoal = selectedGoalId ? goals.find((goal) => goal.id === selectedGoalId) ?? null : null;
  const showPlanner = mode !== "view" || !selectedGoal;
  const activeGoal = showPlanner ? null : selectedGoal;
  const dateLocale = locale === "en" ? "en-GB" : locale === "tr" ? "tr-TR" : locale === "uk" ? "uk-UA" : locale === "es" ? "es-ES" : "de-DE";

  return (
    <div className="relative space-y-8">
      <div className="goals-sky">
        <div className="goals-shooting-star" />
      </div>
      <section className="space-y-2 pt-4 text-center">
        <h1 className="page-title page-title-accent text-5xl sm:text-6xl">
          {copy.title}
        </h1>
      </section>

      <div className={`grid gap-6 ${showPlanner ? "xl:grid-cols-[minmax(0,1.02fr)_minmax(340px,0.98fr)]" : "xl:grid-cols-[minmax(0,1.18fr)_minmax(360px,0.82fr)]"}`}>
        <section className="space-y-5">
          {showPlanner ? (
            <GoalPlannerForm
              labels={{
                title: copy.plannerTitle,
                goalInput: copy.goalInput,
                currentAge: copy.currentAge,
                targetAge: copy.targetAge,
                targetYear: copy.targetYear,
                targetModeAge: copy.targetModeAge,
                targetModeYear: copy.targetModeYear,
                financialAmount: copy.financialAmount,
                monthlyIncome: copy.monthlyIncome,
                financialHint: copy.financialHint,
                analyze: copy.analyze,
                analyzing: copy.analyzing,
                continue: copy.continue,
                restart: copy.restart,
                backToPlanner: copy.backToPlanner,
                goalPlaceholder: copy.goalPlaceholder,
                clarifyTitle: copy.clarifyTitle,
                clarifyText: copy.clarifyText,
                financePromptFallback: copy.financePromptFallback
              }}
            />
          ) : activeGoal ? (
            (() => {
              const analysis = activeGoal.analysis_result ? normalizeGoalAnalysis(activeGoal.analysis_result) : null;
              const progress = analysis ? computeGoalProgress(analysis.bureaucracy_steps) : activeGoal.progress_percentage ?? 0;
              const financialSummary = getGoalFinancialSummary(locale, activeGoal.financial_readiness_percentage);
              const isCompleted = progress >= 100;
              const hasOwnTimingHint = hasExplicitTargetHint(`${activeGoal.title} ${activeGoal.goal_text}`);
              const selectedStep = analysis?.bureaucracy_steps.find((step) => step.id === selectedStepId) ?? null;

              return (
                <div className="space-y-5">
                  <Card className="space-y-6 p-6 lg:p-7">
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <StatusBadge tone="accent">{copy.currentGoalTitle}</StatusBadge>
                        {analysis?.estimated_overall_timeline && !hasOwnTimingHint ? <StatusBadge tone="neutral">{analysis.estimated_overall_timeline}</StatusBadge> : null}
                      </div>
                      <div className="flex w-full flex-wrap gap-3 md:col-span-2 md:justify-end">
                        <Link
                          href={"/app/goals?mode=new" as Route}
                          className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)] sm:w-auto"
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          {copy.backToPlanner}
                        </Link>
                        {!isCompleted ? <GoalCompleteForm goalId={activeGoal.id} label={copy.completeGoal} /> : <StatusBadge tone="success">{copy.completedGoal}</StatusBadge>}
                        <GoalDeleteForm goalId={activeGoal.id} label={copy.removeGoal} />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <h2 className="text-3xl font-semibold tracking-[-0.04em]">{activeGoal.title}</h2>
                          <p className="text-sm leading-7 text-[var(--muted)]">
                            {analysis?.goal_summary_simple ?? activeGoal.goal_text}
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-3 text-sm text-[var(--muted)]">
                          {activeGoal.current_age !== null ? (
                            <span>
                              {copy.ageNow}: <span className="font-medium text-[var(--foreground)]">{activeGoal.current_age}</span>
                            </span>
                          ) : null}
                          {activeGoal.target_age !== null ? (
                            <span>
                              {copy.ageTarget}: <span className="font-medium text-[var(--foreground)]">{activeGoal.target_age}</span>
                            </span>
                          ) : null}
                          {analysis?.target_year && !hasOwnTimingHint ? (
                            <span>
                              {copy.targetYear}: <span className="font-medium text-[var(--foreground)]">{analysis.target_year}</span>
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-3">
                      <Card className="space-y-3 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
                          <Flag className="h-4 w-4" />
                          {copy.timeline}
                        </div>
                        <p className="text-base font-semibold">{hasOwnTimingHint ? "Schon im Ziel beschrieben" : analysis?.estimated_overall_timeline ?? "—"}</p>
                      </Card>

                      <Card className="space-y-3 p-4">
                        <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
                          <CheckCircle2 className="h-4 w-4" />
                          {copy.progress}
                        </div>
                        <p className="text-base font-semibold">{progress}%</p>
                        <ProgressBar value={progress} />
                      </Card>

                      {activeGoal.financial_readiness_percentage !== null ? (
                        <Card className="space-y-3 p-4">
                          <div className="flex items-center gap-2 text-sm font-medium text-[var(--muted)]">
                            <Coins className="h-4 w-4" />
                            {copy.financialProgress}
                          </div>
                          <p className="text-base font-semibold">{activeGoal.financial_readiness_percentage}%</p>
                          <ProgressBar value={activeGoal.financial_readiness_percentage} tone="success" />
                          {financialSummary ? <p className="text-sm leading-6 text-[var(--muted)]">{financialSummary}</p> : null}
                        </Card>
                      ) : null}
                    </div>

                    {analysis ? (
                      <>
                        {analysis.bureaucracy_steps.length ? (
                          <section className="space-y-4">
                            <div className="flex items-center gap-2">
                              <h3 className="text-lg font-semibold">{copy.steps}</h3>
                              <StatusBadge tone="neutral">{analysis.bureaucracy_steps.length}</StatusBadge>
                            </div>
                            {selectedStep ? (
                              <Card className="space-y-4 border-[rgba(95,163,163,0.2)] bg-[rgba(95,163,163,0.08)] p-5">
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                  <div>
                                    <p className="text-sm font-medium text-[var(--accent-strong)]">
                                      {locale === "en" ? "Step details" : locale === "tr" ? "Adım detayı" : locale === "uk" ? "Деталі кроку" : locale === "es" ? "Detalle del paso" : "Schritt-Detail"}
                                    </p>
                                    <h4 className="mt-1 text-xl font-semibold">{selectedStep.title}</h4>
                                  </div>
                                  <Link
                                    href={`/app/goals?mode=view&goal=${activeGoal.id}` as Route}
                                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
                                  >
                                    <ArrowLeft className="mr-2 h-4 w-4" />
                                    {locale === "en" ? "Back" : locale === "tr" ? "Geri" : locale === "uk" ? "Назад" : locale === "es" ? "Volver" : "Zurück"}
                                  </Link>
                                </div>
                                <p className="text-sm leading-7 text-[var(--foreground)]">{selectedStep.description_simple}</p>
                                <div className="grid gap-3 md:grid-cols-2">
                                  <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.duration}</p>
                                    <p className="mt-2 text-sm font-medium">{selectedStep.estimated_duration ?? "Noch offen"}</p>
                                  </div>
                                  <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.importance}</p>
                                    <p className="mt-2 text-sm font-medium">{getGoalImportanceLabel(selectedStep.importance, locale)}</p>
                                  </div>
                                </div>
                                <Card className="space-y-3 bg-white p-4">
                                  <h5 className="font-semibold">
                                    {locale === "en"
                                      ? "What matters here"
                                      : locale === "tr"
                                        ? "Burada önemli olan"
                                        : locale === "uk"
                                          ? "На що тут звернути увагу"
                                          : locale === "es"
                                            ? "Qué importa aquí"
                                            : "Worauf du achten solltest"}
                                  </h5>
                                  <p className="text-sm leading-6 text-[var(--muted)]">
                                    {selectedStep.related_costs_note ||
                                      (locale === "en"
                                        ? "Prepare the key documents first and take this step one part at a time."
                                        : locale === "tr"
                                          ? "Önemli belgeleri önce hazırla ve bu adımı sakince küçük parçalara böl."
                                          : locale === "uk"
                                            ? "Спочатку підготуй основні документи й проходь цей крок спокійно, частинами."
                                            : locale === "es"
                                              ? "Prepara primero los documentos más importantes y aborda este paso con calma, por partes."
                                              : "Lege die wichtigsten Unterlagen zuerst bereit und geh diesen Schritt dann ruhig in Teilen an.")}
                                  </p>
                                </Card>
                                <GoalStepLocationHint
                                  locale={locale}
                                  stepTitle={selectedStep.title}
                                  stepDescription={selectedStep.description_simple}
                                  note={selectedStep.related_costs_note}
                                />
                              </Card>
                            ) : null}
                            <div className="grid gap-4">
                              {analysis.bureaucracy_steps.map((step) => (
                                <Card key={step.id} className="flex h-full flex-col gap-4 p-4">
                                  <div className="flex flex-wrap items-start justify-between gap-3">
                                    <div className="space-y-2">
                                      <div className="flex flex-wrap gap-2">
                                        <StatusBadge tone={step.status === "done" ? "success" : "neutral"}>
                                          {step.status === "done" ? copy.done : copy.open}
                                        </StatusBadge>
                                        <StatusBadge tone={step.importance === "high" ? "warning" : step.importance === "medium" ? "accent" : "neutral"}>
                                          {copy.importance}: {getGoalImportanceLabel(step.importance, locale)}
                                        </StatusBadge>
                                        {step.estimated_duration ? <StatusBadge tone="neutral">{copy.duration}: {step.estimated_duration}</StatusBadge> : null}
                                      </div>
                                      <h4 className="text-base font-semibold">{step.title}</h4>
                                    </div>
                                    <GoalStepToggleForm goalId={activeGoal.id} stepId={step.id} isDone={step.status === "done"} openLabel={copy.open} doneLabel={copy.done} />
                                  </div>
                                  <p className="text-sm leading-6 text-[var(--muted)]">{step.description_simple}</p>
                                  <Link
                                    href={`/app/goals?mode=view&goal=${activeGoal.id}&step=${step.id}` as Route}
                                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
                                  >
                                    {locale === "en" ? "More about this step" : locale === "tr" ? "Bu adım hakkında daha fazla" : locale === "uk" ? "Більше про цей крок" : locale === "es" ? "Más sobre este paso" : "Mehr zu diesem Schritt"}
                                  </Link>
                                  {step.related_costs_note ? <p className="text-sm leading-6 text-[var(--muted)]">{step.related_costs_note}</p> : null}
                                </Card>
                              ))}
                            </div>
                          </section>
                        ) : (
                          <Card className="space-y-3 border-[rgba(123,191,159,0.22)] bg-[rgba(123,191,159,0.08)] p-5">
                            <h3 className="text-lg font-semibold">{copy.luckyTitle}</h3>
                            <p className="text-sm leading-7 text-[var(--muted)]">{copy.luckyText}</p>
                          </Card>
                        )}

                        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)]">
                          <Card className="space-y-3 p-5">
                            <div className="flex items-center gap-2">
                              <Sparkles className="h-4 w-4 text-[var(--accent)]" />
                              <h4 className="text-lg font-semibold">{copy.guidance}</h4>
                            </div>
                            <ul className="space-y-3 text-sm leading-6 text-[var(--muted)]">
                              {analysis.ai_guidance.map((item) => (
                                <li key={item} className="rounded-2xl bg-white px-4 py-3">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </Card>

                          <Card className="space-y-3 p-5">
                            <h4 className="text-lg font-semibold">{copy.recommendation}</h4>
                            <p className="text-sm leading-7 text-[var(--muted)]">{analysis.recommendation_simple}</p>
                          </Card>
                        </div>
                      </>
                    ) : null}
                  </Card>
                </div>
              );
            })()
          ) : (
            <Card className="p-6 text-sm leading-6 text-[var(--muted)]">{copy.noSelection}</Card>
          )}
        </section>

        <aside className="space-y-5">
          <Card className="relative overflow-hidden border-[var(--line-strong)] bg-[linear-gradient(160deg,rgba(255,252,247,0.96),rgba(244,248,245,0.96))] p-6">
            <div className="pointer-events-none absolute -right-10 top-6 h-32 w-32 rounded-full bg-[rgba(123,191,159,0.16)] blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-28 w-28 rounded-full bg-[rgba(74,144,226,0.12)] blur-3xl" />
            <div className="pointer-events-none absolute right-14 top-24 h-16 w-16 rounded-full border border-white/50 bg-white/20 blur-sm" />

            <GoalsCollectionCard
              goals={goals}
              activeGoalId={activeGoal?.id ?? null}
              deletedGoalId={deletedGoalId || null}
              dateLocale={dateLocale}
              copy={{
                collectionTitle: copy.collectionTitle,
                collectionHint: copy.collectionHint,
                createdAt: copy.createdAt,
                progress: copy.progress,
                noGoals: copy.noGoals
              }}
            />
          </Card>
        </aside>
      </div>
    </div>
  );
}
