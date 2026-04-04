import { CaseCard } from "@/components/app/case-card";
import { Card } from "@/components/ui/card";
import { getCaseText } from "@/lib/case-ui";
import { getAllCases, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function CasesPage() {
  const [cases, profile] = await Promise.all([getAllCases(), getProfile()]);
  const locale = await getRequestLanguage(profile?.preferred_language);
  const caseText = getCaseText(locale);
  const pageCopy =
    locale === "en"
      ? {
          title: "Your cases",
          empty: "No cases yet. As soon as a document is analyzed, BureauCare assigns it to a case automatically."
        }
      : locale === "tr"
        ? {
            title: "Dosyaların",
            empty: "Henüz dosya yok. Bir belge analiz edildiğinde BureauCare onu otomatik olarak bir dosyaya atar."
          }
        : locale === "uk"
          ? {
              title: "Твої справи",
              empty: "Справ ще немає. Щойно документ буде проаналізовано, BureauCare автоматично віднесе його до справи."
            }
          : locale === "es"
            ? {
                title: "Tus casos",
                empty: "Todavía no hay casos. En cuanto se analice un documento, BureauCare lo asignará automáticamente a un caso."
              }
            : locale === "zh"
              ? {
                  title: "你的案件",
                  empty: "目前还没有案件。一旦文件完成分析，BureauCare 会自动把它归入对应案件。"
                }
              : {
                  title: "Deine Fälle",
                  empty: "Noch keine Fälle vorhanden. Sobald ein Dokument analysiert wurde, ordnet BureauCare es automatisch einem Fall zu."
                };

  return (
    <div className="space-y-6">
      <section className="space-y-2 pt-3">
        <h1 className="page-title page-title-accent text-4xl sm:text-5xl">{pageCopy.title}</h1>
      </section>

      {cases.length ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {cases.map((caseItem) => (
            <CaseCard key={caseItem.id} caseItem={caseItem} locale={locale} />
          ))}
        </div>
      ) : (
        <Card className="p-5 text-sm text-[var(--muted)]">{pageCopy.empty}</Card>
      )}
    </div>
  );
}

