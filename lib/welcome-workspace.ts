import type { SupportedLanguage } from "@/lib/languages";
import type {
  CaseRecord,
  DocumentAnalysisRecord,
  DocumentRecord,
  DraftReplyRecord,
  TaskRecord
} from "@/lib/types";
import type { WelcomeStepKey } from "@/lib/welcome";
import { getWelcomeGuidance, getWelcomeGuidanceText } from "@/lib/welcome-guidance";

type LocalizedText = Partial<Record<SupportedLanguage, string>>;

export type WelcomeWorkspaceCopy = {
  documentsTitle: string;
  documentsText: string;
  noDocumentsTitle: string;
  noDocumentsText: string;
  uploadLabel: string;
  linkExistingLabel: string;
  linkedLabel: string;
  analyzeLabel: string;
  analyzingLabel: string;
  openDocumentLabel: string;
  replyTitle: string;
  replyText: string;
  noReplyText: string;
  createReplyLabel: string;
  latestReplyLabel: string;
  caseTitle: string;
  caseText: string;
  createCaseLabel: string;
  openCaseLabel: string;
  taskTitle: string;
  taskText: string;
  createTaskLabel: string;
  noTasksText: string;
  deadlineLabel: string;
  nextStepMeaning: string;
  replyContextHint: string;
};

const copyMap: Record<SupportedLanguage, WelcomeWorkspaceCopy> = {
  de: {
    documentsTitle: "Dokumente zu diesem Schritt",
    documentsText: "Hier findest du Dokumente, die genau zu diesem Welcome-Schritt gehoeren.",
    noDocumentsTitle: "Noch keine Dokumente zugeordnet",
    noDocumentsText: "Lade hier direkt Dokumente fuer diesen Schritt hoch oder verknuepfe spaeter passende Dokumente.",
    uploadLabel: "Dokument fuer diesen Schritt hochladen",
    linkExistingLabel: "Vorhandenes Dokument verknuepfen",
    linkedLabel: "Mit diesem Schritt verknuepft",
    analyzeLabel: "Dokument analysieren",
    analyzingLabel: "Dokument wird analysiert...",
    openDocumentLabel: "Zum Dokument",
    replyTitle: "Antworten und Anfragen",
    replyText: "Wenn zu diesem Schritt ein Schreiben oder eine Rueckfrage gehoert, kannst du hier direkt weitermachen.",
    noReplyText: "Sobald ein Dokument analysiert ist, kannst du von hier direkt eine passende Antwort vorbereiten.",
    createReplyLabel: "Antwort vorbereiten",
    latestReplyLabel: "Letzter Entwurf vorhanden",
    caseTitle: "Zugehoeriger Fall",
    caseText: "Dieser Welcome-Schritt kann an einen eigenen Fall gebunden werden, damit Dokumente und Aufgaben zusammenbleiben.",
    createCaseLabel: "Fall fuer diesen Schritt anlegen",
    openCaseLabel: "Fall oeffnen",
    taskTitle: "Aufgaben und Fristen",
    taskText: "Hier siehst du To-dos und Fristen, die zu diesem Schritt gehoeren.",
    createTaskLabel: "Naechste Aufgabe anlegen",
    noTasksText: "Noch keine Aufgabe fuer diesen Schritt vorhanden.",
    deadlineLabel: "Frist",
    nextStepMeaning: "Aus diesem Schritt abgeleitet",
    replyContextHint: "Antwortgenerator nutzt das verknuepfte Dokument als Kontext."
  },
  en: {
    documentsTitle: "Documents for this step",
    documentsText: "Here you can find documents that belong to this Welcome step.",
    noDocumentsTitle: "No documents linked yet",
    noDocumentsText: "Upload documents for this step here or link matching documents later.",
    uploadLabel: "Upload document for this step",
    linkExistingLabel: "Link existing document",
    linkedLabel: "Linked to this step",
    analyzeLabel: "Analyze document",
    analyzingLabel: "Analyzing document...",
    openDocumentLabel: "Open document",
    replyTitle: "Replies and requests",
    replyText: "If this step involves a letter or a request, you can continue from here.",
    noReplyText: "As soon as a document is analyzed, you can prepare a matching reply from here.",
    createReplyLabel: "Prepare reply",
    latestReplyLabel: "Latest draft available",
    caseTitle: "Linked case",
    caseText: "This Welcome step can be tied to its own case so documents and tasks stay together.",
    createCaseLabel: "Create case for this step",
    openCaseLabel: "Open case",
    taskTitle: "Tasks and deadlines",
    taskText: "Here you see to-dos and deadlines connected to this step.",
    createTaskLabel: "Create next task",
    noTasksText: "No task exists for this step yet.",
    deadlineLabel: "Deadline",
    nextStepMeaning: "Derived from this step",
    replyContextHint: "The reply generator uses the linked document as context."
  },
  tr: undefined as never,
  uk: undefined as never,
  es: undefined as never,
  zh: {
    documentsTitle: "与这一步相关的文件",
    documentsText: "这里会显示直接属于这个 Welcome 步骤的文件。",
    noDocumentsTitle: "还没有关联文件",
    noDocumentsText: "你可以直接为这一步上传文件，或者之后再把合适的文件关联过来。",
    uploadLabel: "为这一步上传文件",
    linkExistingLabel: "关联已有文件",
    linkedLabel: "已关联到这一步",
    analyzeLabel: "分析文件",
    analyzingLabel: "正在分析文件...",
    openDocumentLabel: "打开文件",
    replyTitle: "回复和请求",
    replyText: "如果这一步需要处理来信或发送请求，你可以从这里继续。",
    noReplyText: "一旦文件完成分析，你就可以直接从这里准备回复。",
    createReplyLabel: "准备回复",
    latestReplyLabel: "已有最近草稿",
    caseTitle: "关联的案件",
    caseText: "这个 Welcome 步骤可以绑定到一个案件里，这样文件和任务会保持在一起。",
    createCaseLabel: "为这一步创建案件",
    openCaseLabel: "打开案件",
    taskTitle: "任务和期限",
    taskText: "这里会显示和这一步相关的待办与期限。",
    createTaskLabel: "创建下一步任务",
    noTasksText: "这一步还没有任务。",
    deadlineLabel: "期限",
    nextStepMeaning: "从这一步生成",
    replyContextHint: "回复生成会使用已关联文件作为上下文。"
  }
};

copyMap.tr = copyMap.en;
copyMap.uk = copyMap.en;
copyMap.es = copyMap.en;

export function getWelcomeWorkspaceCopy(locale: SupportedLanguage) {
  return copyMap[locale];
}

export function buildWelcomeCaseTitle(stepKey: WelcomeStepKey, locale: SupportedLanguage) {
  const guidance = getWelcomeGuidance(stepKey);
  const institution = getWelcomeGuidanceText(guidance.institutionName, locale);
  const titles: Record<WelcomeStepKey, LocalizedText> = {
    city_registration: { de: "Anmeldung", en: "Address registration", zh: "住址登记" },
    tax_id: { de: "Steuer-ID", en: "Tax ID", zh: "税号" },
    health_insurance: { de: "Krankenversicherung", en: "Health insurance", zh: "医疗保险" },
    bank_account: { de: "Bankkonto", en: "Bank account", zh: "银行账户" },
    residence_permit: { de: "Aufenthaltstitel", en: "Residence permit", zh: "居留许可" },
    work_permit: { de: "Arbeitserlaubnis", en: "Work permit", zh: "工作许可" },
    broadcast_fee: { de: "Rundfunkbeitrag", en: "Broadcast fee", zh: "广播电视费" },
    child_benefit: { de: "Kindergeld", en: "Child benefit", zh: "儿童金" },
    university_enrollment: { de: "Uni-Einschreibung", en: "University enrollment", zh: "大学注册" }
  };

  const title = getLocalizedText(titles[stepKey], locale);
  return institution ? `${institution} / ${title}` : title;
}

export function getLocalizedText(text: LocalizedText | undefined, locale: SupportedLanguage) {
  return text?.[locale] ?? text?.en ?? text?.de ?? Object.values(text ?? {})[0] ?? "";
}

export type WelcomeWorkspaceDocumentItem = {
  document: DocumentRecord;
  analysis: DocumentAnalysisRecord | null;
  replies: DraftReplyRecord[];
};

export type WelcomeWorkspaceData = {
  caseItem: CaseRecord | null;
  documents: WelcomeWorkspaceDocumentItem[];
  tasks: TaskRecord[];
  recentDocuments: DocumentRecord[];
};
