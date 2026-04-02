import { notFound } from "next/navigation";

import { ProcessWizard } from "@/components/app/process-wizard";
import { getProcessDetail, getProcedureBySlug, getProcedureHref } from "@/lib/process-details";
import { getInitialWizardAnswers, getProcessWizardDefinition, normalizeProcessWizardAnswers } from "@/lib/process-wizard-v2";
import { getProcedureTitle } from "@/lib/processes-ui";
import { getProcessSessionBySlug, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function ProcessStartPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [profile, procedure, session] = await Promise.all([
    getProfile(),
    Promise.resolve(getProcedureBySlug(slug)),
    getProcessSessionBySlug(slug)
  ]);

  if (!procedure || !getProcessDetail(slug)) {
    notFound();
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const definition = getProcessWizardDefinition(procedure.id);
  const initialAnswers = {
    ...getInitialWizardAnswers(procedure, profile?.full_name),
    ...normalizeProcessWizardAnswers(session?.answers ?? null)
  };
  const initialStepIndex = session?.current_step_index ?? 0;

  return (
    <ProcessWizard
      locale={locale}
      processSlug={procedure.id}
      processTitle={getProcedureTitle(procedure, locale)}
      backHref={getProcedureHref(procedure.id)}
      definition={definition}
      initialAnswers={initialAnswers}
      initialStepIndex={initialStepIndex}
      initialStorageMode={session ? "remote" : "local"}
    />
  );
}
