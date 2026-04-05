import Link from "next/link";
import type { Route } from "next";
import {
  Bell,
  ChevronRight,
  FileStack,
  Globe,
  Goal,
  LockKeyhole,
  MapPinned,
  MessageSquareQuote,
  Shield,
  Sparkles,
  UserRound,
  WalletCards
} from "lucide-react";

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

function PreparedSettingsCard({
  title,
  description,
  preparedTitle,
  preparedText,
  availableNow,
  testerOnly
}: {
  title: string;
  description: string;
  preparedTitle: string;
  preparedText: string;
  availableNow: string;
  testerOnly?: string;
}) {
  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-6">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{availableNow}</p>
          <h3 className="text-xl font-semibold text-[var(--foreground)]">{title}</h3>
          <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">{description}</p>
        </div>
      </Card>

      <Card className="space-y-4 border-[rgba(220,228,238,0.92)] bg-[linear-gradient(180deg,rgba(244,248,252,0.96),rgba(255,255,255,0.98))] p-6">
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[rgba(182,201,220,0.42)] bg-[rgba(209,223,238,0.28)] px-3 py-1 text-xs font-semibold text-[rgba(44,67,92,0.9)]">
          <Sparkles className="h-3.5 w-3.5" />
          {preparedTitle}
        </div>
        <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">{preparedText}</p>
        {testerOnly ? <p className="text-sm font-medium text-[rgba(72,90,112,0.85)]">{testerOnly}</p> : null}
      </Card>
    </div>
  );
}

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
      id: "personal-data",
      href: "/app/settings?section=personal-data",
      title: settingsCopy.sections["personal-data"].title,
      summary: settingsCopy.sections["personal-data"].summary,
      description: settingsCopy.sections["personal-data"].description,
      icon: FileStack,
      iconWrapClassName: "bg-[rgba(143,188,166,0.16)] text-[rgba(72,133,114,0.94)]"
    },
    {
      id: "responses",
      href: "/app/settings?section=responses",
      title: settingsCopy.sections.responses.title,
      summary: settingsCopy.sections.responses.summary,
      description: settingsCopy.sections.responses.description,
      icon: MessageSquareQuote,
      iconWrapClassName: "bg-[rgba(187,171,223,0.17)] text-[rgba(108,92,152,0.95)]"
    },
    {
      id: "language",
      href: "/app/settings?section=language",
      title: settingsCopy.sections.language.title,
      summary: settingsCopy.sections.language.summary,
      description: settingsCopy.sections.language.description,
      icon: Globe,
      iconWrapClassName: "bg-[rgba(159,201,219,0.18)] text-[rgba(62,125,150,0.95)]"
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
      id: "goals",
      href: "/app/settings?section=goals",
      title: settingsCopy.sections.goals.title,
      summary: settingsCopy.sections.goals.summary,
      description: settingsCopy.sections.goals.description,
      icon: Goal,
      iconWrapClassName: "bg-[rgba(171,210,195,0.18)] text-[rgba(70,132,109,0.94)]"
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
          <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">{settingsCopy.pageIntro}</p>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        <div className="space-y-4 xl:sticky xl:top-8">
          <Card className="space-y-3 p-5 sm:p-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted)]">{settingsCopy.navigationTitle}</p>
              <p className="text-sm leading-6 text-[var(--muted)]">{settingsCopy.navigationHint}</p>
            </div>
          </Card>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {sectionItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.id === activeSection.id;

              return (
                <Link
                  key={item.id}
                  href={item.href as Route}
                  className={[
                    "group block rounded-[28px] border p-4 transition duration-300",
                    "bg-white/92 shadow-[var(--shadow-soft)] backdrop-blur",
                    isActive
                      ? "border-[rgba(165,192,217,0.92)] bg-[linear-gradient(180deg,rgba(239,245,250,0.98),rgba(255,255,255,0.98))] shadow-[0_20px_44px_rgba(29,58,90,0.08)]"
                      : "border-[rgba(255,255,255,0.88)] hover:-translate-y-0.5 hover:border-[rgba(208,220,234,0.92)] hover:bg-[rgba(248,250,252,0.98)]"
                  ].join(" ")}
                >
                  <div className="flex items-start gap-3">
                    <div className={["flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl", item.iconWrapClassName].join(" ")}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <p className="font-semibold text-[var(--foreground)]">{item.title}</p>
                          <p className="text-sm leading-6 text-[var(--muted)]">{item.summary}</p>
                        </div>
                        <ChevronRight
                          className={[
                            "mt-1 h-4 w-4 shrink-0 transition duration-300",
                            isActive ? "text-[var(--foreground)]" : "text-[var(--muted)] group-hover:translate-x-0.5"
                          ].join(" ")}
                        />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <Card className="space-y-6 p-5 sm:p-6 lg:p-7">
          <div className="space-y-4 border-b border-[rgba(222,228,236,0.92)] pb-5 sm:pb-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center rounded-full border border-[rgba(205,216,229,0.9)] bg-[rgba(241,245,249,0.95)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[rgba(78,94,114,0.86)]">
                {settingsCopy.currentArea}
              </span>
              {activeSection.id === "tester-admin" ? <StatusBadge tone="success">{testerBadgeCopy}</StatusBadge> : null}
            </div>
            <div className="space-y-2">
              <h2 className="page-title page-title-accent text-2xl sm:text-[2rem]">{activeSection.title}</h2>
              <p className="max-w-3xl text-sm leading-7 text-[var(--muted)] sm:text-[15px]">{activeSection.description}</p>
            </div>
          </div>

          {activeSection.id === "profile" ? (
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
          ) : null}

          {activeSection.id === "personal-data" ? (
            <MyDataOverview
              locale={locale}
              initialRecord={personalData}
              suggestions={suggestions}
              embedded
              showSuggestions={false}
              showSettingsLink={false}
            />
          ) : null}

          {activeSection.id === "responses" ? (
            <ResponseSettingsPanel
              locale={locale}
              defaultTone={profile?.reply_default_tone ?? "automatic"}
              styleNote={profile?.reply_style_note ?? null}
              includeSignature={profile?.reply_include_signature ?? true}
              signature={profile?.reply_signature ?? null}
              translationMode={profile?.reply_translation_mode ?? "app_language"}
              suggestedFullName={getProfileFullName(profile)}
            />
          ) : null}

          {activeSection.id === "language" ? (
            <LanguageSettingsPanel locale={locale} preferredLanguage={profile?.preferred_language ?? locale} settings={userSettings!} />
          ) : null}

          {activeSection.id === "location" ? (
            <div className="space-y-5">
              <LocationSettingsPanel locale={locale} preferences={userSettings!.location_preferences} />
              <LocationPreferencesCard locale={locale} preferences={userSettings!.location_preferences} />
            </div>
          ) : null}

          {activeSection.id === "documents" ? <DocumentsSettingsPanel locale={locale} preferences={userSettings!.document_preferences} /> : null}

          {activeSection.id === "goals" ? <GoalsSettingsPanel locale={locale} preferences={userSettings!.goal_preferences} /> : null}

          {activeSection.id === "notifications" ? <NotificationsSettingsPanel locale={locale} preferences={userSettings!.notification_preferences} /> : null}

          {activeSection.id === "usage" ? (
            <UsageSettingsPanel locale={locale} role={role} usage={usage} />
          ) : null}

          {activeSection.id === "security" ? <SecuritySettingsPanel locale={locale} email={user?.email ?? null} /> : null}

          {activeSection.id === "privacy" ? <PrivacySettingsPanel locale={locale} /> : null}

          {activeSection.id === "tester-admin" && isTester ? (
            <TesterAdminPanel locale={locale} role={role} features={userSettings!.tester_preferences} />
          ) : null}

          {activeSection.id !== "profile" &&
          activeSection.id !== "personal-data" &&
          activeSection.id !== "responses" &&
          activeSection.id !== "language" &&
          activeSection.id !== "location" &&
          activeSection.id !== "documents" &&
          activeSection.id !== "goals" &&
          activeSection.id !== "notifications" &&
          activeSection.id !== "usage" &&
          activeSection.id !== "security" &&
          activeSection.id !== "privacy" &&
          activeSection.id !== "tester-admin" ? (
            <PreparedSettingsCard
              title={activeSection.title}
              description={activeSection.description}
              preparedTitle={settingsCopy.preparedTitle}
              preparedText={settingsCopy.preparedText}
              availableNow={settingsCopy.availableNow}
              testerOnly={activeSection.id === "tester-admin" ? settingsCopy.testerOnly : undefined}
            />
          ) : null}
        </Card>
      </div>
    </div>
  );
}
