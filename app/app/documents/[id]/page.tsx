import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  Bot,
  CalendarClock,
  ChevronRight,
  Download,
  FileSearch,
  FileText,
  FolderOpen,
  SendHorizonal,
  ShieldAlert
} from "lucide-react";
import type { Route } from "next";

import { AnalyzeDocumentForm } from "@/components/app/analyze-document-form";
import { DocumentSentForm, DocumentWaitingForm } from "@/components/app/case-status-form";
import { DocumentSummaryTabs } from "@/components/app/document-summary-tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCaseStatusLabel, getCaseText, getDocumentStatusLabel } from "@/lib/case-ui";
import { getDocumentTypeLabel } from "@/lib/file-types";
import { getCopy, getDateLocale, getDocumentTrustCopy, getUsageCopy } from "@/lib/i18n";
import { getCaseById, getDocumentAnalysisByDocumentId, getDocumentById, getProfile, getUsageSummaryForCurrentUser } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";
import { createClient } from "@/lib/supabase/server";
import { hasReachedAnalysisLimit } from "@/lib/usage";

function getUrgencyLabel(value: string | null, locale: string) {
  const copy = getCopy(locale);
  return value === "high"
    ? copy.urgency.high
    : value === "medium"
      ? copy.urgency.medium
      : value === "low"
        ? copy.urgency.low
        : copy.urgency.unclear;
}

function getActionModeLabel(mode: string | null, locale: string) {
  const copy = getCopy(locale);
  switch (mode) {
    case "online":
      return copy.actionMode.online;
    case "vor_ort":
      return copy.actionMode.onSite;
    case "per_post":
      return copy.actionMode.byPost;
    case "telefon":
      return copy.actionMode.byPhone;
    default:
      return null;
  }
}

export default async function DocumentDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [document, analysis, profile, usageSummary] = await Promise.all([
    getDocumentById(id),
    getDocumentAnalysisByDocumentId(id),
    getProfile(),
    getUsageSummaryForCurrentUser()
  ]);

  if (!document) {
    notFound();
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getCopy(locale);
  const trustCopy = getDocumentTrustCopy(locale);
  const usageCopy = getUsageCopy(locale);
  const dateLocale = getDateLocale(locale);
  const caseText = getCaseText(locale);
  const statusActionCopy =
    locale === "en"
      ? { sent: "Reply sent", waiting: "Waiting for a reply", saving: "Saving..." }
      : locale === "tr"
        ? { sent: "Yanıt gönderildi", waiting: "Yanıt bekleniyor", saving: "Kaydediliyor..." }
        : locale === "uk"
          ? { sent: "Відповідь надіслано", waiting: "Очікуємо на відповідь", saving: "Зберігається..." }
          : locale === "es"
            ? { sent: "Respuesta enviada", waiting: "Esperando respuesta", saving: "Guardando..." }
            : { sent: "Antwort gesendet", waiting: "Auf Antwort warten", saving: "Wird gespeichert..." };
  const supabase = await createClient();
  const { data } = await supabase.storage.from("documents").createSignedUrl(document.file_path, 600);
  const caseItem = document.case_id ? await getCaseById(document.case_id) : null;
  const actionModeLabel = getActionModeLabel(analysis?.action_mode ?? null, locale);
  const pageCount = Math.max(analysis?.page_count ?? 1, 1);
  const hasLimitReached = !analysis?.summary_simple && !!usageSummary && hasReachedAnalysisLimit(usageSummary);

  return (
    <div className="space-y-6">
      <section className="space-y-3 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="accent">{copy.documents.badge}</StatusBadge>
          <StatusBadge tone="neutral">
            {pageCount} {trustCopy.pageCountSuffix}
          </StatusBadge>
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">{document.original_filename}</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          {analysis?.summary_simple ? copy.documents.introReady : copy.documents.introPending}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="space-y-6">
          {analysis?.summary_simple ? (
            <>
              <Card className="space-y-4 border-[var(--line-strong)] bg-[var(--surface-strong)] p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-[var(--muted)]">{copy.documents.topBox}</p>
                    <h2 className="mt-1 text-xl font-semibold">{copy.documents.topTitle}</h2>
                  </div>
                  <StatusBadge tone={analysis.is_action_required ? "accent" : "neutral"}>
                    {analysis.is_action_required === null
                      ? copy.urgency.unclear
                      : analysis.is_action_required
                        ? copy.documents.reactionNeeded
                        : copy.documents.noDirectPressure}
                  </StatusBadge>
                </div>
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.common.deadline}</p>
                    <p className="mt-2 text-sm font-semibold">
                      {analysis.deadline_date ? new Date(analysis.deadline_date).toLocaleDateString(dateLocale) : copy.common.noClearDeadline}
                    </p>
                  </div>
                  <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.common.urgency}</p>
                    <p className="mt-2 text-sm font-semibold">{getUrgencyLabel(analysis.urgency, locale)}</p>
                  </div>
                  <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.common.sender}</p>
                    <p className="mt-2 text-sm font-semibold">{analysis.sender ?? copy.common.unknown}</p>
                  </div>
                  <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.common.subject}</p>
                    <p className="mt-2 text-sm font-semibold">{analysis.subject ?? copy.common.unknown}</p>
                  </div>
                  <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                    <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{trustCopy.pageCountSuffix}</p>
                    <p className="mt-2 text-sm font-semibold">
                      {pageCount} {trustCopy.pageCountSuffix}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="space-y-4 p-5">
                <div>
                  <h2 className="font-semibold">{copy.documents.keyPoints}</h2>
                  <p className="text-sm text-[var(--muted)]">{copy.documents.keyPointsText}</p>
                </div>
                <div className="grid gap-3 lg:grid-cols-2">
                  {(analysis.key_points ?? []).map((point, index) => (
                    <div key={`${point}-${index}`} className="rounded-[20px] border border-[var(--line)] bg-white px-4 py-3 text-sm font-medium">
                      {point}
                    </div>
                  ))}
                </div>
                {(analysis.highlight_terms ?? []).length ? (
                  <div className="flex flex-wrap gap-2">
                    {analysis.highlight_terms?.map((term, index) => (
                      <StatusBadge key={`${term}-${index}`} tone="accent">
                        {term}
                      </StatusBadge>
                    ))}
                  </div>
                ) : null}
              </Card>

              {(analysis.important_references ?? []).length ? (
                <Card className="space-y-4 p-5">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-[var(--background-strong)] p-3 text-[var(--foreground)]">
                      <FileSearch className="h-5 w-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold">{trustCopy.referencesTitle}</h2>
                      <p className="text-sm text-[var(--muted)]">{trustCopy.referencesText}</p>
                    </div>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-2">
                    {analysis.important_references?.map((reference, index) => (
                      <div key={`${reference.label}-${index}`} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{reference.label}</p>
                          <StatusBadge tone="neutral">
                            {trustCopy.pageLabel} {reference.page}
                          </StatusBadge>
                        </div>
                        <p className="mt-2 text-sm font-medium">{reference.value}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              <Card className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[var(--background-strong)] p-3 text-[var(--foreground)]">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{copy.documents.explainTitle}</h2>
                    <p className="text-sm text-[var(--muted)]">{copy.documents.explainText}</p>
                  </div>
                </div>
                <DocumentSummaryTabs
                  shortText={analysis.summary_simple_short ?? analysis.summary_simple}
                  longText={analysis.summary_simple_long ?? analysis.summary_simple}
                  highlightTerms={analysis.highlight_terms ?? []}
                  difficultTerms={analysis.difficult_terms ?? []}
                  shortLabel={copy.common.shortExplained}
                  longLabel={copy.common.moreDetails}
                />
              </Card>

              {(analysis.page_summaries ?? []).length ? (
                <Card className="space-y-4 p-5">
                  <div>
                    <h2 className="font-semibold">{trustCopy.pageSummaryTitle}</h2>
                    <p className="text-sm text-[var(--muted)]">{trustCopy.pageSummaryText}</p>
                  </div>
                  <div className="grid gap-3 lg:grid-cols-2">
                    {analysis.page_summaries?.map((item) => (
                      <div key={item.page} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                        <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
                          {trustCopy.pageLabel} {item.page}
                        </p>
                        <p className="mt-2 text-sm leading-6">{item.summary}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              ) : null}

              <Card id="next-steps" className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[var(--background-strong)] p-3 text-[var(--foreground)]">
                    <CalendarClock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{copy.documents.nextStepsTitle}</h2>
                    <p className="text-sm text-[var(--muted)]">{copy.documents.nextStepsText}</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {analysis.next_steps?.length ? (
                    analysis.next_steps.map((step, index) => (
                      <li key={`${step}-${index}`} className="rounded-[20px] border border-[var(--line)] bg-white px-4 py-3 text-sm leading-6">
                        {step}
                      </li>
                    ))
                  ) : (
                    <li className="rounded-[20px] border border-[var(--line)] bg-white px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                      {copy.documents.noNextStep}
                    </li>
                  )}
                </ul>
              </Card>

              <Card className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[rgba(197,60,60,0.08)] p-3 text-[var(--danger)]">
                    <ShieldAlert className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{copy.documents.ifIgnoredTitle}</h2>
                    <p className="text-sm text-[var(--muted)]">{copy.documents.ifIgnoredText}</p>
                  </div>
                </div>
                <p className="text-sm leading-7 text-[var(--foreground)]">
                  {analysis.risks_if_ignored ?? copy.documents.noClearConsequence}
                </p>
              </Card>
            </>
          ) : (
            <Card className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[var(--background-strong)] p-3 text-[var(--foreground)]">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-semibold">{copy.documents.understandTitle}</h2>
                  <p className="text-sm text-[var(--muted)]">{copy.documents.understandText}</p>
                </div>
              </div>
              <div className="rounded-[20px] border border-[var(--line)] bg-white p-4 text-sm leading-6 text-[var(--muted)]">
                <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
                  <AlertTriangle className="h-4 w-4" />
                  {copy.documents.beforeAnalysis}
                </div>
                <p className="mt-2">{copy.documents.beforeAnalysisText}</p>
              </div>
              <AnalyzeDocumentForm
                documentId={document.id}
                submitLabel={copy.documents.analyzeDocument}
                loadingLabel={copy.documents.analyzingDocument}
                disabled={hasLimitReached}
                helperText={hasLimitReached ? usageCopy.limitReached : undefined}
              />
              <Button variant="secondary" className="w-full" disabled>
                {copy.documents.createReply}
              </Button>
            </Card>
          )}
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <Card className="space-y-5 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{getDocumentTypeLabel(document.mime_type, document.original_filename)}</p>
                <p className="text-sm text-[var(--muted)]">
                  {copy.common.dateUploaded} {new Date(document.created_at).toLocaleString(dateLocale)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={document.status === "erledigt" ? "success" : document.status === "warten" ? "warning" : "neutral"}>
                {getDocumentStatusLabel(document.status, locale)}
              </StatusBadge>
              <StatusBadge tone={analysis?.summary_simple ? "accent" : "neutral"}>
                {analysis?.summary_simple ? copy.common.analysisAvailable : copy.common.analysisPending}
              </StatusBadge>
              <StatusBadge tone="neutral">
                {pageCount} {trustCopy.pageCountSuffix}
              </StatusBadge>
            </div>

            {data?.signedUrl ? (
              <a
                href={data.signedUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-5 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-strong)]"
              >
                <Download className="mr-2 h-4 w-4" />
                {copy.common.openDocument}
              </a>
            ) : (
              <p className="text-sm text-[var(--danger)]">{copy.documents.noDownloadLink}</p>
            )}
          </Card>

          {caseItem ? (
            <Card className="space-y-4 p-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-[var(--background-strong)] p-3 text-[var(--foreground)]">
                  <FolderOpen className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-medium">{caseItem.title}</p>
                  <p className="text-sm text-[var(--muted)]">{caseItem.organization ?? caseText.unknownOrganization}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusBadge tone={caseItem.status === "done" ? "success" : caseItem.status === "waiting" ? "warning" : "accent"}>
                  {getCaseStatusLabel(caseItem.status, locale)}
                </StatusBadge>
                <StatusBadge tone="neutral">{caseText.caseLabel}</StatusBadge>
              </div>
              <Link
                href={`/app/cases/${caseItem.id}` as Route}
                className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
              >
                {caseText.timeline}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Link>
            </Card>
          ) : null}

          {analysis?.summary_simple ? (
            <>
              {(actionModeLabel || analysis.action_location_name || analysis.action_location_address || analysis.action_url) ? (
                <Card className="space-y-4 p-5">
                  <h2 className="font-semibold">{copy.documents.whereToDoIt}</h2>
                  <div className="space-y-3 text-sm">
                    {actionModeLabel ? (
                      <div>
                        <p className="text-[var(--muted)]">{copy.documents.kind}</p>
                        <p className="font-medium">{actionModeLabel}</p>
                      </div>
                    ) : null}
                    {analysis.action_location_name ? (
                      <div>
                        <p className="text-[var(--muted)]">{copy.documents.office}</p>
                        <p className="font-medium">{analysis.action_location_name}</p>
                      </div>
                    ) : null}
                    {analysis.action_location_address ? (
                      <div>
                        <p className="text-[var(--muted)]">{copy.documents.address}</p>
                        <p className="font-medium">{analysis.action_location_address}</p>
                      </div>
                    ) : null}
                    {analysis.action_url ? (
                      <a href={analysis.action_url} target="_blank" rel="noreferrer" className="text-[var(--accent)]">
                        {copy.documents.openOfficialLink}
                      </a>
                    ) : null}
                  </div>
                </Card>
              ) : null}

              <Card className="space-y-4 p-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[var(--background-strong)] p-3 text-[var(--foreground)]">
                    <SendHorizonal className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{copy.documents.nextStep}</h2>
                    <p className="text-sm text-[var(--muted)]">{copy.documents.nextStepText}</p>
                  </div>
                </div>
                <Link
                  href={`/app/documents/${document.id}/reply` as Route}
                  className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-5 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-strong)]"
                >
                  {copy.documents.createReply}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
                <AnalyzeDocumentForm
                  documentId={document.id}
                  submitLabel={copy.documents.analyzeDocument}
                  loadingLabel={copy.documents.analyzingDocument}
                  disabled={hasLimitReached}
                  helperText={hasLimitReached ? usageCopy.limitReached : undefined}
                />
                <div className="grid gap-3 sm:grid-cols-2">
                  <DocumentSentForm documentId={document.id} label={statusActionCopy.sent} savingLabel={statusActionCopy.saving} />
                  <DocumentWaitingForm documentId={document.id} label={statusActionCopy.waiting} savingLabel={statusActionCopy.saving} />
                </div>
              </Card>
            </>
          ) : null}
        </aside>
      </div>
    </div>
  );
}
