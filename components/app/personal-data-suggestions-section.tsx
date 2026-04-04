import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getPersonalDataSuggestionsUiCopy, getSuggestionPriorityLabel } from "@/lib/personal-data-suggestions-ui";
import type { PersonalDataSuggestion } from "@/lib/types";

export function PersonalDataSuggestionsSection({
  locale,
  suggestions,
  compact = false
}: {
  locale: string;
  suggestions: PersonalDataSuggestion[];
  compact?: boolean;
}) {
  if (!suggestions.length) {
    return null;
  }

  const copy = getPersonalDataSuggestionsUiCopy(locale);

  return (
    <section className="space-y-5">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{compact ? copy.myDataTitle : copy.sectionTitle}</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">{compact ? copy.myDataText : copy.sectionText}</p>
        </div>
      </div>

      <div className={compact ? "grid gap-4 lg:grid-cols-3" : "grid gap-4 xl:grid-cols-3"}>
        {suggestions.map((suggestion) => (
          <Card
            key={suggestion.id}
            className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,249,255,0.94))] p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="rounded-2xl bg-[rgba(111,168,220,0.14)] p-3 text-[var(--soft-blue)]">
                <Sparkles className="h-4 w-4" />
              </div>
              <StatusBadge tone={suggestion.priority === "high" ? "accent" : suggestion.priority === "medium" ? "success" : "neutral"}>
                {getSuggestionPriorityLabel(locale, suggestion.priority)}
              </StatusBadge>
            </div>

            <div className="mt-4 space-y-2">
              <h3 className="text-base font-semibold">{suggestion.title}</h3>
              <p className="text-sm leading-6 text-[var(--muted)]">{suggestion.reason}</p>
            </div>

            <div className="mt-5">
              <Link
                href={`/app/processes/${suggestion.procedure_id}` as Route}
                className="inline-flex items-center text-sm font-medium text-[var(--accent)]"
              >
                {copy.openLabel}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
