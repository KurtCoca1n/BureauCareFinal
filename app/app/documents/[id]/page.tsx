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
import { ContractClauseExplorer } from "@/components/app/contract-clause-explorer";
import { DocumentSentForm, DocumentWaitingForm } from "@/components/app/case-status-form";
import { ContractActionsPanel } from "@/components/app/contract-actions-panel";
import { ContractAnalysisPanel } from "@/components/app/contract-analysis-panel";
import { ContractQuestionGenerator } from "@/components/app/contract-question-generator";
import { DocumentSummaryTabs } from "@/components/app/document-summary-tabs";
import { NearbyHelpLinks } from "@/components/app/nearby-help-links";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCaseStatusLabel, getCaseText, getDocumentStatusLabel } from "@/lib/case-ui";
import { normalizeDocumentKindDetection } from "@/lib/document-kind";
import { looksLikePotentiallyIncompleteDocument } from "@/lib/document-name";
import { getDocumentTypeLabel } from "@/lib/file-types";
import { getCopy, getDateLocale, getDocumentTrustCopy, getUsageCopy } from "@/lib/i18n";
import { getGeneralExplainPreAnalyzeBanner, getOptionalContractDepthHint } from "@/lib/general-explain-flow-ui";
import { getNoticeScannerPreAnalyzeBanner } from "@/lib/notice-scanner-flow-ui";
import {
  getCaseById,
  getContractQuestionDraftsByDocumentId,
  getDocumentAnalysisByDocumentId,
  getDocumentById,
  getProfile,
  getUserSettings,
  getUsageSummaryForCurrentUser
} from "@/lib/queries";
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

export default async function DocumentDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { id } = await params;
  const resolvedSearch = searchParams ? await searchParams : {};
  const scannerParam = resolvedSearch.scanner;
  const flowParam = resolvedSearch.flow;
  const showNoticeScannerPrep =
    (Array.isArray(scannerParam) ? scannerParam[0] : scannerParam) === "notice";
  const showGeneralExplainPrep =
    (Array.isArray(flowParam) ? flowParam[0] : flowParam) === "explain" && !showNoticeScannerPrep;
  const [document, analysis, profile, usageSummary, contractQuestionDrafts, userSettings] = await Promise.all([
    getDocumentById(id),
    getDocumentAnalysisByDocumentId(id),
    getProfile(),
    getUsageSummaryForCurrentUser(),
    getContractQuestionDraftsByDocumentId(id),
    getUserSettings()
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
  const likelyMissingPages = pageCount === 1 && looksLikePotentiallyIncompleteDocument(analysis?.raw_extracted_text);
  const hasLimitReached = !analysis?.summary_simple && !!usageSummary && hasReachedAnalysisLimit(usageSummary);
  const prepAnalyzeBanner = showNoticeScannerPrep
    ? getNoticeScannerPreAnalyzeBanner(locale)
    : showGeneralExplainPrep
      ? getGeneralExplainPreAnalyzeBanner(locale)
      : null;
  const kindDetection = normalizeDocumentKindDetection(document.kind_detection);
  const contractDepthHint =
    analysis?.summary_simple && analysis ? getOptionalContractDepthHint(locale, kindDetection, analysis) : null;

  return (
    <div className="space-y-6">
      <section className="space-y-3 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="accent">{copy.documents.badge}</StatusBadge>
          <StatusBadge tone="neutral">
            {pageCount} {trustCopy.pageCountSuffix}
          </StatusBadge>
        </div>
        <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{document.original_filename}</h1>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_360px]">
        <div className="space-y-6">
          {analysis?.summary_simple ? (
            <>
              <ContractAnalysisPanel analysis={analysis} locale={locale} />
              <ContractActionsPanel
                document={document}
                analysis={analysis}
                kindDetection={kindDetection}
                locale={locale}
              />
              <div id="contract-clause-explorer" className="scroll-mt-24">
                <ContractClauseExplorer clauses={analysis.contract_flagged_clauses ?? []} documentId={document.id} locale={locale} />
              </div>
              {contractDepthHint ? (
                <Card className="space-y-3 border border-dashed border-[var(--line)] bg-[rgba(248,252,251,0.65)] p-4 sm:p-5">
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{contractDepthHint.text}</p>
                  <Link
                    href="#contract-clause-explorer"
                    className="inline-flex text-sm font-semibold text-[var(--accent)] hover:underline"
                  >
                    {contractDepthHint.anchorLabel}
                  </Link>
                </Card>
              ) : null}
              <ContractQuestionGenerator
                documentId={document.id}
                locale={locale}
                analysis={analysis}
                existingDrafts={contractQuestionDrafts}
              />

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

              {likelyMissingPages ? (
                <Card className="space-y-4 border-[rgba(242,166,90,0.22)] bg-[rgba(242,166,90,0.08)] p-5">
                  <h2 className="font-semibold">
                    {locale === "en"
                      ? "This document may have more pages."
                      : locale === "tr"
                        ? "Bu belgenin başka sayfaları olabilir."
                        : locale === "uk"
                          ? "Схоже, у цього документа можуть бути ще сторінки."
                          : locale === "es"
                            ? "Parece que este documento podría tener más páginas."
                            : "Es sieht so aus, als könnte dieses Dokument noch weitere Seiten haben."}
                  </h2>
                  <p className="text-sm leading-6 text-[var(--muted)]">
                    {locale === "en"
                      ? "If you still have additional pages, upload them now so BureauCare can consider everything together."
                      : locale === "tr"
                        ? "Eğer başka sayfalar da varsa, BureauCare hepsini birlikte değerlendirebilsin diye şimdi yükleyebilirsin."
                        : locale === "uk"
                          ? "Якщо в тебе є ще сторінки, завантаж їх зараз, щоб BureauCare міг врахувати все разом."
                          : locale === "es"
                            ? "Si todavía tienes más páginas, súbelas ahora para que BureauCare pueda tenerlo todo en cuenta."
                            : "Wenn du noch weitere Seiten hast, lade sie jetzt nach, damit BureauCare alles gemeinsam berücksichtigen kann."}
                  </p>
                  <Link
                    href={(document.case_id ? `/app/upload?caseId=${document.case_id}` : "/app/upload") as Route}
                    className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
                  >
                    {locale === "en" ? "Upload more pages" : locale === "tr" ? "Daha fazla sayfa yükle" : locale === "uk" ? "Завантажити ще сторінки" : locale === "es" ? "Subir más páginas" : "Weitere Seiten hochladen"}
                  </Link>
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
            <>
              {prepAnalyzeBanner ? (
                <Card className="space-y-3 border border-[rgba(95,163,163,0.2)] bg-[rgba(238,246,245,0.55)] p-5 sm:p-6">
                  <div className="flex items-center gap-2">
                    <StatusBadge tone="accent">{prepAnalyzeBanner.title}</StatusBadge>
                  </div>
                  <div className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">
                    {prepAnalyzeBanner.lines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </Card>
              ) : null}
              <Card id="document-analyze" className="scroll-mt-24 space-y-4 p-5">
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
              <Link
                href={`/app/documents/${document.id}/decision` as Route}
                className="block text-center text-sm font-medium text-[var(--accent)] hover:underline"
              >
                {locale === "de"
                  ? "Einordnung & nächste Schritte nochmal ansehen"
                  : "Review sorting and next steps again"}
              </Link>
              <Button variant="secondary" className="w-full" disabled>
                {copy.documents.createReply}
              </Button>
            </Card>
            </>
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
                <StatusBadge
                  tone={
                    caseItem.status === "done"
                      ? "success"
                      : caseItem.status === "waiting"
                        ? "warning"
                        : caseItem.status === "in_progress"
                          ? "accent"
                          : "neutral"
                  }
                >
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
                  <NearbyHelpLinks
                    locale={locale}
                    locationName={analysis.action_location_name}
                    address={analysis.action_location_address}
                    contextText={`${analysis.subject ?? ""} ${(analysis.next_steps ?? []).join(" ")}`}
                    actionMode={analysis.action_mode}
                    actionUrl={analysis.action_url}
                    initialLocation={
                      userSettings?.location_preferences.latitude != null && userSettings.location_preferences.longitude != null
                        ? {
                            latitude: userSettings.location_preferences.latitude,
                            longitude: userSettings.location_preferences.longitude,
                            grantedAt: userSettings.location_preferences.granted_at ?? new Date().toISOString()
                          }
                        : null
                    }
                  />
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
