import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";

import { getClientEnv } from "@/lib/env";
import { normalizePreferredLanguage } from "@/lib/languages";

type CookieToSet = { name: string; value: string; options: CookieOptions };

/**
 * Email / PKCE callback: session cookies must be written onto the same
 * NextResponse that is returned, otherwise the browser never stores the session.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const locale = normalizePreferredLanguage(url.searchParams.get("locale"));

  const env = getClientEnv();

  const redirectToConfirmed = (status: string) => {
    const u = request.nextUrl.clone();
    u.pathname = "/login/confirmed";
    u.searchParams.set("locale", locale);
    u.searchParams.set("status", status);
    return u;
  };

  const redirectToResetPassword = () => {
    const u = request.nextUrl.clone();
    u.pathname = "/login/reset-password";
    return u;
  };

  const createSupabase = (response: NextResponse) =>
    createServerClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        }
      }
    });

  if (code) {
    const response = NextResponse.redirect(redirectToConfirmed("success"));
    const supabase = createSupabase(response);
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(redirectToConfirmed("invalid"));
    }
    return response;
  }

  if (tokenHash && type) {
    const response = NextResponse.redirect(type === "recovery" ? redirectToResetPassword() : redirectToConfirmed("success"));
    const supabase = createSupabase(response);
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "recovery" | "invite" | "email_change" | "email"
    });

    if (error) {
      const status = error.message?.toLowerCase().includes("already")
        ? "already"
        : error.message?.toLowerCase().includes("expired")
          ? "expired"
          : "invalid";
      return NextResponse.redirect(redirectToConfirmed(status));
    }
    return response;
  }

  return NextResponse.redirect(redirectToConfirmed("invalid"));
}
