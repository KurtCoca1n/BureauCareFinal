"use client";

import { useEffect } from "react";
import Link from "next/link";
import type { Route } from "next";
import { usePathname, useRouter } from "next/navigation";
import { FileText, FolderOpen, Home, MapPinned, Settings, SquareCheckBig, Target, Upload, WalletCards } from "lucide-react";

import { getCasesNavLabel } from "@/lib/case-ui";
import { getCopy } from "@/lib/i18n";
import { getGoalsCopy } from "@/lib/goals-ui";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: typeof Home;
  colorClass: string;
  idleClass: string;
  hoverClass: string;
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
  const goalsCopy = getGoalsCopy(locale);
  const items = [
    {
      href: "/app",
      label: copy.nav.home,
      icon: Home,
      colorClass: "text-[var(--soft-blue)]",
      idleClass: "bg-[rgba(111,168,220,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(111,168,220,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(111,168,220,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/upload",
      label: copy.nav.upload,
      icon: Upload,
      colorClass: "text-[var(--accent-strong)]",
      idleClass: "bg-[rgba(95,163,163,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(95,163,163,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(95,163,163,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/cases",
      label: copy.nav.cases ?? getCasesNavLabel(locale),
      icon: FolderOpen,
      colorClass: "text-[#7c78b8]",
      idleClass: "bg-[rgba(138,148,198,0.11)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(124,120,184,0.18)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(124,120,184,0.24)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/processes",
      label: copy.nav.processes,
      icon: FileText,
      colorClass: "text-[#4f8f88]",
      idleClass: "bg-[rgba(129,188,178,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(95,163,163,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(95,163,163,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/refunds",
      label: copy.nav.refunds,
      icon: WalletCards,
      colorClass: "text-[#8e7a54]",
      idleClass: "bg-[rgba(232,220,207,0.18)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(232,220,207,0.3)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(232,220,207,0.42)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/welcome",
      label: copy.nav.welcome,
      icon: MapPinned,
      colorClass: "text-[#6f8ecb]",
      idleClass: "bg-[rgba(174,193,233,0.14)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(142,171,223,0.22)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(124,154,214,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/goals",
      label: goalsCopy.navLabel,
      icon: Target,
      colorClass: "text-[var(--success)]",
      idleClass: "bg-[rgba(123,191,159,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(123,191,159,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(123,191,159,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/tasks",
      label: copy.nav.tasks,
      icon: SquareCheckBig,
      colorClass: "text-[var(--orange)]",
      idleClass: "bg-[rgba(242,166,90,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(242,166,90,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(242,166,90,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/settings",
      label: copy.nav.settings,
      icon: Settings,
      colorClass: "text-[#7a7a7a]",
      idleClass: "bg-[rgba(154,166,181,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(129,141,156,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(129,141,156,0.24)] text-[rgba(24,34,48,0.98)]"
    }
  ] satisfies NavItem[];

  useEffect(() => {
    items.forEach((item) => router.prefetch(item.href as Route));
  }, [items, router]);

  return (
    <>
      <aside className="hidden lg:sticky lg:top-10 lg:flex lg:w-72 lg:flex-col lg:self-start lg:pt-4">
        <div className="rounded-[34px] border border-white/35 bg-[rgba(205,225,245,0.55)] p-4 shadow-[0_18px_42px_rgba(80,102,128,0.14)] backdrop-blur-[12px] supports-[backdrop-filter]:bg-[rgba(205,225,245,0.55)]">
          <div className="px-3 pb-5 pt-3">
            <p className="text-sm font-medium text-[var(--muted)]">{copy.nav.brand}</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{copy.nav.desk}</h2>
          </div>
          <nav className="space-y-2">
            {items.map((item) => {
              const isActive = isRouteActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  prefetch
                  className={cn(
                    "flex min-h-12 items-center gap-3 rounded-[22px] border border-transparent px-4 text-sm font-semibold transition duration-300 ease-out active:scale-[0.99]",
                    item.idleClass,
                    !isActive && `${item.hoverClass} hover:-translate-y-0.5 hover:border-white/45 hover:shadow-[0_10px_24px_rgba(84,103,130,0.12)]`,
                    isActive && `${item.activeClass} border-white/50 shadow-[0_12px_28px_rgba(84,103,130,0.14)]`
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0 transition-colors duration-300", isActive ? item.colorClass : item.colorClass)} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.9rem)] pt-4 lg:hidden">
        <div className="mx-auto w-full max-w-md rounded-[28px] border border-white/35 bg-[rgba(205,225,245,0.62)] px-2 py-2 shadow-[0_16px_36px_rgba(80,102,128,0.16)] backdrop-blur-[12px]">
          <div className="flex gap-1 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const isActive = isRouteActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                prefetch
                className={cn(
                  "flex min-w-[76px] shrink-0 flex-col items-center gap-1 rounded-2xl border border-transparent px-3 py-2 text-[11px] font-semibold transition duration-300 ease-out active:scale-[0.98]",
                  item.idleClass,
                  !isActive && `${item.hoverClass} hover:-translate-y-0.5 hover:border-white/40`,
                  isActive && `${item.activeClass} border-white/45 shadow-[0_10px_24px_rgba(84,103,130,0.12)]`
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0 transition-colors duration-300", item.colorClass)} />
                <span className="max-w-full truncate">{item.label}</span>
              </Link>
            );
          })}
          </div>
        </div>
      </nav>
    </>
  );
}
