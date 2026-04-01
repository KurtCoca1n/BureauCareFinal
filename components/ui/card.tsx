import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden break-words rounded-[28px] border border-white/70 bg-[var(--surface)] p-5 shadow-[var(--shadow)] backdrop-blur before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/80 before:content-['']",
        className
      )}
      {...props}
    />
  );
}
