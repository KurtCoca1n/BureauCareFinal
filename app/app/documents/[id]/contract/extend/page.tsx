import { notFound, redirect } from "next/navigation";
import type { Route } from "next";

import { ContractExtendFlow } from "@/components/app/contract-extend-flow";
import { buildContractMeta, documentQualifiesForContractActions } from "@/lib/contract-document";
import { getContractActionsCopy } from "@/lib/contract-actions-copy";
import { normalizeDocumentKindDetection } from "@/lib/document-kind";
import { normalizePreferredLanguage } from "@/lib/languages";
import { getDocumentAnalysisByDocumentId, getDocumentById, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function ContractExtendPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [document, analysis, profile] = await Promise.all([
    getDocumentById(id),
    getDocumentAnalysisByDocumentId(id),
    getProfile()
  ]);

  if (!document) {
    notFound();
  }

  const kindDetection = normalizeDocumentKindDetection(document.kind_detection);
  if (!documentQualifiesForContractActions(kindDetection, analysis)) {
    redirect(`/app/documents/${id}` as Route);
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const copy = getContractActionsCopy(locale);
  const letterLocale = normalizePreferredLanguage(locale) === "de" ? "de" : "en";

  const meta = buildContractMeta(document, analysis!, kindDetection);
  const senderName =
    profile?.full_name?.trim() ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    "";
  const recipientName = meta.providerName ?? analysis?.sender?.trim() ?? "";
  const contractTypeLabel = meta.contractType ?? "";

  return (
    <div className="mx-auto max-w-3xl pb-10 pt-4">
      <ContractExtendFlow
        senderName={senderName}
        recipientName={recipientName}
        contractTypeLabel={contractTypeLabel}
        contractOrCustomerNumber=""
        copy={copy}
        letterLocale={letterLocale}
        backHref={`/app/documents/${document.id}` as Route}
      />
    </div>
  );
}
