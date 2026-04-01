"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { FolderOpen, Home, Settings, SquareCheckBig, Upload } from "lucide-react";

import { getCasesNavLabel } from "@/lib/case-ui";
import { getCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  colorClass: string;
  activeClass: string;
};

function isRouteActive(pathname: string, href: string) {
  if (href === "/app") {
    return pathname === "/app";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNavigation({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const copy = getCopy(locale);
  const items = [
    {
      href: "/app",
      label: copy.nav.home,
      icon: Home,
      colorClass: "text-sky-600",
      activeClass: "bg-[rgba(74,144,226,0.14)] text-sky-700"
    },
    {
      href: "/app/upload",
      label: copy.nav.upload,
      icon: Upload,
      colorClass: "text-teal-600",
      activeClass: "bg-[rgba(94,139,140,0.15)] text-teal-700"
    },
    {
      href: "/app/cases",
      label: getCasesNavLabel(locale),
      icon: FolderOpen,
      colorClass: "text-violet-600",
      activeClass: "bg-[rgba(135,115,187,0.14)] text-violet-700"
    },
    {
      href: "/app/tasks",
      label: copy.nav.tasks,
      icon: SquareCheckBig,
      colorClass: "text-amber-700",
      activeClass: "bg-[rgba(242,166,90,0.18)] text-amber-800"
    },
    {
      href: "/app/settings",
      label: copy.nav.settings,
      icon: Settings,
      colorClass: "text-slate-600",
      activeClass: "bg-[rgba(122,133,153,0.16)] text-slate-700"
    }
  ] satisfies NavItem[];

  useEffect(() => {
    items.forEach((item) => router.prefetch(item.href as Route));
  }, [items, router]);

  return (
    <>
      <aside className="hidden lg:sticky lg:top-6 lg:flex lg:w-72 lg:flex-col lg:self-start">
        <div className="rounded-[32px] border border-white/70 bg-[var(--surface)] p-4 shadow-[var(--shadow)] backdrop-blur">
          <div className="px-3 pb-4 pt-2">
            <p className="text-sm font-medium text-[var(--muted)]">{copy.nav.brand}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{copy.nav.desk}</h2>
          </div>
          <nav className="space-y-1">
            {items.map((item) => {
              const isActive = isRouteActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  prefetch
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-2xl px-4 text-sm font-semibold text-[var(--muted)] transition active:scale-[0.99]",
                    !isActive && "hover:bg-white hover:text-[var(--foreground)]",
                    isActive && `${item.activeClass} shadow-[var(--shadow-soft)]`
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", isActive ? item.colorClass : "text-[var(--muted)]")} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.9rem)] pt-3 lg:hidden">
        <div className="mx-auto flex w-full max-w-md rounded-[28px] border border-white/80 bg-[rgba(255,252,247,0.98)] px-2 py-2 shadow-[var(--shadow)] backdrop-blur">
          {items.map((item) => {
            const isActive = isRouteActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                prefetch
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold text-[var(--muted)] transition active:scale-[0.98]",
                  !isActive && "hover:bg-white/70",
                  isActive && `${item.activeClass} shadow-[var(--shadow-soft)]`
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? item.colorClass : "text-[var(--muted)]")} />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
