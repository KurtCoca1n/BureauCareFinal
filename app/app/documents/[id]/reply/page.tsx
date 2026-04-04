import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ChevronLeft, FileText, Mail, SendHorizonal } from "lucide-react";
import type { Route } from "next";

import { ReplyGeneratorForm } from "@/components/app/reply-generator-form";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAltLanguageLabel, getCopy, getDateLocale } from "@/lib/i18n";
import { getDocumentAnalysisByDocumentId, getDocumentById, getDraftRepliesByDocumentId, getProfile } from "@/lib/queries";
import { getReplyToneRecommendationWithAI } from "@/lib/openai/reply-tone-recommender";
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
        ? { label: "Ek ton iste臒i", placeholder: "Örne臒in: daha k谋sa ve daha net" }
        : locale === "uk"
          ? { label: "袛芯写邪褌泻芯胁械 锌芯斜邪卸邪薪薪褟 写芯 褌芯薪褍", placeholder: "袧邪锌褉懈泻谢邪写: 泻芯褉芯褌褕械 泄 锌褉褟屑褨褕械" }
          : locale === "es"
            ? { label: "Deseo adicional para el tono", placeholder: "Por ejemplo: m谩s corto y m谩s directo" }
            : { label: "Eigener Tonwunsch", placeholder: "Zum Beispiel: kürzer und direkter" };
  const recommendedToneLabel =
    locale === "en"
      ? "Recommended tone:"
      : locale === "tr"
        ? "Önerilen ton:"
        : locale === "uk"
          ? "袪械泻芯屑械薪写芯胁邪薪懈泄 褌芯薪:"
          : locale === "es"
            ? "Tono recomendado:"
            : "Empfohlener Ton:";
  const useRecommendedLabel =
    locale === "en"
      ? "Use suggestion"
      : locale === "tr"
        ? "Öneriyi kullan"
        : locale === "uk"
          ? "袙懈泻芯褉懈褋褌邪褌懈 锌芯褉邪写褍"
          : locale === "es"
            ? "Usar sugerencia"
            : "Vorschlag nutzen";
  const allowedTones = [copy.reply.neutral, copy.reply.friendly, copy.reply.veryFormal, copy.reply.objection, copy.reply.appeal, copy.reply.needMoreTime];
  const recommendedTone = await getReplyToneRecommendationWithAI({ analysis, locale, allowedTones });

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
            tones: allowedTones,
            customTone: customToneCopy.label,
            customTonePlaceholder: customToneCopy.placeholder
          }}
        />
      </div>
    </div>
  );
}




