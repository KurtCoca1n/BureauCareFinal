import { NextResponse } from "next/server";

import { createMobileUploadTokenAction } from "@/lib/actions/mobile-upload";
import { getServerEnv } from "@/lib/env";

function getPublicAppUrl(request: Request) {
  const env = getServerEnv();
  if (env.NEXT_PUBLIC_APP_URL) {
    return env.NEXT_PUBLIC_APP_URL;
  }

  const forwardedHost = request.headers.get("x-forwarded-host");
  const forwardedProto = request.headers.get("x-forwarded-proto") ?? "https";

  if (forwardedHost) {
    return `${forwardedProto}://${forwardedHost}`;
  }

  return new URL(request.url).origin;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as { caseId?: string | null };
    const token = await createMobileUploadTokenAction({ caseId: body.caseId ?? null });
    const url = new URL(`/mobile-upload/${token.rawToken}`, getPublicAppUrl(request)).toString();

    return NextResponse.json({
      token: token.rawToken,
      url,
      expiresAt: token.expiresAt
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Der QR-Link konnte nicht erstellt werden." },
      { status: 400 }
    );
  }
}
