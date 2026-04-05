import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type { AccountRole } from "@/lib/types";

type ToggleCopy = {
  label: string;
  description: string;
};

type ChannelCopy = {
  title: string;
  description: string;
};

type RestSettingsCopy = {
  save: string;
  saving: string;
  inApp: string;
  byEmail: string;
  language: {
    title: string;
    intro: string;
    appLanguage: string;
    nativeLanguage: string;
    replyLanguage: string;
    simplifiedLanguage: ToggleCopy;
    explainTerms: ToggleCopy;
    replyModes: Record<"german_only" | "app_language" | "native_only", { label: string; description: string }>;
  };
  location: {
    title: string;
    intro: string;
    localInfo: string;
    usesTitle: string;
    uses: ToggleCopy[];
  };
  documents: {
    title: string;
    intro: string;
    toggles: ToggleCopy[];
  };
  goals: {
    title: string;
    intro: string;
    toggles: ToggleCopy[];
  };
  notifications: {
    title: string;
    intro: string;
    channels: Record<string, ChannelCopy>;
  };
  security: {
    title: string;
    intro: string;
    passwordTitle: string;
    passwordHint: string;
    newPassword: string;
    confirmPassword: string;
    changePassword: string;
    emailTitle: string;
    emailHint: string;
    newEmail: string;
    changeEmail: string;
    sessionsTitle: string;
    sessionsHint: string;
    signOutEverywhere: string;
    twoFactorTitle: string;
    twoFactorText: string;
  };
  usage: {
    title: string;
    intro: string;
    currentPlan: string;
    testerUnlimited: string;
    freePlan: string;
    adminPlan: string;
    upgrade: string;
    analyses: string;
    replies: string;
    uploads: string;
    noUploadLimit: string;
  };
  privacy: {
    title: string;
    intro: string;
    exportData: string;
    exportDocuments: string;
    clearData: string;
    clearDataHint: string;
    deleteAccount: string;
    deleteAccountHint: string;
    policyTitle: string;
    policyText: string;
    termsTitle: string;
    termsText: string;
  };
  tester: {
    title: string;
    intro: string;
    roleLabel: string;
    unlimited: string;
    featureFlags: string;
    createCase: string;
    createDocument: string;
    badges: Record<AccountRole, string>;
    toggles: ToggleCopy[];
  };
};

const de: RestSettingsCopy = {
  save: "Speichern",
  saving: "Wird gespeichert...",
  inApp: "In-App",
  byEmail: "E-Mail",
  language: {
    title: "Sprache & Uebersetzung",
    intro: "BureauCare soll sich fuer dich natuerlich anfuehlen. Hier steuerst du App-Sprache, Antwortsprache und Verstaendlichkeit.",
    appLanguage: "App-Sprache",
    nativeLanguage: "Muttersprache oder Zweitsprache",
    replyLanguage: "Antwortsprache",
    simplifiedLanguage: {
      label: "Vereinfachte Sprache",
      description: "Erklaerungen, Zusammenfassungen und To-dos werden einfacher formuliert."
    },
    explainTerms: {
      label: "Schwierige Woerter automatisch erklaeren",
      description: "BureauCare markiert schwierige Begriffe und zeigt einfache Erklaerungen."
    },
    replyModes: {
      german_only: { label: "Nur Deutsch", description: "Antworten werden nur in Deutsch vorbereitet." },
      app_language: { label: "Deutsch + App-Sprache", description: "BureauCare zeigt zusaetzlich die Sprache deiner App." },
      native_only: { label: "Nur Muttersprache", description: "Wenn sinnvoll, nutzt BureauCare nur deine Muttersprache." }
    }
  },
  location: {
    title: "Standort",
    intro: "Mit Standort kann BureauCare lokale Aemter, Poststellen und zustaendige Stellen in deiner Naehe besser einordnen.",
    localInfo: "Wenn du den Standort erlaubst, speichert BureauCare ihn fuer lokale Hinweise und passende Stellen. Du kannst das jederzeit zuruecksetzen.",
    usesTitle: "Standort wird verwendet fuer",
    uses: [
      { label: "Zustaendige Aemter finden", description: "Zeigt passende Stellen in deiner Naehe." },
      { label: "Post und Abgabeorte finden", description: "Hilft bei Einschreiben, Abgabe und Versand." },
      { label: "Termine und Behoerden in der Naehe", description: "Macht Ortsbezug in Aufgaben greifbarer." },
      { label: "Lokale Hinweise in Antraegen", description: "Beruecksichtigt Ort bei Prozessen und Antraegen." }
    ]
  },
  documents: {
    title: "Dokumente & Faelle",
    intro: "Diese Einstellungen steuern, wie viel Ordnung und Automatisierung BureauCare bei Dokumenten und Faellen fuer dich uebernimmt.",
    toggles: [
      { label: "Dokumente automatisch Faellen zuordnen", description: "Ordnet neue Dokumente ruhiger und schneller bestehenden Faellen zu." },
      { label: "Dokumente automatisch nach Absender sortieren", description: "Hilft bei wiederkehrenden Stellen und mehr Ordnung." },
      { label: "Mehrseitige Dokumente automatisch zusammenfuehren", description: "Verhindert unnoetige einzelne Seiten im Upload." },
      { label: "Dokumente automatisch umbenennen", description: "Vergibt bessere Dateinamen fuer spaetere Orientierung." },
      { label: "Originaldokumente speichern", description: "Behaelt die Originaldatei zusaetzlich zur Verarbeitung." },
      { label: "Dokument-Status automatisch aktualisieren", description: "Bewegt Dokumente schneller zwischen neu, analysiert und erledigt." }
    ]
  },
  goals: {
    title: "Ziele & Wuensche",
    intro: "Hier legst du fest, wie intensiv BureauCare dich bei Zielen, Wuenschen und Fortschritt begleitet.",
    toggles: [
      { label: "Alter im Zielsystem anzeigen", description: "Zeigt Altersbezug, wenn er fuer dein Ziel relevant ist." },
      { label: "Finanz-Tracker anzeigen", description: "Blendet finanzielle Orientierung bei passenden Zielen ein." },
      { label: "KI darf Vorschlaege zu Zielen machen", description: "BureauCare darf passende Ideen und naechste Schritte vorschlagen." },
      { label: "Fortschritt anzeigen", description: "Zeigt Balken und Fortschrittsstand im Zielbereich." },
      { label: "Ziel-Erinnerungen aktivieren", description: "Bereitet spaetere Erinnerungen fuer Ziele und Fristen vor." }
    ]
  },
  notifications: {
    title: "Benachrichtigungen",
    intro: "Waehle ruhig und klar aus, wozu BureauCare dich erinnern oder informieren darf.",
    channels: {
      deadlines: { title: "Fristen und Deadlines", description: "Wenn etwas zeitkritisch wird." },
      analysis: { title: "Dokumentanalyse fertig", description: "Wenn eine Analyse abgeschlossen ist." },
      replies: { title: "Antwort generiert", description: "Wenn ein neuer Antwortentwurf bereitsteht." },
      cases: { title: "Fallstatus geaendert", description: "Wenn sich in einem Fall etwas Wichtiges bewegt." },
      suggestions: { title: "Neue moegliche Hinweise", description: "Wenn neue relevante Hilfen oder Prozesse auftauchen." },
      goals: { title: "Ziel-Erinnerungen", description: "Wenn BureauCare dich bei Zielen dezent erinnern soll." }
    }
  },
  security: {
    title: "Sicherheit",
    intro: "Hier verwaltest du sensible Kontoaenderungen und deinen sicheren Zugriff auf BureauCare.",
    passwordTitle: "Passwort aendern",
    passwordHint: "Nutze mindestens 8 Zeichen fuer ein ruhiges, sicheres Update.",
    newPassword: "Neues Passwort",
    confirmPassword: "Passwort wiederholen",
    changePassword: "Passwort aktualisieren",
    emailTitle: "E-Mail aendern",
    emailHint: "Die neue Adresse wird erst nach Bestaetigung aktiv.",
    newEmail: "Neue E-Mail-Adresse",
    changeEmail: "Bestaetigung senden",
    sessionsTitle: "Aktive Sitzungen",
    sessionsHint: "Wenn du moechtest, kannst du BureauCare auf allen Geraeten gleichzeitig abmelden.",
    signOutEverywhere: "Von allen Geraeten abmelden",
    twoFactorTitle: "2-Faktor-Authentifizierung",
    twoFactorText: "Dieser Bereich ist vorbereitet und kommt in einem spaeteren Sicherheitsschritt."
  },
  usage: {
    title: "Abo & Nutzung",
    intro: "Hier siehst du klar, welchen Zugriff du aktuell hast und wie stark du BureauCare in diesem Monat nutzt.",
    currentPlan: "Aktueller Plan",
    testerUnlimited: "Tester - unbegrenzter Zugriff",
    freePlan: "Free",
    adminPlan: "Intern",
    upgrade: "Premium spaeter freischalten",
    analyses: "Analysen in diesem Monat",
    replies: "Antworten in diesem Monat",
    uploads: "Uploads in diesem Monat",
    noUploadLimit: "Aktuell ohne harte Upload-Grenze"
  },
  privacy: {
    title: "Datenschutz",
    intro: "Dieser Bereich gibt dir ruhige Kontrolle ueber Export, Loeschung und die wichtigsten rechtlichen Hinweise.",
    exportData: "Meine Daten exportieren",
    exportDocuments: "Alle Dokumente exportieren",
    clearData: "Alle BureauCare-Daten loeschen",
    clearDataHint: "Loescht gespeicherte Inhalte aus der App, laesst dein Konto aber bestehen.",
    deleteAccount: "Konto loeschen",
    deleteAccountHint: "Entfernt dein Konto und deine BureauCare-Daten, wenn die sichere Server-Funktion verfuegbar ist.",
    policyTitle: "Datenschutzerklaerung",
    policyText: "Wir geben deine Daten nicht ohne deine Zustimmung weiter. Ausfuehrliche Rechtstexte koennen spaeter hier direkt verlinkt werden.",
    termsTitle: "Nutzungsbedingungen",
    termsText: "Die Nutzungsbedingungen werden hier als ruhiger Referenzpunkt gebuendelt."
  },
  tester: {
    title: "Tester / Admin",
    intro: "Dieser Bereich ist nur fuer berechtigte Accounts sichtbar und fasst internen Zugriff, Limits und Testwerkzeuge zusammen.",
    roleLabel: "Rolle",
    unlimited: "Unbegrenzt",
    featureFlags: "Feature Flags",
    createCase: "Testfall erstellen",
    createDocument: "Dummy-Dokument mit Testanalyse erstellen",
    badges: {
      user: "Nutzer",
      tester: "Tester",
      admin: "Admin",
      super_admin: "Super Admin"
    },
    toggles: [
      { label: "Ziele-System aktiv", description: "Interne Freigabe fuer das Ziele-System." },
      { label: "Module aktiv", description: "Interne Freigabe fuer groeßere Module." },
      { label: "Beta-Features aktiv", description: "Interne Freigabe fuer neue Testfunktionen." }
    ]
  }
};

const en: RestSettingsCopy = {
  save: "Save",
  saving: "Saving...",
  inApp: "In-app",
  byEmail: "Email",
  language: {
    title: "Language & translation",
    intro: "BureauCare should feel natural for you. Choose app language, reply language and how easy the wording should be.",
    appLanguage: "App language",
    nativeLanguage: "Native or second language",
    replyLanguage: "Reply language",
    simplifiedLanguage: { label: "Simplified language", description: "Explanations, summaries and to-dos are phrased more simply." },
    explainTerms: { label: "Explain difficult words automatically", description: "BureauCare marks difficult terms and explains them clearly." },
    replyModes: {
      german_only: { label: "German only", description: "Replies are prepared only in German." },
      app_language: { label: "German + app language", description: "BureauCare also shows your app language." },
      native_only: { label: "Only native language", description: "When it fits, BureauCare uses only your native language." }
    }
  },
  location: {
    title: "Location",
    intro: "Location helps BureauCare show nearby offices, post options and local authorities more accurately.",
    localInfo: "If you allow location, BureauCare stores it for local hints and suitable nearby places. You can reset this at any time.",
    usesTitle: "Location is used for",
    uses: [
      { label: "Finding relevant offices", description: "Shows nearby offices that fit your task." },
      { label: "Finding post and drop-off points", description: "Helps with posting, handover and registered mail." },
      { label: "Nearby appointments and authorities", description: "Makes place-based tasks easier to act on." },
      { label: "Local hints in applications", description: "Adds place context to processes and applications." }
    ]
  },
  documents: {
    title: "Documents & cases",
    intro: "These settings control how much organization and automation BureauCare should handle for your documents and cases.",
    toggles: [
      { label: "Assign documents to cases automatically", description: "Keeps related documents together with less manual work." },
      { label: "Sort documents by sender automatically", description: "Helps when the same offices contact you again." },
      { label: "Merge multi-page documents automatically", description: "Avoids separate page uploads when pages belong together." },
      { label: "Rename documents automatically", description: "Creates calmer file names for later orientation." },
      { label: "Keep original documents", description: "Stores the original file in addition to processed data." },
      { label: "Update document status automatically", description: "Moves documents through their workflow more smoothly." }
    ]
  },
  goals: {
    title: "Goals & wishes",
    intro: "Choose how actively BureauCare should support your goals, wishes and progress.",
    toggles: [
      { label: "Show age in the goal system", description: "Keeps age visible when it matters for the goal." },
      { label: "Show finance tracker", description: "Adds financial orientation when a goal involves money." },
      { label: "Allow AI suggestions for goals", description: "Lets BureauCare suggest suitable next steps." },
      { label: "Show progress", description: "Displays progress bars and completion status." },
      { label: "Enable goal reminders", description: "Prepares later reminders for goals and timelines." }
    ]
  },
  notifications: {
    title: "Notifications",
    intro: "Choose calmly what BureauCare may remind you about and how it should reach you.",
    channels: {
      deadlines: { title: "Deadlines", description: "When something becomes time-sensitive." },
      analysis: { title: "Document analysis ready", description: "When an analysis has finished." },
      replies: { title: "Reply generated", description: "When a new draft reply is ready." },
      cases: { title: "Case status changed", description: "When something important changes in a case." },
      suggestions: { title: "New relevant suggestions", description: "When new help or processes may fit your situation." },
      goals: { title: "Goal reminders", description: "When BureauCare should gently remind you about a goal." }
    }
  },
  security: {
    title: "Security",
    intro: "Manage sensitive account changes and secure access to BureauCare here.",
    passwordTitle: "Change password",
    passwordHint: "Use at least 8 characters for a safe and calm update.",
    newPassword: "New password",
    confirmPassword: "Repeat password",
    changePassword: "Update password",
    emailTitle: "Change email",
    emailHint: "The new address becomes active only after confirmation.",
    newEmail: "New email address",
    changeEmail: "Send confirmation",
    sessionsTitle: "Active sessions",
    sessionsHint: "If you want, you can sign BureauCare out on every device at once.",
    signOutEverywhere: "Sign out on all devices",
    twoFactorTitle: "Two-factor authentication",
    twoFactorText: "This area is prepared and will be expanded in a later security step."
  },
  usage: {
    title: "Plan & usage",
    intro: "See clearly what access you currently have and how much you used BureauCare this month.",
    currentPlan: "Current plan",
    testerUnlimited: "Tester - unlimited access",
    freePlan: "Free",
    adminPlan: "Internal",
    upgrade: "Enable premium later",
    analyses: "Analyses this month",
    replies: "Replies this month",
    uploads: "Uploads this month",
    noUploadLimit: "Currently without a hard upload limit"
  },
  privacy: {
    title: "Privacy",
    intro: "This area gives you clear control over export, deletion and the most important legal references.",
    exportData: "Export my data",
    exportDocuments: "Export all documents",
    clearData: "Delete all BureauCare data",
    clearDataHint: "Removes saved app data but keeps your account.",
    deleteAccount: "Delete account",
    deleteAccountHint: "Removes your account and BureauCare data when the secure server function is available.",
    policyTitle: "Privacy policy",
    policyText: "We do not share your data without your consent. Detailed legal texts can be linked here later.",
    termsTitle: "Terms of use",
    termsText: "Terms of use will be bundled here as a quiet reference point."
  },
  tester: {
    title: "Tester / admin",
    intro: "This area is visible only for eligible accounts and groups internal access, limits and testing tools.",
    roleLabel: "Role",
    unlimited: "Unlimited",
    featureFlags: "Feature flags",
    createCase: "Create test case",
    createDocument: "Create dummy document with test analysis",
    badges: {
      user: "User",
      tester: "Tester",
      admin: "Admin",
      super_admin: "Super admin"
    },
    toggles: [
      { label: "Goals system enabled", description: "Internal access for the goals system." },
      { label: "Modules enabled", description: "Internal access for larger modules." },
      { label: "Beta features enabled", description: "Internal access for new testing features." }
    ]
  }
};

const zh: RestSettingsCopy = {
  ...en,
  save: "\u4fdd\u5b58",
  saving: "\u6b63\u5728\u4fdd\u5b58...",
  inApp: "App \u5185",
  byEmail: "\u7535\u5b50\u90ae\u4ef6",
  language: {
    ...en.language,
    title: "\u8bed\u8a00\u4e0e\u7ffb\u8bd1",
    intro: "BureauCare \u5e94\u8be5\u8bf4\u4f60\u66f4\u5bb9\u6613\u7406\u89e3\u7684\u8bed\u8a00\u3002\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u8bbe\u5b9a App \u8bed\u8a00\u3001\u56de\u590d\u8bed\u8a00\u548c\u6587\u5b57\u96be\u5ea6\u3002",
    appLanguage: "App \u8bed\u8a00",
    nativeLanguage: "\u6bcd\u8bed\u6216\u7b2c\u4e8c\u8bed\u8a00",
    replyLanguage: "\u56de\u590d\u8bed\u8a00"
  },
  location: { ...en.location, title: "\u4f4d\u7f6e", intro: "\u4f4d\u7f6e\u53ef\u4ee5\u5e2e\u52a9 BureauCare \u66f4\u51c6\u786e\u5730\u663e\u793a\u9644\u8fd1\u7684\u673a\u6784\u3001\u90ae\u5c40\u548c\u529e\u4e8b\u5730\u70b9\u3002", localInfo: "\u5b9e\u9645\u4f4d\u7f6e\u4ecd\u7136\u53ea\u4f1a\u4fdd\u5b58\u5728\u8fd9\u53f0\u8bbe\u5907\u672c\u5730\u3002", usesTitle: "\u4f4d\u7f6e\u4f1a\u7528\u4e8e" },
  documents: { ...en.documents, title: "\u6587\u4ef6\u4e0e\u6848\u4ef6", intro: "\u8fd9\u4e9b\u8bbe\u7f6e\u51b3\u5b9a BureauCare \u5728\u6587\u4ef6\u548c\u6848\u4ef6\u6574\u7406\u4e0a\u53ef\u4ee5\u4ee3\u4f60\u505a\u591a\u5c11\u3002" },
  goals: { ...en.goals, title: "\u76ee\u6807\u4e0e\u613f\u671b", intro: "\u8fd9\u91cc\u53ef\u4ee5\u8bbe\u5b9a BureauCare \u5728\u76ee\u6807\u548c\u8fdb\u5ea6\u4e0a\u5e0c\u671b\u63d0\u4f9b\u591a\u5c11\u5e2e\u52a9\u3002" },
  notifications: { ...en.notifications, title: "\u901a\u77e5", intro: "\u4f60\u53ef\u4ee5\u6e05\u6670\u9009\u62e9 BureauCare \u53ef\u4ee5\u63d0\u9192\u4f60\u4ec0\u4e48\uff0c\u4ee5\u53ca\u600e\u6837\u901a\u77e5\u4f60\u3002" },
  security: { ...en.security, title: "\u5b89\u5168", intro: "\u5728\u8fd9\u91cc\u7ba1\u7406\u654f\u611f\u7684\u5e10\u53f7\u53d8\u66f4\u548c BureauCare \u7684\u5b89\u5168\u8bbf\u95ee\u3002" },
  usage: { ...en.usage, title: "\u5957\u9910\u4e0e\u4f7f\u7528\u60c5\u51b5", intro: "\u5728\u8fd9\u91cc\u67e5\u770b\u5f53\u524d\u8bbf\u95ee\u6743\u9650\u4ee5\u53ca\u672c\u6708\u7684\u4f7f\u7528\u60c5\u51b5\u3002" },
  privacy: { ...en.privacy, title: "\u9690\u79c1", intro: "\u8fd9\u4e2a\u533a\u57df\u8ba9\u4f60\u53ef\u4ee5\u6e05\u695a\u63a7\u5236\u5bfc\u51fa\u3001\u5220\u9664\u548c\u91cd\u8981\u7684\u6cd5\u5f8b\u8bf4\u660e\u3002" },
  tester: { ...en.tester, title: "\u6d4b\u8bd5 / \u7ba1\u7406", intro: "\u8fd9\u4e2a\u533a\u57df\u53ea\u5bf9\u6709\u6743\u9650\u7684\u5e10\u53f7\u53ef\u89c1\uff0c\u7528\u4e8e\u96c6\u4e2d\u663e\u793a\u5185\u90e8\u8bbf\u95ee\u3001\u9650\u5236\u548c\u6d4b\u8bd5\u5de5\u5177\u3002" }
};

const fallbackMap: Record<SupportedLanguage, RestSettingsCopy> = {
  de,
  en,
  tr: en,
  uk: en,
  es: en,
  zh
};

export function getRestSettingsCopy(locale: string | null | undefined) {
  return fallbackMap[normalizePreferredLanguage(locale)];
}
