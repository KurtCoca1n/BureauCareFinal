export type WeeklyOverviewItemType = "task" | "deadline" | "appointment";

export type WeeklyOverviewPriority = "low" | "medium" | "high";

export type WeeklyOverviewItem = {
  id: string;
  title: string;
  type: WeeklyOverviewItemType;
  priority: WeeklyOverviewPriority;
  dueDate?: string;
  suggested?: boolean;
  completed: boolean;
  shortDescription?: string;
};

function addDays(base: Date, days: number): Date {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
}

function mondayOfWeek(reference: Date): Date {
  const d = new Date(reference);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  d.setHours(12, 0, 0, 0);
  return d;
}

function toIsoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** MVP: realistische Demo-Daten, Kalenderwoche relativ zu `reference` */
export function getWeeklyOverviewMockItems(reference = new Date()): WeeklyOverviewItem[] {
  const mon = mondayOfWeek(reference);
  const t = (offset: number) => toIsoDate(addDays(mon, offset));

  return [
    {
      id: "wo-steuer",
      title: "Steuer-ID einreichen",
      type: "deadline",
      priority: "high",
      dueDate: t(2),
      completed: false,
      shortDescription: "Nach Anmeldung beim Finanzamt – oft zeitnah erwartet."
    },
    {
      id: "wo-wohnsitz",
      title: "Wohnsitz anmelden",
      type: "task",
      priority: "medium",
      suggested: true,
      dueDate: t(4),
      completed: false,
      shortDescription: "Meldebescheinigung und Ausweis bereithalten."
    },
    {
      id: "wo-buergeramt",
      title: "Termin Bürgeramt",
      type: "appointment",
      priority: "medium",
      dueDate: t(3),
      completed: false,
      shortDescription: "14:30 Uhr – Unterlagen aus der Erinnerungsmail mitnehmen."
    },
    {
      id: "wo-kv",
      title: "Krankenversicherung prüfen",
      type: "task",
      priority: "medium",
      completed: false,
      shortDescription: "Status und Leistungsumfang in Ruhe durchgehen."
    },
    {
      id: "wo-upload",
      title: "Dokument in BureauCare hochladen",
      type: "task",
      priority: "low",
      suggested: true,
      dueDate: t(5),
      completed: false,
      shortDescription: "Einscan oder Foto – danach Einordnung und nächste Schritte."
    }
  ];
}

const priorityRank: Record<WeeklyOverviewPriority, number> = {
  high: 0,
  medium: 1,
  low: 2
};

const typeRank: Record<WeeklyOverviewItemType, number> = {
  deadline: 0,
  appointment: 1,
  task: 2
};

export function sortWeeklyOverviewItems(items: WeeklyOverviewItem[]): WeeklyOverviewItem[] {
  return [...items].sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    const p = priorityRank[a.priority] - priorityRank[b.priority];
    if (p !== 0) return p;
    const ty = typeRank[a.type] - typeRank[b.type];
    if (ty !== 0) return ty;
    const ta = a.dueDate ? new Date(`${a.dueDate}T12:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
    const tb = b.dueDate ? new Date(`${b.dueDate}T12:00:00`).getTime() : Number.MAX_SAFE_INTEGER;
    if (ta !== tb) return ta - tb;
    return a.title.localeCompare(b.title, "de");
  });
}

export type WeeklyOverviewStats = {
  openCount: number;
  doneCount: number;
  total: number;
  criticalDeadlineCount: number;
  appointmentsThisWeekCount: number;
};

function endOfWeekSunday(monday: Date): Date {
  return addDays(monday, 6);
}

export function computeWeeklyOverviewStats(items: WeeklyOverviewItem[], reference = new Date()): WeeklyOverviewStats {
  const mon = mondayOfWeek(reference);
  const sun = endOfWeekSunday(mon);
  const weekStart = mon.getTime();
  const weekEnd = sun.getTime();

  const total = items.length;
  const doneCount = items.filter((i) => i.completed).length;
  const openCount = total - doneCount;

  const criticalDeadlineCount = items.filter(
    (i) => !i.completed && i.type === "deadline" && i.priority === "high"
  ).length;

  const appointmentsThisWeekCount = items.filter((i) => {
    if (i.completed || i.type !== "appointment" || !i.dueDate) return false;
    const t = new Date(`${i.dueDate}T12:00:00`).getTime();
    return t >= weekStart && t <= weekEnd + 86400000;
  }).length;

  return {
    openCount,
    doneCount,
    total,
    criticalDeadlineCount,
    appointmentsThisWeekCount
  };
}

function startOfLocalDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

/** Kalendertage bis zum Fälligkeitsdatum (0 = heute). Negativ = zurückliegend. */
export function calendarDaysUntilDue(iso: string, reference = new Date()): number {
  const due = new Date(`${iso}T12:00:00`);
  const a = startOfLocalDay(reference).getTime();
  const b = startOfLocalDay(due).getTime();
  return Math.round((b - a) / 86400000);
}

/** „Heute“ / „Morgen“ / „In X Tagen“ oder lokales Kurzdatum bzw. bei Überfälligkeit Datum. */
export function formatWeeklyDuePhrase(iso: string | undefined, dateLocale: string, lang: "de" | "en", reference = new Date()): string {
  if (!iso) return "";
  const diff = calendarDaysUntilDue(iso, reference);
  if (diff === 0) return lang === "en" ? "Today" : "Heute";
  if (diff === 1) return lang === "en" ? "Tomorrow" : "Morgen";
  if (diff >= 2 && diff <= 6) return lang === "en" ? `In ${diff} days` : `In ${diff} Tagen`;
  if (diff < 0) {
    if (lang === "en") return `Overdue · ${formatWeeklyDate(iso, dateLocale)}`;
    return `Überfällig · ${formatWeeklyDate(iso, dateLocale)}`;
  }
  return formatWeeklyDate(iso, dateLocale);
}

export function getWeeklyOverviewMicrocopy(locale: "de" | "en", stats: WeeklyOverviewStats): string {
  const { openCount, doneCount, total, criticalDeadlineCount } = stats;
  const allDone = total > 0 && doneCount === total;

  if (allDone) {
    if (locale === "en") return "All done — you're on top of this week.";
    return "Alles erledigt – diese Woche bist du im Plan.";
  }
  if (criticalDeadlineCount >= 1) {
    if (locale === "en") return "A deadline deserves your attention soon.";
    return "Eine Frist braucht bald deine Aufmerksamkeit.";
  }
  if (openCount >= 4) {
    if (locale === "en") return "A few items are worth tackling this week.";
    return "Ein paar Punkte lohnen sich diese Woche – ruhig der Reihe nach.";
  }
  if (openCount <= 2 && criticalDeadlineCount === 0) {
    if (locale === "en") return "This week looks quite manageable.";
    return "Diese Woche wirkt gut machbar.";
  }
  if (locale === "en") return "You're on track — one step at a time.";
  return "Du bist gut unterwegs – Schritt für Schritt.";
}

export function weeklyOverviewLabels(locale: "de" | "en") {
  const en = {
    title: "Your week",
    subtitle: "Deadlines, appointments & tasks — sorted by urgency",
    summaryLine: (open: number, critical: number, appts: number) =>
      `${open} open · ${critical} critical · ${appts} appointment${appts === 1 ? "" : "s"}`,
    progress: (done: number, total: number) => `${done} of ${total} done`,
    openChip: (n: number) => `${n} open`,
    criticalChip: (n: number) => `${n} critical deadline${n === 1 ? "" : "s"}`,
    appointmentsChip: (n: number) => `${n} appointment${n === 1 ? "" : "s"} this week`,
    typeTask: "Task",
    typeDeadline: "Deadline",
    typeAppointment: "Appointment",
    suggested: "Suggested",
    priorityHigh: "High",
    priorityMedium: "Medium",
    priorityLow: "Low",
    due: "Due",
    markDone: "Done",
    undo: "Undo"
  };
  if (locale === "en") return en;
  return {
    title: "Deine Woche",
    subtitle: "Fristen, Termine & Aufgaben – nach Dringlichkeit sortiert",
    summaryLine: (open: number, critical: number, appts: number) =>
      `${open} offen · ${critical} kritisch · ${appts} Termin${appts === 1 ? "" : "e"}`,
    progress: (done: number, total: number) => `${done} von ${total} erledigt`,
    openChip: (n: number) => `${n} offen`,
    criticalChip: (n: number) => `${n} kritische Frist${n === 1 ? "" : "en"}`,
    appointmentsChip: (n: number) => `${n} Termin${n === 1 ? "" : "e"} diese Woche`,
    typeTask: "Aufgabe",
    typeDeadline: "Frist",
    typeAppointment: "Termin",
    suggested: "Empfohlen",
    priorityHigh: "Hoch",
    priorityMedium: "Mittel",
    priorityLow: "Niedrig",
    due: "Fällig",
    markDone: "Erledigt",
    undo: "Zurücknehmen"
  };
}

export function formatWeeklyDate(iso: string | undefined, dateLocale: string): string {
  if (!iso) return "";
  try {
    const d = new Date(`${iso}T12:00:00`);
    return d.toLocaleDateString(dateLocale, {
      weekday: "short",
      day: "numeric",
      month: "short"
    });
  } catch {
    return iso;
  }
}
