import { notFound, redirect } from "next/navigation";
import type { Route } from "next";

import { ContractCancellationFlow } from "@/components/app/contract-cancellation-flow";
import { buildContractMeta, documentQualifiesForContractActions } from "@/lib/contract-document";
import { getContractActionsCopy } from "@/lib/contract-actions-copy";
import { normalizeDocumentKindDetection } from "@/lib/document-kind";
import { normalizePreferredLanguage } from "@/lib/languages";
import { getDocumentAnalysisByDocumentId, getDocumentById, getProfile, getUserPersonalData } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";

export default async function ContractCancellationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [document, analysis, profile, personal] = await Promise.all([
    getDocumentById(id),
    getDocumentAnalysisByDocumentId(id),
    getProfile(),
    getUserPersonalData()
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

  const contact = personal?.contact_details;
  const street = [contact?.street, contact?.house_number].filter(Boolean).join(" ").trim();
  const senderName =
    profile?.full_name?.trim() ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ").trim() ||
    "";

  const meta = buildContractMeta(document, analysis!, kindDetection);

  const prefill = {
    senderName,
    senderStreet: street,
    senderPostalCode: contact?.postal_code?.trim() ?? "",
    senderCity: contact?.city?.trim() ?? "",
    recipientName: meta.providerName ?? analysis?.sender?.trim() ?? "",
    recipientStreet: "",
    recipientPostalCode: "",
    recipientCity: "",
    contractTypeLabel: meta.contractType ?? "",
    contractOrCustomerNumber: "",
    contactEmail: contact?.email?.trim() ?? "",
    contactPhone: contact?.phone?.trim() ?? profile?.phone_number?.trim() ?? ""
  };

  return (
    <div className="mx-auto max-w-3xl pb-10 pt-4">
      <h1 className="mb-6 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">{copy.cancelPageTitle}</h1>
      <ContractCancellationFlow
        documentId={document.id}
        documentTitle={document.original_filename}
        copy={copy}
        letterLocale={letterLocale}
        prefill={prefill}
        backHref={`/app/documents/${document.id}` as Route}
      />
    </div>
  );
}
