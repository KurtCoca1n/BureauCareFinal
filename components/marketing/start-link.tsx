"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import type { Route } from "next";

import { cn } from "@/lib/utils";

export function StartLink({
  href,
  label,
  className
}: {
  href: Route;
  label: string;
  className?: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    router.prefetch(href);
  }, [href, router]);

  return (
    <Link
      href={href}
      prefetch
      onClick={() => {
        setPressed(true);
        startTransition(() => {
          router.prefetch(href);
        });
      }}
      className={cn(
        "inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--accent)] px-6 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition active:scale-[0.98] hover:bg-[var(--accent-strong)]",
        className
      )}
    >
      {isPending || pressed ? `${label}…` : label}
      <ArrowRight className="ml-2 h-4 w-4" />
    </Link>
  );
}
