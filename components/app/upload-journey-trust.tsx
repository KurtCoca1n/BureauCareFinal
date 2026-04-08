"use client";

import { useState } from "react";
import { CircleCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export type UploadJourneyTrustCopy = {
  journeyHeading: string;
  journeyPeekLine: string;
  journeyStep1: string;
  journeyStep2: string;
  journeyStep3: string;
  journeyStep4: string;
  journeyStep5: string;
  expandMore: string;
  expandLess: string;
};

export function UploadJourneyTrust({ copy }: { copy: UploadJourneyTrustCopy }) {
  const [expanded, setExpanded] = useState(false);

  const steps = [
    copy.journeyStep1,
    copy.journeyStep2,
    copy.journeyStep3,
    copy.journeyStep4,
    copy.journeyStep5
  ];

  return (
    <Card className="border-[var(--line)] bg-white/92 p-5 shadow-[0_10px_28px_rgba(43,43,43,0.03)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
            <CircleCheck className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" aria-hidden />
            {copy.journeyHeading}
          </div>
          <p className="text-sm leading-relaxed text-[var(--muted)]">{copy.journeyPeekLine}</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          className="min-h-10 shrink-0 self-start px-4 py-2 text-xs sm:self-center"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? copy.expandLess : copy.expandMore}
        </Button>
      </div>

      {expanded ? (
        <ol className="mt-5 space-y-2" aria-label={copy.journeyHeading}>
          {steps.map((label, index) => (
            <li
              key={label}
              className="flex gap-3 rounded-[16px] border border-[var(--line)] bg-[rgba(246,250,249,0.5)] px-3.5 py-2.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(95,163,163,0.14)] text-xs font-semibold tabular-nums text-[var(--accent)]">
                {index + 1}
              </span>
              <span className="text-sm font-medium leading-snug text-[var(--foreground)]/95">{label}</span>
            </li>
          ))}
        </ol>
      ) : null}
    </Card>
  );
}
