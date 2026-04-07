import type { Route } from "next";

import {
  generalExplainAnchor,
  getGeneralExplainAlternativeCopy,
  getGeneralExplainNoDetectionFallback,
  getGeneralExplainPrimaryCta,
  getGeneralExplainPrimaryNarrative
} from "@/lib/general-explain-flow-ui";
import {
  getNoticeScannerPrimaryCta,
  noticeAnalyzeAnchor
} from "@/lib/notice-scanner-flow-ui";
import type {
  DeadlineSituation,
  DocumentKindDetection,
  PriorityBand,
  SuggestedModuleId
} from "@/lib/document-kind";
import { getKindDetectionHeadline } from "@/lib/document-kind-ui";
import type { AppLocale } from "@/lib/i18n";

function isDe(locale: AppLocale) {
  return locale === "de";
}

export function getDecisionPageEyebrow(locale: AppLocale): string {
  return isDe(locale) ? "Nach deinem Upload" : "After your upload";
}

export function getDecisionPageTitle(locale: AppLocale): string {
  return isDe(locale) ? "Womit möchtest du weitermachen?" : "What would you like to do next?";
}

export function getDecisionPageSubtitle(locale: AppLocale): string {
  return isDe(locale)
    ? "Hier siehst du auf einen Blick, wie wir dein Dokument einordnen – ohne Behördenstress und ohne falsche Sicherheit."
    : "Here is how we sort your document at a glance – no jargon and no false certainty.";
}

export function getSectionRecognized(locale: AppLocale): string {
  return isDe(locale) ? "Dokument erkannt" : "Document recognised";
}

export function getRecognitionExplanation(locale: AppLocale, confidence: DocumentKindDetection["confidence"]): string {
  const careful =
    confidence === "high"
      ? isDe(locale)
        ? "BureauCare hat typische Merkmale und den Aufbau erkannt und schlägt diese Einordnung vor."
        : "BureauCare noticed typical structure and content and suggests this classification."
      : isDe(locale)
        ? "Das ist ein erster Eindruck. Typische Hinweise im Dokument sprechen dafür – eine endgültige Einordnung bekommst du mit der ausführlichen Analyse."
        : "This is a first impression from typical clues in the document – run the full analysis for a firmer read.";

  return careful;
}

export function getSectionImportance(locale: AppLocale): string {
  return isDe(locale) ? "Wichtigkeit & Ruhe" : "Importance & calm";
}

export function getPriorityBandTitle(locale: AppLocale, band: PriorityBand): string {
  if (isDe(locale)) {
    switch (band) {
      case "urgent":
        return "Eher dringend";
      case "important":
        return "Wichtig";
      case "relevant":
        return "Relevant";
      case "informative":
        return "Eher informativ";
      default:
        return "Noch unklar";
    }
  }
  switch (band) {
    case "urgent":
      return "Rather urgent";
    case "important":
      return "Important";
    case "relevant":
      return "Relevant";
    case "informative":
      return "Mostly informational";
    default:
      return "Still unclear";
  }
}

export function getPriorityBandSupport(locale: AppLocale, band: PriorityBand): string {
  if (isDe(locale)) {
    switch (band) {
      case "urgent":
        return "Es könnte eine Frist oder ein enger Zeitrahmen dabei sein. Nimm dir in Ruhe einen Moment – du musst nicht sofort alles lösen.";
      case "important":
        return "Es lohnt sich, das zeitnah zu lesen und zu verstehen – ohne gleich in Alarm zu verfallen.";
      case "relevant":
        return "Wert, es zu kennen und bei Bedarf zu prüfen – viele solcher Unterlagen sind gut mit Übersicht und Analyse erledigt.";
      case "informative":
        return "Wirkt eher informativ oder dokumentierend. Trotzdem kann eine Analyse helfen, wenn du Klarheit möchtest.";
      default:
        return "Noch zu wenig belastbar, um es fest einzuordnen – die Analyse kann mehr Klarheit bringen.";
    }
  }
  switch (band) {
    case "urgent":
      return "There may be a deadline or tight timing. Take a calm look – you do not need to fix everything instantly.";
    case "important":
      return "Worth reading and understanding soon – without jumping to worst-case worries.";
    case "relevant":
      return "Good to know and review if needed – many papers are easier with a clear summary.";
    case "informative":
      return "Seems mostly informational. An analysis can still help if you want clarity.";
    default:
      return "Too little is clear yet – a full analysis can add confidence.";
  }
}

export function getSectionDeadline(locale: AppLocale): string {
  return isDe(locale) ? "Frist & Zeitrahmen" : "Deadlines & timing";
}

export function getDeadlineBody(
  locale: AppLocale,
  situation: DeadlineSituation,
  deadlineDateIso: string | null,
  dateLocale: string
): { title: string; detail: string } {
  const de = isDe(locale);
  if (situation === "date_seen" && deadlineDateIso) {
    try {
      const formatted = new Date(`${deadlineDateIso}T12:00:00.000Z`).toLocaleDateString(dateLocale);
      return {
        title: de ? "Datum im Dokument" : "Date in the document",
        detail: de
          ? `Es scheint ein Datum zu sein: ${formatted}. Bitte prüfe es kurz im Original – BureauCare kann sich irren.`
          : `A date may appear as: ${formatted}. Please double-check the original – we can be wrong.`
      };
    } catch {
      /* fall through */
    }
  }

  if (situation === "time_sensitive") {
    return {
      title: de ? "Reaktion vermutlich zeitgebunden" : "Response may be time-sensitive",
      detail: de
        ? "Etwas deutet auf eine Frist oder auf zeitnahes Handeln hin, ohne dass ein Datum klar erkennbar ist."
        : "Something suggests timing or a deadline, but no clear date stood out."
    };
  }

  if (situation === "no_clear_hint") {
    return {
      title: de ? "Kein klarer Frist-Hinweis" : "No clear deadline hint",
      detail: de
        ? "Aus dem schnellen Überblick ist keine eindeutige Frist erkennbar. Die ausführliche Analyse kann noch einmal gezielt schauen."
        : "From this quick pass, no clear deadline showed up. The full analysis can look again in detail."
    };
  }

  return {
    title: de ? "Frist aktuell unklar" : "Deadline unclear for now",
    detail: de
      ? "Das Dokument war nicht eindeutig genug, um Fristen sicher zu benennen – das ist normal bei Fotos oder scans."
      : "The document was not clear enough to name deadlines safely – common with scans or photos."
  };
}

export function getSectionRecommended(locale: AppLocale): string {
  return isDe(locale) ? "Empfohlener nächster Bereich" : "Recommended next step";
}

export function getPrimaryModuleNarrative(locale: AppLocale, primary: SuggestedModuleId, kindHeadlineHint: string): string {
  const de = isDe(locale);
  switch (primary) {
    case "contract_scanner":
      return de
        ? "Für Verträge und vertragsähnliche Texte passt der Vertragsscanner: Klauseln, Laufzeit und Kündigung werden greifbar."
        : "For contracts, the contract review makes terms, duration and termination easier to grasp.";
    case "notice_scanner":
      return de
        ? "Das sieht nach einem Behördenschreiben oder Bescheid aus – BureauCare kann dir jetzt in einfachen Worten sagen, worum es geht, ob du reagieren solltest und welcher nächste Schritt passt. Fristen und Pflichten werden dabei sichtbar, sobald sie im Dokument erkennbar sind."
        : "This looks like an official letter or notice – BureauCare can spell out what it is about, whether you need to react, and what makes sense next. Deadlines and duties appear when the document supports them.";
    case "money_back_finder":
      return de
        ? "Wenn es um Leistungen, Gebühren oder Erstattungen gehen könnte, ist der Geld-zurück-Bereich ein sinnvoller nächster Schritt."
        : "If fees, claims or refunds might matter, the money-back area is a sensible next stop.";
    case "deadlines_tasks":
      return de
        ? "Wenn Fristen und To-dos im Vordergrund stehen, hilft der Aufgabenüberblick – oft ergänzt durch die Analyse."
        : "If deadlines matter, your tasks overview helps – often together with the full analysis.";
    case "document_summary":
      return getGeneralExplainPrimaryNarrative(locale);
    default:
      return de
        ? `Passend zu „${kindHeadlineHint}“ startet eine ausführliche Zusammenfassung – danach kannst du gezielt weiterarbeiten.`
        : `For “${kindHeadlineHint}”, a full summary is the best next move, then you can go deeper.`;
  }
}

export function getSectionAlternatives(locale: AppLocale): string {
  return isDe(locale) ? "Weitere sinnvolle Wege" : "Other useful options";
}

export type DecisionLink = { label: string; href: Route; description?: string };

export function getAlternativeLinks(
  locale: AppLocale,
  documentId: string,
  caseId: string | null,
  primary: SuggestedModuleId
): DecisionLink[] {
  const de = isDe(locale);
  const analyze = `/app/documents/${documentId}#document-analyze` as Route;
  const analyzeExplain = generalExplainAnchor(documentId);
  const analyzeNotice = noticeAnalyzeAnchor(documentId);
  const refunds = `/app/refunds` as Route;
  const tasks = `/app/tasks` as Route;
  const explainAlt = getGeneralExplainAlternativeCopy(locale);

  const all: { id: SuggestedModuleId; link: DecisionLink }[] = [
    {
      id: "contract_scanner",
      link: {
        label: de ? "Vertrag genauer prüfen" : "Review contract in depth",
        href: analyze,
        description: de ? "Direkt zur Analyse mit Vertrags-Perspektive" : "Go to analysis with contract focus"
      }
    },
    {
      id: "notice_scanner",
      link: {
        label: de ? "Bescheid / Schreiben erklären lassen" : "Explain notice or letter",
        href: analyzeNotice,
        description: de ? "Ausführliche Analyse für Behördendokumente" : "Full analysis for authority documents"
      }
    },
    {
      id: "money_back_finder",
      link: {
        label: de ? "Erstattungen prüfen" : "Check refunds",
        href: refunds,
        description: de ? "Separater Bereich für Erstattungen und Gebühren" : "Dedicated refunds area"
      }
    },
    {
      id: "document_summary",
      link: {
        label: explainAlt.label,
        href: analyzeExplain,
        description: explainAlt.description
      }
    },
    {
      id: "deadlines_tasks",
      link: {
        label: de ? "Fristen & Aufgaben" : "Deadlines & tasks",
        href: tasks,
        description: de ? "Alle offenen To-dos im Überblick" : "See your open to-dos"
      }
    }
  ];

  return all.filter((item) => item.id !== primary).map((item) => item.link);
}

export function getCaseLink(locale: AppLocale, caseId: string): DecisionLink {
  return {
    label: locale === "de" ? "Zum Fall" : "Open case",
    href: `/app/cases/${caseId}` as Route,
    description: locale === "de" ? "Chronologie und Kontext" : "Timeline and context"
  };
}

export function getLaterLink(locale: AppLocale, documentId: string): DecisionLink {
  return {
    label: locale === "de" ? "Später weiter" : "Continue later",
    href: `/app/documents/${documentId}` as Route,
    description: locale === "de" ? "Dokument bleibt gespeichert" : "Your file stays saved"
  };
}

export function getSectionNext(locale: AppLocale): string {
  return isDe(locale) ? "Nächster Schritt" : "Next step";
}

export function getPrimaryAction(
  locale: AppLocale,
  primary: SuggestedModuleId,
  documentId: string
): { label: string; href: Route } {
  const de = isDe(locale);
  switch (primary) {
    case "money_back_finder":
      return { label: de ? "Erstattung jetzt prüfen" : "Check refunds now", href: "/app/refunds" as Route };
    case "deadlines_tasks":
      return { label: de ? "Aufgaben ansehen" : "View tasks", href: "/app/tasks" as Route };
    case "notice_scanner":
      return { label: getNoticeScannerPrimaryCta(locale), href: noticeAnalyzeAnchor(documentId) };
    case "contract_scanner":
      return { label: de ? "Vertrag jetzt prüfen" : "Review contract now", href: analyzeAnchor(documentId) };
    case "document_summary":
      return { label: getGeneralExplainPrimaryCta(locale), href: generalExplainAnchor(documentId) };
    default:
      return { label: getGeneralExplainPrimaryCta(locale), href: generalExplainAnchor(documentId) };
  }
}

export function analyzeAnchor(documentId: string): Route {
  return `/app/documents/${documentId}#document-analyze` as Route;
}

export function getWatchOutTitle(locale: AppLocale): string {
  return isDe(locale) ? "Worauf achten?" : "What to notice";
}

export function getKindHeadlineForNarrative(locale: AppLocale, detection: DocumentKindDetection): string {
  return getKindDetectionHeadline(locale, detection);
}

/** Dezentes Produktversprechen auf dem Decision Screen */
export function getDecisionAmbientBand(locale: AppLocale): { title: string; lines: string[]; chips: string[] } {
  if (isDe(locale)) {
    return {
      title: "Warum sich der Upload lohnt",
      lines: [
        "BureauCare versteht deine Dokumente in verständlicher Sprache und zeigt dir den nächsten sinnvollen Schritt.",
        "Du musst nicht selbst erraten, ob es um eine Frist, ein Risiko oder eine Erstattung geht – wir ordnen das mit dir ein."
      ],
      chips: ["Klarheit statt Ratespiel", "Ruhig erklärt", "Du behältst die Kontrolle"]
    };
  }
  return {
    title: "Why uploading is worth it",
    lines: [
      "BureauCare turns your documents into plain language and points to a sensible next step.",
      "You do not have to guess whether a deadline, risk or refund is hidden inside – we help you see it calmly."
    ],
    chips: ["Clarity, not guesswork", "Explained calmly", "You stay in charge"]
  };
}

export function getFallbackWhenNoDetection(locale: AppLocale): { title: string; text: string; cta: string } {
  return getGeneralExplainNoDetectionFallback(locale);
}
