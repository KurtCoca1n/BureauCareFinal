"use server";

import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";
import {
  clearUserPersonalDataField,
  clearUserPersonalDataSection,
  deleteUserPersonalData,
  saveUserPersonalDataSection
} from "@/lib/user-personal-data";
import type { PersonalDataSource, UserPersonalDataRecord, UserPersonalDataSectionKey, UserPersonalDataSections } from "@/lib/types";

type PersonalDataActionResult =
  | { ok: true; record: UserPersonalDataRecord | null }
  | { ok: false; error: string };

async function getAuthenticatedUserId() {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  return user?.id ?? null;
}

export async function saveUserPersonalDataSectionAction<K extends UserPersonalDataSectionKey>(input: {
  section: K;
  patch: Partial<UserPersonalDataSections[K]>;
  source?: PersonalDataSource;
  confirmedByUser?: boolean;
}): Promise<PersonalDataActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { ok: false, error: "not_authenticated" };
  }

  const record = await saveUserPersonalDataSection({
    userId,
    section: input.section,
    patch: input.patch,
    source: input.source ?? "user_input",
    confirmedByUser: input.confirmedByUser
  });

  if (!record) {
    return { ok: false, error: "save_failed" };
  }

  revalidatePath("/app");

  return { ok: true, record };
}

export async function clearUserPersonalDataSectionAction(section: UserPersonalDataSectionKey): Promise<PersonalDataActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { ok: false, error: "not_authenticated" };
  }

  const record = await clearUserPersonalDataSection(userId, section);
  if (!record) {
    return { ok: false, error: "clear_failed" };
  }

  revalidatePath("/app");

  return { ok: true, record };
}

export async function clearUserPersonalDataFieldAction(input: {
  section: UserPersonalDataSectionKey;
  field: string;
}): Promise<PersonalDataActionResult> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { ok: false, error: "not_authenticated" };
  }

  const record = await clearUserPersonalDataField(userId, input.section, input.field.trim());
  if (!record) {
    return { ok: false, error: "clear_failed" };
  }

  revalidatePath("/app");

  return { ok: true, record };
}

export async function deleteUserPersonalDataAction(): Promise<{ ok: true } | { ok: false; error: string }> {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return { ok: false, error: "not_authenticated" };
  }

  const ok = await deleteUserPersonalData(userId);
  if (!ok) {
    return { ok: false, error: "delete_failed" };
  }

  revalidatePath("/app");

  return { ok: true };
}

export type MyDataFormState = {
  error: string;
  success: string;
};

export async function updateUserPersonalDataSectionFormAction(
  _: MyDataFormState,
  formData: FormData
): Promise<MyDataFormState> {
  const section = String(formData.get("section") ?? "").trim() as UserPersonalDataSectionKey;
  const userId = await getAuthenticatedUserId();

  if (!userId) {
    return { error: "not_authenticated", success: "" };
  }

  if (!section) {
    return { error: "missing_section", success: "" };
  }

  const patch = Object.fromEntries(
    Array.from(formData.entries())
      .filter(([key]) => key !== "section")
      .map(([key, value]) => [key, typeof value === "string" ? value : ""])
  );

  const record = await saveUserPersonalDataSection({
    userId,
    section,
    patch,
    source: "user_input",
    confirmedByUser: true
  });

  if (!record) {
    return { error: "save_failed", success: "" };
  }

  revalidatePath("/app/my-data");
  revalidatePath("/app/settings");

  return { error: "", success: "saved" };
}

export async function clearUserPersonalDataFieldFormAction(formData: FormData): Promise<{ ok: boolean }> {
  const section = String(formData.get("section") ?? "").trim() as UserPersonalDataSectionKey;
  const field = String(formData.get("field") ?? "").trim();
  const userId = await getAuthenticatedUserId();

  if (!userId || !section || !field) {
    return { ok: false };
  }

  const record = await clearUserPersonalDataField(userId, section, field);
  if (!record) {
    return { ok: false };
  }

  revalidatePath("/app/my-data");
  revalidatePath("/app/settings");

  return { ok: true };
}

export async function clearUserPersonalDataSectionFormAction(formData: FormData): Promise<{ ok: boolean }> {
  const section = String(formData.get("section") ?? "").trim() as UserPersonalDataSectionKey;
  const userId = await getAuthenticatedUserId();

  if (!userId || !section) {
    return { ok: false };
  }

  const record = await clearUserPersonalDataSection(userId, section);
  if (!record) {
    return { ok: false };
  }

  revalidatePath("/app/my-data");
  revalidatePath("/app/settings");

  return { ok: true };
}
