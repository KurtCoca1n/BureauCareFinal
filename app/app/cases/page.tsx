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
          empty:
            "No cases yet. BureauCare creates a case when you analyze a document—and you can also save one early from the decision screen after upload."
        }
      : locale === "tr"
        ? {
            title: "Dosyaların",
            empty:
              "Henüz dosya yok. Bir belge analiz edildiğinde BureauCare bir dosya oluşturur; istersen yüklemeden sonra karar ekranından da kaydedebilirsin."
          }
        : locale === "uk"
          ? {
              title: "Твої справи",
              empty:
                "Справ ще немає. BureauCare створює справу після аналізу документа — або ти можеш зберегти її раніше з екрана рішення після завантаження."
            }
          : locale === "es"
            ? {
                title: "Tus casos",
                empty:
                  "Todavía no hay casos. BureauCare crea uno al analizar un documento; también puedes guardarlo desde la pantalla de decisión tras subirlo."
              }
            : locale === "zh"
              ? {
                  title: "你的案件",
                  empty:
                    "目前还没有案件。分析文件时 BureauCare 会创建案件；你也可以在上传后的决策页提前保存为案件。"
                }
              : {
                  title: "Deine Fälle",
                  empty:
                    "Noch keine Fälle. BureauCare legt einen Fall an, sobald du ein Dokument analysierst – du kannst ihn aber auch schon nach dem Upload auf der Entscheidungsseite speichern."
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

