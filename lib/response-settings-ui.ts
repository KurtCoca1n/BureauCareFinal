import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type { ReplyDefaultTone, ReplyTranslationMode } from "@/lib/types";

export type ResponseToneOption = {
  value: ReplyDefaultTone;
  label: string;
  description: string;
};

type ResponseSettingsCopy = {
  title: string;
  intro: string;
  toneTitle: string;
  toneText: string;
  toneHint: string;
  styleTitle: string;
  styleText: string;
  stylePlaceholder: string;
  signatureTitle: string;
  signatureText: string;
  includeSignature: string;
  signatureField: string;
  signaturePlaceholder: string;
  translationTitle: string;
  translationText: string;
  translationHint: string;
  previewTitle: string;
  previewText: string;
  previewSubject: string;
  save: string;
  saving: string;
  saved: string;
  saveError: string;
  translationModes: Record<ReplyTranslationMode, { label: string; description: string }>;
  toneOptions: ResponseToneOption[];
};

const de: ResponseSettingsCopy = {
  title: "Antworten",
  intro: "Hier legst du fest, wie BureauCare standardmaessig fuer dich schreibt. Der Standardton ist deine Grundpraeferenz, BureauCare kann pro Dokument aber weiterhin einen passenderen Vorschlag machen.",
  toneTitle: "Standard-Antwortton",
  toneText: "Waehle den Ton, der bei neuen Antworten zuerst vorausgewaehlt sein soll.",
  toneHint: "Wenn du Automatisch passend waehlen nutzt, denkt BureauCare je nach Dokument aktiv mit.",
  styleTitle: "Eigener Stilwunsch",
  styleText: "Optional kannst du kurz beschreiben, wie Antworten fuer dich klingen sollen.",
  stylePlaceholder: "Zum Beispiel: kurz und direkt, aber freundlich",
  signatureTitle: "Signatur",
  signatureText: "Deine Signatur wird bei neuen Antworten vorgeschlagen und kann im Einzelfall weiter angepasst werden.",
  includeSignature: "Name und Signatur standardmaessig einfuegen",
  signatureField: "Standardsignatur",
  signaturePlaceholder: "Mit freundlichen Gruessen,\nMax Mustermann",
  translationTitle: "Sprache der Antworten",
  translationText: "Hier bereitest du vor, ob BureauCare nur Deutsch oder zusaetzlich deine App-Sprache anzeigen soll.",
  translationHint: "Weitere Sprachdetails bauen wir im Sprachbereich aus.",
  previewTitle: "Kleine Vorschau",
  previewText: "So wirkt dein aktueller Stil als kurzer Eindruck.",
  previewSubject: "vielen Dank fuer Ihr Schreiben.",
  save: "Antwort-Einstellungen speichern",
  saving: "Antwort-Einstellungen werden gespeichert...",
  saved: "Deine Antwort-Einstellungen wurden gespeichert.",
  saveError: "Deine Antwort-Einstellungen konnten nicht gespeichert werden.",
  translationModes: {
    german_only: {
      label: "Nur auf Deutsch",
      description: "Antworten erscheinen nur in Deutsch."
    },
    app_language: {
      label: "Deutsch plus App-Sprache",
      description: "Wenn sinnvoll, zeigt BureauCare zusaetzlich deine App-Sprache."
    }
  },
  toneOptions: [
    { value: "automatic", label: "Automatisch passend waehlen", description: "BureauCare startet mit einem Ton, der zum Dokument passt." },
    { value: "neutral", label: "Neutral", description: "Klar, sachlich und ausgewogen." },
    { value: "friendly", label: "Freundlich", description: "Hoeflich, menschlich und offen." },
    { value: "very_formal", label: "Sehr formell", description: "Besonders amtstauglich und formell." },
    { value: "simple", label: "Einfach", description: "Leicht verstaendlich und direkt." }
  ]
};

const en: ResponseSettingsCopy = {
  title: "Responses",
  intro: "Choose how BureauCare should usually write for you. Your default tone is the calm starting point, and BureauCare can still suggest a better fit for each document.",
  toneTitle: "Default reply tone",
  toneText: "Choose the tone that should be preselected for new replies.",
  toneHint: "If you keep automatic selection, BureauCare will adapt the tone to the document.",
  styleTitle: "Personal style note",
  styleText: "Optionally describe how replies should sound for you.",
  stylePlaceholder: "For example: short and direct, but still kind",
  signatureTitle: "Signature",
  signatureText: "Your signature is suggested for new replies and can still be adjusted case by case.",
  includeSignature: "Add name and signature by default",
  signatureField: "Default signature",
  signaturePlaceholder: "Kind regards,\nMax Mustermann",
  translationTitle: "Reply language",
  translationText: "Prepare whether BureauCare should show only German or also your app language.",
  translationHint: "We will expand the detailed language controls in the language section.",
  previewTitle: "Small preview",
  previewText: "A short impression of how your current style feels.",
  previewSubject: "thank you for your message.",
  save: "Save response settings",
  saving: "Saving response settings...",
  saved: "Your response settings were saved.",
  saveError: "Your response settings could not be saved.",
  translationModes: {
    german_only: {
      label: "German only",
      description: "Replies are shown only in German."
    },
    app_language: {
      label: "German plus app language",
      description: "When helpful, BureauCare also shows your app language."
    }
  },
  toneOptions: [
    { value: "automatic", label: "Choose automatically", description: "BureauCare starts with a tone that fits the document." },
    { value: "neutral", label: "Neutral", description: "Clear, factual and balanced." },
    { value: "friendly", label: "Friendly", description: "Polite, warm and open." },
    { value: "very_formal", label: "Very formal", description: "Especially suitable for official communication." },
    { value: "simple", label: "Simple", description: "Easy to understand and direct." }
  ]
};

const zh: ResponseSettingsCopy = {
  title: "\u56de\u590d",
  intro: "\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u8bbe\u5b9a BureauCare \u5e73\u65f6\u4e3a\u4f60\u5199\u4fe1\u7684\u65b9\u5f0f\u3002\u8fd9\u662f\u4f60\u7684\u9ed8\u8ba4\u504f\u597d\uff0c\u4f46 BureauCare \u4ecd\u7136\u53ef\u4ee5\u9488\u5bf9\u6bcf\u4efd\u6587\u4ef6\u63d0\u4f9b\u66f4\u5408\u9002\u7684\u5efa\u8bae\u3002",
  toneTitle: "\u9ed8\u8ba4\u56de\u590d\u8bed\u6c14",
  toneText: "\u9009\u62e9\u65b0\u5efa\u56de\u590d\u65f6\u5e94\u8be5\u9ed8\u8ba4\u9884\u9009\u7684\u8bed\u6c14\u3002",
  toneHint: "\u5982\u679c\u4f60\u9009\u62e9\u81ea\u52a8\uff0c BureauCare \u4f1a\u6839\u636e\u6587\u4ef6\u60c5\u51b5\u5e2e\u4f60\u9009\u62e9\u66f4\u5408\u9002\u7684\u8bed\u6c14\u3002",
  styleTitle: "\u4e2a\u4eba\u98ce\u683c\u8865\u5145",
  styleText: "\u4f60\u53ef\u4ee5\u9009\u586b\u4e00\u53e5\u7b80\u77ed\u63cf\u8ff0\uff0c\u8bf4\u660e\u56de\u590d\u5e0c\u671b\u542c\u8d77\u6765\u662f\u4ec0\u4e48\u611f\u89c9\u3002",
  stylePlaceholder: "\u4f8b\u5982\uff1a\u7b80\u77ed\u76f4\u63a5\uff0c\u4f46\u4ecd\u7136\u53cb\u597d",
  signatureTitle: "\u7b7e\u540d",
  signatureText: "\u65b0\u7684\u56de\u590d\u4f1a\u9ed8\u8ba4\u5e26\u4e0a\u8fd9\u4e2a\u7b7e\u540d\uff0c\u4f46\u4f60\u4ecd\u7136\u53ef\u4ee5\u5728\u5177\u4f53\u60c5\u51b5\u4e2d\u518d\u4fee\u6539\u3002",
  includeSignature: "\u9ed8\u8ba4\u81ea\u52a8\u9644\u4e0a\u59d3\u540d\u548c\u7b7e\u540d",
  signatureField: "\u9ed8\u8ba4\u7b7e\u540d",
  signaturePlaceholder: "\u6b64\u81f4\u656c\u793c\uff0c\nMax Mustermann",
  translationTitle: "\u56de\u590d\u8bed\u8a00",
  translationText: "\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u9884\u5148\u51b3\u5b9a\uff0c BureauCare \u662f\u5426\u53ea\u663e\u793a\u5fb7\u8bed\uff0c\u6216\u8005\u540c\u65f6\u663e\u793a\u4f60\u7684 App \u8bed\u8a00\u3002",
  translationHint: "\u66f4\u5b8c\u6574\u7684\u8bed\u8a00\u8bbe\u5b9a\u4f1a\u5728\u540e\u7eed\u7684\u8bed\u8a00\u533a\u57df\u4e2d\u5904\u7406\u3002",
  previewTitle: "\u5c0f\u9884\u89c8",
  previewText: "\u8fd9\u53ea\u662f\u4e00\u4e2a\u7b80\u77ed\u7684\u98ce\u683c\u611f\u53d7\u9884\u89c8\u3002",
  previewSubject: "\u611f\u8c22\u60a8\u7684\u6765\u4fe1\u3002",
  save: "\u4fdd\u5b58\u56de\u590d\u8bbe\u7f6e",
  saving: "\u6b63\u5728\u4fdd\u5b58\u56de\u590d\u8bbe\u7f6e...",
  saved: "\u4f60\u7684\u56de\u590d\u8bbe\u7f6e\u5df2\u4fdd\u5b58\u3002",
  saveError: "\u65e0\u6cd5\u4fdd\u5b58\u56de\u590d\u8bbe\u7f6e\u3002",
  translationModes: {
    german_only: {
      label: "\u53ea\u663e\u793a\u5fb7\u8bed",
      description: "\u56de\u590d\u53ea\u4ee5\u5fb7\u8bed\u663e\u793a\u3002"
    },
    app_language: {
      label: "\u5fb7\u8bed\u52a0 App \u8bed\u8a00",
      description: "\u5982\u679c\u5408\u9002\uff0c BureauCare \u4f1a\u989d\u5916\u663e\u793a\u4f60\u7684 App \u8bed\u8a00\u3002"
    }
  },
  toneOptions: [
    { value: "automatic", label: "\u81ea\u52a8\u9009\u62e9", description: "BureauCare \u4f1a\u5148\u6309\u6587\u4ef6\u60c5\u51b5\u9009\u62e9\u66f4\u5408\u9002\u7684\u8bed\u6c14\u3002" },
    { value: "neutral", label: "\u4e2d\u6027", description: "\u6e05\u6670\u3001\u5ba2\u89c2\u3001\u5e73\u8861\u3002" },
    { value: "friendly", label: "\u53cb\u597d", description: "\u793c\u8c8c\u3001\u6e29\u548c\u3001\u66f4\u6709\u4eb2\u548c\u529b\u3002" },
    { value: "very_formal", label: "\u975e\u5e38\u6b63\u5f0f", description: "\u66f4\u9002\u5408\u4e0e\u673a\u6784\u6216\u5b98\u65b9\u6c9f\u901a\u3002" },
    { value: "simple", label: "\u7b80\u5355", description: "\u66f4\u6613\u7406\u89e3\uff0c\u4e5f\u66f4\u76f4\u63a5\u3002" }
  ]
};

const fallbackMap: Record<SupportedLanguage, ResponseSettingsCopy> = {
  de,
  en,
  tr: en,
  uk: en,
  es: en,
  zh
};

export function getResponseSettingsCopy(locale: string | null | undefined) {
  return fallbackMap[normalizePreferredLanguage(locale)];
}
