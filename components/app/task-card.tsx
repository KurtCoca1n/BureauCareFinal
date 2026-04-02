import Link from "next/link";
import { ArrowUpRight, CheckCircle2, Clock3, MapPin, MousePointerClick } from "lucide-react";
import type { Route } from "next";

import { TaskCompleteForm } from "@/components/app/task-complete-form";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { getCopy, getDateLocale, getReminderCopy } from "@/lib/i18n";
import type { TaskRecord } from "@/lib/types";

function getTaskHref(task: TaskRecord) {
  if (!task.document_id) {
    return null;
  }

  return `/app/documents/${task.document_id}#next-steps` as Route;
}

export function TaskCard({ task, compact = false, locale = "de" }: { task: TaskRecord; compact?: boolean; locale?: string }) {
  const href = getTaskHref(task);
  const copy = getCopy(locale);
  const reminderCopy = getReminderCopy(locale);
  const mapsHref = task.action_location_address
    ? (`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.action_location_address)}` as const)
    : null;
  const routeHref = task.action_location_address
    ? (`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.action_location_address)}` as const)
    : task.action_location_name
      ? (`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.action_location_name)}` as const)
      : null;
  const modeLabel =
    task.action_mode === "online"
      ? copy.actionMode.online
      : task.action_mode === "vor_ort"
        ? copy.actionMode.onSite
        : task.action_mode === "per_post"
          ? copy.actionMode.byPost
          : task.action_mode === "telefon"
            ? copy.actionMode.byPhone
            : null;
  const dueDateValue = task.due_date ? Date.parse(`${task.due_date}T00:00:00Z`) : null;
  const todayValue = Date.parse(`${new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Berlin" }).format(new Date())}T00:00:00Z`);
  const diffDays = dueDateValue === null ? null : Math.round((dueDateValue - todayValue) / (24 * 60 * 60 * 1000));
  const dueTone = task.status === "done" ? "success" : diffDays !== null && diffDays <= 3 ? "warning" : "neutral";
  const dueLabel =
    diffDays === null
      ? null
      : diffDays < 0
        ? reminderCopy.overdue
        : diffDays === 0
          ? reminderCopy.dueToday
          : diffDays <= 3
            ? reminderCopy.dueSoon
            : null;

  return (
    <Card className="flex h-full flex-col space-y-4 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
            {task.status === "done" ? <CheckCircle2 className="h-4 w-4" /> : <Clock3 className="h-4 w-4" />}
          </div>
          <div className="min-w-0 space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge tone={task.status === "done" ? "success" : "accent"}>
                {task.status === "done" ? copy.common.statusDone : copy.common.statusOpen}
              </StatusBadge>
              {task.due_date ? (
                <StatusBadge tone={dueTone}>
                  {copy.common.deadline}{" "}
                  {new Date(task.due_date).toLocaleDateString(getDateLocale(locale as never))}
                </StatusBadge>
              ) : null}
              {dueLabel ? <StatusBadge tone={dueTone}>{dueLabel}</StatusBadge> : null}
            </div>
            <div>
              <p className="text-base font-semibold leading-6">{task.title}</p>
              {task.document_sender ? <p className="truncate text-sm text-[var(--muted)]">{task.document_sender}</p> : null}
            </div>
          </div>
        </div>
        {href ? <ArrowUpRight className="mt-1 h-4 w-4 shrink-0 text-[var(--muted)]" /> : null}
      </div>

      {!compact ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {task.document_subject ? (
            <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.tasks.topic}</p>
              <p className="mt-2 text-sm font-medium leading-6">{task.document_subject}</p>
            </div>
          ) : null}

          {task.action_summary ? (
            <div className="rounded-[20px] border border-[var(--line)] bg-white p-4">
              <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{copy.tasks.whatToDo}</p>
              <p className="mt-2 text-sm font-medium leading-6">{task.action_summary}</p>
            </div>
          ) : null}
        </div>
      ) : null}

      {task.importance_reason ? <p className="text-sm leading-6 text-[var(--muted)]">{task.importance_reason}</p> : null}

      {!compact && (modeLabel || task.action_location_name || task.action_url) ? (
        <div className="flex flex-wrap gap-2">
          {modeLabel ? <StatusBadge tone="neutral">{modeLabel}</StatusBadge> : null}
          {task.action_location_name ? (
            <StatusBadge tone="neutral">
              <MapPin className="mr-1 h-3 w-3" />
              {task.action_location_name}
            </StatusBadge>
          ) : null}
          {task.action_url ? (
            <StatusBadge tone="accent">
              <MousePointerClick className="mr-1 h-3 w-3" />
              {copy.tasks.openOfficialLink}
            </StatusBadge>
          ) : null}
        </div>
      ) : null}

      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-col gap-2">
          {href ? (
            <Link href={href} className="text-sm font-medium text-[var(--accent)]">
              {copy.tasks.toDocument}
            </Link>
          ) : (
            <span className="text-sm text-[var(--muted)]">{copy.tasks.noLinkedDocument}</span>
          )}
          {!compact && (routeHref || mapsHref) ? (
            <a href={routeHref ?? mapsHref ?? "#"} target="_blank" rel="noreferrer" className="text-sm font-medium text-[var(--petrol)]">
              {task.action_mode === "vor_ort"
                ? "Route zur Stelle"
                : task.action_mode === "per_post"
                  ? "Route zur Postadresse"
                  : "Ort öffnen"}
            </a>
          ) : null}
        </div>

        {task.status !== "done" ? (
          <TaskCompleteForm taskId={task.id} savingLabel={copy.common.saveInProgress} doneLabel={copy.tasks.markDone} />
        ) : null}
      </div>
    </Card>
  );
}
