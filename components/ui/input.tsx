import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "min-h-12 w-full rounded-2xl border border-white/80 bg-[rgba(255,255,255,0.92)] px-4 text-sm text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(74,144,226,0.12)]",
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
