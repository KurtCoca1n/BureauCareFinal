import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", type = "button", ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex min-h-12 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition duration-200 transform-gpu active:scale-[0.985] disabled:cursor-not-allowed disabled:opacity-60",
          variant === "primary" &&
            "bg-[image:var(--accent-gradient)] text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:brightness-[1.02]",
          variant === "secondary" &&
            "border border-[rgba(232,220,207,0.85)] bg-[rgba(232,220,207,0.32)] text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[rgba(232,220,207,0.48)]",
          variant === "ghost" && "text-[var(--muted)] hover:bg-white/80",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
