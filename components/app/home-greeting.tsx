"use client";

import { useEffect, useMemo, useState } from "react";

import { getSessionDayPhase, type DayPhase } from "@/lib/day-phase";
import { getHomeGreetingCopy } from "@/lib/home-greeting-v2";
import { normalizePreferredLanguage } from "@/lib/languages";

const LINE_SESSION_PREFIX = "bureaucare-home-line";
const GREETING_SESSION_PREFIX = "bureaucare-home-greeting";

function getSessionKey(prefix: string, locale: string, phase: DayPhase) {
  return `${prefix}:${locale}:${phase}`;
}

export function HomeGreeting({
  locale,
  fullName,
  greetingBase: greetingBaseProp,
  greetings,
  initialSupportLine,
  supportLines,
  initialPhase
}: {
  locale: string;
  fullName: string | null;
  /** Begrüßungstext ohne Namen (Zeile 1); Name nur in Zeile 2 */
  greetingBase: string;
  greetings: string[];
  initialSupportLine: string;
  supportLines: string[];
  initialPhase: DayPhase;
}) {
  const fallbackLines = useMemo(() => (supportLines.length ? supportLines : [initialSupportLine]), [initialSupportLine, supportLines]);
  const fallbackGreetings = useMemo(() => (greetings.length ? greetings : [greetingBaseProp]), [greetingBaseProp, greetings]);
  const [phase, setPhase] = useState<DayPhase>(initialPhase);
  const [headlineLine1, setHeadlineLine1] = useState(greetingBaseProp);
  const [supportLine, setSupportLine] = useState(initialSupportLine);

  useEffect(() => {
    const sessionPhase = getSessionDayPhase();
    setPhase(sessionPhase);

    const copy = getHomeGreetingCopy(locale);
    const phaseCopy = copy[sessionPhase];
    const availableGreetings = phaseCopy.greetings.length ? phaseCopy.greetings : fallbackGreetings;
    const availableLines = phaseCopy.supportLines.length ? phaseCopy.supportLines : fallbackLines;
    const greetingKey = getSessionKey(GREETING_SESSION_PREFIX, locale, sessionPhase);
    const lineKey = getSessionKey(LINE_SESSION_PREFIX, locale, sessionPhase);
    const existingGreeting = window.sessionStorage.getItem(greetingKey);
    const existingLine = window.sessionStorage.getItem(lineKey);

    if (existingGreeting && availableGreetings.includes(existingGreeting)) {
      setHeadlineLine1(existingGreeting);
    } else {
      const greetingSeed = locale.length + new Date().getDate() + new Date().getMonth() + sessionPhase.length;
      const nextGreeting = availableGreetings[greetingSeed % availableGreetings.length] ?? availableGreetings[0] ?? greetingBaseProp;
      window.sessionStorage.setItem(greetingKey, nextGreeting);
      setHeadlineLine1(nextGreeting);
    }

    if (existingLine && availableLines.includes(existingLine)) {
      setSupportLine(existingLine);
    } else {
      const lineSeed = locale.length + new Date().getDate() + new Date().getMonth() + availableLines.length;
      const nextLine = availableLines[lineSeed % availableLines.length] ?? availableLines[0] ?? initialSupportLine;
      window.sessionStorage.setItem(lineKey, nextLine);
      setSupportLine(nextLine);
    }
  }, [fallbackGreetings, fallbackLines, greetingBaseProp, initialSupportLine, locale]);

  const nameComma = normalizePreferredLanguage(locale) === "zh" ? "，" : ", ";

  return (
    <section
      className="flex flex-col items-center space-y-4 pt-8 text-center md:pt-10"
      data-day-phase={phase}
    >
      <h1 className="page-title mx-auto w-full max-w-[min(100%,42rem)] text-balance text-[clamp(2.35rem,5.2vw,4.5rem)] leading-[1.1] tracking-[-0.045em] sm:max-w-[min(100%,52rem)]">
        <span className="page-title-accent block">
          {headlineLine1}
          {fullName ? nameComma : null}
        </span>
        {fullName ? (
          <span className="page-title-accent mt-1.5 block sm:mt-2">
            {fullName}
          </span>
        ) : null}
      </h1>
      <p className="max-w-2xl text-lg font-medium leading-8 text-[color:color-mix(in_srgb,var(--foreground)_72%,var(--muted))]">
        {supportLine}
      </p>
    </section>
  );
}
