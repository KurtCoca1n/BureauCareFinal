import type { User } from "@supabase/supabase-js";

import { normalizePreferredLanguage } from "@/lib/languages";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

function getMetadataValue(user: User, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}

export async function ensureProfile(user: User): Promise<Profile | null> {
  const supabase = await createClient();

  const { data: existingProfile, error: selectError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .maybeSingle();

  if (existingProfile) {
    return existingProfile as Profile;
  }

  if (selectError && !selectError.message.toLowerCase().includes("relation")) {
    return null;
  }

  const fallbackProfile = {
    id: user.id,
    full_name: getMetadataValue(user, "full_name") || user.email?.split("@")[0] || null,
    preferred_language: normalizePreferredLanguage(getMetadataValue(user, "preferred_language") || "en")
  };

  const { data: insertedProfile } = await supabase
    .from("profiles")
    .upsert(fallbackProfile, { onConflict: "id" })
    .select("*")
    .maybeSingle();

  return (insertedProfile as Profile | null) ?? null;
}
