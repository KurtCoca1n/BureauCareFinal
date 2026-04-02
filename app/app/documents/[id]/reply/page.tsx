import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, FileText, Mail, SendHorizonal } from "lucide-react";
import type { Route } from "next";

import { ReplyGeneratorForm } from "@/components/app/reply-generator-form";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAltLanguageLabel, getCopy, getDateLocale } from "@/lib/i18n";
import { getDocumentAnalysisByDocumentId, getDocumentById, getDraftRepliesByDocumentId, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

function getUrgencyLabel(value: string | null, locale: string) {
  const copy = getCopy(locale);
  return value === "high"
    ? copy.urgency.high
    : value === "medium"
      ? copy.urgency.medium
      : value === "low"
        ? copy.urgency.low
        : copy.urgency.unclear;
}

function getRecommendedTone(analysis: { urgency: string | null; is_action_required: boolean | null; subject: string | null; next_steps: string[] | null }, locale: string) {
  const haystack = `${analysis.subject ?? ""} ${(analysis.next_steps ?? []).join(" ")}`.toLowerCase();

  if (/widerspruch|einspruch|appeal|objection/.test(haystack)) {
    return locale === "en" ? "Very formal" : locale === "tr" ? "Çok resmî" : locale === "uk" ? "Дуже формально" : locale === "es" ? "Muy formal" : "Sehr formell";
  }

  if (analysis.urgency === "high") {
    return locale === "en" ? "Friendly, but formal" : locale === "tr" ? "Nazik ama resmî" : locale === "uk" ? "Доброзичливо, але формально" : locale === "es" ? "Amable, pero formal" : "Freundlich, aber formell";
  }

  if (analysis.is_action_required) {
    return locale === "en" ? "Friendly" : locale === "tr" ? "Nazik" : locale === "uk" ? "Доброзичливо" : locale === "es" ? "Amable" : "Freundlich";
  }

  return locale === "en" ? "Neutral" : locale === "tr" ? "Nötr" : locale === "uk" ? "Нейтрально" : locale === "es" ? "Neutral" : "Neutral";
}

export default async function ReplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [document, analysis, replies, profile] = await Promise.all([
    getDocumentById(id),
    getDocumentAnalysisByDocumentId(id),
    getDraftRepliesByDocumentId(id),
    getProfile()
  ]);

  if (!document) {
    notFound();
  }

  if (!analysis?.summary_simple) {
    redirect(`/app/documents/${id}` as Route);
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getCopy(locale);
  const dateLocale = getDateLocale(locale);
  const customToneCopy =
    locale === "en"
      ? { label: "Extra tone request", placeholder: "For example: shorter and more direct" }
      : locale === "tr"
        ? { label: "Ek ton isteği", placeholder: "Örneğin: daha kısa ve daha net" }
        : locale === "uk"
          ? { label: "Додаткове побажання до тону", placeholder: "Наприклад: коротше й пряміше" }
          : locale === "es"
            ? { label: "Deseo adicional para el tono", placeholder: "Por ejemplo: más corto y más directo" }
            : { label: "Eigener Tonwunsch", placeholder: "Zum Beispiel: kürzer und direkter" };
  const recommendedToneLabel =
    locale === "en"
      ? "Recommended tone:"
      : locale === "tr"
        ? "Önerilen ton:"
        : locale === "uk"
          ? "Рекомендований тон:"
          : locale === "es"
            ? "Tono recomendado:"
            : "Empfohlener Ton:";
  const useRecommendedLabel =
    locale === "en"
      ? "Use suggestion"
      : locale === "tr"
        ? "Öneriyi kullan"
        : locale === "uk"
          ? "Використати пораду"
          : locale === "es"
            ? "Usar sugerencia"
            : "Vorschlag nutzen";
  const recommendedTone = getRecommendedTone(analysis, locale);

  return (
    <div className="space-y-6">
      <section className="space-y-3 pt-3">
        <Link href={`/app/documents/${id}` as Route} className="inline-flex items-center text-sm font-medium text-[var(--muted)]">
          <ChevronLeft className="mr-1 h-4 w-4" />
          {copy.reply.back}
        </Link>
        <StatusBadge tone="accent">{copy.reply.badge}</StatusBadge>
        <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{copy.reply.title}</h1>
      </section>

      <div className="grid gap-6 xl:grid-cols-[340px_minmax(0,1fr)]">
        <aside className="space-y-6 xl:sticky xl:top-6">
          <Card className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium">{document.original_filename}</p>
                <p className="text-sm text-[var(--muted)]">{analysis.sender ?? copy.reply.unknownSender}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.common.subject}</p>
                <p className="mt-2 text-sm font-medium">{analysis.subject ?? copy.common.unknown}</p>
              </div>
              <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
                <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.common.deadline}</p>
                <p className="mt-2 text-sm font-medium">
                  {analysis.deadline_date ? new Date(analysis.deadline_date).toLocaleDateString(dateLocale) : copy.common.noClearDeadline}
                </p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge tone="neutral">{analysis.document_type ?? copy.common.document}</StatusBadge>
              <StatusBadge tone="accent">{getUrgencyLabel(analysis.urgency, locale)}</StatusBadge>
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--background-strong)] p-3 text-[var(--foreground)]">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">{copy.reply.situation}</h2>
                <p className="text-sm text-[var(--muted)]">{copy.reply.situationText}</p>
              </div>
            </div>
            <p className="text-sm leading-7 text-[var(--foreground)]">{analysis.summary_simple_long ?? analysis.summary_simple}</p>
          </Card>

          <Card className="space-y-3 p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--background-strong)] p-3 text-[var(--foreground)]">
                <SendHorizonal className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">{copy.reply.note}</h2>
                <p className="text-sm text-[var(--muted)]">{copy.reply.noteText}</p>
              </div>
            </div>
          </Card>
        </aside>

        <ReplyGeneratorForm
          documentId={document.id}
          existingReplies={replies}
          profileName={profile?.full_name ?? null}
          preferredLanguage={profile?.preferred_language ?? null}
          recommendedTone={recommendedTone}
          labels={{
            tone: copy.reply.tone,
            recommendedTone: recommendedToneLabel,
            useRecommended: useRecommendedLabel,
            format: copy.reply.format,
            asLetter: copy.reply.asLetter,
            asEmail: copy.reply.asEmail,
            includeName: copy.reply.includeName,
            create: copy.reply.create,
            creating: copy.reply.creating,
            regenerate: copy.reply.regenerate,
            regenerating: copy.reply.regenerating,
            previousDrafts: copy.reply.previousDrafts,
            german: copy.reply.german,
            translated: getAltLanguageLabel(profile?.preferred_language),
            tones: [copy.reply.neutral, copy.reply.friendly, copy.reply.veryFormal, copy.reply.objection, copy.reply.appeal, copy.reply.needMoreTime],
            customTone: customToneCopy.label,
            customTonePlaceholder: customToneCopy.placeholder
          }}
        />
      </div>
    </div>
  );
}
