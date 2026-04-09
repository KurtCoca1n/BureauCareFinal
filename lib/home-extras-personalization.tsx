import type { ReactNode } from "react";
import type { Route } from "next";

import { HomeExtraGoalsTargetIcon, HomeExtraRefundIcon } from "@/components/app/home-extras-icons";
import { getCopy } from "@/lib/i18n";
import { getGoalsCopy } from "@/lib/goals-ui";
import { normalizePreferredLanguage } from "@/lib/languages";
import type { Profile, WelcomeProfileRecord } from "@/lib/types";
import type { MonthlyUsageSummary } from "@/lib/usage";
import { cn } from "@/lib/utils";

const ICON_BOX = "h-[1.35rem] w-[1.35rem] sm:h-7 sm:w-7";

export type HomeExtraPill = {
  id: string;
  href: Route;
  label: string;
  leading: ReactNode;
  pillClass: string;
};

type Context = {
  locale: string;
  profile: Profile | null;
  welcomeProfile: WelcomeProfileRecord | null;
  usageSummary: MonthlyUsageSummary | null;
  openTasksCount: number;
  openCasesCount: number;
};

function looksGerman(nationality: string | null | undefined): boolean {
  const v = (nationality ?? "").trim().toLowerCase();
  if (!v) return false;
  return /\b(de|deu|german|deutsch|deutsche)\b/.test(v);
}

function shouldShowWelcomeToGermany(ctx: Context): boolean {
  const lang = normalizePreferredLanguage(ctx.locale);
  if (lang !== "de") return true;

  const wp = ctx.welcomeProfile;
  if (!wp) return false;

  if (!looksGerman(wp.nationality)) return true;

  const hasUnclearSettling =
    wp.registration_status !== "yes" ||
    wp.health_insurance_status !== "yes" ||
    wp.housing_status !== "yes" ||
    wp.work_status !== "yes";

  return hasUnclearSettling;
}

function basePillClasses(variant: "gold" | "blue" | "green" | "orange" | "petrol") {
  if (variant === "gold") {
    return cn(
      "border border-[rgba(214,180,120,0.28)]",
      "bg-[radial-gradient(ellipse_150%_100%_at_50%_-35%,rgba(255,255,255,0.97)_0%,rgba(255,250,242,0.55)_45%,transparent_72%),linear-gradient(178deg,#ffffff_0%,#fff9f2_42%,#fdf3e6_100%)]",
      "text-[#6b5c42]/90 shadow-[0_4px_18px_rgba(160,120,60,0.11),0_10px_32px_rgba(120,90,45,0.06),inset_0_1px_0_rgba(255,255,255,0.92)]",
      "hover:border-[rgba(200,165,110,0.38)]",
      "hover:bg-[radial-gradient(ellipse_140%_95%_at_50%_-30%,rgba(255,255,255,0.95)_0%,rgba(255,248,238,0.5)_48%,transparent_70%),linear-gradient(178deg,#ffffff_0%,#fffbf5_40%,#fef6ea_100%)]",
      "hover:shadow-[0_10px_36px_rgba(160,120,60,0.16),0_4px_14px_rgba(100,75,35,0.08),inset_0_1px_0_rgba(255,255,255,0.96)]"
    );
  }
  if (variant === "blue") {
    return cn(
      "border border-[rgba(130,170,210,0.28)]",
      "bg-[radial-gradient(ellipse_150%_100%_at_50%_-35%,rgba(255,255,255,0.98)_0%,rgba(240,248,255,0.55)_45%,transparent_72%),linear-gradient(178deg,#ffffff_0%,#f5f9fd_42%,#eaf2fb_100%)]",
      "text-[#3d5a72]/90 shadow-[0_4px_18px_rgba(90,130,175,0.12),0_10px_32px_rgba(70,110,155,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]",
      "hover:border-[rgba(115,160,205,0.38)]",
      "hover:bg-[radial-gradient(ellipse_140%_95%_at_50%_-30%,rgba(255,255,255,0.96)_0%,rgba(238,246,252,0.52)_48%,transparent_70%),linear-gradient(178deg,#ffffff_0%,#f7fbff_40%,#eef5fc_100%)]",
      "hover:shadow-[0_10px_36px_rgba(90,130,175,0.18),0_4px_14px_rgba(60,100,145,0.09),inset_0_1px_0_rgba(255,255,255,0.97)]"
    );
  }
  if (variant === "green") {
    return cn(
      "border border-[rgba(110,175,145,0.26)]",
      "bg-[radial-gradient(ellipse_150%_100%_at_50%_-35%,rgba(255,255,255,0.97)_0%,rgba(244,252,248,0.55)_45%,transparent_72%),linear-gradient(178deg,#ffffff_0%,#f4faf7_42%,#e8f4ed_100%)]",
      "text-[#35624d]/90 shadow-[0_4px_18px_rgba(70,140,110,0.11),0_10px_32px_rgba(50,110,85,0.06),inset_0_1px_0_rgba(255,255,255,0.92)]",
      "hover:border-[rgba(95,160,130,0.36)]",
      "hover:bg-[radial-gradient(ellipse_140%_95%_at_50%_-30%,rgba(255,255,255,0.95)_0%,rgba(242,250,246,0.52)_48%,transparent_70%),linear-gradient(178deg,#ffffff_0%,#f6fbf8_40%,#ecf6f0_100%)]",
      "hover:shadow-[0_10px_36px_rgba(70,140,110,0.16),0_4px_14px_rgba(45,100,75,0.08),inset_0_1px_0_rgba(255,255,255,0.96)]"
    );
  }
  if (variant === "orange") {
    return cn(
      "border border-[rgba(210,170,95,0.24)]",
      "bg-[radial-gradient(ellipse_150%_100%_at_50%_-35%,rgba(255,255,255,0.98)_0%,rgba(255,248,238,0.55)_45%,transparent_72%),linear-gradient(178deg,#ffffff_0%,#fff7ef_42%,#fdf0e3_100%)]",
      "text-[#6d4c2a]/90 shadow-[0_4px_18px_rgba(170,120,70,0.11),0_10px_32px_rgba(120,80,40,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]",
      "hover:border-[rgba(200,150,95,0.36)]"
    );
  }
  return cn(
    "border border-[rgba(95,163,163,0.22)]",
    "bg-[radial-gradient(ellipse_150%_100%_at_50%_-35%,rgba(255,255,255,0.98)_0%,rgba(238,246,245,0.55)_45%,transparent_72%),linear-gradient(178deg,#ffffff_0%,#f4fbfa_42%,#e8f4f3_100%)]",
    "text-[#2f5a59]/90 shadow-[0_4px_18px_rgba(65,130,125,0.11),0_10px_32px_rgba(50,110,105,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]",
    "hover:border-[rgba(95,163,163,0.36)]"
  );
}

function buildPool(ctx: Context): HomeExtraPill[] {
  const copy = getCopy(ctx.locale);
  const goalsCopy = getGoalsCopy(ctx.locale);

  const welcomePill: HomeExtraPill = {
    id: "welcome",
    href: "/app/welcome",
    label: copy.home.extrasWelcomeButton,
    leading: (
      <span className="shrink-0 text-[1.35rem] leading-none sm:text-[1.5rem]" role="img" aria-label="Deutschland">
        🇩🇪
      </span>
    ),
    pillClass: basePillClasses("blue")
  };

  return [
    {
      id: "refunds",
      href: "/app/refunds",
      label: copy.nav.refunds,
      leading: <HomeExtraRefundIcon className={ICON_BOX} />,
      pillClass: basePillClasses("gold")
    },
    welcomePill,
    {
      id: "self_employment",
      href: "/app/self-employment",
      label: ctx.locale === "de" ? "Selbstständigkeit" : "Self-employment",
      leading: (
        <span className="shrink-0 text-[1.1rem] leading-none sm:text-[1.3rem]" role="img" aria-label="Selbstständigkeit">
          💼
        </span>
      ),
      pillClass: basePillClasses("petrol")
    },
    {
      id: "goals",
      href: "/app/goals",
      label: goalsCopy.navLabel,
      leading: <HomeExtraGoalsTargetIcon className={ICON_BOX} />,
      pillClass: basePillClasses("green")
    },
    {
      id: "tasks",
      href: "/app/tasks",
      label: copy.nav.tasks,
      leading: (
        <span className="shrink-0 text-[1.1rem] leading-none sm:text-[1.3rem]" role="img" aria-label="Aufgaben">
          ✅
        </span>
      ),
      pillClass: basePillClasses("petrol")
    },
    {
      id: "processes",
      href: "/app/processes",
      label: copy.nav.processes,
      leading: (
        <span className="shrink-0 text-[1.1rem] leading-none sm:text-[1.3rem]" role="img" aria-label="Vorgänge">
          🧭
        </span>
      ),
      pillClass: basePillClasses("orange")
    }
  ];
}

function scorePill(id: string, ctx: Context): number {
  const showWelcome = shouldShowWelcomeToGermany(ctx);

  if (id === "welcome") return showWelcome ? 95 : -1000;
  if (id === "tasks") return ctx.openTasksCount > 0 ? 92 : 55;
  if (id === "self_employment") return 68;

  if (id === "processes") {
    const uploads = ctx.usageSummary?.uploadCount ?? 0;
    return uploads <= 1 ? 85 : 60;
  }

  if (id === "refunds") {
    const hasDocs = (ctx.usageSummary?.uploadCount ?? 0) > 0;
    return hasDocs ? 78 : 52;
  }

  if (id === "goals") {
    const hasCases = ctx.openCasesCount > 0;
    return hasCases ? 74 : 58;
  }

  return 0;
}

function clampInt(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.trunc(n)));
}

export function selectHomeExtrasPills(ctx: Context, min = 2, max = 4): HomeExtraPill[] {
  const pool = buildPool(ctx);
  const cappedMin = clampInt(min, 2, 4);
  const cappedMax = clampInt(max, cappedMin, 4);

  const scored = pool
    .map((pill) => ({ pill, score: scorePill(pill.id, ctx) }))
    .filter((x) => x.score > -999)
    .sort((a, b) => b.score - a.score);

  const selected: HomeExtraPill[] = [];
  for (const item of scored) {
    selected.push(item.pill);
    if (selected.length >= cappedMax) break;
  }

  if (selected.length < cappedMin) {
    const fallbackOrder = ["tasks", "processes", "refunds", "goals", "welcome"];
    for (const id of fallbackOrder) {
      if (selected.length >= cappedMin) break;
      const pill = pool.find((p) => p.id === id);
      if (!pill) continue;
      if (pill.id === "welcome" && scorePill("welcome", ctx) < 0) continue;
      if (!selected.some((p) => p.id === pill.id)) selected.push(pill);
    }
  }

  return selected.slice(0, cappedMax);
}

