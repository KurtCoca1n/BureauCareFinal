"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { LoaderCircle, Sparkles } from "lucide-react";

import { CopyButton } from "@/components/app/copy-button";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { generateDraftReplyAction, type DraftReplyState } from "@/lib/actions/draft-replies";
import type { DraftReplyRecord } from "@/lib/types";

const initialState: DraftReplyState = {
  error: "",
  success: ""
};

function normalizeText(value: string) {
  return value.toLocaleLowerCase("de-DE");
}

function resolveRecommendedToneSelection(recommendation: string, tones: string[]) {
  const direct = tones.find((tone) => tone === recommendation);
  if (direct) {
    return direct;
  }

  const normalized = normalizeText(recommendation);

  if (/(form|resm|офіці|formal|muy formal|sehr formell)/.test(normalized)) {
    return tones.find((tone) => /(form|resm|офіці|formal)/.test(normalizeText(tone))) ?? tones[0] ?? "";
  }

  if (/(freund|amable|nazik|доброзич|friendly)/.test(normalized)) {
    return tones.find((tone) => /(freund|amable|nazik|доброзич|friendly)/.test(normalizeText(tone))) ?? tones[0] ?? "";
  }

  return tones.find((tone) => /(neutral|nötr|нейтр)/.test(normalizeText(tone))) ?? tones[0] ?? "";
}

export function ReplyGeneratorForm({
  documentId,
  existingReplies,
  profileName,
  preferredLanguage,
  recommendedTone,
  labels
}: {
  documentId: string;
  existingReplies: DraftReplyRecord[];
  profileName: string | null;
  preferredLanguage: string | null;
  recommendedTone?: string | null;
  labels: {
    tone: string;
    recommendedTone: string;
    useRecommended: string;
    format: string;
    asLetter: string;
    asEmail: string;
    includeName: string;
    create: string;
    creating: string;
    regenerate: string;
    regenerating: string;
    previousDrafts: string;
    german: string;
    translated: string;
    tones: string[];
    customTone: string;
    customTonePlaceholder: string;
  };
}) {
  const [state, formAction, pending] = useActionState(generateDraftReplyAction, initialState);
  const [activeLanguage, setActiveLanguage] = useState<"de" | "translated">("de");
  const [selectedTone, setSelectedTone] = useState(resolveRecommendedToneSelection(recommendedTone ?? "", labels.tones));

  const activeReply = useMemo(() => {
    if (state.generatedReply) {
      return state.generatedReply;
    }

    const latestGerman = existingReplies.find((reply) => reply.language_code === "de");
    const latestTranslated = existingReplies.find((reply) => reply.language_code && reply.language_code !== "de");

    if (!latestGerman && !latestTranslated) {
      return null;
    }

    return {
      primaryId: latestGerman?.id ?? latestTranslated?.id ?? "",
      translatedId: latestTranslated?.id,
      tone: latestGerman?.tone ?? latestTranslated?.tone ?? labels.tones[0],
      formatType: latestGerman?.format_type ?? latestTranslated?.format_type ?? "brief",
      replyTextDe: latestGerman?.reply_text ?? "",
      replyTextTranslated: latestTranslated?.reply_text ?? null,
      translatedLanguage: latestTranslated?.language_code ?? null
    };
  }, [existingReplies, labels.tones, state.generatedReply]);

  const germanHistory = useMemo(
    () => existingReplies.filter((reply) => reply.language_code === "de").slice(1),
    [existingReplies]
  );

  const showTranslated = preferredLanguage !== "de" && !!activeReply?.replyTextTranslated && !!activeReply.translatedLanguage;
  const recommendation = state.recommendedTone ?? recommendedTone ?? activeReply?.tone ?? "";

  useEffect(() => {
    if (state.recommendedTone) {
      setSelectedTone(resolveRecommendedToneSelection(state.recommendedTone, labels.tones));
    }
  }, [labels.tones, state.recommendedTone]);

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="documentId" value={documentId} />
          <input type="hidden" name="regenerate" value="1" />

          <div className="space-y-2">
            <p className="text-sm font-medium">{labels.tone}</p>
            {recommendation ? (
              <button
                type="button"
                onClick={() => setSelectedTone(resolveRecommendedToneSelection(recommendation, labels.tones))}
                className="w-full rounded-2xl border border-[rgba(95,163,163,0.24)] bg-[linear-gradient(135deg,rgba(95,163,163,0.12),rgba(111,168,220,0.08))] px-4 py-3 text-left text-sm text-[var(--foreground)] transition hover:border-[rgba(95,163,163,0.34)] hover:shadow-[var(--shadow-soft)]"
              >
                <span className="font-medium text-[var(--accent-strong)]">{labels.recommendedTone}</span>{" "}
                <span>{recommendation}</span>
                <span className="ml-2 inline-flex rounded-full bg-white/80 px-2.5 py-1 text-xs font-semibold text-[var(--accent-strong)]">
                  {labels.useRecommended}
                </span>
              </button>
            ) : null}
            <div className="grid grid-cols-2 gap-2 xl:grid-cols-3">
              {labels.tones.map((tone) => (
                <label key={tone} className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="tone"
                    value={tone}
                    checked={selectedTone === tone}
                    onChange={() => setSelectedTone(tone)}
                  />
                  <span className="flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-3 text-center text-sm font-medium text-[var(--foreground)] transition peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent-soft)] peer-checked:text-[var(--accent)]">
                    {tone}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium">{labels.customTone}</span>
            <textarea
              name="toneDetails"
              rows={3}
              placeholder={labels.customTonePlaceholder}
              className="w-full rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </label>

          <div className="space-y-2">
            <p className="text-sm font-medium">{labels.format}</p>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "brief", label: labels.asLetter },
                { value: "email", label: labels.asEmail }
              ].map((option) => (
                <label key={option.value} className="cursor-pointer">
                  <input className="peer sr-only" type="radio" name="formatType" value={option.value} defaultChecked={option.value === "brief"} />
                  <span className="flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-3 text-sm font-medium text-[var(--foreground)] transition peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent-soft)] peer-checked:text-[var(--accent)]">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-white px-4 py-3">
            <input type="checkbox" name="includeSignature" value="1" className="h-4 w-4 rounded border-[var(--line)]" />
            <span className="text-sm text-[var(--foreground)]">
              {labels.includeName}
              {profileName ? <span className="text-[var(--muted)]"> ({profileName})</span> : null}
            </span>
          </label>

          {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}

          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {labels.creating}
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                {labels.create}
              </>
            )}
          </Button>
        </form>
      </Card>

      {activeReply ? (
        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="accent">{activeReply.tone}</StatusBadge>
            <StatusBadge tone="neutral">{activeReply.formatType === "email" ? labels.asEmail : labels.asLetter}</StatusBadge>
          </div>

          {showTranslated ? (
            <div className="inline-flex rounded-2xl border border-[var(--line)] bg-[var(--background-strong)] p-1">
              <button
                type="button"
                className={`min-h-10 rounded-xl px-4 text-sm font-medium transition ${
                  activeLanguage === "de" ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)]" : "text-[var(--muted)]"
                }`}
                onClick={() => setActiveLanguage("de")}
                aria-pressed={activeLanguage === "de"}
              >
                {labels.german}
              </button>
              <button
                type="button"
                className={`min-h-10 rounded-xl px-4 text-sm font-medium transition ${
                  activeLanguage === "translated"
                    ? "bg-white text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                    : "text-[var(--muted)]"
                }`}
                onClick={() => setActiveLanguage("translated")}
                aria-pressed={activeLanguage === "translated"}
              >
                {labels.translated}
              </button>
            </div>
          ) : null}

          <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
            <pre className="whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">
              {activeLanguage === "translated" && activeReply.replyTextTranslated ? activeReply.replyTextTranslated : activeReply.replyTextDe}
            </pre>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <CopyButton text={activeLanguage === "translated" && activeReply.replyTextTranslated ? activeReply.replyTextTranslated : activeReply.replyTextDe} />
            <Button type="submit" formAction={formAction} className="w-full sm:w-auto" disabled={pending}>
              {pending ? (
                <>
                  <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                  {labels.regenerating}
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  {labels.regenerate}
                </>
              )}
            </Button>
          </div>
        </Card>
      ) : null}

      {germanHistory.length ? (
        <Card className="space-y-3 p-5">
          <h3 className="font-semibold">{labels.previousDrafts}</h3>
          <div className="space-y-3">
            {germanHistory.map((reply) => (
              <div key={reply.id} className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge tone="neutral">{reply.tone ?? labels.tones[0]}</StatusBadge>
                  <StatusBadge tone="neutral">{reply.format_type === "email" ? labels.asEmail : labels.asLetter}</StatusBadge>
                  <span className="text-xs text-[var(--muted)]">{new Date(reply.created_at).toLocaleString()}</span>
                </div>
                <p className="line-clamp-4 text-sm leading-6 text-[var(--foreground)]">{reply.reply_text}</p>
              </div>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
