import { ArrowLeft, Eye, Lock, Shield } from "lucide-react";
import { Inter } from "next/font/google";
import Link from "next/link";
import { redirect } from "next/navigation";

import { AuthForm } from "@/components/auth/auth-form";
import { PageShell } from "@/components/ui/page-shell";
import { getAuthCopy } from "@/lib/auth-copy";
import { getRequestLanguage } from "@/lib/request-locale";
import { cn } from "@/lib/utils";
import { getCurrentUser } from "@/lib/queries";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"]
});

const trustIcons = [Shield, Lock, Eye] as const;

export default async function LoginPage({
  searchParams
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  const locale = await getRequestLanguage();
  const user = await getCurrentUser();
  if (user) {
    redirect("/app");
  }
  const copy = getAuthCopy(locale).loginPage;

  return (
    <PageShell
      className={cn(
        inter.className,
        "login-page justify-start px-4 py-10 sm:px-6 sm:py-12 lg:px-8 lg:py-16"
      )}
    >
      <div className="relative mx-auto grid w-full max-w-[1160px] gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(430px,520px)] lg:items-start lg:gap-14">
        <div
          className="pointer-events-none absolute inset-x-4 top-6 -z-10 h-56 rounded-[48px] bg-[radial-gradient(circle_at_top,rgba(255,200,200,0.32),transparent_70%)] blur-3xl sm:inset-x-10 lg:top-10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-0 left-1/2 -z-10 h-64 w-[min(100%,520px)] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(180,200,245,0.22),transparent_68%)] blur-3xl"
          aria-hidden
        />

        <section className="login-welcome-panel relative overflow-hidden rounded-[40px] border border-white/75 bg-[linear-gradient(152deg,rgba(255,244,244,0.96),rgba(248,236,240,0.55)_45%,rgba(232,240,252,0.94))] p-7 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset,0_10px_28px_rgba(25,40,60,0.08),0_28px_72px_rgba(41,64,90,0.14),0_56px_140px_rgba(41,64,90,0.1)] ring-1 ring-black/[0.04] backdrop-blur-[14px] sm:p-9 lg:p-11">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(180deg,rgba(255,248,248,0.5),transparent)]" />
          <div className="relative flex flex-col gap-10">
            <Link
              href="/"
              className="login-back-link group inline-flex w-fit items-center gap-2 text-sm font-medium text-[var(--muted)] transition-colors hover:text-[var(--foreground)]"
            >
              <ArrowLeft
                className="h-4 w-4 shrink-0 transition-transform duration-200 group-hover:-translate-x-1"
                strokeWidth={2}
                aria-hidden
              />
              <span>{copy.back}</span>
            </Link>

            <div className="space-y-7">
              <div className="inline-flex items-center gap-3 rounded-full border border-white/75 bg-white/55 px-4 py-2.5 shadow-[0_12px_32px_rgba(25,40,60,0.06)] backdrop-blur-md">
                <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_0_6px_rgba(95,163,163,0.15)]" />
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]/85">
                  {copy.eyebrow}
                </p>
              </div>
              <h1 className="max-w-[16ch] text-[2.15rem] font-semibold leading-[1.08] tracking-[-0.045em] text-[var(--foreground)] sm:text-5xl sm:leading-[1.05]">
                {copy.title}
              </h1>
              <p className="max-w-[36rem] text-[1.0625rem] leading-[1.65] text-[var(--muted)] sm:text-lg sm:leading-relaxed">
                {copy.intro}
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 sm:gap-3 lg:gap-4">
              {copy.trustItems.map((item, i) => {
                const Icon = trustIcons[i] ?? Shield;
                return (
                  <div
                    key={item}
                    className={cn(
                      "login-trust-card group flex flex-col rounded-[26px] border border-white/75 bg-[linear-gradient(165deg,rgba(255,255,255,0.92),rgba(244,249,252,0.78))] px-5 py-5 text-sm leading-relaxed text-[var(--foreground)] shadow-[0_14px_38px_rgba(25,40,60,0.055)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_52px_rgba(25,40,60,0.1)]",
                      i === 0 && "ring-1 ring-white/40",
                      i === 1 && "shadow-[0_16px_42px_rgba(25,40,60,0.065)]"
                    )}
                  >
                    <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgba(95,163,163,0.11)] text-[var(--accent-strong)] ring-1 ring-white/60 transition-colors group-hover:bg-[rgba(95,163,163,0.16)]">
                      <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
                    </div>
                    <p className="text-[0.9375rem] leading-relaxed">{item}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <AuthForm nextPath={params.next} locale={locale} defaultLanguage={locale} copy={copy.form} />
      </div>
    </PageShell>
  );
}
