import Link from "next/link";
import { ArrowRight, FileText, Target, Upload } from "lucide-react";
import type { Route } from "next";

import { CaseCard } from "@/components/app/case-card";
import { HomeGreeting } from "@/components/app/home-greeting";
import { TaskCard } from "@/components/app/task-card";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getHomeGreeting } from "@/lib/home-greeting";
import { getGoalsCopy } from "@/lib/goals-ui";
import { getCopy, getDateLocale, getReminderCopy, getUsageCopy } from "@/lib/i18n";
import { getCasesWithActionNeeded, getGoals, getProfile, getRecentDocuments, getTaskReminderBuckets, getUsageSummaryForCurrentUser } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

function ReminderSection({
  title,
  tasks,
  locale,
  emptyText
}: {
  title: string;
  tasks: Awaited<ReturnType<typeof getTaskReminderBuckets>>["today"];
  locale: string;
  emptyText: string;
}) {
  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold">{title}</h3>
        <StatusBadge tone={tasks.length ? "accent" : "neutral"}>{tasks.length}</StatusBadge>
      </div>
      {tasks.length ? (
        <div className="space-y-3">
          {tasks.slice(0, 3).map((task) => (
            <TaskCard key={task.id} task={task} compact locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-sm leading-6 text-[var(--muted)]">{emptyText}</p>
      )}
    </Card>
  );
}

export default async function AppHomePage() {
  const [profile, documents, reminderBuckets, usage, cases, goals] = await Promise.all([
    getProfile(),
    getRecentDocuments(),
    getTaskReminderBuckets(),
    getUsageSummaryForCurrentUser(),
    getCasesWithActionNeeded(),
    getGoals()
  ]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getCopy(locale);
  const goalsCopy = getGoalsCopy(locale);
  const reminderCopy = getReminderCopy(locale);
  const usageCopy = getUsageCopy(locale);
  const dateLocale = getDateLocale(locale);
  const greeting = getHomeGreeting(locale, profile?.full_name ?? null);

  return (
    <div className="space-y-10">
      <HomeGreeting
        locale={locale}
        greeting={greeting.greeting}
        initialSupportLine={greeting.supportLine}
        supportLines={greeting.supportLines}
      />

      <div className="grid gap-8 2xl:grid-cols-[minmax(0,1.15fr)_minmax(320px,0.85fr)]">
        <div className="space-y-12">
          <div className="grid gap-5 xl:grid-cols-2">
            <Link href="/app/upload">
              <Card className="border-[var(--line-strong)] bg-[var(--surface-strong)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <StatusBadge tone="accent">{copy.home.newLetter}</StatusBadge>
                    <h2 className="text-xl font-semibold">{copy.home.uploadTitle}</h2>
                    <p className="text-sm leading-6 text-[var(--muted)]">{copy.home.uploadText}</p>
                  </div>
                  <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                    <Upload className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center text-sm font-medium text-[var(--accent)]">
                  {copy.home.uploadTitle}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>

            <Link href={"/app/goals" as Route}>
              <Card className="border-[var(--line-strong)] bg-[var(--surface-strong)] p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <StatusBadge tone="success">{goalsCopy.navLabel}</StatusBadge>
                    <h2 className="text-xl font-semibold">{goalsCopy.plannerTitle}</h2>
                    <p className="text-sm leading-6 text-[var(--muted)]">
                      {goals.length ? `${goals.length} ${goalsCopy.navLabel.toLowerCase()}` : goalsCopy.noGoals}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-[rgba(123,191,159,0.16)] p-3 text-[var(--success)]">
                    <Target className="h-5 w-5" />
                  </div>
                </div>
                <div className="mt-6 inline-flex items-center text-sm font-medium text-[var(--success)]">
                  {goalsCopy.navLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </div>
              </Card>
            </Link>
          </div>

          <section className="space-y-5 pt-2">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">{copy.home.openDeadlines}</h2>
              <StatusBadge tone="neutral">
                {reminderBuckets.overdue.length + reminderBuckets.today.length + reminderBuckets.soon.length + reminderBuckets.open.length}
              </StatusBadge>
            </div>
            <div className="grid gap-4 xl:grid-cols-3">
              <ReminderSection title={reminderCopy.overdue} tasks={reminderBuckets.overdue} locale={locale} emptyText={reminderCopy.noItems} />
              <ReminderSection title={reminderCopy.dueToday} tasks={reminderBuckets.today} locale={locale} emptyText={reminderCopy.noItems} />
              <ReminderSection title={reminderCopy.dueSoon} tasks={reminderBuckets.soon} locale={locale} emptyText={reminderCopy.noItems} />
            </div>
          </section>

          <section className="space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Fälle mit Handlungsbedarf</h2>
              <Link href={"/app/cases" as Route} className="text-sm font-medium text-[var(--accent)]">
                Alle Fälle
              </Link>
            </div>
            {cases.length ? (
              <div className="grid gap-4 lg:grid-cols-2">
                {cases.map((caseItem) => (
                  <CaseCard key={caseItem.id} caseItem={caseItem} locale={locale} />
                ))}
              </div>
            ) : (
              <Card className="p-5 text-sm text-[var(--muted)]">Sobald BureauCare Zusammenhänge erkennt, erscheinen deine Fälle hier automatisch.</Card>
            )}
          </section>

          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{copy.home.latestDocuments}</h2>
              <span className="text-sm text-[var(--muted)]">
                {documents.length} {copy.home.entries}
              </span>
            </div>
            <div className="grid gap-3 lg:auto-rows-fr lg:grid-cols-2">
              {documents.length ? (
                documents.map((document) => (
                  <Link key={document.id} href={`/app/documents/${document.id}` as Route}>
                    <Card className="flex h-full items-center justify-between gap-3 p-4">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="break-words font-medium">{document.original_filename}</p>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-[var(--muted)]">
                            <span>{new Date(document.created_at).toLocaleDateString(dateLocale)}</span>
                            <StatusBadge tone="success">{copy.common.uploaded}</StatusBadge>
                          </div>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-[var(--muted)]" />
                    </Card>
                  </Link>
                ))
              ) : (
                <Card className="p-4 text-sm text-[var(--muted)] lg:col-span-2">{copy.home.noDocuments}</Card>
              )}
            </div>
          </section>
        </div>

        <aside className="space-y-4 2xl:sticky 2xl:top-6">
          {usage ? (
            <Card className="space-y-4 border-[var(--line-strong)] bg-[var(--surface-strong)] p-5">
              <div className="space-y-1">
                <h2 className="text-lg font-semibold">{usageCopy.title}</h2>
                <p className="text-sm leading-6 text-[var(--muted)]">{usageCopy.note}</p>
              </div>
              <div className="grid gap-3">
                <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                  <p className="text-sm font-semibold">
                    {usage.analysisCount} / {usage.analysisLimit}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{usageCopy.analyses}</p>
                </div>
                <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                  <p className="text-sm font-semibold">
                    {usage.replyCount} / {usage.replyLimit}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{usageCopy.replies}</p>
                </div>
                <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                  <p className="text-sm font-semibold">{goals.length}</p>
                  <p className="mt-1 text-sm text-[var(--muted)]">{goalsCopy.navLabel}</p>
                </div>
              </div>
            </Card>
          ) : null}

          <ReminderSection title={reminderCopy.openLater} tasks={reminderBuckets.open} locale={locale} emptyText={reminderCopy.noItems} />
          <ReminderSection title={reminderCopy.completed} tasks={reminderBuckets.done} locale={locale} emptyText={reminderCopy.noItems} />
        </aside>
      </div>
    </div>
  );
}
