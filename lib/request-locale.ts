import "server-only";

import { cookies, headers } from "next/headers";

import { normalizeBrowserLanguage, normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

export const LOCALE_COOKIE_NAME = "bureaucare-locale";

export async function getRequestLanguage(profileLanguage?: string | null): Promise<SupportedLanguage> {
  if (profileLanguage) {
    return normalizePreferredLanguage(profileLanguage);
  }

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE_NAME)?.value;

  if (cookieLocale) {
    return normalizeBrowserLanguage(cookieLocale);
  }

  const headerStore = await headers();
  const acceptLanguage = headerStore.get("accept-language");

  return normalizeBrowserLanguage(acceptLanguage);
}
