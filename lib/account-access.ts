import { createClient } from "@/lib/supabase/server";
import type { AccountRole } from "@/lib/types";

export function normalizeAccountRole(value: string | null | undefined): AccountRole {
  switch (value) {
    case "tester":
    case "admin":
    case "super_admin":
      return value;
    default:
      return "user";
  }
}

export function isTesterRole(role: string | null | undefined) {
  const normalized = normalizeAccountRole(role);
  return normalized === "tester" || normalized === "admin" || normalized === "super_admin";
}

export async function getAccountRoleForUser(userId: string): Promise<AccountRole> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("account_access").select("role").eq("user_id", userId).maybeSingle();

  if (error) {
    const message = error.message.toLowerCase();
    if (message.includes("relation") || message.includes("account_access")) {
      return "user";
    }
  }

  return normalizeAccountRole(data?.role);
}
