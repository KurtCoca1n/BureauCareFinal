import Image from "next/image";
import Link from "next/link";
import { Camera, Lock, ShieldCheck, Sparkles, Upload } from "lucide-react";

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
    cameraCta: "Dokument fotografieren?",
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
    cameraCta: "Snap a document?",
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
    title: "BureauCare resmi belgeleri sana basit莽e a莽谋klar ve uygun yan谋t谋 haz谋rlar.",
    text: "Bir belge yükle ve birka莽 saniye i莽inde ne yapman gerekti臒ini anla. Sakin, a莽谋k ve resmi dil karma艧as谋 olmadan.",
    start: "Ba艧la",
    cameraCta: "Belgeyi fotografla?",
    privacy: "Belgelerin gizli ve korumal谋 kal谋r.",
    stepTitle: "Nas谋l 莽al谋艧谋r",
    stepHeading: "Ü莽 sakin ad谋m",
    steps: [
      ["1", "Belge yükle", "PDF veya görseli güvenli alan谋na kaydet."],
      ["2", "Basit a莽谋klama al", "Önemli noktalar谋, süreleri ve sonraki ad谋mlar谋 hemen gör."],
      ["3", "Yan谋t olu艧tur", "Almanca ve se莽ti臒in dilde kullan谋labilir bir yan谋t al."]
    ],
    audience: "BureauCare kimler i莽in",
    audienceItems: ["Ö臒renciler", "脟al谋艧anlar", "Serbest 莽al谋艧anlar", "Expatlar", "Zaman谋 az olanlar", "Bürokrasi stresi ya艧ayanlar"],
    trust: "Güven ve gizlilik",
    trustText:
      "Belgelerin özel bir depolama alan谋nda tutulur. Korumal谋 oturumlar ve Row Level Security sayesinde yaln谋zca sen eri艧ebilirsin.",
    trustCards: [
      ["Özel depolama", "Yüklemeler herkese a莽谋k olmaz, korumal谋 alan谋nda kal谋r."],
      ["Sakin tasar谋m", "A莽谋k dil, bol bo艧luk ve karma艧谋k olmayan bir arayüz."]
    ]
  },
  uk: {
    badge: "BureauCare V1",
    title: "BureauCare 锌褉芯褋褌芯 锌芯褟褋薪褞褦 芯褎褨褑褨泄薪褨 写芯泻褍屑械薪褌懈 褌邪 写芯锌芯屑邪谐邪褦 锌褨写谐芯褌褍胁邪褌懈 胁褨写锌芯胁褨写褜.",
    text: "袟邪胁邪薪褌邪卸 写芯泻褍屑械薪褌 褨 蟹邪 泻褨谢褜泻邪 褋械泻褍薪写 蟹褉芯蟹褍屑褨泄, 褖芯 锌芯褌褉褨斜薪芯 蟹褉芯斜懈褌懈. 小锌芯泻褨泄薪芯, 褔褨褌泻芯 泄 斜械蟹 斜褞褉芯泻褉邪褌懈褔薪芯褩 屑芯胁懈.",
    start: "袩芯褔邪褌懈",
    cameraCta: "袟褉芯斜懈褌懈 褫芯褌芯?",
    privacy: "孝胁芯褩 写芯泻褍屑械薪褌懈 锌褉懈胁邪褌薪褨 泄 蟹邪褏懈褖械薪褨.",
    stepTitle: "携泻 褑械 锌褉邪褑褞褦",
    stepHeading: "孝褉懈 褋锌芯泻褨泄薪褨 泻褉芯泻懈",
    steps: [
      ["1", "袟邪胁邪薪褌邪卸 写芯泻褍屑械薪褌", "袘械蟹锌械褔薪芯 蟹斜械褉械卸懈 PDF 邪斜芯 蟹芯斜褉邪卸械薪薪褟 褍 蟹邪褏懈褖械薪芯屑褍 锌褉芯褋褌芯褉褨."],
      ["2", "袨褌褉懈屑邪泄 锌褉芯褋褌械 锌芯褟褋薪械薪薪褟", "袨写褉邪蟹褍 锌芯斜邪褔 胁邪卸谢懈胁械, 褋褌褉芯泻懈 泄 薪邪褋褌褍锌薪褨 泻褉芯泻懈."],
      ["3", "小褌胁芯褉懈 胁褨写锌芯胁褨写褜", "袨褌褉懈屑邪泄 胁胁褨褔谢懈胁褍 泄 谐芯褌芯胁褍 写芯 胁懈泻芯褉懈褋褌邪薪薪褟 胁褨写锌芯胁褨写褜 薪褨屑械褑褜泻芯褞 褌邪 褋胁芯褦褞 屑芯胁芯褞."]
    ],
    audience: "袛谢褟 泻芯谐芯 BureauCare",
    audienceItems: ["小褌褍写械薪褌懈", "袩褉邪褑褨胁薪懈泻懈", "肖褉懈谢邪薪褋械褉懈", "袝泻褋锌邪褌懈", "袥褞写懈 蟹 薪械褋褌邪褔械褞 褔邪褋褍", "袥褞写懈, 褟泻懈褏 胁懈褋薪邪卸褍褦 斜褞褉芯泻褉邪褌褨褟"],
    trust: "袛芯胁褨褉邪 褌邪 锌褉懈胁邪褌薪褨褋褌褜",
    trustText:
      "孝胁芯褩 写芯泻褍屑械薪褌懈 蟹斜械褉褨谐邪褞褌褜褋褟 褍 锌褉懈胁邪褌薪芯屑褍 褋褏芯胁懈褖褨. 袟邪褏懈褖械薪褨 褋械褋褨褩 褌邪 Row Level Security 谐邪褉邪薪褌褍褞褌褜, 褖芯 写芯褋褌褍锌 屑邪褦褕 谢懈褕械 褌懈.",
    trustCards: [
      ["袩褉懈胁邪褌薪械 褋褏芯胁懈褖械", "袟邪胁邪薪褌邪卸械薪薪褟 薪械 褋褌邪褞褌褜 锌褍斜谢褨褔薪懈屑懈 泄 蟹邪谢懈褕邪褞褌褜褋褟 褍 褌胁芯褦屑褍 蟹邪褏懈褖械薪芯屑褍 锌褉芯褋褌芯褉褨."],
      ["小锌芯泻褨泄薪懈泄 写懈蟹邪泄薪", "袟褉芯蟹褍屑褨谢邪 屑芯胁邪, 斜邪谐邪褌芯 锌褉芯褋褌芯褉褍 泄 卸芯写薪芯谐芯 锌械褉械胁邪薪褌邪卸械薪芯谐芯 褨薪褌械褉褎械泄褋褍."]
    ]
  },
  es: {
    badge: "BureauCare V1",
    title: "BureauCare te explica documentos oficiales de forma simple y redacta la respuesta adecuada para ti.",
    text: "Sube un documento y entiende en pocos segundos qu茅 tienes que hacer. Claro, tranquilo y sin lenguaje burocr谩tico.",
    start: "Empezar",
    cameraCta: "¿Fotografiar un documento?",
    privacy: "Tus documentos son privados y est谩n protegidos.",
    stepTitle: "C贸mo funciona",
    stepHeading: "Tres pasos tranquilos",
    steps: [
      ["1", "Subir documento", "Guarda un PDF o una imagen de forma segura en tu espacio protegido."],
      ["2", "Recibir una explicaci贸n simple", "Ve enseguida lo importante, los plazos y los siguientes pasos."],
      ["3", "Crear una respuesta", "Obt茅n una respuesta educada y 煤til en alem谩n y en tu idioma."]
    ],
    audience: "Para qui茅n es BureauCare",
    audienceItems: ["Estudiantes", "Profesionales", "Aut贸nomos", "Expats", "Personas con poco tiempo", "Personas con estr茅s por la burocracia"],
    trust: "Confianza y privacidad",
    trustText:
      "Tus documentos se guardan en un 谩rea privada. Las sesiones protegidas y Row Level Security garantizan que solo t煤 puedas acceder a ellos.",
    trustCards: [
      ["Almacenamiento privado", "Las subidas nunca se publican y permanecen en tu 谩rea protegida."],
      ["Dise帽o tranquilo", "Lenguaje claro, mucho espacio y una interfaz sin ruido burocr谩tico."]
    ]
  }
} as const;

export default async function LandingPage() {
  const locale = await getRequestLanguage();
  const copy = marketingCopy[locale as keyof typeof marketingCopy] ?? marketingCopy.en;

  return (
    <PageShell className="max-w-6xl gap-16 py-10 lg:gap-24">
      <section className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div className="space-y-7">
          <div className="inline-flex">
            <Image
              src="/bureaucare-mark-temp-logo.png"
              alt="BureauCare"
              width={260}
              height={130}
              priority
              className="h-auto w-[170px] mix-blend-screen opacity-95 saturate-0 contrast-125 brightness-110 drop-shadow-[0_14px_30px_rgba(43,43,43,0.12)] sm:w-[215px] lg:w-[260px]"
            />
          </div>
          <StatusBadge tone="accent">{copy.badge}</StatusBadge>
          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-semibold leading-[1.05] tracking-[-0.05em] sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="max-w-2xl text-base leading-8 text-[var(--muted)] sm:text-lg">{copy.text}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <StartLink href="/login" label={copy.start} />
            <Link
              href={`/login?next=${encodeURIComponent("/app/upload?camera=1")}`}
              prefetch
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border-2 border-[var(--accent)] bg-white/90 px-6 text-sm font-semibold text-[var(--accent-strong)] shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-soft)] active:scale-[0.98]"
            >
              <Camera className="h-4 w-4 shrink-0" aria-hidden />
              {copy.cameraCta}
            </Link>
            <div className="inline-flex min-h-12 items-center rounded-2xl border border-[var(--line)] bg-white px-5 text-sm text-[var(--muted)]">
              {copy.privacy}
            </div>
          </div>
        </div>

        <Card className="space-y-4 border-[var(--line-strong)] bg-[var(--surface-strong)] p-6 sm:p-7">
          <div className="flex justify-end">
            <Image
              src="/bureaucare-mark-temp-logo.png"
              alt="BureauCare logo"
              width={170}
              height={85}
              className="h-auto w-[115px] mix-blend-screen opacity-85 saturate-0 contrast-125 brightness-110 sm:w-[140px]"
            />
          </div>
          <div className="grid gap-4">
            {(
              [
                { Icon: Upload, bg: "var(--accent-soft)", color: "var(--accent)", title: copy.steps[0][1], text: copy.steps[0][2] },
                { Icon: Sparkles, bg: "rgba(123,191,159,0.16)", color: "var(--petrol)", title: copy.steps[1][1], text: copy.steps[1][2] },
                { Icon: ShieldCheck, bg: "rgba(242,166,90,0.16)", color: "var(--foreground)", title: copy.steps[2][1], text: copy.steps[2][2] }
              ] as const
            ).map(
              ({ Icon, bg, color, title, text }: { Icon: typeof Upload; bg: string; color: string; title: string; text: string }) => {
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
          {copy.steps.map(([step, title, text]: readonly [string, string, string]) => (
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
            {copy.audienceItems.map((item: string) => (
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
            {copy.trustCards.map(([title, text]: readonly [string, string]) => (
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


