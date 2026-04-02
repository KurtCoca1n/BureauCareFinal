import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative min-w-0 overflow-hidden break-words rounded-[28px] border border-[rgba(255,255,255,0.88)] bg-white/96 p-5 shadow-[var(--shadow)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_56px_rgba(0,0,0,0.08)] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-white/90 before:content-[''] after:pointer-events-none after:absolute after:inset-0 after:bg-[linear-gradient(180deg,rgba(255,255,255,0.18),transparent_24%)] after:opacity-80 after:content-['']",
        className
      )}
      {...props}
    />
  );
}
