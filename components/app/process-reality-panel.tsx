"use client";

import { CheckCircle2, Clock3, FileBadge2, FileText, MapPinned, ShieldCheck } from "lucide-react";

import { ExplanationRichText } from "@/components/ui/explanation-rich-text";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getLocalizedRealityValue,
  getProcessReality,
  getProcessRealityConfidenceLabel,
  getProcessRealityCopy,
  getProcessRealitySourceLabel,
  getProcessRealityTypeLabel
} from "@/lib/process-reality";

export function ProcessRealityPanel({
  procedureId,
  locale,
  compact = false
}: {
  procedureId: string;
  locale: string;
  compact?: boolean;
}) {
  const reality = getProcessReality(procedureId);
  if (!reality) return null;

  const copy = getProcessRealityCopy(locale);

  return (
    <div className="space-y-6">
      <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,252,250,0.94))] p-6">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge tone="accent">{copy.realityTitle}</StatusBadge>
          <StatusBadge tone="neutral">{getProcessRealityTypeLabel(reality.type, locale)}</StatusBadge>
          <StatusBadge tone="success">{getProcessRealityConfidenceLabel(reality.confidence, locale)}</StatusBadge>
        </div>
        <p className="mt-4 text-sm leading-6 text-[var(--foreground)]">
          <ExplanationRichText text={getLocalizedRealityValue(reality.intro, locale)} locale={locale} />
        </p>

        <div className={`mt-5 grid gap-3 ${compact ? "" : "lg:grid-cols-3"}`}>
          <div className="rounded-[22px] border border-[var(--line)] bg-white/88 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{copy.officialFormLabel}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{reality.officialForm ? copy.yesLabel : copy.noLabel}</p>
          </div>
          <div className="rounded-[22px] border border-[var(--line)] bg-white/88 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{copy.requestFirstLabel}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{reality.requestPath.needed ? copy.yesLabel : copy.noLabel}</p>
          </div>
          <div className="rounded-[22px] border border-[var(--line)] bg-white/88 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{copy.appointmentLabel}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{reality.appointmentPath.needed ? copy.yesLabel : copy.noLabel}</p>
          </div>
        </div>
      </Card>

      <Card className="border-[var(--line)] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
            <Clock3 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">{copy.realityTitle}</h2>
        </div>
        <div className="mt-5 space-y-4">
          {reality.timeline.map((step, index) => (
            <div key={step.id} className="flex gap-4">
              <div className="flex w-8 shrink-0 flex-col items-center">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                  {index + 1}
                </div>
                {index < reality.timeline.length - 1 ? <div className="mt-2 h-full w-px bg-[var(--line-strong)]" /> : null}
              </div>
              <div className="min-w-0 pb-4">
                <h3 className="text-sm font-semibold text-[var(--foreground)]">
                  <ExplanationRichText text={getLocalizedRealityValue(step.title, locale)} locale={locale} />
                </h3>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  <ExplanationRichText text={getLocalizedRealityValue(step.note, locale)} locale={locale} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-[var(--line)] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
            <FileBadge2 className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">{copy.formTitle}</h2>
        </div>
        <div className={`mt-5 grid gap-4 ${compact ? "" : "lg:grid-cols-2"}`}>
          <div className="rounded-[22px] border border-[var(--line)] bg-white/88 p-4">
            <div className="flex items-center gap-2 text-[var(--accent-strong)]">
              <FileText className="h-4 w-4" />
              <p className="text-sm font-semibold">{copy.officialFormLabel}</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-[var(--foreground)]">
              {reality.officialForm ? (
                <ExplanationRichText text={getLocalizedRealityValue(reality.officialForm.name, locale)} locale={locale} />
              ) : (
                copy.noLabel
              )}
            </p>
            {reality.officialForm ? (
              <>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{copy.sourceLabel}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{getProcessRealitySourceLabel(reality.officialForm.source, locale)}</p>
                <p className="mt-3 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{copy.authorityLabel}</p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  <ExplanationRichText text={getLocalizedRealityValue(reality.officialForm.authority, locale)} locale={locale} />
                </p>
                <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                  <ExplanationRichText text={getLocalizedRealityValue(reality.officialForm.note, locale)} locale={locale} />
                </p>
              </>
            ) : null}
          </div>

          <div className="space-y-4">
            <div className="rounded-[22px] border border-[var(--line)] bg-white/88 p-4">
              <div className="flex items-center gap-2 text-[var(--accent-strong)]">
                <MapPinned className="h-4 w-4" />
                <p className="text-sm font-semibold">{copy.requestFirstLabel}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                <ExplanationRichText text={getLocalizedRealityValue(reality.requestPath.note, locale)} locale={locale} />
              </p>
            </div>
            <div className="rounded-[22px] border border-[var(--line)] bg-white/88 p-4">
              <div className="flex items-center gap-2 text-[var(--accent-strong)]">
                <CheckCircle2 className="h-4 w-4" />
                <p className="text-sm font-semibold">{copy.onlinePortalLabel}</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                <ExplanationRichText text={getLocalizedRealityValue(reality.portalPath.note, locale)} locale={locale} />
              </p>
              <div className="mt-3 flex items-center gap-2">
                <StatusBadge tone={reality.portalPath.available ? "success" : "neutral"}>
                  {reality.portalPath.available ? copy.yesLabel : copy.noLabel}
                </StatusBadge>
                <StatusBadge tone={reality.appointmentPath.needed ? "accent" : "neutral"}>
                  {copy.appointmentLabel}: {reality.appointmentPath.needed ? copy.yesLabel : copy.noLabel}
                </StatusBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
                <ExplanationRichText text={getLocalizedRealityValue(reality.appointmentPath.note, locale)} locale={locale} />
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card className="border-[var(--line)] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">{copy.documentsTitle}</h2>
        </div>
        <div className={`mt-5 grid gap-4 ${compact ? "" : "lg:grid-cols-2"}`}>
          {reality.documents.map((document) => (
            <div key={document.id} className="rounded-[22px] border border-[var(--line)] bg-white/88 p-4">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge tone={document.importance === "core" ? "accent" : "neutral"}>
                  {document.importance === "core" ? copy.importanceCore : copy.importanceHelpful}
                </StatusBadge>
              </div>
              <h3 className="mt-3 text-sm font-semibold text-[var(--foreground)]">
                <ExplanationRichText text={getLocalizedRealityValue(document.label, locale)} locale={locale} />
              </h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                <ExplanationRichText text={getLocalizedRealityValue(document.note, locale)} locale={locale} />
              </p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,248,0.94))] p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <h2 className="text-xl font-semibold tracking-[-0.03em]">{copy.transparencyTitle}</h2>
        </div>
        <p className="mt-4 text-sm leading-6 text-[var(--muted)]">
          <ExplanationRichText text={getLocalizedRealityValue(reality.transparency, locale)} locale={locale} />
        </p>
      </Card>
    </div>
  );
}
