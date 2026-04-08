import {
  CalendarClock,
  ChevronRight,
  FileSearch,
  MessageCircle,
  PenLine,
  Shield,
  Sparkles,
  Upload
} from "lucide-react";
import { Inter } from "next/font/google";

import { StartLink } from "@/components/marketing/start-link";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";
import { getRequestLanguage } from "@/lib/request-locale";
import { cn } from "@/lib/utils";

type LandingCopy = {
  heroBadge: string;
  heroTitle: string;
  heroText: string;
  heroTrust: string;
  start: string;
  audienceEyebrow: string;
  audienceSupporting: string;
  howTitle: string;
  howSubtitle: string;
  flowSteps: { title: string; text: string }[];
  keyPoints: { title: string; text: string }[];
  audienceLine: string;
  audienceTags: string[];
  trustTitle: string;
  trustPoints: { title: string; text: string }[];
  closingTitle: string;
  closingText: string;
  previewLabels: { upload: string; scan: string; reply: string };
};

const landingDe: LandingCopy = {
  heroBadge: "Weniger Papierkram. Mehr Leben.",
  heroTitle: "Behördenbriefe sind kompliziert. Wir machen sie einfach.",
  heroText:
    "Lade ein Dokument hoch – als PDF oder Foto. BureauCare fasst zusammen, was wirklich zählt: Fristen, nächste Schritte und der rote Faden. Du bekommst klare Sprache statt Amtsdeutsch und eine Antwort, die du direkt nutzen kannst. Fast wie ein ruhiger Freund, der den Stift übernimmt.",
  heroTrust: "Privat, sicher – und ohne unnötiges Behördendeutsch.",
  start: "Starten",
  audienceEyebrow: "Für wen ist BureauCare?",
  audienceSupporting:
    "Ob Studium, Job oder neues Land – wenn Post von Behörden oder Vertragspartnern kommt, solltest du nicht allein mit dem Kleingedruckten sitzen.",
  howTitle: "So einfach funktioniert’s",
  howSubtitle: "Drei Schritte, die sich nach Erleichterung anfühlen – nicht nach Prozess.",
  flowSteps: [
    {
      title: "Dokument hochladen",
      text: "PDF oder Foto. Den Rest übernehmen wir."
    },
    {
      title: "Sofort verstehen",
      text: "Fristen, Bedeutung und nächste Schritte – ohne Behördensprache."
    },
    {
      title: "Antwort direkt nutzen",
      text: "Eine klare, höfliche Antwort, die du anpassen und verschicken kannst."
    }
  ],
  keyPoints: [
    {
      title: "Endlich verstehen, was da steht",
      text: "Komplizierte Formulierungen werden in klare Punkte übersetzt – auch wenn du nach Zeile zwei schon genug hast."
    },
    {
      title: "Fristen und nächste Schritte im Blick",
      text: "Was bis wann fällig ist und was du zuerst erledigen solltest, ohne Kalender-Puzzle."
    },
    {
      title: "Antworten mit Mehrwert",
      text: "Kein leeres Floskel-Schreiben: Formulierungen, die du wirklich verwenden kannst."
    },
    {
      title: "Zeit und Nerven schonen",
      text: "Weniger Hin- und Herlesen, mehr Klarheit in wenigen Minuten."
    },
    {
      title: "Deine Daten bleiben bei dir",
      text: "Privater Bereich, geschützte Verarbeitung – kein öffentliches Ablagechaos."
    }
  ],
  audienceLine: "Für Menschen, die mit Bürokratie eigentlich etwas Besseres vorhaben.",
  audienceTags: ["Studierende", "Berufstätige", "Selbstständige", "Expats", "Wenig Zeit", "Genug von Formularen"],
  trustTitle: "Vertrauen, das zur Ruhe passt",
  trustPoints: [
    {
      title: "Nur für dich sichtbar",
      text: "Deine Dokumente liegen in einem geschützten Bereich – nicht im offenen Netz."
    },
    {
      title: "Sichere Verarbeitung",
      text: "Sessions und Zugriff sind so abgesichert, dass nur dein Konto deine Unterlagen sieht."
    },
    {
      title: "Klar statt laut",
      text: "Kein Marketing-Bullshit bei der Sicherheit: sachliche Technik, ruhige Oberfläche."
    }
  ],
  closingTitle: "Probier es mit einem Dokument aus.",
  closingText: "Ein Upload genügt – den Rest machen wir klar und lesbar.",
  previewLabels: {
    upload: "Hochladen",
    scan: "Fristen & Kernpunkte",
    reply: "Antwort entwurfen"
  }
};

const landingEn: LandingCopy = {
  heroBadge: "Less paperwork. More life.",
  heroTitle: "Official letters are complicated. We make them simple.",
  heroText:
    "Upload a document as PDF or photo. BureauCare highlights what matters: deadlines, next steps, and the thread of the story. You get plain language instead of jargon, plus a reply you can actually use. Like a calm friend who takes the pen.",
  heroTrust: "Private, secure – without the bureaucratic tone.",
  start: "Get started",
  audienceEyebrow: "Who is BureauCare for?",
  audienceSupporting:
    "Studies, work, or a new country—when official mail arrives, you should not face the fine print alone.",
  howTitle: "How it works",
  howSubtitle: "Three steps that feel like relief – not a process diagram.",
  flowSteps: [
    {
      title: "Upload",
      text: "PDF or photo. We handle the rest."
    },
    {
      title: "Understand quickly",
      text: "Deadlines, meaning, and next steps – without officialese."
    },
    {
      title: "Use the reply",
      text: "A clear, polite draft you can edit and send."
    }
  ],
  keyPoints: [
    {
      title: "Finally understand the letter",
      text: "Dense wording becomes short points – even when line two already annoyed you."
    },
    {
      title: "Deadlines and next steps",
      text: "See what is due when and what to do first, without calendar puzzles."
    },
    {
      title: "Replies that help",
      text: "Not empty phrases: wording you can reuse with confidence."
    },
    {
      title: "Save time and stress",
      text: "Less re-reading, more clarity in a few minutes."
    },
    {
      title: "Your data stays yours",
      text: "Private storage and protected handling – no public pile of PDFs."
    }
  ],
  audienceLine: "For people who have better plans than fighting bureaucracy all day.",
  audienceTags: ["Students", "Professionals", "Freelancers", "Expats", "Short on time", "Done with forms"],
  trustTitle: "Trust that feels calm",
  trustPoints: [
    {
      title: "Visible only to you",
      text: "Documents stay in a protected space – not scattered on the open web."
    },
    {
      title: "Secure processing",
      text: "Sessions and access are set up so only your account sees your files."
    },
    {
      title: "Clear, not loud",
      text: "No security theatre – just solid technology and a quiet interface."
    }
  ],
  closingTitle: "Try it with one document.",
  closingText: "One upload is enough – we make the rest clear and readable.",
  previewLabels: {
    upload: "Upload",
    scan: "Deadlines & key facts",
    reply: "Draft reply"
  }
};

const keyPointIcons = [FileSearch, CalendarClock, PenLine, Sparkles, Shield] as const;

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600"]
});

export default async function LandingPage() {
  const locale = await getRequestLanguage();
  const copy = locale === "de" ? landingDe : landingEn;

  return (
    <PageShell
      className={`${inter.className} landing-page max-w-6xl gap-16 py-10 sm:gap-20 sm:py-14 lg:gap-24 lg:py-16`}
    >
      {/* SECTION A — Hero */}
      <section className="landing-hero-shell relative px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="relative z-[1] grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-14">
          <div className="flex flex-col gap-8">
            <p
              className={cn(
                "landing-animate inline-flex w-fit max-w-full items-center rounded-full border border-[var(--line)] bg-[var(--landing-card)] px-4 py-2 text-sm font-medium text-[var(--accent-strong)]"
              )}
            >
              {copy.heroBadge}
            </p>
            <div className="space-y-6">
              <h1 className="landing-animate landing-animate-delay-1 max-w-[24ch] text-[2rem] font-medium leading-[1.12] tracking-[-0.03em] text-[var(--foreground)] sm:text-[2.65rem] lg:text-[3rem]">
                {copy.heroTitle}
              </h1>
              <p className="landing-animate landing-animate-delay-2 max-w-xl text-[1.0625rem] leading-[1.7] text-[var(--muted)] sm:text-[1.125rem] sm:leading-[1.75]">
                {copy.heroText}
              </p>
            </div>
            <div className="landing-animate landing-animate-delay-3 flex flex-col gap-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
                <StartLink
                  href="/login"
                  label={copy.start}
                  className="landing-cta-primary w-full max-w-[22rem] justify-center sm:w-auto"
                />
              </div>
              <p className="max-w-md text-[0.9375rem] leading-relaxed text-[var(--muted)]">{copy.heroTrust}</p>
            </div>
          </div>

          {/* Hero mock / story stack */}
          <div className="relative flex min-h-[280px] flex-col justify-center lg:min-h-[300px]">
            <div className="pointer-events-none absolute -right-6 -top-4 h-44 w-44 rounded-full bg-[rgba(111,168,220,0.2)] blur-3xl" aria-hidden />
            <div className="pointer-events-none absolute -bottom-6 left-0 h-40 w-40 rounded-full bg-[rgba(232,223,208,0.45)] blur-3xl" aria-hidden />
            <div className="relative space-y-5">
              <div
                className={cn(
                  "landing-preview-card landing-animate landing-animate-delay-2 rounded-[24px] p-5",
                  "translate-x-0 sm:translate-x-1"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-[10px] bg-[rgba(95,163,163,0.12)] p-2.5 text-[var(--accent)]">
                    <Upload className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wide text-[var(--muted)]">{copy.previewLabels.upload}</p>
                    <p className="mt-1 text-sm font-medium text-[var(--foreground)]">PDF · Scan · Foto</p>
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "landing-preview-card landing-animate landing-animate-delay-3 rounded-[24px] p-5",
                  "-translate-x-0 sm:-translate-x-2"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="rounded-[10px] bg-[rgba(95,163,163,0.14)] p-2.5 text-[var(--accent-strong)]">
                    <CalendarClock className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium tracking-wide text-[var(--muted)]">{copy.previewLabels.scan}</p>
                    <p className="mt-2 text-sm font-medium leading-snug text-[var(--foreground)]">
                      {locale === "de" ? "Antwort bis 12. Mai · Frist im Blick" : "Reply by 12 May · deadline visible"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-[rgba(95,163,163,0.14)] px-2.5 py-1 text-xs font-medium text-[var(--accent-strong)]">
                        {locale === "de" ? "Wichtig" : "Important"}
                      </span>
                      <span className="rounded-full bg-[rgba(111,168,220,0.12)] px-2.5 py-1 text-xs font-medium text-[var(--foreground)]/85">
                        {locale === "de" ? "Nächster Schritt" : "Next step"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className={cn(
                  "landing-preview-card landing-animate landing-animate-delay-4 rounded-[24px] p-5",
                  "translate-x-0 sm:translate-x-3"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-[10px] bg-[rgba(232,223,208,0.65)] p-2.5 text-[var(--accent)]">
                    <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-xs font-medium tracking-wide text-[var(--muted)]">{copy.previewLabels.reply}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[var(--foreground)]/90">
                      {locale === "de"
                        ? "Sehr geehrte Damen und Herren, hiermit möchte ich…"
                        : "Dear Sir or Madam, I am writing to…"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION B — How it works */}
      <section className="landing-hub-panel space-y-10 px-7 py-12 sm:px-10 sm:py-14" aria-labelledby="how-heading">
        <div className="mx-auto max-w-2xl text-center">
          <h2 id="how-heading" className="text-3xl font-medium tracking-[-0.035em] text-[var(--foreground)] sm:text-[2rem]">
            {copy.howTitle}
          </h2>
          <p className="mt-4 text-[1.0625rem] leading-relaxed text-[var(--muted)]">{copy.howSubtitle}</p>
        </div>

        <div className="flex flex-col gap-6 md:flex-row md:items-stretch md:gap-0">
          {copy.flowSteps.flatMap((step, index) => {
            const card = (
              <Card
                key={step.title}
                className={cn(
                  "landing-section-card h-full flex-1 rounded-[24px] p-7 sm:p-8",
                  index === 0 ? "landing-section-card-elevated" : ""
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-[var(--accent)] text-sm font-medium text-white">
                  {index + 1}
                </div>
                <h3 className="mt-6 text-lg font-medium tracking-[-0.02em] text-[var(--foreground)]">{step.title}</h3>
                <p className="mt-3 text-[1.0625rem] leading-relaxed text-[var(--muted)]">{step.text}</p>
              </Card>
            );
            if (index >= copy.flowSteps.length - 1) {
              return [card];
            }
            const arrow = (
              <div
                key={`flow-arrow-${index}`}
                className="flex shrink-0 items-center justify-center py-2 md:px-3 md:py-0"
                aria-hidden
              >
                <ChevronRight className="h-7 w-7 rotate-90 text-[var(--muted)]/30 md:rotate-0" strokeWidth={1.5} />
              </div>
            );
            return [card, arrow];
          })}
        </div>
      </section>

      {/* SECTION C — Key points */}
      <section className="landing-hub-panel space-y-10 px-7 py-12 sm:px-10 sm:py-14" aria-labelledby="benefits-heading">
        <h2 id="benefits-heading" className="text-center text-3xl font-medium tracking-[-0.035em] text-[var(--foreground)] sm:text-[2rem]">
          {locale === "de" ? "Was BureauCare für dich tut" : "What BureauCare does for you"}
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {copy.keyPoints.map((point, i) => {
            const Icon = keyPointIcons[i] ?? Sparkles;
            const span =
              i === 0
                ? "lg:col-span-7"
                : i === 1
                  ? "lg:col-span-5"
                  : i === 2
                    ? "lg:col-span-4"
                    : i === 3
                      ? "lg:col-span-4"
                      : "lg:col-span-4";
            return (
              <Card
                key={point.title}
                className={cn(
                  "landing-section-card rounded-[24px] p-6 sm:p-7",
                  span,
                  i === 0 ? "min-h-[140px] lg:min-h-[160px]" : ""
                )}
              >
                <div className="flex gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgba(95,163,163,0.1)] text-[var(--accent)]">
                    <Icon className="h-5 w-5" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h3 className="text-base font-medium leading-snug tracking-[-0.02em] text-[var(--foreground)]">{point.title}</h3>
                    <p className="mt-2 text-[1.0625rem] leading-relaxed text-[var(--muted)]">{point.text}</p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* SECTION D — Who it is for (prominent, separate from trust) */}
      <section className="landing-audience-hub px-8 py-14 text-center sm:px-14 sm:py-16" aria-labelledby="audience-heading">
        <p className="text-sm font-medium tracking-wide text-[var(--accent-strong)]">{copy.audienceEyebrow}</p>
        <h2
          id="audience-heading"
          className="mx-auto mt-6 max-w-[40rem] text-2xl font-medium leading-snug tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl lg:text-[2.1rem] lg:leading-tight"
        >
          {copy.audienceLine}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[1.0625rem] leading-relaxed text-[var(--muted)]">{copy.audienceSupporting}</p>
        <div className="mt-12 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          {copy.audienceTags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-white/70 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(235,242,250,0.72))] px-4 py-2 text-sm font-medium text-[var(--foreground)] shadow-[0_10px_26px_rgba(25,40,60,0.06)]"
            >
              {tag}
            </span>
          ))}
        </div>
      </section>

      {/* SECTION E — Trust */}
      <section className="landing-hub-panel px-7 py-12 sm:px-10 sm:py-14" aria-labelledby="trust-heading">
        <h2 id="trust-heading" className="text-center text-2xl font-medium tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">
          {copy.trustTitle}
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {copy.trustPoints.map((item) => (
            <div
              key={item.title}
              className="landing-section-card rounded-[24px] p-6 sm:p-7"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-[rgba(95,163,163,0.1)] p-2 text-[var(--accent)]">
                <Shield className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <h3 className="text-base font-medium text-[var(--foreground)]">{item.title}</h3>
              <p className="mt-2 text-[1.0625rem] leading-relaxed text-[var(--muted)]">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION F — Closing CTA */}
      <section className="landing-closing px-8 py-14 text-center sm:px-12 sm:py-16">
        <h2 className="text-2xl font-medium tracking-[-0.03em] text-[var(--foreground)] sm:text-3xl">{copy.closingTitle}</h2>
        <p className="mx-auto mt-4 max-w-lg text-[1.0625rem] leading-relaxed text-[var(--muted)]">{copy.closingText}</p>
        <div className="mt-8 flex justify-center">
          <StartLink
            href="/login"
            label={copy.start}
            className="landing-cta-primary w-full max-w-[22rem] justify-center sm:w-auto sm:min-w-[280px]"
          />
        </div>
      </section>
    </PageShell>
  );
}
