import Link from "next/link";
import type { Route } from "next";
import { Radar } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { TrafficLightBadge } from "@/components/ui/traffic-light-badge";
import { normalizePreferredLanguage } from "@/lib/languages";
import { formatWeeklyDuePhrase } from "@/lib/weekly-overview";
import type { TerminradarItem } from "@/lib/terminradar";

type Props = {
  locale: string | null | undefined;
  dateLocale: string;
  items: TerminradarItem[];
};

function trafficLang(locale: string | null | undefined): "de" | "en" {
  return normalizePreferredLanguage(locale) === "de" ? "de" : "en";
}

export function Terminradar({ locale, dateLocale, items }: Props) {
  const lang = trafficLang(locale);
  const hasItems = items.length > 0;

  return (
    <Card className="border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(168deg,rgba(255,255,255,0.98),rgba(246,250,249,0.9))] p-5 shadow-[0_16px_40px_rgba(43,43,43,0.04)] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="neutral">Terminradar</StatusBadge>
          </div>
          <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)] sm:text-xl">
            Terminradar
          </h2>
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {lang === "en" ? "What may become important soon." : "Was bald wichtig wird."}
          </p>
        </div>
        <div className="rounded-2xl bg-[rgba(95,163,163,0.1)] p-3 text-[var(--petrol)]">
          <Radar className="h-5 w-5" aria-hidden />
        </div>
      </div>

      {hasItems ? (
        <ul className="mt-4 space-y-2.5">
          {items.map((item) => {
            const href = item.href as Route | null;
            const duePhrase = formatWeeklyDuePhrase(item.dueDateIso, dateLocale, lang, new Date());
            return (
              <li key={item.id} className="rounded-[18px] border border-[var(--line)] bg-white/92 px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <TrafficLightBadge level={item.level} lang={lang} />
                      <span className="text-xs font-semibold text-[var(--foreground)]/75">
                        {lang === "en" ? "Due" : "Fällig"}:{" "}
                        <span className="font-medium text-[var(--foreground)]">{duePhrase}</span>
                      </span>
                    </div>
                    <p className="text-sm font-semibold leading-snug text-[var(--foreground)]">{item.title}</p>
                  </div>

                  {href ? (
                    <Link
                      href={href}
                      className="shrink-0 text-sm font-semibold text-[var(--accent)] hover:text-[var(--accent-strong)]"
                    >
                      {lang === "en" ? "View" : "Ansehen"}
                    </Link>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="mt-4 rounded-[18px] border border-dashed border-[var(--line)] bg-[rgba(247,246,244,0.6)] px-4 py-3">
          <p className="text-sm leading-relaxed text-[var(--muted)]">
            {lang === "en"
              ? "Nothing urgent on your radar right now."
              : "Gerade ist nichts Dringendes im Blick."}
          </p>
        </div>
      )}
    </Card>
  );
}

