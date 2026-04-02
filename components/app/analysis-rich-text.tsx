"use client";

import { useState } from "react";

import type { DocumentAnalysisRecord } from "@/lib/types";

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function AnalysisRichText({
  text,
  highlightTerms,
  difficultTerms
}: {
  text: string;
  highlightTerms: string[];
  difficultTerms: NonNullable<DocumentAnalysisRecord["difficult_terms"]>;
}) {
  const [openTerm, setOpenTerm] = useState<string | null>(null);
  const difficultMap = new Map((difficultTerms ?? []).map((item) => [item.term.toLowerCase(), item.explanation_simple]));
  const normalizedTerms = [...new Set([...(highlightTerms ?? []), ...(difficultTerms ?? []).map((item) => item.term)])].filter(Boolean);

  if (!normalizedTerms.length) {
    return <p className="text-sm leading-7 text-[var(--foreground)]">{text}</p>;
  }

  const pattern = new RegExp(`(${normalizedTerms.map(escapeRegExp).sort((a, b) => b.length - a.length).join("|")})`, "gi");
  const parts = text.split(pattern);

  return (
    <p className="text-sm leading-7 text-[var(--foreground)]">
      {parts.map((part, index) => {
        const key = `${part}-${index}`;
        const explanation = difficultMap.get(part.toLowerCase());
        const isHighlight = normalizedTerms.some((term) => term.toLowerCase() === part.toLowerCase());

        if (!isHighlight) {
          return <span key={key}>{part}</span>;
        }

        if (!explanation) {
          return (
            <strong key={key} className="rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 font-semibold text-[var(--foreground)]">
              {part}
            </strong>
          );
        }

        const isOpen = openTerm === key;

        return (
          <span key={key} className="relative inline-block">
            <button
              type="button"
              className="rounded-md bg-[var(--accent-soft)] px-1.5 py-0.5 font-semibold text-[var(--foreground)]"
              onClick={() => setOpenTerm(isOpen ? null : key)}
              onMouseEnter={() => setOpenTerm(key)}
              onMouseLeave={() => setOpenTerm((current) => (current === key ? null : current))}
            >
              {part}
            </button>
            {isOpen ? (
              <span className="absolute left-0 top-[calc(100%+8px)] z-20 w-64 rounded-2xl border border-[var(--line)] bg-white p-3 text-xs font-normal leading-5 text-[var(--foreground)] shadow-[var(--shadow)]">
                {explanation}
              </span>
            ) : null}
          </span>
        );
      })}
    </p>
  );
}
