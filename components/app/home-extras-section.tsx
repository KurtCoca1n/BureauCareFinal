import Link from "next/link";
import type { ReactNode } from "react";
import type { Route } from "next";

import { HomeExtraGoalsTargetIcon, HomeExtraRefundIcon } from "@/components/app/home-extras-icons";
import { Card } from "@/components/ui/card";
import { getCopy } from "@/lib/i18n";
import { getGoalsCopy } from "@/lib/goals-ui";
import { cn } from "@/lib/utils";

const ICON_BOX = "h-[1.35rem] w-[1.35rem] sm:h-7 sm:w-7";

type ExtraPill = {
  href: Route;
  label: string;
  /** Emoji, farbige SVG-Illustrationen … */
  leading: ReactNode;
  pillClass: string;
};

/** Weichere Pastelltöne + dezente Verläufe; Icons passend zu Geld / Ankommen / Ziele. */
function buildPills(copy: ReturnType<typeof getCopy>, goalsCopy: ReturnType<typeof getGoalsCopy>): ExtraPill[] {
  return [
    {
      href: "/app/refunds",
      label: copy.nav.refunds,
      leading: <HomeExtraRefundIcon className={ICON_BOX} />,
      pillClass: cn(
        "border border-[rgba(214,180,120,0.28)]",
        "bg-[radial-gradient(ellipse_150%_100%_at_50%_-35%,rgba(255,255,255,0.97)_0%,rgba(255,250,242,0.55)_45%,transparent_72%),linear-gradient(178deg,#ffffff_0%,#fff9f2_42%,#fdf3e6_100%)]",
        "text-[#6b5c42]/90 shadow-[0_4px_18px_rgba(160,120,60,0.11),0_10px_32px_rgba(120,90,45,0.06),inset_0_1px_0_rgba(255,255,255,0.92)]",
        "hover:border-[rgba(200,165,110,0.38)]",
        "hover:bg-[radial-gradient(ellipse_140%_95%_at_50%_-30%,rgba(255,255,255,0.95)_0%,rgba(255,248,238,0.5)_48%,transparent_70%),linear-gradient(178deg,#ffffff_0%,#fffbf5_40%,#fef6ea_100%)]",
        "hover:shadow-[0_10px_36px_rgba(160,120,60,0.16),0_4px_14px_rgba(100,75,35,0.08),inset_0_1px_0_rgba(255,255,255,0.96)]"
      )
    },
    {
      href: "/app/welcome",
      label: copy.home.extrasWelcomeButton,
      leading: (
        <span className="shrink-0 text-[1.35rem] leading-none sm:text-[1.5rem]" role="img" aria-label="Deutschland">
          🇩🇪
        </span>
      ),
      pillClass: cn(
        "border border-[rgba(130,170,210,0.28)]",
        "bg-[radial-gradient(ellipse_150%_100%_at_50%_-35%,rgba(255,255,255,0.98)_0%,rgba(240,248,255,0.55)_45%,transparent_72%),linear-gradient(178deg,#ffffff_0%,#f5f9fd_42%,#eaf2fb_100%)]",
        "text-[#3d5a72]/90 shadow-[0_4px_18px_rgba(90,130,175,0.12),0_10px_32px_rgba(70,110,155,0.06),inset_0_1px_0_rgba(255,255,255,0.94)]",
        "hover:border-[rgba(115,160,205,0.38)]",
        "hover:bg-[radial-gradient(ellipse_140%_95%_at_50%_-30%,rgba(255,255,255,0.96)_0%,rgba(238,246,252,0.52)_48%,transparent_70%),linear-gradient(178deg,#ffffff_0%,#f7fbff_40%,#eef5fc_100%)]",
        "hover:shadow-[0_10px_36px_rgba(90,130,175,0.18),0_4px_14px_rgba(60,100,145,0.09),inset_0_1px_0_rgba(255,255,255,0.97)]"
      )
    },
    {
      href: "/app/goals",
      label: goalsCopy.navLabel,
      leading: <HomeExtraGoalsTargetIcon className={ICON_BOX} />,
      pillClass: cn(
        "border border-[rgba(110,175,145,0.26)]",
        "bg-[radial-gradient(ellipse_150%_100%_at_50%_-35%,rgba(255,255,255,0.97)_0%,rgba(244,252,248,0.55)_45%,transparent_72%),linear-gradient(178deg,#ffffff_0%,#f4faf7_42%,#e8f4ed_100%)]",
        "text-[#35624d]/90 shadow-[0_4px_18px_rgba(70,140,110,0.11),0_10px_32px_rgba(50,110,85,0.06),inset_0_1px_0_rgba(255,255,255,0.92)]",
        "hover:border-[rgba(95,160,130,0.36)]",
        "hover:bg-[radial-gradient(ellipse_140%_95%_at_50%_-30%,rgba(255,255,255,0.95)_0%,rgba(242,250,246,0.52)_48%,transparent_70%),linear-gradient(178deg,#ffffff_0%,#f6fbf8_40%,#ecf6f0_100%)]",
        "hover:shadow-[0_10px_36px_rgba(70,140,110,0.16),0_4px_14px_rgba(45,100,75,0.08),inset_0_1px_0_rgba(255,255,255,0.96)]"
      )
    }
  ];
}

export async function HomeExtrasSection({ locale }: { locale: string }) {
  const copy = getCopy(locale);
  const goalsCopy = getGoalsCopy(locale);
  const pills = buildPills(copy, goalsCopy);

  return (
    <section className="w-full" aria-labelledby="home-extras-heading">
      <Card className="w-full border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(168deg,rgba(255,255,255,0.99),rgba(246,250,249,0.88))] p-5 shadow-[0_18px_44px_rgba(43,43,43,0.04)] sm:p-7">
        <div className="flex flex-col gap-6 sm:gap-7">
          <header className="mx-auto flex max-w-2xl flex-col items-center space-y-3 text-center sm:space-y-4">
            <h2
              id="home-extras-heading"
              className="page-title-accent w-full text-balance text-2xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-[1.65rem] sm:leading-[1.1]"
            >
              {copy.home.extrasSectionTitle}
            </h2>
            <p className="w-full text-pretty text-sm leading-relaxed text-[var(--muted)] sm:text-[0.9375rem]">
              {copy.home.extrasSectionIntro}
            </p>
          </header>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {pills.map((pill) => (
              <Link
                key={pill.href}
                href={pill.href}
                prefetch
                className={cn(
                  "flex w-full min-h-[56px] items-center justify-center gap-2.5 rounded-full px-5 py-3.5 text-center text-base font-semibold tracking-[-0.02em] sm:min-h-[60px] sm:gap-3 sm:px-6 sm:py-4 sm:text-lg",
                  "transition-[box-shadow,transform,background-color,border-color] duration-200 ease-out",
                  "hover:-translate-y-[2px]",
                  "active:scale-[0.99] active:translate-y-0",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                  pill.pillClass
                )}
              >
                {pill.leading}
                <span>{pill.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </Card>
    </section>
  );
}
