"use client";

import { useActionState, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { createSelfEmploymentImproveTasksAction, createSelfEmploymentStartTasksAction } from "@/lib/actions/self-employment";
import type { SupportedLanguage } from "@/lib/languages";
import { cn } from "@/lib/utils";

type Mode = "choose" | "start" | "improve";

type ActionState = { error: string; success: string; taskIds?: string[] };
const initialState: ActionState = { error: "", success: "" };

const AREA_OPTIONS = [
  { id: "creative", de: "Kreativ / Medien", en: "Creative / media" },
  { id: "services", de: "Dienstleistung", en: "Services" },
  { id: "food", de: "Gastronomie / Food", en: "Food / hospitality" },
  { id: "online", de: "Online / Digital", en: "Online / digital" }
] as const;

function t(locale: SupportedLanguage, de: string, en: string) {
  return locale === "de" ? de : en;
}

export function SelfEmploymentFlow({ locale }: { locale: SupportedLanguage }) {
  const [mode, setMode] = useState<Mode>("choose");
  const [area, setArea] = useState<(typeof AREA_OPTIONS)[number]["id"]>("services");
  const [sellsAlcohol, setSellsAlcohol] = useState(false);
  const [hiresEmployeesSoon, setHiresEmployeesSoon] = useState(false);
  const [shortGoal, setShortGoal] = useState("");

  const [startState, startAction, startPending] = useActionState(createSelfEmploymentStartTasksAction, initialState);
  const [improveState, improveAction, improvePending] = useActionState(createSelfEmploymentImproveTasksAction, initialState);

  const selectedAreaLabel = useMemo(() => {
    const item = AREA_OPTIONS.find((o) => o.id === area);
    if (!item) return "";
    return locale === "de" ? item.de : item.en;
  }, [area, locale]);

  return (
    <div className="mx-auto w-full max-w-[980px] space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
          {t(locale, "Selbstständigkeit", "Self-employment")}
        </h1>
        <p className="max-w-[60ch] text-base leading-7 text-[var(--muted)] sm:text-lg">
          {t(
            locale,
            "Ein ruhiger Einstieg: ein paar Fragen – dann bekommst du praktische To-dos für die nächsten Schritte.",
            "A calm start: a few questions — then you get practical to-dos for your next steps."
          )}
        </p>
      </div>

      {mode === "choose" ? (
        <Card className="rounded-[32px] border border-white/75 bg-[linear-gradient(168deg,rgba(255,255,255,0.96),rgba(244,249,252,0.92))] p-6 shadow-[0_18px_60px_rgba(25,40,60,0.08)] sm:p-8">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              {t(locale, "Was passt gerade zu dir?", "What fits you right now?")}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => setMode("start")}
                className={cn(
                  "rounded-[22px] border border-white/70 bg-white/70 px-5 py-5 text-left shadow-[0_10px_28px_rgba(25,40,60,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(25,40,60,0.1)]"
                )}
              >
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  {t(locale, "Ich möchte mich selbstständig machen", "I want to become self-employed")}
                </div>
                <div className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {t(locale, "Wir sammeln nur das Nötigste und erstellen To-dos.", "We ask only what’s needed and create to-dos.")}
                </div>
              </button>

              <button
                type="button"
                onClick={() => setMode("improve")}
                className={cn(
                  "rounded-[22px] border border-white/70 bg-white/70 px-5 py-5 text-left shadow-[0_10px_28px_rgba(25,40,60,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(25,40,60,0.1)]"
                )}
              >
                <div className="text-sm font-semibold text-[var(--foreground)]">
                  {t(locale, "Ich bin bereits selbstständig", "I’m already self-employed")}
                </div>
                <div className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {t(locale, "Kurze Tipps + sinnvolle Aufgaben für mehr Ruhe.", "Short tips + tasks to reduce stress.")}
                </div>
              </button>
            </div>
          </div>
        </Card>
      ) : null}

      {mode === "start" ? (
        <Card className="rounded-[32px] border border-white/75 bg-[linear-gradient(168deg,rgba(255,255,255,0.96),rgba(244,249,252,0.92))] p-6 shadow-[0_18px_60px_rgba(25,40,60,0.08)] sm:p-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {t(locale, "Selbstständig werden", "Become self-employed")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {t(locale, "2–3 kurze Fragen, dann To-dos.", "2–3 quick questions, then to-dos.")}
                </p>
              </div>
              <Button type="button" variant="ghost" className="justify-start sm:justify-center" onClick={() => setMode("choose")}>
                {t(locale, "Zurück", "Back")}
              </Button>
            </div>

            <form action={startAction} className="space-y-5">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="sellsAlcohol" value={sellsAlcohol ? "1" : "0"} />
              <input type="hidden" name="hiresEmployeesSoon" value={hiresEmployeesSoon ? "1" : "0"} />

              <label className="block space-y-2.5">
                <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">
                  {t(locale, "In welchem Bereich möchtest du arbeiten?", "Which area do you want to work in?")}
                </span>
                <select
                  name="area"
                  value={area}
                  onChange={(e) => setArea(e.target.value as typeof area)}
                  className="login-auth-input min-h-[3.75rem] w-full rounded-[22px] border border-white/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(255,255,255,0.92))] px-5 text-sm text-[var(--foreground)] shadow-[0_2px_12px_rgba(25,40,60,0.04)] outline-none transition-[box-shadow,border-color] duration-200 focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(95,163,163,0.18),0_4px_20px_rgba(25,40,60,0.06)]"
                >
                  {AREA_OPTIONS.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {locale === "de" ? opt.de : opt.en}
                    </option>
                  ))}
                </select>
              </label>

              {area === "food" ? (
                <div className="rounded-[22px] border border-white/70 bg-white/65 px-5 py-4 text-sm text-[var(--foreground)] shadow-[0_10px_24px_rgba(25,40,60,0.05)]">
                  <div className="font-medium">{t(locale, "Nur wenn es zu dir passt:", "Only if it fits you:")}</div>
                  <label className="mt-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={sellsAlcohol}
                      onChange={(e) => setSellsAlcohol(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--line)]"
                    />
                    <span className="text-sm text-[var(--muted)]">
                      {t(locale, "Ich verkaufe/serviere Alkohol.", "I sell/serve alcohol.")}
                    </span>
                  </label>
                </div>
              ) : null}

              {(area === "services" || area === "creative") ? (
                <div className="rounded-[22px] border border-white/70 bg-white/65 px-5 py-4 text-sm text-[var(--foreground)] shadow-[0_10px_24px_rgba(25,40,60,0.05)]">
                  <div className="font-medium">{t(locale, "Optional:", "Optional:")}</div>
                  <label className="mt-3 flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={hiresEmployeesSoon}
                      onChange={(e) => setHiresEmployeesSoon(e.target.checked)}
                      className="h-4 w-4 rounded border-[var(--line)]"
                    />
                    <span className="text-sm text-[var(--muted)]">
                      {t(locale, "Ich plane bald Mitarbeitende.", "I plan to hire soon.")}
                    </span>
                  </label>
                </div>
              ) : null}

              <label className="block space-y-2.5">
                <span className="text-sm font-medium tracking-wide text-[var(--foreground)]">
                  {t(locale, "Was ist dein nächstes Ziel? (optional)", "Your next goal (optional)")}
                </span>
                <Input
                  value={shortGoal}
                  onChange={(e) => setShortGoal(e.target.value)}
                  placeholder={t(locale, "z. B. ersten Auftrag finden", "e.g. find first client")}
                />
                <p className="text-xs leading-5 text-[var(--muted)]">
                  {t(locale, `Bereich: ${selectedAreaLabel}`, `Area: ${selectedAreaLabel}`)}
                </p>
              </label>

              {startState.error ? <p className="text-sm text-[var(--danger)]">{startState.error}</p> : null}
              {startState.success ? <p className="text-sm text-[var(--accent-strong)]">{startState.success}</p> : null}

              <Button type="submit" className="min-h-14 w-full rounded-2xl text-base" disabled={startPending}>
                {startPending ? t(locale, "Erstelle To-dos…", "Creating to-dos…") : t(locale, "To-dos erstellen", "Create to-dos")}
              </Button>
            </form>
          </div>
        </Card>
      ) : null}

      {mode === "improve" ? (
        <Card className="rounded-[32px] border border-white/75 bg-[linear-gradient(168deg,rgba(255,255,255,0.96),rgba(244,249,252,0.92))] p-6 shadow-[0_18px_60px_rgba(25,40,60,0.08)] sm:p-8">
          <div className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                  {t(locale, "Bereits selbstständig", "Already self-employed")}
                </h2>
                <p className="mt-1 text-sm leading-6 text-[var(--muted)]">
                  {t(locale, "Kurz & praktisch – ohne lange Texte.", "Short and practical — no long texts.")}
                </p>
              </div>
              <Button type="button" variant="ghost" className="justify-start sm:justify-center" onClick={() => setMode("choose")}>
                {t(locale, "Zurück", "Back")}
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                t(locale, "Halte Belege an einem Ort – eine Routine pro Woche reicht.", "Keep receipts in one place — one weekly routine is enough."),
                t(locale, "Wenn etwas unklar ist: schreibe dir 3 Fragen auf und kläre sie gezielt.", "If something is unclear: write down 3 questions and clarify them explicitly."),
                t(locale, "Plane Puffer: 30 Minuten pro Woche für Orga spart Stunden später.", "Plan buffer: 30 minutes weekly saves hours later."),
                t(locale, "Weniger Tools, mehr Klarheit: 1 System für Rechnungen & Belege.", "Fewer tools, more clarity: one system for invoices & receipts.")
              ].map((tip) => (
                <div
                  key={tip}
                  className="rounded-[22px] border border-white/70 bg-white/65 px-5 py-4 text-sm leading-6 text-[var(--muted)] shadow-[0_10px_24px_rgba(25,40,60,0.05)]"
                >
                  {tip}
                </div>
              ))}
            </div>

            <form action={improveAction} className="space-y-4">
              <input type="hidden" name="locale" value={locale} />

              {improveState.error ? <p className="text-sm text-[var(--danger)]">{improveState.error}</p> : null}
              {improveState.success ? <p className="text-sm text-[var(--accent-strong)]">{improveState.success}</p> : null}

              <Button type="submit" className="min-h-14 w-full rounded-2xl text-base" disabled={improvePending}>
                {improvePending ? t(locale, "Erstelle Aufgaben…", "Creating tasks…") : t(locale, "Praktische Aufgaben erstellen", "Create practical tasks")}
              </Button>
            </form>
          </div>
        </Card>
      ) : null}
    </div>
  );
}

