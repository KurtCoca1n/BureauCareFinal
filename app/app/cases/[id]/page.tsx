import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FolderOpen, Plus } from "lucide-react";
import type { Route } from "next";

import { CaseDeleteForm, CaseDoneAndDeleteForm, CaseDoneForm } from "@/components/app/case-status-form";
import { TaskCard } from "@/components/app/task-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { parseCaseBrief } from "@/lib/case-brief";
import {
  getCaseEventLabel,
  getCaseOverviewLabels,
  getCaseStatusLabel,
  getCaseText,
  getDocumentStatusLabel
} from "@/lib/case-ui";
import { getDateLocale } from "@/lib/i18n";
import { getCaseById, getCaseEvents, getDocumentsByCaseId, getProfile, getTasksByCaseId } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

function caseDetailStatusTone(status: string) {
  if (status === "done") return "success" as const;
  if (status === "waiting") return "warning" as const;
  if (status === "in_progress") return "accent" as const;
  return "neutral" as const;
}

export default async function CaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [caseItem, documents, tasks, events, profile] = await Promise.all([
    getCaseById(id),
    getDocumentsByCaseId(id),
    getTasksByCaseId(id),
    getCaseEvents(id),
    getProfile()
  ]);

  if (!caseItem) {
    notFound();
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const dateLocale = getDateLocale(locale as never);
  const caseText = getCaseText(locale);
  const overview = getCaseOverviewLabels(locale);
  const brief = parseCaseBrief(caseItem.case_brief);
  const primaryDocId = brief?.primary_document_id;
  const primaryDoc = primaryDocId ? documents.find((d) => d.id === primaryDocId) ?? documents[0] : documents[0];

  return (
    <div className="space-y-6">
      <section className="space-y-3 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="accent">{caseText.caseLabel}</StatusBadge>
          <StatusBadge tone={caseDetailStatusTone(caseItem.status)}>
            {getCaseStatusLabel(caseItem.status, locale)}
          </StatusBadge>
        </div>
        <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{caseItem.title}</h1>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="space-y-6">
          {brief ? (
            <Card className="space-y-4 border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,250,249,0.85))] p-5 sm:p-6">
              <h2 className="text-lg font-semibold text-[var(--foreground)]">{overview.title}</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {brief.document_kind_label ? (
                  <div className="rounded-[20px] border border-[var(--line)] bg-white/95 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{overview.kind}</p>
                    <p className="mt-2 text-sm font-semibold leading-snug">{brief.document_kind_label}</p>
                  </div>
                ) : null}
                <div className="rounded-[20px] border border-[var(--line)] bg-white/95 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{overview.uploaded}</p>
                  <p className="mt-2 text-sm font-semibold leading-snug">
                    {brief.document_uploaded_at
                      ? new Date(brief.document_uploaded_at).toLocaleDateString(dateLocale)
                      : overview.none}
                  </p>
                </div>
                {brief.analyzed_at ? (
                  <div className="rounded-[20px] border border-[var(--line)] bg-white/95 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{overview.analyzed}</p>
                    <p className="mt-2 text-sm font-semibold leading-snug">
                      {new Date(brief.analyzed_at).toLocaleDateString(dateLocale)}
                    </p>
                  </div>
                ) : null}
                {brief.deadline_date ? (
                  <div className="rounded-[20px] border border-[var(--line)] bg-white/95 p-4">
                    <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{overview.deadline}</p>
                    <p className="mt-2 text-sm font-semibold leading-snug">
                      {new Date(brief.deadline_date).toLocaleDateString(dateLocale)}
                    </p>
                  </div>
                ) : null}
              </div>
              {brief.summary_short ? (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{overview.summary}</p>
                  <p className="text-sm leading-relaxed text-[var(--foreground)]/95">{brief.summary_short}</p>
                </div>
              ) : null}
              {(brief.next_steps_preview?.length ?? 0) > 0 ? (
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{overview.next}</p>
                  <ul className="space-y-2">
                    {(brief.next_steps_preview ?? []).map((step) => (
                      <li key={step} className="rounded-[18px] border border-[var(--line)] bg-white/95 px-3 py-2 text-sm leading-snug">
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
              {brief.risk_hint ? (
                <div className="space-y-2 rounded-[20px] border border-dashed border-[var(--line)] bg-white/80 p-4">
                  <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{overview.risk}</p>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{brief.risk_hint}</p>
                </div>
              ) : null}
              {primaryDoc ? (
                <Link
                  href={`/app/documents/${primaryDoc.id}` as Route}
                  className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-strong)]"
                >
                  {overview.openDoc}
                </Link>
              ) : null}
            </Card>
          ) : null}
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{caseText.timeline}</h2>
              <StatusBadge tone="neutral">{events.length}</StatusBadge>
            </div>
            <div className="space-y-4">
              {events.length ? (
                events.map((event) => (
                  <div key={event.id} className="flex gap-4 rounded-[24px] border border-[var(--line)] bg-white p-4">
                    <div className="mt-1 h-3 w-3 rounded-full bg-[var(--accent)]" />
                    <div className="space-y-1">
                      <p className="font-medium">{getCaseEventLabel(event.event_type, locale)}</p>
                      {event.note ? <p className="text-sm leading-6 text-[var(--muted)]">{event.note}</p> : null}
                      <p className="text-xs text-[var(--muted)]">{new Date(event.event_date).toLocaleString(dateLocale)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">{caseText.noEvents}</p>
              )}
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{caseText.documentsInCase}</h2>
              <StatusBadge tone="neutral">{documents.length}</StatusBadge>
            </div>
            <div className="grid gap-3">
              {documents.length ? (
                documents.map((document) => (
                  <Link key={document.id} href={`/app/documents/${document.id}` as Route}>
                    <div className="flex items-center justify-between rounded-[22px] border border-[var(--line)] bg-white p-4">
                      <div>
                        <p className="font-medium">{document.original_filename}</p>
                        <p className="mt-1 text-sm text-[var(--muted)]">{document.subject ?? document.sender ?? "Dokument"}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <StatusBadge tone="neutral">{getDocumentStatusLabel(document.status, locale)}</StatusBadge>
                        <ArrowRight className="h-4 w-4 text-[var(--muted)]" />
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-[var(--muted)]">{caseText.noDocuments}</p>
              )}
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{caseText.openTasks}</h2>
              <StatusBadge tone="neutral">{tasks.filter((task) => task.status !== "done").length}</StatusBadge>
            </div>
            {tasks.length ? (
              <div className="grid gap-4">
                {tasks.map((task) => (
                  <TaskCard key={task.id} task={task} locale={locale} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-[var(--muted)]">{caseText.noTasks}</p>
            )}
          </Card>
        </div>

        <aside className="space-y-6 xl:sticky xl:top-6">
          <Card className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                <FolderOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{caseItem.organization ?? caseText.unknownOrganization}</p>
                <p className="text-sm text-[var(--muted)]">
                  {caseText.createdAt} {new Date(caseItem.created_at).toLocaleDateString(dateLocale)}
                </p>
              </div>
            </div>
            <div className="grid gap-3">
              <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Status</p>
                <p className="mt-2 text-sm font-semibold">{getCaseStatusLabel(caseItem.status, locale)}</p>
              </div>
              <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{caseText.latestActivity}</p>
                <p className="mt-2 text-sm font-semibold">
                  {events[0] ? new Date(events[0].event_date).toLocaleDateString(dateLocale) : new Date(caseItem.updated_at).toLocaleDateString(dateLocale)}
                </p>
              </div>
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="font-semibold">{caseText.actions}</h2>
            <Link
              href={`/app/upload?caseId=${caseItem.id}` as Route}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-[var(--accent)] px-5 text-sm font-medium text-white shadow-[var(--shadow-soft)]"
            >
              <Plus className="mr-2 h-4 w-4" />
              {caseText.addDocument}
            </Link>
            {caseItem.status !== "done" ? <CaseDoneForm caseId={caseItem.id} label={caseText.markCaseDone} /> : null}
            {caseItem.status !== "done" ? (
              <CaseDoneAndDeleteForm caseId={caseItem.id} label={caseText.doneAndDelete} confirmText={caseText.confirmDoneAndDelete} />
            ) : null}
            <CaseDeleteForm caseId={caseItem.id} label={caseText.deleteCase} confirmText={caseText.confirmCaseDelete} />
          </Card>
        </aside>
      </div>
    </div>
  );
}
