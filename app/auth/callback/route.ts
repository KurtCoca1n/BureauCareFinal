import { NextResponse, type NextRequest } from "next/server";

import { normalizePreferredLanguage } from "@/lib/languages";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type");
  const locale = normalizePreferredLanguage(url.searchParams.get("locale"));

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = "/login/confirmed";
  redirectUrl.searchParams.set("locale", locale);

  const supabase = await createClient();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    redirectUrl.searchParams.set("status", error ? "invalid" : "success");
    return NextResponse.redirect(redirectUrl);
  }

  if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: type as "signup" | "recovery" | "invite" | "email_change" | "email"
    });

    redirectUrl.searchParams.set(
      "status",
      error?.message?.toLowerCase().includes("already")
        ? "already"
        : error?.message?.toLowerCase().includes("expired")
          ? "expired"
          : error
            ? "invalid"
            : "success"
    );

    return NextResponse.redirect(redirectUrl);
  }

  redirectUrl.searchParams.set("status", "invalid");
  return NextResponse.redirect(redirectUrl);
}
