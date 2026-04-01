import { Lock, ShieldCheck, Sparkles, Upload } from "lucide-react";

import { StartLink } from "@/components/marketing/start-link";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { StatusBadge } from "@/components/ui/status-badge";
import { getRequestLanguage } from "@/lib/request-locale";

const marketingCopy = {
  de: {
    badge: "BureauCare V1",
    title: "BureauCare erklärt dir Behördendokumente einfach und schreibt die passende Antwort für dich.",
    text: "Lade ein Dokument hoch und verstehe in wenigen Sekunden, was du tun musst. Klar, ruhig und ohne Behördensprache.",
    start: "Starten",
    privacy: "Deine Dokumente sind privat und geschützt.",
    stepTitle: "So funktioniert es",
    stepHeading: "Drei ruhige Schritte",
    steps: [
      ["1", "Dokument hochladen", "PDF oder Bild sicher in deinem geschützten Bereich speichern."],
      ["2", "Einfach erklärt bekommen", "Das Wichtigste, Fristen und nächste Schritte sofort sehen."],
      ["3", "Antwort direkt erstellen", "Eine höfliche, nutzbare Antwort auf Deutsch und in deiner Sprache."]
    ],
    audience: "Für wen BureauCare gemacht ist",
    audienceItems: ["Studenten", "Berufstätige", "Selbstständige", "Expats", "Menschen mit wenig Zeit", "Menschen mit Stress durch Bürokratie"],
    trust: "Vertrauen und Datenschutz",
    trustText:
      "Deine Dokumente liegen in einem privaten Speicherbereich. Zugriffsschutz, geschützte Sessions und Row Level Security sorgen dafür, dass nur du deine Unterlagen sehen kannst.",
    trustCards: [
      ["Privater Speicher", "Uploads landen nicht öffentlich im Netz, sondern in deinem geschützten Bereich."],
      ["Ruhiges Produktdesign", "Klare Sprache, viel Weißraum und keine überladene Bürokratie-Oberfläche."]
    ]
  },
  en: {
    badge: "BureauCare V1",
    title: "BureauCare explains official documents in simple language and drafts the right reply for you.",
    text: "Upload a document and understand within seconds what you need to do. Clear, calm and without bureaucratic jargon.",
    start: "Get started",
    privacy: "Your documents stay private and protected.",
    stepTitle: "How it works",
    stepHeading: "Three calm steps",
    steps: [
      ["1", "Upload a document", "Store a PDF or image safely in your protected space."],
      ["2", "Get a simple explanation", "See the key facts, deadlines and next steps immediately."],
      ["3", "Create a reply", "Get a polite, usable reply in German and your chosen language."]
    ],
    audience: "Who BureauCare is for",
    audienceItems: ["Students", "Professionals", "Freelancers", "Expats", "People short on time", "People stressed by bureaucracy"],
    trust: "Trust and privacy",
    trustText:
      "Your documents stay in a private storage area. Protected sessions and row level security ensure that only you can access them.",
    trustCards: [
      ["Private storage", "Uploads are never public and stay inside your protected area."],
      ["Calm product design", "Clear language, plenty of whitespace and no overloaded bureaucracy interface."]
    ]
  },
  tr: {
    badge: "BureauCare V1",
    title: "BureauCare resmi belgeleri sana basitçe açıklar ve uygun yanıtı hazırlar.",
    text: "Bir belge yükle ve birkaç saniye içinde ne yapman gerektiğini anla. Sakin, açık ve resmi dil karmaşası olmadan.",
    start: "Başla",
    privacy: "Belgelerin gizli ve korumalı kalır.",
    stepTitle: "Nasıl çalışır",
    stepHeading: "Üç sakin adım",
    steps: [
      ["1", "Belge yükle", "PDF veya görseli güvenli alanına kaydet."],
      ["2", "Basit açıklama al", "Önemli noktaları, süreleri ve sonraki adımları hemen gör."],
      ["3", "Yanıt oluştur", "Almanca ve seçtiğin dilde kullanılabilir bir yanıt al."]
    ],
    audience: "BureauCare kimler için",
    audienceItems: ["Öğrenciler", "Çalışanlar", "Serbest çalışanlar", "Expatlar", "Zamanı az olanlar", "Bürokrasi stresi yaşayanlar"],
    trust: "Güven ve gizlilik",
    trustText:
      "Belgelerin özel bir depolama alanında tutulur. Korumalı oturumlar ve Row Level Security sayesinde yalnızca sen erişebilirsin.",
    trustCards: [
      ["Özel depolama", "Yüklemeler herkese açık olmaz, korumalı alanında kalır."],
      ["Sakin tasarım", "Açık dil, bol boşluk ve karmaşık olmayan bir arayüz."]
    ]
  },
  uk: {
    badge: "BureauCare V1",
    title: "BureauCare просто пояснює офіційні документи та допомагає підготувати відповідь.",
    text: "Завантаж документ і за кілька секунд зрозумій, що потрібно зробити. Спокійно, чітко й без бюрократичної мови.",
    start: "Почати",
    privacy: "Твої документи приватні й захищені.",
    stepTitle: "Як це працює",
    stepHeading: "Три спокійні кроки",
    steps: [
      ["1", "Завантаж документ", "Безпечно збережи PDF або зображення у захищеному просторі."],
      ["2", "Отримай просте пояснення", "Одразу побач важливе, строки й наступні кроки."],
      ["3", "Створи відповідь", "Отримай ввічливу й готову до використання відповідь німецькою та своєю мовою."]
    ],
    audience: "Для кого BureauCare",
    audienceItems: ["Студенти", "Працівники", "Фрилансери", "Експати", "Люди з нестачею часу", "Люди, яких виснажує бюрократія"],
    trust: "Довіра та приватність",
    trustText:
      "Твої документи зберігаються у приватному сховищі. Захищені сесії та Row Level Security гарантують, що доступ маєш лише ти.",
    trustCards: [
      ["Приватне сховище", "Завантаження не стають публічними й залишаються у твоєму захищеному просторі."],
      ["Спокійний дизайн", "Зрозуміла мова, багато простору й жодного перевантаженого інтерфейсу."]
    ]
  },
  es: {
    badge: "BureauCare V1",
    title: "BureauCare te explica documentos oficiales de forma simple y redacta la respuesta adecuada para ti.",
    text: "Sube un documento y entiende en pocos segundos qué tienes que hacer. Claro, tranquilo y sin lenguaje burocrático.",
    start: "Empezar",
    privacy: "Tus documentos son privados y están protegidos.",
    stepTitle: "Cómo funciona",
    stepHeading: "Tres pasos tranquilos",
    steps: [
      ["1", "Subir documento", "Guarda un PDF o una imagen de forma segura en tu espacio protegido."],
      ["2", "Recibir una explicación simple", "Ve enseguida lo importante, los plazos y los siguientes pasos."],
      ["3", "Crear una respuesta", "Obtén una respuesta educada y útil en alemán y en tu idioma."]
    ],
    audience: "Para quién es BureauCare",
    audienceItems: ["Estudiantes", "Profesionales", "Autónomos", "Expats", "Personas con poco tiempo", "Personas con estrés por la burocracia"],
    trust: "Confianza y privacidad",
    trustText:
      "Tus documentos se guardan en un área privada. Las sesiones protegidas y Row Level Security garantizan que solo tú puedas acceder a ellos.",
    trustCards: [
      ["Almacenamiento privado", "Las subidas nunca se publican y permanecen en tu área protegida."],
      ["Diseño tranquilo", "Lenguaje claro, mucho espacio y una interfaz sin ruido burocrático."]
    ]
  }
} as const;

export default async function LandingPage() {
  const locale = await getRequestLanguage();
  const copy = marketingCopy[locale];

  return (
    <PageShell className="max-w-6xl gap-16 py-10 lg:gap-24">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-7">
          <StatusBadge tone="accent">{copy.badge}</StatusBadge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">{copy.text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <StartLink href="/login" label={copy.start} />
            <div className="inline-flex min-h-12 items-center rounded-2xl border border-[var(--line)] bg-white px-5 text-sm text-[var(--muted)]">
              {copy.privacy}
            </div>
          </div>
        </div>

        <Card className="space-y-4 border-[var(--line-strong)] bg-[var(--surface-strong)] p-6 sm:p-7">
          <div className="grid gap-4">
            {(
              [
                { Icon: Upload, bg: "var(--accent-soft)", color: "var(--accent)", title: copy.steps[0][1], text: copy.steps[0][2] },
                { Icon: Sparkles, bg: "rgba(123,191,159,0.16)", color: "var(--petrol)", title: copy.steps[1][1], text: copy.steps[1][2] },
                { Icon: ShieldCheck, bg: "rgba(242,166,90,0.16)", color: "var(--foreground)", title: copy.steps[2][1], text: copy.steps[2][2] }
              ] as const
            ).map(({ Icon, bg, color, title, text }) => {
              const ItemIcon = Icon;

              return (
                <div key={title as string} className="rounded-[24px] bg-white p-5 shadow-[var(--shadow-soft)]">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="rounded-2xl p-3" style={{ backgroundColor: bg as string, color: color as string }}>
                      <ItemIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold break-words">{title}</p>
                      <p className="mt-1 text-sm text-[var(--muted)] break-words">{text}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </section>

      <section className="space-y-5">
        <div className="space-y-3">
          <StatusBadge tone="neutral">{copy.stepTitle}</StatusBadge>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{copy.stepHeading}</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {copy.steps.map(([step, title, text]) => (
            <Card key={step} className="h-full p-6">
              <p className="text-sm font-semibold text-[var(--accent)]">{step}</p>
              <h3 className="mt-3 text-xl font-semibold break-words">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--muted)] break-words">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[0.95fr_1.05fr]">
        <Card className="space-y-4 p-6">
          <h2 className="text-2xl font-semibold tracking-[-0.03em]">{copy.audience}</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {copy.audienceItems.map((item) => (
              <div key={item} className="rounded-[22px] bg-white px-4 py-4 text-sm font-medium shadow-[var(--shadow-soft)] break-words">
                {item}
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-semibold tracking-[-0.03em]">{copy.trust}</h2>
              <p className="mt-2 text-sm leading-7 text-[var(--muted)]">{copy.trustText}</p>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {copy.trustCards.map(([title, text]) => (
              <div key={title} className="rounded-[22px] bg-white p-4 shadow-[var(--shadow-soft)]">
                <p className="text-sm font-semibold break-words">{title}</p>
                <p className="mt-2 text-sm text-[var(--muted)] break-words">{text}</p>
              </div>
            ))}
          </div>
        </Card>
      </section>
    </PageShell>
  );
}
