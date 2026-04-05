"use client";

import { useActionState, useMemo, useState } from "react";
import { ChevronDown, LoaderCircle, MessageSquareQuote } from "lucide-react";

import { CopyButton } from "@/components/app/copy-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { generateContractQuestionAction, type GenerateContractQuestionState } from "@/lib/actions/contract-questions";
import { getContractAnalysisCopy, getContractGuidanceText } from "@/lib/contract-analysis-ui";
import { getContractQuestionCopy } from "@/lib/contract-question-ui";
import type { ContractFlaggedClause } from "@/lib/types";

const initialState: GenerateContractQuestionState = {
  error: "",
  success: ""
};

function getClauseRiskTone(value: "low" | "medium" | "elevated") {
  if (value === "elevated") {
    return "warning" as const;
  }
  if (value === "medium") {
    return "accent" as const;
  }
  return "neutral" as const;
}

function ContractClauseCard({
  clause,
  documentId,
  locale
}: {
  clause: ContractFlaggedClause;
  documentId: string;
  locale: string | null | undefined;
}) {
  const copy = getContractAnalysisCopy(locale);
  const questionCopy = getContractQuestionCopy(locale);
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(generateContractQuestionAction, initialState);
  const secondaryLabels = clause.secondary_categories.map((item) => copy.categories[item]);

  const quickQuestion = state.generatedQuestion;
  const summaryQuestion = useMemo(
    () => getContractGuidanceText(locale, "clarification", { category: clause.category, priority: "medium" }),
    [clause.category, locale]
  );

  return (
    <div className="rounded-[22px] border border-[var(--line)] bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-start justify-between gap-3 px-4 py-4 text-left"
      >
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="accent">{copy.categories[clause.category]}</StatusBadge>
            {secondaryLabels.map((label) => (
              <StatusBadge key={label} tone="neutral">
                {label}
              </StatusBadge>
            ))}
          </div>
          <p className="text-sm font-medium leading-6">{clause.clause_summary_simple}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <StatusBadge tone={getClauseRiskTone(clause.clause_risk_level)}>
            {copy.riskLevels[clause.clause_risk_level]}
          </StatusBadge>
          <ChevronDown className={`mt-1 h-4 w-4 text-[var(--muted)] transition ${open ? "rotate-180" : ""}`} />
        </div>
      </button>

      {open ? (
        <div className="space-y-4 border-t border-[var(--line)] px-4 py-4">
          <div className="rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.clauseReasonLabel}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{clause.clause_reason_simple}</p>
          </div>

          <div className="rounded-[18px] border border-[rgba(95,163,163,0.14)] bg-[rgba(238,246,245,0.7)] px-4 py-4">
            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.sourceLabel}</p>
              <p className="text-sm font-medium text-[var(--foreground)]">
                {clause.source_context_label ?? clause.source_context_reason ?? copy.detailsTitle}
              </p>
              {clause.source_context_reason ? (
                <p className="text-sm leading-6 text-[var(--muted)]">{clause.source_context_reason}</p>
              ) : null}
            </div>

            {clause.source_excerpt ? (
              <div className="mt-3 rounded-[18px] border border-[var(--line)] bg-white px-4 py-3">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.sourceTextLabel}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">“{clause.source_excerpt}”</p>
              </div>
            ) : null}

            {(clause.source_page || clause.source_section) ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {clause.source_page ? (
                  <StatusBadge tone="neutral">
                    {copy.sourcePageLabel} {clause.source_page}
                  </StatusBadge>
                ) : null}
                {clause.source_section ? (
                  <StatusBadge tone="neutral">
                    {copy.sourceSectionLabel}: {clause.source_section}
                  </StatusBadge>
                ) : null}
              </div>
            ) : null}
          </div>

          <div className="rounded-[18px] border border-[var(--line)] bg-white px-4 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[rgba(95,163,163,0.12)] p-3 text-[var(--accent)]">
                <MessageSquareQuote className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{copy.askAboutThis}</p>
                <p className="text-sm text-[var(--muted)]">{summaryQuestion}</p>
              </div>
            </div>

            <form action={formAction} className="mt-4 space-y-3">
              <input type="hidden" name="documentId" value={documentId} />
              <input type="hidden" name="questionTone" value="friendly" />
              <input type="hidden" name="messageType" value="email" />
              <input type="hidden" name="selectedCategories" value={clause.category} />

              {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
              {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}

              <Button type="submit" variant="secondary" className="w-full" disabled={pending}>
                {pending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {questionCopy.generating}
                  </>
                ) : (
                  copy.askAboutThis
                )}
              </Button>
            </form>

            {quickQuestion ? (
              <div className="mt-4 space-y-3 rounded-[18px] border border-[var(--line)] bg-[var(--surface)] px-4 py-4">
                <p className="text-sm leading-7 text-[var(--foreground)]">{quickQuestion.questionTextDe}</p>
                <CopyButton text={quickQuestion.questionTextDe} label={questionCopy.copy} copiedLabel={questionCopy.copied} />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ContractClauseExplorer({
  clauses,
  documentId,
  locale
}: {
  clauses: ContractFlaggedClause[];
  documentId: string;
  locale: string | null | undefined;
}) {
  const copy = getContractAnalysisCopy(locale);

  if (!clauses.length) {
    return null;
  }

  return (
    <Card className="space-y-3 p-5">
      <div>
        <h3 className="font-semibold">{copy.clausesTitle}</h3>
        <p className="text-sm text-[var(--muted)]">{copy.clausesText}</p>
      </div>
      <div className="space-y-3">
        {clauses.map((clause, index) => (
          <ContractClauseCard key={`${clause.category}-${index}-${clause.clause_summary_simple}`} clause={clause} documentId={documentId} locale={locale} />
        ))}
      </div>
    </Card>
  );
}
