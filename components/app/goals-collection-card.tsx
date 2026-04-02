"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ChevronRight, RefreshCw } from "lucide-react";

import { StatusBadge } from "@/components/ui/status-badge";
import { computeGoalProgress, normalizeGoalAnalysis } from "@/lib/goals-ui";
import type { GoalRecord } from "@/lib/types";

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-3 w-full overflow-hidden rounded-full bg-[var(--surface-strong)]">
      <div className="h-full rounded-full bg-[image:var(--accent-gradient)] transition-all" style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}

function getInitialIndex(length: number) {
  if (!length) {
    return 0;
  }

  return Math.floor(Math.random() * length);
}

export function GoalsCollectionCard({
  goals,
  activeGoalId,
  deletedGoalId,
  dateLocale,
  copy
}: {
  goals: GoalRecord[];
  activeGoalId: string | null;
  deletedGoalId: string | null;
  dateLocale: string;
  copy: {
    collectionTitle: string;
    collectionHint: string;
    createdAt: string;
    progress: string;
    noGoals: string;
  };
}) {
  const visibleGoals = useMemo(
    () => goals.filter((goal) => (deletedGoalId ? goal.id !== deletedGoalId : true)),
    [deletedGoalId, goals]
  );
  const [index, setIndex] = useState(() => getInitialIndex(visibleGoals.length));

  const currentGoal = visibleGoals.length ? visibleGoals[index % visibleGoals.length] : null;
  const progress = currentGoal?.analysis_result ? computeGoalProgress(normalizeGoalAnalysis(currentGoal.analysis_result).bureaucracy_steps) : currentGoal?.progress_percentage ?? 0;
  const isActive = currentGoal ? activeGoalId === currentGoal.id : false;

  return (
    <div className="relative space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">{copy.collectionTitle}</h2>
          <button
            type="button"
            onClick={() => {
              if (visibleGoals.length > 1) {
                setIndex((current) => (current + 1) % visibleGoals.length);
              }
            }}
            className="inline-flex min-h-8 items-center gap-2 rounded-full bg-[rgba(232,220,207,0.68)] px-3 text-xs font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:bg-[rgba(232,220,207,0.84)]"
          >
            <span>{visibleGoals.length ? `${Math.min(index + 1, visibleGoals.length)} / ${visibleGoals.length}` : "0"}</span>
            {visibleGoals.length > 1 ? <RefreshCw className="h-3.5 w-3.5" /> : null}
          </button>
        </div>
        <p className="max-w-md text-sm leading-6 text-[var(--muted)]">{copy.collectionHint}</p>
      </div>

      {currentGoal ? (
        <Link href={`/app/goals?mode=view&goal=${currentGoal.id}` as Route}>
          <div
            className={`rounded-[24px] border px-4 py-4 transition ${
              isActive
                ? "border-[rgba(95,163,163,0.28)] bg-white shadow-[var(--shadow-soft)]"
                : "border-white/60 bg-white/78 hover:bg-white hover:shadow-[var(--shadow-soft)]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-2">
                <p className="break-words text-base font-semibold leading-6">{currentGoal.title}</p>
                <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                  <span>{copy.createdAt}</span>
                  <span>{new Date(currentGoal.created_at).toLocaleDateString(dateLocale)}</span>
                </div>
              </div>
              <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-[var(--muted)]" />
            </div>
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm text-[var(--muted)]">{copy.progress}</span>
                <StatusBadge tone="neutral">{progress}%</StatusBadge>
              </div>
              <ProgressBar value={progress} />
            </div>
          </div>
        </Link>
      ) : (
        <div className="rounded-[24px] border border-white/50 bg-white/70 p-5 text-sm leading-6 text-[var(--muted)]">{copy.noGoals}</div>
      )}
    </div>
  );
}
