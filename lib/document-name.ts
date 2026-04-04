function slugify(input: string) {
  return input
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function isGenericFilename(filename: string) {
  const lower = filename.toLowerCase();
  return /^(image|img|scan|dokument|document)[-_ ]?\d*/.test(lower) || /^img_\d+/.test(lower);
}

function getExtension(filename: string, mimeType: string | null | undefined) {
  const extMatch = filename.match(/\.([a-z0-9]+)$/i);
  if (extMatch) {
    return extMatch[1].toLowerCase();
  }

  if (mimeType === "application/pdf") return "pdf";
  if (mimeType?.includes("png")) return "png";
  return "jpg";
}

export function getInitialDocumentName(filename: string, mimeType: string | null | undefined) {
  if (!isGenericFilename(filename)) {
    return filename;
  }

  const ext = getExtension(filename, mimeType);
  const datePart = new Date().toISOString().slice(0, 10);
  const base = mimeType === "application/pdf" ? `dokument-${datePart}` : `foto-dokument-${datePart}`;
  return `${base}.${ext}`;
}

export function getAnalyzedDocumentName({
  currentName,
  mimeType,
  sender,
  subject,
  documentType
}: {
  currentName: string;
  mimeType: string | null | undefined;
  sender: string | null | undefined;
  subject: string | null | undefined;
  documentType: string | null | undefined;
}) {
  if (!isGenericFilename(currentName)) {
    return currentName;
  }

  const ext = getExtension(currentName, mimeType);
  const senderSlug = slugify(sender ?? "");
  const subjectSlug = slugify(subject ?? "");
  const typeSlug = slugify(documentType ?? "");
  const base = [senderSlug, subjectSlug || typeSlug || "dokument"].filter(Boolean).slice(0, 2).join("-");

  return `${base || "dokument"}.${ext}`;
}

export function looksLikePotentiallyIncompleteDocument(text: string | null | undefined) {
  const haystack = (text ?? "").toLowerCase();
  return /\bseite\s*1\b|\bpage\s*1\b|\banlage\b|\bfortsetzung\b|\brückseite\b|\bweitere seite\b/.test(haystack);
}

