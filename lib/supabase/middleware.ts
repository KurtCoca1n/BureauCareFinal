import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

import { getClientEnv } from "@/lib/env";

export async function updateSession(request: NextRequest) {
  // NOTE: This helper is kept for backwards compatibility.
  // We intentionally avoid `supabase.auth.getUser()` here because it triggers a network roundtrip
  // on every request and slows down route transitions. Auth gating is handled in server code
  // (layouts/pages/actions) where necessary.
  const env = getClientEnv();
  type CookieToSet = {
    name: string;
    value: string;
    options: CookieOptions;
  };
  let response = NextResponse.next({
    request
  });

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value));

          response = NextResponse.next({
            request
          });

          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        }
      }
    }
  );

  // Touch the session once to allow cookie refresh if needed (no network call).
  await supabase.auth.getSession();

  return response;
}
