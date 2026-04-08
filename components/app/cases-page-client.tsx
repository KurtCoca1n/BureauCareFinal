"use client";

import { useMemo, useState } from "react";

import { CaseCard } from "@/components/app/case-card";
import { Card } from "@/components/ui/card";
import type { CasesListCopy } from "@/lib/case-ui";
import { caseMatchesCasesFilter, type CasesListFilter } from "@/lib/case-priority";
import type { CaseOverview } from "@/lib/queries";

const FILTERS: CasesListFilter[] = ["all", "open", "important", "done"];

export function CasesPageClient({
  cases,
  locale,
  copy
}: {
  cases: CaseOverview[];
  locale: string;
  copy: CasesListCopy;
}) {
  const [filter, setFilter] = useState<CasesListFilter>("all");

  const filtered = useMemo(
    () => cases.filter((c) => caseMatchesCasesFilter(c, filter)),
    [cases, filter]
  );

  const filterLabel = (f: CasesListFilter) => {
    switch (f) {
      case "all":
        return copy.filterAll;
      case "open":
        return copy.filterOpen;
      case "important":
        return copy.filterImportant;
      case "done":
        return copy.filterDone;
      default:
        return copy.filterAll;
    }
  };

  return (
    <div className="space-y-5">
      <div
        className="flex flex-wrap gap-2 rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.65)] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]"
        role="tablist"
        aria-label={copy.filterAll}
      >
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            role="tab"
            aria-selected={filter === f}
            onClick={() => setFilter(f)}
            className={`min-h-10 flex-1 rounded-[18px] px-3 py-2 text-center text-sm font-medium transition sm:min-h-0 sm:flex-none sm:px-4 ${
              filter === f
                ? "bg-white text-[var(--foreground)] shadow-[0_6px_18px_rgba(43,43,43,0.06)] ring-1 ring-[rgba(95,163,163,0.2)]"
                : "text-[var(--muted)] hover:text-[var(--foreground)]/85"
            }`}
          >
            {filterLabel(f)}
          </button>
        ))}
      </div>

      {filtered.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 xl:gap-4">
          {filtered.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} locale={locale} />
          ))}
        </div>
      ) : (
        <Card className="border-dashed border-[var(--line-strong)] bg-[var(--surface)]/70 px-4 py-6 text-center text-sm text-[var(--muted)]">
          {copy.filterEmpty}
        </Card>
      )}
    </div>
  );
}
