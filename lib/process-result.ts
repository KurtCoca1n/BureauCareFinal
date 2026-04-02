import { stripExplainableText } from "@/lib/glossary";
import { berlinWohngeldOfficialForm } from "@/lib/official-forms/berlin-wohngeld";
import { getProcessDetail } from "@/lib/process-details";
import { getLocalizedRealityValue, getProcessReality, type ProcessRealityDocument } from "@/lib/process-reality";
import { getProcessWizardDefinition, getWizardText, type ProcessWizardAnswers } from "@/lib/process-wizard-v2";
import { getProcedureBySlug } from "@/lib/process-details";
import { getProcedureTitle } from "@/lib/processes-ui";

type ResultCopy = {
  title: string;
  subtitle: string;
  summaryTitle: string;
  fitTitle: string;
  nextStepsTitle: string;
  readyDocsTitle: string;
  missingDocsTitle: string;
  createdTextTitle: string;
  checklistTitle: string;
  emailTitle: string;
  statusPreparation: string;
  statusReady: string;
  routeTitle: string;
  saveCaseTitle: string;
  savedInCase: string;
  openCase: string;
};

const copyMap: Record<string, ResultCopy> = {
  de: {
    title: "Dein Ergebnis",
    subtitle: "So kannst du jetzt ruhig und klar weitermachen.",
    summaryTitle: "Zusammenfassung",
    fitTitle: "Das passt gerade zu dir",
    nextStepsTitle: "Das sind deine nächsten Schritte",
    readyDocsTitle: "Das hast du schon",
    missingDocsTitle: "Das brauchst du noch",
    createdTextTitle: "Fertiger Text",
    checklistTitle: "Checkliste",
    emailTitle: "Vorbereitete E-Mail",
    statusPreparation: "Vorbereitung",
    statusReady: "Antrag bereit",
    routeTitle: "Wo du als Nächstes hin musst",
    saveCaseTitle: "In deinen Fällen",
    savedInCase: "Dieser Vorgang wurde in deinen Fällen gespeichert.",
    openCase: "Fall öffnen"
  },
  en: {
    title: "Your result",
    subtitle: "This is how you can continue calmly and clearly now.",
    summaryTitle: "Summary",
    fitTitle: "This currently fits your situation",
    nextStepsTitle: "These are your next steps",
    readyDocsTitle: "You already have this",
    missingDocsTitle: "You still need this",
    createdTextTitle: "Prepared text",
    checklistTitle: "Checklist",
    emailTitle: "Prepared email",
    statusPreparation: "Preparation",
    statusReady: "Application ready",
    routeTitle: "Where you need to go next",
    saveCaseTitle: "In your cases",
    savedInCase: "This process was saved in your cases.",
    openCase: "Open case"
  }
};

function getCopy(locale: string) {
  return copyMap[locale] ?? copyMap.de;
}

function normalizeAnswerValue(value: ProcessWizardAnswers[string]) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function documentStateFromAnswers(document: ProcessRealityDocument, answers: ProcessWizardAnswers) {
  const map: Record<string, string> = {
    rent: "has_rental_contract",
    income: "has_income_proofs",
    bank: "has_bank_statements"
  };

  const fieldId = map[document.id];
  if (!fieldId) {
    return "unknown";
  }

  return normalizeAnswerValue(answers[fieldId]) === "yes" ? "ready" : "missing";
}

export function buildProcessResult(procedureId: string, locale: string, answers: ProcessWizardAnswers) {
  const procedure = getProcedureBySlug(procedureId);
  const reality = getProcessReality(procedureId);
  const detail = getProcessDetail(procedureId);
  const definition = getProcessWizardDefinition(procedureId);
  const copy = getCopy(locale);

  if (!procedure || !reality || !detail) {
    return null;
  }

  const summaryItems =
    definition.steps
      .filter((step) => !step.summary)
      .flatMap((step) =>
        (step.fields ?? []).map((field) => ({
          id: field.id,
          label: stripExplainableText(getWizardText(field.label, locale)),
          value: normalizeAnswerValue(answers[field.id])
        }))
      )
      .filter((item) => item.value.length > 0);

  const readyDocuments = reality.documents.filter((document) => documentStateFromAnswers(document, answers) === "ready");
  const missingDocuments = reality.documents.filter((document) => documentStateFromAnswers(document, answers) !== "ready");
  const nextSteps = reality.timeline.map((step) => ({
    title: getLocalizedRealityValue(step.title, locale),
    note: getLocalizedRealityValue(step.note, locale)
  }));

  const procedureTitle = getProcedureTitle(procedure, locale);
  const summaryText = stripExplainableText(detail.summary[locale as keyof typeof detail.summary] ?? detail.summary.en ?? detail.summary.de ?? "");
  const checklistText = nextSteps.map((step, index) => `${index + 1}. ${stripExplainableText(step.title)}\n${stripExplainableText(step.note)}`).join("\n\n");
  const requestOrEmailText = reality.requestPath.needed
    ? `Betreff: ${procedureTitle}\n\nHallo,\n\nich möchte den Vorgang "${procedureTitle}" starten und bitte um die nächsten offiziellen Schritte und die richtigen Unterlagen.\n\nMeine Situation in kurz:\n${summaryItems
        .slice(0, 4)
        .map((item) => `- ${item.label}: ${item.value}`)
        .join("\n")}\n\nVielen Dank.`
    : `Ich bereite gerade den Vorgang "${procedureTitle}" vor.\n\nDas habe ich schon geklärt:\n${summaryItems
        .slice(0, 5)
        .map((item) => `- ${item.label}: ${item.value}`)
        .join("\n")}\n\nNächste Schritte:\n${nextSteps
        .slice(0, 3)
        .map((step, index) => `${index + 1}. ${stripExplainableText(step.title)}`)
        .join("\n")}`;

  const workflowStatus = reality.requestPath.needed ? "preparation" : "application_ready";
  const officialPdfAvailable = procedureId === "wohngeld";
  const officialFormVersion = officialPdfAvailable ? berlinWohngeldOfficialForm.version[locale as "de" | "en"] ?? berlinWohngeldOfficialForm.version.de : null;
  const officialServiceUrl = officialPdfAvailable ? berlinWohngeldOfficialForm.serviceUrl : null;

  return {
    copy,
    procedureTitle,
    workflowStatus,
    workflowStatusLabel: workflowStatus === "preparation" ? copy.statusPreparation : copy.statusReady,
    summaryText,
    summaryItems,
    nextSteps,
    readyDocuments: readyDocuments.map((document) => ({
      label: getLocalizedRealityValue(document.label, locale),
      note: getLocalizedRealityValue(document.note, locale)
    })),
    missingDocuments: missingDocuments.map((document) => ({
      label: getLocalizedRealityValue(document.label, locale),
      note: getLocalizedRealityValue(document.note, locale)
    })),
    officialFormName: reality.officialForm ? getLocalizedRealityValue(reality.officialForm.name, locale) : null,
    officialAuthority: reality.officialForm ? getLocalizedRealityValue(reality.officialForm.authority, locale) : null,
    officialFormVersion,
    officialServiceUrl,
    officialPdfHref: officialPdfAvailable ? `/api/processes/${procedureId}/official-pdf` : null,
    locationName: reality.officialForm ? getLocalizedRealityValue(reality.officialForm.authority, locale) : null,
    actionMode: reality.appointmentPath.needed ? "vor_ort" : reality.portalPath.available ? "online" : reality.requestPath.needed ? "per_post" : null,
    preparedText: requestOrEmailText,
    checklistText,
    emailSubject: procedureTitle,
    emailBody: requestOrEmailText
  };
}
