"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Laptop2, LoaderCircle, QrCode, RefreshCw, Smartphone } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function MobileScanCard({
  caseId,
  labels,
  compact = false
}: {
  caseId?: string | null;
  compact?: boolean;
  labels: {
    title: string;
    text: string;
    note?: string;
    create: string;
    creating: string;
    copyLink: string;
    copied: string;
    refresh: string;
    waiting: string;
    success: string;
  };
}) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [status, setStatus] = useState<"idle" | "waiting" | "complete">("idle");

  async function createToken() {
    setPending(true);
    setCopied(false);

    const response = await fetch("/api/mobile-upload-token", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({ caseId })
    });

    const data = (await response.json()) as { url?: string; error?: string };
    setPending(false);

    if (!response.ok || !data.url) {
      return;
    }

    setUploadUrl(data.url);
    setStatus("waiting");
  }

  useEffect(() => {
    if (!uploadUrl) {
      setQrUrl("");
      return;
    }

    QRCode.toDataURL(uploadUrl, {
      margin: 1,
      width: compact ? 200 : 240,
      color: {
        dark: "#2B2B2B",
        light: "#FFFFFF"
      }
    })
      .then(setQrUrl)
      .catch(() => setQrUrl(""));
  }, [uploadUrl, compact]);

  useEffect(() => {
    if (!uploadUrl || status !== "waiting") {
      return;
    }

    const token = uploadUrl.split("/").pop();
    if (!token) {
      return;
    }

    const interval = window.setInterval(async () => {
      const response = await fetch(`/api/mobile-upload-status/${token}`, { cache: "no-store" });
      if (!response.ok) {
        return;
      }

      const data = (await response.json()) as { status: string; documentId?: string };
      if (data.status === "complete" && data.documentId) {
        setStatus("complete");
        window.clearInterval(interval);
        router.refresh();
        window.setTimeout(() => {
          router.push(`/app/documents/${data.documentId}/decision` as Route);
        }, 900);
      }
    }, 3000);

    return () => window.clearInterval(interval);
  }, [router, status, uploadUrl]);

  async function copyLink() {
    if (!uploadUrl) {
      return;
    }

    await navigator.clipboard.writeText(uploadUrl);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <Card
      className={cn(
        "border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(247,250,252,0.9))] shadow-[0_18px_42px_rgba(43,43,43,0.05)]",
        compact ? "space-y-4 p-4 sm:p-5" : "space-y-6 p-6 sm:p-7"
      )}
    >
      <div className={cn(compact ? "space-y-2" : "space-y-3")}>
        <div
          className={cn(
            "inline-flex rounded-2xl bg-[rgba(111,168,220,0.14)] text-[var(--soft-blue)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
            compact ? "p-2.5" : "p-3"
          )}
        >
          <QrCode className={cn(compact ? "h-4 w-4" : "h-5 w-5")} />
        </div>
        <h2 className={cn("font-semibold tracking-[-0.02em]", compact ? "text-base" : "text-xl")}>{labels.title}</h2>
        <p className={cn("text-[var(--muted)]", compact ? "text-xs leading-5" : "text-sm leading-6")}>{labels.text}</p>
        {labels.note ? (
          <div
            className={cn(
              "inline-flex max-w-full items-center gap-2 rounded-full border border-[rgba(255,255,255,0.5)] bg-[linear-gradient(180deg,rgba(214,231,245,0.66),rgba(255,255,255,0.82))] font-medium text-[var(--foreground)]/78 shadow-[0_10px_24px_rgba(95,163,163,0.08)] backdrop-blur-md",
              compact ? "px-3 py-1.5 text-[11px] leading-snug" : "px-3.5 py-2 text-xs leading-5"
            )}
          >
            <span
              className={cn(
                "inline-flex shrink-0 items-center justify-center rounded-full bg-white/70 text-[var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
                compact ? "h-5 w-5" : "h-6 w-6"
              )}
            >
              <Laptop2 className={cn(compact ? "h-3 w-3" : "h-3.5 w-3.5")} />
            </span>
            <span>{labels.note}</span>
          </div>
        ) : null}
      </div>

      {!uploadUrl ? (
        <Button type="button" className="w-full" onClick={createToken} disabled={pending}>
          {pending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {labels.creating}
            </>
          ) : (
            <>
              <Smartphone className="mr-2 h-4 w-4" />
              {labels.create}
            </>
          )}
        </Button>
      ) : (
        <div className={cn(compact ? "space-y-3" : "space-y-5")}>
          <div
            className={cn(
              "flex items-center justify-center rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(231,239,247,0.5))] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]",
              compact ? "p-4" : "p-6"
            )}
          >
            {qrUrl ? (
              <img
                src={qrUrl}
                alt="QR-Code für mobilen Upload"
                className={cn("rounded-2xl", compact ? "h-44 w-44" : "h-60 w-60")}
              />
            ) : null}
          </div>

          <div
            className={cn(
              "rounded-[20px] border border-[var(--line)] bg-white text-[var(--muted)]",
              compact ? "p-3 text-xs leading-relaxed" : "p-4 text-sm"
            )}
          >
            {status === "complete" ? labels.success : labels.waiting}
          </div>

          <div className={cn("flex flex-col sm:flex-row", compact ? "gap-2" : "gap-3")}>
            <Button type="button" variant="secondary" className="w-full" onClick={copyLink}>
              <Copy className="mr-2 h-4 w-4" />
              {copied ? labels.copied : labels.copyLink}
            </Button>
            <Button type="button" variant="secondary" className="w-full" onClick={createToken}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {labels.refresh}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

