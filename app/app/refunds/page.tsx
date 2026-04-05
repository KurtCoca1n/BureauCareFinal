import { MoneyBackFinderResults } from "@/components/app/money-back-finder-results";
import { getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function RefundsPage() {
  const profile = await getProfile();
  const locale = await getRequestLanguage(profile?.preferred_language);

  return <MoneyBackFinderResults locale={locale} />;
}
