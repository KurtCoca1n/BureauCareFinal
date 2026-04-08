import "server-only";

import { normalizeDocumentKindDetection, type DocumentKindDetection } from "@/lib/document-kind";
import { classifyDocumentKindWithOpenAI } from "@/lib/openai/document-kind-detection";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/types";

/** Reines JSON für jsonb — vermeidet Überraschungen bei Supabase/PostgREST. */
function kindDetectionToJsonb(value: DocumentKindDetection): Json {
  return JSON.parse(JSON.stringify(value)) as Json;
}

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

    const payload = kindDetectionToJsonb(detection);
    const { error: updateError } = await supabase
      .from("documents")
      .update({ kind_detection: payload })
      .eq("id", documentId)
      .eq("user_id", user.id);

    if (updateError) {
      // Kein console.error: In Next.js Dev löst das ein „Console Error“-Overlay aus, obwohl wir weiter mit detection arbeiten.
      const err = updateError as { message?: string; code?: string; details?: string; hint?: string };
      const detail = [err.message, err.code, err.details].filter(Boolean).join(" | ") || JSON.stringify(updateError);
      console.warn("[ensureDocumentKindDetection] kind_detection konnte nicht gespeichert werden", {
        documentId,
        detail,
        postgrestHint: err.hint,
        hint:
          "Migration: documents.kind_detection (jsonb). RLS: documents_update_own muss für auth.uid() greifen."
      });
      return detection;
    }

    return detection;
  } catch (error) {
    console.warn("ensureDocumentKindDetection failed", { documentId, error });
    return null;
  }
}
