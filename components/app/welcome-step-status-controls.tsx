"use client";

import { LoaderCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { updateWelcomeStepStatusAction } from "@/lib/actions/welcome";
import type { WelcomeStepStatus } from "@/lib/types";
import { getWelcomeCopy } from "@/lib/welcome-ui";

export function WelcomeStepStatusControls({
  locale,
  stepId,
  status,
  className = ""
}: {
  locale: string;
  stepId: string;
  status: WelcomeStepStatus;
  className?: string;
}) {
  const copy = getWelcomeCopy(locale);
  const router = useRouter();
  const [pendingStatus, setPendingStatus] = useState<WelcomeStepStatus | null>(null);
  const [isPending, startTransition] = useTransition();

  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {(["open", "in_progress", "done"] as const).map((nextStatus) => (
          <button
            key={nextStatus}
            type="button"
            onClick={() => {
              setPendingStatus(nextStatus);
              startTransition(async () => {
                await updateWelcomeStepStatusAction(stepId, nextStatus);
                router.refresh();
                setPendingStatus(null);
              });
            }}
            disabled={isPending && pendingStatus === nextStatus}
            className={[
              "inline-flex min-h-11 items-center rounded-2xl border px-4 text-sm font-medium transition duration-200",
              status === nextStatus
                ? "border-[rgba(165,192,217,0.92)] bg-[rgba(230,239,248,0.92)] text-[var(--foreground)]"
                : "border-[rgba(223,229,236,0.94)] bg-white text-[var(--foreground)] hover:border-[rgba(208,220,234,0.92)]"
            ].join(" ")}
          >
            {isPending && pendingStatus === nextStatus && status !== nextStatus ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
            {copy.stepActions[nextStatus]}
          </button>
        ))}
      </div>
    </div>
  );
}
