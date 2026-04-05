import { AlertTriangle, FileBadge2, Scale, ShieldAlert } from "lucide-react";

import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getContractAnalysisCopy, getContractGuidanceText } from "@/lib/contract-analysis-ui";
import type { DocumentAnalysisRecord } from "@/lib/types";

function hasContractAnalysis(analysis: DocumentAnalysisRecord) {
  const documentType = (analysis.document_type ?? "").toLowerCase();
  return documentType.includes("vertrag") || !!analysis.contract_type || !!analysis.contract_summary_simple;
}

function getRiskTone(value: string | null | undefined) {
  const normalized = (value ?? "").toLowerCase();
  if (normalized.includes("hoch") || normalized.includes("high")) {
    return "warning" as const;
  }
  if (normalized.includes("mittel") || normalized.includes("medium") || normalized.includes("moderat")) {
    return "accent" as const;
  }
  return "neutral" as const;
}

export function ContractAnalysisPanel({
  analysis,
  locale
}: {
  analysis: DocumentAnalysisRecord;
  locale: string | null | undefined;
}) {
  if (!hasContractAnalysis(analysis)) {
    return null;
  }

  const copy = getContractAnalysisCopy(locale);
  const watchItems = [...(analysis.contract_watch_out_for ?? []), ...(analysis.contract_watch_out_points ?? [])];
  const keyData = [
    { label: copy.contractType, value: analysis.contract_type ?? analysis.document_type },
    { label: copy.parties, value: analysis.contract_parties?.join(", ") || null },
    { label: copy.duration, value: analysis.contract_duration },
    { label: copy.noticePeriod, value: analysis.contract_notice_period },
    { label: copy.recurringCosts, value: analysis.contract_recurring_costs },
    { label: copy.autoRenewal, value: analysis.contract_auto_renewal }
  ];

  return (
    <Card className="space-y-5 border-[rgba(95,163,163,0.18)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(238,246,245,0.92))] p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-2">
          <StatusBadge tone="accent">{copy.sectionBadge}</StatusBadge>
          <div>
            <h2 className="text-xl font-semibold">{copy.title}</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--muted)]">{copy.intro}</p>
          </div>
        </div>
        {analysis.contract_risk_level_overview ? (
          <StatusBadge tone={getRiskTone(analysis.contract_risk_level_overview)}>
            {copy.riskOverview}: {analysis.contract_risk_level_overview}
          </StatusBadge>
        ) : null}
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(95,163,163,0.12)] p-3 text-[var(--accent)]">
              <FileBadge2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{copy.summaryTitle}</h3>
              <p className="text-sm text-[var(--muted)]">{copy.summaryText}</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7">
            {analysis.contract_summary_simple ?? analysis.summary_simple}
          </p>
        </div>

        <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(111,168,220,0.12)] p-3 text-[var(--accent)]">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{copy.keyDataTitle}</h3>
              <p className="text-sm text-[var(--muted)]">{copy.keyDataText}</p>
            </div>
          </div>
          <div className="mt-4 space-y-3">
            {keyData.map((item) => (
              <div key={item.label} className="rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{item.label}</p>
                <p className="mt-2 text-sm font-medium">{item.value || copy.notClearlyVisible}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {(analysis.contract_flagged_points ?? []).length ? (
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold">{copy.flaggedTitle}</h3>
            <p className="text-sm text-[var(--muted)]">{copy.flaggedText}</p>
          </div>
          <div className="grid gap-3 lg:grid-cols-2">
            {analysis.contract_flagged_points?.map((point, index) => (
              <div key={`${point.title}-${index}`} className="rounded-[22px] border border-[rgba(242,166,90,0.18)] bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{point.title}</p>
                  <StatusBadge tone={point.tone === "caution" ? "warning" : point.tone === "watch" ? "accent" : "neutral"}>
                    {copy.tones[point.tone]}
                  </StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{point.explanation_simple}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div>
            <h3 className="font-semibold">{copy.actionPointsTitle}</h3>
            <p className="text-sm text-[var(--muted)]">{copy.actionPointsText}</p>
          </div>
          <ul className="mt-4 space-y-3">
            {(analysis.contract_action_points ?? []).length ? (
              analysis.contract_action_points?.map((item, index) => (
                <li key={`${item.category}-${index}`} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6">
                  {getContractGuidanceText(locale, "action", item)}
                </li>
              ))
            ) : (
              <li className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {copy.contextNote}
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div>
            <h3 className="font-semibold">{copy.disadvantagesTitle}</h3>
            <p className="text-sm text-[var(--muted)]">{copy.disadvantagesText}</p>
          </div>
          <ul className="mt-4 space-y-3">
            {(analysis.contract_possible_disadvantages ?? []).length ? (
              analysis.contract_possible_disadvantages?.map((item, index) => (
                <li key={`${item.category}-${index}`} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6">
                  {getContractGuidanceText(locale, "disadvantage", item)}
                </li>
              ))
            ) : (
              <li className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {copy.notClearlyVisible}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div>
            <h3 className="font-semibold">{copy.checklistTitle}</h3>
            <p className="text-sm text-[var(--muted)]">{copy.checklistText}</p>
          </div>
          <ul className="mt-4 space-y-3">
            {(analysis.contract_pre_signing_checklist ?? []).length ? (
              analysis.contract_pre_signing_checklist?.map((item, index) => (
                <li key={`${item.category}-${index}`} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6">
                  {getContractGuidanceText(locale, "checklist", item)}
                </li>
              ))
            ) : (
              <li className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {copy.contextNote}
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div>
            <h3 className="font-semibold">{copy.clarificationTitle}</h3>
            <p className="text-sm text-[var(--muted)]">{copy.clarificationText}</p>
          </div>
          <ul className="mt-4 space-y-3">
            {(analysis.contract_clarification_points ?? []).length ? (
              analysis.contract_clarification_points?.map((item, index) => (
                <li key={`${item.category}-${index}`} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6">
                  {getContractGuidanceText(locale, "clarification", item)}
                </li>
              ))
            ) : (
              <li className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {copy.notClearlyVisible}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(95,163,163,0.12)] p-3 text-[var(--accent)]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{copy.watchTitle}</h3>
              <p className="text-sm text-[var(--muted)]">{copy.watchText}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {watchItems.length ? (
              watchItems.map((item, index) => (
                <li key={`${item}-${index}`} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6">
                  {item}
                </li>
              ))
            ) : (
              <li className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {copy.contextNote}
              </li>
            )}
          </ul>
        </div>

        <div className="rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(197,60,60,0.08)] p-3 text-[var(--danger)]">
              <ShieldAlert className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold">{copy.unclearTitle}</h3>
              <p className="text-sm text-[var(--muted)]">{copy.unclearText}</p>
            </div>
          </div>
          <ul className="mt-4 space-y-3">
            {(analysis.contract_unclear_points ?? []).length ? (
              analysis.contract_unclear_points?.map((item, index) => (
                <li key={`${item}-${index}`} className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6">
                  {item}
                </li>
              ))
            ) : (
              <li className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {copy.notClearlyVisible}
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="rounded-[24px] border border-[rgba(43,43,43,0.08)] bg-[rgba(247,244,239,0.75)] p-4 text-sm leading-6 text-[var(--muted)]">
        <p>{copy.legalNote}</p>
      </div>
    </Card>
  );
}
