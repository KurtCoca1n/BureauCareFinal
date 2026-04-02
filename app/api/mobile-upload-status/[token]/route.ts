import { NextResponse } from "next/server";

import { getMobileUploadToken } from "@/lib/mobile-upload";

export async function GET(_: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const record = await getMobileUploadToken(token);

  if (!record) {
    return NextResponse.json({ status: "invalid" }, { status: 404 });
  }

  if (record.used_at && record.document_id) {
    return NextResponse.json({
      status: "complete",
      documentId: record.document_id
    });
  }

  if (new Date(record.expires_at).getTime() <= Date.now()) {
    return NextResponse.json({ status: "expired" });
  }

  return NextResponse.json({ status: "waiting" });
}
