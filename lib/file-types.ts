export function getDocumentTypeLabel(mimeType: string | null | undefined, filename?: string | null) {
  const normalized = (mimeType ?? "").toLowerCase();
  const lowerName = (filename ?? "").toLowerCase();

  if (normalized === "application/pdf" || lowerName.endsWith(".pdf")) {
    return "PDF-Dokument";
  }

  if (normalized === "image/png") {
    return "Gescanntes Dokument";
  }

  if (normalized === "image/jpeg" || normalized === "image/jpg") {
    return "Foto / Bild";
  }

  if (normalized.startsWith("image/")) {
    return "Bilddatei";
  }

  return "Dokumentdatei";
}
