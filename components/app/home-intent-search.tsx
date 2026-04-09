"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import { ArrowRight, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { filterQuickSuggestions, labelForIntent, matchHomeIntent, type HomeQuickSuggestion } from "@/lib/home-intent-router";
import { normalizePreferredLanguage } from "@/lib/languages";
import { cn } from "@/lib/utils";

const COPY = {
  de: {
    placeholder: "Wobei brauchst du Hilfe?",
    placeholderAlt: "Beschreibe dein Problem …",
    hint: "Ein Stichwort reicht — wir schlagen dir den passenden Weg vor.",
    submit: "Weiter",
    previewLabel: "Passt für dich:",
    noMatchTitle: "Kein genauer Treffer — wähle einen Einstieg:",
    fallbackUpload: "Dokument hochladen",
    fallbackProcesses: "Anträge & Vorgänge",
    fallbackCases: "Fall öffnen",
    fallbackWelcome: "Hilfe & Einstieg",
    fallbackTasks: "Aufgaben",
    suggestionsTitle: "Vorschläge"
  },
  en: {
    placeholder: "What do you need help with?",
    placeholderAlt: "Describe your problem…",
    hint: "A keyword is enough — we will suggest the right place.",
    submit: "Continue",
    previewLabel: "Suggested for you:",
    noMatchTitle: "No exact match — choose a starting point:",
    fallbackUpload: "Upload a document",
    fallbackProcesses: "Applications & processes",
    fallbackCases: "Open cases",
    fallbackWelcome: "Help & welcome",
    fallbackTasks: "Tasks",
    suggestionsTitle: "Suggestions"
  }
} as const;

function suggestionLabel(s: HomeQuickSuggestion, lang: "de" | "en") {
  return lang === "de" ? s.labelDe : s.labelEn;
}

export function HomeIntentSearch({ locale }: { locale: string | null | undefined }) {
  const router = useRouter();
  const lang = normalizePreferredLanguage(locale) === "en" ? "en" : "de";
  const c = COPY[lang];

  const [value, setValue] = useState("");
  const [showFallback, setShowFallback] = useState(false);

  const suggestions = useMemo(() => filterQuickSuggestions(value, lang), [value, lang]);

  const preview = useMemo(() => {
    const trimmed = value.trim();
    if (!trimmed) return null;
    return matchHomeIntent(trimmed);
  }, [value]);

  function navigateTo(href: string) {
    router.push(href as Route);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed) {
      setShowFallback(true);
      return;
    }
    const m = matchHomeIntent(trimmed);
    if (m) {
      navigateTo(m.href);
      return;
    }
    setShowFallback(true);
  }

  return (
    <Card className="overflow-hidden border border-[rgba(95,163,163,0.2)] bg-[linear-gradient(165deg,rgba(255,255,255,0.98),rgba(246,250,249,0.92))] p-1 shadow-[0_12px_36px_rgba(43,43,43,0.05)] sm:p-1.5">
      <form onSubmit={handleSubmit} className="space-y-3 p-3 sm:p-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
          <div className="relative min-w-0 flex-1">
            <label htmlFor="home-intent-search" className="sr-only">
              {c.placeholder}
            </label>
            <Search
              className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--muted)]"
              aria-hidden
            />
            <input
              id="home-intent-search"
              type="search"
              name="q"
              autoComplete="off"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setShowFallback(false);
              }}
              placeholder={c.placeholder}
              title={c.placeholderAlt}
              className="min-h-[52px] w-full rounded-[20px] border border-[var(--line)] bg-white/95 py-3 pl-12 pr-4 text-[0.9375rem] text-[var(--foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none ring-0 transition placeholder:text-[var(--muted)] focus:border-[rgba(95,163,163,0.45)] focus:ring-2 focus:ring-[rgba(95,163,163,0.18)]"
            />
          </div>
          <Button type="submit" className="min-h-[52px] shrink-0 rounded-2xl px-6 sm:min-w-[8.5rem]">
            {c.submit}
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden />
          </Button>
        </div>
        <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-[0.8125rem]">{c.hint}</p>

        {preview ? (
          <div className="flex flex-wrap items-center gap-2 rounded-[18px] border border-[rgba(95,163,163,0.15)] bg-[rgba(95,163,163,0.06)] px-3 py-2.5 text-sm">
            <span className="font-medium text-[var(--foreground)]/85">{c.previewLabel}</span>
            <span className="text-[var(--foreground)]/95">{labelForIntent(preview, lang)}</span>
          </div>
        ) : null}

        <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">{c.suggestionsTitle}</p>

        <ul className="flex flex-wrap gap-2" role="listbox" aria-label={c.suggestionsTitle}>
          {suggestions.map((s) => (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => navigateTo(s.href)}
                className={cn(
                  "rounded-full border border-[var(--line)] bg-white/90 px-3 py-1.5 text-left text-[13px] font-medium text-[var(--foreground)]/90 shadow-[0_4px_14px_rgba(43,43,43,0.04)] transition",
                  "hover:border-[rgba(95,163,163,0.35)] hover:bg-[rgba(246,250,249,0.95)]"
                )}
              >
                {suggestionLabel(s, lang)}
              </button>
            </li>
          ))}
        </ul>

        {showFallback ? (
          <div className="space-y-3 rounded-[20px] border border-dashed border-[var(--line-strong)] bg-[rgba(247,246,244,0.65)] px-4 py-4">
            <p className="text-sm font-semibold text-[var(--foreground)]">{c.noMatchTitle}</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <Link
                href={"/app/upload" as Route}
                className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[rgba(95,163,163,0.35)]"
              >
                {c.fallbackUpload}
              </Link>
              <Link
                href={"/app/processes" as Route}
                className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[rgba(95,163,163,0.35)]"
              >
                {c.fallbackProcesses}
              </Link>
              <Link
                href={"/app/cases" as Route}
                className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[rgba(95,163,163,0.35)]"
              >
                {c.fallbackCases}
              </Link>
              <Link
                href={"/app/welcome" as Route}
                className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[rgba(95,163,163,0.35)]"
              >
                {c.fallbackWelcome}
              </Link>
              <Link
                href={"/app/tasks" as Route}
                className="inline-flex min-h-10 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[rgba(95,163,163,0.35)]"
              >
                {c.fallbackTasks}
              </Link>
            </div>
          </div>
        ) : null}
      </form>
    </Card>
  );
}
