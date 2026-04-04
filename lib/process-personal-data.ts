import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type { LocalizedText, ProcessWizardAnswers } from "@/lib/process-wizard-v2";
import type {
  ContactDetails,
  IncomeDetails,
  PersonalDetails,
  UserPersonalDataRecord,
  UserPersonalDataSectionKey
} from "@/lib/types";

export type ProcessDataBlockId = "personal_identity" | "contact_address" | "housing_details" | "income_details";

export type ProcessDataBlockDefinition = {
  id: ProcessDataBlockId;
  processSlug: string;
  stepId: string;
  title: LocalizedText;
  description: LocalizedText;
  saveLabel: LocalizedText;
  reuseLabel: LocalizedText;
};

type ReuseCopy = {
  knownDataTitle: string;
  knownDataDescription: string;
  useDataLabel: string;
  reviewMyselfLabel: string;
  skipForNowLabel: string;
  saveDataTitle: string;
  saveDataDescription: string;
  saveToggleLabel: string;
  saveUpdateToggleLabel: string;
  savedFromEarlierLabel: string;
  outdatedHintLabel: string;
  updateHintLabel: string;
};

const copyMap: Partial<Record<SupportedLanguage, ReuseCopy>> = {
  de: {
    knownDataTitle: "Bekannte Angaben gefunden",
    knownDataDescription: "Wir haben bereits passende Angaben aus einem frueheren Antrag. Du kannst sie uebernehmen und danach noch aendern.",
    useDataLabel: "Ja, uebernehmen",
    reviewMyselfLabel: "Erst pruefen",
    skipForNowLabel: "Nicht fuer diesen Antrag",
    saveDataTitle: "Fuer spaetere Antraege speichern",
    saveDataDescription: "BureauCare kann sich diese Angaben merken, damit du sie beim naechsten Antrag nicht noch einmal eingeben musst.",
    saveToggleLabel: "Diese Angaben fuer spaetere Antraege speichern",
    saveUpdateToggleLabel: "Gespeicherte Angaben mit diesem Stand aktualisieren",
    savedFromEarlierLabel: "Aus einem frueheren Antrag bekannt",
    outdatedHintLabel: "Diese Angaben stammen aus einem frueheren Antrag. Bitte kurz pruefen.",
    updateHintLabel: "Wenn du hier etwas aenderst, kannst du den gespeicherten Stand direkt aktualisieren."
  },
  en: {
    knownDataTitle: "Known details found",
    knownDataDescription: "We already have matching details from an earlier application. You can use them and still edit everything afterwards.",
    useDataLabel: "Yes, use them",
    reviewMyselfLabel: "Review first",
    skipForNowLabel: "Not for this application",
    saveDataTitle: "Save for later applications",
    saveDataDescription: "BureauCare can remember these details so you do not have to type them again next time.",
    saveToggleLabel: "Save these details for later applications",
    saveUpdateToggleLabel: "Update saved details with this version",
    savedFromEarlierLabel: "Known from an earlier application",
    outdatedHintLabel: "These details come from an earlier application. Please check them briefly.",
    updateHintLabel: "If you change something here, you can update your saved details right away."
  },
  tr: {
    knownDataTitle: "Kayitli bilgiler bulundu",
    knownDataDescription: "Daha onceki bir basvurudan uygun bilgilerimiz var. Istersen bunlari kullanabilir ve sonra yine duzenleyebilirsin.",
    useDataLabel: "Evet, kullan",
    reviewMyselfLabel: "Once kontrol et",
    skipForNowLabel: "Bu basvuruda kullanma",
    saveDataTitle: "Sonraki basvurular icin kaydet",
    saveDataDescription: "BureauCare bu bilgileri kaydedebilir, boylece bir sonraki basvuruda tekrar yazman gerekmez.",
    saveToggleLabel: "Bu bilgileri sonraki basvurular icin kaydet",
    saveUpdateToggleLabel: "Kayitli bilgileri bu surumle guncelle",
    savedFromEarlierLabel: "Onceki basvurudan biliniyor",
    outdatedHintLabel: "Bu bilgiler daha onceki bir basvurudan geliyor. Lutfen kisa bir kontrol et.",
    updateHintLabel: "Burada bir seyi degistirirsen kayitli bilgileri hemen guncelleyebilirsin."
  },
  uk: {
    knownDataTitle: "Znaydeno zberezheni dani",
    knownDataDescription: "U nas uzhe ye vidpovidni dani z poperednoyi zayavy. Vy mozhete vykorystaty yikh i potim za potreby vidredahuvaty.",
    useDataLabel: "Tak, vykorystaty",
    reviewMyselfLabel: "Spochatku pereviryty",
    skipForNowLabel: "Ne dlya tsiyeyi zayavy",
    saveDataTitle: "Zberehty dlya maybutnikh zayav",
    saveDataDescription: "BureauCare mozhe zapam'yataty tsi dani, shchob nastupnoho razu vam ne dovelosya vvodyty yikh znovu.",
    saveToggleLabel: "Zberehty tsi dani dlya maybutnikh zayav",
    saveUpdateToggleLabel: "Onovyty zberezheni dani tsym variantom",
    savedFromEarlierLabel: "Vidomo z poperednoyi zayavy",
    outdatedHintLabel: "Tsi dani pokhodyat z poperednoyi zayavy. Bud laska, korotko perevirte yikh.",
    updateHintLabel: "Yakshcho vy shchos zminyte tut, mozhna odrazu onovyty zberezheni dani."
  },
  es: {
    knownDataTitle: "Datos conocidos encontrados",
    knownDataDescription: "Ya tenemos datos que coinciden de una solicitud anterior. Puedes usarlos y despues seguir editandolos.",
    useDataLabel: "Si, usar",
    reviewMyselfLabel: "Primero revisar",
    skipForNowLabel: "No para esta solicitud",
    saveDataTitle: "Guardar para futuras solicitudes",
    saveDataDescription: "BureauCare puede recordar estos datos para que no tengas que escribirlos otra vez en la proxima solicitud.",
    saveToggleLabel: "Guardar estos datos para futuras solicitudes",
    saveUpdateToggleLabel: "Actualizar los datos guardados con esta version",
    savedFromEarlierLabel: "Conocido de una solicitud anterior",
    outdatedHintLabel: "Estos datos vienen de una solicitud anterior. Revisalos brevemente, por favor.",
    updateHintLabel: "Si cambias algo aqui, puedes actualizar tus datos guardados enseguida."
  }
};

const fallbackReuseCopy = copyMap.en ?? copyMap.de!;

const DATA_BLOCKS: ProcessDataBlockDefinition[] = [
  {
    id: "personal_identity",
    processSlug: "wohngeld",
    stepId: "applicant",
    title: { de: "Persoenliche Angaben", en: "Personal details" },
    description: { de: "Name, Geburtsdatum und Familienstand", en: "Name, date of birth and family status" },
    saveLabel: { de: "Diese persoenlichen Angaben speichern", en: "Save these personal details" },
    reuseLabel: { de: "Bekannte persoenliche Angaben verwenden", en: "Use known personal details" }
  },
  {
    id: "contact_address",
    processSlug: "wohngeld",
    stepId: "applicant",
    title: { de: "Kontakt", en: "Contact" },
    description: { de: "Telefon und E-Mail fuer spaetere Antraege", en: "Phone and email for later applications" },
    saveLabel: { de: "Diese Kontaktdaten speichern", en: "Save these contact details" },
    reuseLabel: { de: "Bekannte Kontaktdaten verwenden", en: "Use known contact details" }
  },
  {
    id: "housing_details",
    processSlug: "wohngeld",
    stepId: "home",
    title: { de: "Adresse und Wohnen", en: "Address and housing" },
    description: { de: "Adresse, Wohnsituation und Mietkosten", en: "Address, housing situation and rent" },
    saveLabel: { de: "Diese Wohnangaben speichern", en: "Save these housing details" },
    reuseLabel: { de: "Bekannte Wohnangaben verwenden", en: "Use known housing details" }
  },
  {
    id: "income_details",
    processSlug: "wohngeld",
    stepId: "income-and-payment",
    title: { de: "Arbeit und Einkommen", en: "Work and income" },
    description: { de: "Beschaeftigungsstatus und grobes Einkommen", en: "Employment status and approximate income" },
    saveLabel: { de: "Diese Einkommensangaben speichern", en: "Save these income details" },
    reuseLabel: { de: "Bekannte Einkommensangaben verwenden", en: "Use known income details" }
  },
  {
    id: "personal_identity",
    processSlug: "buergergeld",
    stepId: "applicant",
    title: { de: "Persoenliche Angaben", en: "Personal details" },
    description: { de: "Name, Geburtsdatum und Familienstand", en: "Name, date of birth and family status" },
    saveLabel: { de: "Diese persoenlichen Angaben speichern", en: "Save these personal details" },
    reuseLabel: { de: "Bekannte persoenliche Angaben verwenden", en: "Use known personal details" }
  },
  {
    id: "contact_address",
    processSlug: "buergergeld",
    stepId: "applicant",
    title: { de: "Kontakt", en: "Contact" },
    description: { de: "Telefon und E-Mail fuer spaetere Antraege", en: "Phone and email for later applications" },
    saveLabel: { de: "Diese Kontaktdaten speichern", en: "Save these contact details" },
    reuseLabel: { de: "Bekannte Kontaktdaten verwenden", en: "Use known contact details" }
  },
  {
    id: "housing_details",
    processSlug: "buergergeld",
    stepId: "home",
    title: { de: "Adresse und Wohnen", en: "Address and housing" },
    description: { de: "Adresse, Wohnsituation und Mietkosten", en: "Address, housing situation and rent" },
    saveLabel: { de: "Diese Wohnangaben speichern", en: "Save these housing details" },
    reuseLabel: { de: "Bekannte Wohnangaben verwenden", en: "Use known housing details" }
  },
  {
    id: "income_details",
    processSlug: "buergergeld",
    stepId: "income-and-payment",
    title: { de: "Arbeit und Einkommen", en: "Work and income" },
    description: { de: "Beschaeftigungsstatus und grobes Einkommen", en: "Employment status and approximate income" },
    saveLabel: { de: "Diese Einkommensangaben speichern", en: "Save these income details" },
    reuseLabel: { de: "Bekannte Einkommensangaben verwenden", en: "Use known income details" }
  }
];

export function getProcessDataReuseCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)] ?? fallbackReuseCopy;
}

export function getProcessDataBlocks(processSlug: string, stepId: string) {
  return DATA_BLOCKS.filter((block) => block.processSlug === processSlug && block.stepId === stepId);
}

export function getSavedAnswersForBlock(
  blockId: ProcessDataBlockId,
  record: UserPersonalDataRecord | null | undefined
): Partial<ProcessWizardAnswers> {
  if (!record) {
    return {};
  }

  switch (blockId) {
    case "personal_identity":
      return {
        applicant_first_names: record.personal_details.first_name ?? "",
        applicant_last_name: record.personal_details.last_name ?? "",
        applicant_birth_date: record.personal_details.birth_date ?? "",
        applicant_nationality: record.personal_details.nationality ?? "",
        family_status: record.personal_details.family_status ?? ""
      };
    case "contact_address":
      return {
        applicant_phone: record.contact_details.phone ?? "",
        applicant_email: record.contact_details.email ?? ""
      };
    case "housing_details":
      return {
        housing_street: record.contact_details.street ?? "",
        housing_house_number: record.contact_details.house_number ?? "",
        housing_postal_code: record.contact_details.postal_code ?? "",
        housing_city: record.contact_details.city ?? "",
        move_in_date: record.household_details.move_in_date ?? "",
        household_size: record.household_details.household_size ?? "",
        apartment_size_sqm: record.household_details.living_space_sqm ?? "",
        monthly_rent: record.household_details.monthly_rent ?? ""
      };
    case "income_details":
      return {
        employment_status: record.income_details.employment_status ?? "",
        primary_income_amount: record.income_details.monthly_income_approx ?? "",
        primary_income_type: record.income_details.additional_income ?? ""
      };
    default:
      return {};
  }
}

export function getSavePatchesForBlock(blockId: ProcessDataBlockId, answers: ProcessWizardAnswers) {
  switch (blockId) {
    case "personal_identity":
      return {
        personal_details: compactSection<PersonalDetails>({
          first_name: asTrimmedString(answers.applicant_first_names),
          last_name: asTrimmedString(answers.applicant_last_name),
          birth_date: asTrimmedString(answers.applicant_birth_date),
          nationality: asTrimmedString(answers.applicant_nationality),
          family_status: asTrimmedString(answers.family_status)
        })
      };
    case "contact_address":
      return {
        contact_details: compactSection<ContactDetails>({
          phone: asTrimmedString(answers.applicant_phone),
          email: asTrimmedString(answers.applicant_email)
        })
      };
    case "housing_details":
      return {
        contact_details: compactSection<ContactDetails>({
          street: asTrimmedString(answers.housing_street),
          house_number: asTrimmedString(answers.housing_house_number),
          postal_code: asTrimmedString(answers.housing_postal_code),
          city: asTrimmedString(answers.housing_city),
          country: "Deutschland"
        }),
        household_details: compactSection({
          move_in_date: asTrimmedString(answers.move_in_date),
          household_size: asOptionalNumber(answers.household_size),
          living_space_sqm: asOptionalNumber(answers.apartment_size_sqm),
          monthly_rent: asOptionalNumber(answers.monthly_rent),
          housing_status: mapHousingStatus(answers.tenant_role)
        })
      };
    case "income_details":
      return {
        income_details: compactSection<IncomeDetails>({
          employment_status: asTrimmedString(answers.employment_status),
          monthly_income_approx: asOptionalNumber(answers.primary_income_amount),
          additional_income: asTrimmedString(answers.primary_income_type)
        })
      };
    default:
      return {};
  }
}

export function blockHasKnownData(blockId: ProcessDataBlockId, record: UserPersonalDataRecord | null | undefined) {
  return Object.keys(getSavedAnswersForBlock(blockId, record)).some((key) => hasValue(getSavedAnswersForBlock(blockId, record)[key]));
}

export function blockHasChangesAgainstSaved(
  blockId: ProcessDataBlockId,
  answers: ProcessWizardAnswers,
  record: UserPersonalDataRecord | null | undefined
) {
  const saved = getSavedAnswersForBlock(blockId, record);
  const current = filterEmptyAnswers(getSavedAnswersForBlock(blockId, { ...record, ...mapRecordFromAnswers(blockId, answers) } as never));
  const savedFiltered = filterEmptyAnswers(saved);

  const keys = new Set([...Object.keys(savedFiltered), ...Object.keys(current)]);
  for (const key of keys) {
    if (normalizeValue(savedFiltered[key]) !== normalizeValue(current[key])) {
      return true;
    }
  }

  return false;
}

export function getKnownDataHintForBlock(blockId: ProcessDataBlockId, record: UserPersonalDataRecord | null | undefined) {
  if (!record) {
    return null;
  }

  const timestamps = getBlockMetaTimestamps(blockId, record);
  if (!timestamps.length) {
    return null;
  }

  const latest = timestamps.sort().at(-1);
  if (!latest) {
    return null;
  }

  const ageInDays = Math.floor((Date.now() - new Date(latest).getTime()) / (1000 * 60 * 60 * 24));
  return ageInDays >= 90 ? "outdated" : "saved";
}

function getBlockMetaTimestamps(blockId: ProcessDataBlockId, record: UserPersonalDataRecord) {
  switch (blockId) {
    case "personal_identity":
      return collectMetaDates(record, "personal_details", ["first_name", "last_name", "birth_date", "nationality", "family_status"]);
    case "contact_address":
      return collectMetaDates(record, "contact_details", ["phone", "email"]);
    case "housing_details":
      return [
        ...collectMetaDates(record, "contact_details", ["street", "house_number", "postal_code", "city"]),
        ...collectMetaDates(record, "household_details", ["move_in_date", "household_size", "living_space_sqm", "monthly_rent", "housing_status"])
      ];
    case "income_details":
      return collectMetaDates(record, "income_details", ["employment_status", "monthly_income_approx", "additional_income"]);
    default:
      return [];
  }
}

function collectMetaDates(record: UserPersonalDataRecord, section: UserPersonalDataSectionKey, fields: string[]) {
  return fields
    .map((field) => record.field_meta?.[section]?.[field]?.updated_at)
    .filter((value): value is string => Boolean(value));
}

function mapHousingStatus(value: unknown) {
  const tenantRole = asTrimmedString(value);
  if (!tenantRole) return undefined;
  return tenantRole === "subtenant" ? "Untermiete" : "Miete";
}

function mapRecordFromAnswers(blockId: ProcessDataBlockId, answers: ProcessWizardAnswers) {
  const patches = getSavePatchesForBlock(blockId, answers);
  return {
    personal_details: {},
    contact_details: {},
    household_details: {},
    income_details: {},
    family_details: {},
    residency_details: {},
    field_meta: {},
    ...patches
  };
}

function compactSection<T extends Record<string, unknown>>(section: T) {
  return Object.fromEntries(Object.entries(section).filter(([, value]) => hasValue(value))) as Partial<T>;
}

function filterEmptyAnswers(value: Partial<ProcessWizardAnswers>) {
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => hasValue(entry)));
}

function normalizeValue(value: unknown) {
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function hasValue(value: unknown) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  return true;
}

function asTrimmedString(value: unknown) {
  if (value === null || value === undefined) return undefined;
  const text = String(value).trim();
  return text || undefined;
}

function asOptionalNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}
