import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const [profile, personalData, settings, cases, documents, goals] = await Promise.all([
    supabase.from("profiles").select("*").eq("id", user.id).maybeSingle(),
    supabase.from("user_personal_data").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("user_settings").select("*").eq("user_id", user.id).maybeSingle(),
    supabase.from("cases").select("*").eq("user_id", user.id).order("updated_at", { ascending: false }),
    supabase.from("documents").select("id, original_filename, sender, subject, status, created_at").eq("user_id", user.id).order("created_at", { ascending: false }),
    supabase.from("goals").select("*").eq("user_id", user.id).order("updated_at", { ascending: false })
  ]);

  const payload = {
    exported_at: new Date().toISOString(),
    profile: profile.data,
    personal_data: personalData.data,
    settings: settings.data,
    cases: cases.data ?? [],
    documents: documents.data ?? [],
    goals: goals.data ?? []
  };

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="bureaucare-data-export-${new Date().toISOString().slice(0, 10)}.json"`
    }
  });
}
