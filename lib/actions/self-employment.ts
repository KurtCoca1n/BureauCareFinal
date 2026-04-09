"use server";

import { revalidatePath } from "next/cache";

import { normalizePreferredLanguage } from "@/lib/languages";
import { createClient } from "@/lib/supabase/server";

type ActionState = { error: string; success: string; taskIds?: string[] };

function getString(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function addDaysYmd(base: Date, days: number) {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function isTruthy(v: string) {
  return v === "1" || v.toLowerCase() === "true" || v.toLowerCase() === "yes";
}

function buildStartTasks(input: {
  locale: string;
  area: string;
  sellsAlcohol: boolean;
  hiresEmployeesSoon: boolean;
}) {
  const de = input.locale === "de";
  const now = new Date();
  const dueSoon = addDaysYmd(now, 7);
  const dueLater = addDaysYmd(now, 14);

  const tasks: Array<{
    title: string;
    action_summary: string | null;
    importance_reason: string;
    action_mode: string | null;
    due_date: string | null;
  }> = [
    {
      title: de ? "Geschäftsidee kurz schärfen" : "Clarify your business idea",
      action_summary: de
        ? `Bereich: ${input.area}. Notiere Zielgruppe, Angebot, Preis und ersten Vertriebskanal (1 Seite).`
        : `Area: ${input.area}. Write down audience, offer, price and first sales channel (one page).`,
      importance_reason: de ? "Aus Selbstständigkeit-Flow abgeleitet." : "Derived from self-employment flow.",
      action_mode: "online",
      due_date: dueSoon
    },
    {
      title: de ? "Gewerbe / Tätigkeit einordnen" : "Classify your activity",
      action_summary: de
        ? "Prüfe, ob es ein Gewerbe, freier Beruf oder Sonderfall ist. (Nur grob – Details später.)"
        : "Check whether it's a trade, freelancer, or special case. (High-level only.)",
      importance_reason: de ? "Damit die nächsten Schritte passen." : "So the next steps match your case.",
      action_mode: "online",
      due_date: dueSoon
    },
    {
      title: de ? "Steuerliche Erfassung vorbereiten" : "Prepare tax registration",
      action_summary: de
        ? "Sammle die Daten, die du fürs Finanzamt brauchst (Adresse, Tätigkeit, Startdatum, Umsatz-Schätzung)."
        : "Gather info needed for tax office (address, activity, start date, revenue estimate).",
      importance_reason: de ? "Typischer Pflichtschritt am Anfang." : "Typical required step early on.",
      action_mode: "online",
      due_date: dueLater
    },
    {
      title: de ? "Versicherungen kurz prüfen" : "Quick insurance check",
      action_summary: de
        ? "Checke Krankenversicherung + Haftpflicht; optional Berufshaftpflicht je nach Tätigkeit."
        : "Check health insurance + liability; consider professional liability depending on work.",
      importance_reason: de ? "Schützt dich vor teuren Lücken." : "Avoids costly gaps.",
      action_mode: null,
      due_date: dueLater
    }
  ];

  if (input.sellsAlcohol) {
    tasks.splice(2, 0, {
      title: de ? "Erlaubnisse prüfen (Alkohol)" : "Check permits (alcohol)",
      action_summary: de
        ? "Wenn du Alkohol verkaufst/ausgibst: kläre früh, ob eine Erlaubnis nötig ist (Ort & Art)."
        : "If you sell/serve alcohol: check early whether you need a permit (location & type).",
      importance_reason: de ? "Nur relevant bei Alkoholverkauf." : "Only relevant if alcohol is involved.",
      action_mode: null,
      due_date: dueSoon
    });
  }

  if (input.hiresEmployeesSoon) {
    tasks.push({
      title: de ? "Wenn du Mitarbeitende planst: Basics vorbereiten" : "If hiring: prepare the basics",
      action_summary: de
        ? "Kurz klären: Vertragsvorlage, Lohnabrechnung, Unfallversicherung/Anmeldung (nur als Checkliste)."
        : "Decide: contract template, payroll, accident insurance/registration (checklist only).",
      importance_reason: de ? "Damit du später nicht hektisch wirst." : "So you don't scramble later.",
      action_mode: null,
      due_date: addDaysYmd(now, 21)
    });
  }

  return tasks;
}

function buildImproveTasks(locale: string) {
  const de = locale === "de";
  const now = new Date();
  const dueSoon = addDaysYmd(now, 7);
  const dueLater = addDaysYmd(now, 14);

  return [
    {
      title: de ? "Einnahmen & Ausgaben einmal grob prüfen" : "Quick check: income & expenses",
      action_summary: de
        ? "Mach einen 20-Minuten-Check: Was kommt rein, was geht raus, welche Fixkosten sind neu?"
        : "20-minute check: what's coming in, what's going out, what fixed costs changed?",
      importance_reason: de ? "Kleine Klarheit = große Ruhe." : "Small clarity reduces stress.",
      action_mode: null,
      due_date: dueSoon
    },
    {
      title: de ? "Dokumente/Belege-System vereinfachen" : "Simplify your receipts system",
      action_summary: de
        ? "Lege einen festen Ort/Workflow für Rechnungen/Belege fest (Ordner + 1 Routine pro Woche)."
        : "Set a single place/workflow for invoices & receipts (folder + weekly routine).",
      importance_reason: de ? "Spart Zeit bei Steuern & Rückfragen." : "Saves time for taxes and requests.",
      action_mode: "online",
      due_date: dueLater
    },
    {
      title: de ? "Versicherungen: einmal updaten" : "Update insurances once",
      action_summary: de
        ? "Prüfe, ob Haftpflicht/Berufshaftpflicht noch passt (Leistungen, Deckung, neue Risiken)."
        : "Check if liability/professional liability still fits (coverage, risks).",
      importance_reason: de ? "Änderungen passieren schleichend." : "Things change over time.",
      action_mode: null,
      due_date: dueLater
    }
  ];
}

async function getAuthenticatedUser() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function createSelfEmploymentStartTasksAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const area = getString(formData, "area");
  const locale = normalizePreferredLanguage(getString(formData, "locale") || "de");
  const sellsAlcohol = isTruthy(getString(formData, "sellsAlcohol"));
  const hiresEmployeesSoon = isTruthy(getString(formData, "hiresEmployeesSoon"));

  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return { error: locale === "de" ? "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an." : "Your session expired. Please sign in again.", success: "" };
  }

  if (!area) {
    return { error: locale === "de" ? "Bitte wähle einen Bereich aus." : "Please choose an area.", success: "" };
  }

  const tasks = buildStartTasks({ locale, area, sellsAlcohol, hiresEmployeesSoon });
  const inserts = tasks.map((t) => ({
    user_id: user.id,
    title: t.title,
    action_summary: t.action_summary,
    importance_reason: t.importance_reason,
    action_mode: t.action_mode,
    due_date: t.due_date,
    status: "open"
  }));

  const { data, error } = await supabase.from("tasks").insert(inserts).select("id");
  if (error) {
    return { error: locale === "de" ? "Die Aufgaben konnten gerade nicht erstellt werden." : "Tasks could not be created right now.", success: "" };
  }

  revalidatePath("/app");
  revalidatePath("/app/tasks");

  return {
    error: "",
    success: locale === "de" ? "Deine Aufgaben sind erstellt. Du findest sie in „Deine Woche“ und unter Aufgaben." : "Your tasks were created. You’ll see them in “Your week” and under tasks.",
    taskIds: (data as Array<{ id: string }> | null)?.map((r) => r.id) ?? []
  };
}

export async function createSelfEmploymentImproveTasksAction(_: ActionState, formData: FormData): Promise<ActionState> {
  const locale = normalizePreferredLanguage(getString(formData, "locale") || "de");
  const { supabase, user } = await getAuthenticatedUser();
  if (!user) {
    return { error: locale === "de" ? "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an." : "Your session expired. Please sign in again.", success: "" };
  }

  const tasks = buildImproveTasks(locale);
  const inserts = tasks.map((t) => ({
    user_id: user.id,
    title: t.title,
    action_summary: t.action_summary,
    importance_reason: locale === "de" ? "Aus Selbstständigkeit-Flow abgeleitet." : "Derived from self-employment flow.",
    action_mode: t.action_mode,
    due_date: t.due_date,
    status: "open"
  }));

  const { data, error } = await supabase.from("tasks").insert(inserts).select("id");
  if (error) {
    return { error: locale === "de" ? "Die Aufgaben konnten gerade nicht erstellt werden." : "Tasks could not be created right now.", success: "" };
  }

  revalidatePath("/app");
  revalidatePath("/app/tasks");

  return {
    error: "",
    success: locale === "de" ? "Deine Aufgaben sind erstellt. Du findest sie in „Deine Woche“ und unter Aufgaben." : "Your tasks were created. You’ll see them in “Your week” and under tasks.",
    taskIds: (data as Array<{ id: string }> | null)?.map((r) => r.id) ?? []
  };
}

