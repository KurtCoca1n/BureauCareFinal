import "server-only";

import type { DocumentRecord } from "@/lib/types";

export type ExtractedPageText = {
  page: number;
  text: string;
};

export type DocumentProcessingResult = {
  pageCount: number;
  pageTexts: ExtractedPageText[];
  extractedText: string | null;
  useStructuredText: boolean;
};

function estimatePdfPageCount(buffer: Buffer) {
  try {
    const raw = buffer.toString("latin1");
    const matches = raw.match(/\/Type\s*\/Page\b/g);
    return Math.max(matches?.length ?? 0, 1);
  } catch {
    return 1;
  }
}

export async function processDocumentForAnalysis(
  document: DocumentRecord,
  buffer: Buffer
): Promise<DocumentProcessingResult> {
  if (document.mime_type === "application/pdf") {
    return {
      pageCount: estimatePdfPageCount(buffer),
      pageTexts: [],
      extractedText: null,
      useStructuredText: false
    };
  }

  return {
    pageCount: 1,
    pageTexts: [],
    extractedText: null,
    useStructuredText: false
  };
}
