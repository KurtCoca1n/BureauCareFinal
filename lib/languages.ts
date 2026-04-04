export const SUPPORTED_LANGUAGES = ["de", "en", "tr", "uk", "es", "zh"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_OPTIONS: Array<{ value: SupportedLanguage; label: string }> = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "tr", label: "Turkce" },
  { value: "uk", label: "Ukrainska" },
  { value: "es", label: "Espanol" },
  { value: "zh", label: "中文" }
];

export function normalizePreferredLanguage(value: string | null | undefined): SupportedLanguage {
  const normalized = (value ?? "").trim().toLowerCase();

  if (SUPPORTED_LANGUAGES.includes(normalized as SupportedLanguage)) {
    return normalized as SupportedLanguage;
  }

  if (["deutsch", "german"].includes(normalized)) {
    return "de";
  }

  if (["englisch", "english"].includes(normalized)) {
    return "en";
  }

  if (["turkisch", "turkish", "tuerkisch", "turkce"].includes(normalized)) {
    return "tr";
  }

  if (["ukrainisch", "ukrainian", "ukrainska"].includes(normalized)) {
    return "uk";
  }

  if (["spanisch", "spanish", "espanol"].includes(normalized)) {
    return "es";
  }

  if (["chinesisch", "chinese", "mandarin", "zh", "zh-cn", "zh-hans", "中文", "汉语", "漢語"].includes(normalized)) {
    return "zh";
  }

  return "en";
}

export function normalizeBrowserLanguage(value: string | null | undefined): SupportedLanguage {
  const raw = (value ?? "").trim().toLowerCase();

  if (!raw) {
    return "en";
  }

  const candidates = raw
    .split(",")
    .map((part) => part.split(";")[0]?.trim())
    .filter(Boolean);

  for (const candidate of candidates) {
    if (candidate.startsWith("de")) return "de";
    if (candidate.startsWith("en")) return "en";
    if (candidate.startsWith("tr")) return "tr";
    if (candidate.startsWith("uk") || candidate.startsWith("ua")) return "uk";
    if (candidate.startsWith("es")) return "es";
    if (candidate.startsWith("zh")) return "zh";
  }

  return "en";
}

export function getLanguageLabel(value: string | null | undefined) {
  const normalized = normalizePreferredLanguage(value);
  return LANGUAGE_OPTIONS.find((option) => option.value === normalized)?.label ?? "English";
}
