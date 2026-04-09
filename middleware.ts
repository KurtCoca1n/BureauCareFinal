import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { LOCALE_COOKIE_NAME } from "@/lib/request-locale";
import { normalizeBrowserLanguage } from "@/lib/languages";

export async function middleware(request: NextRequest) {
  // Keep middleware as light as possible.
  // Auth gating happens in server layouts/pages (e.g. `app/app/layout.tsx`),
  // so we avoid an extra Supabase roundtrip here which slows down navigation.
  const response = NextResponse.next({ request });

  if (!request.cookies.get(LOCALE_COOKIE_NAME)) {
    const detectedLocale = normalizeBrowserLanguage(request.headers.get("accept-language"));
    response.cookies.set(LOCALE_COOKIE_NAME, detectedLocale, {
      path: "/",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365
    });
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
