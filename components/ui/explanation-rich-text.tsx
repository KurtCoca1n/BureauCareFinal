"use client";

import { Fragment } from "react";

import { ExplainableTerm } from "@/components/ui/explainable-term";
import { hasGlossaryEntry, parseExplainableText } from "@/lib/glossary";

export function ExplanationRichText({
  text,
  locale
}: {
  text: string;
  locale: string;
}) {
  const parts = parseExplainableText(text);

  return (
    <>
      {parts.map((part, index) => {
        if (part.type === "text") {
          return <Fragment key={`${part.type}-${index}`}>{part.value}</Fragment>;
        }

        if (!hasGlossaryEntry(part.termId)) {
          return <Fragment key={`${part.type}-${index}`}>{part.label}</Fragment>;
        }

        return (
          <ExplainableTerm key={`${part.type}-${part.termId}-${index}`} termId={part.termId} locale={locale}>
            {part.label}
          </ExplainableTerm>
        );
      })}
    </>
  );
}
