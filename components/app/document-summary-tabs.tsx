"use client";

import { useState } from "react";

import { AnalysisRichText } from "@/components/app/analysis-rich-text";
import type { DocumentAnalysisRecord } from "@/lib/types";

export function DocumentSummaryTabs({
  shortText,
  longText,
  highlightTerms,
  difficultTerms,
  shortLabel = "Kurz erklärt",
  longLabel = "Mehr Details"
}: {
  shortText: string;
  longText: string;
  highlightTerms: string[];
  difficultTerms: NonNullable<DocumentAnalysisRecord["difficult_terms"]>;
  shortLabel?: string;
  longLabel?: string;
}) {
  const [mode, setMode] = useState<"short" | "long">("short");

  return (
    <div className="space-y-4">
      <div className="inline-flex rounded-2xl border border-[var(--line)] bg-[var(--background-strong)] p-1">
        <button
          type="button"
          className={`min-h-10 rounded-xl px-4 text-sm font-medium transition ${
            mode === "short" ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)]" : "text-[var(--muted)]"
          }`}
          onClick={() => setMode("short")}
          aria-pressed={mode === "short"}
        >
          {shortLabel}
        </button>
        <button
          type="button"
          className={`min-h-10 rounded-xl px-4 text-sm font-medium transition ${
            mode === "long" ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)]" : "text-[var(--muted)]"
          }`}
          onClick={() => setMode("long")}
          aria-pressed={mode === "long"}
        >
          {longLabel}
        </button>
      </div>

      <AnalysisRichText
        text={mode === "long" ? longText : shortText}
        highlightTerms={highlightTerms}
        difficultTerms={difficultTerms}
      />
    </div>
  );
}
