"use client";

import Link from "next/link";
import type { Route } from "next";
import { FileText, Mail, Printer, ArrowUpRight } from "lucide-react";

import { CopyButton } from "@/components/app/copy-button";
import { Button } from "@/components/ui/button";

export function ProcessResultActions({
  preparedText,
  emailSubject,
  emailBody,
  caseHref,
  officialPdfHref,
  labels
}: {
  preparedText: string;
  emailSubject: string;
  emailBody: string;
  caseHref: string | null;
  officialPdfHref?: string | null;
  labels: {
    copy: string;
    print: string;
    email: string;
    openCase: string;
    officialPdf?: string;
  };
}) {
  const mailHref = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      <div className="sm:col-span-2 xl:col-span-1">
        <CopyButton text={preparedText} label={labels.copy} copiedLabel={labels.copy} />
      </div>
      {officialPdfHref ? (
        <a
          href={officialPdfHref}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[rgba(232,220,207,0.85)] bg-[rgba(232,220,207,0.32)] px-5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:bg-[rgba(232,220,207,0.48)]"
        >
          <Printer className="mr-2 h-4 w-4" />
          {labels.officialPdf ?? labels.print}
        </a>
      ) : (
        <Button type="button" variant="secondary" onClick={() => window.print()}>
          <Printer className="mr-2 h-4 w-4" />
          {labels.print}
        </Button>
      )}
      <a href={mailHref} className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[rgba(232,220,207,0.85)] bg-[rgba(232,220,207,0.32)] px-5 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5 hover:bg-[rgba(232,220,207,0.48)]">
        <Mail className="mr-2 h-4 w-4" />
        {labels.email}
      </a>
      {caseHref ? (
        <Link
          href={caseHref as Route}
          className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[image:var(--accent-gradient)] px-5 text-sm font-semibold text-white shadow-[var(--shadow-soft)] transition duration-200 hover:-translate-y-0.5"
        >
          <FileText className="mr-2 h-4 w-4" />
          {labels.openCase}
          <ArrowUpRight className="ml-2 h-4 w-4" />
        </Link>
      ) : null}
    </div>
  );
}
