import { MyDataOverview } from "@/components/app/my-data-overview";
import { getPersonalDataSuggestions, getProfile, getUserPersonalData } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function MyDataPage() {
  const [profile, personalData] = await Promise.all([getProfile(), getUserPersonalData()]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const suggestions = await getPersonalDataSuggestions(locale);

  return <MyDataOverview locale={locale} initialRecord={personalData} suggestions={suggestions} />;
}
