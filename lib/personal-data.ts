import type {
  ContactDetails,
  FamilyDetails,
  HouseholdDetails,
  IncomeDetails,
  PersonalDataFieldMeta,
  PersonalDataSource,
  PersonalDetails,
  ResidencyDetails,
  UserPersonalDataFieldMetaMap,
  UserPersonalDataSectionKey,
  UserPersonalDataSections
} from "@/lib/types";

export const USER_PERSONAL_DATA_SECTIONS: UserPersonalDataSectionKey[] = [
  "personal_details",
  "contact_details",
  "household_details",
  "income_details",
  "family_details",
  "residency_details"
];

export function createEmptyUserPersonalDataSections(): UserPersonalDataSections {
  return {
    personal_details: {},
    contact_details: {},
    household_details: {},
    income_details: {},
    family_details: {},
    residency_details: {}
  };
}

export function createEmptyPersonalDataMeta(): UserPersonalDataFieldMetaMap {
  return {
    personal_details: {},
    contact_details: {},
    household_details: {},
    income_details: {},
    family_details: {},
    residency_details: {}
  };
}

export function normalizeUserPersonalDataSections(
  value: Partial<UserPersonalDataSections> | null | undefined
): UserPersonalDataSections {
  return {
    personal_details: sanitizeSection(value?.personal_details),
    contact_details: sanitizeSection(value?.contact_details),
    household_details: sanitizeSection(value?.household_details),
    income_details: sanitizeSection(value?.income_details),
    family_details: sanitizeSection(value?.family_details),
    residency_details: sanitizeSection(value?.residency_details)
  };
}

export function normalizeUserPersonalDataMeta(value: UserPersonalDataFieldMetaMap | null | undefined): UserPersonalDataFieldMetaMap {
  return {
    personal_details: sanitizeMetaSection(value?.personal_details),
    contact_details: sanitizeMetaSection(value?.contact_details),
    household_details: sanitizeMetaSection(value?.household_details),
    income_details: sanitizeMetaSection(value?.income_details),
    family_details: sanitizeMetaSection(value?.family_details),
    residency_details: sanitizeMetaSection(value?.residency_details)
  };
}

export function mergePersonalDataSection<T extends Record<string, unknown>>(
  current: T,
  patch: Partial<T>,
  options?: {
    clearEmptyStrings?: boolean;
  }
) {
  const next = { ...current };

  for (const [key, rawValue] of Object.entries(patch)) {
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
    const shouldDelete =
      value === undefined ||
      value === null ||
      (options?.clearEmptyStrings !== false && typeof value === "string" && value.length === 0);

    if (shouldDelete) {
      delete next[key as keyof T];
    } else {
      next[key as keyof T] = value as T[keyof T];
    }
  }

  return next;
}

export function buildFieldMeta(
  source: PersonalDataSource,
  options?: {
    confirmedByUser?: boolean;
    previous?: PersonalDataFieldMeta | null;
    timestamp?: string;
    touchLastUsedAt?: boolean;
  }
): PersonalDataFieldMeta {
  const timestamp = options?.timestamp ?? new Date().toISOString();
  const confirmedByUser = options?.confirmedByUser ?? source === "user_input";
  const previous = options?.previous ?? null;

  return {
    source,
    updated_at: timestamp,
    confirmed_by_user: confirmedByUser,
    confirmed_at: confirmedByUser ? previous?.confirmed_at ?? timestamp : previous?.confirmed_at ?? null,
    last_used_at: options?.touchLastUsedAt ? timestamp : previous?.last_used_at ?? null
  };
}

function sanitizeSection<T extends Record<string, unknown> | undefined>(section: T) {
  if (!section || typeof section !== "object" || Array.isArray(section)) {
    return {} as NonNullable<T>;
  }

  return Object.fromEntries(
    Object.entries(section).filter(([, value]) => value !== undefined && value !== null && !(typeof value === "string" && value.trim() === ""))
  ) as NonNullable<T>;
}

function sanitizeMetaSection(section: Record<string, PersonalDataFieldMeta | undefined> | undefined) {
  if (!section || typeof section !== "object" || Array.isArray(section)) {
    return {};
  }

  return Object.fromEntries(Object.entries(section).filter(([, value]) => Boolean(value))) as Record<string, PersonalDataFieldMeta>;
}

export const USER_PERSONAL_DATA_SECTION_LABELS: Record<UserPersonalDataSectionKey, string> = {
  personal_details: "personal",
  contact_details: "contact",
  household_details: "household",
  income_details: "income",
  family_details: "family",
  residency_details: "residency"
};

export type UserPersonalDataSectionShape =
  | PersonalDetails
  | ContactDetails
  | HouseholdDetails
  | IncomeDetails
  | FamilyDetails
  | ResidencyDetails;
