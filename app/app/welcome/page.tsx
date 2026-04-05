import { WelcomeAssistantPanel } from "@/components/app/welcome-assistant-panel";
import { WelcomeOnboarding } from "@/components/app/welcome-onboarding";
import { WelcomeRoadmap } from "@/components/app/welcome-roadmap";
import { buildWelcomeAssistantOverview, syncDerivedWelcomeStatuses } from "@/lib/welcome-assistant";
import {
  getAllWelcomeStepDocumentLinks,
  getAllWelcomeStepPreparations,
  getAllWelcomeStepTaskLinks,
  getDocumentAnalysisByDocumentId,
  getDocumentsByIds,
  getPersonalDataSuggestions,
  getProfile,
  getTasksByIds,
  getUserPersonalData,
  getWelcomeProfile,
  getWelcomeSteps
} from "@/lib/queries";
import { normalizePreferredLanguage } from "@/lib/languages";
import { getRequestLanguage } from "@/lib/request-locale";
import { getWelcomeCopy } from "@/lib/welcome-ui";

export default async function WelcomePage() {
  const [profile, welcomeProfile, steps, preparations, documentLinks, taskLinks, personalData] = await Promise.all([
    getProfile(),
    getWelcomeProfile(),
    getWelcomeSteps(),
    getAllWelcomeStepPreparations(),
    getAllWelcomeStepDocumentLinks(),
    getAllWelcomeStepTaskLinks(),
    getUserPersonalData()
  ]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getWelcomeCopy(locale);
  const normalizedLocale = normalizePreferredLanguage(locale);

  const [documents, tasks, personalSuggestions] = await Promise.all([
    getDocumentsByIds(documentLinks.map((item) => item.document_id)),
    getTasksByIds(taskLinks.map((item) => item.task_id)),
    getPersonalDataSuggestions(locale)
  ]);
  const analyses = new Map(
    await Promise.all(documents.map(async (document) => [document.id, await getDocumentAnalysisByDocumentId(document.id)] as const))
  );
  const syncedSteps =
    (await syncDerivedWelcomeStatuses({
      steps,
      documentLinks,
      taskLinks,
      documents,
      analyses,
      tasks,
      preparations
    })) ?? steps;
  const overview = buildWelcomeAssistantOverview({
    locale,
    welcomeProfile,
    steps: syncedSteps,
    documentLinks,
    taskLinks,
    documents,
    analyses,
    tasks,
    preparations,
    personalSuggestions,
    personalData
  });

  return (
    <div className="space-y-8 sm:space-y-10">
      <section className="space-y-3 pt-3 sm:pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">BureauCare</p>
        <div className="space-y-3">
          <h1 className="page-title page-title-accent text-3xl sm:text-4xl xl:text-[2.85rem]">{copy.pageTitle}</h1>
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">{copy.pageIntro}</p>
        </div>
      </section>

      {welcomeProfile ? (
        <>
          <WelcomeAssistantPanel locale={normalizedLocale} overview={overview} />
          <WelcomeRoadmap locale={locale} steps={syncedSteps} />
        </>
      ) : (
        <WelcomeOnboarding locale={locale} />
      )}
    </div>
  );
}
