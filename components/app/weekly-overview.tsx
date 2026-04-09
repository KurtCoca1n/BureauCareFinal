"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CalendarClock, Check, ChevronDown, ChevronUp, ClipboardList, Flag } from "lucide-react";

import { TaskCompleteForm } from "@/components/app/task-complete-form";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrafficLightBadge } from "@/components/ui/traffic-light-badge";
import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import {
  calendarDaysUntilDue,
  computeWeeklyOverviewStats,
  formatWeeklyDuePhrase,
  getWeeklyOverviewMicrocopy,
  sortWeeklyOverviewItems,
  weeklyOverviewLabels,
  type WeeklyOverviewItem,
  type WeeklyOverviewItemType
} from "@/lib/weekly-overview";
import { cn } from "@/lib/utils";

function typeIcon(type: WeeklyOverviewItemType) {
  switch (type) {
    case "deadline":
      return Flag;
    case "appointment":
      return CalendarClock;
    default:
      return ClipboardList;
  }
}

function stripWidthClass(priority: WeeklyOverviewItem["priority"], completed: boolean) {
  if (completed) return "w-1";
  return priority === "high" ? "w-1.5" : "w-1";
}

function priorityStripeClass(priority: WeeklyOverviewItem["priority"], completed: boolean) {
  if (completed) return "bg-[var(--line)]";
  switch (priority) {
    case "high":
      return "bg-[var(--accent)]";
    case "medium":
      return "bg-[rgba(95,163,163,0.5)]";
    default:
      return "bg-[rgba(232,220,207,0.95)]";
  }
}

function isDueSoonOpen(item: WeeklyOverviewItem, reference: Date) {
  if (item.completed || !item.dueDate) return false;
  const d = calendarDaysUntilDue(item.dueDate, reference);
  return d >= 0 && d <= 3;
}

function isOverdueOpen(item: WeeklyOverviewItem, reference: Date) {
  if (item.completed || !item.dueDate) return false;
  return calendarDaysUntilDue(item.dueDate, reference) < 0;
}

type Props = {
  locale: string | null | undefined;
  dateLocale: string;
  items: WeeklyOverviewItem[];
};

function weeklyLang(supported: SupportedLanguage): "de" | "en" {
  if (supported === "en") return "en";
  if (supported === "de") return "de";
  return "en";
}

export function WeeklyOverview({ locale, dateLocale, items }: Props) {
  const lang = weeklyLang(normalizePreferredLanguage(locale));
  const labels = weeklyOverviewLabels(lang);
  const referenceNow = useMemo(() => new Date(), []);

  const [expanded, setExpanded] = useState(false);

  const sorted = useMemo(() => sortWeeklyOverviewItems(items), [items]);

  const stats = useMemo(() => computeWeeklyOverviewStats(items, referenceNow), [items, referenceNow]);

  const microcopy = useMemo(() => getWeeklyOverviewMicrocopy(lang, stats), [lang, stats]);

  const progressPct =
    stats.taskBackedTotal > 0 ? Math.round((stats.taskBackedDone / stats.taskBackedTotal) * 100) : 0;

  const summaryCompact = labels.summaryLine(stats.openCount, stats.criticalCount, stats.appointmentsThisWeekCount);

  return (
    <Card className="border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(168deg,rgba(255,255,255,0.99),rgba(246,250,249,0.88))] p-5 shadow-[0_18px_44px_rgba(43,43,43,0.04)] hover:translate-y-0 hover:shadow-[0_18px_44px_rgba(43,43,43,0.04)] sm:p-7">
      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 space-y-2">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-[1.4rem]">
              {labels.title}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{summaryCompact}</p>
            {stats.taskBackedTotal > 0 ? (
              <p className="text-sm font-medium text-[var(--foreground)]/85">
                {labels.progress(stats.taskBackedDone, stats.taskBackedTotal)}
              </p>
            ) : stats.total === 0 ? (
              <div className="space-y-1 text-sm leading-relaxed text-[var(--muted)]">
                <p>{labels.emptyLine1}</p>
                <p>{labels.emptyLine2}</p>
              </div>
            ) : (
              <p className="text-xs leading-relaxed text-[var(--muted)]/90">{labels.progressTasksOnly}</p>
            )}
          </div>
          <div className="flex flex-shrink-0 flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <StatusBadge tone={stats.openCount ? "accent" : "success"}>{labels.openChip(stats.openCount)}</StatusBadge>
              {stats.criticalCount > 0 ? (
                <StatusBadge tone="warning">{labels.criticalChip(stats.criticalCount)}</StatusBadge>
              ) : null}
              <StatusBadge tone="neutral">{labels.appointmentsChip(stats.appointmentsThisWeekCount)}</StatusBadge>
            </div>
            <Button
              type="button"
              variant="secondary"
              className="w-full min-h-11 justify-center gap-2 sm:w-auto"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="weekly-overview-details"
              id="weekly-overview-toggle"
            >
              {expanded ? (
                <>
                  <ChevronUp className="h-4 w-4 shrink-0" aria-hidden />
                  {labels.collapseDetails}
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4 shrink-0" aria-hidden />
                  {labels.expandDetails}
                </>
              )}
            </Button>
          </div>
        </div>

        {expanded ? (
          <div id="weekly-overview-details" className="flex flex-col gap-6 border-t border-[var(--line)] pt-6 sm:gap-7">
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--muted)]">{labels.subtitle}</p>

            {stats.taskBackedTotal > 0 ? (
              <div className="space-y-2 rounded-[22px] border border-[var(--line)] bg-white/92 px-4 py-3 sm:px-5">
                <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                  <span>{labels.progress(stats.taskBackedDone, stats.taskBackedTotal)}</span>
                  <span className="tabular-nums text-[var(--foreground)]/80">{progressPct}%</span>
                </div>
                <div
                  className="h-1.5 overflow-hidden rounded-full bg-[rgba(232,220,207,0.55)]"
                  role="progressbar"
                  aria-valuenow={stats.taskBackedDone}
                  aria-valuemin={0}
                  aria-valuemax={stats.taskBackedTotal}
                  aria-label={labels.progress(stats.taskBackedDone, stats.taskBackedTotal)}
                >
                  <div
                    className={cn(
                      "h-full rounded-full transition-[width] duration-500 ease-out",
                      progressPct >= 100
                        ? "bg-[linear-gradient(90deg,var(--success-soft),rgba(123,191,159,0.95))]"
                        : "bg-[image:var(--accent-gradient)]"
                    )}
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            ) : null}

            {sorted.length > 0 ? (
              <p
                className={cn(
                  "text-sm font-medium leading-relaxed",
                  stats.openCount === 0 && stats.total > 0 ? "text-[var(--petrol)]" : "text-[var(--foreground)]/88"
                )}
              >
                {microcopy}
              </p>
            ) : null}

            {sorted.length === 0 ? (
              <div className="rounded-[22px] border border-dashed border-[var(--line)] bg-[rgba(247,246,244,0.65)] px-5 py-8 text-center">
                <p className="text-base font-semibold text-[var(--foreground)]">{labels.emptyLine1}</p>
                <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">{labels.emptyLine2}</p>
              </div>
            ) : (
              <ul className="flex flex-col gap-4">
                {sorted.map((item) => {
                  const Icon = typeIcon(item.type);
                  const typeLabel =
                    item.type === "task"
                      ? labels.typeTask
                      : item.type === "deadline"
                        ? labels.typeDeadline
                        : labels.typeAppointment;

                  const soon = isDueSoonOpen(item, referenceNow);
                  const overdue = isOverdueOpen(item, referenceNow);
                  const accentAttention = !item.completed && (item.priority === "high" || soon || overdue);

                  return (
                    <li key={item.id}>
                      <div
                        className={cn(
                          "group relative flex gap-0 overflow-hidden rounded-[22px] border transition duration-200",
                          item.completed
                            ? "border-[var(--line)] bg-[rgba(247,246,244,0.88)] opacity-[0.62] saturate-[0.72] shadow-[0_8px_22px_rgba(43,43,43,0.028)]"
                            : cn(
                                "bg-white/96 shadow-[0_12px_34px_rgba(43,43,43,0.055)]",
                                accentAttention
                                  ? overdue
                                    ? "border-[rgba(95,163,163,0.28)] ring-1 ring-[rgba(95,163,163,0.22)]"
                                    : "border-[rgba(95,163,163,0.26)] ring-1 ring-[rgba(242,166,90,0.18)]"
                                  : "border-[rgba(95,163,163,0.13)] hover:border-[rgba(95,163,163,0.32)] hover:shadow-[0_16px_42px_rgba(43,43,43,0.07)]"
                              )
                        )}
                      >
                        <div
                          className={cn(
                            "shrink-0 self-stretch",
                            stripWidthClass(item.priority, item.completed),
                            priorityStripeClass(item.priority, item.completed)
                          )}
                        />

                        <div className="flex min-w-0 flex-1 flex-col gap-3 p-4 sm:flex-row sm:items-start sm:gap-5 sm:p-5">
                          <div
                            className={cn(
                              "mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl transition-[transform] duration-200",
                              item.completed
                                ? "bg-[var(--background-strong)] text-[var(--muted)]"
                                : cn(
                                    "text-[var(--accent)]",
                                    accentAttention ? "bg-[rgba(242,166,90,0.14)]" : "bg-[rgba(95,163,163,0.1)]",
                                    "group-hover:scale-[1.02]"
                                  )
                            )}
                            aria-hidden
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
                                {typeLabel}
                              </span>
                              <TrafficLightBadge
                                level={item.priority}
                                lang={lang}
                                settled={item.completed}
                              />
                              {item.dueDate && !item.completed ? (
                                <>
                                  {overdue ? (
                                    <StatusBadge tone="accent">{labels.dueHighlightOverdue}</StatusBadge>
                                  ) : soon ? (
                                    <StatusBadge tone="warning">{labels.dueHighlightSoon}</StatusBadge>
                                  ) : null}
                                </>
                              ) : null}
                            </div>
                            <h3
                              className={cn(
                                "text-base font-semibold leading-snug text-[var(--foreground)]",
                                item.completed &&
                                  "text-[var(--muted)] line-through decoration-[var(--line-strong)] decoration-1 underline-offset-2"
                              )}
                            >
                              {item.title}
                            </h3>
                            {item.shortDescription ? (
                              <p
                                className={cn(
                                  "text-sm leading-relaxed text-[var(--muted)]",
                                  item.completed && "opacity-[0.85]"
                                )}
                              >
                                {item.shortDescription}
                              </p>
                            ) : null}
                            {item.tip ? (
                              <p className="text-xs leading-relaxed text-[var(--muted)]/90 italic">{item.tip}</p>
                            ) : null}
                            {item.dueDate ? (
                              <p
                                className={cn(
                                  "text-xs font-semibold",
                                  item.completed ? "text-[var(--muted)]" : "text-[var(--foreground)]/80"
                                )}
                              >
                                {labels.due}:{" "}
                                <span
                                  className={cn(
                                    "font-medium",
                                    overdue && !item.completed ? "text-[var(--accent-strong)]" : "text-[var(--foreground)]"
                                  )}
                                >
                                  {formatWeeklyDuePhrase(item.dueDate, dateLocale, lang, referenceNow)}
                                </span>
                                <span className="sr-only">{`, ${item.dueDate}`}</span>
                              </p>
                            ) : null}
                          </div>

                          <div className="flex w-full shrink-0 flex-col gap-2 sm:w-auto sm:min-w-[10rem] sm:items-end sm:pt-0.5">
                            {item.href ? (
                              <Link
                                href={item.href as never}
                                className="inline-flex min-h-11 w-full items-center justify-center rounded-2xl border border-[rgba(232,220,207,0.85)] bg-[rgba(232,220,207,0.32)] px-4 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:bg-[rgba(232,220,207,0.48)] sm:w-auto"
                              >
                                {labels.view}
                              </Link>
                            ) : null}
                            {item.taskId && !item.completed ? (
                              <TaskCompleteForm taskId={item.taskId} doneLabel={labels.markDone} />
                            ) : item.completed && item.taskId ? (
                              <span className="flex min-h-11 items-center justify-center text-sm font-medium text-[var(--muted)] sm:justify-end">
                                <Check className="mr-2 h-4 w-4 text-[var(--success)]" aria-hidden />
                                {labels.markDone}
                              </span>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        ) : null}
      </div>
    </Card>
  );
}
