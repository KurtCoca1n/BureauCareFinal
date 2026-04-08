import { Inter } from "next/font/google";
import { redirect } from "next/navigation";

import { OnboardingFlow } from "@/components/onboarding/onboarding-flow";
import { PageShell } from "@/components/ui/page-shell";
import { normalizePreferredLanguage } from "@/lib/languages";
import { getCurrentUser, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"]
});

export default async function OnboardingPage({
  searchParams
}: {
  searchParams: Promise<{ from?: string; email?: string; locale?: string }>;
}) {
  const params = await searchParams;
  const signupEmail =
    typeof params.email === "string" ? params.email.trim() : "";
  const user = await getCurrentUser();

  const isGuestSignup =
    params.from === "signup" && signupEmail.length > 0 && !user;

  if (!isGuestSignup && !user) {
    redirect("/login");
  }

  const profile = user ? await getProfile() : null;
  const locale = await getRequestLanguage(
    profile?.preferred_language ??
      (isGuestSignup ? normalizePreferredLanguage(params.locale ?? "de") : undefined)
  );

  const verifyEmailHref =
    isGuestSignup && signupEmail
      ? `/login/verify-email?email=${encodeURIComponent(signupEmail)}&locale=${encodeURIComponent(locale)}`
      : undefined;

  return (
    <PageShell
      className={cn(
        inter.className,
        "onboarding-page justify-start px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
      )}
    >
      <OnboardingFlow
        locale={locale}
        variant={isGuestSignup ? "signup_guest" : "default"}
        verifyEmailHref={verifyEmailHref}
      />
    </PageShell>
  );
}
