import Link from "next/link";
import type { Route } from "next";
import { Bell, ChevronRight, FileStack, LockKeyhole, MapPinned, Shield, Sparkles, UserRound, WalletCards } from "lucide-react";

import { LocationPreferencesCard } from "@/components/app/location-preferences-card";
import { MyDataOverview } from "@/components/app/my-data-overview";
import { ProfileSettingsPanel } from "@/components/app/profile-settings-panel";
import { ResponseSettingsPanel } from "@/components/app/response-settings-panel";
import {
  DocumentsSettingsPanel,
  GoalsSettingsPanel,
  LanguageSettingsPanel,
  LocationSettingsPanel,
  NotificationsSettingsPanel,
  PrivacySettingsPanel,
  SecuritySettingsPanel,
  TesterAdminPanel,
  UsageSettingsPanel
} from "@/components/app/settings-rest-panels";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getAccountRoleForUser, isTesterRole } from "@/lib/account-access";
import { getDateLocale } from "@/lib/i18n";
import { getLanguageLabel } from "@/lib/languages";
import { getProfileFirstName, getProfileFullName, getProfileLastName } from "@/lib/profile";
import { getCurrentUser, getPersonalDataSuggestions, getProfile, getUsageSummaryForCurrentUser, getUserPersonalData, getUserSettings } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";
import { getSettingsCopy, normalizeSettingsSection, type SettingsSectionId } from "@/lib/settings-ui";

type SettingsPageProps = {
  searchParams?: Promise<{
    section?: string;
  }>;
};

type SectionItem = {
  id: SettingsSectionId;
  href: string;
  title: string;
  summary: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  iconWrapClassName: string;
};

export default async function SettingsPage({ searchParams }: SettingsPageProps) {
  const [resolvedSearchParams, user, profile, usage, personalData, userSettings] = await Promise.all([
    searchParams,
    getCurrentUser(),
    getProfile(),
    getUsageSummaryForCurrentUser(),
    getUserPersonalData(),
    getUserSettings()
  ]);

  const locale = await getRequestLanguage(profile?.preferred_language);
  const dateLocale = getDateLocale(locale);
  const settingsCopy = getSettingsCopy(locale);
  const suggestions = await getPersonalDataSuggestions(locale);
  const role = user ? await getAccountRoleForUser(user.id) : "user";
  const isTester = isTesterRole(role);
  const selectedSection = normalizeSettingsSection(resolvedSearchParams?.section);
  const profileFirstName = profile?.first_name ?? getProfileFirstName(profile);
  const profileCreatedAtLabel = profile?.created_at ? new Date(profile.created_at).toLocaleDateString(dateLocale) : "-";
  const emailConfirmed = Boolean(user?.email_confirmed_at);

  const testerBadgeCopy =
    locale === "en"
      ? "Tester access"
      : locale === "zh"
        ? "Ce Shi Zhang Hao"
        : "Tester-Zugang";

  const sectionItems: SectionItem[] = [
    {
      id: "profile",
      href: "/app/settings?section=profile",
      title: settingsCopy.sections.profile.title,
      summary: settingsCopy.sections.profile.summary,
      description: settingsCopy.sections.profile.description,
      icon: UserRound,
      iconWrapClassName: "bg-[rgba(117,166,212,0.14)] text-[rgba(71,125,176,0.92)]"
    },
    {
      id: "location",
      href: "/app/settings?section=location",
      title: settingsCopy.sections.location.title,
      summary: settingsCopy.sections.location.summary,
      description: settingsCopy.sections.location.description,
      icon: MapPinned,
      iconWrapClassName: "bg-[rgba(191,214,200,0.18)] text-[rgba(78,132,104,0.94)]"
    },
    {
      id: "documents",
      href: "/app/settings?section=documents",
      title: settingsCopy.sections.documents.title,
      summary: settingsCopy.sections.documents.summary,
      description: settingsCopy.sections.documents.description,
      icon: FileStack,
      iconWrapClassName: "bg-[rgba(222,205,189,0.22)] text-[rgba(138,111,82,0.94)]"
    },
    {
      id: "notifications",
      href: "/app/settings?section=notifications",
      title: settingsCopy.sections.notifications.title,
      summary: settingsCopy.sections.notifications.summary,
      description: settingsCopy.sections.notifications.description,
      icon: Bell,
      iconWrapClassName: "bg-[rgba(205,194,228,0.18)] text-[rgba(112,97,152,0.94)]"
    },
    {
      id: "security",
      href: "/app/settings?section=security",
      title: settingsCopy.sections.security.title,
      summary: settingsCopy.sections.security.summary,
      description: settingsCopy.sections.security.description,
      icon: LockKeyhole,
      iconWrapClassName: "bg-[rgba(188,211,231,0.2)] text-[rgba(69,111,148,0.96)]"
    },
    {
      id: "usage",
      href: "/app/settings?section=usage",
      title: settingsCopy.sections.usage.title,
      summary: settingsCopy.sections.usage.summary,
      description: settingsCopy.sections.usage.description,
      icon: WalletCards,
      iconWrapClassName: "bg-[rgba(227,214,197,0.22)] text-[rgba(136,108,81,0.95)]"
    },
    {
      id: "privacy",
      href: "/app/settings?section=privacy",
      title: settingsCopy.sections.privacy.title,
      summary: settingsCopy.sections.privacy.summary,
      description: settingsCopy.sections.privacy.description,
      icon: Shield,
      iconWrapClassName: "bg-[rgba(180,201,225,0.2)] text-[rgba(69,108,149,0.95)]"
    },
    ...(isTester
      ? [
          {
            id: "tester-admin" as const,
            href: "/app/settings?section=tester-admin",
            title: settingsCopy.sections["tester-admin"].title,
            summary: settingsCopy.sections["tester-admin"].summary,
            description: settingsCopy.sections["tester-admin"].description,
            icon: Sparkles,
            iconWrapClassName: "bg-[rgba(216,204,234,0.22)] text-[rgba(111,86,156,0.95)]"
          }
        ]
      : [])
  ];

  const activeSection = sectionItems.find((item) => item.id === selectedSection) ?? sectionItems[0];

  return (
    <div className="space-y-6 sm:space-y-8">
      <section className="space-y-3 pt-3 sm:pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[var(--muted)]">BureauCare</p>
        <div className="space-y-3">
          <h1 className="page-title page-title-accent text-3xl sm:text-4xl xl:text-[2.85rem]">{settingsCopy.pageTitle}</h1>
          <p className="max-w-none text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">{settingsCopy.pageIntro}</p>
        </div>
      </section>

      <div className="grid min-w-0 gap-6 lg:gap-8 xl:grid-cols-[minmax(0,12.5rem)_minmax(0,1fr)] xl:items-start 2xl:grid-cols-[minmax(0,13.5rem)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-3 xl:sticky xl:top-8">
          <Card className="space-y-2 p-4 sm:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{settingsCopy.navigationTitle}</p>
            <p className="text-xs leading-relaxed text-[var(--muted)] sm:text-sm">{settingsCopy.navigationHint}</p>
          </Card>

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3 xl:grid-cols-1">
            {sectionItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSection.id;

              return (
                <Link
                  key={item.id}
                  href={item.href as Route}
                  className={[
                    "group block rounded-[22px] border p-3.5 transition duration-200",
                    "bg-white/95 shadow-[var(--shadow-soft)]",
                    isActive
                      ? "border-[rgba(165,192,217,0.92)] bg-[linear-gradient(180deg,rgba(239,245,250,0.98),rgba(255,255,255,0.98))] shadow-[0_16px_36px_rgba(29,58,90,0.07)]"
                      : "border-[var(--line)] hover:border-[rgba(208,220,234,0.92)] hover:bg-[rgba(248,250,252,0.98)]"
                  ].join(" ")}
                >
                  <div className="flex items-start gap-2.5">
                    <div className={["flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", item.iconWrapClassName].join(" ")}>
                      <Icon className="h-[1.125rem] w-[1.125rem]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 space-y-0.5">
                          <p className="text-sm font-semibold leading-snug text-[var(--foreground)]">{item.title}</p>
                          <p className="hidden text-xs leading-snug text-[var(--muted)] xl:line-clamp-2 xl:block">{item.summary}</p>
                        </div>
                        <ChevronRight
                          className={[
                            "mt-0.5 h-4 w-4 shrink-0 transition duration-200",
                            isActive ? "text-[var(--foreground)]" : "text-[var(--muted)] group-hover:text-[var(--foreground)]/70"
                          ].join(" ")}
                        />
                      </div>
                      <p className="mt-1 text-xs leading-snug text-[var(--muted)] xl:hidden">{item.summary}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Card className="settings-content-panel min-w-0 w-full max-w-none space-y-8 p-5 sm:p-7 lg:p-8 xl:p-9">
          <div className="space-y-3 border-b border-[rgba(222,228,236,0.92)] pb-6 sm:pb-7">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center rounded-full border border-[rgba(205,216,229,0.9)] bg-[rgba(241,245,249,0.95)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[rgba(78,94,114,0.86)] sm:text-xs sm:tracking-[0.16em]">
                {settingsCopy.currentArea}
              </span>
              {activeSection.id === "tester-admin" ? <StatusBadge tone="success">{testerBadgeCopy}</StatusBadge> : null}
            </div>
            <div className="space-y-2">
              <h2 className="page-title page-title-accent text-2xl leading-tight tracking-[-0.03em] sm:text-[2rem]">{activeSection.title}</h2>
              <p className="max-w-none text-sm leading-relaxed text-[var(--muted)] sm:text-[15px]">{activeSection.description}</p>
            </div>
          </div>

          {activeSection.id === "profile" ? (
            <div className="settings-profile-stack min-w-0 w-full max-w-none space-y-14 sm:space-y-16">
              <section id="settings-grunddaten" className="scroll-mt-28 space-y-5">
                <div className="space-y-1 border-b border-[rgba(222,228,236,0.75)] pb-4">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{settingsCopy.profileBlockBasic}</h3>
                </div>
                <ProfileSettingsPanel
                  locale={locale}
                  firstName={profileFirstName}
                  lastName={getProfileLastName(profile)}
                  email={user?.email ?? null}
                  phoneNumber={profile?.phone_number ?? null}
                  preferredLanguageLabel={getLanguageLabel(profile?.preferred_language ?? locale)}
                  createdAtLabel={profileCreatedAtLabel}
                  emailConfirmed={emailConfirmed}
                />
              </section>

              <section id="settings-personal-data" className="scroll-mt-28 space-y-5">
                <div className="space-y-1 border-b border-[rgba(222,228,236,0.75)] pb-4">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">
                    {settingsCopy.sections["personal-data"].title}
                  </h3>
                  <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{settingsCopy.sections["personal-data"].description}</p>
                </div>
                <MyDataOverview
                  locale={locale}
                  initialRecord={personalData}
                  suggestions={suggestions}
                  embedded
                  showSuggestions={false}
                  showSettingsLink={false}
                />
              </section>

              <section id="settings-responses" className="scroll-mt-28 space-y-5">
                <div className="space-y-1 border-b border-[rgba(222,228,236,0.75)] pb-4">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{settingsCopy.sections.responses.title}</h3>
                  <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{settingsCopy.sections.responses.description}</p>
                </div>
                <ResponseSettingsPanel
                  locale={locale}
                  defaultTone={profile?.reply_default_tone ?? "automatic"}
                  styleNote={profile?.reply_style_note ?? null}
                  includeSignature={profile?.reply_include_signature ?? true}
                  signature={profile?.reply_signature ?? null}
                  translationMode={profile?.reply_translation_mode ?? "app_language"}
                  suggestedFullName={getProfileFullName(profile)}
                />
              </section>

              <section id="settings-language" className="scroll-mt-28 space-y-5">
                <div className="space-y-1 border-b border-[rgba(222,228,236,0.75)] pb-4">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{settingsCopy.sections.language.title}</h3>
                  <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{settingsCopy.sections.language.description}</p>
                </div>
                <LanguageSettingsPanel locale={locale} preferredLanguage={profile?.preferred_language ?? locale} settings={userSettings!} />
              </section>

              <section id="settings-goals" className="scroll-mt-28 space-y-5">
                <div className="space-y-1 border-b border-[rgba(222,228,236,0.75)] pb-4">
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{settingsCopy.sections.goals.title}</h3>
                  <p className="max-w-none text-sm leading-relaxed text-[var(--muted)]">{settingsCopy.sections.goals.description}</p>
                </div>
                <GoalsSettingsPanel locale={locale} preferences={userSettings!.goal_preferences} />
              </section>
            </div>
          ) : null}

          {activeSection.id === "location" ? (
            <div className="space-y-5">
              <LocationSettingsPanel locale={locale} preferences={userSettings!.location_preferences} />
              <LocationPreferencesCard locale={locale} preferences={userSettings!.location_preferences} />
            </div>
          ) : null}

          {activeSection.id === "documents" ? <DocumentsSettingsPanel locale={locale} preferences={userSettings!.document_preferences} /> : null}

          {activeSection.id === "notifications" ? <NotificationsSettingsPanel locale={locale} preferences={userSettings!.notification_preferences} /> : null}

          {activeSection.id === "usage" ? (
            <UsageSettingsPanel locale={locale} role={role} usage={usage} />
          ) : null}

          {activeSection.id === "security" ? <SecuritySettingsPanel locale={locale} email={user?.email ?? null} /> : null}

          {activeSection.id === "privacy" ? <PrivacySettingsPanel locale={locale} /> : null}

          {activeSection.id === "tester-admin" && isTester ? (
            <TesterAdminPanel locale={locale} role={role} features={userSettings!.tester_preferences} />
          ) : null}
        </Card>
      </div>
    </div>
  );
}
