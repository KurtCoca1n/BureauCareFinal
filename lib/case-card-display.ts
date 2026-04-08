import type { CaseBrief } from "@/lib/case-brief";
import type { CaseOverview } from "@/lib/queries";

const MAX_TOPIC = 96;

function truncate(s: string, max: number): string {
  const t = s.trim();
  if (t.length <= max) {
    return t;
  }
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

function normEq(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

/**
 * Liste: Zeile 1 = Hauptname (Stelle), Zeile 2 = kurz worum es geht.
 * Ohne Organisation: Zeile 1 = Falltitel, Zeile 2 = Betreff/Kurzfassung wenn vorhanden und nicht redundant.
 */
export function getCaseListPrimaryAndTopic(
  caseItem: CaseOverview,
  brief: CaseBrief | null,
  unknownOrganization: string
): { primary: string; topic: string | null } {
  const org = caseItem.organization?.trim() || null;
  const title = (caseItem.title ?? "").trim();
  const subject = caseItem.latestDocumentSubject?.trim() || null;
  const summaryShort = brief?.summary_short?.trim() || null;

  if (org) {
    const primary = org;
    const candidates: (string | null)[] = [
      subject,
      summaryShort,
      title && !normEq(title, org) ? title : null
    ];
    const raw = candidates.find((c) => c && c.length > 0) ?? null;
    let topic = raw ? truncate(raw, MAX_TOPIC) : null;
    if (topic && normEq(topic, primary)) {
      topic = null;
    }
    return { primary, topic };
  }

  const primary = title || unknownOrganization;
  const candidates: (string | null)[] = [
    subject && !normEq(subject, primary) ? subject : null,
    summaryShort && !normEq(summaryShort, primary) ? summaryShort : null
  ];
  const raw = candidates.find((c) => c && c.length > 0) ?? null;
  let topic = raw ? truncate(raw, MAX_TOPIC) : null;
  if (topic && normEq(topic, primary)) {
    topic = null;
  }
  return { primary, topic };
}
