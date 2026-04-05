"use client";

import Link from "next/link";
import { useMemo } from "react";
import { CheckCircle2, Circle, PlayCircle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { WelcomeStepStatusControls } from "@/components/app/welcome-step-status-controls";
import type { WelcomeStepRecord } from "@/lib/types";
import { formatWelcomeText, getWelcomeCopy } from "@/lib/welcome-ui";

export function WelcomeRoadmap({
  locale,
  steps
}: {
  locale: string;
  steps: WelcomeStepRecord[];
}) {
  const copy = getWelcomeCopy(locale);
  const doneCount = useMemo(() => steps.filter((step) => step.status === "done").length, [steps]);
  const progress = steps.length ? (doneCount / steps.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <Card className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.roadmapTitle}</h2>
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">{copy.roadmapText}</p>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-medium text-[var(--foreground)]">{formatWelcomeText(copy.roadmapProgress, { done: doneCount, total: steps.length })}</p>
            <StatusBadge tone={doneCount === steps.length && steps.length > 0 ? "success" : "accent"}>{formatWelcomeText(copy.doneCount, { done: doneCount })}</StatusBadge>
          </div>
          <div className="h-2 rounded-full bg-[rgba(226,233,240,0.9)]">
            <div className="h-2 rounded-full bg-[image:var(--accent-gradient)] transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </Card>

      {steps.length ? (
        <div className="grid gap-4">
          {steps.map((step) => {
            const statusTone = step.status === "done" ? "success" : step.status === "in_progress" ? "accent" : "neutral";
            const title = copy.steps[step.step_key as keyof typeof copy.steps]?.title ?? step.step_key;
            const description = copy.steps[step.step_key as keyof typeof copy.steps]?.description ?? "";

            return (
              <Card key={step.id} className="space-y-4 p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="rounded-2xl bg-[rgba(241,245,249,0.96)] p-3 text-[var(--accent)]">
                      {step.status === "done" ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : step.status === "in_progress" ? (
                        <PlayCircle className="h-5 w-5" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/app/welcome/${step.step_key}`}
                          className="text-lg font-semibold text-[var(--foreground)] transition hover:text-[var(--accent-strong)]"
                        >
                          {title}
                        </Link>
                        <StatusBadge tone={statusTone}>{copy.status[step.status]}</StatusBadge>
                      </div>
                      <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">{description}</p>
                    </div>
                  </div>
                  <Link
                    href={`/app/welcome/${step.step_key}`}
                    className="inline-flex min-h-11 items-center rounded-2xl border border-[rgba(223,229,236,0.94)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition duration-200 hover:border-[rgba(208,220,234,0.92)]"
                  >
                    {copy.roadmapOpenDetail}
                  </Link>
                </div>

                <WelcomeStepStatusControls locale={locale} stepId={step.id} status={step.status} />
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-5 text-sm text-[var(--muted)]">{copy.roadmapEmpty}</Card>
      )}
    </div>
  );
}
