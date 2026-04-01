import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

import { getClientEnv } from "@/lib/env";

export async function createClient() {
  const cookieStore = await cookies();
  const env = getClientEnv();
  type CookieToSet = {
    name: string;
    value: string;
    options: CookieOptions;
  };

  return createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // Cookie writes are ignored during static rendering.
          }
        }
      }
    }
  );
}
