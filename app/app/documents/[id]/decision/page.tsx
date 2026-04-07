import { notFound, redirect } from "next/navigation";

import { DocumentDecisionScreen } from "@/components/app/document-decision-screen";
import { ensureDocumentKindDetection } from "@/lib/document-kind-service";
import { getDateLocale, getCopy } from "@/lib/i18n";
import { getDocumentAnalysisByDocumentId, getDocumentById, getProfile } from "@/lib/queries";
import { getRequestLanguage } from "@/lib/request-locale";
import type { Route } from "next";

export default async function DocumentDecisionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [document, analysis, profile] = await Promise.all([getDocumentById(id), getDocumentAnalysisByDocumentId(id), getProfile()]);

  if (!document) {
    notFound();
  }

  if (analysis?.summary_simple) {
    redirect(`/app/documents/${id}` as Route);
  }

  const locale = await getRequestLanguage(profile?.preferred_language);
  const dateLocale = getDateLocale(locale);
  const copy = getCopy(locale);
  const detection = await ensureDocumentKindDetection(id);

  const pageLabel =
    locale === "de"
      ? "Entscheidung"
      : locale === "en"
        ? "Decision"
        : copy.nav.upload;

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-[var(--muted)]">
        {copy.documents.badge} · {pageLabel}
      </p>
      <DocumentDecisionScreen
        document={{ id: document.id, original_filename: document.original_filename, case_id: document.case_id }}
        detection={detection}
        locale={locale}
        dateLocale={dateLocale}
      />
    </div>
  );
}
