"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Camera, FileUp, LoaderCircle, UploadCloud } from "lucide-react";
import type { Route } from "next";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { uploadDocumentAction, type UploadFormState } from "@/lib/actions/documents";

const initialState: UploadFormState = {
  error: "",
  success: ""
};

export function UploadForm({
  labels,
  caseId,
  autoOpenCamera = false
}: {
  labels: {
    title: string;
    allowedFormats: string;
    dropzoneTitle: string;
    dropzoneText: string;
    pickFile: string;
    takePhoto: string;
    submit: string;
    submitting: string;
    afterUploadHint?: string;
  };
  caseId?: string | null;
  autoOpenCamera?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const autoCameraStartedRef = useRef(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [state, formAction, pending] = useActionState(uploadDocumentAction, initialState);

  function assignToDocumentInput(file: File) {
    if (!inputRef.current) {
      return;
    }
    const transfer = new DataTransfer();
    transfer.items.add(file);
    inputRef.current.files = transfer.files;
    setSelectedFile(file.name);
  }

  useEffect(() => {
    if (!autoOpenCamera || autoCameraStartedRef.current) {
      return;
    }
    autoCameraStartedRef.current = true;
    const id = window.setTimeout(() => {
      cameraInputRef.current?.click();
    }, 400);
    return () => window.clearTimeout(id);
  }, [autoOpenCamera]);

  useEffect(() => {
    if (!state.documentId) {
      return;
    }

    const timer = window.setTimeout(() => {
      router.push(`/app/documents/${state.documentId}/decision` as Route);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [router, state.documentId]);

  return (
    <Card className="space-y-6 border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(252,248,243,0.88))] p-6 shadow-[0_18px_42px_rgba(43,43,43,0.05)] sm:p-7">
      <div className="space-y-3">
        <div className="inline-flex rounded-2xl bg-[rgba(95,163,163,0.12)] p-3 text-[var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]">
          <UploadCloud className="h-5 w-5" />
        </div>
        <h2 className="text-xl font-semibold tracking-[-0.02em]">{labels.title}</h2>
        <p className="text-sm leading-6 text-[var(--muted)]">{labels.allowedFormats}</p>
      </div>

      <form action={formAction} className="space-y-5">
        {caseId ? <input type="hidden" name="caseId" value={caseId} /> : null}
        <label
          className={`flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed px-6 py-8 text-center transition ${
            isDragging
              ? "border-[var(--accent)] bg-[linear-gradient(180deg,rgba(111,168,220,0.16),rgba(255,255,255,0.86))] shadow-[0_16px_34px_rgba(95,163,163,0.08)]"
              : "border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(239,232,223,0.5))] hover:border-[var(--accent)] hover:bg-white hover:shadow-[0_16px_34px_rgba(43,43,43,0.04)]"
          }`}
          onDragOver={(event) => {
            event.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(event) => {
            event.preventDefault();
            setIsDragging(false);

            const droppedFile = event.dataTransfer.files?.[0];
            if (!droppedFile || !inputRef.current) {
              return;
            }

            const transfer = new DataTransfer();
            transfer.items.add(droppedFile);
            inputRef.current.files = transfer.files;
            setSelectedFile(droppedFile.name);
          }}
        >
          <div className="mb-5 rounded-3xl bg-white/88 p-4 shadow-[var(--shadow-soft)] ring-1 ring-white/70">
            <UploadCloud className="h-7 w-7 text-[var(--accent)]" />
          </div>
          <p className="text-lg font-semibold">{labels.dropzoneTitle}</p>
          <p className="mt-3 max-w-sm text-sm leading-7 text-[var(--muted)]">{labels.dropzoneText}</p>
          {selectedFile ? (
            <p className="mt-4 rounded-full bg-white px-3 py-2 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)]">
              {selectedFile}
            </p>
          ) : null}
          <input
            ref={inputRef}
            className="sr-only"
            type="file"
            name="document"
            accept="application/pdf,image/png,image/jpeg"
            required
            onChange={(event) => setSelectedFile(event.target.files?.[0]?.name ?? "")}
          />
          <input
            ref={cameraInputRef}
            className="sr-only"
            tabIndex={-1}
            aria-hidden
            type="file"
            accept="image/jpeg,image/jpg,image/png"
            capture="environment"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              if (!file) {
                return;
              }
              assignToDocumentInput(file);
            }}
          />
        </label>

        <div className="grid gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            className="w-full"
            onClick={() => cameraInputRef.current?.click()}
            disabled={pending}
          >
            <Camera className="mr-2 h-4 w-4" />
            {labels.takePhoto}
          </Button>
          <Button type="button" variant="secondary" className="w-full" onClick={() => inputRef.current?.click()} disabled={pending}>
            <FileUp className="mr-2 h-4 w-4" />
            {labels.pickFile}
          </Button>
        </div>

        {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-[var(--success)]">{state.success}</p> : null}

        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {labels.submitting}
            </>
          ) : (
            labels.submit
          )}
        </Button>
      </form>

      {labels.afterUploadHint ? (
        <div className="rounded-[22px] border border-[rgba(95,163,163,0.14)] bg-[rgba(238,246,245,0.55)] px-4 py-3.5">
          <p className="text-sm leading-relaxed text-[var(--muted)]">{labels.afterUploadHint}</p>
        </div>
      ) : null}
    </Card>
  );
}
