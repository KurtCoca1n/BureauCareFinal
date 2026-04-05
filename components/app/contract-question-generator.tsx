"use client";

import Link from "next/link";
import { useActionState, useMemo, useState } from "react";
import { LoaderCircle, MessageSquareQuote, Sparkles } from "lucide-react";

import { CopyButton } from "@/components/app/copy-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { generateContractQuestionAction, type GenerateContractQuestionState } from "@/lib/actions/contract-questions";
import { getContractAnalysisCopy } from "@/lib/contract-analysis-ui";
import { getContractQuestionCopy, getContractQuestionFormatLabel } from "@/lib/contract-question-ui";
import type {
  ContractClauseCategory,
  ContractQuestionDraftRecord,
  ContractQuestionFormat,
  ContractQuestionTone,
  DocumentAnalysisRecord
} from "@/lib/types";

const initialState: GenerateContractQuestionState = {
  error: "",
  success: ""
};

function getAvailableCategories(analysis: DocumentAnalysisRecord): ContractClauseCategory[] {
  const categories = new Set<ContractClauseCategory>();

  for (const clause of analysis.contract_flagged_clauses ?? []) {
    categories.add(clause.category);
  }

  for (const item of analysis.contract_clarification_points ?? []) {
    categories.add(item.category);
  }

  return [...categories];
}

export function ContractQuestionGenerator({
  documentId,
  locale,
  analysis,
  existingDrafts
}: {
  documentId: string;
  locale: string | null | undefined;
  analysis: DocumentAnalysisRecord;
  existingDrafts: ContractQuestionDraftRecord[];
}) {
  const [state, formAction, pending] = useActionState(generateContractQuestionAction, initialState);
  const questionCopy = getContractQuestionCopy(locale);
  const contractCopy = getContractAnalysisCopy(locale);
  const availableCategories = useMemo(() => getAvailableCategories(analysis), [analysis]);
  const [selectedCategories, setSelectedCategories] = useState<ContractClauseCategory[]>(availableCategories.slice(0, 1));
  const [tone, setTone] = useState<ContractQuestionTone>("friendly");
  const [messageType, setMessageType] = useState<ContractQuestionFormat>("email");
  const [activeLanguage, setActiveLanguage] = useState<"de" | "translated">("de");

  const activeDraft = state.generatedQuestion
    ? {
        id: state.generatedQuestion.id,
        question_text_de: state.generatedQuestion.questionTextDe,
        question_text_translated: state.generatedQuestion.questionTextTranslated ?? null,
        question_tone: state.generatedQuestion.tone,
        message_type: state.generatedQuestion.messageType,
        translated_language_code: state.generatedQuestion.translatedLanguageCode ?? null
      }
    : existingDrafts[0] ?? null;

  if (!availableCategories.length) {
    return null;
  }

  const history = state.generatedQuestion ? existingDrafts : existingDrafts.slice(1);
  const showTranslated = !!activeDraft?.question_text_translated;

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[rgba(95,163,163,0.12)] p-3 text-[var(--accent)]">
          <MessageSquareQuote className="h-5 w-5" />
        </div>
        <div>
          <h2 className="font-semibold">{questionCopy.title}</h2>
          <p className="text-sm text-[var(--muted)]">{questionCopy.intro}</p>
        </div>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="documentId" value={documentId} />

        <div className="space-y-2">
          <p className="text-sm font-medium">{questionCopy.pointLabel}</p>
          <p className="text-sm text-[var(--muted)]">{questionCopy.modeHint}</p>
          <div className="grid gap-2">
            {availableCategories.map((category) => {
              const checked = selectedCategories.includes(category);
              return (
                <label
                  key={category}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 transition ${
                    checked ? "border-[var(--accent)] bg-[var(--accent-soft)]" : "border-[var(--line)] bg-white"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="selectedCategories"
                    value={category}
                    checked={checked}
                    onChange={(event) => {
                      setSelectedCategories((current) => {
                        if (event.target.checked) {
                          return [...current, category];
                        }
                        return current.filter((item) => item !== category);
                      });
                    }}
                    className="mt-1 h-4 w-4 rounded border-[var(--line)]"
                  />
                  <div className="space-y-1">
                    <p className="text-sm font-medium">{contractCopy.categories[category]}</p>
                    <p className="text-sm text-[var(--muted)]">
                      {(analysis.contract_flagged_clauses ?? []).find((item) => item.category === category)?.clause_summary_simple ??
                        (analysis.contract_unclear_points ?? [])[0] ??
                        contractCopy.contextNote}
                    </p>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <p className="text-sm font-medium">{questionCopy.toneLabel}</p>
            <div className="grid grid-cols-2 gap-2">
              {(["friendly", "factual", "formal", "careful_firm"] as ContractQuestionTone[]).map((item) => (
                <label key={item} className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="questionTone"
                    value={item}
                    checked={tone === item}
                    onChange={() => setTone(item)}
                  />
                  <span className="flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-3 text-center text-sm font-medium text-[var(--foreground)] transition peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent-soft)] peer-checked:text-[var(--accent)]">
                    {questionCopy.tones[item]}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">{questionCopy.formatLabel}</p>
            <div className="grid gap-2">
              {(["email", "message", "question_list"] as ContractQuestionFormat[]).map((item) => (
                <label key={item} className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="messageType"
                    value={item}
                    checked={messageType === item}
                    onChange={() => setMessageType(item)}
                  />
                  <span className="flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-3 text-center text-sm font-medium text-[var(--foreground)] transition peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent-soft)] peer-checked:text-[var(--accent)]">
                    {getContractQuestionFormatLabel(locale, item)}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}

        <Button type="submit" className="w-full" disabled={pending || selectedCategories.length === 0}>
          {pending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {questionCopy.generating}
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              {questionCopy.generate}
            </>
          )}
        </Button>
      </form>

      {activeDraft ? (
        <div className="space-y-4 rounded-[24px] border border-[var(--line)] bg-white p-4">
          <div className="flex flex-wrap gap-2">
            <StatusBadge tone="accent">{questionCopy.tones[(activeDraft.question_tone ?? "friendly") as ContractQuestionTone]}</StatusBadge>
            <StatusBadge tone="neutral">
              {getContractQuestionFormatLabel(locale, (activeDraft.message_type ?? "email") as ContractQuestionFormat)}
            </StatusBadge>
          </div>
          <div>
            <h3 className="font-semibold">{questionCopy.generatedTitle}</h3>
          </div>
          {showTranslated ? (
            <div className="inline-flex rounded-2xl border border-[var(--line)] bg-[var(--background-strong)] p-1">
              <button
                type="button"
                className={`min-h-10 rounded-xl px-4 text-sm font-medium transition ${
                  activeLanguage === "de" ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)]" : "text-[var(--muted)]"
                }`}
                onClick={() => setActiveLanguage("de")}
              >
                DE
              </button>
              <button
                type="button"
                className={`min-h-10 rounded-xl px-4 text-sm font-medium transition ${
                  activeLanguage === "translated"
                    ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                    : "text-[var(--muted)]"
                }`}
                onClick={() => setActiveLanguage("translated")}
              >
                {activeDraft.translated_language_code?.toUpperCase() ?? "ALT"}
              </button>
            </div>
          ) : null}
          <pre className="whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
            {activeLanguage === "translated" && activeDraft.question_text_translated
              ? activeDraft.question_text_translated
              : activeDraft.question_text_de}
          </pre>
          <div className="flex flex-col gap-3 sm:flex-row">
            <CopyButton
              text={
                activeLanguage === "translated" && activeDraft.question_text_translated
                  ? activeDraft.question_text_translated
                  : activeDraft.question_text_de
              }
              label={questionCopy.copy}
              copiedLabel={questionCopy.copied}
            />
            <Link
              href={`/app/documents/${documentId}/reply`}
              className="inline-flex min-h-12 w-full items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)] sm:w-auto"
            >
              {questionCopy.openReply}
            </Link>
          </div>
        </div>
      ) : null}

      {history.length ? (
        <div className="space-y-3">
          <h3 className="font-semibold">{questionCopy.previousTitle}</h3>
          <div className="space-y-3">
            {history.slice(0, 3).map((item) => (
              <div key={item.id} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <StatusBadge tone="neutral">{questionCopy.tones[(item.question_tone ?? "friendly") as ContractQuestionTone]}</StatusBadge>
                  <StatusBadge tone="neutral">
                    {getContractQuestionFormatLabel(locale, (item.message_type ?? "email") as ContractQuestionFormat)}
                  </StatusBadge>
                </div>
                <p className="line-clamp-4 text-sm leading-6">{item.question_text_de}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </Card>
  );
}
