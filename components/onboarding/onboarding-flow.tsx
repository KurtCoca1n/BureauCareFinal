"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { SupportedLanguage } from "@/lib/languages";
import { dynamicSlideCount, getOnboardingCopy, type ContentSlide } from "@/lib/onboarding/copy";
import { ONBOARDING_DONE_KEY } from "@/lib/onboarding/storage";
import type { OnboardingPersonaId } from "@/lib/onboarding/types";

function markOnboardingDone() {
  try {
    localStorage.setItem(ONBOARDING_DONE_KEY, "1");
  } catch {
    /* ignore */
  }
}

function SlideContent({ slide }: { slide: ContentSlide }) {
  return (
    <div className="flex min-h-[42vh] flex-col items-center justify-center px-2 text-center sm:min-h-[38vh]">
      <h2 className="onboarding-animate max-w-[20ch] text-balance text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:max-w-[24ch] sm:text-4xl lg:text-[2.35rem]">
        {slide.headline}
      </h2>
      {slide.sub ? (
        <p className="onboarding-animate onboarding-delay-1 mt-5 max-w-md text-pretty text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
          {slide.sub}
        </p>
      ) : null}
      {slide.bullets?.length ? (
        <ul className="onboarding-animate onboarding-delay-2 mt-8 w-full max-w-sm space-y-3 text-left text-base leading-relaxed text-[var(--foreground)] sm:text-lg">
          {slide.bullets.map((b: string) => (
            <li key={b} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export type OnboardingFlowVariant = "default" | "signup_guest";

export function OnboardingFlow({
  locale,
  variant = "default",
  verifyEmailHref
}: {
  locale: SupportedLanguage;
  variant?: OnboardingFlowVariant;
  /** Required when variant is signup_guest */
  verifyEmailHref?: string;
}) {
  const router = useRouter();
  const copy = useMemo(() => getOnboardingCopy(locale), [locale]);
  const [step, setStep] = useState(0);
  const [persona, setPersona] = useState<OnboardingPersonaId | null>(null);

  const dLen = persona ? dynamicSlideCount(persona) : 0;
  const totalSteps = useMemo(() => {
    if (!persona) return 2;
    return 2 + dLen + 3 + 1;
  }, [persona, dLen]);

  const closingIndex = persona ? 2 + dLen + 3 : -1;

  const goNext = useCallback(() => {
    if (step === 1 && !persona) return;
    if (step < totalSteps - 1) setStep((s) => s + 1);
  }, [step, totalSteps, persona]);

  const goBack = useCallback(() => {
    if (step === 0) return;
    if (step === 1) setPersona(null);
    setStep((s) => s - 1);
  }, [step]);

  const complete = useCallback(
    (href: Route) => {
      markOnboardingDone();
      router.push(href);
    },
    [router]
  );

  const personaSelect = (id: OnboardingPersonaId) => {
    setPersona(id);
  };

  const renderBody = () => {
    if (step === 0) {
      return (
        <div className="flex min-h-[44vh] flex-col items-center justify-center px-2 text-center sm:min-h-[40vh]">
          <p className="onboarding-animate onboarding-emoji text-5xl sm:text-6xl" aria-hidden>
            👋
          </p>
          <h1 className="onboarding-animate onboarding-delay-1 mt-8 max-w-[18ch] text-balance text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl lg:text-[2.5rem]">
            {copy.welcome.headline}
          </h1>
          <p className="onboarding-animate onboarding-delay-2 mt-6 max-w-lg text-pretty text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
            {copy.welcome.sub}
          </p>
          <div className="onboarding-animate onboarding-delay-3 mt-12">
            <Button type="button" className="min-h-14 min-w-[12rem] rounded-2xl px-8 text-base" onClick={goNext}>
              {copy.welcome.next}
            </Button>
          </div>
        </div>
      );
    }

    if (step === 1) {
      return (
        <div className="mx-auto w-full max-w-lg">
          <h2 className="onboarding-animate text-center text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">
            {copy.persona.headline}
          </h2>
          <div className="onboarding-animate onboarding-delay-1 mt-10 grid gap-3 sm:gap-4">
            {copy.personas.map((p, i) => (
              <button
                key={p.id}
                type="button"
                onClick={() => personaSelect(p.id)}
                className={cn(
                  "group flex w-full items-center gap-4 rounded-[22px] border px-5 py-4 text-left transition-all duration-300",
                  "shadow-[0_8px_28px_rgba(25,40,60,0.05)] hover:-translate-y-0.5 hover:shadow-[0_16px_40px_rgba(25,40,60,0.09)]",
                  persona === p.id
                    ? "border-[var(--accent)]/45 bg-[linear-gradient(165deg,rgba(95,163,163,0.12),rgba(255,255,255,0.95))] ring-2 ring-[var(--accent)]/25"
                    : "border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(248,250,252,0.88))]"
                )}
                style={{ animationDelay: `${0.05 + i * 0.04}s` }}
              >
                <span className="text-2xl" aria-hidden>
                  {p.emoji}
                </span>
                <span className="text-base font-medium text-[var(--foreground)]">{p.label}</span>
              </button>
            ))}
          </div>
          <div className="onboarding-animate onboarding-delay-2 mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button type="button" variant="ghost" className="min-h-12 order-2 sm:order-1" onClick={goBack}>
              {copy.persona.back}
            </Button>
            <Button
              type="button"
              className="min-h-14 min-w-[12rem] order-1 rounded-2xl px-8 text-base sm:order-2"
              disabled={!persona}
              onClick={goNext}
            >
              {copy.persona.next}
            </Button>
          </div>
        </div>
      );
    }

    if (!persona) return null;

    if (step >= 2 && step < 2 + dLen) {
      const di = step - 2;
      const slide = copy.dynamic[persona][di];
      return <SlideContent slide={slide} />;
    }

    if (step >= 2 + dLen && step < 2 + dLen + 3) {
      const ci = step - (2 + dLen);
      const slide = copy.core[ci];
      return <SlideContent slide={slide} />;
    }

    if (step === closingIndex) {
      const isGuest = variant === "signup_guest" && verifyEmailHref;
      const closingCopy = isGuest ? copy.guestClosing : copy.closing;

      return (
        <div className="flex min-h-[42vh] flex-col items-center justify-center px-2 text-center sm:min-h-[38vh]">
          <h2 className="onboarding-animate max-w-[20ch] text-balance text-3xl font-semibold tracking-[-0.04em] text-[var(--foreground)] sm:text-4xl">
            {closingCopy.headline}
          </h2>
          <p className="onboarding-animate onboarding-delay-1 mt-6 max-w-md text-pretty text-lg leading-relaxed text-[var(--muted)] sm:text-xl">
            {closingCopy.sub}
          </p>
          <div className="onboarding-animate onboarding-delay-2 mt-12 flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              type="button"
              className="min-h-14 flex-1 rounded-2xl text-base"
              onClick={() =>
                isGuest && verifyEmailHref
                  ? complete(verifyEmailHref as Route)
                  : complete("/app/upload")
              }
            >
              {closingCopy.primary}
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="min-h-14 flex-1 rounded-2xl text-base"
              onClick={() => (isGuest ? complete("/login") : complete("/app"))}
            >
              {closingCopy.secondary}
            </Button>
          </div>
        </div>
      );
    }

    return null;
  };

  const showNavRow = step >= 2 && step < closingIndex;
  const showClosingOnly = persona !== null && step === closingIndex;

  return (
    <div className="onboarding-root mx-auto w-full max-w-[640px] px-4 py-6 sm:py-10">
      <Card className="onboarding-main-card relative overflow-hidden rounded-[40px] border border-white/75 bg-[linear-gradient(168deg,rgba(255,252,252,0.97),rgba(240,246,252,0.94))] p-6 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_0_0_1px_rgba(0,0,0,0.04),0_10px_28px_rgba(25,40,60,0.08),0_28px_72px_rgba(41,64,90,0.12)] sm:p-10 lg:p-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.45),transparent)]" />

        {step >= 2 && persona ? (
          <div className="mb-10 flex justify-center gap-2" aria-hidden>
            {Array.from({ length: totalSteps }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-2 w-2 rounded-full transition-all duration-300",
                  i === step ? "scale-125 bg-[var(--accent)]" : "bg-[var(--muted)]/25"
                )}
              />
            ))}
          </div>
        ) : null}

        <div key={step} className="relative z-[1]">
          {renderBody()}
        </div>

        {showNavRow ? (
          <div className="relative z-[1] mt-12 flex flex-col items-center gap-4 border-t border-[var(--line)]/80 pt-10 sm:flex-row sm:justify-between">
            <Button type="button" variant="ghost" className="min-h-12 order-2 sm:order-1" onClick={goBack}>
              {copy.closing.back}
            </Button>
            <Button type="button" className="order-1 min-h-14 min-w-[10rem] rounded-2xl text-base sm:order-2" onClick={goNext}>
              {copy.welcome.next}
            </Button>
          </div>
        ) : null}

        {showClosingOnly ? (
          <div className="relative z-[1] mt-10 flex justify-center border-t border-[var(--line)]/80 pt-8">
            <Button type="button" variant="ghost" className="min-h-12" onClick={goBack}>
              {copy.closing.back}
            </Button>
          </div>
        ) : null}
      </Card>
    </div>
  );
}
