import { ProcessesBrowser } from "@/components/app/processes-browser";
import { getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function ProcessesPage() {
  const profile = await getProfile();
  const locale = await getRequestLanguage(profile?.preferred_language);

  return <ProcessesBrowser locale={locale} />;
}
