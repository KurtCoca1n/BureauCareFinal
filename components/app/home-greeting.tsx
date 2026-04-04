"use client";

import { useEffect, useMemo, useState } from "react";

import { getSessionDayPhase, type DayPhase } from "@/lib/day-phase";
import { getHomeGreetingCopy, joinGreetingName } from "@/lib/home-greeting-v2";

const LINE_SESSION_PREFIX = "bureaucare-home-line";
const GREETING_SESSION_PREFIX = "bureaucare-home-greeting";

function getSessionKey(prefix: string, locale: string, phase: DayPhase) {
  return `${prefix}:${locale}:${phase}`;
}

function isDayPhase(value: string | null): value is DayPhase {
  return value === "morning" || value === "day" || value === "evening" || value === "night";
}

export function HomeGreeting({
  locale,
  fullName,
  greeting,
  greetings,
  initialSupportLine,
  supportLines
}: {
  locale: string;
  fullName: string | null;
  greeting: string;
  greetings: string[];
  initialSupportLine: string;
  supportLines: string[];
}) {
  const fallbackLines = useMemo(() => (supportLines.length ? supportLines : [initialSupportLine]), [initialSupportLine, supportLines]);
  const fallbackGreetings = useMemo(() => (greetings.length ? greetings : [greeting]), [greeting, greetings]);
  const [phase, setPhase] = useState<DayPhase>("day");
  const [headline, setHeadline] = useState(greeting);
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
      setHeadline(joinGreetingName(existingGreeting, fullName, locale));
    } else {
      const greetingSeed = locale.length + new Date().getDate() + new Date().getMonth() + sessionPhase.length;
      const nextGreeting = availableGreetings[greetingSeed % availableGreetings.length] ?? availableGreetings[0] ?? greeting;
      window.sessionStorage.setItem(greetingKey, nextGreeting);
      setHeadline(joinGreetingName(nextGreeting, fullName, locale));
    }

    if (existingLine && availableLines.includes(existingLine)) {
      setSupportLine(existingLine);
    } else {
      const lineSeed = locale.length + new Date().getDate() + new Date().getMonth() + availableLines.length;
      const nextLine = availableLines[lineSeed % availableLines.length] ?? availableLines[0] ?? initialSupportLine;
      window.sessionStorage.setItem(lineKey, nextLine);
      setSupportLine(nextLine);
    }
  }, [fallbackGreetings, fallbackLines, fullName, greeting, initialSupportLine, locale]);

  return (
    <section className="space-y-4 pt-4" data-day-phase={phase}>
      <h1 className="page-title page-title-accent max-w-[18ch] text-[clamp(2.4rem,4vw,4.35rem)]">
        {headline}
      </h1>
      <p className="max-w-3xl text-lg font-medium leading-8 text-[color:color-mix(in_srgb,var(--foreground)_72%,var(--muted))]">
        {supportLine}
      </p>
    </section>
  );
}
