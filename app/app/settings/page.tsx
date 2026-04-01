import { LocationPreferencesCard } from "@/components/app/location-preferences-card";
import { SignOutButton } from "@/components/app/sign-out-button";
import { SettingsForm } from "@/components/app/settings-form";
import { Card } from "@/components/ui/card";
import { getCopy, getUsageCopy } from "@/lib/i18n";
import { getLanguageLabel } from "@/lib/languages";
import { getProfile, getUsageSummaryForCurrentUser } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function SettingsPage() {
  const [profile, usage] = await Promise.all([getProfile(), getUsageSummaryForCurrentUser()]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getCopy(locale);
  const usageCopy = getUsageCopy(locale);

  return (
    <>
      <section className="space-y-2 pt-3">
        <p className="text-sm text-[var(--muted)]">{copy.settings.section}</p>
        <h1 className="text-3xl font-semibold">{copy.settings.title}</h1>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.settings.intro}</p>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
        <SettingsForm
          fullName={profile?.full_name ?? null}
          preferredLanguage={profile?.preferred_language ?? locale}
          labels={{
            fullName: copy.settings.fullName,
            translationLanguage: copy.settings.translationLanguage,
            save: copy.settings.save,
            saving: copy.settings.saving,
            placeholder: copy.settings.namePlaceholder
          }}
        />

        <div className="space-y-6 xl:sticky xl:top-6">
          <Card className="space-y-3 p-5">
            <h2 className="text-lg font-semibold">{copy.settings.currentState}</h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-[var(--muted)]">{copy.common.name}</p>
                <p className="font-medium">{profile?.full_name ?? copy.settings.noName}</p>
              </div>
              <div>
                <p className="text-[var(--muted)]">{copy.common.language}</p>
                <p className="font-medium">{getLanguageLabel(profile?.preferred_language ?? locale)}</p>
              </div>
            </div>
          </Card>

          {usage ? (
            <Card className="space-y-3 p-5">
              <h2 className="text-lg font-semibold">{usageCopy.title}</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">
                    {usage.analysisCount} / {usage.analysisLimit}
                  </p>
                  <p className="text-[var(--muted)]">{usageCopy.analyses}</p>
                </div>
                <div>
                  <p className="font-medium">
                    {usage.replyCount} / {usage.replyLimit}
                  </p>
                  <p className="text-[var(--muted)]">{usageCopy.replies}</p>
                </div>
              </div>
            </Card>
          ) : null}

          <LocationPreferencesCard locale={locale} />

          <Card className="space-y-4 p-5">
            <h2 className="text-lg font-semibold">{copy.common.session}</h2>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.settings.sessionText}</p>
            <SignOutButton label={copy.common.signOut} />
          </Card>
        </div>
      </div>
    </>
  );
}
