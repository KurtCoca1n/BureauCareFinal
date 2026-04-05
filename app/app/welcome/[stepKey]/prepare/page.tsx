import { redirect } from "next/navigation";

import { WelcomePrepareFlow } from "@/components/app/welcome-prepare-flow";
import { Card } from "@/components/ui/card";
import { getWelcomePrepareCopy, getWelcomePrepareDefinition, getInitialWelcomePrepareAnswers } from "@/lib/welcome-prepare";
import {
  getProfile,
  getUserPersonalData,
  getWelcomeProfile,
  getWelcomeStepByKey,
  getWelcomeStepPreparationByKey
} from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";
import { isWelcomeStepKey } from "@/lib/welcome";

export default async function WelcomePreparePage({ params }: { params: Promise<{ stepKey: string }> }) {
  const { stepKey } = await params;
  const [profile, welcomeProfile, personalData] = await Promise.all([getProfile(), getWelcomeProfile(), getUserPersonalData()]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getWelcomePrepareCopy(locale);

  if (!isWelcomeStepKey(stepKey)) {
    return (
      <Card className="p-6 text-sm text-[var(--muted)]">
        <p>{copy.preparedText}</p>
      </Card>
    );
  }

  const definition = getWelcomePrepareDefinition(stepKey);
  if (!definition) {
    redirect(`/app/welcome/${stepKey}`);
  }

  const [step, preparation] = await Promise.all([getWelcomeStepByKey(stepKey), getWelcomeStepPreparationByKey(stepKey)]);
  if (!step) {
    redirect("/app/welcome");
  }

  const initialAnswers = getInitialWelcomePrepareAnswers({
    stepKey,
    preparationAnswers: preparation?.answers ?? null,
    personalData,
    welcomeProfile,
    fullName: profile?.full_name
  });

  return (
    <WelcomePrepareFlow
      locale={locale}
      step={step}
      welcomeProfile={welcomeProfile}
      personalData={personalData}
      fullName={profile?.full_name}
      initialAnswers={initialAnswers}
      initialSectionId={preparation?.current_section_id ?? definition.sections[0]?.id ?? null}
      initialStorageMode={preparation ? "remote" : "local"}
    />
  );
}
