import {
  buildCaseBriefFromDetection,
  caseBriefToJson,
  mergeCaseBriefWithAnalysis,
  parseCaseBrief
} from "@/lib/case-brief";
import { createCaseEvent } from "@/lib/case-events";
import { createClient } from "@/lib/supabase/server";
import type { DocumentKindDetection } from "@/lib/document-kind";
import type { CaseRecord, DocumentAnalysisRecord, DocumentRecord } from "@/lib/types";

function normalize(value: string | null | undefined) {
  return (value ?? "")
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getSubjectTokens(value: string | null | undefined) {
  return normalize(value)
    .split(" ")
    .filter((token) => token.length >= 4);
}

function buildCaseTitle(sender: string | null | undefined, subject: string | null | undefined) {
  const cleanSender = sender?.trim() || "Unbekannte Stelle";
  const cleanSubject = subject?.trim() || "Offenes Anliegen";
  return `${cleanSender} – ${cleanSubject}`;
}

function getSimilarityScore(caseRecord: CaseRecord, subject: string | null | undefined) {
  const caseTokens = getSubjectTokens(caseRecord.title);
  const subjectTokens = getSubjectTokens(subject);

  if (!caseTokens.length || !subjectTokens.length) {
    return 0;
  }

  const overlap = subjectTokens.filter((token) => caseTokens.includes(token)).length;
  return overlap / Math.max(subjectTokens.length, caseTokens.length);
}

export async function resolveCaseForDocument({
  userId,
  sender,
  subject
}: {
  userId: string;
  sender: string | null | undefined;
  subject: string | null | undefined;
}) {
  const supabase = await createClient();
  const organization = sender?.trim() || "Unbekannte Stelle";
  const normalizedOrganization = normalize(organization);

  const { data: existingCases } = await supabase
    .from("cases")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  const cases = (existingCases as CaseRecord[] | null) ?? [];
  const matchingByOrganization = cases.filter((caseRecord) => normalize(caseRecord.organization) === normalizedOrganization);

  const bestMatch = matchingByOrganization
    .map((caseRecord) => ({
      caseRecord,
      score: getSimilarityScore(caseRecord, subject)
    }))
    .sort((a, b) => b.score - a.score)[0];

  if (bestMatch && bestMatch.score >= 0.2) {
    return { caseRecord: bestMatch.caseRecord, created: false };
  }

  if (!bestMatch && matchingByOrganization.length === 1) {
    return { caseRecord: matchingByOrganization[0], created: false };
  }

  const title = buildCaseTitle(sender, subject);
  const now = new Date().toISOString();

  const { data: createdCase } = await supabase
    .from("cases")
    .insert({
      user_id: userId,
      organization,
      title,
      status: "open",
      updated_at: now
    })
    .select("*")
    .single();

  return { caseRecord: createdCase as CaseRecord, created: true };
}

export async function syncDocumentCaseAndStatus({
  document,
  analysis
}: {
  document: DocumentRecord;
  analysis: Pick<
    DocumentAnalysisRecord,
    | "sender"
    | "subject"
    | "deadline_date"
    | "is_action_required"
    | "document_type"
    | "summary_simple"
    | "summary_simple_short"
    | "next_steps"
    | "risks_if_ignored"
  >;
}) {
  const supabase = await createClient();
  const existingCase =
    document.case_id
      ? ((await supabase.from("cases").select("*").eq("id", document.case_id).maybeSingle()).data as CaseRecord | null)
      : null;
  const resolved = existingCase
    ? { caseRecord: existingCase, created: false }
    : await resolveCaseForDocument({
        userId: document.user_id,
        sender: analysis.sender ?? document.sender,
        subject: analysis.subject ?? document.subject
      });

  const nextDocumentStatus = "analysiert" as const;
  const nextCaseStatus = analysis.is_action_required ? "in_progress" : "open";
  const mergedBrief = mergeCaseBriefWithAnalysis(parseCaseBrief(resolved.caseRecord.case_brief), document, {
    document_type: analysis.document_type,
    summary_simple: analysis.summary_simple,
    summary_simple_short: analysis.summary_simple_short,
    deadline_date: analysis.deadline_date,
    next_steps: analysis.next_steps,
    risks_if_ignored: analysis.risks_if_ignored
  });

  await supabase
    .from("documents")
    .update({
      case_id: resolved.caseRecord.id,
      status: nextDocumentStatus,
      document_date: analysis.deadline_date ?? null,
      sender: analysis.sender ?? document.sender,
      subject: analysis.subject ?? document.subject
    })
    .eq("id", document.id);

  await supabase
    .from("cases")
    .update({
      organization: analysis.sender ?? resolved.caseRecord.organization,
      title: buildCaseTitle(analysis.sender ?? resolved.caseRecord.organization, analysis.subject ?? document.subject),
      status: nextCaseStatus,
      case_brief: caseBriefToJson(mergedBrief),
      updated_at: new Date().toISOString()
    })
    .eq("id", resolved.caseRecord.id);

  const { data: refreshed } = await supabase.from("cases").select("*").eq("id", resolved.caseRecord.id).maybeSingle();

  return {
    caseRecord: (refreshed as CaseRecord) ?? resolved.caseRecord,
    created: resolved.created,
    documentStatus: nextDocumentStatus,
    caseStatus: nextCaseStatus
  };
}

/** Vor der vollen Analyse: Fall anlegen und Dokument verknüpfen (optional auf dem Decision Screen) */
export async function createEarlyCaseForDocument({
  userId,
  document,
  detection,
  title,
  organization
}: {
  userId: string;
  document: DocumentRecord;
  detection: DocumentKindDetection | null;
  title: string;
  organization: string | null;
}): Promise<{ caseRecord: CaseRecord; created: true } | { caseRecord: CaseRecord; created: false }> {
  const supabase = await createClient();

  if (document.case_id) {
    const { data: existing } = await supabase.from("cases").select("*").eq("id", document.case_id).maybeSingle();
    if (existing) {
      return { caseRecord: existing as CaseRecord, created: false };
    }
  }

  const now = new Date().toISOString();
  const brief = buildCaseBriefFromDetection(document, detection);

  const { data: createdCase, error } = await supabase
    .from("cases")
    .insert({
      user_id: userId,
      title: title.trim().slice(0, 240) || document.original_filename,
      organization: organization?.trim() || null,
      status: "open",
      updated_at: now,
      case_brief: caseBriefToJson(brief)
    })
    .select("*")
    .single();

  if (error || !createdCase) {
    throw new Error(error?.message ?? "Fall konnte nicht angelegt werden.");
  }

  await supabase
    .from("documents")
    .update({ case_id: createdCase.id })
    .eq("id", document.id)
    .eq("user_id", userId);

  await createCaseEvent({
    caseId: createdCase.id,
    documentId: document.id,
    eventType: "document_uploaded",
    note: "Fall angelegt und Dokument verknüpft."
  });

  return { caseRecord: createdCase as CaseRecord, created: true };
}
