import { normalizePreferredLanguage } from "@/lib/languages";

export function getDateInputLocale(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return "en-US";
    case "tr":
      return "tr-TR";
    case "uk":
      return "uk-UA";
    case "es":
      return "es-ES";
    case "zh":
      return "zh-CN";
    default:
      return "de-DE";
  }
}

export function getDateInputHint(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return "Format: MM/DD/YYYY";
    case "tr":
      return "Format: GG.AA.YYYY";
    case "uk":
      return "Format: DD.MM.YYYY";
    case "es":
      return "Formato: DD/MM/AAAA";
    case "zh":
      return "格式：YYYY-MM-DD";
    default:
      return "Format: TT.MM.JJJJ";
  }
}
