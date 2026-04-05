import { ArrowUpRight, CalendarClock, ClipboardList, MapPin, MousePointerClick } from "lucide-react";

import { NearbyHelpLinks } from "@/components/app/nearby-help-links";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { LocationPreferences } from "@/lib/types";
import { buildWelcomeGuidanceContext } from "@/lib/welcome-guidance";
import type { WelcomeStepKey } from "@/lib/welcome";

export function WelcomeGuidancePanel({
  locale,
  stepKey,
  city,
  locationPreferences
}: {
  locale: string;
  stepKey: WelcomeStepKey;
  city: string | null | undefined;
  locationPreferences: LocationPreferences | null | undefined;
}) {
  const context = buildWelcomeGuidanceContext({
    stepKey,
    locale,
    city,
    locationPreferences
  });

  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{context.copy.sectionTitle}</h2>
          <p className="text-sm leading-7 text-[var(--muted)]">{context.copy.sectionText}</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-[24px] border border-[rgba(225,231,237,0.94)] bg-[rgba(250,252,255,0.94)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{context.copy.authorityLabel}</p>
            <p className="mt-2 text-sm font-semibold text-[var(--foreground)]">{context.institutionName}</p>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{context.institutionTypeLabel}</p>
          </div>
          <div className="rounded-[24px] border border-[rgba(225,231,237,0.94)] bg-[rgba(250,252,255,0.94)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{context.copy.channelLabel}</p>
            <div className="mt-2 flex items-center gap-2 text-[var(--foreground)]">
              <MousePointerClick className="h-4 w-4 text-[var(--accent-strong)]" />
              <p className="text-sm font-semibold">{context.channelLabel}</p>
            </div>
          </div>
          <div className="rounded-[24px] border border-[rgba(225,231,237,0.94)] bg-[rgba(250,252,255,0.94)] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{context.copy.appointmentLabel}</p>
            <div className="mt-2 flex items-center gap-2 text-[var(--foreground)]">
              <CalendarClock className="h-4 w-4 text-[var(--accent-strong)]" />
              <p className="text-sm font-semibold">{context.appointmentLabel}</p>
            </div>
          </div>
        </div>

        <div className="rounded-[24px] bg-[rgba(246,248,251,0.82)] p-4">
          <p className="text-sm leading-7 text-[var(--foreground)]">{context.explanation}</p>
        </div>

        <div className="rounded-[24px] border border-[rgba(95,163,163,0.18)] bg-[linear-gradient(135deg,rgba(95,163,163,0.08),rgba(111,168,220,0.05))] p-4">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white/80 p-2 text-[var(--accent-strong)] shadow-[var(--shadow-soft)]">
              <MapPin className="h-4 w-4" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-[var(--foreground)]">{context.copy.localHintTitle}</p>
              <p className="text-sm leading-7 text-[var(--muted)]">{context.localHint}</p>
              {!context.locationEnabled ? <p className="text-xs font-medium text-[var(--muted)]">{context.locationOffText}</p> : null}
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[rgba(95,163,163,0.14)] p-2 text-[var(--accent-strong)]">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{context.copy.nextStepTitle}</h2>
              <StatusBadge tone="accent">{context.copy.nextBadge}</StatusBadge>
            </div>
            <p className="text-sm leading-7 text-[var(--foreground)]">{context.nextStep}</p>
          </div>
        </div>
      </Card>

      <Card className="space-y-4 p-5 sm:p-6">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{context.copy.routeAreaTitle}</h2>
          <p className="text-sm leading-7 text-[var(--muted)]">{context.copy.routeAreaText}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {context.mapsSearchHref ? (
            <a
              href={context.mapsSearchHref}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-[rgba(223,229,236,0.94)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition duration-200 hover:border-[rgba(208,220,234,0.92)]"
            >
              {context.mapsSearchLabel}
              <ArrowUpRight className="ml-2 h-4 w-4" />
            </a>
          ) : null}
        </div>

        <NearbyHelpLinks
          locale={locale}
          locationName={context.routeLocationName}
          address={context.routeAddress}
          contextText={context.explanation}
          actionMode={context.guidance.channel === "online" ? "online" : context.guidance.channel === "post" ? "per_post" : "vor_ort"}
          actionUrl={context.mapsSearchHref}
          initialLocation={
            locationPreferences?.latitude != null && locationPreferences?.longitude != null
              ? {
                  latitude: locationPreferences.latitude,
                  longitude: locationPreferences.longitude,
                  grantedAt: locationPreferences.granted_at ?? new Date().toISOString()
                }
              : null
          }
        />
      </Card>

      <Card className="space-y-3 p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-[rgba(95,163,163,0.14)] p-2 text-[var(--accent-strong)]">
            <ClipboardList className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">{context.copy.taskPrepTitle}</p>
            <p className="text-sm leading-7 text-[var(--muted)]">{context.copy.taskPrepText}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
