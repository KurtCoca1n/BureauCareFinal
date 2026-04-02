import { NextResponse } from "next/server";

import { buildBerlinWohngeldPdf } from "@/lib/official-forms/berlin-wohngeld";
import { createClient } from "@/lib/supabase/server";
import type { ProcessSessionRecord } from "@/lib/types";

export async function GET(_request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;

  if (slug !== "wohngeld") {
    return NextResponse.json({ error: "unsupported_process" }, { status: 404 });
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "not_authenticated" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("process_sessions")
    .select("*")
    .eq("user_id", user.id)
    .eq("process_slug", slug)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ error: "session_not_found" }, { status: 404 });
  }

  const session = data as ProcessSessionRecord;
  const pdfBytes = await buildBerlinWohngeldPdf((session.answers ?? {}) as Record<string, string>);

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="berlin-wohngeld-originalantrag-ausgefuellt.pdf"',
      "Cache-Control": "no-store"
    }
  });
}
