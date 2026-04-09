import Link from "next/link";

import { EmailConfirmedCheckForm } from "@/components/auth/email-confirmed-check-form";
import { ResendVerificationForm } from "@/components/auth/resend-verification-form";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { getAuthCopy } from "@/lib/auth-copy";
import { normalizePreferredLanguage } from "@/lib/languages";

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: Promise<{ email?: string; locale?: string }>;
}) {
  const params = await searchParams;
  const locale = normalizePreferredLanguage(params.locale);
  const copy = getAuthCopy(locale).verifyEmail;
  const email = params.email ?? "";
  const loginHref = `/login?next=${encodeURIComponent("/onboarding")}`;

  return (
    <PageShell className="justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-[760px]">
        <Card className="rounded-[40px] border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,249,252,0.92))] p-6 shadow-[0_32px_90px_rgba(34,54,78,0.11)] sm:p-8">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/58 px-4 py-2 shadow-[0_10px_24px_rgba(25,40,60,0.05)] backdrop-blur">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_rgba(95,163,163,0.14)]" />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]/80">{copy.eyebrow}</p>
            </div>

            <div className="space-y-3">
              <h1 className="max-w-[14ch] text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
                {copy.title}
              </h1>
              <p className="max-w-[40rem] text-base leading-7 text-[var(--muted)] sm:text-lg">{copy.intro}</p>
            </div>

            {email ? (
              <div className="rounded-[28px] border border-white/70 bg-[rgba(255,255,255,0.72)] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)]">
                <p className="text-sm font-medium text-[var(--muted)]">{copy.sentToLabel}</p>
                <p className="mt-1 text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{email}</p>
              </div>
            ) : null}

            <div className="space-y-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:p-6">
              <EmailConfirmedCheckForm
                email={email}
                locale={locale}
                label={locale === "de" ? "E‑Mail bestätigen" : "Confirm email"}
                pendingLabel={locale === "de" ? "Prüfe…" : "Checking…"}
              />
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.76),rgba(255,255,255,0.66))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:p-6">
              <p className="text-sm leading-6 text-[var(--muted)]">{copy.spamHint}</p>
              <ResendVerificationForm
                email={email}
                locale={locale}
                resendLabel={copy.resend}
                resendPendingLabel={copy.resendPending}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/login" className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]">
                {copy.backToLogin}
              </Link>
              <Link
                href={loginHref}
                className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]"
              >
                {copy.continueLater}
              </Link>
            </div>

            <div className="flex items-start gap-3 rounded-[24px] border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(180deg,rgba(95,163,163,0.1),rgba(95,163,163,0.06))] px-4 py-3.5 text-sm leading-6 text-[var(--muted)]">
              <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_rgba(95,163,163,0.12)]" />
              <span>{copy.trustNote}</span>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
