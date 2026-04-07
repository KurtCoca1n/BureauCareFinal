import type { Route } from "next";

import type { AppLocale } from "@/lib/i18n";

function isDe(locale: AppLocale) {
  return locale === "de";
}

/** Query + Anker für den Bescheid-Scanner-Flow (Volldokument-Analyse mit klarer Erwartung) */
export function noticeAnalyzeAnchor(documentId: string): Route {
  return `/app/documents/${documentId}?scanner=notice#document-analyze` as Route;
}

export function getNoticeScannerRoutingHighlight(locale: AppLocale): {
  title: string;
  subtitle: string;
  bullets: string[];
} {
  if (isDe(locale)) {
    return {
      title: "Empfohlen: Bescheid-Scanner",
      subtitle:
        "Dieses Schreiben wirkt offiziell und kann eine Reaktion von dir verlangen. BureauCare erklärt in Alltagssprache, worum es geht – und was als Nächstes sinnvoll ist.",
      bullets: [
        "Kurz und verständlich: worum es in dem Schreiben geht",
        "Einschätzung, ob es wichtig oder zeitkritisch wirkt",
        "Ob eine Frist oder Handlung erkennbar ist",
        "Was du jetzt tun kannst – ohne Juristendeutsch"
      ]
    };
  }
  return {
    title: "Recommended: notice walkthrough",
    subtitle:
      "This looks like official mail that may expect a reply or action. BureauCare explains it in plain words and points to a sensible next step.",
    bullets: [
      "A clear read on what the letter is about",
      "Whether it feels important or time-sensitive",
      "Whether a deadline or action shows up",
      "Practical guidance on what to do next – without legal jargon"
    ]
  };
}

export function getNoticeScannerPrimaryCta(locale: AppLocale): string {
  return isDe(locale) ? "Bescheid jetzt erklären lassen" : "Explain this notice now";
}

export function getNoticeScannerPreAnalyzeBanner(locale: AppLocale): { title: string; lines: string[] } {
  if (isDe(locale)) {
    return {
      title: "Bescheid-Scanner",
      lines: [
        "Gleich bekommst du eine verständliche Zusammenfassung: Thema, Dringlichkeit und ob etwas von dir erwartet wird.",
        "Wenn das Dokument eine Frist oder eine Reaktion verlangt, heben wir das – vorsichtig formuliert – hervor.",
        "Du siehst danach konkrete nächste Schritte. BureauCare ersetzt keine Beratung, ersetzt aber Ratespiele beim Lesen."
      ]
    };
  }
  return {
    title: "Notice walkthrough",
    lines: [
      "Next you will see a plain-language summary: topic, urgency and whether something is expected from you.",
      "If a deadline or reply is visible, we will flag it carefully.",
      "You will get concrete next steps. BureauCare is not legal advice, but it helps you read with orientation."
    ]
  };
}
