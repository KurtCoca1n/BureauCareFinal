import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type { LocationPreferences } from "@/lib/types";
import type { WelcomeStepKey } from "@/lib/welcome";

type LocalizedText = Partial<Record<SupportedLanguage, string>>;

export type WelcomeStepAuthorityChannel = "in_person" | "online" | "post" | "mixed" | "automatic";
export type WelcomeStepAppointmentMode = "usually_required" | "sometimes" | "usually_not_needed" | "not_applicable";
export type WelcomeInstitutionType =
  | "citizen_office"
  | "immigration_office"
  | "health_insurer"
  | "tax_office"
  | "bank"
  | "broadcast_service"
  | "family_benefits_office"
  | "university"
  | "employer_or_authority";

export type WelcomeStepGuidance = {
  institutionType: WelcomeInstitutionType;
  institutionName: LocalizedText;
  channel: WelcomeStepAuthorityChannel;
  appointmentMode: WelcomeStepAppointmentMode;
  explanation: LocalizedText;
  localHint: LocalizedText;
  nextStep: LocalizedText;
  nextStepTitle: LocalizedText;
  nearbyQuery: string | null;
  mapsSearchLabel: LocalizedText;
};

type WelcomeGuidanceCopy = {
  sectionTitle: string;
  sectionText: string;
  authorityLabel: string;
  channelLabel: string;
  appointmentLabel: string;
  localHintTitle: string;
  nextStepTitle: string;
  nextBadge: string;
  routeAreaTitle: string;
  routeAreaText: string;
  taskPrepTitle: string;
  taskPrepText: string;
  cityFallback: string;
  locationOffText: string;
  channels: Record<WelcomeStepAuthorityChannel, string>;
  appointments: Record<WelcomeStepAppointmentMode, string>;
  institutionTypes: Record<WelcomeInstitutionType, string>;
  likelyInYourCity: string;
  usuallyResponsible: string;
};

const deCopy: WelcomeGuidanceCopy = {
  sectionTitle: "Wohin du jetzt musst",
  sectionText: "Hier siehst du, welche Stelle fuer diesen Schritt meist zustaendig ist und wie der Ablauf normalerweise ist.",
  authorityLabel: "Zustaendige Stelle",
  channelLabel: "Wie das meist passiert",
  appointmentLabel: "Termin",
  localHintTitle: "Hinweis fuer deinen Ort",
  nextStepTitle: "Dein naechster realer Schritt",
  nextBadge: "Naechster Schritt",
  routeAreaTitle: "Lokale Hilfe",
  routeAreaText: "Wenn BureauCare einen Ort sinnvoll einschaetzen kann, findest du hier direkte Karten- und Routenhilfen.",
  taskPrepTitle: "Fuer spaetere Aufgaben vorbereitet",
  taskPrepText: "Spaeter kann BureauCare aus diesem Schritt Aufgaben, Erinnerungen oder Termin-Hinweise machen.",
  cityFallback: "deiner Stadt",
  locationOffText: "Wenn du Standort in den Einstellungen erlaubst, kann BureauCare hier noch gezielter mit lokalen Hinweisen helfen.",
  channels: {
    in_person: "Meist vor Ort",
    online: "Meist online",
    post: "Meist per Post",
    mixed: "Oft gemischt",
    automatic: "Meist automatisch"
  },
  appointments: {
    usually_required: "Meist brauchst du einen Termin.",
    sometimes: "Oft kommt es auf die Stadt oder Stelle an.",
    usually_not_needed: "Meist brauchst du keinen Termin.",
    not_applicable: "Hier ist normalerweise kein Termin noetig."
  },
  institutionTypes: {
    citizen_office: "Buergeramt / Einwohnermeldeamt",
    immigration_office: "Auslaenderbehoerde",
    health_insurer: "Krankenkasse",
    tax_office: "Finanzamt",
    bank: "Bank",
    broadcast_service: "Beitragsservice",
    family_benefits_office: "Familienkasse",
    university: "Hochschule / Universitaet",
    employer_or_authority: "Arbeitgeber oder zustaendige Stelle"
  },
  likelyInYourCity: "Wahrscheinlich zustaendig in {city}.",
  usuallyResponsible: "In der Regel ist dort diese Stelle zustaendig."
};

const enCopy: WelcomeGuidanceCopy = {
  sectionTitle: "Where you need to go now",
  sectionText: "Here you can see which office is usually responsible for this step and how it normally works.",
  authorityLabel: "Responsible office",
  channelLabel: "How this usually works",
  appointmentLabel: "Appointment",
  localHintTitle: "Hint for your place",
  nextStepTitle: "Your next real step",
  nextBadge: "Next step",
  routeAreaTitle: "Local help",
  routeAreaText: "If BureauCare can reasonably estimate a place, you will find direct map and route help here.",
  taskPrepTitle: "Prepared for later tasks",
  taskPrepText: "Later, BureauCare can turn this step into tasks, reminders or appointment hints.",
  cityFallback: "your city",
  locationOffText: "If you allow location in settings, BureauCare can help more precisely here with local hints.",
  channels: {
    in_person: "Usually in person",
    online: "Usually online",
    post: "Usually by post",
    mixed: "Often mixed",
    automatic: "Usually automatic"
  },
  appointments: {
    usually_required: "You usually need an appointment.",
    sometimes: "It often depends on the city or office.",
    usually_not_needed: "You usually do not need an appointment.",
    not_applicable: "Usually no appointment is needed here."
  },
  institutionTypes: {
    citizen_office: "Citizen office / registration office",
    immigration_office: "Immigration office",
    health_insurer: "Health insurer",
    tax_office: "Tax office",
    bank: "Bank",
    broadcast_service: "Broadcast service",
    family_benefits_office: "Family benefits office",
    university: "University",
    employer_or_authority: "Employer or responsible office"
  },
  likelyInYourCity: "Likely responsible in {city}.",
  usuallyResponsible: "This is usually the responsible place."
};

const zhCopy: WelcomeGuidanceCopy = {
  sectionTitle: "你现在要去哪里",
  sectionText: "这里会告诉你这一步通常由哪个机构负责，以及一般是怎么进行的。",
  authorityLabel: "负责机构",
  channelLabel: "通常怎么办",
  appointmentLabel: "是否要预约",
  localHintTitle: "你所在城市的提示",
  nextStepTitle: "你现在最现实的下一步",
  nextBadge: "下一步",
  routeAreaTitle: "本地帮助",
  routeAreaText: "如果 BureauCare 可以较稳妥地判断地点，这里会显示地图和路线帮助。",
  taskPrepTitle: "已为后续任务做好准备",
  taskPrepText: "之后 BureauCare 可以把这一步变成任务、提醒或预约提示。",
  cityFallback: "你所在的城市",
  locationOffText: "如果你在设置里允许位置权限，BureauCare 之后可以在这里给你更准确的本地提示。",
  channels: {
    in_person: "通常需要到现场",
    online: "通常可以在线处理",
    post: "通常通过邮寄",
    mixed: "通常是混合方式",
    automatic: "通常会自动完成"
  },
  appointments: {
    usually_required: "这一步通常需要预约。",
    sometimes: "这通常取决于城市或具体机构。",
    usually_not_needed: "这一步通常不需要预约。",
    not_applicable: "这一步一般不需要预约。"
  },
  institutionTypes: {
    citizen_office: "市民服务中心 / 住址登记处",
    immigration_office: "外国人管理局",
    health_insurer: "医保机构",
    tax_office: "税务局",
    bank: "银行",
    broadcast_service: "广播电视费机构",
    family_benefits_office: "家庭补助机构",
    university: "大学 / 高校",
    employer_or_authority: "雇主或相关机构"
  },
  likelyInYourCity: "在 {city}，这通常是负责机构。",
  usuallyResponsible: "一般来说，这里就是要联系的机构。"
};

const copyMap: Record<SupportedLanguage, WelcomeGuidanceCopy> = {
  de: deCopy,
  en: enCopy,
  tr: enCopy,
  uk: enCopy,
  es: enCopy,
  zh: zhCopy
};

const GUIDANCE: Record<WelcomeStepKey, WelcomeStepGuidance> = {
  city_registration: {
    institutionType: "citizen_office",
    institutionName: { de: "Buergeramt", en: "Citizen office", zh: "市民服务中心" },
    channel: "in_person",
    appointmentMode: "usually_required",
    explanation: {
      de: "Fuer die Anmeldung musst du in der Regel zum Buergeramt oder Einwohnermeldeamt.",
      en: "For address registration, you usually need the citizen office or registration office.",
      zh: "办理住址登记时，你通常需要去市民服务中心或住址登记处。"
    },
    localHint: {
      de: "Je nach Stadt heisst die Stelle etwas anders. Oft ist es ein Buergeramt oder Einwohnermeldeamt.",
      en: "The office name can change by city. It is often called citizen office or registration office.",
      zh: "不同城市的名称可能略有不同，通常是市民服务中心或住址登记处。"
    },
    nextStepTitle: { de: "Jetzt Termin pruefen", en: "Check for an appointment now", zh: "现在先查看是否要预约" },
    nextStep: {
      de: "Pruefe jetzt, ob du in deiner Stadt einen Termin beim Buergeramt buchen musst.",
      en: "Check now whether you need to book an appointment at the citizen office in your city.",
      zh: "现在先确认你所在城市是否需要预约去市民服务中心。"
    },
    nearbyQuery: "Buergeramt",
    mapsSearchLabel: { de: "Buergeramt", en: "Citizen office", zh: "市民服务中心" }
  },
  tax_id: {
    institutionType: "tax_office",
    institutionName: { de: "Finanzamt", en: "Tax office", zh: "税务局" },
    channel: "automatic",
    appointmentMode: "not_applicable",
    explanation: {
      de: "Nach der Anmeldung kommt die Steuer-ID oft automatisch per Post. Du musst meist nicht extra zum Finanzamt gehen.",
      en: "After registration, the tax ID often arrives by post automatically. You usually do not need to go to the tax office.",
      zh: "办好住址登记后，税号通常会自动通过邮寄寄到你家。一般不需要亲自去税务局。"
    },
    localHint: {
      de: "Wenn der Brief nicht kommt, ist spaeter meist das Finanzamt zustaendig.",
      en: "If the letter does not arrive, the tax office is usually the responsible place later.",
      zh: "如果信件迟迟没有收到，之后通常要联系税务局。"
    },
    nextStepTitle: { de: "Jetzt auf Post warten", en: "Wait for the letter now", zh: "现在先等邮寄信件" },
    nextStep: {
      de: "Warte jetzt nach deiner Anmeldung auf den Brief mit deiner Steuer-ID.",
      en: "After your address registration, wait for the letter with your tax ID.",
      zh: "办好住址登记后，先等待税号信件寄到你的地址。"
    },
    nearbyQuery: "Finanzamt",
    mapsSearchLabel: { de: "Finanzamt", en: "Tax office", zh: "税务局" }
  },
  health_insurance: {
    institutionType: "health_insurer",
    institutionName: { de: "Krankenkasse", en: "Health insurer", zh: "医保机构" },
    channel: "mixed",
    appointmentMode: "usually_not_needed",
    explanation: {
      de: "Diesen Schritt machst du oft online oder direkt mit einer Krankenkasse. Meist brauchst du dafuer keinen Termin vor Ort.",
      en: "This step is often done online or directly with a health insurer. You usually do not need an in-person appointment.",
      zh: "这一步通常可以在线完成，或者直接联系医保机构。一般不需要现场预约。"
    },
    localHint: {
      de: "Es gibt oft mehrere passende Krankenkassen. Die zuständige Stelle ist deshalb nicht immer lokal eindeutig.",
      en: "There are often several possible health insurers, so there is not always one clear local office.",
      zh: "通常会有多家可选医保机构，所以这一步未必有唯一的本地机构。"
    },
    nextStepTitle: { de: "Jetzt Krankenkasse suchen", en: "Look for a health insurer now", zh: "现在先找合适的医保机构" },
    nextStep: {
      de: "Suche jetzt eine passende Krankenkasse und pruefe, ob du dich online anmelden kannst.",
      en: "Look for a suitable health insurer now and check whether you can register online.",
      zh: "现在先找一家合适的医保机构，并查看是否可以在线办理。"
    },
    nearbyQuery: "Krankenkasse",
    mapsSearchLabel: { de: "Krankenkasse", en: "Health insurer", zh: "医保机构" }
  },
  bank_account: {
    institutionType: "bank",
    institutionName: { de: "Bank", en: "Bank", zh: "银行" },
    channel: "mixed",
    appointmentMode: "sometimes",
    explanation: {
      de: "Ein Bankkonto kannst du oft online oder direkt bei einer Bank eroefnen. Ob ein Termin noetig ist, haengt von der Bank ab.",
      en: "A bank account can often be opened online or directly with a bank. Whether you need an appointment depends on the bank.",
      zh: "银行账户通常可以在线办理，也可以直接去银行办理。是否需要预约取决于具体银行。"
    },
    localHint: {
      de: "In vielen Staedten gibt es mehrere passende Banken. Darum zeigen wir dir eher einen sinnvollen Suchstart als eine feste Stelle.",
      en: "In many cities there are several suitable banks, so we show a practical search start instead of one fixed office.",
      zh: "很多城市都会有多家适合的银行，所以这里更适合给你一个搜索起点，而不是唯一机构。"
    },
    nextStepTitle: { de: "Jetzt Bank auswaehlen", en: "Choose a bank now", zh: "现在先选一家银行" },
    nextStep: {
      de: "Pruefe jetzt, ob du ein Konto online eroeffnen kannst oder lieber zu einer Filiale gehst.",
      en: "Check now whether you can open the account online or whether a branch visit is better.",
      zh: "现在先确认你更适合在线开户，还是直接去银行网点办理。"
    },
    nearbyQuery: "Bank",
    mapsSearchLabel: { de: "Bankfiliale", en: "Bank branch", zh: "银行网点" }
  },
  residence_permit: {
    institutionType: "immigration_office",
    institutionName: { de: "Auslaenderbehoerde", en: "Immigration office", zh: "外国人管理局" },
    channel: "in_person",
    appointmentMode: "usually_required",
    explanation: {
      de: "Fuer den Aufenthaltstitel ist in der Regel die Auslaenderbehoerde zustaendig. Oft brauchst du dafuer einen Termin.",
      en: "The immigration office is usually responsible for the residence permit. You often need an appointment for it.",
      zh: "办理居留许可通常要联系外国人管理局，而且大多需要预约。"
    },
    localHint: {
      de: "Je nach Stadt kann es ein eigenes Landesamt oder eine Auslaenderbehoerde geben.",
      en: "Depending on the city, this may be a dedicated immigration office or a state authority.",
      zh: "不同城市可能是独立的外国人管理局，也可能是州级相关机构。"
    },
    nextStepTitle: { de: "Jetzt Termin bei der Auslaenderbehoerde pruefen", en: "Check for an immigration appointment now", zh: "现在先看是否要预约外国人管理局" },
    nextStep: {
      de: "Pruefe jetzt in deiner Stadt, wie du einen Termin bei der Auslaenderbehoerde bekommst oder ob ein Online-Antrag moeglich ist.",
      en: "Check now how to get an appointment in your city or whether an online application is possible.",
      zh: "现在先确认你所在城市如何预约外国人管理局，或者是否可以在线申请。"
    },
    nearbyQuery: "Auslaenderbehoerde",
    mapsSearchLabel: { de: "Auslaenderbehoerde", en: "Immigration office", zh: "外国人管理局" }
  },
  work_permit: {
    institutionType: "employer_or_authority",
    institutionName: { de: "Arbeitgeber oder Auslaenderbehoerde", en: "Employer or immigration office", zh: "雇主或外国人管理局" },
    channel: "mixed",
    appointmentMode: "sometimes",
    explanation: {
      de: "Ob du eine extra Arbeitserlaubnis brauchst, klaerst du oft mit Arbeitgeber und zustaendiger Behoerde zusammen.",
      en: "Whether you need a separate work permit is often clarified together with your employer and the responsible authority.",
      zh: "你是否需要额外的工作许可，通常要和雇主以及相关机构一起确认。"
    },
    localHint: {
      de: "Oft ist der erste praktische Kontakt nicht eine Stelle vor Ort, sondern dein Arbeitgeber oder eine Rueckfrage bei der Behoerde.",
      en: "The first practical contact is often not a local office, but your employer or a question to the authority.",
      zh: "很多时候第一步不是直接去机构，而是先和雇主确认，或向相关机构咨询。"
    },
    nextStepTitle: { de: "Jetzt Status pruefen", en: "Check your status now", zh: "现在先确认你的状态" },
    nextStep: {
      de: "Pruefe jetzt mit deinem Arbeitgeber oder deinen Unterlagen, ob dein aktueller Status Arbeit schon erlaubt.",
      en: "Check now with your employer or your documents whether your current status already allows work.",
      zh: "现在先和雇主或根据你的证件确认，你目前的身份是否已经允许工作。"
    },
    nearbyQuery: "Auslaenderbehoerde",
    mapsSearchLabel: { de: "Auslaenderbehoerde", en: "Immigration office", zh: "外国人管理局" }
  },
  broadcast_fee: {
    institutionType: "broadcast_service",
    institutionName: { de: "Beitragsservice", en: "Broadcast service", zh: "广播电视费机构" },
    channel: "online",
    appointmentMode: "not_applicable",
    explanation: {
      de: "Diesen Schritt machst du normalerweise online oder per Post. Du musst dafuer meist nicht zu einer Stelle vor Ort.",
      en: "This step is usually done online or by post. You normally do not need to go to an office in person.",
      zh: "这一步通常在线或通过邮寄办理，一般不需要去现场机构。"
    },
    localHint: {
      de: "Hier gibt es meist keine lokale Stelle in deiner Stadt. Wichtig ist eher die richtige Wohnung und Adresse.",
      en: "There is usually no clear local office in your city here. The important part is the correct address and home.",
      zh: "这一步通常没有明确的本地办事点，关键是你的住房和地址信息正确。"
    },
    nextStepTitle: { de: "Jetzt Online-Weg pruefen", en: "Check the online path now", zh: "现在先查看在线办理方式" },
    nextStep: {
      de: "Pruefe jetzt, ob fuer deine Wohnung schon gezahlt wird oder ob du den Schritt online starten musst.",
      en: "Check now whether someone already pays for your address or whether you need to start it online.",
      zh: "现在先确认你的住址是否已经有人缴费，还是需要你自己在线开始办理。"
    },
    nearbyQuery: "Postfiliale",
    mapsSearchLabel: { de: "Postfiliale", en: "Post office", zh: "邮局" }
  },
  child_benefit: {
    institutionType: "family_benefits_office",
    institutionName: { de: "Familienkasse", en: "Family benefits office", zh: "家庭补助机构" },
    channel: "mixed",
    appointmentMode: "usually_not_needed",
    explanation: {
      de: "Fuer Kindergeld ist meist die Familienkasse zustaendig. Vieles geht per Formular oder online.",
      en: "The family benefits office is usually responsible for child benefit. A lot can be done by form or online.",
      zh: "儿童金通常由家庭补助机构负责，很多内容可以通过表格或在线办理。"
    },
    localHint: {
      de: "Die zustaendige Familienkasse ist nicht immer direkt in deiner Stadt. Darum ist der genaue Ort oft erst spaeter wichtig.",
      en: "The responsible family benefits office is not always directly in your city, so the exact place is often secondary at first.",
      zh: "负责的家庭补助机构不一定就在你所在城市，所以一开始更重要的是确认流程本身。"
    },
    nextStepTitle: { de: "Jetzt Unterlagen sammeln", en: "Collect documents now", zh: "现在先整理材料" },
    nextStep: {
      de: "Sammle jetzt die wichtigsten Unterlagen fuer dich und dein Kind und pruefe den Antragsweg.",
      en: "Collect the main documents for you and your child now and check the application route.",
      zh: "现在先整理你和孩子的重要材料，并查看申请方式。"
    },
    nearbyQuery: "Familienkasse",
    mapsSearchLabel: { de: "Familienkasse", en: "Family benefits office", zh: "家庭补助机构" }
  },
  university_enrollment: {
    institutionType: "university",
    institutionName: { de: "Hochschule oder Universitaet", en: "University", zh: "大学 / 高校" },
    channel: "mixed",
    appointmentMode: "sometimes",
    explanation: {
      de: "Die Einschreibung machst du direkt mit deiner Hochschule. Je nach Uni geht das online, vor Ort oder gemischt.",
      en: "Enrollment is done directly with your university. Depending on the university, it may be online, in person or mixed.",
      zh: "注册要直接和你的大学办理。不同学校可能是在线、现场或混合方式。"
    },
    localHint: {
      de: "Hier ist meist nicht die Stadt entscheidend, sondern deine konkrete Hochschule.",
      en: "Here the key factor is usually your specific university, not the city itself.",
      zh: "这一步通常更取决于你的具体学校，而不是城市本身。"
    },
    nextStepTitle: { de: "Jetzt Einschreibefrist pruefen", en: "Check the enrollment deadline now", zh: "现在先确认注册截止时间" },
    nextStep: {
      de: "Pruefe jetzt die Frist deiner Hochschule und wie die Einschreibung dort genau ablaeuft.",
      en: "Check your university deadline now and how enrollment works there.",
      zh: "现在先确认你学校的注册截止时间，以及具体怎么注册。"
    },
    nearbyQuery: "Universitaet",
    mapsSearchLabel: { de: "Hochschule", en: "University", zh: "大学" }
  }
};

export function getWelcomeGuidance(stepKey: WelcomeStepKey) {
  return GUIDANCE[stepKey];
}

export function getWelcomeGuidanceCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
}

export function getWelcomeGuidanceText(text: LocalizedText, locale: string | null | undefined) {
  const normalized = normalizePreferredLanguage(locale);
  return text[normalized] ?? text.en ?? text.de ?? Object.values(text)[0] ?? "";
}

export function formatGuidanceTemplate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? "");
}

export function buildWelcomeGuidanceContext(input: {
  stepKey: WelcomeStepKey;
  locale: string;
  city: string | null | undefined;
  locationPreferences: LocationPreferences | null | undefined;
}) {
  const guidance = getWelcomeGuidance(input.stepKey);
  const copy = getWelcomeGuidanceCopy(input.locale);
  const city = input.city?.trim() || copy.cityFallback;
  const locationEnabled = Boolean(input.locationPreferences?.enabled && input.locationPreferences?.use_for_offices);

  const institutionTypeLabel = copy.institutionTypes[guidance.institutionType];
  const institutionName = getWelcomeGuidanceText(guidance.institutionName, input.locale);
  const localHintPrefix = formatGuidanceTemplate(copy.likelyInYourCity, { city });

  const locationQuery = guidance.nearbyQuery ? `${guidance.nearbyQuery} ${input.city?.trim() || ""}`.trim() : institutionName;
  const mapsSearchHref = locationQuery
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationQuery)}`
    : null;

  return {
    guidance,
    copy,
    institutionTypeLabel,
    institutionName,
    channelLabel: copy.channels[guidance.channel],
    appointmentLabel: copy.appointments[guidance.appointmentMode],
    explanation: getWelcomeGuidanceText(guidance.explanation, input.locale),
    localHint: `${localHintPrefix} ${getWelcomeGuidanceText(guidance.localHint, input.locale)}`.trim(),
    nextStepTitle: getWelcomeGuidanceText(guidance.nextStepTitle, input.locale),
    nextStep: getWelcomeGuidanceText(guidance.nextStep, input.locale),
    locationEnabled,
    mapsSearchHref,
    routeLocationName: locationQuery,
    routeAddress: locationQuery,
    mapsSearchLabel: getWelcomeGuidanceText(guidance.mapsSearchLabel, input.locale),
    locationOffText: copy.locationOffText
  };
}
