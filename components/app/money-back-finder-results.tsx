"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Route } from "next";
import { ArrowRight, CircleHelp, CirclePercent, Plane, ReceiptText, RefreshCcw, WalletCards } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  buildMoneyBackFinderResult,
  getInitialMoneyBackFinderInput,
  getIssuesForCategory,
  type MoneyBackAssessment,
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

function getAssessmentMeterValue(assessment: MoneyBackAssessment) {
  switch (assessment) {
    case "very_likely":
      return 84;
    case "likely":
      return 66;
    case "unclear":
      return 42;
    default:
      return 18;
  }
}

function getHeroAppearance(assessment: MoneyBackAssessment) {
  switch (assessment) {
    case "very_likely":
      return {
        badgeTone: "success" as const,
        panelClass: "border-[rgba(123,191,159,0.28)] bg-[linear-gradient(180deg,rgba(244,252,247,0.98),rgba(234,247,239,0.95))]",
        orbClass: "bg-[rgba(123,191,159,0.18)] text-[var(--success)]"
      };
    case "likely":
      return {
        badgeTone: "accent" as const,
        panelClass: "border-[rgba(95,163,163,0.28)] bg-[linear-gradient(180deg,rgba(246,252,252,0.98),rgba(236,246,246,0.95))]",
        orbClass: "bg-[var(--accent-soft)] text-[var(--accent-strong)]"
      };
    case "unclear":
      return {
        badgeTone: "warning" as const,
        panelClass: "border-[rgba(242,166,90,0.26)] bg-[linear-gradient(180deg,rgba(255,251,245,0.98),rgba(250,244,235,0.95))]",
        orbClass: "bg-[rgba(242,166,90,0.18)] text-[var(--orange)]"
      };
    default:
      return {
        badgeTone: "neutral" as const,
        panelClass: "border-[rgba(111,168,220,0.26)] bg-[linear-gradient(180deg,rgba(248,251,255,0.98),rgba(240,246,253,0.95))]",
        orbClass: "bg-[rgba(111,168,220,0.14)] text-[var(--soft-blue)]"
      };
  }
}

function getHeroTitle(assessment: MoneyBackAssessment, englishMode: boolean) {
  switch (assessment) {
    case "very_likely":
      return englishMode ? "Likely claim found" : "Wahrscheinlich Anspruch gefunden";
    case "likely":
      return englishMode ? "A refund may be realistic" : "Moeglicher Anspruch gefunden";
    case "unclear":
      return englishMode ? "More information is needed" : "Mehr Informationen benoetigt";
    default:
      return englishMode ? "No clear claim visible right now" : "Aktuell kein klarer Anspruch erkennbar";
  }
}

function getHeroExplanation(
  assessment: MoneyBackAssessment,
  categoryLabel: string,
  englishMode: boolean
) {
  switch (assessment) {
    case "very_likely":
    case "likely":
      return englishMode
        ? `BureauCare checked your ${categoryLabel.toLowerCase()} case and found several signs that money back may be possible.`
        : `BureauCare hat deinen Fall zu ${categoryLabel.toLowerCase()} geprueft und mehrere Anzeichen fuer eine moegliche Rueckzahlung gefunden.`;
    case "unclear":
      return englishMode
        ? "There are first signs, but a safer assessment still needs a few details or documents."
        : "Es gibt erste Anzeichen, aber fuer eine sichere Einschaetzung fehlen noch ein paar Angaben oder Belege.";
    default:
      return englishMode
        ? "At the moment there are too few signs for a clear claim. You can still improve the check with better details."
        : "Im Moment gibt es zu wenige Anzeichen fuer einen klaren Anspruch. Mit genaueren Angaben kann die Pruefung noch besser werden.";
  }
}

function ResultList({
  items,
  icon,
  iconClass
}: {
  items: string[];
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
}) {
  const Icon = icon;

  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--muted)]">
          <Icon className={cn("mt-1 h-4 w-4 shrink-0", iconClass)} />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function MoneyBackFinderResults({ locale }: { locale: string }) {
  const copy = getMoneyBackFinderCopy(locale);
  const englishMode = locale !== "de";
  const [input, setInput] = useState<MoneyBackFinderInput>(getInitialMoneyBackFinderInput);
  const [submitted, setSubmitted] = useState(false);

  const availableIssues = useMemo(() => getIssuesForCategory(input.category), [input.category]);
  const result = useMemo(() => buildMoneyBackFinderResult(input, locale), [input, locale]);
  const heroAppearance = getHeroAppearance(result.assessment);
  const meterValue = getAssessmentMeterValue(result.assessment);
  const heroTitle = getHeroTitle(result.assessment, englishMode);
  const heroExplanation = getHeroExplanation(
    result.assessment,
    input.category === "travel" ? copy.categories.travel : copy.categories.contracts,
    englishMode
  );

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

      {submitted ? (
        <section className="space-y-5">
          <Card className={cn("p-6 sm:p-7", heroAppearance.panelClass)}>
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge tone={heroAppearance.badgeTone}>{copy.resultTitle}</StatusBadge>
                  <StatusBadge tone={heroAppearance.badgeTone}>{copy.assessmentLabels[result.assessment]}</StatusBadge>
                </div>
                <div className="space-y-3">
                  <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)]">{heroTitle}</h2>
                  <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">{heroExplanation}</p>
                  <p className="max-w-3xl text-sm leading-7 text-[var(--foreground)]">{result.shortResult}</p>
                </div>
              </div>
              <div className={cn("flex h-14 w-14 items-center justify-center rounded-[22px] shadow-[var(--shadow-soft)]", heroAppearance.orbClass)}>
                <WalletCards className="h-6 w-6" />
              </div>
            </div>
          </Card>

          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="space-y-4 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{englishMode ? "Assessment" : "Einschaetzung"}</h3>
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {englishMode
                      ? "This is BureauCare's current estimate of how realistic a claim looks."
                      : "So schaetzt BureauCare im Moment ein, wie realistisch ein Anspruch wirkt."}
                  </p>
                </div>
                <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
                  <CirclePercent className="h-5 w-5" />
                </div>
              </div>
              <p className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.assessmentLabels[result.assessment]}</p>
              <div className="space-y-2">
                <div className="h-3 overflow-hidden rounded-full bg-[rgba(232,220,207,0.55)]">
                  <div className="h-full rounded-full bg-[image:var(--accent-gradient)] transition-all" style={{ width: `${meterValue}%` }} />
                </div>
                <p className="text-xs leading-5 text-[var(--muted)]">
                  {englishMode
                    ? "This is only a cautious orientation, not an exact legal probability."
                    : "Das ist nur eine vorsichtige Orientierung, keine exakte rechtliche Wahrscheinlichkeit."}
                </p>
              </div>
            </Card>

            <Card className="space-y-4 p-5 sm:p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {englishMode ? "Possible refund or compensation" : "Moegliche Rueckerstattung / Entschaedigung"}
                </h3>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  {englishMode
                    ? "Only shown as far as the current details allow a sensible estimate."
                    : "Nur so weit angegeben, wie die aktuellen Informationen eine sinnvolle Schaetzung erlauben."}
                </p>
              </div>
              <p className="text-xl font-semibold leading-8 tracking-[-0.03em] text-[var(--foreground)]">{result.possibleAmount}</p>
            </Card>
          </div>

          <Card className="space-y-4 p-5 sm:p-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">
                {englishMode ? "Why a claim may exist" : "Warum koennte ein Anspruch bestehen?"}
              </h3>
              <p className="text-sm leading-6 text-[var(--muted)]">
                {englishMode
                  ? "These are the main points that currently speak in your favour."
                  : "Das sind die wichtigsten Punkte, die im Moment fuer dich sprechen."}
              </p>
            </div>
            <ResultList items={result.reasoning} icon={ArrowRight} iconClass="text-[var(--accent-strong)]" />
          </Card>

          {result.missingInfo.length || result.suggestedDocuments.length ? (
            <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <Card className="space-y-4 p-5 sm:p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.missingTitle}</h3>
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {englishMode
                      ? "This would help BureauCare assess the situation more clearly."
                      : "Damit kann BureauCare den Fall klarer pruefen."}
                  </p>
                </div>
                <ResultList items={result.missingInfo} icon={CircleHelp} iconClass="text-[var(--orange)]" />
              </Card>

              <Card className="space-y-4 p-5 sm:p-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {englishMode ? "Helpful documents" : "Hilfreiche Unterlagen"}
                  </h3>
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {englishMode
                      ? "These documents can make the next check easier and stronger."
                      : "Diese Unterlagen machen die naechste Pruefung meist leichter und staerker."}
                  </p>
                </div>
                <ResultList items={result.suggestedDocuments} icon={WalletCards} iconClass="text-[var(--accent-strong)]" />
              </Card>
            </div>
          ) : null}

          <div className="grid gap-5 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
            <Card className="space-y-4 p-5 sm:p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.nextStepsTitle}</h3>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  {englishMode
                    ? "This is the clearest practical next move right now."
                    : "Das ist jetzt der klarste praktische naechste Schritt."}
                </p>
              </div>
              <ResultList items={result.nextSteps} icon={ArrowRight} iconClass="text-[var(--accent-strong)]" />
              <div className="flex flex-wrap gap-3 pt-2">
                <Link href={"/app/upload" as Route} className="inline-flex">
                  <Button>{copy.uploadEvidenceLabel}</Button>
                </Link>
                <Link href={"/app/processes" as Route} className="inline-flex">
                  <Button variant="secondary">{copy.reviewProcessesLabel}</Button>
                </Link>
              </div>
            </Card>

            <Card className="space-y-4 p-5 sm:p-6">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-[var(--foreground)]">
                  {englishMode ? "How BureauCare can help" : "So kann BureauCare helfen"}
                </h3>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  {englishMode
                    ? "This area is already prepared for the next helpful actions."
                    : "Dieser Bereich ist schon fuer die naechsten hilfreichen Schritte vorbereitet."}
                </p>
              </div>
              <ResultList
                items={
                  englishMode
                    ? [
                        "We can help you collect the right documents.",
                        "We can prepare a message or request for you later.",
                        "We can remind you of important deadlines."
                      ]
                    : [
                        "Wir koennen dir helfen, die richtigen Unterlagen zu sammeln.",
                        "Wir koennen spaeter ein Schreiben oder eine Anfrage fuer dich vorbereiten.",
                        "Wir koennen dich an wichtige Fristen erinnern."
                      ]
                }
                icon={ArrowRight}
                iconClass="text-[var(--soft-blue)]"
              />
            </Card>
          </div>
        </section>
      ) : (
        <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,252,250,0.94))] p-6">
          <div className="space-y-3">
            <StatusBadge tone="neutral">{copy.resultTitle}</StatusBadge>
            <h2 className="text-xl font-semibold text-[var(--foreground)]">{copy.resultTitle}</h2>
            <p className="text-sm leading-7 text-[var(--muted)]">{copy.emptyResult}</p>
          </div>
        </Card>
      )}

      <section className="space-y-6">
        <Card className="space-y-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold">{copy.categoryTitle}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">
                {input.category === "travel" ? copy.categoryTexts.travel : copy.categoryTexts.contracts}
              </p>
            </div>
            {submitted ? (
              <Button variant="secondary" onClick={() => setSubmitted(false)}>
                {englishMode ? "Adjust case" : "Fall anpassen"}
              </Button>
            ) : null}
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
                  : "Waehle den Fall, der am ehesten passt."
                : englishMode
                  ? "Choose the issue that best matches your contract or subscription."
                  : "Waehle das Problem, das am besten zu deinem Vertrag oder Abo passt."}
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
      </section>
    </div>
  );
}
