import { PDFDocument } from "pdf-lib";

type LocalizedText = Partial<Record<"de" | "en" | "tr" | "uk" | "es", string>>;

type WizardOption = {
  value: string;
  label: LocalizedText;
};

type WizardField = {
  id: string;
  type: "text" | "textarea" | "date" | "number" | "currency" | "select" | "radio";
  label: LocalizedText;
  description?: LocalizedText;
  placeholder?: LocalizedText;
  required?: boolean;
  min?: number;
  max?: number;
  step?: number;
  options?: WizardOption[];
};

type WizardStep = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  fields?: WizardField[];
  summary?: boolean;
};

export type BerlinWohngeldWizardDefinition = {
  procedureId: string;
  intro: LocalizedText;
  nextStepHint: LocalizedText;
  steps: WizardStep[];
};

export type BerlinWohngeldAnswers = Record<string, string | number | boolean | null | undefined>;

export const BERLIN_WOHNGELD_SERVICE_URL = "https://service.berlin.de/dienstleistung/120656/";
export const BERLIN_WOHNGELD_PDF_URL =
  "https://www.berlin.de/sen/sbw/_assets/service/formular-center/bereich-wohnen/bauwohnwog1-1.pdf";

export const berlinWohngeldOfficialForm = {
  region: "Berlin",
  title: {
    de: "Antrag auf Wohngeld als Mietzuschuss",
    en: "Application for housing benefit as rent subsidy"
  },
  version: {
    de: "Offizielles Berliner Formular, Stand Januar 2023",
    en: "Official Berlin form, version January 2023"
  },
  serviceUrl: BERLIN_WOHNGELD_SERVICE_URL,
  pdfUrl: BERLIN_WOHNGELD_PDF_URL
};

const yesNoOptions: WizardOption[] = [
  { value: "yes", label: { de: "Ja", en: "Yes" } },
  { value: "no", label: { de: "Nein", en: "No" } }
];

const applicationTypeOptions: WizardOption[] = [
  { value: "initial", label: { de: "Erstantrag", en: "First application" } },
  { value: "renewal", label: { de: "Weiterleistungsantrag", en: "Renewal application" } }
];

const genderOptions: WizardOption[] = [
  { value: "male", label: { de: "Männlich", en: "Male" } },
  { value: "female", label: { de: "Weiblich", en: "Female" } },
  { value: "diverse", label: { de: "Divers", en: "Diverse" } },
  { value: "no_answer", label: { de: "Keine Angabe", en: "Prefer not to say" } }
];

const familyStatusOptions: WizardOption[] = [
  { value: "single", label: { de: "Ledig", en: "Single" } },
  { value: "married", label: { de: "Verheiratet", en: "Married" } },
  { value: "separated", label: { de: "Getrennt lebend", en: "Separated" } },
  { value: "civil_union", label: { de: "Eingetragene Lebenspartnerschaft", en: "Registered civil partnership" } },
  { value: "divorced", label: { de: "Geschieden", en: "Divorced" } },
  { value: "widowed", label: { de: "Verwitwet", en: "Widowed" } },
  { value: "partner", label: { de: "Nichteheliche Lebenspartnerschaft", en: "Unmarried partnership" } }
];

const employmentOptions: WizardOption[] = [
  { value: "employee", label: { de: "Arbeitnehmer:in", en: "Employee" } },
  { value: "self_employed", label: { de: "Selbstständig", en: "Self-employed" } },
  { value: "student", label: { de: "Azubi / Studium", en: "Apprenticeship / student" } },
  { value: "retired", label: { de: "Rente", en: "Retired" } },
  { value: "unemployed", label: { de: "Arbeitslos", en: "Unemployed" } },
  { value: "other", label: { de: "Nicht erwerbstätig / Sonstiges", en: "Not working / other" } }
];

const tenantRoleOptions: WizardOption[] = [
  { value: "main_tenant", label: { de: "Hauptmieter:in", en: "Main tenant" } },
  { value: "subtenant", label: { de: "Untermieter:in", en: "Subtenant" } }
];

const utilityModeOptions: WizardOption[] = [
  { value: "not_in_rent", label: { de: "Nein", en: "No" } },
  { value: "included", label: { de: "Ja, in der Miete enthalten", en: "Yes, included in rent" } },
  { value: "separate", label: { de: "Ja, ich zahle es separat", en: "Yes, paid separately" } }
];

const frequencyOptions: WizardOption[] = [
  { value: "monthly", label: { de: "Monatlich", en: "Monthly" } },
  { value: "yearly", label: { de: "Jährlich", en: "Yearly" } },
  { value: "once", label: { de: "Einmalig", en: "One-time" } },
  { value: "other", label: { de: "Anders", en: "Other" } }
];

export function getBerlinWohngeldWizardDefinition(): BerlinWohngeldWizardDefinition {
  return {
    procedureId: "wohngeld",
    intro: {
      de: "Dieser Ablauf basiert auf dem offiziellen Berliner Wohngeldantrag. Du beantwortest die Fragen einfacher, und BureauCare füllt daraus den Originalantrag aus.",
      en: "This flow is based on the official Berlin housing benefit form. You answer easier questions, and BureauCare fills the original form from them."
    },
    nextStepHint: {
      de: "Am Ende bekommst du den originalen Berliner Antrag als ausgefüllte PDF.",
      en: "At the end you get the original Berlin application as a filled PDF."
    },
    steps: [
      {
        id: "official-start",
        title: {
          de: "Offizieller Antrag",
          en: "Official application"
        },
        description: {
          de: "Wir starten direkt mit der offiziellen Berliner Formularversion für Mietzuschuss.",
          en: "We start directly with the official Berlin form version for rent subsidy."
        },
        fields: [
          {
            id: "application_type",
            type: "radio",
            label: {
              de: "Welche Art Antrag ist das?",
              en: "What kind of application is this?"
            },
            description: {
              de: "Im Originalformular gibt es Erstantrag oder Weiterleistungsantrag.",
              en: "The original form distinguishes between first application and renewal."
            },
            options: applicationTypeOptions,
            required: true
          },
          {
            id: "reference_number",
            type: "text",
            label: {
              de: "Aktenzeichen oder Wohngeldnummer",
              en: "Reference number or housing benefit number"
            },
            description: {
              de: "Nur wenn du schon eine Nummer hast. Sonst leer lassen.",
              en: "Only if you already have a number. Otherwise leave it empty."
            }
          }
        ]
      },
      {
        id: "applicant",
        title: {
          de: "Angaben zu dir",
          en: "About you"
        },
        description: {
          de: "Diese Angaben stehen auch ganz vorne im offiziellen Antrag.",
          en: "These details also appear right at the start of the official application."
        },
        fields: [
          {
            id: "applicant_last_name",
            type: "text",
            label: { de: "Nachname", en: "Last name" },
            required: true
          },
          {
            id: "applicant_first_names",
            type: "text",
            label: { de: "Vorname(n)", en: "First name(s)" },
            required: true
          },
          {
            id: "applicant_birth_name",
            type: "text",
            label: { de: "Geburtsname", en: "Birth name" }
          },
          {
            id: "applicant_birth_date",
            type: "date",
            label: { de: "Geburtsdatum", en: "Date of birth" },
            required: true
          },
          {
            id: "applicant_birth_place",
            type: "text",
            label: { de: "Geburtsort", en: "Place of birth" }
          },
          {
            id: "applicant_nationality",
            type: "text",
            label: { de: "Staatsangehörigkeit", en: "Nationality" }
          },
          {
            id: "applicant_gender",
            type: "select",
            label: { de: "Geschlecht", en: "Gender" },
            options: genderOptions,
            required: true
          },
          {
            id: "applicant_phone",
            type: "text",
            label: { de: "Telefonnummer", en: "Phone number" }
          },
          {
            id: "applicant_email",
            type: "text",
            label: { de: "E-Mail", en: "Email" }
          },
          {
            id: "family_status",
            type: "select",
            label: { de: "{{familienstand|Familienstand}}", en: "{{familienstand|Family status}}" },
            options: familyStatusOptions,
            required: true
          },
          {
            id: "employment_status",
            type: "select",
            label: { de: "Berufliche Situation", en: "Work situation" },
            options: employmentOptions,
            required: true
          }
        ]
      },
      {
        id: "home",
        title: {
          de: "Deine Wohnung",
          en: "Your home"
        },
        description: {
          de: "Jetzt kommen die Felder, die im Berliner Antrag zur Wohnung und Miete abgefragt werden.",
          en: "Next are the fields the Berlin form asks about your home and rent."
        },
        fields: [
          {
            id: "housing_street",
            type: "text",
            label: { de: "Straße", en: "Street" },
            required: true
          },
          {
            id: "housing_house_number",
            type: "text",
            label: { de: "Hausnummer", en: "House number" },
            required: true
          },
          {
            id: "housing_postal_code",
            type: "text",
            label: { de: "Postleitzahl", en: "Postal code" },
            required: true
          },
          {
            id: "housing_city",
            type: "text",
            label: { de: "Ort", en: "City" },
            required: true,
            placeholder: { de: "Berlin", en: "Berlin" }
          },
          {
            id: "move_in_date",
            type: "date",
            label: { de: "Seit wann wohnst du dort?", en: "Since when do you live there?" },
            required: true
          },
          {
            id: "publicly_subsidized_home",
            type: "radio",
            label: { de: "Ist die Wohnung öffentlich gefördert?", en: "Is the apartment publicly subsidized?" },
            options: yesNoOptions,
            required: true
          },
          {
            id: "other_home",
            type: "radio",
            label: { de: "Gibt es noch eine andere Wohnung?", en: "Is there another apartment?" },
            options: yesNoOptions,
            required: true
          },
          {
            id: "second_home",
            type: "radio",
            label: { de: "Ist das ein Zweitwohnsitz?", en: "Is this a second residence?" },
            options: yesNoOptions,
            required: true
          },
          {
            id: "tenant_role",
            type: "radio",
            label: { de: "Wie wohnst du dort?", en: "What is your tenant role?" },
            options: tenantRoleOptions,
            required: true
          },
          {
            id: "apartment_size_sqm",
            type: "number",
            label: { de: "Wohnungsgröße in m²", en: "Apartment size in m²" },
            min: 1,
            step: 0.5
          },
          {
            id: "monthly_rent",
            type: "currency",
            label: { de: "{{warmmiete|Monatliche Miete}}", en: "{{warmmiete|Monthly rent}}" },
            description: {
              de: "Trage hier den Betrag ein, den du im Antrag als Miete angibst.",
              en: "Enter the amount you want to state as rent in the application."
            },
            required: true
          },
          {
            id: "heating_mode",
            type: "select",
            label: { de: "Heizkosten", en: "Heating costs" },
            options: utilityModeOptions,
            required: true
          },
          {
            id: "heating_amount",
            type: "currency",
            label: { de: "Heizkosten pro Monat", en: "Heating costs per month" }
          },
          {
            id: "warmwater_mode",
            type: "select",
            label: { de: "Warmwasser", en: "Hot water" },
            options: utilityModeOptions,
            required: true
          },
          {
            id: "warmwater_amount",
            type: "currency",
            label: { de: "Warmwasser pro Monat", en: "Hot water per month" }
          }
        ]
      },
      {
        id: "household",
        title: {
          de: "Weitere Personen im Haushalt",
          en: "Other household members"
        },
        description: {
          de: "Im Originalformular gibt es mehrere Zeilen für Menschen, die mit dir wohnen. Hier kannst du die ersten zwei direkt eintragen.",
          en: "The original form has multiple rows for people who live with you. Here you can fill in the first two directly."
        },
        fields: [
          {
            id: "household_member_1_last_name",
            type: "text",
            label: { de: "1. Person: Nachname", en: "Person 1: Last name" }
          },
          {
            id: "household_member_1_first_names",
            type: "text",
            label: { de: "1. Person: Vorname(n)", en: "Person 1: First name(s)" }
          },
          {
            id: "household_member_1_birth_date",
            type: "date",
            label: { de: "1. Person: Geburtsdatum", en: "Person 1: Date of birth" }
          },
          {
            id: "household_member_1_relationship",
            type: "text",
            label: { de: "1. Person: Verhältnis zu dir", en: "Person 1: Relationship to you" }
          },
          {
            id: "household_member_1_family_status",
            type: "text",
            label: { de: "1. Person: Familienstand", en: "Person 1: Family status" }
          },
          {
            id: "household_member_1_employment_status",
            type: "text",
            label: { de: "1. Person: Berufliche Situation", en: "Person 1: Work situation" }
          },
          {
            id: "household_member_2_last_name",
            type: "text",
            label: { de: "2. Person: Nachname", en: "Person 2: Last name" }
          },
          {
            id: "household_member_2_first_names",
            type: "text",
            label: { de: "2. Person: Vorname(n)", en: "Person 2: First name(s)" }
          },
          {
            id: "household_member_2_birth_date",
            type: "date",
            label: { de: "2. Person: Geburtsdatum", en: "Person 2: Date of birth" }
          },
          {
            id: "household_member_2_relationship",
            type: "text",
            label: { de: "2. Person: Verhältnis zu dir", en: "Person 2: Relationship to you" }
          },
          {
            id: "household_member_2_family_status",
            type: "text",
            label: { de: "2. Person: Familienstand", en: "Person 2: Family status" }
          },
          {
            id: "household_member_2_employment_status",
            type: "text",
            label: { de: "2. Person: Berufliche Situation", en: "Person 2: Work situation" }
          }
        ]
      },
      {
        id: "income-and-payment",
        title: {
          de: "Einkommen und Auszahlung",
          en: "Income and payout"
        },
        description: {
          de: "Diese Angaben helfen beim Originalantrag für Einkommen und die spätere Auszahlung.",
          en: "These details help fill the original form for income and the later payout."
        },
        fields: [
          {
            id: "primary_income_type",
            type: "text",
            label: { de: "{{einkommensnachweis|Art deines Einkommens}}", en: "{{einkommensnachweis|Type of your income}}" },
            placeholder: { de: "Zum Beispiel Gehalt, Rente oder Unterhalt", en: "For example salary, pension or maintenance" }
          },
          {
            id: "primary_income_amount",
            type: "currency",
            label: { de: "{{bruttoeinkommen|Bruttoeinkommen}}", en: "{{bruttoeinkommen|Gross income}}" }
          },
          {
            id: "primary_income_frequency",
            type: "select",
            label: { de: "Wie oft kommt dieses Einkommen?", en: "How often do you receive this income?" },
            options: frequencyOptions
          },
          {
            id: "income_taxes_paid",
            type: "radio",
            label: { de: "Werden davon Steuern abgezogen?", en: "Are taxes deducted from it?" },
            options: yesNoOptions
          },
          {
            id: "income_pension_paid",
            type: "radio",
            label: { de: "Wird Rentenversicherung oder Lebensversicherung gezahlt?", en: "Is pension or life insurance paid?" },
            options: yesNoOptions
          },
          {
            id: "income_health_paid",
            type: "radio",
            label: { de: "Wird Krankenversicherung gezahlt?", en: "Is health insurance paid?" },
            options: yesNoOptions
          },
          {
            id: "payment_recipient_name",
            type: "text",
            label: { de: "An wen soll das Wohngeld überwiesen werden?", en: "Who should receive the payment?" },
            required: true
          },
          {
            id: "payment_iban",
            type: "text",
            label: { de: "IBAN", en: "IBAN" },
            required: true
          },
          {
            id: "payment_bank_name",
            type: "text",
            label: { de: "Name der Bank", en: "Bank name" }
          }
        ]
      },
      {
        id: "documents",
        title: {
          de: "Unterlagen prüfen",
          en: "Check documents"
        },
        description: {
          de: "Diese Angaben landen nicht direkt als Feld in der PDF, helfen dir aber bei den nächsten echten Schritten.",
          en: "These details are not written directly into the PDF but help with the real next steps."
        },
        fields: [
          {
            id: "has_rental_contract",
            type: "radio",
            label: { de: "Hast du einen Mietvertrag?", en: "Do you have your rental contract?" },
            options: yesNoOptions,
            required: true
          },
          {
            id: "has_income_proofs",
            type: "radio",
            label: { de: "Hast du {{einkommensnachweis|Einkommensnachweise}}?", en: "Do you have {{einkommensnachweis|income proofs}}?" },
            options: yesNoOptions,
            required: true
          },
          {
            id: "has_bank_statements",
            type: "radio",
            label: { de: "Hast du aktuelle Kontoauszüge?", en: "Do you have current bank statements?" },
            options: yesNoOptions,
            required: true
          },
          {
            id: "documents_note",
            type: "textarea",
            label: { de: "Was fehlt noch oder ist unklar?", en: "What is still missing or unclear?" },
            placeholder: { de: "Zum Beispiel Aufenthaltsnachweis oder Nachweise für andere Personen", en: "For example residence permit or documents for other people" }
          }
        ]
      },
      {
        id: "summary",
        title: { de: "Zusammenfassung", en: "Summary" },
        description: {
          de: "Im nächsten Schritt kannst du den originalen Berliner Antrag herunterladen.",
          en: "In the next step you can download the original Berlin application."
        },
        summary: true
      }
    ]
  };
}

function getValue(answers: BerlinWohngeldAnswers, key: string) {
  const value = answers[key];
  if (value === null || value === undefined) return "";
  return String(value).trim();
}

function formatDate(value: string) {
  if (!value) return "";
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return value;
  return `${match[3]}.${match[2]}.${match[1]}`;
}

function setText(form: ReturnType<PDFDocument["getForm"]>, fieldName: string, value: string) {
  const normalized = value.trim();
  if (!normalized) return;

  try {
    form.getTextField(fieldName).setText(normalized);
  } catch {}
}

function setCheckbox(form: ReturnType<PDFDocument["getForm"]>, fieldName: string, checked: boolean) {
  try {
    const field = form.getCheckBox(fieldName);
    if (checked) {
      field.check();
    } else {
      field.uncheck();
    }
  } catch {}
}

function setMappedCheckbox(form: ReturnType<PDFDocument["getForm"]>, base: Record<string, string>, selectedValue: string) {
  Object.entries(base).forEach(([value, fieldName]) => {
    setCheckbox(form, fieldName, selectedValue === value);
  });
}

function writeIban(form: ReturnType<PDFDocument["getForm"]>, iban: string) {
  const cleaned = iban.replace(/\s+/g, "").toUpperCase();
  for (let index = 0; index < 33; index += 1) {
    const char = cleaned[index] ?? "";
    setText(form, `MZ1.3-AN_IBAN${index + 1}`, char);
  }
}

export async function buildBerlinWohngeldPdf(answers: BerlinWohngeldAnswers) {
  const response = await fetch(BERLIN_WOHNGELD_PDF_URL, { cache: "force-cache" });

  if (!response.ok) {
    throw new Error(`Could not load Berlin Wohngeld PDF (${response.status})`);
  }

  const sourceBytes = await response.arrayBuffer();
  const pdf = await PDFDocument.load(sourceBytes);
  const form = pdf.getForm();

  setCheckbox(form, "MZ1.3-CB_AllgAntragstyp_Erstantrag", getValue(answers, "application_type") !== "renewal");
  setCheckbox(form, "MZ1.3-CB_AllgAntragstyp_Weiterleistungsantrag", getValue(answers, "application_type") === "renewal");
  setText(form, "MZ1.3-MTF_AllgAnschWoGB", "Wohngeldstelle Berlin");
  setText(form, "MZ1.3-MTF_AllgWoGNR_AKZ", getValue(answers, "reference_number"));

  setText(form, "MZ1.3-ET_PersAngFamilienname", getValue(answers, "applicant_last_name"));
  setText(form, "MZ1.3-ET_PersAngVornamen", getValue(answers, "applicant_first_names"));
  setText(form, "MZ1.3-ET_PersAngGeburtsname", getValue(answers, "applicant_birth_name"));
  setText(form, "MZ1.3-DA_PersAngGeburtsdatum", formatDate(getValue(answers, "applicant_birth_date")));
  setText(form, "MZ1.3-ET_PersAngGeburtsort", getValue(answers, "applicant_birth_place"));
  setText(form, "MZ1.3-ET_PersAngStaatsangehörigkeit", getValue(answers, "applicant_nationality"));
  setText(form, "MZ1.3-ET_PersAngTelefonnummer", getValue(answers, "applicant_phone"));
  setText(form, "MZ1.3-ET_PersAngE-Mail", getValue(answers, "applicant_email"));

  setMappedCheckbox(
    form,
    {
      male: "MZ1.3-CB_PersAngGeschlechtMännlich",
      female: "MZ1.3-CB_PersAngGeschlechtWeiblich",
      diverse: "MZ1.3-CB_PersAngGeschlechtDivers",
      no_answer: "MZ1.3-CB_PersAngGeschlechtKeineAngabe"
    },
    getValue(answers, "applicant_gender")
  );

  setMappedCheckbox(
    form,
    {
      single: "MZ1.3-CB_PersAngFamStandledig",
      married: "MZ1.3-CB_PersAngFamStandverheiratet",
      separated: "MZ1.3-CB_PersAngFamStandgetrenntlebend",
      civil_union: "MZ1.3-CB_PersAngFamStandeingLebenspartner",
      divorced: "MZ1.3-CB_PersAngFamStandgeschieden",
      widowed: "MZ1.3-CB_PersAngFamStandverwitwet",
      partner: "MZ1.3-CB_PersAngFamStandnichtehelicheLebenspartner"
    },
    getValue(answers, "family_status")
  );

  setMappedCheckbox(
    form,
    {
      employee: "MZ1.3-CB_PersAngErwerbArbeitnehmer",
      self_employed: "MZ1.3-CB_PersAngErwerbSelbständiger",
      student: "MZ1.3-CB_PersAngErwerbAzubi",
      retired: "MZ1.3-CB_PersAngErwerbRentner",
      unemployed: "MZ1.3-CB_PersAngErwerbArbeitslos",
      other: "MZ1.3-CB_PersAngErwerbNichterwerbsperson"
    },
    getValue(answers, "employment_status")
  );

  setText(form, "MZ1.3-ET_WohnungAnschriftStraße", getValue(answers, "housing_street"));
  setText(form, "MZ1.3-ET_WohnungAnschriftHausnummer", getValue(answers, "housing_house_number"));
  setText(form, "MZ1.3-ET_WohnungAnschriftPostleitzahl", getValue(answers, "housing_postal_code"));
  setText(form, "MZ1.3-ET_WohnungAnschriftWohnort", getValue(answers, "housing_city") || "Berlin");
  setText(form, "MZ1.3-DA_WohnungZKAnschriftEinzugsdatum", formatDate(getValue(answers, "move_in_date")));
  setCheckbox(form, "MZ1.3-CB_WohnungGefördertJa", getValue(answers, "publicly_subsidized_home") === "yes");
  setCheckbox(form, "MZ1.3-CB_WohnungGefördertNein", getValue(answers, "publicly_subsidized_home") === "no");
  setCheckbox(form, "MZ1.3-CB_WohnungAndereWohnungJa", getValue(answers, "other_home") === "yes");
  setCheckbox(form, "MZ1.3-CB_WohnungAndereWohnungNein", getValue(answers, "other_home") === "no");
  setCheckbox(form, "MZ1.3-CB_WohnungZweitwohnsitzJa", getValue(answers, "second_home") === "yes");
  setCheckbox(form, "MZ1.3-CB_WohnungZweitwohnsitzNein", getValue(answers, "second_home") === "no");
  setCheckbox(form, "MZ1.3-CB_IchBinHauptmieter", getValue(answers, "tenant_role") === "main_tenant");
  setCheckbox(form, "MZ1.3-CB_IchBinUntermieter", getValue(answers, "tenant_role") === "subtenant");
  setText(form, "MZ1.3-ET_MieteGrößeWohnung", getValue(answers, "apartment_size_sqm"));
  setText(form, "MZ1.3-ET_MieteGesamt", getValue(answers, "monthly_rent"));

  setMappedCheckbox(
    form,
    {
      not_in_rent: "MZ1.3-CB_MonatMieteHeizkostemNein",
      included: "MZ1.3-CB_MonatMieteHeizkostemJa",
      separate: "MZ1.3-CB_MonatMieteHeizkostemJaGesond"
    },
    getValue(answers, "heating_mode")
  );
  setText(form, "MZ1.3-ET_MonatMieteHeizkostemBetrag", getValue(answers, "heating_amount"));

  setMappedCheckbox(
    form,
    {
      not_in_rent: "MZ1.3-CB_MonatMieteWarmwasserNein",
      included: "MZ1.3-CB_MonatMieteWarmwasserJa",
      separate: "MZ1.3-CB_MonatMieteWarmwasserJaGesond"
    },
    getValue(answers, "warmwater_mode")
  );
  setText(form, "MZ1.3-ET_MonatMieteWarmwasserBetrag", getValue(answers, "warmwater_amount"));

  setText(form, "MZ1.3-ET_HaushaltHHM1Familienname", getValue(answers, "household_member_1_last_name"));
  setText(form, "MZ1.3-ET_ HaushaltHHM1Vornamen", getValue(answers, "household_member_1_first_names"));
  setText(form, "MZ1.3-DA_ HaushaltHHM1Geburtsdatum", formatDate(getValue(answers, "household_member_1_birth_date")));
  setText(form, "MZ1.3-ET_ HaushaltHHM1VerhältnisAngP", getValue(answers, "household_member_1_relationship"));
  setText(form, "MZ1.3-ET_ HaushaltHHM1FamStand", getValue(answers, "household_member_1_family_status"));
  setText(form, "MZ1.3-ET_ HaushaltHHM1ErwerbStatus", getValue(answers, "household_member_1_employment_status"));

  setText(form, "MZ1.3-ET_HaushaltHHM2Familienname", getValue(answers, "household_member_2_last_name"));
  setText(form, "MZ1.3-ET_ HaushaltHHM2Vornamen", getValue(answers, "household_member_2_first_names"));
  setText(form, "MZ1.3-DA_ HaushaltHHM2Geburtsdatum", formatDate(getValue(answers, "household_member_2_birth_date")));
  setText(form, "MZ1.3-ET_ HaushaltHHM2VerhältnisAngP", getValue(answers, "household_member_2_relationship"));
  setText(form, "MZ1.3-ET_ HaushaltHHM2FamStand", getValue(answers, "household_member_2_family_status"));
  setText(form, "MZ1.3-ET_ HaushaltHHM2ErwerbStatus", getValue(answers, "household_member_2_employment_status"));

  setText(form, "MZ1.3-ET_EinnahmeHHM1Familienname", getValue(answers, "applicant_last_name"));
  setText(form, "MZ1.3-ET_EinnahmeHHM1Vorname", getValue(answers, "applicant_first_names"));
  setText(form, "MZ1.3-ET_EinnahmeHHM1Art1", getValue(answers, "primary_income_type"));
  setText(form, "MZ1.3-ET_EinnahmeHHM1Art1Brutto", getValue(answers, "primary_income_amount"));
  setText(form, "MZ1.3-ET_EinnahmeHHM1Art1Turnus", getValue(answers, "primary_income_frequency"));
  setCheckbox(form, "MZ1.3-CB_EinnahmeHHM1Steuern", getValue(answers, "income_taxes_paid") === "yes");
  setCheckbox(form, "MZ1.3-CB_EinnahmeHHM1RVLV", getValue(answers, "income_pension_paid") === "yes");
  setCheckbox(form, "MZ1.3-CB_EinnahmeHHM1KV", getValue(answers, "income_health_paid") === "yes");

  setText(form, "MZ1.3-ET_AuszahlungName", getValue(answers, "payment_recipient_name"));
  writeIban(form, getValue(answers, "payment_iban"));
  setText(form, "MZ1.3-ET_AuszahlungNameBank", getValue(answers, "payment_bank_name"));

  form.flatten();
  return pdf.save();
}
