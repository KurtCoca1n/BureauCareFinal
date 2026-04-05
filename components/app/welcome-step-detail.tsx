import Link from "next/link";
import { CalendarClock, CheckSquare, ChevronLeft, FileText, MapPinned, PenSquare, ShieldCheck, UploadCloud } from "lucide-react";

import { WelcomeGuidancePanel } from "@/components/app/welcome-guidance-panel";
import { WelcomeStepStatusControls } from "@/components/app/welcome-step-status-controls";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import type { LocationPreferences, WelcomeStepRecord } from "@/lib/types";
import { getWelcomePrepareDefinition, getLocalizedText, getWelcomePrepareCopy } from "@/lib/welcome-prepare";
import { getWelcomeCopy } from "@/lib/welcome-ui";
import type { WelcomeStepKey } from "@/lib/welcome";

const futureActionIcons = {
  form: FileText,
  upload: UploadCloud,
  reply: PenSquare,
  office: MapPinned,
  appointment: CalendarClock
} as const;

export function WelcomeStepDetail({
  locale,
  step,
  city,
  locationPreferences
}: {
  locale: string;
  step: WelcomeStepRecord;
  city: string | null | undefined;
  locationPreferences: LocationPreferences | null | undefined;
}) {
  const copy = getWelcomeCopy(locale);
  const prepareCopy = getWelcomePrepareCopy(locale);
  const detail = copy.steps[step.step_key as keyof typeof copy.steps];
  const prepareDefinition = getWelcomePrepareDefinition(step.step_key as WelcomeStepKey);

  if (!detail) {
    return (
      <Card className="p-6 text-sm text-[var(--muted)]">
        <p>{copy.detailNotFound}</p>
      </Card>
    );
  }

  const statusTone = step.status === "done" ? "success" : step.status === "in_progress" ? "accent" : "neutral";

  return (
    <div className="space-y-6 sm:space-y-7">
      <div className="space-y-4">
        <Link
          href="/app/welcome"
          className="inline-flex min-h-11 items-center gap-2 rounded-2xl border border-[rgba(223,229,236,0.94)] bg-white px-4 text-sm font-medium text-[var(--foreground)] transition duration-200 hover:border-[rgba(208,220,234,0.92)]"
        >
          <ChevronLeft className="h-4 w-4" />
          {copy.detailBack}
        </Link>

        <section className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={statusTone}>{copy.status[step.status]}</StatusBadge>
            <StatusBadge tone="accent">Welcome</StatusBadge>
          </div>
          <div className="space-y-3">
            <h1 className="page-title page-title-accent text-3xl sm:text-4xl xl:text-[2.85rem]">{detail.title}</h1>
            <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">{copy.detailIntro}</p>
            {prepareDefinition ? (
              <div className="pt-2">
                <Link href={`/app/welcome/${step.step_key}/prepare`} className="inline-flex">
                  <Button>{getLocalizedText(prepareDefinition.ctaLabel, locale)}</Button>
                </Link>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(320px,0.9fr)]">
        <div className="space-y-4">
          <Card className="space-y-5 p-5 sm:p-6">
            <div className="space-y-4">
              <div className="rounded-[24px] bg-[rgba(246,248,251,0.82)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{copy.detailWhatTitle}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{detail.what}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,248,251,0.82)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{copy.detailWhyTitle}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{detail.why}</p>
              </div>
              <div className="rounded-[24px] bg-[rgba(246,248,251,0.82)] p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--muted)]">{copy.detailWhenTitle}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--foreground)]">{detail.when}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.detailRequirementsTitle}</h2>
              <p className="text-sm leading-7 text-[var(--muted)]">{detail.description}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {detail.requirements.map((item) => (
                <div key={item} className="rounded-[24px] border border-[rgba(225,231,237,0.94)] bg-[rgba(250,252,255,0.94)] p-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded-2xl bg-[rgba(95,163,163,0.14)] p-2 text-[var(--accent-strong)]">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-7 text-[var(--foreground)]">{item}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.detailGuideTitle}</h2>
              <p className="text-sm leading-7 text-[var(--muted)]">{copy.detailGuideText}</p>
            </div>
            <div className="space-y-3">
              {detail.guide.map((item, index) => (
                <div key={`${index}-${item}`} className="flex items-start gap-4 rounded-[24px] border border-[rgba(225,231,237,0.94)] bg-[rgba(250,252,255,0.94)] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(95,163,163,0.14)] text-sm font-semibold text-[var(--accent-strong)]">
                    {index + 1}
                  </div>
                  <p className="pt-0.5 text-sm leading-7 text-[var(--foreground)]">{item}</p>
                </div>
              ))}
            </div>
          </Card>

          <WelcomeGuidancePanel
            locale={locale}
            stepKey={step.step_key as WelcomeStepKey}
            city={city}
            locationPreferences={locationPreferences}
          />
        </div>

        <div className="space-y-4">
          <Card className="space-y-4 p-5 sm:p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.detailStatusTitle}</h2>
              <p className="text-sm leading-7 text-[var(--muted)]">{copy.detailStatusText}</p>
            </div>
            <WelcomeStepStatusControls locale={locale} stepId={step.id} status={step.status} />
          </Card>

          <Card className="space-y-4 p-5 sm:p-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.detailPreparedTitle}</h2>
              <p className="text-sm leading-7 text-[var(--muted)]">{copy.detailPreparedText}</p>
            </div>
            <div className="space-y-3">
              {(Object.entries(copy.futureActions) as Array<[keyof typeof copy.futureActions, (typeof copy.futureActions)[keyof typeof copy.futureActions]]>).map(
                ([key, action]) => {
                  const Icon = futureActionIcons[key];
                  return (
                    <div
                      key={key}
                      className="rounded-[24px] border border-[rgba(225,231,237,0.94)] bg-[rgba(250,252,255,0.94)] p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-2xl bg-[rgba(95,163,163,0.14)] p-2 text-[var(--accent-strong)]">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold text-[var(--foreground)]">{action.title}</p>
                            <StatusBadge tone="neutral">{copy.comingSoon}</StatusBadge>
                          </div>
                          <p className="text-sm leading-7 text-[var(--muted)]">{action.text}</p>
                        </div>
                      </div>
                    </div>
                  );
                }
              )}
            </div>
          </Card>

          <Card className="space-y-3 p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-[rgba(95,163,163,0.14)] p-2 text-[var(--accent-strong)]">
                <CheckSquare className="h-4 w-4" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-[var(--foreground)]">{detail.description}</p>
                <p className="text-sm leading-7 text-[var(--muted)]">
                  {copy.detailPreparedText}
                </p>
                {prepareDefinition ? (
                  <div className="pt-2">
                    <Link href={`/app/welcome/${step.step_key}/prepare`} className="inline-flex">
                      <Button variant="secondary">{getLocalizedText(prepareDefinition.ctaLabel, locale)}</Button>
                    </Link>
                  </div>
                ) : (
                  <p className="text-xs font-medium text-[var(--muted)]">{prepareCopy.preparedText}</p>
                )}
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
