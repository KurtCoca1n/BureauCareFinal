import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

type ProfileSettingsCopy = {
  title: string;
  intro: string;
  basicCardTitle: string;
  basicCardText: string;
  firstName: string;
  lastName: string;
  fullNameLabel: string;
  fullNameHint: string;
  email: string;
  phone: string;
  phonePlaceholder: string;
  phoneHint: string;
  noPhone: string;
  memberSince: string;
  emailStatus: string;
  emailVerified: string;
  emailNotVerified: string;
  emailChangeTitle: string;
  emailChangeText: string;
  emailChangeAction: string;
  languageTitle: string;
  languageText: string;
  languageAction: string;
  signatureTitle: string;
  signatureText: string;
  save: string;
  saving: string;
  saved: string;
  saveError: string;
  requiredName: string;
};

const de: ProfileSettingsCopy = {
  title: "Profil",
  intro: "Dein BureauCare-Profil ist die ruhige Grundlage fuer Begruessung, Antworten und deinen sicheren Kontokontext.",
  basicCardTitle: "Grunddaten",
  basicCardText: "Diese Angaben nutzt BureauCare fuer deine persoenliche Ansprache und fuer offizielle Texte.",
  firstName: "Vorname",
  lastName: "Nachname",
  fullNameLabel: "Vollstaendiger Name",
  fullNameHint: "So erscheint dein Name in Signaturen, Antworten und offiziellen Texten.",
  email: "E-Mail-Adresse",
  phone: "Telefonnummer",
  phonePlaceholder: "Optional",
  phoneHint: "Nur wenn du sie hier hinterlegen moechtest.",
  noPhone: "Noch keine Telefonnummer hinterlegt.",
  memberSince: "Konto erstellt am",
  emailStatus: "E-Mail-Status",
  emailVerified: "Bestaetigt",
  emailNotVerified: "Noch nicht bestaetigt",
  emailChangeTitle: "E-Mail aendern",
  emailChangeText: "Aus Sicherheitsgruenden bereiten wir diesen Schritt im Sicherheitsbereich vor.",
  emailChangeAction: "Im Sicherheitsbereich weiter",
  languageTitle: "App-Sprache",
  languageText: "Sprache und Uebersetzung verwaltest du im eigenen Sprachbereich.",
  languageAction: "Zu Sprache & Uebersetzung",
  signatureTitle: "Verwendete Signatur",
  signatureText: "So nutzt BureauCare deinen Namen in Antwortentwuerfen und offiziellen Schreiben.",
  save: "Profil speichern",
  saving: "Profil wird gespeichert...",
  saved: "Dein Profil wurde gespeichert.",
  saveError: "Dein Profil konnte nicht gespeichert werden.",
  requiredName: "Bitte gib Vorname und Nachname ein."
};

const en: ProfileSettingsCopy = {
  title: "Profile",
  intro: "Your BureauCare profile is the calm base for greetings, replies and your secure account context.",
  basicCardTitle: "Basic details",
  basicCardText: "BureauCare uses these details for personal greetings and official texts.",
  firstName: "First name",
  lastName: "Last name",
  fullNameLabel: "Full name",
  fullNameHint: "This is how your name appears in signatures, replies and official texts.",
  email: "Email address",
  phone: "Phone number",
  phonePlaceholder: "Optional",
  phoneHint: "Only add it if you want to keep it here.",
  noPhone: "No phone number saved yet.",
  memberSince: "Account created",
  emailStatus: "Email status",
  emailVerified: "Verified",
  emailNotVerified: "Not verified yet",
  emailChangeTitle: "Change email",
  emailChangeText: "For security reasons, this step will be handled in the security section.",
  emailChangeAction: "Open security section",
  languageTitle: "App language",
  languageText: "You can manage language and translation in the dedicated language section.",
  languageAction: "Go to language & translation",
  signatureTitle: "Signature used",
  signatureText: "This is how BureauCare uses your name in reply drafts and official writing.",
  save: "Save profile",
  saving: "Saving profile...",
  saved: "Your profile was saved.",
  saveError: "Your profile could not be saved.",
  requiredName: "Please enter your first and last name."
};

const zh: ProfileSettingsCopy = {
  title: "个人资料",
  intro: "这里是你的 BureauCare 个人资料，会用于首页称呼、回复签名和账户信息。",
  basicCardTitle: "基本信息",
  basicCardText: "这些信息会用于个性化称呼，以及正式回复中的姓名显示。",
  firstName: "名字",
  lastName: "姓氏",
  fullNameLabel: "完整姓名",
  fullNameHint: "这是 BureauCare 在签名、回复和正式文字中使用的姓名。",
  email: "电子邮箱",
  phone: "电话号码",
  phonePlaceholder: "可选",
  phoneHint: "如果你愿意，可以把电话号码保存在这里。",
  noPhone: "还没有保存电话号码。",
  memberSince: "账户创建于",
  emailStatus: "邮箱状态",
  emailVerified: "已验证",
  emailNotVerified: "尚未验证",
  emailChangeTitle: "修改邮箱",
  emailChangeText: "出于安全原因，这一步会在安全设置中处理。",
  emailChangeAction: "前往安全设置",
  languageTitle: "应用语言",
  languageText: "语言与翻译会在单独的语言设置中管理。",
  languageAction: "前往语言与翻译",
  signatureTitle: "当前使用的签名",
  signatureText: "BureauCare 会在回复草稿和正式文本中这样使用你的姓名。",
  save: "保存资料",
  saving: "正在保存资料...",
  saved: "你的个人资料已保存。",
  saveError: "个人资料暂时无法保存。",
  requiredName: "请输入名字和姓氏。"
};

const fallbackMap: Record<SupportedLanguage, ProfileSettingsCopy> = {
  de,
  en,
  tr: en,
  uk: en,
  es: en,
  zh
};

export function getProfileSettingsCopy(locale: string | null | undefined) {
  return fallbackMap[normalizePreferredLanguage(locale)];
}
