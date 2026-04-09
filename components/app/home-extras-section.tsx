import Link from "next/link";

import { Card } from "@/components/ui/card";
import { getCopy } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { selectHomeExtrasPills } from "@/lib/home-extras-personalization";
import type { MonthlyUsageSummary } from "@/lib/usage";
import type { Profile, WelcomeProfileRecord } from "@/lib/types";

export async function HomeExtrasSection({
  locale,
  profile,
  welcomeProfile,
  usageSummary,
  openTasksCount,
  openCasesCount
}: {
  locale: string;
  profile: Profile | null;
  welcomeProfile: WelcomeProfileRecord | null;
  usageSummary: MonthlyUsageSummary | null;
  openTasksCount: number;
  openCasesCount: number;
}) {
  const copy = getCopy(locale);
  const pills = selectHomeExtrasPills(
    { locale, profile, welcomeProfile, usageSummary, openTasksCount, openCasesCount },
    2,
    4
  );

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
                key={pill.id}
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
