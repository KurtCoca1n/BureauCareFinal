"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, Copy } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { buildExtensionRequestLetter } from "@/lib/contract-action-letters";
import type { ContractActionsCopy } from "@/lib/contract-actions-copy";
import { cn } from "@/lib/utils";

export function ContractExtendFlow({
  senderName,
  recipientName,
  contractTypeLabel,
  contractOrCustomerNumber,
  copy,
  letterLocale,
  backHref
}: {
  senderName: string;
  recipientName: string;
  contractTypeLabel: string;
  contractOrCustomerNumber: string;
  copy: ContractActionsCopy;
  letterLocale: "de" | "en";
  backHref: Route;
}) {
  const [option, setOption] = useState("");

  const draft = useMemo(
    () =>
      buildExtensionRequestLetter({
        locale: letterLocale,
        senderName: senderName.trim() || (letterLocale === "de" ? "[Dein Name]" : "[Your name]"),
        recipientName: recipientName.trim() || (letterLocale === "de" ? "[Anbieter]" : "[Provider]"),
        contractTypeLabel: contractTypeLabel.trim(),
        contractOrCustomerNumber: contractOrCustomerNumber.trim() || undefined,
        preferredOption: option.trim() || undefined
      }),
    [senderName, recipientName, contractTypeLabel, contractOrCustomerNumber, option, letterLocale]
  );

  return (
    <div className="space-y-6">
      <Link
        href={backHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] hover:underline"
      >
        <ChevronLeft className="h-4 w-4" />
        {copy.backToDocument}
      </Link>

      <Card className="space-y-3 border-[var(--line)] bg-[rgba(248,252,251,0.75)] p-5">
        <h1 className="text-2xl font-semibold tracking-[-0.03em]">{copy.extendPageTitle}</h1>
        <p className="text-sm leading-7 text-[var(--muted)]">{copy.extendIntro}</p>
      </Card>

      <Card className="space-y-4 border-[var(--line-strong)] p-5 sm:p-6">
        <label className="block space-y-2">
          <span className="text-xs font-semibold uppercase tracking-[0.1em] text-[var(--muted)]">{copy.extendGeneratedLabel}</span>
          <textarea
            value={option}
            onChange={(e) => setOption(e.target.value)}
            placeholder={copy.extendOptionPlaceholder}
            rows={3}
            className={cn(
              "min-h-[88px] w-full rounded-2xl border border-white/80 bg-[rgba(255,255,255,0.94)] px-4 py-3 text-sm text-[var(--foreground)] shadow-[var(--shadow-soft)] outline-none transition placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:shadow-[0_0_0_4px_rgba(95,163,163,0.12)]"
            )}
          />
        </label>
        <p className="text-sm text-[var(--muted)]">{copy.disclaimerBody}</p>
        <Button
          type="button"
          variant="secondary"
          onClick={() => void navigator.clipboard.writeText(draft)}
        >
          <Copy className="mr-2 h-4 w-4" />
          {copy.extendCopy}
        </Button>
        <pre className="max-h-[420px] overflow-auto whitespace-pre-wrap rounded-[22px] border border-[var(--line)] bg-white p-4 text-sm leading-7">
          {draft}
        </pre>
      </Card>
    </div>
  );
}
