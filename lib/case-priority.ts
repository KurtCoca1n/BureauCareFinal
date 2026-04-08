import type { CaseOverview } from "@/lib/queries";

/** Visuelle Priorität für Kennzeichnung (ohne neue DB-Felder). */
export type CaseAttentionLevel = "high" | "soon" | "open" | "done";

export function getCaseAttentionLevel(caseItem: CaseOverview): CaseAttentionLevel {
  if (caseItem.status === "done") {
    return "done";
  }
  if (caseItem.status === "in_progress" || caseItem.openTasksCount > 0) {
    return "high";
  }
  if (caseItem.status === "waiting") {
    return "soon";
  }
  return "open";
}

export type CasesListFilter = "all" | "open" | "important" | "done";

export function caseMatchesCasesFilter(caseItem: CaseOverview, filter: CasesListFilter): boolean {
  if (filter === "all") {
    return true;
  }
  if (filter === "done") {
    return caseItem.status === "done";
  }
  if (filter === "open") {
    return caseItem.status !== "done";
  }
  if (filter === "important") {
    return (
      caseItem.status === "in_progress" ||
      caseItem.openTasksCount > 0 ||
      caseItem.status === "waiting"
    );
  }
  return true;
}
