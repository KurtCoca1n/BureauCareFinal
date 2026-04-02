import type { ReactNode } from "react";
import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight, CheckCircle2, FileStack, PlayCircle, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { ProcessRealityPanel } from "@/components/app/process-reality-panel";
import { Card } from "@/components/ui/card";
import { ExplanationRichText } from "@/components/ui/explanation-rich-text";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  getProcessCopy,
  getProcessDetail,
  getProcedureBySlug,
  getProcedureHref,
  getProcedureSummary,
  getProcessSectionItems
} from "@/lib/process-details";
import { getAuthorityLabel, getProcedureAvailabilityLabel, getProcedureTitle, type ProcessAuthority } from "@/lib/processes-ui";
import { getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";
import { processAuthorities } from "@/lib/processes-ui";

function BulletSection({
  title,
  items,
  icon,
  locale
}: {
  title: string;
  items: string[];
  icon: ReactNode;
  locale: string;
}) {
  if (!items.length) return null;

  return (
    <Card className="border-[var(--line)] p-6">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">{icon}</div>
        <h2 className="text-xl font-semibold tracking-[-0.03em]">{title}</h2>
      </div>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div key={item} className="flex items-start gap-3 rounded-[22px] border border-[var(--line)] bg-white/80 px-4 py-4">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent-strong)]" />
            <p className="text-sm leading-6 text-[var(--foreground)]">
              <ExplanationRichText text={item} locale={locale} />
            </p>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default async function ProcessDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [profile, procedure] = await Promise.all([getProfile(), Promise.resolve(getProcedureBySlug(slug))]);

  if (!procedure || !getProcessDetail(slug)) {
    notFound();
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getProcessCopy(locale);
  const title = getProcedureTitle(procedure, locale);
  const summary = getProcedureSummary(procedure.id, locale);
  const forWho = getProcessSectionItems(procedure.id, "forWho", locale);
  const notForWho = getProcessSectionItems(procedure.id, "notForWho", locale);
  const requirements = getProcessSectionItems(procedure.id, "requirements", locale);
  const needs = getProcessSectionItems(procedure.id, "needs", locale);
  const relatedAuthorities = procedure.authorityIds
    .map((authorityId) => processAuthorities.find((entry) => entry.id === authorityId))
    .filter((authority): authority is ProcessAuthority => Boolean(authority));

  return (
    <div className="mx-auto max-w-5xl space-y-8 pb-8">
      <section className="space-y-5 pt-2">
        <Link
          href="/app/processes"
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {copy.backLabel}
        </Link>

        <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,251,251,0.92))] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="accent">{copy.detailBadge}</StatusBadge>
            <StatusBadge tone="success">{getProcedureAvailabilityLabel(procedure, locale)}</StatusBadge>
            {relatedAuthorities.map((authority) => (
              <StatusBadge key={authority.id} tone="neutral">
                {getAuthorityLabel(authority, locale)}
              </StatusBadge>
            ))}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
            <div className="space-y-4">
              <h1 className="page-title page-title-accent text-3xl sm:text-5xl">{title}</h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--foreground)]/88 sm:text-lg">
                <ExplanationRichText text={summary} locale={locale} />
              </p>
            </div>

            <div className="rounded-[28px] border border-[var(--line)] bg-white/86 p-5">
              <p className="text-sm font-semibold text-[var(--accent-strong)]">{copy.startCta}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.startHint}</p>
              <Link
                href={`${getProcedureHref(procedure.id)}/start` as Route}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow)] transition hover:translate-y-[-1px]"
              >
                <PlayCircle className="h-4 w-4" />
                {copy.startCta}
              </Link>
            </div>
          </div>
        </Card>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)]">
        <div className="space-y-6">
          <BulletSection title={copy.forWhoTitle} items={forWho} icon={<Sparkles className="h-5 w-5" />} locale={locale} />
          {notForWho.length ? <BulletSection title={copy.notIdealTitle} items={notForWho} icon={<ArrowLeft className="h-5 w-5" />} locale={locale} /> : null}
          <BulletSection title={copy.requirementsTitle} items={requirements} icon={<CheckCircle2 className="h-5 w-5" />} locale={locale} />
          <ProcessRealityPanel procedureId={procedure.id} locale={locale} />
        </div>

        <div className="space-y-6">
          <BulletSection title={copy.needsTitle} items={needs} icon={<FileStack className="h-5 w-5" />} locale={locale} />

          <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,248,0.94))] p-6">
            <div className="space-y-3">
              <p className="text-sm font-semibold text-[var(--accent-strong)]">{copy.goodFitTitle}</p>
              <p className="text-sm leading-6 text-[var(--muted)]">
                <ExplanationRichText text={summary} locale={locale} />
              </p>
            </div>
            <Link
              href={`${getProcedureHref(procedure.id)}/start` as Route}
              className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              {copy.startCta}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
