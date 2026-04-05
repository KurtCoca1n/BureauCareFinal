import Link from "next/link";
import { ArrowRight, BellRing, Lightbulb, Sparkles } from "lucide-react";
import type { Route } from "next";

import { WelcomeCreateTaskButton } from "@/components/app/welcome-workspace-actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { formatWelcomeAssistantText, getWelcomeAssistantCopy } from "@/lib/welcome-assistant-ui-v2";
import type { WelcomeAssistantOverview } from "@/lib/welcome-assistant";
import type { SupportedLanguage } from "@/lib/languages";

export function WelcomeAssistantPanel({
  locale,
  overview
}: {
  locale: SupportedLanguage;
  overview: WelcomeAssistantOverview;
}) {
  const copy = getWelcomeAssistantCopy(locale);

  return (
    <div className="space-y-5">
      {overview.nextStep ? (
        <Card className="space-y-4 border-[var(--line-strong)] bg-[var(--surface-strong)] p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <StatusBadge tone="accent">{copy.nextStepBadge}</StatusBadge>
              <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.nextStepTitle}</h2>
              <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">{copy.nextStepText}</p>
            </div>
            <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
              <Sparkles className="h-5 w-5" />
            </div>
          </div>

          <div className="rounded-[28px] border border-[var(--line)] bg-white/92 p-5">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone="success">{copy.stepBasedLabel}</StatusBadge>
              <StatusBadge tone="neutral">{formatWelcomeAssistantText(copy.progressHint, { open: overview.openCount })}</StatusBadge>
            </div>
            <h3 className="mt-4 text-lg font-semibold text-[var(--foreground)]">{overview.nextStep.title}</h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{overview.nextStep.text}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link href={overview.nextStep.href as Route} className="inline-flex">
                <Button>
                  {copy.openStepLabel}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              {overview.nextStep.showCreateTask ? (
                <WelcomeCreateTaskButton stepKey={overview.nextStep.stepKey} locale={locale} label={copy.createTaskLabel} />
              ) : null}
            </div>
          </div>
        </Card>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <Card className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(255,214,163,0.18)] p-3 text-[#b1742d]">
              <BellRing className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.remindersTitle}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.remindersText}</p>
            </div>
          </div>

          {overview.reminders.length ? (
            <div className="space-y-3">
              {overview.reminders.map((reminder) => (
                <Link key={reminder.id} href={reminder.href as Route}>
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/90 p-4 transition hover:border-[var(--line-strong)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone={reminder.badgeTone}>
                        {reminder.kind === "deadline_overdue"
                          ? copy.overdueBadge
                          : reminder.kind === "deadline_soon"
                            ? copy.soonBadge
                            : reminder.kind === "missing_documents"
                              ? copy.missingBadge
                              : copy.staleBadge}
                      </StatusBadge>
                      <StatusBadge tone="neutral">
                        {reminder.kind === "deadline_overdue"
                          ? copy.reminderKinds.deadlineOverdue
                          : reminder.kind === "deadline_soon"
                            ? copy.reminderKinds.deadlineSoon
                            : reminder.kind === "missing_documents"
                              ? copy.reminderKinds.missingDocuments
                              : reminder.kind === "appointment"
                                ? copy.reminderKinds.appointment
                                : copy.reminderKinds.staleStep}
                      </StatusBadge>
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">{reminder.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{reminder.text}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-5 text-sm leading-6 text-[var(--muted)]">
              {copy.noReminders}
            </div>
          )}
        </Card>

        <Card className="space-y-4 p-5 sm:p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(174,193,233,0.18)] p-3 text-[#6f8ecb]">
              <Lightbulb className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.suggestionsTitle}</h2>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.suggestionsText}</p>
            </div>
          </div>

          {overview.suggestions.length ? (
            <div className="space-y-3">
              {overview.suggestions.map((suggestion) => (
                <Link key={suggestion.id} href={suggestion.href as Route}>
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/90 p-4 transition hover:border-[var(--line-strong)]">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone="accent">{copy.relevantLabel}</StatusBadge>
                      {suggestion.source === "welcome" ? <StatusBadge tone="neutral">{copy.stepBasedLabel}</StatusBadge> : null}
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">{suggestion.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{suggestion.text}</p>
                    <div className="mt-4 inline-flex items-center text-sm font-medium text-[var(--accent-strong)]">
                      {copy.reviewStepLabel}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[24px] border border-dashed border-[var(--line)] bg-[var(--surface)] px-4 py-5 text-sm leading-6 text-[var(--muted)]">
              {copy.noSuggestions}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
