"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, LoaderCircle, QrCode, RefreshCw, Smartphone } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function MobileScanCard({
  caseId,
  labels
}: {
  caseId?: string | null;
  labels: {
    title: string;
    text: string;
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
      width: 240,
      color: {
        dark: "#2B2B2B",
        light: "#FFFFFF"
      }
    })
      .then(setQrUrl)
      .catch(() => setQrUrl(""));
  }, [uploadUrl]);

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
          router.push(`/app/documents/${data.documentId}`);
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
    <Card className="space-y-6 p-6 sm:p-7">
      <div className="space-y-3">
        <div className="inline-flex rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
          <QrCode className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold">{labels.title}</h2>
        <p className="text-sm leading-6 text-[var(--muted)]">{labels.text}</p>
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
        <div className="space-y-5">
          <div className="flex items-center justify-center rounded-[28px] border border-[var(--line)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(239,232,223,0.38))] p-6">
            {qrUrl ? <img src={qrUrl} alt="QR-Code für mobilen Upload" className="h-60 w-60 rounded-2xl" /> : null}
          </div>

          <div className="rounded-[20px] border border-[var(--line)] bg-white p-4 text-sm text-[var(--muted)]">
            {status === "complete" ? labels.success : labels.waiting}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
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
