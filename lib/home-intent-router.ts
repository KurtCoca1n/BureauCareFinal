/**
 * Keyword-basiertes Routing für die Home-Suche (keine externe KI).
 * Reihenfolge: spezifischere Regeln zuerst — erste Treffer gewinnt.
 */

export type HomeIntentResult = {
  href: string;
  /** Kurzbeschreibung für UI */
  labelDe: string;
  labelEn: string;
};

/** Schnellvorschläge (immer verfügbar, zusätzlich zur dynamischen Filterung). */
export type HomeQuickSuggestion = {
  id: string;
  href: string;
  labelDe: string;
  labelEn: string;
  /** Suchbegriffe für Filterung während der Eingabe */
  matchDe: string[];
  matchEn: string[];
};

export const HOME_QUICK_SUGGESTIONS: HomeQuickSuggestion[] = [
  {
    id: "upload",
    href: "/app/upload",
    labelDe: "Dokument hochladen",
    labelEn: "Upload a document",
    matchDe: ["dokument", "hochladen", "brief", "scan", "foto", "upload"],
    matchEn: ["document", "upload", "letter", "scan", "photo"]
  },
  {
    id: "contract-cancel",
    href: "/app/upload",
    labelDe: "Vertrag kündigen",
    labelEn: "Cancel a contract",
    matchDe: ["kündigen", "kuendigen", "vertrag", "kündigung", "kuendigung", "aufheben"],
    matchEn: ["cancel", "terminate", "contract", "notice"]
  },
  {
    id: "processes",
    href: "/app/processes",
    labelDe: "Anträge & Vorgänge",
    labelEn: "Applications & processes",
    matchDe: ["antrag", "vorgang", "behörde", "beantragen", "amt", "bürgergeld", "buergergeld"],
    matchEn: ["apply", "application", "process", "authority", "benefit"]
  },
  {
    id: "cases",
    href: "/app/cases",
    labelDe: "Fall öffnen",
    labelEn: "Open a case",
    matchDe: ["fall", "fälle", "faelle", "akte", "vorgang", "öffnen", "oeffnen"],
    matchEn: ["case", "cases", "file", "open"]
  },
  {
    id: "tasks",
    href: "/app/tasks",
    labelDe: "Aufgaben",
    labelEn: "Tasks",
    matchDe: ["aufgabe", "aufgaben", "todo", "erledigen"],
    matchEn: ["task", "tasks", "todo"]
  },
  {
    id: "welcome",
    href: "/app/welcome",
    labelDe: "Einstieg & Hilfe",
    labelEn: "Welcome & help",
    matchDe: ["hilfe", "start", "einstieg", "anleitung"],
    matchEn: ["help", "start", "guide", "welcome"]
  }
];

export function normalizeHomeQuery(raw: string): string {
  return raw
    .toLowerCase()
    .trim()
    .replace(/ä/g, "ae")
    .replace(/ö/g, "oe")
    .replace(/ü/g, "ue")
    .replace(/ß/g, "ss");
}

type Rule = {
  test: (n: string) => boolean;
  result: HomeIntentResult;
};

const RULES: Rule[] = [
  {
    test: (n) =>
      n.includes("kuendig") ||
      n.includes("cancel contract") ||
      n.includes("terminate") ||
      (n.includes("vertrag") && (n.includes("beenden") || n.includes("aufloesen") || n.includes("aufloes"))) ||
      n.includes("contract cancel"),
    result: {
      href: "/app/upload",
      labelDe: "Vertrag / Kündigung — Dokument hochladen",
      labelEn: "Contract / termination — upload your document"
    }
  },
  {
    test: (n) =>
      n.includes("brief") ||
      n.includes("dokument") ||
      n.includes("hochlad") ||
      n.includes("upload") ||
      n.includes("scan") ||
      n.includes("foto") ||
      n.includes("pdf") ||
      n.includes("letter") ||
      (n.includes("bekommen") && n.includes("brief")),
    result: {
      href: "/app/upload",
      labelDe: "Dokument hochladen",
      labelEn: "Upload a document"
    }
  },
  {
    test: (n) =>
      n.includes("steuer") ||
      n.includes("finanzamt") ||
      n.includes("steuererklaer") ||
      n.includes("tax return") ||
      n.includes("tax office") ||
      (n.includes("bescheid") && (n.includes("finanz") || n.includes("steuer"))),
    result: {
      href: "/app/processes/steuererklaerung",
      labelDe: "Steuererklärung vorbereiten",
      labelEn: "Prepare a tax return"
    }
  },
  {
    test: (n) => n.includes("buergergeld") || n.includes("grundsicherung") || (n.includes("jobcenter") && n.includes("geld")),
    result: {
      href: "/app/processes/buergergeld",
      labelDe: "Bürgergeld beantragen",
      labelEn: "Apply for basic income support"
    }
  },
  {
    test: (n) => n.includes("wohngeld") || (n.includes("miet") && n.includes("beantrag")),
    result: {
      href: "/app/processes/wohngeld",
      labelDe: "Wohngeld beantragen",
      labelEn: "Apply for housing benefit"
    }
  },
  {
    test: (n) => n.includes("kindergeld"),
    result: {
      href: "/app/processes/kindergeld",
      labelDe: "Kindergeld beantragen",
      labelEn: "Apply for child benefit"
    }
  },
  {
    test: (n) => n.includes("arbeitslos") || n.includes("unemployed") || n.includes("alg"),
    result: {
      href: "/app/processes/arbeitslosmeldung",
      labelDe: "Arbeitslos melden",
      labelEn: "Register as unemployed"
    }
  },
  {
    test: (n) =>
      n.includes("ummeld") ||
      (n.includes("anmeldung") && n.includes("adresse")) ||
      n.includes("change of address"),
    result: {
      href: "/app/processes/ummeldung",
      labelDe: "Ummelden",
      labelEn: "Change your address registration"
    }
  },
  {
    test: (n) => n.includes("visum") || n.includes("aufenthalt") || n.includes("visa") || n.includes("residence permit"),
    result: {
      href: "/app/processes/visum",
      labelDe: "Visum oder Aufenthalt beantragen",
      labelEn: "Apply for a visa or residence permit"
    }
  },
  {
    test: (n) => n.includes("krankenkasse") || (n.includes("kranken") && n.includes("wechsel")),
    result: {
      href: "/app/processes/krankenkasse-wechsel",
      labelDe: "Krankenkasse wechseln",
      labelEn: "Switch health insurance"
    }
  },
  {
    test: (n) => n.includes("bafoeg") || n.includes("bafög") || (n.includes("studium") && n.includes("foerder")),
    result: {
      href: "/app/processes/bafoeg-antrag",
      labelDe: "BAföG beantragen",
      labelEn: "Apply for student aid"
    }
  },
  {
    test: (n) => n.includes("gewerbe") || (n.includes("selbststaendig") && n.includes("anmeld")),
    result: {
      href: "/app/processes/gewerbe",
      labelDe: "Gewerbe anmelden",
      labelEn: "Register a business"
    }
  },
  {
    test: (n) =>
      /\bfall\b/.test(n) ||
      n.includes("faelle") ||
      n.includes("meine faelle") ||
      n.includes("cases") ||
      (n.includes("case") && !n.includes("showcase")),
    result: {
      href: "/app/cases",
      labelDe: "Fälle öffnen",
      labelEn: "Open cases"
    }
  },
  {
    test: (n) => n.includes("aufgabe") || n.includes("task") || n.includes("todo"),
    result: {
      href: "/app/tasks",
      labelDe: "Aufgaben",
      labelEn: "Tasks"
    }
  },
  {
    test: (n) =>
      n.includes("beantrag") ||
      n.includes("antrag stellen") ||
      n.includes("antrag ") ||
      n.endsWith("antrag") ||
      (n.includes("apply") && (n.includes("benefit") || n.includes("support"))),
    result: {
      href: "/app/processes",
      labelDe: "Anträge & Vorgänge",
      labelEn: "Applications & processes"
    }
  },
  {
    test: (n) => n.includes("erstattung") || n.includes("refund") || n.includes("geld zurueck") || n.includes("money back"),
    result: {
      href: "/app/refunds",
      labelDe: "Erstattungen & Geld zurück",
      labelEn: "Refunds"
    }
  },
  {
    test: (n) => n.includes("hilfe") || n.includes("help me") || n.includes("how to"),
    result: {
      href: "/app/welcome",
      labelDe: "Einstieg & Hilfe",
      labelEn: "Welcome & help"
    }
  },
  {
    test: (n) => n.includes("einstellung") || n.includes("settings") || n.includes("konto"),
    result: {
      href: "/app/settings",
      labelDe: "Einstellungen",
      labelEn: "Settings"
    }
  },
  {
    test: (n) => n.includes("meine daten") || n.includes("my data") || n.includes("persoenliche daten"),
    result: {
      href: "/app/my-data",
      labelDe: "Meine Daten",
      labelEn: "My data"
    }
  }
];

export function matchHomeIntent(rawQuery: string): HomeIntentResult | null {
  const q = rawQuery.trim();
  if (!q) return null;
  const n = normalizeHomeQuery(q);
  for (const rule of RULES) {
    if (rule.test(n)) {
      return rule.result;
    }
  }
  return null;
}

export function filterQuickSuggestions(query: string, lang: "de" | "en"): HomeQuickSuggestion[] {
  const n = normalizeHomeQuery(query);
  if (!n) {
    return HOME_QUICK_SUGGESTIONS;
  }
  const filtered = HOME_QUICK_SUGGESTIONS.filter((s) => {
    const pool = lang === "de" ? [...s.matchDe, s.labelDe.toLowerCase()] : [...s.matchEn, s.labelEn.toLowerCase()];
    return pool.some((k) => k.includes(n) || n.includes(k) || normalizeHomeQuery(k).includes(n));
  });
  return filtered.length ? filtered : HOME_QUICK_SUGGESTIONS;
}

export function labelForIntent(result: HomeIntentResult, lang: "de" | "en"): string {
  return lang === "de" ? result.labelDe : result.labelEn;
}
