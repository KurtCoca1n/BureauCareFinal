import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

export type WelcomeAssistantCopy = {
  nextStepBadge: string;
  nextStepTitle: string;
  nextStepText: string;
  openStepLabel: string;
  createTaskLabel: string;
  remindersTitle: string;
  remindersText: string;
  suggestionsTitle: string;
  suggestionsText: string;
  noReminders: string;
  noSuggestions: string;
  overdueBadge: string;
  soonBadge: string;
  missingBadge: string;
  staleBadge: string;
  progressHint: string;
  openWelcomeLabel: string;
  reviewStepLabel: string;
  stepBasedLabel: string;
  relevantLabel: string;
  reminderKinds: {
    deadlineSoon: string;
    deadlineOverdue: string;
    missingDocuments: string;
    staleStep: string;
    appointment: string;
  };
};

const en: WelcomeAssistantCopy = {
  nextStepBadge: "Your next step",
  nextStepTitle: "What you should do next",
  nextStepText: "BureauCare looks at your roadmap, tasks and documents and suggests the most useful next step.",
  openStepLabel: "Open step",
  createTaskLabel: "Create task",
  remindersTitle: "Helpful reminders",
  remindersText: "Only the most useful reminders are shown here, so the guide stays calm and clear.",
  suggestionsTitle: "This could also matter for you",
  suggestionsText: "These are careful suggestions based on your Welcome profile and saved data.",
  noReminders: "There is nothing urgent right now.",
  noSuggestions: "As soon as BureauCare knows a bit more, useful suggestions can appear here.",
  overdueBadge: "Important",
  soonBadge: "Soon",
  missingBadge: "Missing",
  staleBadge: "Still open",
  progressHint: "{open} steps are still open in your Welcome plan.",
  openWelcomeLabel: "Open Welcome",
  reviewStepLabel: "Review step",
  stepBasedLabel: "From your Welcome plan",
  relevantLabel: "Could be relevant",
  reminderKinds: {
    deadlineSoon: "Deadline soon",
    deadlineOverdue: "Deadline passed",
    missingDocuments: "Documents still missing",
    staleStep: "Still open for a while",
    appointment: "Appointment likely needed"
  }
};

const de: WelcomeAssistantCopy = {
  nextStepBadge: "Dein naechster Schritt",
  nextStepTitle: "Das solltest du jetzt als Naechstes machen",
  nextStepText: "BureauCare schaut auf deine Roadmap, Aufgaben und Dokumente und hebt den sinnvollsten naechsten Schritt hervor.",
  openStepLabel: "Schritt oeffnen",
  createTaskLabel: "Aufgabe anlegen",
  remindersTitle: "Hilfreiche Erinnerungen",
  remindersText: "Hier erscheinen nur die wichtigsten Hinweise, damit dein Welcome-Bereich ruhig und klar bleibt.",
  suggestionsTitle: "Das koennte auch relevant sein",
  suggestionsText: "Diese Vorschlaege sind bewusst vorsichtig formuliert und basieren auf deinem Welcome-Profil und gespeicherten Angaben.",
  noReminders: "Gerade gibt es keinen dringenden Hinweis.",
  noSuggestions: "Sobald BureauCare etwas mehr ueber deine Situation weiss, koennen hier passende Vorschlaege erscheinen.",
  overdueBadge: "Wichtig",
  soonBadge: "Bald",
  missingBadge: "Fehlt noch",
  staleBadge: "Noch offen",
  progressHint: "In deinem Welcome-Plan sind noch {open} Schritte offen.",
  openWelcomeLabel: "Welcome oeffnen",
  reviewStepLabel: "Schritt pruefen",
  stepBasedLabel: "Aus deinem Welcome-Plan",
  relevantLabel: "Koennte relevant sein",
  reminderKinds: {
    deadlineSoon: "Frist bald",
    deadlineOverdue: "Frist abgelaufen",
    missingDocuments: "Dokumente fehlen noch",
    staleStep: "Seit einer Weile offen",
    appointment: "Termin wahrscheinlich noetig"
  }
};

const zh: WelcomeAssistantCopy = {
  nextStepBadge: "\u4f60\u7684\u4e0b\u4e00\u6b65",
  nextStepTitle: "\u4f60\u73b0\u5728\u6700\u9002\u5408\u5148\u505a\u4ec0\u4e48",
  nextStepText: "BureauCare \u4f1a\u7ed3\u5408\u4f60\u7684\u8def\u7ebf\u56fe\u3001\u4efb\u52a1\u548c\u6587\u4ef6\uff0c\u63d0\u793a\u73b0\u5728\u6700\u6709\u5e2e\u52a9\u7684\u4e0b\u4e00\u6b65\u3002",
  openStepLabel: "\u6253\u5f00\u6b65\u9aa4",
  createTaskLabel: "\u521b\u5efa\u4efb\u52a1",
  remindersTitle: "\u6e29\u548c\u63d0\u9192",
  remindersText: "\u8fd9\u91cc\u53ea\u663e\u793a\u6700\u91cd\u8981\u7684\u63d0\u9192\uff0c\u8fd9\u6837\u4f60\u7684 Welcome \u533a\u57df\u4f1a\u4fdd\u6301\u6e05\u6670\u548c\u5b89\u9759\u3002",
  suggestionsTitle: "\u8fd9\u4e9b\u4e5f\u53ef\u80fd\u548c\u4f60\u6709\u5173",
  suggestionsText: "\u8fd9\u4e9b\u5efa\u8bae\u4f1a\u5c3d\u91cf\u8c28\u614e\uff0c\u53ea\u4f5c\u4e3a\u5bf9\u4f60\u5f53\u524d\u60c5\u51b5\u7684\u5e2e\u52a9\u63d0\u793a\u3002",
  noReminders: "\u76ee\u524d\u6ca1\u6709\u7d27\u6025\u63d0\u9192\u3002",
  noSuggestions: "\u7b49 BureauCare \u66f4\u4e86\u89e3\u4f60\u7684\u60c5\u51b5\u540e\uff0c\u8fd9\u91cc\u4f1a\u51fa\u73b0\u66f4\u5408\u9002\u7684\u5efa\u8bae\u3002",
  overdueBadge: "\u91cd\u8981",
  soonBadge: "\u5f88\u5feb",
  missingBadge: "\u8fd8\u7f3a\u5c11",
  staleBadge: "\u4ecd\u672a\u5b8c\u6210",
  progressHint: "\u4f60\u7684 Welcome \u8ba1\u5212\u91cc\u8fd8\u6709 {open} \u4e2a\u6b65\u9aa4\u672a\u5b8c\u6210\u3002",
  openWelcomeLabel: "\u6253\u5f00 Welcome",
  reviewStepLabel: "\u67e5\u770b\u6b65\u9aa4",
  stepBasedLabel: "\u6765\u81ea\u4f60\u7684 Welcome \u8ba1\u5212",
  relevantLabel: "\u53ef\u80fd\u548c\u4f60\u6709\u5173",
  reminderKinds: {
    deadlineSoon: "\u671f\u9650\u5feb\u5230\u4e86",
    deadlineOverdue: "\u671f\u9650\u5df2\u8fc7",
    missingDocuments: "\u8fd8\u7f3a\u5c11\u6587\u4ef6",
    staleStep: "\u8fd9\u4e2a\u6b65\u9aa4\u5df2\u7ecf\u5f00\u7740\u4e00\u6bb5\u65f6\u95f4\u4e86",
    appointment: "\u5927\u6982\u7387\u9700\u8981\u9884\u7ea6"
  }
};

const copyMap: Record<SupportedLanguage, WelcomeAssistantCopy> = {
  de,
  en,
  tr: en,
  uk: en,
  es: en,
  zh
};

export function getWelcomeAssistantCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
}

export function formatWelcomeAssistantText(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
