"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import { Home, Settings, SquareCheckBig, Upload } from "lucide-react";

import { cn } from "@/lib/utils";

const items = [
  { href: "/app", label: "Home", icon: Home },
  { href: "/app/upload", label: "Upload", icon: Upload },
  { href: "/app/tasks", label: "Tasks", icon: SquareCheckBig },
  { href: "/app/settings", label: "Settings", icon: Settings }
] satisfies Array<{ href: Route; label: string; icon: typeof Home }>;

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.75rem)] pt-3">
      <div className="mx-auto flex w-full max-w-sm rounded-[24px] border border-white/80 bg-[rgba(255,255,255,0.96)] px-2 py-2 shadow-[var(--shadow)] backdrop-blur">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 rounded-2xl px-3 py-2 text-[11px] font-medium text-[var(--muted)] transition",
                isActive && "bg-[var(--accent-soft)] text-[var(--accent)]"
              )}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
