import type {
  WelcomeAnswerStatus,
  WelcomeGermanLevel,
  WelcomeHousingStatus,
  WelcomeProfileAnswers,
  WelcomeReason
} from "@/lib/types";

export const WELCOME_STEP_KEYS = [
  "city_registration",
  "tax_id",
  "health_insurance",
  "bank_account",
  "residence_permit",
  "work_permit",
  "broadcast_fee",
  "child_benefit",
  "university_enrollment"
] as const;

export type WelcomeStepKey = (typeof WELCOME_STEP_KEYS)[number];

export type WelcomeRoadmapItem = {
  key: WelcomeStepKey;
  sortOrder: number;
};

export function isWelcomeStepKey(value: string): value is WelcomeStepKey {
  return WELCOME_STEP_KEYS.includes(value as WelcomeStepKey);
}

export function normalizeWelcomeReason(value: string | null | undefined): WelcomeReason {
  switch (value) {
    case "study":
    case "work":
    case "training":
    case "family":
    case "au_pair":
    case "refugee":
      return value;
    default:
      return "other";
  }
}

export function normalizeWelcomeHousingStatus(value: string | null | undefined): WelcomeHousingStatus {
  switch (value) {
    case "yes":
    case "no":
    case "temporary":
      return value;
    default:
      return "temporary";
  }
}

export function normalizeWelcomeAnswerStatus(value: string | null | undefined): WelcomeAnswerStatus {
  switch (value) {
    case "yes":
    case "no":
    case "soon":
      return value;
    default:
      return "unknown";
  }
}

export function normalizeWelcomeGermanLevel(value: string | null | undefined): WelcomeGermanLevel {
  switch (value) {
    case "none":
    case "basic":
    case "good":
      return value;
    default:
      return "basic";
  }
}

export function buildWelcomeRoadmap(answers: WelcomeProfileAnswers): WelcomeRoadmapItem[] {
  const orderedKeys: WelcomeStepKey[] = [];

  const push = (key: WelcomeStepKey) => {
    if (!orderedKeys.includes(key)) {
      orderedKeys.push(key);
    }
  };

  if (answers.housing_status !== "no" || answers.registration_status !== "yes") {
    push("city_registration");
  }

  push("tax_id");

  if (answers.health_insurance_status !== "yes") {
    push("health_insurance");
  }

  push("bank_account");

  if (answers.reason !== "other" || answers.nationality?.trim()) {
    push("residence_permit");
  }

  if (answers.reason === "work" || answers.reason === "training" || answers.work_status === "yes" || answers.work_status === "soon") {
    push("work_permit");
  }

  if (answers.housing_status !== "no") {
    push("broadcast_fee");
  }

  if (answers.has_children) {
    push("child_benefit");
  }

  if (answers.reason === "study") {
    push("university_enrollment");
  }

  return orderedKeys.map((key, index) => ({
    key,
    sortOrder: index
  }));
}
