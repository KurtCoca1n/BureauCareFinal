import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import { getBerlinWohngeldWizardDefinition } from "@/lib/official-forms/berlin-wohngeld";
import type { ProcessProcedure } from "@/lib/processes-ui";

export type LocalizedText = Partial<Record<SupportedLanguage, string>>;

export type ProcessWizardValue = string | number | boolean | null;
export type ProcessWizardAnswers = Record<string, ProcessWizardValue>;

export type ProcessWizardOption = {
  value: string;
  label: LocalizedText;
};

export type ProcessWizardField = {
  id: string;
  type: "text" | "textarea" | "date" | "number" | "currency" | "select" | "radio";
  label: LocalizedText;
  description?: LocalizedText;
  placeholder?: LocalizedText;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: ProcessWizardOption[];
};

export type ProcessWizardStep = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  fields?: ProcessWizardField[];
  summary?: boolean;
};

export type ProcessWizardDefinition = {
  procedureId: string;
  intro: LocalizedText;
  nextStepHint: LocalizedText;
  steps: ProcessWizardStep[];
};

type ProcessWizardCopy = {
  progressLabel: string;
  savedLabel: string;
  savingLabel: string;
  localSaveLabel: string;
  saveErrorLabel: string;
  previousLabel: string;
  nextLabel: string;
  finishLabel: string;
  jumpLabel: string;
  summaryTitle: string;
  summaryText: string;
  summaryEmpty: string;
  requiredError: string;
  startBackLabel: string;
};

const baseCopy = {
  progressLabel: "Schritt",
  savedLabel: "Gespeichert",
  savingLabel: "Speichert ...",
  localSaveLabel: "Lokal gespeichert",
  saveErrorLabel: "Speichern ist gerade nicht möglich",
  previousLabel: "Zurück",
  nextLabel: "Weiter",
  finishLabel: "Zum Ergebnis",
  jumpLabel: "Schritt öffnen",
  summaryTitle: "Deine bisherigen Angaben",
  summaryText: "So sieht dein aktueller Stand aus. Im nächsten Teil geht es damit weiter.",
  summaryEmpty: "Für diesen Schritt gibt es noch keine Angaben.",
  requiredError: "Bitte fülle zuerst die markierten Felder aus.",
  startBackLabel: "Zurück zum Vorgang"
} satisfies ProcessWizardCopy;

const copyMap: Partial<Record<SupportedLanguage, ProcessWizardCopy>> = {
  de: baseCopy,
  en: {
    progressLabel: "Step",
    savedLabel: "Saved",
    savingLabel: "Saving ...",
    localSaveLabel: "Saved on this device",
    saveErrorLabel: "Saving is not available right now",
    previousLabel: "Back",
    nextLabel: "Next",
    finishLabel: "Go to result",
    jumpLabel: "Open step",
    summaryTitle: "Your answers so far",
    summaryText: "This is your current progress. The next part continues from here.",
    summaryEmpty: "There are no answers for this step yet.",
    requiredError: "Please complete the highlighted fields first.",
    startBackLabel: "Back to process"
  },
  tr: baseCopy,
  uk: baseCopy,
  es: baseCopy
};

const fallbackWizardCopy = copyMap.en ?? copyMap.de!;

const yesNoOptions: ProcessWizardOption[] = [
  { value: "yes", label: { de: "Ja", en: "Yes" } },
  { value: "no", label: { de: "Nein", en: "No" } }
];

function t(locale: string | null | undefined, value: LocalizedText) {
  const normalized = normalizePreferredLanguage(locale);
  return value[normalized] ?? value.en ?? value.de ?? "";
}

function createGenericWizard(procedureId: string): ProcessWizardDefinition {
  return {
    procedureId,
    intro: {
      de: "Wir gehen das Schritt für Schritt mit dir durch.",
      en: "We will go through this step by step with you."
    },
    nextStepHint: {
      de: "Am Ende bekommst du eine ruhige Zusammenfassung.",
      en: "At the end you get a calm summary."
    },
    steps: [
      {
        id: "goal",
        title: { de: "Worum geht es?", en: "What is this about?" },
        description: {
          de: "Beschreibe kurz, was du erledigen möchtest.",
          en: "Briefly describe what you want to get done."
        },
        fields: [
          {
            id: "goal_text",
            type: "textarea",
            label: { de: "Dein Anliegen", en: "Your request" },
            placeholder: {
              de: "Zum Beispiel: Ich möchte diesen Antrag vorbereiten.",
              en: "For example: I want to prepare this application."
            },
            required: true
          }
        ]
      },
      {
        id: "situation",
        title: { de: "Deine Situation", en: "Your situation" },
        description: {
          de: "Nur die wichtigsten Infos für den Start.",
          en: "Only the most important details to get started."
        },
        fields: [
          {
            id: "situation_note",
            type: "textarea",
            label: { de: "Was ist bei dir wichtig?", en: "What is important in your case?" },
            placeholder: {
              de: "Zum Beispiel Familie, Arbeit, Wohnung oder Fristen",
              en: "For example family, work, housing or deadlines"
            }
          },
          {
            id: "has_documents_overview",
            type: "radio",
            label: { de: "Hast du schon erste Unterlagen?", en: "Do you already have some documents?" },
            options: yesNoOptions,
            required: true
          }
        ]
      },
      {
        id: "summary",
        title: { de: "Zusammenfassung", en: "Summary" },
        description: {
          de: "Damit ist dein Start vorbereitet.",
          en: "This prepares your start."
        },
        summary: true
      }
    ]
  };
}

const wohnngeldWizard: ProcessWizardDefinition = getBerlinWohngeldWizardDefinition();
const buergergeldWizard: ProcessWizardDefinition = {
  procedureId: "buergergeld",
  intro: {
    de: "Wir bereiten die wichtigsten Angaben fuer einen ersten Buergergeld-Antrag in ruhigen Schritten vor.",
    en: "We prepare the most important details for a first basic income support application in calm steps."
  },
  nextStepHint: {
    de: "Bekannte Angaben kannst du uebernehmen und bei Bedarf direkt aktualisieren.",
    en: "You can reuse known details and update them right away if needed."
  },
  steps: [
    {
      id: "applicant",
      title: { de: "Angaben zu dir", en: "About you" },
      description: {
        de: "Hier geht es um deine persoenlichen Daten und wie wir dich erreichen koennen.",
        en: "This step is about your personal details and how you can be reached."
      },
      fields: [
        { id: "applicant_first_names", type: "text", label: { de: "Vorname(n)", en: "First name(s)" }, required: true },
        { id: "applicant_last_name", type: "text", label: { de: "Nachname", en: "Last name" }, required: true },
        { id: "applicant_birth_date", type: "date", label: { de: "Geburtsdatum", en: "Date of birth" }, required: true },
        {
          id: "family_status",
          type: "select",
          label: { de: "Familienstand", en: "Family status" },
          required: true,
          options: [
            { value: "single", label: { de: "Ledig", en: "Single" } },
            { value: "married", label: { de: "Verheiratet", en: "Married" } },
            { value: "separated", label: { de: "Getrennt", en: "Separated" } },
            { value: "divorced", label: { de: "Geschieden", en: "Divorced" } },
            { value: "widowed", label: { de: "Verwitwet", en: "Widowed" } }
          ]
        },
        { id: "applicant_phone", type: "text", label: { de: "Telefonnummer", en: "Phone number" } },
        { id: "applicant_email", type: "text", label: { de: "E-Mail", en: "Email" } }
      ]
    },
    {
      id: "home",
      title: { de: "Wohnen und Haushalt", en: "Housing and household" },
      description: {
        de: "Diese Angaben helfen spaeter bei Miete, Bedarf und Personen im Haushalt.",
        en: "These details help later with rent, needs and people in the household."
      },
      fields: [
        { id: "housing_street", type: "text", label: { de: "Strasse", en: "Street" }, required: true },
        { id: "housing_house_number", type: "text", label: { de: "Hausnummer", en: "House number" }, required: true },
        { id: "housing_postal_code", type: "text", label: { de: "Postleitzahl", en: "Postal code" }, required: true },
        { id: "housing_city", type: "text", label: { de: "Ort", en: "City" }, required: true },
        {
          id: "tenant_role",
          type: "radio",
          label: { de: "Wie wohnst du dort?", en: "What is your housing situation?" },
          required: true,
          options: [
            { value: "main_tenant", label: { de: "Ich zahle selbst Miete", en: "I pay rent myself" } },
            { value: "subtenant", label: { de: "Ich wohne zur Untermiete oder mit", en: "I sublet or live with others" } }
          ]
        },
        {
          id: "household_size",
          type: "number",
          label: { de: "Wie viele Personen leben im Haushalt?", en: "How many people live in the household?" },
          min: 1,
          step: 1,
          required: true
        },
        {
          id: "monthly_rent",
          type: "currency",
          label: { de: "Monatliche Miete", en: "Monthly rent" },
          required: true
        }
      ]
    },
    {
      id: "income-and-payment",
      title: { de: "Arbeit und Einkommen", en: "Work and income" },
      description: {
        de: "Hier geht es um deine aktuelle Arbeitssituation und dein ungefaehres Einkommen.",
        en: "This step covers your current work situation and approximate income."
      },
      fields: [
        {
          id: "employment_status",
          type: "select",
          label: { de: "Berufliche Situation", en: "Work situation" },
          required: true,
          options: [
            { value: "employee", label: { de: "Arbeitnehmer:in", en: "Employee" } },
            { value: "self_employed", label: { de: "Selbststaendig", en: "Self-employed" } },
            { value: "student", label: { de: "Ausbildung oder Studium", en: "Training or studies" } },
            { value: "unemployed", label: { de: "Arbeitslos", en: "Unemployed" } },
            { value: "retired", label: { de: "Rente", en: "Retired" } },
            { value: "other", label: { de: "Etwas anderes", en: "Something else" } }
          ]
        },
        {
          id: "primary_income_amount",
          type: "currency",
          label: { de: "Monatliches Einkommen ungefaehr", en: "Approximate monthly income" }
        },
        {
          id: "primary_income_type",
          type: "text",
          label: { de: "Woraus kommt dein Einkommen?", en: "What is your income from?" },
          placeholder: { de: "Zum Beispiel Gehalt, Minijob oder gar kein Einkommen", en: "For example salary, mini job or no income" }
        },
        {
          id: "has_bank_statements",
          type: "radio",
          label: { de: "Hast du aktuelle Kontoauszuege?", en: "Do you have current bank statements?" },
          required: true,
          options: yesNoOptions
        }
      ]
    },
    {
      id: "documents",
      title: { de: "Unterlagen", en: "Documents" },
      description: {
        de: "Zum Schluss pruefen wir nur kurz, was du schon hast und was noch fehlt.",
        en: "At the end we briefly check what you already have and what is still missing."
      },
      fields: [
        {
          id: "has_rental_contract",
          type: "radio",
          label: { de: "Hast du einen Mietvertrag oder Nachweis zu Wohnkosten?", en: "Do you have a rental contract or proof of housing costs?" },
          required: true,
          options: yesNoOptions
        },
        {
          id: "has_income_proofs",
          type: "radio",
          label: { de: "Hast du Nachweise zu Einkommen oder Arbeit?", en: "Do you have proof of income or work?" },
          required: true,
          options: yesNoOptions
        },
        {
          id: "documents_note",
          type: "textarea",
          label: { de: "Was fehlt noch?", en: "What is still missing?" },
          placeholder: { de: "Zum Beispiel Ausweis, Bescheide oder weitere Nachweise", en: "For example ID, notices or additional proofs" }
        }
      ]
    },
    {
      id: "summary",
      title: { de: "Zusammenfassung", en: "Summary" },
      description: {
        de: "Damit hast du einen ruhigen ersten Stand fuer die naechsten Schritte.",
        en: "This gives you a calm first draft for the next steps."
      },
      summary: true
    }
  ]
};

const wizardDefinitions: Record<string, ProcessWizardDefinition> = {
  wohngeld: wohnngeldWizard,
  buergergeld: buergergeldWizard
};

export function getProcessWizardCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)] ?? fallbackWizardCopy;
}

export function getWizardText(value: LocalizedText, locale: string | null | undefined) {
  return t(locale, value);
}

export function getProcessWizardDefinition(procedureId: string) {
  return wizardDefinitions[procedureId] ?? createGenericWizard(procedureId);
}

export function getInitialWizardAnswers(procedure: ProcessProcedure, profileName?: string | null): ProcessWizardAnswers {
  const definition = getProcessWizardDefinition(procedure.id);
  const answers: ProcessWizardAnswers = {};

  definition.steps.forEach((step) => {
    step.fields?.forEach((field) => {
      answers[field.id] = "";
    });
  });

  if (profileName?.trim()) {
    const fullName = profileName.trim();
    const parts = fullName.split(/\s+/).filter(Boolean);

    if ("full_name" in answers) {
      answers.full_name = fullName;
    }

    if ("applicant_first_names" in answers && !String(answers.applicant_first_names ?? "").trim()) {
      answers.applicant_first_names = parts.slice(0, Math.max(parts.length - 1, 1)).join(" ") || fullName;
    }

    if ("applicant_last_name" in answers && !String(answers.applicant_last_name ?? "").trim()) {
      answers.applicant_last_name = parts.length > 1 ? parts[parts.length - 1] : "";
    }

    if ("payment_recipient_name" in answers && !String(answers.payment_recipient_name ?? "").trim()) {
      answers.payment_recipient_name = fullName;
    }
  }

  if ("housing_city" in answers && !String(answers.housing_city ?? "").trim()) {
    answers.housing_city = "Berlin";
  }

  if ("application_type" in answers && !String(answers.application_type ?? "").trim()) {
    answers.application_type = "initial";
  }

  return answers;
}

export function normalizeProcessWizardAnswers(value: Record<string, unknown> | null | undefined): ProcessWizardAnswers {
  if (!value) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => {
      return typeof entry === "string" || typeof entry === "number" || typeof entry === "boolean" || entry === null;
    })
  ) as ProcessWizardAnswers;
}

