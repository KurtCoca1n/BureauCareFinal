import "server-only";

import { normalizeDocumentKindDetection, type DocumentKindDetection } from "@/lib/document-kind";
import { classifyDocumentKindWithOpenAI } from "@/lib/openai/document-kind-detection";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types";

/**
 * Stellt sicher, dass für das Dokument eine Einordnung existiert (DB oder neue KI-Stufe).
 * Läuft serverseitig; speichert in documents.kind_detection.
 */
export async function ensureDocumentKindDetection(documentId: string): Promise<DocumentKindDetection | null> {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: document, error: docError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (docError || !document) {
    return null;
  }

  const cached = normalizeDocumentKindDetection(document.kind_detection);
  if (cached) {
    return cached;
  }

  const { data: downloaded, error: downloadError } = await supabase.storage.from("documents").download(document.file_path);

  if (downloadError || !downloaded) {
    return null;
  }

  try {
    const buffer = Buffer.from(await downloaded.arrayBuffer());
    const detection = await classifyDocumentKindWithOpenAI(document, buffer);

    const { error: updateError } = await supabase
      .from("documents")
      .update({ kind_detection: detection as Json })
      .eq("id", documentId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Failed to persist kind_detection", { documentId, updateError });
      return detection;
    }

    return detection;
  } catch (error) {
    console.error("ensureDocumentKindDetection failed", { documentId, error });
    return null;
  }
}
