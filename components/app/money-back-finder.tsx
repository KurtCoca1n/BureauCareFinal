"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Route } from "next";
import { ArrowRight, CircleHelp, Plane, ReceiptText, RefreshCcw, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  buildMoneyBackFinderResult,
  getInitialMoneyBackFinderInput,
  getIssuesForCategory,
  type MoneyBackCategory,
  type MoneyBackFinderInput,
  type MoneyBackIssue,
  type TernaryAnswer
} from "@/lib/money-back-finder";
import { getMoneyBackFinderCopy } from "@/lib/money-back-finder-ui";
import { cn } from "@/lib/utils";

function ToggleButton({
  active,
  label,
  onClick
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-2xl border px-4 py-3 text-left text-sm font-semibold transition",
        active
          ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]"
          : "border-[var(--line)] bg-white/90 text-[var(--foreground)] hover:border-[var(--line-strong)]"
      )}
    >
      {label}
    </button>
  );
}

function YesNoUnknown({
  value,
  labels,
  onChange
}: {
  value: TernaryAnswer;
  labels: { yes: string; no: string; unknown: string };
  onChange: (value: TernaryAnswer) => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {(["yes", "no", "unknown"] as const).map((option) => (
        <ToggleButton
          key={option}
          active={value === option}
          label={labels[option]}
          onClick={() => onChange(option)}
        />
      ))}
    </div>
  );
}

export function MoneyBackFinder({ locale }: { locale: string }) {
  const copy = getMoneyBackFinderCopy(locale);
  const englishMode = locale !== "de";
  const [input, setInput] = useState<MoneyBackFinderInput>(getInitialMoneyBackFinderInput);
  const [submitted, setSubmitted] = useState(false);

  const availableIssues = useMemo(() => getIssuesForCategory(input.category), [input.category]);
  const result = useMemo(() => buildMoneyBackFinderResult(input, locale), [input, locale]);

  function update<K extends keyof MoneyBackFinderInput>(key: K, value: MoneyBackFinderInput[K]) {
    setInput((current) => ({ ...current, [key]: value }));
  }

  function updateCategory(category: MoneyBackCategory) {
    const nextIssue = getIssuesForCategory(category)[0] as MoneyBackIssue;
    setInput((current) => ({
      ...current,
      category,
      issue: nextIssue,
      delayHours: "",
      extraCosts: ""
    }));
  }

  return (
    <div className="space-y-8">
      <section className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="accent">{copy.badge}</StatusBadge>
          <span className="text-sm text-[var(--muted)]">{copy.intro}</span>
        </div>
        <div className="space-y-3">
          <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{copy.title}</h1>
          <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,251,251,0.92))] p-5">
            <p className="text-sm leading-7 text-[var(--muted)]">{copy.disclaimer}</p>
          </Card>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)]">
        <div className="space-y-6">
          <Card className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{copy.categoryTitle}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">
                {input.category === "travel" ? copy.categoryTexts.travel : copy.categoryTexts.contracts}
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="button"
                onClick={() => updateCategory("travel")}
                className={cn(
                  "rounded-[24px] border p-5 text-left transition",
                  input.category === "travel"
                    ? "border-[var(--line-strong)] bg-[var(--surface-strong)] shadow-[0_20px_44px_rgba(95,163,163,0.12)]"
                    : "border-[var(--line)] bg-white/92 hover:border-[var(--line-strong)]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <StatusBadge tone="accent">{copy.categories.travel}</StatusBadge>
                    <h3 className="text-base font-semibold text-[var(--foreground)]">{copy.categories.travel}</h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">{copy.categoryTexts.travel}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
                    <Plane className="h-5 w-5" />
                  </div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => updateCategory("contracts")}
                className={cn(
                  "rounded-[24px] border p-5 text-left transition",
                  input.category === "contracts"
                    ? "border-[var(--line-strong)] bg-[var(--surface-strong)] shadow-[0_20px_44px_rgba(95,163,163,0.12)]"
                    : "border-[var(--line)] bg-white/92 hover:border-[var(--line-strong)]"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-2">
                    <StatusBadge tone="success">{copy.categories.contracts}</StatusBadge>
                    <h3 className="text-base font-semibold text-[var(--foreground)]">{copy.categories.contracts}</h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">{copy.categoryTexts.contracts}</p>
                  </div>
                  <div className="rounded-2xl bg-[rgba(123,191,159,0.16)] p-3 text-[var(--success)]">
                    <ReceiptText className="h-5 w-5" />
                  </div>
                </div>
              </button>
            </div>
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{copy.scenarioTitle}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">
                {input.category === "travel"
                  ? englishMode
                    ? "Choose the case that fits best."
                    : "Wähle den Fall, der am ehesten passt."
                  : englishMode
                    ? "Choose the issue that best matches your contract or subscription."
                    : "Wähle das Problem, das am besten zu deinem Vertrag oder Abo passt."}
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {availableIssues.map((issue) => (
                <ToggleButton
                  key={issue}
                  active={input.issue === issue}
                  label={copy.issues[issue]}
                  onClick={() => update("issue", issue)}
                />
              ))}
            </div>
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-lg font-semibold">{copy.detailsTitle}</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">{copy.fields.issueDate}</label>
                <Input type="date" value={input.issueDate} onChange={(event) => update("issueDate", event.target.value)} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">{copy.fields.providerName}</label>
                <Input value={input.providerName} onChange={(event) => update("providerName", event.target.value)} placeholder={copy.placeholders.providerName} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">{copy.fields.bookedService}</label>
                <Input value={input.bookedService} onChange={(event) => update("bookedService", event.target.value)} placeholder={copy.placeholders.bookedService} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">{copy.fields.amountPaid}</label>
                <Input inputMode="decimal" value={input.amountPaid} onChange={(event) => update("amountPaid", event.target.value)} placeholder={copy.placeholders.amountPaid} />
              </div>
              {input.category === "travel" ? (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--foreground)]">
                    {input.issue === "baggage_problem" || input.issue === "travel_disruption" ? copy.fields.extraCosts : copy.fields.delayHours}
                  </label>
                  <Input
                    inputMode="decimal"
                    value={input.issue === "baggage_problem" || input.issue === "travel_disruption" ? input.extraCosts : input.delayHours}
                    onChange={(event) =>
                      input.issue === "baggage_problem" || input.issue === "travel_disruption"
                        ? update("extraCosts", event.target.value)
                        : update("delayHours", event.target.value)
                    }
                    placeholder={input.issue === "baggage_problem" || input.issue === "travel_disruption" ? copy.placeholders.extraCosts : copy.placeholders.delayHours}
                  />
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--foreground)]">{copy.fields.serviceReceived}</label>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {(["full", "partly", "none"] as const).map((option) => (
                      <ToggleButton
                        key={option}
                        active={input.serviceReceived === option}
                        label={copy.serviceReceivedOptions[option]}
                        onClick={() => update("serviceReceived", option)}
                      />
                    ))}
                  </div>
                </div>
              )}
              {input.category === "travel" && (input.issue === "baggage_problem" || input.issue === "travel_disruption") ? (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[var(--foreground)]">{copy.fields.delayHours}</label>
                  <Input inputMode="decimal" value={input.delayHours} onChange={(event) => update("delayHours", event.target.value)} placeholder={copy.placeholders.delayHours} />
                </div>
              ) : null}
              {input.category === "contracts" ? (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-semibold text-[var(--foreground)]">{copy.fields.cancellationSent}</label>
                  <YesNoUnknown value={input.cancellationSent} labels={copy.booleanOptions} onChange={(value) => update("cancellationSent", value)} />
                </div>
              ) : null}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-[var(--foreground)]">{copy.fields.whatHappened}</label>
                <textarea
                  value={input.whatHappened}
                  onChange={(event) => update("whatHappened", event.target.value)}
                  placeholder={copy.placeholders.whatHappened}
                  className="min-h-28 w-full rounded-[24px] border border-white/80 bg-[rgba(255,255,255,0.94)] px-4 py-3 text-sm text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(95,163,163,0.12)]"
                />
              </div>
            </div>
          </Card>

          <Card className="space-y-5 p-5 sm:p-6">
            <h2 className="text-lg font-semibold">{copy.evidenceTitle}</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <ToggleButton active={input.hasBookingOrContract} label={copy.evidence.booking_or_contract} onClick={() => update("hasBookingOrContract", !input.hasBookingOrContract)} />
              <ToggleButton active={input.hasPaymentProof} label={copy.evidence.payment_proof} onClick={() => update("hasPaymentProof", !input.hasPaymentProof)} />
              <ToggleButton active={input.hasCommunication} label={copy.evidence.communication} onClick={() => update("hasCommunication", !input.hasCommunication)} />
              <ToggleButton active={input.hasCancellationProof} label={copy.evidence.cancellation_proof} onClick={() => update("hasCancellationProof", !input.hasCancellationProof)} />
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={() => setSubmitted(true)}>{copy.evaluateLabel}</Button>
              <Button
                variant="secondary"
                onClick={() => {
                  setInput(getInitialMoneyBackFinderInput());
                  setSubmitted(false);
                }}
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                {copy.resetLabel}
              </Button>
            </div>
          </Card>
        </div>

        <aside className="space-y-5 xl:sticky xl:top-6">
          <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,252,250,0.94))] p-6">
            {submitted ? (
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge tone="accent">{copy.resultTitle}</StatusBadge>
                    <StatusBadge tone={result.assessment === "very_likely" ? "success" : result.assessment === "likely" ? "accent" : "warning"}>
                      {copy.assessmentLabels[result.assessment]}
                    </StatusBadge>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{result.shortResult}</h2>
                  <p className="text-sm leading-7 text-[var(--muted)]">{result.possibleAmount}</p>
                </div>

                <div className="rounded-[24px] border border-[var(--line)] bg-white/92 p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{copy.explanationTitle}</p>
                  <div className="mt-3 space-y-3">
                    {result.reasoning.map((item) => (
                      <p key={item} className="text-sm leading-6 text-[var(--muted)]">
                        {item}
                      </p>
                    ))}
                  </div>
                </div>

                <div className="rounded-[24px] border border-[var(--line)] bg-white/92 p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{copy.missingTitle}</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
                    {result.missingInfo.map((item) => (
                      <li key={item} className="flex gap-2">
                        <CircleHelp className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-[24px] border border-[var(--line)] bg-white/92 p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{copy.nextStepsTitle}</p>
                  <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
                    {result.nextSteps.map((item) => (
                      <li key={item} className="flex gap-2">
                        <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {result.suggestedDocuments.length ? (
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/92 p-4">
                    <p className="text-sm font-semibold text-[var(--foreground)]">{englishMode ? "Helpful documents" : "Hilfreiche Unterlagen"}</p>
                    <ul className="mt-3 space-y-2 text-sm leading-6 text-[var(--muted)]">
                      {result.suggestedDocuments.map((item) => (
                        <li key={item} className="flex gap-2">
                          <WalletCards className="mt-1 h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="flex flex-wrap gap-3">
                  <Link href={"/app/upload" as Route} className="inline-flex">
                    <Button>{copy.uploadEvidenceLabel}</Button>
                  </Link>
                  <Link href={"/app/processes" as Route} className="inline-flex">
                    <Button variant="secondary">{copy.reviewProcessesLabel}</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <StatusBadge tone="neutral">{copy.resultTitle}</StatusBadge>
                <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.resultTitle}</h2>
                <p className="text-sm leading-7 text-[var(--muted)]">{copy.emptyResult}</p>
              </div>
            )}
          </Card>
        </aside>
      </div>
    </div>
  );
}
