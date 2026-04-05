import type { User } from "@supabase/supabase-js";

import { normalizePreferredLanguage } from "@/lib/languages";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/types";

function getMetadataValue(user: User, key: string) {
  const value = user.user_metadata?.[key];
  return typeof value === "string" ? value.trim() : "";
}

function cleanNamePart(value: string | null | undefined) {
  return value?.trim() || "";
}

export function buildFullName(firstName: string | null | undefined, lastName: string | null | undefined) {
  const fullName = [cleanNamePart(firstName), cleanNamePart(lastName)].filter(Boolean).join(" ").trim();
  return fullName || null;
}

export function splitFullName(fullName: string | null | undefined) {
  const normalized = cleanNamePart(fullName);
  if (!normalized) {
    return { firstName: "", lastName: "" };
  }

  const [firstName, ...rest] = normalized.split(/\s+/);
  return {
    firstName,
    lastName: rest.join(" ").trim()
  };
}

export function getProfileFirstName(profile: Profile | null | undefined) {
  if (profile?.first_name?.trim()) {
    return profile.first_name.trim();
  }

  return splitFullName(profile?.full_name).firstName || null;
}

export function getProfileLastName(profile: Profile | null | undefined) {
  if (profile?.last_name?.trim()) {
    return profile.last_name.trim();
  }

  return splitFullName(profile?.full_name).lastName || null;
}

export function getProfileFullName(profile: Profile | null | undefined) {
  return buildFullName(profile?.first_name, profile?.last_name) ?? profile?.full_name?.trim() ?? null;
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
    first_name: getMetadataValue(user, "first_name") || splitFullName(getMetadataValue(user, "full_name")).firstName || null,
    last_name: getMetadataValue(user, "last_name") || splitFullName(getMetadataValue(user, "full_name")).lastName || null,
    full_name: getMetadataValue(user, "full_name") || user.email?.split("@")[0] || null,
    phone_number: getMetadataValue(user, "phone_number") || null,
    preferred_language: normalizePreferredLanguage(getMetadataValue(user, "preferred_language") || "en"),
    reply_default_tone: "automatic" as const,
    reply_style_note: null,
    reply_include_signature: true,
    reply_signature: null,
    reply_translation_mode: "app_language" as const
  };

  const { data: insertedProfile } = await supabase
    .from("profiles")
    .upsert(fallbackProfile, { onConflict: "id" })
    .select("*")
    .maybeSingle();

  return (insertedProfile as Profile | null) ?? null;
}
