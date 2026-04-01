import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, FolderOpen, Plus } from "lucide-react";
import type { Route } from "next";

import { CaseDoneForm } from "@/components/app/case-status-form";
import { TaskCard } from "@/components/app/task-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCaseEventLabel, getCaseStatusLabel, getCaseText, getDocumentStatusLabel } from "@/lib/case-ui";
import { getDateLocale } from "@/lib/i18n";
import { getCaseById, getCaseEvents, getDocumentsByCaseId, getProfile, getTasksByCaseId } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

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

  return (
    <div className="space-y-6">
      <section className="space-y-3 pt-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="accent">{caseText.caseLabel}</StatusBadge>
          <StatusBadge tone={caseItem.status === "done" ? "success" : caseItem.status === "waiting" ? "warning" : "neutral"}>
            {getCaseStatusLabel(caseItem.status, locale)}
          </StatusBadge>
        </div>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">{caseItem.title}</h1>
        <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">
          {caseText.organization}: {caseItem.organization ?? caseText.unknownOrganization}
        </p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_360px]">
        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold">{caseText.timeline}</h2>
                <p className="text-sm text-[var(--muted)]">{caseText.timelineText}</p>
              </div>
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
          </Card>
        </aside>
      </div>
    </div>
  );
}
