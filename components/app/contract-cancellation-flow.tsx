"use client";

import { useCallback, useMemo, useState } from "react";
import { ChevronLeft, Copy, Download } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { buildCancellationLetter } from "@/lib/contract-action-letters";
import type { ContractActionsCopy } from "@/lib/contract-actions-copy";

export type ContractCancellationPrefill = {
  senderName: string;
  senderStreet: string;
  senderPostalCode: string;
  senderCity: string;
  recipientName: string;
  recipientStreet: string;
  recipientPostalCode: string;
  recipientCity: string;
  contractTypeLabel: string;
  contractOrCustomerNumber: string;
  contactEmail: string;
  contactPhone: string;
};

export function ContractCancellationFlow({
  documentId,
  documentTitle,
  copy,
  letterLocale,
  prefill,
  backHref
}: {
  documentId: string;
  documentTitle: string;
  copy: ContractActionsCopy;
  letterLocale: "de" | "en";
  prefill: ContractCancellationPrefill;
  backHref: Route;
}) {
  const [step, setStep] = useState<"form" | "preview">("form");
  const [senderName, setSenderName] = useState(prefill.senderName);
  const [senderStreet, setSenderStreet] = useState(prefill.senderStreet);
  const [senderPostalCode, setSenderPostalCode] = useState(prefill.senderPostalCode);
  const [senderCity, setSenderCity] = useState(prefill.senderCity);
  const [recipientName, setRecipientName] = useState(prefill.recipientName);
  const [recipientStreet, setRecipientStreet] = useState(prefill.recipientStreet);
  const [recipientPostalCode, setRecipientPostalCode] = useState(prefill.recipientPostalCode);
  const [recipientCity, setRecipientCity] = useState(prefill.recipientCity);
  const [contractTypeLabel, setContractTypeLabel] = useState(prefill.contractTypeLabel);
  const [contractOrCustomerNumber, setContractOrCustomerNumber] = useState(prefill.contractOrCustomerNumber);
  const [desiredCancellationDate, setDesiredCancellationDate] = useState("");
  const [contactEmail, setContactEmail] = useState(prefill.contactEmail);
  const [contactPhone, setContactPhone] = useState(prefill.contactPhone);
  const [referenceSubject, setReferenceSubject] = useState("");

  const letter = useMemo(() => {
    if (step !== "preview") {
      return "";
    }
    return buildCancellationLetter({
      locale: letterLocale,
      senderName: senderName.trim(),
      senderStreet: senderStreet.trim(),
      senderPostalCode: senderPostalCode.trim(),
      senderCity: senderCity.trim(),
      recipientName: recipientName.trim(),
      recipientStreet: recipientStreet.trim() || undefined,
      recipientPostalCode: recipientPostalCode.trim() || undefined,
      recipientCity: recipientCity.trim() || undefined,
      contractTypeLabel: contractTypeLabel.trim(),
      contractOrCustomerNumber: contractOrCustomerNumber.trim() || undefined,
      desiredCancellationDate: desiredCancellationDate.trim() || (letterLocale === "de" ? "zum nächstmöglichen Zeitpunkt" : "at the earliest possible date"),
      contactEmail: contactEmail.trim() || undefined,
      contactPhone: contactPhone.trim() || undefined,
      referenceSubject: referenceSubject.trim() || undefined
    });
  }, [
    step,
    letterLocale,
    senderName,
    senderStreet,
    senderPostalCode,
    senderCity,
    recipientName,
    recipientStreet,
    recipientPostalCode,
    recipientCity,
    contractTypeLabel,
    contractOrCustomerNumber,
    desiredCancellationDate,
    contactEmail,
    contactPhone,
    referenceSubject
  ]);

  const onGenerate = useCallback(() => {
    setStep("preview");
  }, []);

  const onCopy = useCallback(async () => {
    if (!letter) {
      return;
    }
    await navigator.clipboard.writeText(letter);
  }, [letter]);

  const onDownload = useCallback(() => {
    if (!letter) {
      return;
    }
    const blob = new Blob([letter], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = copy.cancelDownloadFilename;
    a.click();
    URL.revokeObjectURL(url);
  }, [letter, copy.cancelDownloadFilename]);

  const formValid =
    senderName.trim() &&
    senderStreet.trim() &&
    senderPostalCode.trim() &&
    senderCity.trim() &&
    recipientName.trim() &&
    contractTypeLabel.trim() &&
    desiredCancellationDate.trim();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={backHref}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
        >
          <ChevronLeft className="h-4 w-4" />
          {copy.backToDocument}
        </Link>
      </div>

      <Card className="space-y-4 border-[var(--line)] bg-[rgba(248,252,251,0.75)] p-5">
        <p className="text-sm font-semibold text-[var(--foreground)]">{copy.cancelStepIntroTitle}</p>
        <p className="text-sm leading-6 text-[var(--muted)]">{copy.cancelStepIntroBody}</p>
        <div className="rounded-[20px] border border-[rgba(95,163,163,0.2)] bg-white/90 px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">{documentTitle}</p>
          <p className="mt-1 text-xs text-[var(--muted)]">ID: {documentId.slice(0, 8)}…</p>
        </div>
      </Card>

      <Card className="space-y-5 border-[var(--line-strong)] p-5 sm:p-6">
        <h2 className="text-lg font-semibold">{copy.cancelStepFormTitle}</h2>

        <div className="rounded-[22px] border border-[var(--line)] bg-[rgba(255,255,255,0.92)] p-4">
          <p className="text-sm font-semibold text-[var(--foreground)]">{copy.disclaimerTitle}</p>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.disclaimerBody}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldSenderName}</span>
            <Input value={senderName} onChange={(e) => setSenderName(e.target.value)} autoComplete="name" />
          </label>
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldStreet}</span>
            <Input value={senderStreet} onChange={(e) => setSenderStreet(e.target.value)} autoComplete="street-address" />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldPostal}</span>
            <Input value={senderPostalCode} onChange={(e) => setSenderPostalCode(e.target.value)} autoComplete="postal-code" />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldCity}</span>
            <Input value={senderCity} onChange={(e) => setSenderCity(e.target.value)} autoComplete="address-level2" />
          </label>
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldRecipientName}</span>
            <Input value={recipientName} onChange={(e) => setRecipientName(e.target.value)} />
          </label>
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldRecipientStreet}</span>
            <Input value={recipientStreet} onChange={(e) => setRecipientStreet(e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldRecipientPostal}</span>
            <Input value={recipientPostalCode} onChange={(e) => setRecipientPostalCode(e.target.value)} />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldRecipientCity}</span>
            <Input value={recipientCity} onChange={(e) => setRecipientCity(e.target.value)} />
          </label>
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldContractType}</span>
            <Input value={contractTypeLabel} onChange={(e) => setContractTypeLabel(e.target.value)} />
          </label>
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldContractNumber}</span>
            <Input value={contractOrCustomerNumber} onChange={(e) => setContractOrCustomerNumber(e.target.value)} />
          </label>
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldDesiredDate}</span>
            <Input
              value={desiredCancellationDate}
              onChange={(e) => setDesiredCancellationDate(e.target.value)}
              placeholder={copy.placeholderDate}
            />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldEmail}</span>
            <Input value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" autoComplete="email" />
          </label>
          <label className="block space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldPhone}</span>
            <Input value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} type="tel" autoComplete="tel" />
          </label>
          <label className="block space-y-2 sm:col-span-2">
            <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.fieldSubjectOptional}</span>
            <Input value={referenceSubject} onChange={(e) => setReferenceSubject(e.target.value)} />
          </label>
        </div>

        <div className="flex flex-wrap gap-3">
          {step === "preview" ? (
            <Button type="button" variant="secondary" onClick={() => setStep("form")}>
              {copy.cancelBack}
            </Button>
          ) : null}
          <Button type="button" disabled={!formValid} onClick={onGenerate}>
            {copy.cancelGenerate}
          </Button>
        </div>
      </Card>

      {step === "preview" && letter ? (
        <Card className="space-y-4 border-[rgba(95,163,163,0.2)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(238,246,245,0.9))] p-5 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-lg font-semibold">{copy.cancelStepPreviewTitle}</h2>
            <div className="flex flex-wrap gap-2">
              <Button type="button" variant="secondary" onClick={() => void onCopy()}>
                <Copy className="mr-2 h-4 w-4" />
                {copy.cancelCopy}
              </Button>
              <Button type="button" variant="secondary" onClick={onDownload}>
                <Download className="mr-2 h-4 w-4" />
                {copy.cancelDownload}
              </Button>
            </div>
          </div>
          <pre className="max-h-[480px] overflow-auto whitespace-pre-wrap rounded-[22px] border border-[var(--line)] bg-white p-4 text-sm leading-7 text-[var(--foreground)]">
            {letter}
          </pre>
        </Card>
      ) : null}
    </div>
  );
}
