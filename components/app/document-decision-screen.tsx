import Link from "next/link";
import type { Route } from "next";
import { BookOpen, Building2, CalendarRange, Compass, Layers, ListTodo, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getAlternativeLinks,
  getCaseLink,
  getDeadlineBody,
  getDecisionAmbientBand,
  getDecisionPageEyebrow,
  getDecisionPageSubtitle,
  getDecisionPageTitle,
  getFallbackWhenNoDetection,
  getKindHeadlineForNarrative,
  getLaterLink,
  getPrimaryAction,
  getPrimaryModuleNarrative,
  getPriorityBandSupport,
  getPriorityBandTitle,
  getRecognitionExplanation,
  getSectionAlternatives,
  getSectionImportance,
  getSectionNext,
  getSectionRecognized,
  getSectionRecommended,
  getWatchOutTitle
} from "@/lib/document-decision-ui";
import { SaveDocumentCaseForm } from "@/components/app/save-document-case-form";
import { getDecisionCaseSaveCopy } from "@/lib/case-ui";
import { isNoticeScannerLeadFlow, type DocumentKindDetection } from "@/lib/document-kind";
import {
  generalExplainAnchor,
  getGeneralExplainRoutingFallbackCard
} from "@/lib/general-explain-flow-ui";
import { getNoticeScannerRoutingHighlight } from "@/lib/notice-scanner-flow-ui";
import { buildRoutingOrientationView } from "@/lib/routing-action-hints";
import { getModuleLabels } from "@/lib/document-kind-ui";
import type { AppLocale } from "@/lib/i18n";
import type { DocumentRecord } from "@/lib/types";
import { cn } from "@/lib/utils";

type Props = {
  document: Pick<DocumentRecord, "id" | "original_filename" | "case_id">;
  detection: DocumentKindDetection | null;
  locale: AppLocale;
  dateLocale: string;
};

export function DocumentDecisionScreen({ document, detection, locale, dateLocale }: Props) {
  const caseSaveCopy = getDecisionCaseSaveCopy(locale);

  if (!detection) {
    const fb = getFallbackWhenNoDetection(locale);
    return (
      <div className="space-y-8 pt-4">
        <section className="space-y-3">
          <StatusBadge tone="warning">{getDecisionPageEyebrow(locale)}</StatusBadge>
          <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{fb.title}</h1>
          <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{fb.text}</p>
        </section>
        <SaveDocumentCaseForm
          documentId={document.id}
          locale={locale}
          copy={caseSaveCopy}
          caseId={document.case_id}
        />
        <Link
          href={generalExplainAnchor(document.id)}
          className={cn(
            "inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition duration-200",
            "bg-[image:var(--accent-gradient)] text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-[1.02]"
          )}
        >
          {fb.cta}
        </Link>
      </div>
    );
  }

  const headline = getKindHeadlineForNarrative(locale, detection);
  const primary = detection.suggested_modules[0] ?? "document_summary";
  const primaryLabel = getModuleLabels(locale, [primary])[0];
  const primaryAction = getPrimaryAction(locale, primary, document.id);
  const alternatives = getAlternativeLinks(locale, document.id, document.case_id, primary);
  const caseAlt = document.case_id ? getCaseLink(locale, document.case_id) : null;
  const later = getLaterLink(locale, document.id);
  const orientation = buildRoutingOrientationView(locale, detection, dateLocale);
  const ambient = getDecisionAmbientBand(locale);
  const noticeHighlight = isNoticeScannerLeadFlow(detection) ? getNoticeScannerRoutingHighlight(locale) : null;
  const explainFallback =
    primary !== "document_summary" ? getGeneralExplainRoutingFallbackCard(locale) : null;

  return (
    <div className="space-y-8 pt-4">
      <section className="space-y-4">
        <StatusBadge tone="accent">{getDecisionPageEyebrow(locale)}</StatusBadge>
        <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{getDecisionPageTitle(locale)}</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{document.original_filename}</p>
        <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{getDecisionPageSubtitle(locale)}</p>
      </section>

      <Card className="space-y-4 border border-dashed border-[rgba(95,163,163,0.22)] bg-[rgba(255,255,255,0.72)] p-5 sm:p-6">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{ambient.title}</h2>
        <div className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">
          {ambient.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          {ambient.chips.map((chip) => (
            <StatusBadge key={chip} tone="neutral">
              {chip}
            </StatusBadge>
          ))}
        </div>
      </Card>

      <SaveDocumentCaseForm
        documentId={document.id}
        locale={locale}
        copy={caseSaveCopy}
        caseId={document.case_id}
      />

      <Card className="space-y-4 border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(246,250,249,0.86))] p-6 sm:p-7 shadow-[0_18px_44px_rgba(43,43,43,0.05)]">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[rgba(95,163,163,0.12)] p-3 text-[var(--accent)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{getSectionRecognized(locale)}</p>
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">{headline}</h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{getRecognitionExplanation(locale, detection.confidence)}</p>
          </div>
        </div>
        {detection.signals.length ? (
          <div className="space-y-2 border-t border-[var(--line)] pt-4">
            <p className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--muted)]">{getWatchOutTitle(locale)}</p>
            <ul className="flex flex-wrap gap-2">
              {detection.signals.map((signal) => (
                <li
                  key={signal}
                  className="rounded-full border border-[var(--line)] bg-white/95 px-3 py-1.5 text-xs font-medium text-[var(--foreground)]/90"
                >
                  {signal}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </Card>

      <Card className="space-y-3 border-[var(--line)] bg-white/95 p-6 sm:p-7">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          <Compass className="h-3.5 w-3.5" />
          {getSectionImportance(locale)}
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone={detection.priority_band === "urgent" ? "accent" : "neutral"}>
            {getPriorityBandTitle(locale, detection.priority_band)}
          </StatusBadge>
        </div>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{getPriorityBandSupport(locale, detection.priority_band)}</p>
      </Card>

      <Card className="space-y-5 border border-[rgba(95,163,163,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,252,251,0.65))] p-6 sm:p-7 shadow-[0_12px_34px_rgba(43,43,43,0.03)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
            <CalendarRange className="h-3.5 w-3.5 text-[var(--accent)]" />
            {orientation.sectionTitle}
          </div>
          <StatusBadge tone="neutral">{orientation.deadlineBadge}</StatusBadge>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-[var(--foreground)]">{orientation.deadlineBlock.title}</h3>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{orientation.deadlineBlock.detail}</p>
        </div>

        <div className="space-y-2 border-t border-[var(--line)] pt-4">
          <h4 className="text-sm font-semibold text-[var(--foreground)]">{orientation.reactionBlock.title}</h4>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{orientation.reactionBlock.detail}</p>
        </div>

        <div className="space-y-3 border-t border-[var(--line)] pt-4">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            <ListTodo className="h-3.5 w-3.5" />
            {orientation.microStepsTitle}
          </div>
          <ul className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            {orientation.microSteps.map((step) => (
              <li
                key={step}
                className="rounded-[18px] border border-[var(--line)] bg-white/95 px-3 py-2 text-xs font-medium leading-snug text-[var(--foreground)]/92 shadow-[var(--shadow-soft)]"
              >
                {step}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-[20px] border border-[var(--line)] bg-white/80 px-4 py-3">
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)]">
            {locale === "de" ? "Nächster sinnvoller Schritt" : "Sensible next step"}
          </p>
          <p className="mt-1.5 text-sm font-medium leading-relaxed text-[var(--foreground)]/95">{orientation.nextStepLine}</p>
        </div>
      </Card>

      {noticeHighlight ? (
        <Card className="space-y-4 border border-[rgba(95,163,163,0.26)] bg-[linear-gradient(168deg,rgba(255,255,255,0.99),rgba(232,244,243,0.78))] p-6 sm:p-7 shadow-[0_18px_44px_rgba(95,163,163,0.1)]">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[rgba(95,163,163,0.14)] p-3 text-[var(--accent)]">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{noticeHighlight.title}</p>
              <p className="text-sm font-medium leading-relaxed text-[var(--foreground)]/95">{noticeHighlight.subtitle}</p>
              <ul className="mt-3 space-y-2 border-t border-[var(--line)] pt-3">
                {noticeHighlight.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm leading-relaxed text-[var(--muted)]">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)] opacity-70" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      ) : null}

      {explainFallback ? (
        <Card className="space-y-4 border border-[var(--line)] bg-[rgba(255,255,255,0.92)] p-6 sm:p-7 shadow-[var(--shadow-soft)]">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[rgba(95,163,163,0.1)] p-3 text-[var(--accent)]">
              <BookOpen className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">{explainFallback.eyebrow}</p>
              <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{explainFallback.title}</h2>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{explainFallback.intro}</p>
              <ul className="mt-3 space-y-2 border-t border-[var(--line)] pt-3">
                {explainFallback.bullets.map((b) => (
                  <li key={b} className="flex gap-2 text-sm leading-relaxed text-[var(--foreground)]/92">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-[var(--accent)] opacity-60" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={generalExplainAnchor(document.id)}
                className={cn(
                  "mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl border border-[rgba(95,163,163,0.35)] bg-white px-4 text-sm font-semibold text-[var(--foreground)] transition hover:bg-[rgba(95,163,163,0.08)]"
                )}
              >
                {explainFallback.cta}
              </Link>
            </div>
          </div>
        </Card>
      ) : null}

      <Card className="space-y-4 border-[rgba(95,163,163,0.28)] bg-[linear-gradient(165deg,rgba(255,255,255,0.99),rgba(238,246,245,0.72))] p-6 sm:p-8 shadow-[0_20px_48px_rgba(95,163,163,0.09)]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          <Layers className="h-3.5 w-3.5" />
          {getSectionRecommended(locale)}
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusBadge tone="accent">{primaryLabel}</StatusBadge>
        </div>
        <p className="text-sm leading-relaxed text-[var(--foreground)]/95">
          {getPrimaryModuleNarrative(locale, primary, headline)}
        </p>
      </Card>

      <Card className="space-y-4 border-[var(--line)] bg-[rgba(252,251,248,0.65)] p-6 sm:p-7">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">{getSectionAlternatives(locale)}</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {alternatives.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="block rounded-[22px] border border-[var(--line)] bg-white px-4 py-3 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[rgba(95,163,163,0.35)]"
              >
                <span className="block">{item.label}</span>
                {item.description ? <span className="mt-1 block text-xs font-normal text-[var(--muted)]">{item.description}</span> : null}
              </Link>
            </li>
          ))}
          {caseAlt ? (
            <li key={caseAlt.href}>
              <Link
                href={caseAlt.href}
                className="block rounded-[22px] border border-dashed border-[var(--line)] bg-white/90 px-4 py-3 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
              >
                <span className="block">{caseAlt.label}</span>
                {caseAlt.description ? (
                  <span className="mt-1 block text-xs font-normal text-[var(--muted)]">{caseAlt.description}</span>
                ) : null}
              </Link>
            </li>
          ) : null}
        </ul>
      </Card>

      <Card className="space-y-5 border-[var(--line-strong)] bg-white p-6 sm:p-7">
        <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{getSectionNext(locale)}</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            href={primaryAction.href as Route}
            className={cn(
              "inline-flex min-h-12 flex-1 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition duration-200 sm:max-w-md",
              "bg-[image:var(--accent-gradient)] text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-[1.02]"
            )}
          >
            {primaryAction.label}
          </Link>
          <Link
            href={later.href as Route}
            className={cn(
              "inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition duration-200 sm:w-auto",
              "border border-[rgba(232,220,207,0.85)] bg-[rgba(232,220,207,0.32)] text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[rgba(232,220,207,0.48)]"
            )}
          >
            {later.label}
          </Link>
        </div>
        <p className="text-xs text-[var(--muted)]">{later.description}</p>
      </Card>
    </div>
  );
}
