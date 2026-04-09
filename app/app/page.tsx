import Link from "next/link";
import { ArrowRight, Upload } from "lucide-react";
import type { Route } from "next";

import { CaseCard } from "@/components/app/case-card";
import { HomeImpactSection } from "@/components/app/home-impact-section";
import { HomeExtrasSection } from "@/components/app/home-extras-section";
import { HomeIntentSearch } from "@/components/app/home-intent-search";
import { HomeGreeting } from "@/components/app/home-greeting";
import { HomeGuidedTour } from "@/components/app/home-guided-tour";
import { HomeStatusOverview } from "@/components/app/home-status-overview";
import { PersonalDataSuggestionsSection } from "@/components/app/personal-data-suggestions-section";
import { Terminradar } from "@/components/app/terminradar";
import { WeeklyOverview } from "@/components/app/weekly-overview";
import { WelcomeAssistantPanel } from "@/components/app/welcome-assistant-panel";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { buildHomeCaseSummaryLine, getCasesListCopy } from "@/lib/case-ui";
import { estimateHomeImpact } from "@/lib/home-impact";
import { getHomeGreeting } from "@/lib/home-greeting-v2";
import { getCopy, getDateLocale } from "@/lib/i18n";
import { normalizePreferredLanguage } from "@/lib/languages";
import { getProfileFirstName } from "@/lib/profile";
import { buildWelcomeAssistantOverview, syncDerivedWelcomeStatuses } from "@/lib/welcome-assistant";
import {
  getAllWelcomeStepDocumentLinks,
  getAllWelcomeStepPreparations,
  getAllWelcomeStepTaskLinks,
  getAllCases,
  getAllTasks,
  getDocumentAnalysisByDocumentId,
  getDocumentsByIds,
  getPersonalDataSuggestions,
  getProfile,
  getTaskReminderBuckets,
  getUsageSummaryForCurrentUser,
  getTasksByIds,
  getUserPersonalData,
  getWeeklyOverviewDocumentsContext,
  getWelcomeSteps,
  getWelcomeProfile
} from "@/lib/queries";
import { buildTerminradarItems } from "@/lib/terminradar";
import { buildWeeklyOverviewItems } from "@/lib/weekly-overview";
import { getRequestLanguage } from "@/lib/request-locale";

export const dynamic = "force-dynamic";

export default async function AppHomePage() {
  const [profile, reminderBuckets, allCases, allTasks, weeklyDocs, usageSummary, welcomeProfile, welcomeSteps, welcomePreparations, welcomeDocumentLinks, welcomeTaskLinks, personalData] =
    await Promise.all([
    getProfile(),
    getTaskReminderBuckets(),
    getAllCases(),
    getAllTasks(),
    getWeeklyOverviewDocumentsContext(),
    getUsageSummaryForCurrentUser(),
    getWelcomeProfile(),
    getWelcomeSteps(),
    getAllWelcomeStepPreparations(),
    getAllWelcomeStepDocumentLinks(),
    getAllWelcomeStepTaskLinks(),
    getUserPersonalData()
  ]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const normalizedLocale = normalizePreferredLanguage(locale);
  const [suggestions, welcomeDocuments, welcomeTasks] = await Promise.all([
    getPersonalDataSuggestions(locale),
    getDocumentsByIds(welcomeDocumentLinks.map((item) => item.document_id)),
    getTasksByIds(welcomeTaskLinks.map((item) => item.task_id))
  ]);
  const copy = getCopy(locale);
  const dateLocale = getDateLocale(locale);
  const casesListCopy = getCasesListCopy(locale);
  const greeting = getHomeGreeting(locale, getProfileFirstName(profile));
  const welcomeAnalyses = new Map(
    await Promise.all(welcomeDocuments.map(async (document) => [document.id, await getDocumentAnalysisByDocumentId(document.id)] as const))
  );
  const syncedWelcomeSteps =
    (await syncDerivedWelcomeStatuses({
      steps: welcomeSteps,
      documentLinks: welcomeDocumentLinks,
      taskLinks: welcomeTaskLinks,
      documents: welcomeDocuments,
      analyses: welcomeAnalyses,
      tasks: welcomeTasks,
      preparations: welcomePreparations
    })) ?? welcomeSteps;
  const welcomeOverview =
    welcomeProfile && syncedWelcomeSteps.length
      ? buildWelcomeAssistantOverview({
          locale,
          welcomeProfile,
          steps: syncedWelcomeSteps,
          documentLinks: welcomeDocumentLinks,
          taskLinks: welcomeTaskLinks,
          documents: welcomeDocuments,
          analyses: welcomeAnalyses,
          tasks: welcomeTasks,
          preparations: welcomePreparations,
          personalSuggestions: suggestions,
          personalData
        })
      : null;

  const actionCases = allCases.filter((c) => c.status !== "done" || c.openTasksCount > 0);
  const previewCases = actionCases.slice(0, 3);
  const summaryLine = buildHomeCaseSummaryLine(actionCases, casesListCopy);

  const completedTasksCount = allTasks.filter((task) => task.status === "done").length;
  const impact = estimateHomeImpact({
    analyzedDocumentsCount: usageSummary?.analysisCount ?? 0,
    createdRepliesCount: usageSummary?.replyCount ?? 0,
    completedTasksCount,
    casesCount: allCases.length
  });

  const weeklyLang = normalizedLocale === "en" ? "en" : "de";
  const weeklyOverviewItems = buildWeeklyOverviewItems({
    tasks: allTasks,
    cases: allCases,
    documents: weeklyDocs.documents,
    analysesByDocumentId: weeklyDocs.analysesByDocumentId,
    draftsByDocumentId: weeklyDocs.draftsByDocumentId,
    lang: weeklyLang
  });

  const terminradarItems = buildTerminradarItems({
    tasks: allTasks,
    documents: weeklyDocs.documents,
    analysesByDocumentId: weeklyDocs.analysesByDocumentId,
    limit: 4,
    reference: new Date()
  });

  return (
    <div className="space-y-10">
      <div className="space-y-6" data-tour="home-overview">
        <HomeGreeting
          locale={locale}
          fullName={getProfileFirstName(profile)}
          greetingBase={greeting.greetingBase}
          greetings={greeting.greetings}
          initialSupportLine={greeting.supportLine}
          supportLines={greeting.supportLines}
          initialPhase={greeting.phase}
        />
        <HomeIntentSearch locale={locale} />
        <HomeExtrasSection
          locale={locale}
          profile={profile}
          welcomeProfile={welcomeProfile}
          usageSummary={usageSummary}
          openTasksCount={allTasks.filter((t) => t.status !== "done").length}
          openCasesCount={allCases.filter((c) => c.status !== "done").length}
        />
        <HomeImpactSection
          locale={normalizedLocale}
          moneyEur={impact.moneyEur}
          timeMinutes={impact.timeMinutes}
          nervesPercent={impact.nervesPercent}
        />
      </div>

      <div data-tour="home-weekly">
        <WeeklyOverview locale={locale} dateLocale={dateLocale} items={weeklyOverviewItems} />
      </div>

      <div className="space-y-10">
        <Link href="/app/upload" className="block" data-tour="home-upload">
          <Card className="group border-2 border-[var(--accent)]/25 bg-[var(--surface-strong)] p-6 shadow-[0_14px_40px_rgba(44,122,123,0.08)] transition hover:border-[var(--accent)]/40 hover:shadow-[0_18px_48px_rgba(44,122,123,0.12)] sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 space-y-2">
                <StatusBadge tone="accent">{copy.home.newLetter}</StatusBadge>
                <h2 className="text-[1.35rem] font-semibold tracking-[-0.03em] sm:text-2xl">{copy.home.uploadTitle}</h2>
                <p className="max-w-xl text-sm leading-relaxed text-[var(--muted)]">{copy.home.uploadText}</p>
                <p className="text-sm font-medium leading-relaxed text-[var(--foreground)]/80">{copy.home.uploadActionHint}</p>
              </div>
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3.5 text-[var(--accent)] transition group-hover:scale-[1.03]">
                <Upload className="h-6 w-6" aria-hidden />
              </div>
            </div>
            <div className="mt-6 inline-flex items-center text-sm font-semibold text-[var(--accent-strong)]">
              {copy.home.uploadTitle}
              <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden />
            </div>
          </Card>
        </Link>

        <Terminradar locale={locale} dateLocale={dateLocale} items={terminradarItems} />

        <HomeGuidedTour />

        {welcomeOverview ? <WelcomeAssistantPanel locale={normalizedLocale} overview={welcomeOverview} /> : null}

        <PersonalDataSuggestionsSection locale={locale} suggestions={suggestions} />

        <HomeStatusOverview locale={locale} buckets={reminderBuckets} />

        <section className="rounded-[22px] border border-[var(--line)] bg-[linear-gradient(165deg,rgba(255,255,255,0.96),rgba(246,250,249,0.88))] p-4 shadow-[0_10px_28px_rgba(43,43,43,0.04)] sm:p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <h2 className="text-base font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                {casesListCopy.homeActionTitle}
              </h2>
              {actionCases.length > 0 ? (
                <p className="text-sm leading-snug text-[var(--muted)]">{summaryLine}</p>
              ) : (
                <p className="text-sm leading-snug text-[var(--muted)]">{casesListCopy.homeNoCases}</p>
              )}
            </div>
            <Link
              href={"/app/cases" as Route}
              className="shrink-0 text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]"
            >
              {casesListCopy.homeAllCases}
            </Link>
          </div>

          {previewCases.length > 0 ? (
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
              {previewCases.map((caseItem) => (
                <CaseCard key={caseItem.id} caseItem={caseItem} locale={locale} compact />
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
