import type { DocumentKindDetection, DocumentKindId } from "@/lib/document-kind";
import type { DocumentAnalysisRecord, DocumentRecord } from "@/lib/types";

/** Erweiterbar für spätere Persistenz / API */
export type ContractActionType = "cancel" | "extend";

export type ContractMeta = {
  isContract: boolean;
  contractType?: string;
  providerName?: string;
  startDate?: string;
  endDate?: string;
  cancellationPeriod?: string;
  nextPossibleCancellationDate?: string;
  autoRenewal?: boolean;
  notes?: string[];
};

/** Heuristik wie im Vertrags-Scanner: Analyse + Dokumenttyp */
export function analysisIndicatesContract(analysis: DocumentAnalysisRecord): boolean {
  const documentType = (analysis.document_type ?? "").toLowerCase();
  return (
    documentType.includes("vertrag") ||
    documentType.includes("contract") ||
    !!analysis.contract_type?.trim() ||
    !!analysis.contract_summary_simple?.trim()
  );
}

export function kindIndicatesContract(kind: DocumentKindId | null | undefined): boolean {
  return kind === "contract";
}

/**
 * Vertragsaktionen nur, wenn Analyse vorliegt und Vertrag plausibel.
 * Nutzt kind_detection ODER Vertragsfelder in der Analyse.
 */
export function documentQualifiesForContractActions(
  kindDetection: DocumentKindDetection | null,
  analysis: DocumentAnalysisRecord | null
): boolean {
  if (!analysis?.summary_simple?.trim()) {
    return false;
  }
  if (kindDetection && kindIndicatesContract(kindDetection.kind)) {
    return true;
  }
  return analysisIndicatesContract(analysis);
}

export function buildContractMeta(
  document: DocumentRecord,
  analysis: DocumentAnalysisRecord | null,
  kindDetection: DocumentKindDetection | null
): ContractMeta {
  const qualifies = documentQualifiesForContractActions(kindDetection, analysis);
  if (!qualifies || !analysis) {
    return { isContract: false };
  }

  const parties = analysis.contract_parties ?? [];
  const providerName =
    parties.find(Boolean)?.trim() ||
    analysis.sender?.trim() ||
    document.sender?.trim() ||
    undefined;

  const autoRenewalText = (analysis.contract_auto_renewal ?? "").toLowerCase();
  let autoRenewal: boolean | undefined;
  if (analysis.contract_auto_renewal?.trim()) {
    if (/nein|no|nicht|keine\s+automat/i.test(autoRenewalText)) {
      autoRenewal = false;
    } else if (/ja|yes|automatic|automat|verlänger|renewal/i.test(autoRenewalText)) {
      autoRenewal = true;
    }
  }

  const notes: string[] = [];
  if (analysis.contract_duration?.trim()) {
    notes.push(analysis.contract_duration.trim());
  }
  if (analysis.contract_recurring_costs?.trim()) {
    notes.push(analysis.contract_recurring_costs.trim());
  }

  return {
    isContract: true,
    contractType: analysis.contract_type?.trim() || analysis.document_type?.trim() || undefined,
    providerName,
    cancellationPeriod: analysis.contract_notice_period?.trim() || undefined,
    autoRenewal,
    notes: notes.length ? notes : undefined
  };
}
