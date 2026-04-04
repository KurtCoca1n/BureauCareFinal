import { createClient as createSupabaseClient } from "@supabase/supabase-js";

import { getServerEnv } from "@/lib/env";

export function createAdminClient() {
  const env = getServerEnv();

  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY fehlt für den mobilen Upload-Flow.");
  }

  return createSupabaseClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });
}

