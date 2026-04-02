import { createHash, randomBytes } from "crypto";

import { createAdminClient } from "@/lib/supabase/admin";

const TOKEN_TTL_MINUTES = 10;

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export function createRawMobileUploadToken() {
  return randomBytes(24).toString("base64url");
}

export async function createMobileUploadToken({
  userId,
  caseId
}: {
  userId: string;
  caseId?: string | null;
}) {
  const admin = createAdminClient();
  const rawToken = createRawMobileUploadToken();
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MINUTES * 60 * 1000).toISOString();

  const { data, error } = await admin
    .from("mobile_upload_tokens")
    .insert({
      user_id: userId,
      case_id: caseId ?? null,
      token_hash: tokenHash,
      expires_at: expiresAt
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error("Der mobile Upload-Link konnte nicht erstellt werden.");
  }

  return {
    id: data.id as string,
    rawToken,
    expiresAt
  };
}

export async function getMobileUploadToken(rawToken: string) {
  const admin = createAdminClient();
  const tokenHash = hashToken(rawToken);
  const { data } = await admin
    .from("mobile_upload_tokens")
    .select("*")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  return data;
}

export function isMobileUploadTokenValid(token: { expires_at: string; used_at: string | null } | null) {
  if (!token) {
    return false;
  }

  if (token.used_at) {
    return false;
  }

  return new Date(token.expires_at).getTime() > Date.now();
}
