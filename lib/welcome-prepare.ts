import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type {
  ContactDetails,
  HouseholdDetails,
  IncomeDetails,
  PersonalDetails,
  ResidencyDetails,
  UserPersonalDataRecord,
  UserPersonalDataSectionKey,
  WelcomeProfileRecord,
  WelcomeStepPreparationAnswers
} from "@/lib/types";
import type { WelcomeStepKey } from "@/lib/welcome";

export type WelcomePrepareFieldType = "text" | "date" | "number" | "email" | "tel" | "select" | "radio";
export type LocalizedText = Partial<Record<SupportedLanguage, string>>;

export type WelcomePrepareField = {
  id: string;
  type: WelcomePrepareFieldType;
  label: LocalizedText;
  description?: LocalizedText;
  placeholder?: LocalizedText;
  required?: boolean;
  options?: Array<{ value: string; label: LocalizedText }>;
};

export type WelcomePrepareSection = {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  fields: WelcomePrepareField[];
};

export type WelcomePrepareDefinition = {
  stepKey: WelcomeStepKey;
  title: LocalizedText;
  intro: LocalizedText;
  ctaLabel: LocalizedText;
  relatedProcessSlug?: string;
  sections: WelcomePrepareSection[];
};

const DEFINITIONS: Partial<Record<WelcomeStepKey, WelcomePrepareDefinition>> = {
  city_registration: {
    stepKey: "city_registration",
    title: { de: "Anmeldeformular vorbereiten", en: "Prepare registration details", zh: "准备住址登记资料" },
    intro: {
      de: "BureauCare fuellt schon bekannte Angaben fuer deine Anmeldung vor. Du musst nur noch fehlende Informationen ergaenzen.",
      en: "BureauCare pre-fills known registration details for you. You only add what is still missing.",
      zh: "BureauCare 会先帮你填入已知信息。你只需要补充缺少的内容。"
    },
    ctaLabel: { de: "Anmeldeformular vorbereiten", en: "Prepare registration details", zh: "准备住址登记资料" },
    relatedProcessSlug: "ummelden",
    sections: [
      {
        id: "identity",
        title: { de: "Persoenliche Daten", en: "Personal details", zh: "个人信息" },
        description: {
          de: "Diese Angaben stehen oft direkt auf dem Anmeldeformular.",
          en: "These details often appear directly on the registration form.",
          zh: "这些信息通常会直接出现在登记表上。"
        },
        fields: [
          { id: "first_name", type: "text", label: { de: "Vorname", en: "First name", zh: "名字" }, required: true },
          { id: "last_name", type: "text", label: { de: "Nachname", en: "Last name", zh: "姓氏" }, required: true },
          { id: "birth_date", type: "date", label: { de: "Geburtsdatum", en: "Date of birth", zh: "出生日期" }, required: true },
          { id: "nationality", type: "text", label: { de: "Staatsangehoerigkeit", en: "Nationality", zh: "国籍" } }
        ]
      },
      {
        id: "address",
        title: { de: "Adresse", en: "Address", zh: "地址" },
        description: {
          de: "Damit BureauCare die neue Adresse fuer die Anmeldung vorbereiten kann.",
          en: "So BureauCare can prepare the new address for registration.",
          zh: "这样 BureauCare 就可以为住址登记准备你的新地址。"
        },
        fields: [
          { id: "street", type: "text", label: { de: "Strasse", en: "Street", zh: "街道" }, required: true },
          { id: "house_number", type: "text", label: { de: "Hausnummer", en: "House number", zh: "门牌号" }, required: true },
          { id: "postal_code", type: "text", label: { de: "Postleitzahl", en: "Postal code", zh: "邮编" }, required: true },
          { id: "city", type: "text", label: { de: "Stadt", en: "City", zh: "城市" }, required: true },
          { id: "move_in_date", type: "date", label: { de: "Einzugsdatum", en: "Move-in date", zh: "入住日期" }, required: true }
        ]
      }
    ]
  },
  health_insurance: {
    stepKey: "health_insurance",
    title: { de: "Angaben fuer Krankenversicherung vorbereiten", en: "Prepare health insurance details", zh: "准备医保相关信息" },
    intro: {
      de: "Wir sammeln nur die Angaben, die fuer deine Krankenversicherung jetzt wirklich wichtig sind.",
      en: "We only ask for the details that matter most for your health insurance right now.",
      zh: "我们只收集你现在办理医保真正需要的信息。"
    },
    ctaLabel: { de: "Angaben vorbereiten", en: "Prepare details", zh: "准备信息" },
    sections: [
      {
        id: "status",
        title: { de: "Deine Situation", en: "Your situation", zh: "你的情况" },
        description: {
          de: "Diese Angaben helfen dabei, die passende Versicherungsart einzuordnen.",
          en: "These details help narrow down the right type of insurance.",
          zh: "这些信息可以帮助判断更适合你的保险类型。"
        },
        fields: [
          {
            id: "employment_status",
            type: "select",
            label: { de: "Was passt gerade am besten?", en: "What fits best right now?", zh: "你现在最符合哪种情况？" },
            required: true,
            options: [
              { value: "employed", label: { de: "Ich arbeite", en: "I am working", zh: "我在工作" } },
              { value: "student", label: { de: "Ich studiere", en: "I am studying", zh: "我在读书" } },
              { value: "training", label: { de: "Ich mache eine Ausbildung", en: "I am in training", zh: "我在接受职业培训" } },
              { value: "not_working", label: { de: "Ich arbeite gerade nicht", en: "I am not working right now", zh: "我目前没有工作" } }
            ]
          },
          {
            id: "insurance_status",
            type: "radio",
            label: { de: "Hast du schon eine Krankenversicherung?", en: "Do you already have health insurance?", zh: "你已经有医疗保险了吗？" },
            required: true,
            options: [
              { value: "yes", label: { de: "Ja", en: "Yes", zh: "有" } },
              { value: "no", label: { de: "Nein", en: "No", zh: "没有" } },
              { value: "unknown", label: { de: "Ich bin nicht sicher", en: "I am not sure", zh: "我不确定" } }
            ]
          },
          {
            id: "family_insurance_relevant",
            type: "radio",
            label: { de: "Koennte Familienversicherung fuer dich passen?", en: "Could family insurance apply to you?", zh: "你可能适合家庭联保吗？" },
            options: [
              { value: "yes", label: { de: "Ja", en: "Yes", zh: "可能适合" } },
              { value: "no", label: { de: "Nein", en: "No", zh: "不适合" } },
              { value: "unknown", label: { de: "Weiss nicht", en: "Not sure", zh: "不确定" } }
            ]
          }
        ]
      },
      {
        id: "contact",
        title: { de: "Kontakt", en: "Contact", zh: "联系方式" },
        description: {
          de: "Viele Krankenkassen fragen nach E-Mail und Telefonnummer.",
          en: "Many health insurers ask for your email and phone number.",
          zh: "很多医保机构会询问你的邮箱和手机号。"
        },
        fields: [
          { id: "email", type: "email", label: { de: "E-Mail", en: "Email", zh: "邮箱" } },
          { id: "phone", type: "tel", label: { de: "Telefonnummer", en: "Phone number", zh: "手机号" } }
        ]
      }
    ]
  },
  bank_account: {
    stepKey: "bank_account",
    title: { de: "Unterlagen fuer Bankkonto vorbereiten", en: "Prepare bank account details", zh: "准备银行开户资料" },
    intro: {
      de: "Hier sammelst du die Angaben, die Banken oft als erstes brauchen.",
      en: "Here you collect the details banks often need first.",
      zh: "这里会整理银行开户通常最先需要的信息。"
    },
    ctaLabel: { de: "Unterlagen vorbereiten", en: "Prepare details", zh: "准备开户资料" },
    sections: [
      {
        id: "identity",
        title: { de: "Persoenliche Angaben", en: "Personal details", zh: "个人信息" },
        description: { de: "Name und Kontaktdaten fuer die Kontoeroeffnung.", en: "Name and contact details for opening the account.", zh: "开户需要的姓名和联系方式。" },
        fields: [
          { id: "first_name", type: "text", label: { de: "Vorname", en: "First name", zh: "名字" }, required: true },
          { id: "last_name", type: "text", label: { de: "Nachname", en: "Last name", zh: "姓氏" }, required: true },
          { id: "email", type: "email", label: { de: "E-Mail", en: "Email", zh: "邮箱" }, required: true },
          { id: "phone", type: "tel", label: { de: "Mobilnummer", en: "Mobile number", zh: "手机号" } }
        ]
      },
      {
        id: "address",
        title: { de: "Adresse und Status", en: "Address and status", zh: "地址和状态" },
        description: { de: "Banken fragen oft nach deiner Adresse und manchmal nach deinem Status in Deutschland.", en: "Banks often ask for your address and sometimes your status in Germany.", zh: "银行通常会询问你的地址，有时也会问你在德国的身份状态。" },
        fields: [
          { id: "street", type: "text", label: { de: "Strasse", en: "Street", zh: "街道" }, required: true },
          { id: "house_number", type: "text", label: { de: "Hausnummer", en: "House number", zh: "门牌号" }, required: true },
          { id: "postal_code", type: "text", label: { de: "Postleitzahl", en: "Postal code", zh: "邮编" }, required: true },
          { id: "city", type: "text", label: { de: "Stadt", en: "City", zh: "城市" }, required: true },
          { id: "residence_status", type: "text", label: { de: "Aufenthaltsstatus", en: "Residence status", zh: "居留状态" } }
        ]
      }
    ]
  },
  residence_permit: {
    stepKey: "residence_permit",
    title: { de: "Antrag fuer Aufenthalt vorbereiten", en: "Prepare residence permit details", zh: "准备居留申请资料" },
    intro: {
      de: "BureauCare sammelt hier die wichtigsten Angaben fuer deinen Aufenthaltstitel in kleinen Schritten.",
      en: "BureauCare collects the most important residence permit details here in small steps.",
      zh: "BureauCare 会在这里分几小步整理居留申请最重要的信息。"
    },
    ctaLabel: { de: "Antrag vorbereiten", en: "Prepare application", zh: "准备申请" },
    relatedProcessSlug: "visum",
    sections: [
      {
        id: "identity",
        title: { de: "Grunddaten", en: "Basic details", zh: "基础信息" },
        description: { de: "Das ist die Grundlage fuer viele Aufenthaltsschritte.", en: "These are the basics for many residence permit steps.", zh: "这些是办理居留手续的基础信息。" },
        fields: [
          { id: "first_name", type: "text", label: { de: "Vorname", en: "First name", zh: "名字" }, required: true },
          { id: "last_name", type: "text", label: { de: "Nachname", en: "Last name", zh: "姓氏" }, required: true },
          { id: "birth_date", type: "date", label: { de: "Geburtsdatum", en: "Date of birth", zh: "出生日期" }, required: true },
          { id: "nationality", type: "text", label: { de: "Staatsangehoerigkeit", en: "Nationality", zh: "国籍" }, required: true }
        ]
      },
      {
        id: "residence",
        title: { de: "Grund fuer deinen Aufenthalt", en: "Reason for your stay", zh: "你的来德原因" },
        description: { de: "So kann BureauCare den passenden Antrag spaeter besser einordnen.", en: "This helps BureauCare match the right permit flow later.", zh: "这样 BureauCare 之后可以更准确地匹配合适的申请流程。" },
        fields: [
          {
            id: "welcome_reason",
            type: "select",
            label: { de: "Warum bist du in Deutschland?", en: "Why are you in Germany?", zh: "你为什么来德国？" },
            required: true,
            options: [
              { value: "study", label: { de: "Studium", en: "Study", zh: "留学" } },
              { value: "work", label: { de: "Arbeit", en: "Work", zh: "工作" } },
              { value: "training", label: { de: "Ausbildung", en: "Training", zh: "职业培训" } },
              { value: "family", label: { de: "Familie", en: "Family", zh: "家庭" } },
              { value: "au_pair", label: { de: "Au-pair", en: "Au-pair", zh: "互惠生" } },
              { value: "refugee", label: { de: "Gefluechtet / Asyl", en: "Refugee / asylum", zh: "难民 / 庇护" } },
              { value: "other", label: { de: "Sonstiges", en: "Other", zh: "其他" } }
            ]
          },
          { id: "city", type: "text", label: { de: "Stadt", en: "City", zh: "城市" }, required: true },
          {
            id: "registration_status",
            type: "radio",
            label: { de: "Bist du schon angemeldet?", en: "Have you registered your address already?", zh: "你已经办好住址登记了吗？" },
            options: [
              { value: "yes", label: { de: "Ja", en: "Yes", zh: "是" } },
              { value: "no", label: { de: "Nein", en: "No", zh: "否" } },
              { value: "unknown", label: { de: "Weiss nicht", en: "Not sure", zh: "不确定" } }
            ]
          }
        ]
      }
    ]
  },
  broadcast_fee: {
    stepKey: "broadcast_fee",
    title: { de: "Rundfunkbeitrag vorbereiten", en: "Prepare broadcast fee details", zh: "准备广播电视费资料" },
    intro: {
      de: "BureauCare sammelt nur die Wohnungsdaten, die fuer diesen Schritt spaeter wichtig werden.",
      en: "BureauCare only asks for the housing details that matter for this step later on.",
      zh: "BureauCare 只会询问之后办理这一步真正需要的住房信息。"
    },
    ctaLabel: { de: "Angaben vorbereiten", en: "Prepare details", zh: "准备信息" },
    sections: [
      {
        id: "housing",
        title: { de: "Wohnung", en: "Housing", zh: "住房信息" },
        description: { de: "Diese Angaben helfen bei der Wohnung und beim Rundfunkbeitrag.", en: "These details help with the home and broadcast fee step.", zh: "这些信息会帮助处理住房和广播电视费这一步。" },
        fields: [
          { id: "street", type: "text", label: { de: "Strasse", en: "Street", zh: "街道" }, required: true },
          { id: "house_number", type: "text", label: { de: "Hausnummer", en: "House number", zh: "门牌号" }, required: true },
          { id: "postal_code", type: "text", label: { de: "Postleitzahl", en: "Postal code", zh: "邮编" }, required: true },
          { id: "city", type: "text", label: { de: "Stadt", en: "City", zh: "城市" }, required: true },
          {
            id: "housing_status",
            type: "select",
            label: { de: "Wohnsituation", en: "Housing situation", zh: "住房情况" },
            options: [
              { value: "rent", label: { de: "Miete", en: "Rent", zh: "租房" } },
              { value: "subrent", label: { de: "Untermiete", en: "Sublet", zh: "转租" } },
              { value: "temporary", label: { de: "Voruebergehend", en: "Temporary", zh: "临时居住" } }
            ]
          },
          { id: "household_size", type: "number", label: { de: "Personen im Haushalt", en: "People in the household", zh: "同住人数" } }
        ]
      }
    ]
  }
};

type PrepareCopy = {
  pageTitle: string;
  pageText: string;
  backToDetail: string;
  progress: string;
  next: string;
  previous: string;
  finish: string;
  saveStateSaving: string;
  saveStateSaved: string;
  saveStateLocal: string;
  saveStateError: string;
  knownDataTitle: string;
  knownDataText: string;
  useKnownData: string;
  reviewFirst: string;
  skipKnownData: string;
  saveForLaterTitle: string;
  saveForLaterText: string;
  saveForLaterToggle: string;
  updateSavedToggle: string;
  savedForFuture: string;
  missingError: string;
  missingSectionError: string;
  preparedTitle: string;
  preparedText: string;
  openProcess: string;
};

const prepareCopyMap: Partial<Record<SupportedLanguage, PrepareCopy>> = {
  de: {
    pageTitle: "Vorbereitung mit BureauCare",
    pageText: "Wir verwenden bekannte Angaben, fragen nur das Wichtige nach und bereiten diesen Schritt ruhig fuer dich vor.",
    backToDetail: "Zurueck zum Schritt",
    progress: "Schritt {current} von {total}",
    next: "Weiter",
    previous: "Zurueck",
    finish: "Vorbereitung speichern",
    saveStateSaving: "Wird gespeichert...",
    saveStateSaved: "Gespeichert",
    saveStateLocal: "Lokal gesichert",
    saveStateError: "Speichern fehlgeschlagen",
    knownDataTitle: "Bekannte Angaben gefunden",
    knownDataText: "Wir haben bereits passende Angaben von dir. Du kannst sie uebernehmen und danach immer noch aendern.",
    useKnownData: "Ja, uebernehmen",
    reviewFirst: "Erst pruefen",
    skipKnownData: "Nicht verwenden",
    saveForLaterTitle: "Fuer spaetere Schritte merken",
    saveForLaterText: "Wenn du neue oder geaenderte Angaben speicherst, kann BureauCare sie spaeter wiederverwenden.",
    saveForLaterToggle: "Diese Angaben fuer spaetere Schritte speichern",
    updateSavedToggle: "Gespeicherte Angaben mit diesem Stand aktualisieren",
    savedForFuture: "Diese Angaben wurden fuer spaetere Schritte vorbereitet.",
    missingError: "Bitte fuelle die markierten Felder aus.",
    missingSectionError: "Bitte fuelle zuerst die fehlenden Angaben aus.",
    preparedTitle: "Schon vorbereitet",
    preparedText: "Diese Vorbereitung ist die Grundlage fuer spaetere Formulare und Antraege im Welcome Mode.",
    openProcess: "Zum passenden Vorgang"
  },
  en: {
    pageTitle: "Prepare with BureauCare",
    pageText: "We use known details, only ask for what matters and prepare this step calmly for you.",
    backToDetail: "Back to this step",
    progress: "Step {current} of {total}",
    next: "Next",
    previous: "Back",
    finish: "Save preparation",
    saveStateSaving: "Saving...",
    saveStateSaved: "Saved",
    saveStateLocal: "Saved locally",
    saveStateError: "Saving failed",
    knownDataTitle: "Known details found",
    knownDataText: "We already have matching details from you. You can use them and still change everything afterwards.",
    useKnownData: "Yes, use them",
    reviewFirst: "Review first",
    skipKnownData: "Do not use",
    saveForLaterTitle: "Remember for later steps",
    saveForLaterText: "If you save new or updated details, BureauCare can reuse them later.",
    saveForLaterToggle: "Save these details for later steps",
    updateSavedToggle: "Update saved details with this version",
    savedForFuture: "These details are now prepared for later steps.",
    missingError: "Please fill in the highlighted fields.",
    missingSectionError: "Please complete the missing details first.",
    preparedTitle: "Prepared already",
    preparedText: "This preparation is the base for later forms and applications in Welcome Mode.",
    openProcess: "Open matching process"
  },
  zh: {
    pageTitle: "用 BureauCare 先准备好",
    pageText: "我们会先使用你已有的信息，只补充真正重要的内容，让这一步尽量轻松完成。",
    backToDetail: "返回这个步骤",
    progress: "第 {current} / {total} 步",
    next: "下一步",
    previous: "返回",
    finish: "保存准备结果",
    saveStateSaving: "正在保存...",
    saveStateSaved: "已保存",
    saveStateLocal: "已保存在本地",
    saveStateError: "保存失败",
    knownDataTitle: "已找到可用信息",
    knownDataText: "我们已经有一些适合这一步的信息。你可以先直接使用，之后也还能修改。",
    useKnownData: "是，直接使用",
    reviewFirst: "先查看",
    skipKnownData: "先不用",
    saveForLaterTitle: "为之后的步骤保存",
    saveForLaterText: "如果你保存新的或更新后的信息，BureauCare 之后可以继续复用。",
    saveForLaterToggle: "把这些信息保存给之后的步骤",
    updateSavedToggle: "用这次的信息更新已保存内容",
    savedForFuture: "这些信息已经为之后的步骤准备好了。",
    missingError: "请先填写标出的字段。",
    missingSectionError: "请先补充缺少的信息。",
    preparedTitle: "已经提前准备",
    preparedText: "这一步的准备会成为 Welcome Mode 后续表格和申请的基础。",
    openProcess: "打开对应流程"
  }
};

const fallbackCopy = prepareCopyMap.en!;

export function getWelcomePrepareCopy(locale: string | null | undefined) {
  return prepareCopyMap[normalizePreferredLanguage(locale)] ?? fallbackCopy;
}

export function getWelcomePrepareDefinition(stepKey: WelcomeStepKey) {
  return DEFINITIONS[stepKey] ?? null;
}

export function getLocalizedText(text: LocalizedText | undefined, locale: string) {
  const normalized = normalizePreferredLanguage(locale);
  return text?.[normalized] ?? text?.en ?? text?.de ?? Object.values(text ?? {})[0] ?? "";
}

export function getInitialWelcomePrepareAnswers(input: {
  stepKey: WelcomeStepKey;
  preparationAnswers?: WelcomeStepPreparationAnswers | null;
  personalData?: UserPersonalDataRecord | null;
  welcomeProfile?: WelcomeProfileRecord | null;
  fullName?: string | null;
}) {
  const base = getBaseAnswersFromSources(input.stepKey, input.personalData, input.welcomeProfile, input.fullName);
  return {
    ...base,
    ...normalizeWelcomePrepareAnswers(input.preparationAnswers ?? null)
  };
}

export function normalizeWelcomePrepareAnswers(value: WelcomeStepPreparationAnswers | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }
  return Object.fromEntries(Object.entries(value).filter(([, entry]) => entry !== null && entry !== undefined)) as Record<string, string | number | boolean>;
}

export function getKnownWelcomePrepareAnswers(
  definition: WelcomePrepareDefinition,
  personalData: UserPersonalDataRecord | null | undefined,
  welcomeProfile: WelcomeProfileRecord | null | undefined,
  fullName?: string | null
) {
  const allKnown = getBaseAnswersFromSources(definition.stepKey, personalData, welcomeProfile, fullName);
  const relevantIds = new Set(definition.sections.flatMap((section) => section.fields.map((field) => field.id)));
  return Object.fromEntries(Object.entries(allKnown).filter(([key, value]) => relevantIds.has(key) && hasValue(value))) as Record<string, string | number | boolean>;
}

export function getWelcomePrepareSavePatches(stepKey: WelcomeStepKey, answers: Record<string, string | number | boolean>) {
  switch (stepKey) {
    case "city_registration":
      return {
        personal_details: compactSection<PersonalDetails>({
          first_name: asString(answers.first_name),
          last_name: asString(answers.last_name),
          birth_date: asString(answers.birth_date),
          nationality: asString(answers.nationality)
        }),
        contact_details: compactSection<ContactDetails>({
          street: asString(answers.street),
          house_number: asString(answers.house_number),
          postal_code: asString(answers.postal_code),
          city: asString(answers.city),
          country: asString(answers.city) ? "Deutschland" : undefined
        }),
        household_details: compactSection<HouseholdDetails>({
          move_in_date: asString(answers.move_in_date)
        })
      };
    case "health_insurance":
      return {
        income_details: compactSection<IncomeDetails>({
          employment_status: asString(answers.employment_status)
        }),
        contact_details: compactSection<ContactDetails>({
          email: asString(answers.email),
          phone: asString(answers.phone)
        }),
        residency_details: compactSection<ResidencyDetails>({
          current_life_phase: deriveLifePhase(asString(answers.employment_status))
        })
      };
    case "bank_account":
      return {
        personal_details: compactSection<PersonalDetails>({
          first_name: asString(answers.first_name),
          last_name: asString(answers.last_name)
        }),
        contact_details: compactSection<ContactDetails>({
          email: asString(answers.email),
          phone: asString(answers.phone),
          street: asString(answers.street),
          house_number: asString(answers.house_number),
          postal_code: asString(answers.postal_code),
          city: asString(answers.city),
          country: asString(answers.city) ? "Deutschland" : undefined
        }),
        residency_details: compactSection<ResidencyDetails>({
          residence_status: asString(answers.residence_status)
        })
      };
    case "residence_permit":
      return {
        personal_details: compactSection<PersonalDetails>({
          first_name: asString(answers.first_name),
          last_name: asString(answers.last_name),
          birth_date: asString(answers.birth_date),
          nationality: asString(answers.nationality)
        }),
        contact_details: compactSection<ContactDetails>({
          city: asString(answers.city)
        }),
        residency_details: compactSection<ResidencyDetails>({
          current_life_phase: mapWelcomeReasonToLifePhase(asString(answers.welcome_reason)),
          residence_status: asString(answers.registration_status) === "yes" ? "registered" : undefined
        })
      };
    case "broadcast_fee":
      return {
        contact_details: compactSection<ContactDetails>({
          street: asString(answers.street),
          house_number: asString(answers.house_number),
          postal_code: asString(answers.postal_code),
          city: asString(answers.city),
          country: asString(answers.city) ? "Deutschland" : undefined
        }),
        household_details: compactSection<HouseholdDetails>({
          housing_status: asString(answers.housing_status),
          household_size: asNumber(answers.household_size)
        })
      };
    default:
      return {};
  }
}

export function hasWelcomePrepareChanges(
  stepKey: WelcomeStepKey,
  answers: Record<string, string | number | boolean>,
  personalData: UserPersonalDataRecord | null | undefined
) {
  const patches = getWelcomePrepareSavePatches(stepKey, answers);
  return Object.entries(patches).some(([section, patch]) => {
    const currentSection = (personalData?.[section as UserPersonalDataSectionKey] ?? {}) as Record<string, unknown>;
    return Object.entries(patch as Record<string, unknown>).some(([field, value]) => normalizeValue(currentSection[field]) !== normalizeValue(value));
  });
}

function getBaseAnswersFromSources(
  stepKey: WelcomeStepKey,
  personalData: UserPersonalDataRecord | null | undefined,
  welcomeProfile: WelcomeProfileRecord | null | undefined,
  fullName?: string | null
) {
  const [fallbackFirstName, ...restName] = (fullName ?? "").trim().split(/\s+/).filter(Boolean);
  const fallbackLastName = restName.join(" ");

  const base = {
    first_name: personalData?.personal_details.first_name ?? fallbackFirstName ?? "",
    last_name: personalData?.personal_details.last_name ?? fallbackLastName ?? "",
    birth_date: personalData?.personal_details.birth_date ?? "",
    nationality: personalData?.personal_details.nationality ?? welcomeProfile?.nationality ?? "",
    street: personalData?.contact_details.street ?? "",
    house_number: personalData?.contact_details.house_number ?? "",
    postal_code: personalData?.contact_details.postal_code ?? "",
    city: personalData?.contact_details.city ?? welcomeProfile?.city ?? "",
    move_in_date: personalData?.household_details.move_in_date ?? "",
    email: personalData?.contact_details.email ?? "",
    phone: personalData?.contact_details.phone ?? "",
    employment_status: personalData?.income_details.employment_status ?? deriveEmploymentStatus(welcomeProfile?.work_status),
    insurance_status: welcomeProfile?.health_insurance_status ?? "",
    family_insurance_relevant: personalData?.family_details.children_count ? "yes" : "",
    residence_status: personalData?.residency_details.residence_status ?? "",
    welcome_reason: welcomeProfile?.reason ?? "",
    registration_status: welcomeProfile?.registration_status ?? "",
    housing_status: mapHousingStatusFromPersonalData(personalData?.household_details.housing_status ?? welcomeProfile?.housing_status ?? ""),
    household_size: personalData?.household_details.household_size ?? ""
  };

  if (stepKey === "health_insurance" && !base.employment_status) {
    base.employment_status = mapWelcomeReasonToEmploymentStatus(welcomeProfile?.reason ?? "");
  }

  return base;
}

function deriveEmploymentStatus(value: string | null | undefined) {
  switch (value) {
    case "yes":
      return "employed";
    case "soon":
      return "employed";
    default:
      return "";
  }
}

function mapWelcomeReasonToEmploymentStatus(value: string) {
  switch (value) {
    case "study":
      return "student";
    case "training":
      return "training";
    case "work":
      return "employed";
    default:
      return "not_working";
  }
}

function mapWelcomeReasonToLifePhase(value: string | undefined) {
  switch (value) {
    case "study":
      return "Studium";
    case "work":
      return "Arbeit";
    case "training":
      return "Ausbildung";
    case "family":
      return "Familie";
    default:
      return undefined;
  }
}

function deriveLifePhase(value: string | undefined) {
  switch (value) {
    case "student":
      return "Studium";
    case "training":
      return "Ausbildung";
    case "employed":
      return "Arbeit";
    default:
      return undefined;
  }
}

function mapHousingStatusFromPersonalData(value: string) {
  if (value === "Miete") return "rent";
  if (value === "Untermiete") return "subrent";
  if (value === "temporary" || value === "Voruebergehend") return "temporary";
  if (value === "yes") return "rent";
  if (value === "temporary") return "temporary";
  return "";
}

function compactSection<T extends Record<string, unknown>>(section: T) {
  return Object.fromEntries(Object.entries(section).filter(([, value]) => hasValue(value))) as Partial<T>;
}

function asString(value: unknown) {
  if (value === null || value === undefined) return undefined;
  const text = String(value).trim();
  return text || undefined;
}

function asNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
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
