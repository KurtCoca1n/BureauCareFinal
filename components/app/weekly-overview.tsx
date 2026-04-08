"use client";

import { useMemo, useState } from "react";
import { CalendarClock, Check, ChevronDown, ChevronUp, ClipboardList, Flag } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import {
  calendarDaysUntilDue,
  computeWeeklyOverviewStats,
  formatWeeklyDuePhrase,
  getWeeklyOverviewMicrocopy,
  getWeeklyOverviewMockItems,
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

function priorityBadgeTone(priority: WeeklyOverviewItem["priority"]): "accent" | "warning" | "neutral" {
  if (priority === "high") return "accent";
  if (priority === "medium") return "warning";
  return "neutral";
}

function isCriticalOpen(item: WeeklyOverviewItem) {
  return !item.completed && item.type === "deadline" && item.priority === "high";
}

function isDueSoonOpen(item: WeeklyOverviewItem, reference: Date) {
  if (item.completed || !item.dueDate) return false;
  const d = calendarDaysUntilDue(item.dueDate, reference);
  return d >= 0 && d <= 2;
}

type Props = {
  locale: string | null | undefined;
  dateLocale: string;
};

function weeklyLang(supported: SupportedLanguage): "de" | "en" {
  if (supported === "en") return "en";
  if (supported === "de") return "de";
  return "en";
}

export function WeeklyOverview({ locale, dateLocale }: Props) {
  const lang = weeklyLang(normalizePreferredLanguage(locale));
  const labels = weeklyOverviewLabels(lang);
  const referenceNow = useMemo(() => new Date(), []);

  const [expanded, setExpanded] = useState(false);
  const [items, setItems] = useState<WeeklyOverviewItem[]>(() => getWeeklyOverviewMockItems(referenceNow));

  const sorted = useMemo(() => sortWeeklyOverviewItems(items), [items]);

  const stats = useMemo(() => computeWeeklyOverviewStats(items, referenceNow), [items, referenceNow]);

  const microcopy = useMemo(() => getWeeklyOverviewMicrocopy(lang, stats), [lang, stats]);

  const progressPct = stats.total > 0 ? Math.round((stats.doneCount / stats.total) * 100) : 0;

  const toggleItem = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const summaryCompact = labels.summaryLine(
    stats.openCount,
    stats.criticalDeadlineCount,
    stats.appointmentsThisWeekCount
  );

  return (
    <Card className="border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(168deg,rgba(255,255,255,0.99),rgba(246,250,249,0.88))] p-5 shadow-[0_18px_44px_rgba(43,43,43,0.04)] hover:translate-y-0 hover:shadow-[0_18px_44px_rgba(43,43,43,0.04)] sm:p-7">
      <div className="flex flex-col gap-5 sm:gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <div className="min-w-0 space-y-2">
            <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-[1.4rem]">
              {labels.title}
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted)]">{summaryCompact}</p>
          </div>
          <div className="flex flex-shrink-0 flex-col gap-3 sm:items-end">
            <div className="flex flex-wrap items-center gap-2 sm:justify-end">
              <StatusBadge tone={stats.openCount ? "accent" : "success"}>{labels.openChip(stats.openCount)}</StatusBadge>
              {stats.criticalDeadlineCount > 0 ? (
                <StatusBadge tone="warning">{labels.criticalChip(stats.criticalDeadlineCount)}</StatusBadge>
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
            <div className="space-y-2 rounded-[22px] border border-[var(--line)] bg-white/92 px-4 py-3 sm:px-5">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
                <span>{labels.progress(stats.doneCount, stats.total)}</span>
                <span className="tabular-nums text-[var(--foreground)]/80">{progressPct}%</span>
              </div>
              <div
                className="h-1.5 overflow-hidden rounded-full bg-[rgba(232,220,207,0.55)]"
                role="progressbar"
                aria-valuenow={stats.doneCount}
                aria-valuemin={0}
                aria-valuemax={stats.total}
                aria-label={labels.progress(stats.doneCount, stats.total)}
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

            <p
              className={cn(
                "text-sm font-medium leading-relaxed",
                stats.openCount === 0 && stats.total > 0 ? "text-[var(--petrol)]" : "text-[var(--foreground)]/88"
              )}
            >
              {microcopy}
            </p>

            <ul className="flex flex-col gap-4">
          {sorted.map((item) => {
            const Icon = typeIcon(item.type);
            const typeLabel =
              item.type === "task"
                ? labels.typeTask
                : item.type === "deadline"
                  ? labels.typeDeadline
                  : labels.typeAppointment;

            const critical = isCriticalOpen(item);
            const soon = isDueSoonOpen(item, referenceNow);
            const accentAttention = !item.completed && (critical || soon);

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
                            ? "border-[rgba(95,163,163,0.26)] ring-1 ring-[rgba(242,166,90,0.18)]"
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
                        <span
                          className={cn(
                            "text-[11px] font-semibold uppercase tracking-[0.14em]",
                            item.completed ? "text-[var(--muted)]" : "text-[var(--muted)]"
                          )}
                        >
                          {typeLabel}
                        </span>
                        <StatusBadge tone={priorityBadgeTone(item.priority)}>
                          {item.priority === "high"
                            ? labels.priorityHigh
                            : item.priority === "medium"
                              ? labels.priorityMedium
                              : labels.priorityLow}
                        </StatusBadge>
                        {item.suggested ? (
                          <StatusBadge tone="success">{labels.suggested}</StatusBadge>
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
                      {item.dueDate ? (
                        <p
                          className={cn(
                            "text-xs font-semibold",
                            item.completed ? "text-[var(--muted)]" : "text-[var(--foreground)]/80"
                          )}
                        >
                          {labels.due}:{" "}
                          <span className="font-medium text-[var(--foreground)]">
                            {formatWeeklyDuePhrase(item.dueDate, dateLocale, lang, referenceNow)}
                          </span>
                          <span className="sr-only">{`, ${item.dueDate}`}</span>
                        </p>
                      ) : null}
                    </div>

                    <div className="shrink-0 sm:pt-0.5">
                      <Button
                        type="button"
                        variant={item.completed ? "secondary" : "primary"}
                        className="min-h-11 w-full min-w-[7.5rem] px-4 sm:w-auto"
                        onClick={() => toggleItem(item.id)}
                        aria-pressed={item.completed}
                      >
                        {item.completed ? (
                          labels.undo
                        ) : (
                          <>
                            <Check className="mr-2 h-4 w-4" aria-hidden />
                            {labels.markDone}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
            </ul>
          </div>
        ) : null}
      </div>
    </Card>
  );
}
