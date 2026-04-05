"use client";

import { NearbyHelpLinks } from "@/components/app/nearby-help-links";
import type { LocationPreferences } from "@/lib/types";

export function GoalStepLocationHint({
  locale,
  stepTitle,
  stepDescription,
  note,
  locationPreferences
}: {
  locale: string;
  stepTitle: string;
  stepDescription: string;
  note?: string | null;
  locationPreferences?: LocationPreferences | null;
}) {
  return (
    <NearbyHelpLinks
      locale={locale}
      contextText={[stepTitle, stepDescription, note].filter(Boolean).join(" ")}
      initialLocation={
        locationPreferences?.latitude != null && locationPreferences.longitude != null
          ? {
              latitude: locationPreferences.latitude,
              longitude: locationPreferences.longitude,
              grantedAt: locationPreferences.granted_at ?? new Date().toISOString()
            }
          : null
      }
    />
  );
}
