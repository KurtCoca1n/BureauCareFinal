import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";

import { Card } from "@/components/ui/card";
import { getCopy } from "@/lib/i18n";

type ReminderBuckets = Awaited<ReturnType<typeof import("@/lib/queries").getTaskReminderBuckets>>;

export function HomeStatusOverview({ locale, buckets }: { locale: string; buckets: ReminderBuckets }) {
  const copy = getCopy(locale);
  const open =
    buckets.overdue.length + buckets.today.length + buckets.soon.length + buckets.open.length;
  const critical = buckets.overdue.length + buckets.today.length;
  const done = buckets.done.length;

  return (
    <Card className="border border-[var(--line)] bg-[linear-gradient(168deg,rgba(255,255,255,0.98),rgba(248,250,249,0.92))] p-5 shadow-[0_12px_32px_rgba(43,43,43,0.04)] sm:p-6">
      <div className="flex flex-col gap-5">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{copy.home.statusOverviewTitle}</h2>
        <div className="grid grid-cols-3 gap-3 sm:gap-4">
          <div className="rounded-[18px] border border-[var(--line)] bg-white/90 px-3 py-3 text-center sm:px-4 sm:py-4">
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--foreground)] sm:text-[1.65rem]">{open}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)] sm:text-xs">{copy.home.statusOpenLabel}</p>
          </div>
          <div className="rounded-[18px] border border-[var(--line)] bg-white/90 px-3 py-3 text-center sm:px-4 sm:py-4">
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--foreground)] sm:text-[1.65rem]">{critical}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)] sm:text-xs">{copy.home.statusCriticalLabel}</p>
          </div>
          <div className="rounded-[18px] border border-[var(--line)] bg-white/90 px-3 py-3 text-center sm:px-4 sm:py-4">
            <p className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--foreground)] sm:text-[1.65rem]">{done}</p>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[var(--muted)] sm:text-xs">{copy.home.statusDoneLabel}</p>
          </div>
        </div>
        <Link
          href={"/app/tasks" as Route}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-[var(--line-strong)] bg-white/95 py-2.5 text-sm font-semibold text-[var(--accent-strong)] transition hover:border-[var(--accent)]/35 hover:bg-[var(--accent-soft)] sm:w-auto sm:self-start sm:px-5"
        >
          {copy.home.statusToTasks}
          <ArrowRight className="h-4 w-4 shrink-0" aria-hidden />
        </Link>
      </div>
    </Card>
  );
}
