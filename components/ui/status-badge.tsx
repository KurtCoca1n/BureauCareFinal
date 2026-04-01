import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

export function StatusBadge({
  children,
  tone = "neutral"
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "success" | "warning";
}) {
  return (
    <span
      className={cn(
        "inline-flex min-h-7 min-w-7 items-center justify-center whitespace-nowrap rounded-full px-3 py-1 text-center text-xs font-semibold tabular-nums shadow-[var(--shadow-soft)]",
        tone === "neutral" && "bg-[rgba(232,220,207,0.65)] text-[var(--foreground)]",
        tone === "accent" && "bg-[var(--accent-soft)] text-[var(--accent)]",
        tone === "success" && "bg-[var(--success-soft)] text-[var(--petrol)]",
        tone === "warning" && "bg-[rgba(242,166,90,0.18)] text-[var(--foreground)]"
      )}
    >
      {children}
    </span>
  );
}
