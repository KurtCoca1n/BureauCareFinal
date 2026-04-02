"use client";

import { NearbyHelpLinks } from "@/components/app/nearby-help-links";

export function GoalStepLocationHint({
  locale,
  stepTitle,
  stepDescription,
  note
}: {
  locale: string;
  stepTitle: string;
  stepDescription: string;
  note?: string | null;
}) {
  return (
    <NearbyHelpLinks
      locale={locale}
      contextText={[stepTitle, stepDescription, note].filter(Boolean).join(" ")}
    />
  );
}
