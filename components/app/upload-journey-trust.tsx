import { CircleCheck, HeartHandshake } from "lucide-react";

import { Card } from "@/components/ui/card";

export type UploadJourneyTrustCopy = {
  trustCardTitle: string;
  journeyTitle: string;
  journeyStep1: string;
  journeyStep2: string;
  journeyStep3: string;
  journeyStep4: string;
  journeyStep5: string;
  trustPillar1: string;
  trustPillar2: string;
  trustPillar3: string;
};

export function UploadJourneyTrust({ copy }: { copy: UploadJourneyTrustCopy }) {
  const steps = [
    copy.journeyStep1,
    copy.journeyStep2,
    copy.journeyStep3,
    copy.journeyStep4,
    copy.journeyStep5
  ];
  const pillars = [copy.trustPillar1, copy.trustPillar2, copy.trustPillar3];

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_minmax(0,340px)] lg:items-start">
      <Card className="space-y-5 border-[var(--line)] bg-white/95 p-6 sm:p-7 shadow-[0_12px_36px_rgba(43,43,43,0.04)]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          <CircleCheck className="h-3.5 w-3.5 text-[var(--accent)]" />
          {copy.journeyTitle}
        </div>
        <ol className="flex flex-col gap-2 md:grid md:grid-cols-5 md:gap-2">
          {steps.map((label, index) => (
            <li
              key={label}
              className="flex flex-row items-center gap-3 rounded-[18px] border border-[var(--line)] bg-[rgba(246,250,249,0.45)] px-4 py-3 md:flex-col md:gap-2 md:px-3 md:py-4 md:text-center"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(95,163,163,0.14)] text-xs font-semibold tabular-nums text-[var(--accent)] md:h-8 md:w-8">
                {index + 1}
              </span>
              <span className="text-sm font-medium leading-snug text-[var(--foreground)]/95 md:text-[13px]">{label}</span>
            </li>
          ))}
        </ol>
      </Card>

      <Card className="space-y-4 border border-[rgba(95,163,163,0.12)] bg-[linear-gradient(160deg,rgba(255,255,255,0.98),rgba(238,246,245,0.5))] p-6 shadow-[0_10px_32px_rgba(95,163,163,0.06)]">
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
          <HeartHandshake className="h-3.5 w-3.5 text-[var(--accent)]" />
          {copy.trustCardTitle}
        </div>
        <ul className="space-y-3">
          {pillars.map((line) => (
            <li
              key={line}
              className="flex gap-3 rounded-[18px] border border-[var(--line)] bg-white/90 px-4 py-3 text-sm leading-snug text-[var(--foreground)]/90"
            >
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)] opacity-80" aria-hidden />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}
