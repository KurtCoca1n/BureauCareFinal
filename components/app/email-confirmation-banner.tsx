import Link from "next/link";
import type { Route } from "next";

import type { SupportedLanguage } from "@/lib/languages";

type BannerCopy = { title: string; body: string; action: string };

const de: BannerCopy = {
  title: "E-Mail noch nicht bestätigt",
  body: "Bitte bestätige deine E-Mail-Adresse, damit dein Konto vollständig freigeschaltet ist. Prüfe deinen Posteingang (und ggf. Spam).",
  action: "Anleitung & erneut senden"
};

const en: BannerCopy = {
  title: "Please confirm your email",
  body: "Confirm your email address to finish activating your account. Check your inbox (and spam) for the link we sent.",
  action: "Resend / help"
};

function bannerCopy(locale: SupportedLanguage): BannerCopy {
  if (locale === "de") return de;
  return en;
}

export function EmailConfirmationBanner({
  locale,
  email
}: {
  locale: SupportedLanguage;
  email: string;
}) {
  const c = bannerCopy(locale);
  const href = `/login/verify-email?email=${encodeURIComponent(email)}&locale=${encodeURIComponent(locale)}` as Route;

  return (
    <div
      role="status"
      className="rounded-2xl border border-[rgba(95,163,163,0.35)] bg-[linear-gradient(180deg,rgba(95,163,163,0.12),rgba(95,163,163,0.06))] px-4 py-3.5 sm:px-5"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 space-y-1">
          <p className="text-sm font-semibold text-[var(--foreground)]">{c.title}</p>
          <p className="text-sm leading-6 text-[var(--muted)]">{c.body}</p>
        </div>
        <Link
          href={href}
          className="shrink-0 text-sm font-semibold text-[var(--accent-strong)] underline-offset-4 hover:underline"
        >
          {c.action}
        </Link>
      </div>
    </div>
  );
}
