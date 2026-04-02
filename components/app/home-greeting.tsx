"use client";

import { useEffect, useMemo, useState } from "react";

const SESSION_PREFIX = "bureaucare-home-line";

function getSessionKey(locale: string, greeting: string) {
  return `${SESSION_PREFIX}:${locale}:${greeting}`;
}

export function HomeGreeting({
  locale,
  greeting,
  initialSupportLine,
  supportLines
}: {
  locale: string;
  greeting: string;
  initialSupportLine: string;
  supportLines: string[];
}) {
  const fallbackLines = useMemo(() => supportLines.length ? supportLines : [initialSupportLine], [initialSupportLine, supportLines]);
  const [supportLine, setSupportLine] = useState(initialSupportLine);

  useEffect(() => {
    const key = getSessionKey(locale, greeting);
    const existing = window.sessionStorage.getItem(key);
    if (existing && fallbackLines.includes(existing)) {
      setSupportLine(existing);
      return;
    }

    const seed = greeting.length + new Date().getDate() + new Date().getMonth();
    const next = fallbackLines[seed % fallbackLines.length] ?? initialSupportLine;
    window.sessionStorage.setItem(key, next);
    setSupportLine(next);
  }, [fallbackLines, greeting, initialSupportLine, locale]);

  return (
    <section className="space-y-4 pt-4">
      <h1 className="page-title page-title-accent max-w-[18ch] text-[clamp(2.4rem,4vw,4.35rem)]">
        {greeting}
      </h1>
      <p className="max-w-3xl text-lg font-medium leading-8 text-[color:color-mix(in_srgb,var(--foreground)_72%,var(--muted))]">
        {supportLine}
      </p>
    </section>
  );
}
