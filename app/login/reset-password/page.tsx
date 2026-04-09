import { Inter } from "next/font/google";
import Link from "next/link";

import { ResetPasswordForm } from "@/components/auth/reset-password-form";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { getAuthCopy } from "@/lib/auth-copy";
import { getRequestLanguage } from "@/lib/request-locale";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"]
});

export default async function ResetPasswordPage() {
  const locale = await getRequestLanguage();
  const copy = getAuthCopy(locale);

  return (
    <PageShell className={cn(inter.className, "justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-8 lg:py-14")}>
      <div className="mx-auto w-full max-w-[760px]">
        <Card className="rounded-[40px] border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(244,249,252,0.92))] p-6 shadow-[0_32px_90px_rgba(34,54,78,0.11)] sm:p-8">
          <div className="space-y-7">
            <div className="space-y-3">
              <h1 className="max-w-[18ch] text-4xl font-semibold tracking-[-0.05em] text-[var(--foreground)] sm:text-5xl">
                {locale === "de" ? "Neues Passwort setzen" : "Set a new password"}
              </h1>
              <p className="max-w-[40rem] text-base leading-7 text-[var(--muted)] sm:text-lg">
                {locale === "de"
                  ? "Wähle ein neues Passwort für dein Konto."
                  : "Choose a new password for your account."}
              </p>
            </div>

            <div className="space-y-4 rounded-[28px] border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.86),rgba(255,255,255,0.72))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.82)] sm:p-6">
              <ResetPasswordForm
                locale={locale}
                submitLabel={locale === "de" ? "Passwort speichern" : "Save password"}
                pendingLabel={locale === "de" ? "Speichere…" : "Saving…"}
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Link href="/login" className="text-sm font-medium text-[var(--muted)] transition hover:text-[var(--foreground)]">
                {copy.verifyEmail.backToLogin}
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </PageShell>
  );
}

