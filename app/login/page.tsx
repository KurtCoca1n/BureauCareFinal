import Link from "next/link";

import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/ui/page-shell";
import { getAuthCopy } from "@/lib/auth-copy";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const locale = await getRequestLanguage();
  const copy = getAuthCopy(locale).loginPage;

  return (
    <PageShell className="justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14">
      <div className="relative mx-auto grid w-full max-w-[1160px] gap-8 lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,520px)] lg:items-center">
        <div className="pointer-events-none absolute inset-x-6 top-8 -z-10 h-44 rounded-[40px] bg-[radial-gradient(circle_at_top,rgba(111,168,220,0.22),transparent_72%)] blur-3xl sm:inset-x-12 lg:top-14" />

        <section className="relative overflow-hidden rounded-[40px] border border-white/55 bg-[linear-gradient(145deg,rgba(255,255,255,0.84),rgba(239,247,252,0.7))] p-6 shadow-[0_30px_88px_rgba(41,64,90,0.09)] backdrop-blur-[12px] sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.42),transparent)]" />
          <div className="relative space-y-8">
            <Link href="/" className="inline-flex items-center text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]">
              {copy.back}
            </Link>

            <div className="space-y-5">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/70 bg-white/58 px-4 py-2 shadow-[0_10px_24px_rgba(25,40,60,0.05)] backdrop-blur">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_rgba(95,163,163,0.14)]" />
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--accent-strong)]/80">
                  {copy.eyebrow}
                </p>
              </div>
              <h1 className="max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
                {copy.title}
              </h1>
              <p className="max-w-[34rem] text-base leading-7 text-[var(--muted)] sm:text-lg">
                {copy.intro}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              {copy.trustItems.map((item) => (
                <div
                  key={item}
                  className="rounded-[24px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(255,255,255,0.62))] px-4 py-4 text-sm leading-6 text-[var(--foreground)] shadow-[0_14px_32px_rgba(25,40,60,0.045)]"
                >
                  <div className="mb-3 h-9 w-9 rounded-2xl bg-[rgba(95,163,163,0.1)]" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <AuthForm nextPath={params.next} locale={locale} defaultLanguage={locale} copy={copy.form} />
      </div>
    </PageShell>
  );
}
