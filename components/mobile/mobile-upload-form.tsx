"use client";

import { useActionState, useMemo, useRef, useState } from "react";
import { Camera, ChevronDown, ChevronUp, ImagePlus, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { completeMobileUploadAction, type MobileUploadState } from "@/lib/actions/mobile-upload";

const initialState: MobileUploadState = {
  error: "",
  success: ""
};

export function MobileUploadForm({
  token,
  labels
}: {
  token: string;
  labels: {
    title: string;
    text: string;
    addPage: string;
    finish: string;
    finishing: string;
    camera: string;
    gallery: string;
    pages: string;
    success: string;
  };
}) {
  const formInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [state, formAction, pending] = useActionState(completeMobileUploadAction, initialState);

  const previews = useMemo(
    () =>
      files.map((file, index) => ({
        id: `${file.name}-${index}-${file.size}`,
        url: URL.createObjectURL(file),
        name: file.name || `${labels.pages} ${index + 1}`
      })),
    [files, labels.pages]
  );

  function updateFiles(nextFiles: File[]) {
    setFiles(nextFiles);
    if (formInputRef.current) {
      const transfer = new DataTransfer();
      nextFiles.forEach((file) => transfer.items.add(file));
      formInputRef.current.files = transfer.files;
    }
  }

  return (
    <Card className="space-y-5 p-5">
      <div className="space-y-2">
        <h1 className="page-title page-title-accent text-3xl">{labels.title}</h1>
        <p className="text-sm leading-6 text-[var(--muted)]">{labels.text}</p>
      </div>

      <form action={formAction} className="space-y-4">
        <input type="hidden" name="token" value={token} />
        <input ref={formInputRef} className="sr-only" type="file" name="pages" multiple />

        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex min-h-14 cursor-pointer items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)]">
            <Camera className="mr-2 h-4 w-4" />
            {labels.camera}
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              capture="environment"
              multiple
              onChange={(event) => updateFiles([...(files ?? []), ...Array.from(event.target.files ?? [])])}
            />
          </label>

          <label className="flex min-h-14 cursor-pointer items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-4 text-sm font-medium text-[var(--foreground)]">
            <ImagePlus className="mr-2 h-4 w-4" />
            {labels.gallery}
            <input
              className="sr-only"
              type="file"
              accept="image/*"
              multiple
              onChange={(event) => updateFiles([...(files ?? []), ...Array.from(event.target.files ?? [])])}
            />
          </label>
        </div>

        {files.length ? (
          <div className="space-y-3">
            <p className="text-sm font-medium">{labels.pages}</p>
            <div className="space-y-3">
              {previews.map((preview, index) => (
                <div key={preview.id} className="rounded-[20px] border border-[var(--line)] bg-white p-3">
                  <div className="flex items-center gap-3">
                    <img src={preview.url} alt={preview.name} className="h-20 w-16 rounded-2xl object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium">{preview.name}</p>
                      <p className="text-xs text-[var(--muted)]">
                        {labels.pages} {index + 1}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        className="rounded-xl border border-[var(--line)] bg-[var(--background)] p-2"
                        onClick={() => {
                          if (index === 0) return;
                          const next = [...files];
                          [next[index - 1], next[index]] = [next[index], next[index - 1]];
                          updateFiles(next);
                        }}
                      >
                        <ChevronUp className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="rounded-xl border border-[var(--line)] bg-[var(--background)] p-2"
                        onClick={() => {
                          if (index === files.length - 1) return;
                          const next = [...files];
                          [next[index + 1], next[index]] = [next[index], next[index + 1]];
                          updateFiles(next);
                        }}
                      >
                        <ChevronDown className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {state.error ? <p className="text-sm text-[var(--danger)]">{state.error}</p> : null}
        {state.success ? <p className="text-sm text-[var(--success)]">{state.success || labels.success}</p> : null}

        <Button type="submit" className="w-full" disabled={pending || !files.length}>
          {pending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {labels.finishing}
            </>
          ) : (
            labels.finish
          )}
        </Button>
      </form>
    </Card>
  );
}
