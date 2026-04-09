import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import { getProcedureBySlug } from "@/lib/process-details";
import { getProcedureTitle } from "@/lib/processes-ui";
import type { PersonalDataSuggestion, PersonalDataSuggestionPriority, UserPersonalDataRecord, UserPersonalDataSectionKey } from "@/lib/types";

type SuggestionDraft = {
  id: string;
  procedureId: string;
  baseScore: number;
  reasons: Partial<Record<SupportedLanguage, string>>;
  evidence: string[];
  freshnessSections: UserPersonalDataSectionKey[];
};

function containsAny(value: string | undefined, needles: string[]) {
  const haystack = (value ?? "").trim().toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

function getLatestSectionUpdate(record: UserPersonalDataRecord, section: UserPersonalDataSectionKey) {
  const entries = Object.values(record.field_meta?.[section] ?? {});
  const latest = entries
    .map((entry) => entry?.updated_at)
    .filter((value): value is string => Boolean(value))
    .sort()
    .at(-1);

  return latest ? new Date(latest) : null;
}

function getFreshnessPenalty(record: UserPersonalDataRecord, sections: UserPersonalDataSectionKey[]) {
  const latestDates = sections
    .map((section) => getLatestSectionUpdate(record, section))
    .filter((value): value is Date => Boolean(value))
    .sort((left, right) => right.getTime() - left.getTime());

  if (!latestDates.length) {
    return 0;
  }

  const ageInDays = Math.floor((Date.now() - latestDates[0].getTime()) / (1000 * 60 * 60 * 24));
  if (ageInDays > 365) return 18;
  if (ageInDays > 180) return 10;
  if (ageInDays > 90) return 4;
  return 0;
}

function toPriority(score: number): PersonalDataSuggestionPriority {
  if (score >= 72) return "high";
  if (score >= 52) return "medium";
  return "low";
}

function getReason(locale: string | null | undefined, reasons: Partial<Record<SupportedLanguage, string>>) {
  const normalized = normalizePreferredLanguage(locale);
  return reasons[normalized] ?? reasons.en ?? reasons.de ?? "";
}

export function buildPersonalDataSuggestions(
  record: UserPersonalDataRecord | null | undefined,
  locale: string | null | undefined
): PersonalDataSuggestion[] {
  if (!record) {
    return [];
  }

  const drafts: SuggestionDraft[] = [];
  /** Teilbereiche fehlen in der DB oft komplett — ohne Defaults entsteht ein 500er auf der Home-Seite. */
  const housing = record.household_details ?? {};
  const income = record.income_details ?? {};
  const family = record.family_details ?? {};
  const residency = record.residency_details ?? {};
  const monthlyIncome = typeof income.monthly_income_approx === "number" ? income.monthly_income_approx : null;
  const monthlyRent = typeof housing.monthly_rent === "number" ? housing.monthly_rent : null;
  const householdSize = typeof housing.household_size === "number" ? housing.household_size : null;

  if ((monthlyRent ?? 0) > 0 && ((monthlyIncome !== null && monthlyIncome <= 2200) || (householdSize ?? 0) >= 2)) {
    drafts.push({
      id: "wohngeld-check",
      procedureId: "wohngeld",
      baseScore: monthlyIncome !== null && monthlyIncome <= 1800 ? 82 : 68,
      reasons: {
        de: "Wohngeld koennte fuer dich relevant sein, weil du Miete zahlst und dein Einkommen eher begrenzt wirkt.",
        en: "Housing benefit could be relevant for you because you pay rent and your income appears rather limited."
      },
      evidence: ["monthly_rent", "monthly_income_approx", "household_size"],
      freshnessSections: ["household_details", "income_details"]
    });
  }

  if ((income.employment_status === "unemployed" || (monthlyIncome !== null && monthlyIncome < 1200)) && ((monthlyRent ?? 0) > 0 || householdSize !== null)) {
    drafts.push({
      id: "buergergeld-check",
      procedureId: "buergergeld",
      baseScore: income.employment_status === "unemployed" ? 86 : 66,
      reasons: {
        de: "Buergergeld koennte sich zu pruefen lohnen, wenn dein Einkommen gerade sehr niedrig ist oder du aktuell nicht arbeitest.",
        en: "Basic income support could be worth checking if your income is currently very low or you are not working right now."
      },
      evidence: ["employment_status", "monthly_income_approx", "monthly_rent"],
      freshnessSections: ["income_details", "household_details"]
    });
  }

  if ((typeof family.children_count === "number" && family.children_count > 0) || containsAny(family.family_constellation, ["kind", "kinder", "child", "children"])) {
    drafts.push({
      id: "kindergeld-check",
      procedureId: "kindergeld",
      baseScore: 74,
      reasons: {
        de: "Kindergeld oder ein aehnlicher Familienvorgang koennte fuer dich relevant sein, wenn Kinder zu deinem Haushalt gehoeren.",
        en: "Child benefit or a similar family process could be relevant for you if children are part of your household."
      },
      evidence: ["children_count", "family_constellation"],
      freshnessSections: ["family_details"]
    });
  }

  if (income.employment_status === "student" || containsAny(residency.current_life_phase, ["stud", "ausbildung", "student"])) {
    drafts.push({
      id: "bafoeg-check",
      procedureId: "bafoeg-antrag",
      baseScore: 72,
      reasons: {
        de: "BAfoeG koennte in deiner Situation interessant sein, wenn du gerade studierst oder in Ausbildung bist.",
        en: "Student aid could be relevant in your situation if you are currently studying or in training."
      },
      evidence: ["employment_status", "current_life_phase"],
      freshnessSections: ["income_details", "residency_details"]
    });
  }

  if (housing.move_in_date) {
    const moveInDate = new Date(housing.move_in_date);
    const ageInDays = Number.isNaN(moveInDate.getTime()) ? null : Math.floor((Date.now() - moveInDate.getTime()) / (1000 * 60 * 60 * 24));
    if (ageInDays !== null && ageInDays >= 0 && ageInDays <= 120) {
      drafts.push({
        id: "ummeldung-check",
        procedureId: "ummeldung",
        baseScore: 64,
        reasons: {
          de: "Eine Ummeldung koennte wichtig sein, wenn du vor Kurzem eingezogen bist oder deine Adresse sich geaendert hat.",
          en: "A change of address registration could be important if you moved recently or your address has changed."
        },
        evidence: ["move_in_date", "street", "postal_code", "city"],
        freshnessSections: ["household_details", "contact_details"]
      });
    }
  }

  if (residency.residence_status && containsAny(residency.residence_status, ["aufenthalt", "visa", "visum", "permit", "status"])) {
    drafts.push({
      id: "visa-check",
      procedureId: "visum",
      baseScore: 58,
      reasons: {
        de: "Ein Aufenthalt- oder Visumsvorgang koennte sinnvoll sein, wenn dein Aufenthaltsstatus fuer neue Antraege eine Rolle spielt.",
        en: "A visa or residence process could be worth checking if your residence status matters for new applications."
      },
      evidence: ["residence_status"],
      freshnessSections: ["residency_details"]
    });
  }

  const suggestions = drafts
    .map((draft) => {
      const procedure = getProcedureBySlug(draft.procedureId);
      if (!procedure) {
        return null;
      }

      const score = Math.max(0, draft.baseScore - getFreshnessPenalty(record, draft.freshnessSections));
      if (score < 45) {
        return null;
      }

      return {
        id: draft.id,
        procedure_id: draft.procedureId,
        title: getProcedureTitle(procedure, locale),
        reason: getReason(locale, draft.reasons),
        priority: toPriority(score),
        score,
        evidence: draft.evidence
      } satisfies PersonalDataSuggestion;
    })
    .filter((entry): entry is PersonalDataSuggestion => Boolean(entry))
    .sort((left, right) => right.score - left.score)
    .slice(0, 3);

  return suggestions;
}
