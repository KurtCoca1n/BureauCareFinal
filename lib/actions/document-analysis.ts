"use server";

import { revalidatePath } from "next/cache";

import { createCaseEvent } from "@/lib/case-events";
import { syncDocumentCaseAndStatus } from "@/lib/cases";
import { analyzeDocumentWithOpenAI } from "@/lib/openai/document-analysis";
import { createClient } from "@/lib/supabase/server";
import { upsertTaskFromAnalysis } from "@/lib/tasks";
import { getMonthlyUsageSummary, hasReachedAnalysisLimit, recordUsageEvent } from "@/lib/usage";

export type AnalyzeDocumentState = {
  error: string;
  success: string;
  redirectTo?: string;
};

export async function analyzeDocumentAction(
  _: AnalyzeDocumentState,
  formData: FormData
): Promise<AnalyzeDocumentState> {
  const documentId = String(formData.get("documentId") ?? "").trim();
  const forceRefresh = String(formData.get("forceRefresh") ?? "") === "1";

  if (!documentId) {
    return { error: "Das Dokument konnte nicht gefunden werden.", success: "" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an.", success: "" };
  }

  const { data: document, error: documentError } = await supabase
    .from("documents")
    .select("*")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (documentError || !document) {
    return { error: "Dieses Dokument wurde nicht gefunden oder gehört dir nicht.", success: "" };
  }

  const { data: existingAnalysis } = await supabase
    .from("document_analyses")
    .select("*")
    .eq("document_id", documentId)
    .maybeSingle();

  if (existingAnalysis?.summary_simple && !forceRefresh) {
    revalidatePath(`/app/documents/${documentId}`);
    return { error: "", success: "Die vorhandene Analyse wurde geladen.", redirectTo: `/app/documents/${documentId}` };
  }

  const usageSummary = await getMonthlyUsageSummary(user.id);

  if (hasReachedAnalysisLimit(usageSummary)) {
    return { error: "Du hast dein kostenloses Monatslimit erreicht.", success: "" };
  }

  const { data: downloadedFile, error: downloadError } = await supabase.storage.from("documents").download(document.file_path);

  if (downloadError || !downloadedFile) {
    return { error: "Die Datei konnte im sicheren Speicher nicht gefunden werden.", success: "" };
  }

  try {
    const buffer = Buffer.from(await downloadedFile.arrayBuffer());
    const analysis = await analyzeDocumentWithOpenAI(document, buffer);

    if (analysis.readability === "unreadable") {
      return {
        error:
          analysis.readability_reason ||
          "Das Dokument konnte leider nicht gut genug gelesen werden. Bitte lade eine klarere Datei hoch.",
        success: ""
      };
    }

    const payload = {
      document_id: documentId,
      sender: analysis.sender,
      document_type: analysis.document_type,
      subject: analysis.subject,
      summary_simple: analysis.summary_simple,
      summary_simple_short: analysis.summary_simple_short,
      summary_simple_long: analysis.summary_simple_long,
      is_action_required: analysis.is_action_required,
      deadline_date: analysis.deadline_date,
      urgency: analysis.urgency,
      key_points: analysis.key_points,
      highlight_terms: analysis.highlight_terms,
      difficult_terms: analysis.difficult_terms,
      next_steps: analysis.next_steps,
      page_count: analysis.page_count,
      page_summaries: analysis.page_summaries,
      important_references: analysis.important_references,
      action_location_name: analysis.action_location_name,
      action_location_address: analysis.action_location_address,
      action_url: analysis.action_url,
      action_mode: analysis.action_mode,
      risks_if_ignored: analysis.risks_if_ignored,
      required_action: analysis.next_steps[0] ?? null,
      raw_extracted_text: analysis.source_excerpt
    };

    const { error: insertError } = existingAnalysis
      ? await supabase.from("document_analyses").update(payload).eq("document_id", documentId)
      : await supabase.from("document_analyses").insert(payload);

    if (insertError) {
      console.error("Failed to persist document analysis", { documentId, insertError });
      return { error: "Die Analyse konnte nicht gespeichert werden. Bitte versuche es erneut.", success: "" };
    }

    const caseSync = await syncDocumentCaseAndStatus({
      document,
      analysis: {
        sender: analysis.sender,
        subject: analysis.subject,
        deadline_date: analysis.deadline_date,
        is_action_required: analysis.is_action_required
      }
    });

    await recordUsageEvent({ userId: user.id, eventType: "analysis_generated", documentId });

    await createCaseEvent({
      caseId: caseSync.caseRecord.id,
      documentId,
      eventType: caseSync.created ? "document_uploaded" : "new_document_added",
      note: caseSync.created ? "Neuer Fall automatisch angelegt." : "Dokument zu bestehendem Fall hinzugefügt."
    });

    await createCaseEvent({
      caseId: caseSync.caseRecord.id,
      documentId,
      eventType: "document_analyzed",
      note: analysis.summary_simple_short ?? analysis.summary_simple
    });

    await upsertTaskFromAnalysis({
      document,
      analysis: {
        sender: analysis.sender,
        subject: analysis.subject,
        deadline_date: analysis.deadline_date,
        is_action_required: analysis.is_action_required,
        next_steps: analysis.next_steps,
        urgency: analysis.urgency,
        risks_if_ignored: analysis.risks_if_ignored,
        action_location_name: analysis.action_location_name,
        action_location_address: analysis.action_location_address,
        action_url: analysis.action_url,
        action_mode: analysis.action_mode,
        important_references: analysis.important_references
      }
    });

    revalidatePath("/app");
    revalidatePath("/app/cases");
    revalidatePath("/app/tasks");
    revalidatePath(`/app/documents/${documentId}`);
    revalidatePath(`/app/cases/${caseSync.caseRecord.id}`);

    return { error: "", success: "Dokument erfolgreich analysiert.", redirectTo: `/app/documents/${documentId}` };
  } catch (error) {
    console.error("Document analysis pipeline failed", { documentId, error });

    const message = error instanceof Error ? error.message : "";

    if (message.includes("rate limit") || message.includes("Rate limit")) {
      return {
        error: "Die Analyse ist gerade kurz ausgelastet. Bitte versuche es in ein bis zwei Minuten erneut.",
        success: ""
      };
    }

    if (message.includes("API key") || message.includes("authentication")) {
      return {
        error: "Die Analyse ist gerade serverseitig nicht richtig verbunden. Bitte versuche es später erneut.",
        success: ""
      };
    }

    return {
      error: "Die Analyse war für dieses Dokument nicht möglich. Bitte prüfe, ob die Datei gut lesbar ist, und versuche es erneut.",
      success: ""
    };
  }
}
