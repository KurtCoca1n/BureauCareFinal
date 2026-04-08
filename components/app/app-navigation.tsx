"use client";

import { useEffect, useMemo } from "react";
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

/** Diese Ziele sind auf der Startseite als eigener Bereich verlinkt, nicht in der Sidebar. */
const HREF_ONLY_ON_HOME = new Set<string>(["/app/refunds", "/app/welcome", "/app/goals"]);

export function AppNavigation({ locale }: { locale: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const copy = getCopy(locale);
  const allItems = useMemo(() => {
    const c = getCopy(locale);
    const goalsCopy = getGoalsCopy(locale);
    return [
    {
      href: "/app",
      label: c.nav.home,
      icon: Home,
      colorClass: "text-[var(--soft-blue)]",
      idleClass: "bg-[rgba(111,168,220,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(111,168,220,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(111,168,220,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/upload",
      label: c.nav.upload,
      icon: Upload,
      colorClass: "text-[var(--accent-strong)]",
      idleClass: "bg-[rgba(95,163,163,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(95,163,163,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(95,163,163,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/cases",
      label: c.nav.cases ?? getCasesNavLabel(locale),
      icon: FolderOpen,
      colorClass: "text-[#7c78b8]",
      idleClass: "bg-[rgba(138,148,198,0.11)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(124,120,184,0.18)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(124,120,184,0.24)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/processes",
      label: c.nav.processes,
      icon: FileText,
      colorClass: "text-[#4f8f88]",
      idleClass: "bg-[rgba(129,188,178,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(95,163,163,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(95,163,163,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/refunds",
      label: c.nav.refunds,
      icon: WalletCards,
      colorClass: "text-[#8e7a54]",
      idleClass: "bg-[rgba(232,220,207,0.18)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(232,220,207,0.3)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(232,220,207,0.42)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/welcome",
      label: c.nav.welcome,
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
      label: c.nav.tasks,
      icon: SquareCheckBig,
      colorClass: "text-[var(--orange)]",
      idleClass: "bg-[rgba(242,166,90,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(242,166,90,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(242,166,90,0.28)] text-[rgba(24,34,48,0.98)]"
    },
    {
      href: "/app/settings",
      label: c.nav.settings,
      icon: Settings,
      colorClass: "text-[#7a7a7a]",
      idleClass: "bg-[rgba(154,166,181,0.12)] text-[rgba(46,58,72,0.88)]",
      hoverClass: "hover:bg-[rgba(129,141,156,0.2)] hover:text-[rgba(31,41,55,0.96)]",
      activeClass: "bg-[rgba(129,141,156,0.24)] text-[rgba(24,34,48,0.98)]"
    }
    ] satisfies NavItem[];
  }, [locale]);

  const items = allItems.filter((item) => !HREF_ONLY_ON_HOME.has(item.href));

  useEffect(() => {
    allItems.forEach((item) => router.prefetch(item.href as Route));
  }, [allItems, router]);

  return (
    <>
      <aside className="hidden lg:sticky lg:top-10 lg:flex lg:w-[20rem] lg:flex-col lg:self-start lg:pt-4">
        <div className="rounded-[34px] border border-white/35 bg-[rgba(205,225,245,0.55)] p-5 shadow-[0_18px_42px_rgba(80,102,128,0.14)] backdrop-blur-[12px] supports-[backdrop-filter]:bg-[rgba(205,225,245,0.55)]">
          <div className="px-1 pb-5 pt-1">
            <h2 className="text-balance text-[1.65rem] font-semibold leading-snug tracking-[-0.03em] sm:text-[1.85rem]">
              {copy.nav.desk}
            </h2>
          </div>
          <nav className="space-y-2.5">
            {items.map((item) => {
              const isActive = isRouteActive(pathname, item.href);
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href as Route}
                  prefetch
                  className={cn(
                    "flex min-h-[3.35rem] items-center gap-3.5 rounded-[22px] border border-transparent px-4 text-[0.9375rem] font-semibold leading-snug transition duration-300 ease-out active:scale-[0.99] sm:text-base",
                    item.idleClass,
                    !isActive && `${item.hoverClass} hover:-translate-y-0.5 hover:border-white/45 hover:shadow-[0_10px_24px_rgba(84,103,130,0.12)]`,
                    isActive && `${item.activeClass} border-white/50 shadow-[0_12px_28px_rgba(84,103,130,0.14)]`
                  )}
                >
                  <Icon className={cn("h-[1.15rem] w-[1.15rem] shrink-0 transition-colors duration-300 sm:h-5 sm:w-5", item.colorClass)} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      <nav className="fixed inset-x-0 bottom-0 z-50 px-3 pb-[calc(env(safe-area-inset-bottom,0px)+0.9rem)] pt-4 lg:hidden">
        <div className="mx-auto w-full max-w-lg rounded-[28px] border border-white/35 bg-[rgba(205,225,245,0.62)] px-2.5 py-2.5 shadow-[0_16px_36px_rgba(80,102,128,0.16)] backdrop-blur-[12px]">
          <div className="flex gap-1.5 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => {
            const isActive = isRouteActive(pathname, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href as Route}
                prefetch
                className={cn(
                  "flex min-w-[84px] shrink-0 flex-col items-center gap-1.5 rounded-2xl border border-transparent px-3 py-2.5 text-[12px] font-semibold leading-tight transition duration-300 ease-out active:scale-[0.98] sm:min-w-[88px] sm:text-[13px]",
                  item.idleClass,
                  !isActive && `${item.hoverClass} hover:-translate-y-0.5 hover:border-white/40`,
                  isActive && `${item.activeClass} border-white/45 shadow-[0_10px_24px_rgba(84,103,130,0.12)]`
                )}
              >
                <Icon className={cn("h-[1.15rem] w-[1.15rem] shrink-0 transition-colors duration-300 sm:h-5 sm:w-5", item.colorClass)} />
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
