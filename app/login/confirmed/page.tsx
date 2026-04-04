import Link from "next/link";

import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { getAuthCopy } from "@/lib/auth-copy";
import { normalizePreferredLanguage } from "@/lib/languages";

const statusToTone = {
  success: "bg-[var(--accent)]",
  already: "bg-[var(--soft-blue)]",
  expired: "bg-[var(--orange)]",
  invalid: "bg-[var(--danger)]"
} as const;

export default async function ConfirmedPage({
  searchParams
}: {
  searchParams: Promise<{ status?: string; locale?: string }>;
}) {
  const params = await searchParams;
  const locale = normalizePreferredLanguage(params.locale);
  const copy = getAuthCopy(locale).confirmed;
  const status = params.status === "already" || params.status === "expired" || params.status === "invalid" ? params.status : "success";

  const content =
    status === "already"
      ? { title: copy.alreadyTitle, text: copy.alreadyText }
      : status === "expired"
        ? { title: copy.expiredTitle, text: copy.expiredText }
        : status === "invalid"
          ? { title: copy.invalidTitle, text: copy.invalidText }
          : { title: copy.successTitle, text: copy.successText };

  return (
    <PageShell className="justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="mx-auto w-full max-w-[760px]">
        <Card className="rounded-[40px] border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,249,252,0.92))] p-6 shadow-[0_32px_90px_rgba(34,54,78,0.11)] sm:p-8">
          <div className="space-y-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/58 px-4 py-2 shadow-[0_10px_24px_rgba(25,40,60,0.05)] backdrop-blur">
              <span className={`h-2.5 w-2.5 rounded-full ${statusToTone[status]} shadow-[0_0_0_6px_rgba(95,163,163,0.14)]`} />
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]/80">BureauCare</p>
            </div>

            <div className="space-y-3">
              <h1 className="max-w-[14ch] text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
                {content.title}
              </h1>
              <p className="max-w-[40rem] text-base leading-7 text-[var(--muted)] sm:text-lg">{content.text}</p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link
                href="/app"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[image:var(--accent-gradient)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:brightness-[1.02]"
              >
                {copy.openApp}
              </Link>
              <Link
                href="/login"
                className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[rgba(232,220,207,0.85)] bg-[rgba(232,220,207,0.32)] px-5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:bg-[rgba(232,220,207,0.48)]"
              >
                {copy.goToLogin}
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}
