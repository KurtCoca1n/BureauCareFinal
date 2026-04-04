import { createClient } from "@/lib/supabase/server";
import {
  buildFieldMeta,
  createEmptyPersonalDataMeta,
  createEmptyUserPersonalDataSections,
  mergePersonalDataSection,
  normalizeUserPersonalDataMeta,
  normalizeUserPersonalDataSections,
  USER_PERSONAL_DATA_SECTIONS,
  type UserPersonalDataSectionShape
} from "@/lib/personal-data";
import type {
  PersonalDataFieldMeta,
  PersonalDataSource,
  UserPersonalDataFieldMetaMap,
  UserPersonalDataRecord,
  UserPersonalDataSectionKey,
  UserPersonalDataSections
} from "@/lib/types";

export type SavePersonalDataSectionInput<K extends UserPersonalDataSectionKey = UserPersonalDataSectionKey> = {
  userId: string;
  section: K;
  patch: Partial<UserPersonalDataSections[K]>;
  source: PersonalDataSource;
  confirmedByUser?: boolean;
};

export async function getOrCreateUserPersonalData(userId: string): Promise<UserPersonalDataRecord | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from("user_personal_data").select("*").eq("user_id", userId).maybeSingle();

  if (data) {
    return normalizeRecord(data as UserPersonalDataRecord);
  }

  if (error && !error.message.toLowerCase().includes("relation")) {
    console.error("Loading user personal data failed", { userId, error });
    return null;
  }

  const payload = {
    user_id: userId,
    profile_version: 1,
    ...createEmptyUserPersonalDataSections(),
    field_meta: createEmptyPersonalDataMeta()
  };

  const { data: inserted, error: insertError } = await supabase.from("user_personal_data").upsert(payload, { onConflict: "user_id" }).select("*").maybeSingle();

  if (insertError) {
    const message = insertError.message.toLowerCase();
    if (message.includes("relation") || message.includes("user_personal_data")) {
      return null;
    }

    console.error("Creating user personal data failed", { userId, error: insertError });
    return null;
  }

  return inserted ? normalizeRecord(inserted as UserPersonalDataRecord) : null;
}

export async function saveUserPersonalDataSection<K extends UserPersonalDataSectionKey>(
  input: SavePersonalDataSectionInput<K>
): Promise<UserPersonalDataRecord | null> {
  const supabase = await createClient();
  const existing = await getOrCreateUserPersonalData(input.userId);
  if (!existing) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const sections = normalizeUserPersonalDataSections(existing);
  const fieldMeta = normalizeUserPersonalDataMeta(existing.field_meta);
  const currentSection = sections[input.section] as UserPersonalDataSectionShape;
  const mergedSection = mergePersonalDataSection(currentSection, input.patch as Partial<UserPersonalDataSectionShape>);
  const nextMetaSection: Record<string, PersonalDataFieldMeta | undefined> = {
    ...(fieldMeta[input.section] ?? {})
  };

  for (const [field, rawValue] of Object.entries(input.patch)) {
    const value = typeof rawValue === "string" ? rawValue.trim() : rawValue;
    if (value === undefined || value === null || (typeof value === "string" && value.length === 0)) {
      delete nextMetaSection[field];
      continue;
    }

    nextMetaSection[field] = buildFieldMeta(input.source, {
      confirmedByUser: input.confirmedByUser,
      previous: nextMetaSection[field] ?? null,
      timestamp
    });
  }

  const payload = {
    user_id: input.userId,
    [input.section]: mergedSection,
    field_meta: {
      ...fieldMeta,
      [input.section]: nextMetaSection
    } satisfies UserPersonalDataFieldMetaMap,
    updated_at: timestamp
  };

  const { data, error } = await supabase.from("user_personal_data").upsert(payload, { onConflict: "user_id" }).select("*").maybeSingle();

  if (error) {
    console.error("Saving user personal data section failed", { userId: input.userId, section: input.section, error });
    return null;
  }

  return data ? normalizeRecord(data as UserPersonalDataRecord) : null;
}

export async function clearUserPersonalDataSection(userId: string, section: UserPersonalDataSectionKey): Promise<UserPersonalDataRecord | null> {
  const supabase = await createClient();
  const existing = await getOrCreateUserPersonalData(userId);
  if (!existing) {
    return null;
  }

  const fieldMeta = normalizeUserPersonalDataMeta(existing.field_meta);
  const payload = {
    user_id: userId,
    [section]: {},
    field_meta: {
      ...fieldMeta,
      [section]: {}
    } satisfies UserPersonalDataFieldMetaMap,
    updated_at: new Date().toISOString()
  };

  const { data, error } = await supabase.from("user_personal_data").upsert(payload, { onConflict: "user_id" }).select("*").maybeSingle();

  if (error) {
    console.error("Clearing user personal data section failed", { userId, section, error });
    return null;
  }

  return data ? normalizeRecord(data as UserPersonalDataRecord) : null;
}

export async function clearUserPersonalDataField(
  userId: string,
  section: UserPersonalDataSectionKey,
  field: string
): Promise<UserPersonalDataRecord | null> {
  const supabase = await createClient();
  const existing = await getOrCreateUserPersonalData(userId);
  if (!existing) {
    return null;
  }

  const sections = normalizeUserPersonalDataSections(existing);
  const fieldMeta = normalizeUserPersonalDataMeta(existing.field_meta);
  const nextSection = { ...sections[section] } as Record<string, unknown>;
  const nextMetaSection = { ...(fieldMeta[section] ?? {}) };

  delete nextSection[field];
  delete nextMetaSection[field];

  const { data, error } = await supabase
    .from("user_personal_data")
    .upsert(
      {
        user_id: userId,
        [section]: nextSection,
        field_meta: {
          ...fieldMeta,
          [section]: nextMetaSection
        } satisfies UserPersonalDataFieldMetaMap,
        updated_at: new Date().toISOString()
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Clearing user personal data field failed", { userId, section, field, error });
    return null;
  }

  return data ? normalizeRecord(data as UserPersonalDataRecord) : null;
}

export async function deleteUserPersonalData(userId: string): Promise<boolean> {
  const supabase = await createClient();
  const { error } = await supabase.from("user_personal_data").delete().eq("user_id", userId);

  if (error) {
    console.error("Deleting user personal data failed", { userId, error });
    return false;
  }

  return true;
}

export async function touchUserPersonalDataFieldsLastUsed(
  userId: string,
  fields: Array<{ section: UserPersonalDataSectionKey; field: string }>
): Promise<UserPersonalDataRecord | null> {
  if (!fields.length) {
    return getOrCreateUserPersonalData(userId);
  }

  const supabase = await createClient();
  const existing = await getOrCreateUserPersonalData(userId);
  if (!existing) {
    return null;
  }

  const timestamp = new Date().toISOString();
  const fieldMeta = normalizeUserPersonalDataMeta(existing.field_meta);
  const nextFieldMeta = { ...fieldMeta };

  for (const { section, field } of fields) {
    const previous = nextFieldMeta[section]?.[field];
    if (!previous) {
      continue;
    }

    nextFieldMeta[section] = {
      ...(nextFieldMeta[section] ?? {}),
      [field]: {
        ...previous,
        last_used_at: timestamp
      }
    };
  }

  const { data, error } = await supabase
    .from("user_personal_data")
    .update({
      field_meta: nextFieldMeta,
      updated_at: timestamp
    })
    .eq("user_id", userId)
    .select("*")
    .maybeSingle();

  if (error) {
    console.error("Touching user personal data usage failed", { userId, error });
    return null;
  }

  return data ? normalizeRecord(data as UserPersonalDataRecord) : null;
}

function normalizeRecord(record: UserPersonalDataRecord): UserPersonalDataRecord {
  const sections = normalizeUserPersonalDataSections(record);

  return {
    ...record,
    ...sections,
    field_meta: normalizeUserPersonalDataMeta(record.field_meta)
  };
}

export function hasAnyUserPersonalData(record: UserPersonalDataRecord | null | undefined) {
  if (!record) {
    return false;
  }

  return USER_PERSONAL_DATA_SECTIONS.some((section) => Object.keys(record[section] ?? {}).length > 0);
}
