import Link from "next/link";
import { ArrowUpRight, Clock3, FolderOpen } from "lucide-react";
import type { Route } from "next";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCaseStatusLabel, getCaseText } from "@/lib/case-ui";
import { parseCaseBrief } from "@/lib/case-brief";
import { getDateLocale } from "@/lib/i18n";
import type { CaseOverview } from "@/lib/queries";

function caseCardStatusTone(status: string) {
  if (status === "done") return "success" as const;
  if (status === "waiting") return "warning" as const;
  if (status === "in_progress") return "accent" as const;
  return "neutral" as const;
}

export function CaseCard({ caseItem, locale = "de" }: { caseItem: CaseOverview; locale?: string }) {
  const caseText = getCaseText(locale);
  const brief = parseCaseBrief(caseItem.case_brief);
  const previewLine =
    brief?.summary_short?.trim() ||
    (brief?.next_steps_preview?.length ? brief.next_steps_preview[0] : null) ||
    brief?.risk_hint?.trim() ||
    null;

  return (
    <Link href={`/app/cases/${caseItem.id}` as Route}>
      <Card className="flex h-full flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
              <FolderOpen className="h-4 w-4" />
            </div>
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={caseCardStatusTone(caseItem.status)}>
                  {getCaseStatusLabel(caseItem.status, locale)}
                </StatusBadge>
                <StatusBadge tone="neutral">
                  {caseItem.openTasksCount} {caseText.openCount}
                </StatusBadge>
              </div>
              <div>
                <p className="text-base font-semibold">{caseItem.title}</p>
                <p className="text-sm text-[var(--muted)]">{caseItem.organization ?? caseText.unknownOrganization}</p>
              </div>
            </div>
          </div>
          <ArrowUpRight className="h-4 w-4 text-[var(--muted)]" />
        </div>

        {brief?.document_kind_label ? (
          <p className="text-xs font-medium uppercase tracking-[0.1em] text-[var(--muted)]">{brief.document_kind_label}</p>
        ) : null}
        {previewLine ? (
          <p className="line-clamp-3 text-sm leading-6 text-[var(--muted)]">{previewLine}</p>
        ) : caseItem.latestDocumentSubject ? (
          <p className="text-sm leading-6 text-[var(--muted)]">{caseItem.latestDocumentSubject}</p>
        ) : null}

        <div className="mt-auto flex items-center gap-2 text-sm text-[var(--muted)]">
          <Clock3 className="h-4 w-4" />
          {caseText.latestActivity}: {new Date(caseItem.latestActivityAt).toLocaleDateString(getDateLocale(locale as never))}
        </div>
      </Card>
    </Link>
  );
}
