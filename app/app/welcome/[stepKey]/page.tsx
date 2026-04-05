import { redirect } from "next/navigation";

import { WelcomeStepDetail } from "@/components/app/welcome-step-detail";
import { WelcomeStepWorkspace } from "@/components/app/welcome-step-workspace";
import { Card } from "@/components/ui/card";
import {
  getCaseById,
  getDocumentAnalysisByDocumentId,
  getDocumentsByIds,
  getDraftRepliesByDocumentId,
  getProfile,
  getRecentDocuments,
  getTasksByIds,
  getUserSettings,
  getWelcomeProfile,
  getWelcomeStepByKey,
  getWelcomeStepCaseByKey,
  getWelcomeStepDocumentLinks,
  getWelcomeStepTaskLinks
} from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";
import { getWelcomeCopy } from "@/lib/welcome-ui";
import { isWelcomeStepKey } from "@/lib/welcome";
import { normalizePreferredLanguage } from "@/lib/languages";

export default async function WelcomeStepPage({ params }: { params: Promise<{ stepKey: string }> }) {
  const { stepKey } = await params;
  const [profile, welcomeProfile, userSettings] = await Promise.all([getProfile(), getWelcomeProfile(), getUserSettings()]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getWelcomeCopy(locale);

  if (!isWelcomeStepKey(stepKey)) {
    return (
      <Card className="p-6 text-sm text-[var(--muted)]">
        <p>{copy.detailNotFound}</p>
      </Card>
    );
  }

  const step = await getWelcomeStepByKey(stepKey);
  if (!step) {
    redirect("/app/welcome");
  }

  const [caseLink, documentLinks, taskLinks, recentDocuments] = await Promise.all([
    getWelcomeStepCaseByKey(stepKey),
    getWelcomeStepDocumentLinks(stepKey),
    getWelcomeStepTaskLinks(stepKey),
    getRecentDocuments()
  ]);

  const [linkedCase, documents, tasks] = await Promise.all([
    caseLink?.case_id ? getCaseById(caseLink.case_id) : Promise.resolve(null),
    getDocumentsByIds(documentLinks.map((item) => item.document_id)),
    getTasksByIds(taskLinks.map((item) => item.task_id))
  ]);

  const documentItems = await Promise.all(
    documents.map(async (document) => ({
      document,
      analysis: await getDocumentAnalysisByDocumentId(document.id),
      replies: await getDraftRepliesByDocumentId(document.id)
    }))
  );

  return (
    <div className="space-y-6">
      <WelcomeStepDetail
        locale={locale}
        step={step}
        city={welcomeProfile?.city}
        locationPreferences={userSettings?.location_preferences ?? null}
      />
      <WelcomeStepWorkspace
        locale={normalizePreferredLanguage(locale)}
        stepKey={stepKey}
        linkedCase={linkedCase}
        workspace={{
          caseItem: linkedCase,
          documents: documentItems,
          tasks,
          recentDocuments: recentDocuments.filter((document) => !documentLinks.some((link) => link.document_id === document.id))
        }}
      />
    </div>
  );
}
