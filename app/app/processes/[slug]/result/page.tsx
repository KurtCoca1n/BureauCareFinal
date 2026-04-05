import Link from "next/link";
import type { Route } from "next";
import { ArrowLeft, ArrowRight, CheckCircle2, FolderOpen, Sparkles } from "lucide-react";
import { notFound } from "next/navigation";

import { NearbyHelpLinks } from "@/components/app/nearby-help-links";
import { ProcessResultActions } from "@/components/app/process-result-actions";
import { Card } from "@/components/ui/card";
import { ExplanationRichText } from "@/components/ui/explanation-rich-text";
import { StatusBadge } from "@/components/ui/status-badge";
import { ensureProcessCase } from "@/lib/process-case";
import { getProcedureBySlug, getProcedureHref } from "@/lib/process-details";
import { buildProcessResult } from "@/lib/process-result";
import { getProcessSessionBySlug, getProfile, getUserSettings } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function ProcessResultPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [profile, procedure, session, userSettings] = await Promise.all([
    getProfile(),
    Promise.resolve(getProcedureBySlug(slug)),
    getProcessSessionBySlug(slug),
    getUserSettings()
  ]);

  if (!procedure || !session) {
    notFound();
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const result = buildProcessResult(procedure.id, locale, (session.answers ?? {}) as Record<string, string>);

  if (!result) {
    notFound();
  }

  const caseRecord = await ensureProcessCase({
    session,
    title: result.procedureTitle,
    organization: result.officialAuthority,
    workflowStatusLabel: result.workflowStatusLabel,
    nextSteps: result.nextSteps.map((step) => step.title)
  });

  const actionLabels =
    locale === "en"
      ? { copy: "Copy text", print: "Save as PDF", email: "Send by email", openCase: "Open case", officialPdf: "Download official PDF" }
      : { copy: "Text kopieren", print: "Als PDF speichern", email: "Per E-Mail versenden", openCase: "Fall öffnen", officialPdf: "Originalantrag herunterladen" };

  return (
    <div className="mx-auto max-w-6xl space-y-8 pb-8">
      <section className="space-y-5 pt-2">
        <Link
          href={`${getProcedureHref(procedure.id)}/start` as Route}
          className="inline-flex items-center gap-2 text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
        >
          <ArrowLeft className="h-4 w-4" />
          {result.copy.title}
        </Link>

        <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,251,251,0.92))] p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone="accent">{result.copy.title}</StatusBadge>
            <StatusBadge tone="success">{result.workflowStatusLabel}</StatusBadge>
            {caseRecord ? <StatusBadge tone="neutral">{result.copy.savedInCase}</StatusBadge> : null}
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
            <div className="space-y-4">
              <h1 className="page-title page-title-accent text-3xl sm:text-5xl">{result.procedureTitle}</h1>
              <p className="max-w-3xl text-base leading-7 text-[var(--foreground)]/88 sm:text-lg">{result.copy.subtitle}</p>
            </div>
            <div className="rounded-[28px] border border-[var(--line)] bg-white/86 p-5">
              <p className="text-sm font-semibold text-[var(--accent-strong)]">{result.copy.saveCaseTitle}</p>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{result.copy.savedInCase}</p>
              {caseRecord ? (
                <Link
                  href={`/app/cases/${caseRecord.id}` as Route}
                  className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--accent-strong)] px-5 py-3 text-sm font-semibold text-white shadow-[var(--shadow)] transition hover:translate-y-[-1px]"
                >
                  <FolderOpen className="h-4 w-4" />
                  {result.copy.openCase}
                </Link>
              ) : null}
            </div>
          </div>
        </Card>
      </section>

      <ProcessResultActions
        preparedText={result.preparedText}
        emailSubject={result.emailSubject}
        emailBody={result.emailBody}
        caseHref={caseRecord ? `/app/cases/${caseRecord.id}` : null}
        officialPdfHref={result.officialPdfHref}
        labels={actionLabels}
      />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="space-y-6">
          <Card className="border-[var(--line)] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
                <Sparkles className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">{result.copy.summaryTitle}</h2>
            </div>
            <p className="mt-4 text-sm leading-6 text-[var(--muted)]">{result.summaryText}</p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {result.summaryItems.slice(0, 6).map((item) => (
                <div key={item.id} className="rounded-[20px] border border-[var(--line)] bg-white/88 px-4 py-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{item.label}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground)]">{item.value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-[var(--line)] p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <h2 className="text-xl font-semibold tracking-[-0.03em]">{result.copy.nextStepsTitle}</h2>
            </div>
            <div className="mt-5 space-y-4">
              {result.nextSteps.map((step, index) => (
                <div key={`${step.title}-${index}`} className="flex gap-4">
                  <div className="flex w-8 shrink-0 flex-col items-center">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-semibold text-[var(--accent-strong)]">
                      {index + 1}
                    </div>
                    {index < result.nextSteps.length - 1 ? <div className="mt-2 h-full w-px bg-[var(--line-strong)]" /> : null}
                  </div>
                  <div className="pb-4">
                    <h3 className="text-sm font-semibold text-[var(--foreground)]">
                      <ExplanationRichText text={step.title} locale={locale} />
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      <ExplanationRichText text={step.note} locale={locale} />
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-[var(--line)] p-6">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">{result.copy.createdTextTitle}</h2>
            <div className="mt-4 rounded-[22px] border border-[var(--line)] bg-white/88 p-4">
              <pre className="whitespace-pre-wrap text-sm leading-6 text-[var(--foreground)]">{result.preparedText}</pre>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          {result.officialFormName ? (
            <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,251,251,0.92))] p-6">
              <h2 className="text-xl font-semibold tracking-[-0.03em]">{result.officialFormName}</h2>
              {result.officialFormVersion ? <p className="mt-3 text-sm leading-6 text-[var(--muted)]">{result.officialFormVersion}</p> : null}
              {result.officialServiceUrl ? (
                <a
                  href={result.officialServiceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex min-h-11 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 py-2 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                >
                  Service-Berlin-Quelle öffnen
                </a>
              ) : null}
            </Card>
          ) : null}

          <Card className="border-[var(--line)] p-6">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">{result.copy.readyDocsTitle}</h2>
            <div className="mt-4 space-y-3">
              {result.readyDocuments.length ? (
                result.readyDocuments.map((document) => (
                  <div key={document.label} className="rounded-[20px] border border-[var(--line)] bg-white/88 px-4 py-4">
                    <p className="text-sm font-semibold text-[var(--foreground)]">
                      <ExplanationRichText text={document.label} locale={locale} />
                    </p>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                      <ExplanationRichText text={document.note} locale={locale} />
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-sm leading-6 text-[var(--muted)]">Noch keine Unterlage als vorhanden markiert.</p>
              )}
            </div>
          </Card>

          <Card className="border-[var(--line)] p-6">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">{result.copy.missingDocsTitle}</h2>
            <div className="mt-4 space-y-3">
              {result.missingDocuments.map((document) => (
                <div key={document.label} className="rounded-[20px] border border-[var(--line)] bg-white/88 px-4 py-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">
                    <ExplanationRichText text={document.label} locale={locale} />
                  </p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    <ExplanationRichText text={document.note} locale={locale} />
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(250,250,248,0.94))] p-6">
            <h2 className="text-xl font-semibold tracking-[-0.03em]">{result.copy.routeTitle}</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--muted)]">
              {result.officialAuthority ?? result.procedureTitle}
            </p>
            <div className="mt-4">
              <NearbyHelpLinks
                locale={locale}
                locationName={result.locationName}
                contextText={result.procedureTitle}
                actionMode={result.actionMode}
                initialLocation={
                  userSettings?.location_preferences.latitude != null && userSettings.location_preferences.longitude != null
                    ? {
                        latitude: userSettings.location_preferences.latitude,
                        longitude: userSettings.location_preferences.longitude,
                        grantedAt: userSettings.location_preferences.granted_at ?? new Date().toISOString()
                      }
                    : null
                }
              />
            </div>
          </Card>
        </div>
      </div>

      <div className="flex justify-end">
        <Link
          href={caseRecord ? (`/app/cases/${caseRecord.id}` as Route) : ("/app/cases" as Route)}
          className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
        >
          {caseRecord ? result.copy.openCase : result.copy.saveCaseTitle}
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
