"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { FileUp, LoaderCircle, UploadCloud } from "lucide-react";
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
  caseId
}: {
  labels: {
    title: string;
    allowedFormats: string;
    dropzoneTitle: string;
    dropzoneText: string;
    pickFile: string;
    submit: string;
    submitting: string;
  };
  caseId?: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const [state, formAction, pending] = useActionState(uploadDocumentAction, initialState);

  useEffect(() => {
    if (!state.documentId) {
      return;
    }

    const timer = window.setTimeout(() => {
      router.push(`/app/documents/${state.documentId}`);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [router, state.documentId]);

  return (
    <Card className="space-y-6 p-6 sm:p-7">
      <div className="space-y-3">
        <h2 className="text-xl font-semibold">{labels.title}</h2>
        <p className="text-sm leading-6 text-[var(--muted)]">{labels.allowedFormats}</p>
      </div>

      <form action={formAction} className="space-y-5">
        {caseId ? <input type="hidden" name="caseId" value={caseId} /> : null}
        <label
          className={`flex min-h-64 cursor-pointer flex-col items-center justify-center rounded-[28px] border border-dashed px-6 py-8 text-center transition ${
            isDragging
              ? "border-[var(--accent)] bg-[var(--accent-soft)]"
              : "border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.78),rgba(239,232,223,0.5))] hover:border-[var(--accent)] hover:bg-white"
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
          <div className="mb-5 rounded-3xl bg-white p-4 shadow-[var(--shadow-soft)]">
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
        </label>

        <Button type="button" variant="secondary" className="w-full" onClick={() => inputRef.current?.click()} disabled={pending}>
          <FileUp className="mr-2 h-4 w-4" />
          {labels.pickFile}
        </Button>

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
    </Card>
  );
}
