import Link from "next/link";
import { CalendarClock, FileSignature, RefreshCw } from "lucide-react";
import type { Route } from "next";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getContractActionsCopy } from "@/lib/contract-actions-copy";
import { buildContractMeta, documentQualifiesForContractActions } from "@/lib/contract-document";
import type { DocumentKindDetection } from "@/lib/document-kind";
import type { DocumentAnalysisRecord, DocumentRecord } from "@/lib/types";

export function ContractActionsPanel({
  document,
  analysis,
  kindDetection,
  locale
}: {
  document: DocumentRecord;
  analysis: DocumentAnalysisRecord | null;
  kindDetection: DocumentKindDetection | null;
  locale: string | null | undefined;
}) {
  if (!documentQualifiesForContractActions(kindDetection, analysis) || !analysis) {
    return null;
  }

  const meta = buildContractMeta(document, analysis, kindDetection);
  const copy = getContractActionsCopy(locale);

  const cancelHref = `/app/documents/${document.id}/contract/cancel` as Route;
  const extendHref = `/app/documents/${document.id}/contract/extend` as Route;

  return (
    <Card className="space-y-5 border-[rgba(111,168,220,0.22)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(239,247,252,0.88))] p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <StatusBadge tone="accent">{copy.panelBadge}</StatusBadge>
          <h2 className="text-xl font-semibold tracking-[-0.02em]">{copy.panelTitle}</h2>
          <p className="max-w-2xl text-sm leading-6 text-[var(--muted)]">{copy.panelIntro}</p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-[22px] border border-[var(--line)] bg-white px-4 py-3.5 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.metaProvider}</p>
          <p className="mt-2 text-sm font-medium">{meta.providerName ?? "—"}</p>
        </div>
        <div className="rounded-[22px] border border-[var(--line)] bg-white px-4 py-3.5 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.metaType}</p>
          <p className="mt-2 text-sm font-medium">{meta.contractType ?? "—"}</p>
        </div>
        <div className="rounded-[22px] border border-[var(--line)] bg-white px-4 py-3.5 shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.metaNotice}</p>
          <p className="mt-2 text-sm font-medium">{meta.cancellationPeriod ?? "—"}</p>
        </div>
        <div className="rounded-[22px] border border-[var(--line)] bg-white px-4 py-3.5 shadow-[var(--shadow-soft)] sm:col-span-2 lg:col-span-3">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.metaAutoRenewal}</p>
          <p className="mt-2 text-sm font-medium">
            {meta.autoRenewal === true ? copy.metaAutoRenewalYes : meta.autoRenewal === false ? copy.metaAutoRenewalNo : copy.metaAutoRenewalUnclear}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href={cancelHref} className="group block">
          <div className="flex h-full min-h-[112px] flex-col justify-between rounded-[26px] border-2 border-[var(--accent)]/25 bg-white p-5 transition group-hover:border-[var(--accent)]/45 group-hover:shadow-[0_16px_40px_rgba(95,163,163,0.12)]">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-[rgba(95,163,163,0.12)] p-3 text-[var(--accent)]">
                <FileSignature className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{copy.actionCancel}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{copy.actionCancelHint}</p>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-[var(--accent)]">
              <CalendarClock className="h-4 w-4" />
              <span>{copy.cancelPageTitle}</span>
            </div>
          </div>
        </Link>

        <Link href={extendHref} className="group block">
          <div className="flex h-full min-h-[112px] flex-col justify-between rounded-[26px] border border-[var(--line-strong)] bg-[rgba(255,255,255,0.92)] p-5 transition group-hover:border-[var(--accent)]/35 group-hover:shadow-[var(--shadow-soft)]">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-[rgba(111,168,220,0.12)] p-3 text-[var(--accent)]">
                <RefreshCw className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{copy.actionExtend}</p>
                <p className="mt-1 text-sm text-[var(--muted)]">{copy.actionExtendHint}</p>
              </div>
            </div>
            <div className="mt-4 text-sm font-semibold text-[var(--accent)]">{copy.extendPageTitle} →</div>
          </div>
        </Link>
      </div>
    </Card>
  );
}
