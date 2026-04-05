import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  try {
    const admin = createAdminClient();
    const { data: documents } = await admin
      .from("documents")
      .select("id, original_filename, file_path, sender, subject, status, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    const payload = await Promise.all(
      (documents ?? []).map(async (document) => {
        const { data } = await admin.storage.from("documents").createSignedUrl(document.file_path, 60 * 30);
        return {
          id: document.id,
          filename: document.original_filename,
          sender: document.sender,
          subject: document.subject,
          status: document.status,
          created_at: document.created_at,
          download_url: data?.signedUrl ?? null
        };
      })
    );

    return new NextResponse(JSON.stringify({ exported_at: new Date().toISOString(), documents: payload }, null, 2), {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="bureaucare-document-export-${new Date().toISOString().slice(0, 10)}.json"`
      }
    });
  } catch (error) {
    console.error("Document export failed", { userId: user.id, error });
    return NextResponse.json({ error: "Document export unavailable" }, { status: 500 });
  }
}
