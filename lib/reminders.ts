import type { TaskRecord } from "@/lib/types";

export type ReminderBuckets = {
  overdue: TaskRecord[];
  today: TaskRecord[];
  soon: TaskRecord[];
  open: TaskRecord[];
  done: TaskRecord[];
};

const ONE_DAY = 24 * 60 * 60 * 1000;

function getBerlinTodayIso() {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Berlin",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return formatter.format(new Date());
}

function toUtcDay(value: string) {
  return Date.parse(`${value}T00:00:00Z`);
}

function byDueDate(a: TaskRecord, b: TaskRecord) {
  if (!a.due_date && !b.due_date) {
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  }

  if (!a.due_date) {
    return 1;
  }

  if (!b.due_date) {
    return -1;
  }

  return toUtcDay(a.due_date) - toUtcDay(b.due_date);
}

export function groupTasksByReminder(tasks: TaskRecord[]): ReminderBuckets {
  const todayIso = getBerlinTodayIso();
  const todayValue = toUtcDay(todayIso);

  const buckets: ReminderBuckets = {
    overdue: [],
    today: [],
    soon: [],
    open: [],
    done: []
  };

  for (const task of tasks) {
    if (task.status === "done") {
      buckets.done.push(task);
      continue;
    }

    if (!task.due_date) {
      buckets.open.push(task);
      continue;
    }

    const dueValue = toUtcDay(task.due_date);
    const diffDays = Math.round((dueValue - todayValue) / ONE_DAY);

    if (diffDays < 0) {
      buckets.overdue.push(task);
      continue;
    }

    if (diffDays === 0) {
      buckets.today.push(task);
      continue;
    }

    if (diffDays <= 3) {
      buckets.soon.push(task);
      continue;
    }

    buckets.open.push(task);
  }

  return {
    overdue: buckets.overdue.sort(byDueDate),
    today: buckets.today.sort(byDueDate),
    soon: buckets.soon.sort(byDueDate),
    open: buckets.open.sort(byDueDate),
    done: buckets.done.sort(byDueDate)
  };
}
