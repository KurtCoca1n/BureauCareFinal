import { getDateLocale } from "@/lib/i18n";
import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type { UserPersonalDataRecord, UserPersonalDataSectionKey } from "@/lib/types";

type MyDataCopy = {
  title: string;
  intro: string;
  trustTitle: string;
  trustText: string;
  reuseHint: string;
  emptyInline: string;
  settingsLinkTitle: string;
  settingsLinkText: string;
  openMyData: string;
  sectionEmpty: string;
  pageEmptyTitle: string;
  pageEmptyText: string;
  suggestionsTitle: string;
  suggestionsText: string;
  edit: string;
  editing: string;
  save: string;
  saving: string;
  cancel: string;
  deleteField: string;
  deleteSection: string;
  deleting: string;
  confirmDeleteField: string;
  confirmDeleteSection: string;
  updatedAt: string;
  sourceUserInput: string;
  sourceApplicationImport: string;
  sourceDocumentExtracted: string;
  sourceSystemInferred: string;
  confirmedByUser: string;
  notConfirmed: string;
  backToSettings: string;
  deleteAll: string;
  confirmDeleteAll: string;
  deleted: string;
  saved: string;
};

export type MyDataFieldDefinition = {
  key: string;
  label: Partial<Record<SupportedLanguage, string>>;
  type?: "text" | "date" | "number" | "email" | "tel";
};

export type MyDataSectionDefinition = {
  key: UserPersonalDataSectionKey;
  title: Partial<Record<SupportedLanguage, string>>;
  description: Partial<Record<SupportedLanguage, string>>;
  empty: Partial<Record<SupportedLanguage, string>>;
  fields: MyDataFieldDefinition[];
};

const deCopy: MyDataCopy = {
  title: "Meine Angaben",
  intro: "Hier siehst du die Angaben, die BureauCare fuer spaetere Antraege verwenden kann. Du kannst alles jederzeit bearbeiten oder entfernen.",
  trustTitle: "Fuer spaetere Antraege vorbereitet",
  trustText: "BureauCare nutzt diese Angaben nur dann, wenn sie fuer einen Antrag wirklich hilfreich sind. Du behaeltst jederzeit die Kontrolle.",
  reuseHint: "Kann fuer passende Antraege wiederverwendet werden",
  emptyInline: "Sobald du Angaben in Antraegen speicherst, erscheinen sie hier.",
  settingsLinkTitle: "Meine Angaben verwalten",
  settingsLinkText: "Oeffne deine gespeicherten Angaben und halte sie fuer kommende Antraege aktuell.",
  openMyData: "Meine Angaben oeffnen",
  sectionEmpty: "Noch keine Angaben gespeichert.",
  pageEmptyTitle: "Noch keine Angaben gespeichert",
  pageEmptyText: "Sobald du in Antraegen Angaben speicherst, erscheinen sie hier.",
  suggestionsTitle: "Das koennte fuer dich relevant sein",
  suggestionsText: "Diese Vorschlaege sind bewusst vorsichtig formuliert und basieren nur auf deinen gespeicherten Angaben.",
  edit: "Bearbeiten",
  editing: "Bearbeiten",
  save: "Speichern",
  saving: "Wird gespeichert...",
  cancel: "Abbrechen",
  deleteField: "Entfernen",
  deleteSection: "Bereich loeschen",
  deleting: "Wird entfernt...",
  confirmDeleteField: "Willst du diese Angabe wirklich entfernen?",
  confirmDeleteSection: "Willst du diesen Bereich wirklich loeschen?",
  updatedAt: "Zuletzt aktualisiert",
  sourceUserInput: "Von dir eingegeben",
  sourceApplicationImport: "Aus einem frueheren Antrag uebernommen",
  sourceDocumentExtracted: "Aus einem Dokument erkannt",
  sourceSystemInferred: "Von BureauCare vorbereitet",
  confirmedByUser: "Von dir bestaetigt",
  notConfirmed: "Noch nicht bestaetigt",
  backToSettings: "Zurueck zu Einstellungen",
  deleteAll: "Alle Angaben loeschen",
  confirmDeleteAll: "Willst du wirklich alle gespeicherten Angaben loeschen?",
  deleted: "Entfernt",
  saved: "Gespeichert"
};

const copyMap: Record<SupportedLanguage, MyDataCopy> = {
  de: deCopy,
  en: {
    title: "My details",
    intro: "Here you can see the details BureauCare can reuse for later applications. You can edit or remove everything at any time.",
    trustTitle: "Prepared for future applications",
    trustText: "BureauCare only uses these details when they are actually helpful for an application. You stay in control at all times.",
    reuseHint: "Can be reused for matching applications",
    emptyInline: "As soon as you save details in applications, they will appear here.",
    settingsLinkTitle: "Manage my details",
    settingsLinkText: "Open your saved details and keep them up to date for future applications.",
    openMyData: "Open my details",
    sectionEmpty: "No details saved yet.",
    pageEmptyTitle: "No details saved yet",
    pageEmptyText: "As soon as you save details in applications, they will appear here.",
    suggestionsTitle: "This could be relevant for you",
    suggestionsText: "These suggestions are deliberately cautious and only based on your saved details.",
    edit: "Edit",
    editing: "Editing",
    save: "Save",
    saving: "Saving...",
    cancel: "Cancel",
    deleteField: "Remove",
    deleteSection: "Delete section",
    deleting: "Removing...",
    confirmDeleteField: "Do you really want to remove this detail?",
    confirmDeleteSection: "Do you really want to delete this section?",
    updatedAt: "Last updated",
    sourceUserInput: "Entered by you",
    sourceApplicationImport: "Taken from an earlier application",
    sourceDocumentExtracted: "Detected from a document",
    sourceSystemInferred: "Prepared by BureauCare",
    confirmedByUser: "Confirmed by you",
    notConfirmed: "Not confirmed yet",
    backToSettings: "Back to settings",
    deleteAll: "Delete all details",
    confirmDeleteAll: "Do you really want to delete all saved details?",
    deleted: "Removed",
    saved: "Saved"
  },
  tr: deCopy,
  uk: deCopy,
  es: deCopy,
  zh: {
    ...deCopy,
    title: "\u6211\u7684\u4fe1\u606f",
    intro: "\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u67e5\u770b BureauCare \u4e4b\u540e\u53ef\u4ee5\u91cd\u590d\u4f7f\u7528\u7684\u4fe1\u606f\uff0c\u4e5f\u53ef\u4ee5\u968f\u65f6\u4fee\u6539\u6216\u5220\u9664\u3002",
    trustTitle: "\u53ef\u7528\u4e8e\u4e4b\u540e\u7684\u7533\u8bf7",
    trustText: "\u53ea\u6709\u5728\u8fd9\u4e9b\u4fe1\u606f\u786e\u5b9e\u5bf9\u7533\u8bf7\u6709\u5e2e\u52a9\u65f6\uff0cBureauCare \u624d\u4f1a\u4f7f\u7528\u5b83\u4eec\u3002\u63a7\u5236\u6743\u59cb\u7ec8\u5728\u4f60\u624b\u91cc\u3002",
    reuseHint: "\u53ef\u7528\u4e8e\u5408\u9002\u7684\u7533\u8bf7",
    emptyInline: "\u5f53\u4f60\u5728\u7533\u8bf7\u4e2d\u4fdd\u5b58\u4fe1\u606f\u540e\uff0c\u8fd9\u91cc\u5c31\u4f1a\u663e\u793a\u51fa\u6765\u3002",
    settingsLinkTitle: "\u7ba1\u7406\u6211\u7684\u4fe1\u606f",
    settingsLinkText: "\u6253\u5f00\u5df2\u4fdd\u5b58\u7684\u4fe1\u606f\uff0c\u5e76\u4e3a\u4e4b\u540e\u7684\u7533\u8bf7\u4fdd\u6301\u6700\u65b0\u72b6\u6001\u3002",
    openMyData: "\u6253\u5f00\u6211\u7684\u4fe1\u606f",
    sectionEmpty: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u4efb\u4f55\u4fe1\u606f\u3002",
    pageEmptyTitle: "\u8fd8\u6ca1\u6709\u4fdd\u5b58\u4efb\u4f55\u4fe1\u606f",
    pageEmptyText: "\u5f53\u4f60\u5728\u7533\u8bf7\u4e2d\u9009\u62e9\u4fdd\u5b58\u4fe1\u606f\u540e\uff0c\u8fd9\u91cc\u5c31\u4f1a\u663e\u793a\u51fa\u6765\u3002",
    suggestionsTitle: "\u8fd9\u4e9b\u5185\u5bb9\u53ef\u80fd\u4e0e\u4f60\u6709\u5173",
    suggestionsText: "\u8fd9\u4e9b\u5efa\u8bae\u4f1a\u4fdd\u6301\u8c28\u614e\uff0c\u53ea\u57fa\u4e8e\u4f60\u5df2\u4fdd\u5b58\u7684\u4fe1\u606f\u3002",
    edit: "\u7f16\u8f91",
    editing: "\u7f16\u8f91\u4e2d",
    save: "\u4fdd\u5b58",
    saving: "\u6b63\u5728\u4fdd\u5b58...",
    cancel: "\u53d6\u6d88",
    deleteField: "\u79fb\u9664",
    deleteSection: "\u5220\u9664\u6574\u4e2a\u533a\u5757",
    deleting: "\u6b63\u5728\u79fb\u9664...",
    confirmDeleteField: "\u4f60\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u6761\u4fe1\u606f\u5417\uff1f",
    confirmDeleteSection: "\u4f60\u786e\u5b9a\u8981\u5220\u9664\u6574\u4e2a\u533a\u5757\u5417\uff1f",
    updatedAt: "\u6700\u8fd1\u66f4\u65b0",
    sourceUserInput: "\u7531\u4f60\u8f93\u5165",
    sourceApplicationImport: "\u6765\u81ea\u8f83\u65e9\u7684\u7533\u8bf7",
    sourceDocumentExtracted: "\u4ece\u6587\u4ef6\u4e2d\u8bc6\u522b",
    sourceSystemInferred: "\u7531 BureauCare \u9884\u5148\u6574\u7406",
    confirmedByUser: "\u5df2\u7531\u4f60\u786e\u8ba4",
    notConfirmed: "\u5c1a\u672a\u786e\u8ba4",
    backToSettings: "\u8fd4\u56de\u8bbe\u7f6e",
    deleteAll: "\u5220\u9664\u5168\u90e8\u4fe1\u606f",
    confirmDeleteAll: "\u4f60\u786e\u5b9a\u8981\u5220\u9664\u6240\u6709\u5df2\u4fdd\u5b58\u7684\u4fe1\u606f\u5417\uff1f",
    deleted: "\u5df2\u79fb\u9664",
    saved: "\u5df2\u4fdd\u5b58"
  }
};

export const myDataSections: MyDataSectionDefinition[] = [
  {
    key: "personal_details",
    title: { de: "Persoenliche Angaben", en: "Personal details", tr: "Kisisel bilgiler", uk: "Osobysti dani", es: "Datos personales" },
    description: {
      de: "Basisdaten, die in vielen Antraegen immer wieder gebraucht werden.",
      en: "Basic details that are needed again and again in many applications.",
      tr: "Bir莽ok basvuruda tekrar gereken temel bilgiler.",
      uk: "Bazovi dani, yaki chasto potribni v riznykh zayavakh.",
      es: "Datos basicos que se vuelven a necesitar en muchas solicitudes."
    },
    empty: { de: "Noch keine persoenlichen Angaben gespeichert.", en: "No personal details saved yet.", tr: "Henuz kisisel bilgi kayitli degil.", uk: "Shche nemae zberezhenykh osobystykh danykh.", es: "Todavia no hay datos personales guardados." },
    fields: [
      { key: "first_name", label: { de: "Vorname", en: "First name", tr: "Ad", uk: "Imya", es: "Nombre" } },
      { key: "last_name", label: { de: "Nachname", en: "Last name", tr: "Soyad", uk: "Prizvyshche", es: "Apellido" } },
      { key: "birth_date", label: { de: "Geburtsdatum", en: "Date of birth", tr: "Dogum tarihi", uk: "Data narodzhennya", es: "Fecha de nacimiento" }, type: "date" },
      { key: "gender", label: { de: "Geschlecht", en: "Gender", tr: "Cinsiyet", uk: "Stat", es: "Genero" } },
      { key: "nationality", label: { de: "Staatsangehoerigkeit", en: "Nationality", tr: "UyruK", uk: "Hromadyanstvo", es: "Nacionalidad" } },
      { key: "family_status", label: { de: "Familienstand", en: "Family status", tr: "Medeni durum", uk: "Simeynyy stan", es: "Estado civil" } }
    ]
  },
  {
    key: "contact_details",
    title: { de: "Kontakt & Adresse", en: "Contact & address", tr: "Iletisim ve adres", uk: "Kontakty ta adresa", es: "Contacto y direccion" },
    description: {
      de: "So kann BureauCare spaeter deine Kontakt- und Adressdaten vorschlagen.",
      en: "This lets BureauCare suggest your contact and address details later.",
      tr: "Boylece BureauCare daha sonra iletisim ve adres bilgilerini onerebilir.",
      uk: "Tak BureauCare zmozhe piznishe proponuvaty vashi kontaktni ta adresni dani.",
      es: "Asi BureauCare puede sugerir mas tarde tus datos de contacto y direccion."
    },
    empty: { de: "Noch keine Kontakt- oder Adressdaten gespeichert.", en: "No contact or address details saved yet.", tr: "Henuz iletisim veya adres bilgisi kayitli degil.", uk: "Shche nemae zberezhenykh kontaktiv chy adresy.", es: "Todavia no hay datos de contacto o direccion guardados." },
    fields: [
      { key: "street", label: { de: "Strasse", en: "Street", tr: "Sokak", uk: "Vulytsya", es: "Calle" } },
      { key: "house_number", label: { de: "Hausnummer", en: "House number", tr: "Kapi numarasi", uk: "Nomer budynku", es: "Numero" } },
      { key: "postal_code", label: { de: "Postleitzahl", en: "Postal code", tr: "Posta kodu", uk: "Poshtovyy indeks", es: "Codigo postal" } },
      { key: "city", label: { de: "Stadt", en: "City", tr: "Sehir", uk: "Misto", es: "Ciudad" } },
      { key: "country", label: { de: "Land", en: "Country", tr: "Ulke", uk: "Kraina", es: "Pais" } },
      { key: "email", label: { de: "E-Mail", en: "Email", tr: "E-posta", uk: "Email", es: "Correo electronico" }, type: "email" },
      { key: "phone", label: { de: "Telefonnummer", en: "Phone number", tr: "Telefon numarasi", uk: "Telefon", es: "Telefono" }, type: "tel" }
    ]
  },
  {
    key: "household_details",
    title: { de: "Haushalt & Wohnen", en: "Household & housing", tr: "Hane ve konut", uk: "Domohospodarstvo ta zhytlo", es: "Hogar y vivienda" },
    description: {
      de: "Angaben zu Wohnung, Haushalt und Wohnkosten.",
      en: "Details about housing, household and living costs.",
      tr: "Konut, hane ve yasam giderleriyle ilgili bilgiler.",
      uk: "Dani pro zhytlo, domohospodarstvo ta vytraty na prozhyvannya.",
      es: "Datos sobre vivienda, hogar y costes de vida."
    },
    empty: { de: "Noch keine Wohnangaben gespeichert.", en: "No housing details saved yet.", tr: "Henuz konut bilgisi kayitli degil.", uk: "Shche nemae zberezhenykh danykh pro zhytlo.", es: "Todavia no hay datos de vivienda guardados." },
    fields: [
      { key: "housing_status", label: { de: "Wohnsituation", en: "Housing situation", tr: "Konut durumu", uk: "Zhytlova sytuatsiya", es: "Situacion de vivienda" } },
      { key: "household_size", label: { de: "Personen im Haushalt", en: "People in household", tr: "Hanedeki kisi sayisi", uk: "Kil-kist lyudey u domohospodarstvi", es: "Personas en el hogar" }, type: "number" },
      { key: "living_space_sqm", label: { de: "Wohnflaeche", en: "Living space", tr: "Metrekare", uk: "Ploshcha zhyla", es: "Superficie" }, type: "number" },
      { key: "monthly_rent", label: { de: "Monatliche Miete", en: "Monthly rent", tr: "Aylik kira", uk: "Shchomisyachna orenda", es: "Alquiler mensual" }, type: "number" },
      { key: "move_in_date", label: { de: "Einzugsdatum", en: "Move-in date", tr: "Tasinma tarihi", uk: "Data vyyizdu", es: "Fecha de mudanza" }, type: "date" }
    ]
  },
  {
    key: "income_details",
    title: { de: "Einkommen & Arbeit", en: "Income & work", tr: "Gelir ve is", uk: "Dokhid ta robota", es: "Ingresos y trabajo" },
    description: {
      de: "Diese Angaben helfen bei vielen Sozial- und Behoerdenantraegen.",
      en: "These details help with many social and administrative applications.",
      tr: "Bu bilgiler bircok sosyal ve resmi basvuruda yardimci olur.",
      uk: "Tsi dani dopomahayut u bahat-okh sotsialnykh ta administratyvnykh zayavakh.",
      es: "Estos datos ayudan en muchas solicitudes sociales y administrativas."
    },
    empty: { de: "Noch keine Einkommens- oder Arbeitsdaten gespeichert.", en: "No income or work details saved yet.", tr: "Henuz gelir veya is bilgisi kayitli degil.", uk: "Shche nemae zberezhenykh danykh pro dokhid chy robotu.", es: "Todavia no hay datos de ingresos o trabajo guardados." },
    fields: [
      { key: "employment_status", label: { de: "Beschaeftigungsstatus", en: "Employment status", tr: "Calisma durumu", uk: "Status zaynyatosti", es: "Situacion laboral" } },
      { key: "monthly_income_approx", label: { de: "Monatliches Einkommen", en: "Monthly income", tr: "Aylik gelir", uk: "Shchomisyachnyy dokhid", es: "Ingreso mensual" }, type: "number" },
      { key: "additional_income", label: { de: "Weitere Einnahmen", en: "Additional income", tr: "Ek gelir", uk: "Dodatkovyy dokhid", es: "Ingresos adicionales" } },
      { key: "employer", label: { de: "Arbeitgeber", en: "Employer", tr: "Isveren", uk: "Robotodavec", es: "Empresa" } }
    ]
  },
  {
    key: "family_details",
    title: { de: "Familie & Kinder", en: "Family & children", tr: "Aile ve cocuklar", uk: "Rodyna ta dity", es: "Familia e hijos" },
    description: {
      de: "Nur Angaben, die spaeter wirklich hilfreich sein koennen.",
      en: "Only details that can really help later on.",
      tr: "Sadece daha sonra gercekten faydali olabilecek bilgiler.",
      uk: "Tilky dani, yaki spravdi mozhut dopomohty piznishe.",
      es: "Solo datos que de verdad pueden ser utiles mas adelante."
    },
    empty: { de: "Noch keine Familiendaten gespeichert.", en: "No family details saved yet.", tr: "Henuz aile bilgisi kayitli degil.", uk: "Shche nemae zberezhenykh danykh pro simyu.", es: "Todavia no hay datos familiares guardados." },
    fields: [
      { key: "children_count", label: { de: "Anzahl Kinder", en: "Number of children", tr: "Cocuk sayisi", uk: "Kil-kist ditey", es: "Numero de hijos" }, type: "number" },
      { key: "family_constellation", label: { de: "Familiensituation", en: "Family situation", tr: "Aile durumu", uk: "Simeyna sytuatsiya", es: "Situacion familiar" } }
    ]
  },
  {
    key: "residency_details",
    title: { de: "Aufenthalt / Status", en: "Residence / status", tr: "Ikamet / durum", uk: "Perebuvannya / status", es: "Residencia / estado" },
    description: {
      de: "Falls spaeter fuer Antraege relevant, findest du diese Angaben hier.",
      en: "If this later matters for applications, you can find these details here.",
      tr: "Ileride basvurular icin gerekirse bu bilgileri burada bulursun.",
      uk: "Yakshcho tse bude vazhlyvo dlya zayav piznishe, vy znajdete tsi dani tut.",
      es: "Si mas adelante esto es relevante para solicitudes, encontraras estos datos aqui."
    },
    empty: { de: "Noch keine Aufenthaltsdaten gespeichert.", en: "No residence details saved yet.", tr: "Henuz ikamet bilgisi kayitli degil.", uk: "Shche nemae zberezhenykh danykh pro status perebuvannya.", es: "Todavia no hay datos de residencia guardados." },
    fields: [
      { key: "residence_status", label: { de: "Aufenthaltsstatus", en: "Residence status", tr: "Ikamet durumu", uk: "Status perebuvannya", es: "Estado de residencia" } },
      { key: "current_life_phase", label: { de: "Aktuelle Situation", en: "Current situation", tr: "Mevcut durum", uk: "Potocna sytuatsiya", es: "Situacion actual" } }
    ]
  }
];

export function getMyDataCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
}

export function getMyDataText(locale: string | null | undefined, value: Partial<Record<SupportedLanguage, string>>) {
  const normalized = normalizePreferredLanguage(locale);
  return value[normalized] ?? value.en ?? value.de;
}

export function getSectionFieldRows(section: MyDataSectionDefinition, record: UserPersonalDataRecord | null | undefined) {
  const values = (record?.[section.key] ?? {}) as Record<string, unknown>;
  return section.fields
    .map((field) => ({
      field,
      value: values[field.key]
    }))
    .filter((entry) => entry.value !== undefined && entry.value !== null && String(entry.value).trim() !== "");
}

export function formatMyDataValue(locale: string | null | undefined, value: unknown, type?: MyDataFieldDefinition["type"]) {
  if (value === null || value === undefined || String(value).trim() === "") {
    return "";
  }

  if (type === "date") {
    const date = new Date(String(value));
    if (!Number.isNaN(date.getTime())) {
      return new Intl.DateTimeFormat(getDateLocale(normalizePreferredLanguage(locale))).format(date);
    }
  }

  if (type === "number") {
    const numeric = Number(value);
    if (Number.isFinite(numeric)) {
      return new Intl.NumberFormat(getDateLocale(normalizePreferredLanguage(locale))).format(numeric);
    }
  }

  return String(value);
}

export function formatMetaTimestamp(locale: string | null | undefined, timestamp: string | null | undefined) {
  if (!timestamp) {
    return "";
  }

  const date = new Date(timestamp);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat(getDateLocale(normalizePreferredLanguage(locale)), {
    dateStyle: "medium"
  }).format(date);
}

export function getSectionMetaSummary(
  section: UserPersonalDataSectionKey,
  record: UserPersonalDataRecord | null | undefined
) {
  const metaSection = record?.field_meta?.[section];
  if (!metaSection) {
    return null;
  }

  const values = Object.values(metaSection).filter(Boolean);
  if (!values.length) {
    return null;
  }

  const latestUpdatedAt = values
    .map((entry) => entry?.updated_at)
    .filter((entry): entry is string => Boolean(entry))
    .sort()
    .at(-1);
  const latestSource = values
    .sort((left, right) => String(right?.updated_at ?? "").localeCompare(String(left?.updated_at ?? "")))
    .at(0)?.source;
  const allConfirmed = values.every((entry) => entry?.confirmed_by_user);

  return {
    latestUpdatedAt: latestUpdatedAt ?? null,
    latestSource: latestSource ?? null,
    allConfirmed
  };
}

export function getMetaSourceLabel(locale: string | null | undefined, source: string | null | undefined) {
  const copy = getMyDataCopy(locale);

  switch (source) {
    case "application_import":
      return copy.sourceApplicationImport;
    case "document_extracted":
      return copy.sourceDocumentExtracted;
    case "system_inferred":
      return copy.sourceSystemInferred;
    default:
      return copy.sourceUserInput;
  }
}
