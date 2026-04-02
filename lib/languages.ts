export const SUPPORTED_LANGUAGES = ["de", "en", "tr", "uk", "es"] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

export const LANGUAGE_OPTIONS: Array<{ value: SupportedLanguage; label: string }> = [
  { value: "de", label: "Deutsch" },
  { value: "en", label: "English" },
  { value: "tr", label: "Türkçe" },
  { value: "uk", label: "Українська" },
  { value: "es", label: "Español" }
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

  if (["türkisch", "turkisch", "turkish"].includes(normalized)) {
    return "tr";
  }

  if (["ukrainisch", "ukrainian"].includes(normalized)) {
    return "uk";
  }

  if (["spanisch", "spanish", "español", "espanol"].includes(normalized)) {
    return "es";
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
  }

  return "en";
}

export function getLanguageLabel(value: string | null | undefined) {
  const normalized = normalizePreferredLanguage(value);
  return LANGUAGE_OPTIONS.find((option) => option.value === normalized)?.label ?? "English";
}
