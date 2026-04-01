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
            "bg-[var(--accent)] text-white shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-[var(--accent-strong)]",
          variant === "secondary" &&
            "border border-white/80 bg-[var(--surface-strong)] text-[var(--foreground)] shadow-[var(--shadow-soft)] hover:-translate-y-0.5 hover:bg-white",
          variant === "ghost" && "text-[var(--muted)] hover:bg-white/80",
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
