import type { ReactNode } from "react";
import { redirect } from "next/navigation";

import { AppNavigation } from "@/components/app/app-navigation";
import { EmailConfirmationBanner } from "@/components/app/email-confirmation-banner";
import { PageScene } from "@/components/ui/page-scene";
import { PageShell } from "@/components/ui/page-shell";
import { getCurrentUser, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const [user, profile] = await Promise.all([getCurrentUser(), getProfile()]);

  if (!user) {
    redirect("/login");
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const showEmailBanner = Boolean(user.email && !user.email_confirmed_at);

  return (
    <PageShell className="gap-8 py-6 lg:flex-row lg:items-start lg:gap-10 lg:pb-8">
      <AppNavigation locale={locale} />
      <PageScene className="min-w-0 flex-1 space-y-8">
        {showEmailBanner && user.email ? (
          <EmailConfirmationBanner locale={locale} email={user.email} />
        ) : null}
        {children}
      </PageScene>
    </PageShell>
  );
}
