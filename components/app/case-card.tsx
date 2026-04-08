import Link from "next/link";
import { ArrowUpRight, Clock3, FolderOpen } from "lucide-react";
import type { Route } from "next";

import { Card } from "@/components/ui/card";
import { getCaseListPrimaryAndTopic } from "@/lib/case-card-display";
import { getCaseText, getCasesListCopy } from "@/lib/case-ui";
import { getCaseAttentionLevel } from "@/lib/case-priority";
import { parseCaseBrief } from "@/lib/case-brief";
import { getDateLocale } from "@/lib/i18n";
import type { CaseOverview } from "@/lib/queries";

function attentionBarClass(level: ReturnType<typeof getCaseAttentionLevel>) {
  switch (level) {
    case "high":
      return "bg-[rgba(95,163,163,0.35)]";
    case "soon":
      return "bg-[rgba(242,166,90,0.38)]";
    case "open":
      return "bg-[rgba(111,168,220,0.28)]";
    case "done":
      return "bg-[rgba(123,191,159,0.32)]";
    default:
      return "bg-[var(--line)]";
  }
}

function priorityLabel(
  level: ReturnType<typeof getCaseAttentionLevel>,
  copy: ReturnType<typeof getCasesListCopy>
) {
  switch (level) {
    case "high":
      return copy.priorityHigh;
    case "soon":
      return copy.prioritySoon;
    case "open":
      return copy.priorityOpen;
    case "done":
      return copy.priorityDone;
    default:
      return copy.priorityOpen;
  }
}

export function CaseCard({
  caseItem,
  locale = "de",
  compact = false
}: {
  caseItem: CaseOverview;
  locale?: string;
  compact?: boolean;
}) {
  const listCopy = getCasesListCopy(locale);
  const legacy = getCaseText(locale);
  const brief = parseCaseBrief(caseItem.case_brief);
  const attention = getCaseAttentionLevel(caseItem);
  const { primary, topic } = getCaseListPrimaryAndTopic(caseItem, brief, legacy.unknownOrganization);

  return (
    <Link href={`/app/cases/${caseItem.id}` as Route}>
      <Card className="group flex h-full flex-col overflow-hidden border-[var(--line)] p-0 shadow-[0_8px_26px_rgba(43,43,43,0.04)] transition hover:border-[rgba(95,163,163,0.28)] hover:shadow-[0_12px_32px_rgba(95,163,163,0.07)]">
        <div className={`h-1 w-full ${attentionBarClass(attention)}`} aria-hidden />
        <div className={compact ? "flex flex-1 flex-col gap-2 p-3.5" : "flex flex-1 flex-col gap-2.5 p-4 sm:p-4"}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex min-w-0 flex-1 items-start gap-2">
              <div
                className={`shrink-0 rounded-lg bg-[var(--accent-soft)] text-[var(--accent)] ${compact ? "p-1.5" : "p-2"}`}
              >
                <FolderOpen className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} aria-hidden />
              </div>
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-1">
                  <span
                    className={`inline-flex max-w-full rounded-full border px-1.5 py-0.5 font-medium leading-none text-[var(--foreground)]/90 ${compact ? "text-[10px]" : "text-[11px]"}`}
                    style={{
                      borderColor:
                        attention === "high"
                          ? "rgba(95,163,163,0.35)"
                          : attention === "soon"
                            ? "rgba(242,166,90,0.4)"
                            : attention === "done"
                              ? "rgba(123,191,159,0.45)"
                              : "rgba(111,168,220,0.35)"
                    }}
                  >
                    {priorityLabel(attention, listCopy)}
                  </span>
                  {caseItem.openTasksCount > 0 ? (
                    <span className={`text-[var(--muted)] ${compact ? "text-[10px]" : "text-[11px]"}`}>
                      {caseItem.openTasksCount} {legacy.openCount}
                    </span>
                  ) : null}
                </div>
                <p
                  className={`break-words font-semibold leading-tight text-[var(--foreground)] ${compact ? "text-xs" : "text-sm sm:text-[0.9375rem]"}`}
                >
                  {primary}
                </p>
                {topic ? (
                  <p
                    className={`line-clamp-1 text-[var(--muted)] ${compact ? "text-[11px] leading-snug" : "text-xs leading-snug"}`}
                  >
                    {topic}
                  </p>
                ) : null}
              </div>
            </div>
            <ArrowUpRight
              className={`shrink-0 text-[var(--muted)] transition group-hover:text-[var(--accent)] ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}`}
            />
          </div>

          <div
            className={`mt-auto flex items-center gap-1 text-[var(--muted)] ${compact ? "text-[10px]" : "text-[11px] sm:text-xs"}`}
          >
            <Clock3 className={`shrink-0 ${compact ? "h-2.5 w-2.5" : "h-3 w-3"}`} aria-hidden />
            <span className="truncate">
              {legacy.latestActivity}: {new Date(caseItem.latestActivityAt).toLocaleDateString(getDateLocale(locale as never))}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
