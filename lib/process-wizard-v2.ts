import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import { getBerlinWohngeldWizardDefinition } from "@/lib/official-forms/berlin-wohngeld";
import type { ProcessProcedure } from "@/lib/processes-ui";

type LocalizedText = Partial<Record<SupportedLanguage, string>>;

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

const copyMap: Record<SupportedLanguage, ProcessWizardCopy> = {
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

const wizardDefinitions: Record<string, ProcessWizardDefinition> = {
  wohngeld: wohnngeldWizard
};

export function getProcessWizardCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
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
