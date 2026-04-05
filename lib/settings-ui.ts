import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

export type SettingsSectionId =
  | "profile"
  | "personal-data"
  | "responses"
  | "language"
  | "location"
  | "documents"
  | "goals"
  | "notifications"
  | "security"
  | "usage"
  | "privacy"
  | "tester-admin";

type SettingsSectionText = {
  title: string;
  summary: string;
  description: string;
};

type SettingsCopy = {
  pageTitle: string;
  pageIntro: string;
  navigationTitle: string;
  navigationHint: string;
  sectionLabel: string;
  openSection: string;
  currentArea: string;
  availableNow: string;
  preparedTitle: string;
  preparedText: string;
  testerOnly: string;
  sections: Record<SettingsSectionId, SettingsSectionText>;
};

const de: SettingsCopy = {
  pageTitle: "Einstellungen",
  pageIntro: "Hier verwaltest du dein BureauCare-Konto und deine persoenlichen Einstellungen.",
  navigationTitle: "Bereiche",
  navigationHint: "Waehle einen Bereich aus. Auf Desktop bleibt die Navigation links ruhig im Blick, auf Mobile fuehrt sie dich Schritt fuer Schritt weiter.",
  sectionLabel: "Bereich",
  openSection: "Oeffnen",
  currentArea: "Aktueller Bereich",
  availableNow: "Schon verfuegbar",
  preparedTitle: "Sauber vorbereitet",
  preparedText: "Dieser Bereich ist in BureauCare bereits strukturell angelegt und wird in den naechsten Schritten gezielt ausgebaut.",
  testerOnly: "Nur fuer berechtigte Accounts sichtbar",
  sections: {
    profile: { title: "Profil", summary: "Name, E-Mail und Kontodaten", description: "Alles rund um dein Konto, deinen Namen und deine grundlegenden Profildaten." },
    "personal-data": { title: "Persoenliche Angaben", summary: "Gespeicherte Angaben fuer spaetere Antraege", description: "Hier geht es um Daten, die BureauCare in spaeteren Antraegen erneut verwenden kann." },
    responses: { title: "Antworten", summary: "Ton, Stil und Signatur", description: "Hier legst du fest, wie BureauCare standardmaessig Antworten fuer dich vorbereitet." },
    language: { title: "Sprache & Uebersetzung", summary: "App-Sprache und Uebersetzungen", description: "Hier legst du fest, in welcher Sprache BureauCare mit dir arbeitet und wie Uebersetzungen genutzt werden." },
    location: { title: "Standort", summary: "Lokale Hilfe und Naehe zu Stellen", description: "Standortfreigaben und lokale Hilfen werden hier zentral verwaltet." },
    documents: { title: "Dokumente & Faelle", summary: "Verknuepfungen, Uploads und Fallkontext", description: "Dieser Bereich wird spaeter Upload-, Dokument- und Fall-Einstellungen zusammenfassen." },
    goals: { title: "Ziele & Wuensche", summary: "Persoenliche Ziele im Blick behalten", description: "Hier werden spaeter Ziele, Wunschlagen und dazu passende Hilfen verwaltet." },
    notifications: { title: "Benachrichtigungen", summary: "Hinweise, Erinnerungen und Updates", description: "Benachrichtigungen und Erinnerungen werden hier spaeter ruhig und klar gesteuert." },
    security: { title: "Sicherheit", summary: "Passwort, Sitzungen und Kontoschutz", description: "Hier findest du alles rund um Kontoschutz, Anmeldungen und sichere Sitzungen." },
    usage: { title: "Abo & Nutzung", summary: "Plan, Limits und aktueller Zugriff", description: "Nutzung, Planstatus und spaetere Abo-Funktionen kommen hier zusammen." },
    privacy: { title: "Datenschutz", summary: "Kontrolle ueber Daten und Freigaben", description: "Datenschutz, gespeicherte Daten und spaetere Export- oder Loeschoptionen werden hier gebuendelt." },
    "tester-admin": { title: "Tester / Admin", summary: "Interner Zugriff und erweiterte Steuerung", description: "Dieser Bereich ist fuer interne oder besonders berechtigte Accounts vorbereitet." }
  }
};

const en: SettingsCopy = {
  pageTitle: "Settings",
  pageIntro: "Manage your BureauCare account and your personal preferences here.",
  navigationTitle: "Sections",
  navigationHint: "Choose a section. On desktop the navigation stays calmly in view, and on mobile it guides you step by step.",
  sectionLabel: "Section",
  openSection: "Open",
  currentArea: "Current section",
  availableNow: "Available now",
  preparedTitle: "Prepared cleanly",
  preparedText: "This area already has a clear place in BureauCare and will be expanded step by step next.",
  testerOnly: "Visible only for eligible accounts",
  sections: {
    profile: { title: "Profile", summary: "Name, email and account details", description: "Everything related to your account, your name and your core profile details." },
    "personal-data": { title: "Personal details", summary: "Saved details for later applications", description: "This area is for details BureauCare can reuse in future applications." },
    responses: { title: "Responses", summary: "Tone, style and signature", description: "Choose how BureauCare should usually prepare replies for you." },
    language: { title: "Language & translation", summary: "App language and translations", description: "Choose how BureauCare works with your languages and translations." },
    location: { title: "Location", summary: "Local help and nearby offices", description: "Location permissions and nearby help are managed here." },
    documents: { title: "Documents & cases", summary: "Links, uploads and case context", description: "This area will later group document, upload and case settings." },
    goals: { title: "Goals & wishes", summary: "Keep personal goals in view", description: "Goals, wishes and matching guidance will be managed here later." },
    notifications: { title: "Notifications", summary: "Reminders, updates and alerts", description: "Notifications and reminders will later be controlled here in a calm way." },
    security: { title: "Security", summary: "Password, sessions and account safety", description: "Everything related to account protection, sessions and sign-ins belongs here." },
    usage: { title: "Plan & usage", summary: "Plan, limits and current access", description: "Usage, plan status and later subscription options come together here." },
    privacy: { title: "Privacy", summary: "Control over data and permissions", description: "Privacy, stored data and later export or deletion options are grouped here." },
    "tester-admin": { title: "Tester / admin", summary: "Internal access and extended controls", description: "This area is prepared for internal or specially authorized accounts." }
  }
};

const zh: SettingsCopy = {
  pageTitle: "设置",
  pageIntro: "你可以在这里管理 BureauCare 账号和个人设置。",
  navigationTitle: "区域",
  navigationHint: "先选择一个区域。在桌面端，左侧导航会保持清晰可见；在手机上，它会一步一步带你进入对应内容。",
  sectionLabel: "区域",
  openSection: "打开",
  currentArea: "当前区域",
  availableNow: "当前可用",
  preparedTitle: "已准备好",
  preparedText: "这个区域已经在 BureauCare 中有了清晰结构，后续会继续逐步完善。",
  testerOnly: "只对有权限的账号显示",
  sections: {
    profile: { title: "个人资料", summary: "姓名、邮箱和账号信息", description: "这里集中管理你的账号、姓名和基础资料。" },
    "personal-data": { title: "个人信息", summary: "为以后申请保存的信息", description: "这里显示 BureauCare 以后可以重复使用的个人信息。" },
    responses: { title: "回复", summary: "语气、风格和回复方式", description: "以后与回复相关的设置会集中放在这里。" },
    language: { title: "语言与翻译", summary: "应用语言和翻译设置", description: "这里决定 BureauCare 使用什么语言与你协作，以及如何处理翻译。" },
    location: { title: "位置", summary: "本地帮助与附近机构", description: "位置权限和本地帮助会在这里统一管理。" },
    documents: { title: "文件与案件", summary: "上传、关联和案件上下文", description: "以后文件、上传和案件相关设置会集中在这里。" },
    goals: { title: "目标与愿望", summary: "持续关注你的目标", description: "以后这里会管理目标、愿望以及相关帮助。" },
    notifications: { title: "通知", summary: "提醒、更新和消息", description: "以后通知和提醒会在这里以清晰、安静的方式管理。" },
    security: { title: "安全", summary: "密码、会话和账号保护", description: "账号安全、登录和会话相关内容都会放在这里。" },
    usage: { title: "套餐与使用情况", summary: "当前计划、限制和访问权限", description: "这里会汇总使用情况、计划状态以及以后的订阅信息。" },
    privacy: { title: "隐私", summary: "数据与授权控制", description: "隐私、已保存数据以及以后导出或删除相关内容都会在这里。" },
    "tester-admin": { title: "测试 / 管理", summary: "内部权限与扩展控制", description: "这个区域为内部或特别授权的账号预留。" }
  }
};

const fallbackMap: Record<SupportedLanguage, SettingsCopy> = {
  de,
  en,
  tr: en,
  uk: en,
  es: en,
  zh
};

export function getSettingsCopy(locale: string | null | undefined) {
  return fallbackMap[normalizePreferredLanguage(locale)];
}

export function normalizeSettingsSection(value: string | null | undefined): SettingsSectionId {
  switch (value) {
    case "profile":
    case "personal-data":
    case "responses":
    case "language":
    case "location":
    case "documents":
    case "goals":
    case "notifications":
    case "security":
    case "usage":
    case "privacy":
    case "tester-admin":
      return value;
    default:
      return "profile";
  }
}
