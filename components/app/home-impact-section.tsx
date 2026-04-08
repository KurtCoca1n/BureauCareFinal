"use client";

import { useEffect, useMemo, useState } from "react";
import { Banknote, Brain, Clock3 } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type Props = {
  locale: string;
  moneyEur: number;
  timeMinutes: number;
  nervesPercent: number;
};

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches ?? false;
}

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3);
}

function useCountUp(target: number, durationMs = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!Number.isFinite(target) || target <= 0) {
      setValue(0);
      return;
    }

    if (prefersReducedMotion()) {
      setValue(target);
      return;
    }

    let raf = 0;
    const start = performance.now();
    const from = 0;

    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / durationMs);
      const eased = easeOutCubic(t);
      const next = from + (target - from) * eased;
      setValue(next);
      if (t < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs, target]);

  return value;
}

function formatMinutes(totalMinutes: number, locale: string) {
  const minutes = Math.max(0, Math.round(totalMinutes));
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) {
    return locale === "de" ? `${m}min` : `${m} min`;
  }
  if (m === 0) {
    return locale === "de" ? `${h}h` : `${h} h`;
  }
  return locale === "de" ? `${h}h ${m}min` : `${h} h ${m} min`;
}

function formatEur(amount: number, locale: string) {
  const rounded = Math.max(0, Math.round(amount));
  const formatted = new Intl.NumberFormat(locale === "de" ? "de-DE" : "en-US").format(rounded);
  return `${formatted} €`;
}

export function HomeImpactSection({ locale, moneyEur, timeMinutes, nervesPercent }: Props) {
  const lang = locale === "de" ? "de" : "en";

  const headline = lang === "de" ? "Das hast du dir bereits erspart" : "Here’s what you’ve already saved";
  const subline =
    lang === "de"
      ? "Basierend auf deinen bisherigen Aktivitäten und Vorgängen."
      : "Based on your activity and processes so far.";

  const moneyValue = useCountUp(moneyEur, 950);
  const timeValue = useCountUp(timeMinutes, 1050);
  const nervesValue = useCountUp(nervesPercent, 900);

  const moneyText = useMemo(() => formatEur(moneyValue, lang), [lang, moneyValue]);
  const timeText = useMemo(() => formatMinutes(timeValue, lang), [lang, timeValue]);
  const nervesText = useMemo(() => `−${Math.round(nervesValue)}%`, [nervesValue]);

  const cards = [
    {
      key: "money",
      icon: Banknote,
      iconClass: "bg-[rgba(214,180,120,0.16)] text-[#6b5c42]",
      label: lang === "de" ? "Geld" : "Money",
      value: moneyText,
      hint: lang === "de" ? "durch erkannte Ansprüche & vermiedene Fehler" : "from detected claims & avoided mistakes"
    },
    {
      key: "time",
      icon: Clock3,
      iconClass: "bg-[rgba(111,168,220,0.16)] text-[#3d5a72]",
      label: lang === "de" ? "Zeit" : "Time",
      value: timeText,
      hint: lang === "de" ? "nicht mit Formularen & Recherche verbracht" : "not spent on forms & research"
    },
    {
      key: "nerves",
      icon: Brain,
      iconClass: "bg-[rgba(110,175,145,0.16)] text-[#35624d]",
      label: lang === "de" ? "Nerven" : "Stress",
      value: nervesText,
      hint: lang === "de" ? "weniger Unsicherheit und Stress" : "less uncertainty and stress"
    }
  ] as const;

  return (
    <section className="w-full" aria-labelledby="home-impact-heading">
      <Card className="w-full border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(168deg,rgba(255,255,255,0.99),rgba(246,250,249,0.88))] p-5 shadow-[0_18px_44px_rgba(43,43,43,0.04)] sm:p-7">
        <div className="flex flex-col gap-6 sm:gap-7">
          <header className="mx-auto flex max-w-2xl flex-col items-center space-y-3 text-center sm:space-y-4">
            <h2
              id="home-impact-heading"
              className="page-title-accent w-full text-balance text-2xl font-semibold leading-[1.12] tracking-[-0.035em] sm:text-[1.65rem] sm:leading-[1.1]"
            >
              {headline}
            </h2>
            <p className="w-full text-pretty text-sm leading-relaxed text-[var(--muted)] sm:text-[0.9375rem]">{subline}</p>
          </header>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
            {cards.map((item) => {
              const Icon = item.icon;
              return (
                <Card
                  key={item.key}
                  className={cn(
                    "h-full rounded-[22px] border border-[var(--line)] bg-white/90 p-5 shadow-[0_10px_28px_rgba(25,40,60,0.06)]",
                    "sm:p-6"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div className={cn("mt-0.5 inline-flex rounded-2xl p-2.5", item.iconClass)}>
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium tracking-[-0.01em] text-[var(--muted)]">{item.label}</p>
                      <p
                        className="mt-2 text-[1.9rem] font-semibold leading-none tracking-[-0.04em] text-[var(--foreground)] sm:text-[2.1rem]"
                        aria-label={`${item.label}: ${item.value}`}
                      >
                        {item.value}
                      </p>
                      <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.hint}</p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </Card>
    </section>
  );
}

