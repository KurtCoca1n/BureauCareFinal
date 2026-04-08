"use client";

import { useActionState, useMemo, useState } from "react";
import { CheckCircle2, Languages, LoaderCircle, MessageSquareQuote, Save, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { updateReplySettingsAction, type ReplySettingsState } from "@/lib/actions/profile";
import { getResponseSettingsCopy } from "@/lib/response-settings-ui";
import type { ReplyDefaultTone, ReplyTranslationMode } from "@/lib/types";

const initialState: ReplySettingsState = {
  error: "",
  success: ""
};

function getTonePreviewIntro(tone: ReplyDefaultTone, locale: string) {
  const isGerman = locale !== "en" && locale !== "zh";
  const isChinese = locale === "zh";

  switch (tone) {
    case "friendly":
      return isChinese ? "非常感谢您的来信。" : isGerman ? "vielen Dank fuer Ihr Schreiben." : "thank you very much for your message.";
    case "very_formal":
      return isChinese ? "感谢您的来信与说明。" : isGerman ? "besten Dank fuer Ihr Schreiben und die darin enthaltenen Hinweise." : "thank you for your letter and the information it contains.";
    case "simple":
      return isChinese ? "感谢您的来信。" : isGerman ? "danke fuer Ihr Schreiben." : "thank you for your message.";
    case "neutral":
      return isChinese ? "感谢您的来信。" : isGerman ? "vielen Dank fuer Ihr Schreiben." : "thank you for your message.";
    default:
      return isChinese ? "感谢您的来信。" : isGerman ? "vielen Dank fuer Ihr Schreiben." : "thank you for your message.";
  }
}

export function ResponseSettingsPanel({
  locale,
  defaultTone,
  styleNote,
  includeSignature,
  signature,
  translationMode,
  suggestedFullName
}: {
  locale: string;
  defaultTone: ReplyDefaultTone;
  styleNote: string | null;
  includeSignature: boolean;
  signature: string | null;
  translationMode: ReplyTranslationMode;
  suggestedFullName: string | null;
}) {
  const copy = getResponseSettingsCopy(locale);
  const [state, formAction, pending] = useActionState(updateReplySettingsAction, initialState);
  const [selectedTone, setSelectedTone] = useState<ReplyDefaultTone>(defaultTone);
  const [styleNoteValue, setStyleNoteValue] = useState(styleNote ?? "");
  const [includeSignatureValue, setIncludeSignatureValue] = useState(includeSignature);
  const [translationModeValue, setTranslationModeValue] = useState<ReplyTranslationMode>(translationMode);
  const [signatureValue, setSignatureValue] = useState(
    signature?.trim() || (suggestedFullName ? `Mit freundlichen Gruessen,\n${suggestedFullName}` : "")
  );

  const previewText = useMemo(() => {
    const intro = getTonePreviewIntro(selectedTone, locale);
    const styleLine = styleNoteValue.trim();
    const closing = includeSignatureValue && signatureValue.trim() ? `\n\n${signatureValue.trim()}` : "";
    return `${intro}${styleLine ? ` ${styleLine}` : ""}${closing}`;
  }, [includeSignatureValue, locale, selectedTone, signatureValue, styleNoteValue]);

  return (
    <div className="flex min-w-0 flex-col gap-8">
      <Card className="min-w-0 space-y-6 p-5 sm:p-6 lg:p-7">
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.toneTitle}</h3>
          <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{copy.intro}</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--foreground)]">{copy.toneTitle}</p>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.toneText}</p>
            </div>
            <input type="hidden" name="defaultTone" value={selectedTone} />
            <div className="grid gap-3 sm:grid-cols-2">
              {copy.toneOptions.map((option) => {
                const active = selectedTone === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setSelectedTone(option.value)}
                    className={[
                      "min-w-0 rounded-[24px] border p-4 text-left transition duration-300",
                      active
                        ? "border-[rgba(165,192,217,0.92)] bg-[linear-gradient(180deg,rgba(239,245,250,0.98),rgba(255,255,255,0.98))] shadow-[0_18px_36px_rgba(29,58,90,0.08)]"
                        : "border-[rgba(223,229,236,0.94)] bg-[rgba(255,255,255,0.92)] hover:border-[rgba(208,220,234,0.92)]"
                    ].join(" ")}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <p className="font-semibold text-[var(--foreground)]">{option.label}</p>
                        <p className="text-sm leading-relaxed text-[var(--muted)]">{option.description}</p>
                      </div>
                      {active ? <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--accent)]" /> : null}
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.toneHint}</p>
          </div>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-[var(--foreground)]">{copy.styleTitle}</span>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.styleText}</p>
            <textarea
              name="styleNote"
              rows={3}
              value={styleNoteValue}
              onChange={(event) => setStyleNoteValue(event.target.value)}
              placeholder={copy.stylePlaceholder}
              className="w-full rounded-[24px] border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
            />
          </label>

          <div className="space-y-3 rounded-[28px] border border-[rgba(223,229,236,0.94)] bg-[rgba(249,251,252,0.92)] p-5">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--foreground)]">{copy.signatureTitle}</p>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.signatureText}</p>
            </div>

            <label className="flex items-center gap-3 rounded-[20px] border border-[rgba(223,229,236,0.94)] bg-white px-4 py-3">
              <input
                type="checkbox"
                name="includeSignature"
                value="1"
                checked={includeSignatureValue}
                onChange={(event) => setIncludeSignatureValue(event.target.checked)}
                className="h-4 w-4 rounded border-[var(--line)]"
              />
              <span className="text-sm text-[var(--foreground)]">{copy.includeSignature}</span>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-medium text-[var(--foreground)]">{copy.signatureField}</span>
              <textarea
                name="signature"
                rows={4}
                value={signatureValue}
                onChange={(event) => setSignatureValue(event.target.value)}
                placeholder={copy.signaturePlaceholder}
                className="w-full rounded-[24px] border border-[var(--line)] bg-white px-4 py-3 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:ring-2 focus:ring-[var(--accent-soft)]"
              />
            </label>
          </div>

          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-sm font-medium text-[var(--foreground)]">{copy.translationTitle}</p>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.translationText}</p>
            </div>
            <input type="hidden" name="translationMode" value={translationModeValue} />
            <div className="grid gap-3 sm:grid-cols-2">
              {(["german_only", "app_language"] as ReplyTranslationMode[]).map((mode) => {
                const active = translationModeValue === mode;
                const option = copy.translationModes[mode];
                return (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setTranslationModeValue(mode)}
                    className={[
                      "min-w-0 rounded-[24px] border p-4 text-left transition duration-300",
                      active
                        ? "border-[rgba(165,192,217,0.92)] bg-[linear-gradient(180deg,rgba(239,245,250,0.98),rgba(255,255,255,0.98))] shadow-[0_18px_36px_rgba(29,58,90,0.08)]"
                        : "border-[rgba(223,229,236,0.94)] bg-[rgba(255,255,255,0.92)] hover:border-[rgba(208,220,234,0.92)]"
                    ].join(" ")}
                  >
                    <div className="min-w-0 space-y-1.5">
                      <p className="font-semibold text-[var(--foreground)]">{option.label}</p>
                      <p className="text-sm leading-relaxed text-[var(--muted)]">{option.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.translationHint}</p>
          </div>

          {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
          {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}

          <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
            {pending ? (
              <>
                <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                {copy.saving}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {copy.save}
              </>
            )}
          </Button>
        </form>
      </Card>

      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <Card className="min-w-0 space-y-4 p-5 sm:p-6 lg:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(187,171,223,0.17)] p-3 text-[rgba(108,92,152,0.95)]">
              <MessageSquareQuote className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.previewTitle}</h3>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.previewText}</p>
            </div>
          </div>
          <div className="rounded-[24px] border border-[rgba(223,229,236,0.94)] bg-[rgba(252,252,253,0.96)] p-4">
            <pre className="whitespace-pre-wrap text-sm leading-7 text-[var(--foreground)]">{previewText}</pre>
          </div>
        </Card>

        <Card className="min-w-0 space-y-4 p-5 sm:p-6 lg:p-7">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(191,214,200,0.18)] p-3 text-[rgba(78,132,104,0.94)]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.toneTitle}</h3>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.toneHint}</p>
            </div>
          </div>
          <StatusBadge tone="accent">
            {copy.toneOptions.find((option) => option.value === selectedTone)?.label ?? copy.toneOptions[0]?.label}
          </StatusBadge>
        </Card>

        <Card className="min-w-0 space-y-4 p-5 sm:p-6 lg:p-7 lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-[rgba(159,201,219,0.18)] p-3 text-[rgba(62,125,150,0.95)]">
              <Languages className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-[var(--foreground)]">{copy.translationTitle}</h3>
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.translationModes[translationModeValue].description}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
