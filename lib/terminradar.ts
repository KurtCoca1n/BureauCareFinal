import type { Route } from "next";

import {
  computeTrafficLightFromDeadline,
  computeTrafficLightForTask,
  type TrafficLightLevel
} from "@/lib/traffic-light-priority";
import type { DocumentAnalysisRecord, DocumentRecord, TaskRecord } from "@/lib/types";

export type TerminradarItemKind = "task_deadline" | "document_deadline";

export type TerminradarItem = {
  id: string;
  kind: TerminradarItemKind;
  title: string;
  dueDateIso: string; // YYYY-MM-DD
  href: Route | null;
  level: TrafficLightLevel;
};

function taskHref(task: TaskRecord): Route | null {
  if (!task.document_id) return null;
  return `/app/documents/${task.document_id}#next-steps` as Route;
}

function documentHref(document: DocumentRecord): Route {
  return `/app/documents/${document.id}` as Route;
}

function safeTitle(value: string | null | undefined): string | null {
  const t = typeof value === "string" ? value.trim() : "";
  return t.length ? t : null;
}

export function buildTerminradarItems(args: {
  tasks: TaskRecord[];
  documents: DocumentRecord[];
  analysesByDocumentId: Map<string, DocumentAnalysisRecord>;
  limit?: number;
  reference?: Date;
}): TerminradarItem[] {
  const reference = args.reference ?? new Date();
  const limit = Math.max(2, Math.min(args.limit ?? 4, 4));

  const items: TerminradarItem[] = [];

  for (const task of args.tasks) {
    if (task.status === "done") continue;
    if (!task.due_date) continue;
    const traffic = computeTrafficLightForTask(task, reference);
    items.push({
      id: `task:${task.id}`,
      kind: "task_deadline",
      title: task.title,
      dueDateIso: task.due_date,
      href: taskHref(task),
      level: traffic.level
    });
  }

  for (const document of args.documents) {
    if (document.status === "erledigt" || document.status === "gesendet") continue;
    const analysis = args.analysesByDocumentId.get(document.id);
    if (!analysis?.deadline_date) continue;

    const title =
      safeTitle(analysis.required_action) ??
      safeTitle(analysis.subject) ??
      safeTitle(document.subject) ??
      safeTitle(document.original_filename) ??
      "Dokument-Frist";

    items.push({
      id: `doc:${document.id}`,
      kind: "document_deadline",
      title,
      dueDateIso: analysis.deadline_date,
      href: documentHref(document),
      level: computeTrafficLightFromDeadline(analysis.deadline_date, reference)
    });
  }

  const levelRank: Record<TrafficLightLevel, number> = { high: 0, medium: 1, low: 2 };

  items.sort((a, b) => {
    const prio = levelRank[a.level] - levelRank[b.level];
    if (prio !== 0) return prio;
    if (a.dueDateIso !== b.dueDateIso) return a.dueDateIso < b.dueDateIso ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  return items.slice(0, limit);
}

