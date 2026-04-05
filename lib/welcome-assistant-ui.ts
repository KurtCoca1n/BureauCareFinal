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
  nextStepBadge: "你的下一步",
  nextStepTitle: "你现在最适合先做什么",
  nextStepText: "BureauCare 会结合你的路线图、任务和文件，提示现在最有帮助的下一步。",
  openStepLabel: "打开步骤",
  createTaskLabel: "创建任务",
  remindersTitle: "温和提醒",
  remindersText: "这里只显示最重要的提醒，这样你的 Welcome 区域会保持清晰和安静。",
  suggestionsTitle: "这些也可能和你有关",
  suggestionsText: "这些建议会尽量谨慎，只作为对你当前情况的帮助提示。",
  noReminders: "目前没有紧急提醒。",
  noSuggestions: "等 BureauCare 更了解你的情况后，这里会出现更合适的建议。",
  overdueBadge: "重要",
  soonBadge: "很快",
  missingBadge: "还缺少",
  staleBadge: "仍未完成",
  progressHint: "你的 Welcome 计划里还有 {open} 个步骤未完成。",
  openWelcomeLabel: "打开 Welcome",
  reviewStepLabel: "查看步骤",
  stepBasedLabel: "来自你的 Welcome 计划",
  relevantLabel: "可能和你有关",
  reminderKinds: {
    deadlineSoon: "期限快到了",
    deadlineOverdue: "期限已过",
    missingDocuments: "还缺少文件",
    staleStep: "这个步骤已经开着一段时间了",
    appointment: "大概率需要预约"
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
