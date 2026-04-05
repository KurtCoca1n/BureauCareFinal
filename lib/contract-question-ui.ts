import { normalizePreferredLanguage } from "@/lib/languages";
import type { ContractQuestionFormat, ContractQuestionTone } from "@/lib/types";

type ContractQuestionCopy = {
  title: string;
  intro: string;
  pointLabel: string;
  modeHint: string;
  toneLabel: string;
  formatLabel: string;
  generate: string;
  generating: string;
  generatedTitle: string;
  previousTitle: string;
  copy: string;
  copied: string;
  openReply: string;
  noPoints: string;
  email: string;
  message: string;
  questionList: string;
  tones: Record<ContractQuestionTone, string>;
};

const de: ContractQuestionCopy = {
  title: "Rueckfrage formulieren",
  intro: "BureauCare hilft dir, aus unklaren oder auffaelligen Vertragsstellen eine ruhige Rueckfrage zu machen.",
  pointLabel: "Dazu nachfragen",
  modeHint: "Waehle einen Punkt fuer eine Einzel-Rueckfrage oder mehrere Punkte fuer eine Sammel-Rueckfrage.",
  toneLabel: "Ton",
  formatLabel: "Format",
  generate: "Rueckfrage erstellen",
  generating: "Rueckfrage wird erstellt...",
  generatedTitle: "Deine Rueckfrage",
  previousTitle: "Fruehere Rueckfragen",
  copy: "Text kopieren",
  copied: "Kopiert",
  openReply: "Im normalen Antwortgenerator oeffnen",
  noPoints: "Zurzeit gibt es keine klaren Punkte fuer eine Rueckfrage.",
  email: "Kurze E-Mail",
  message: "Formelle Nachricht",
  questionList: "Mehrere Fragen",
  tones: {
    friendly: "Freundlich",
    factual: "Sachlich",
    formal: "Etwas formeller",
    careful_firm: "Vorsichtig, aber bestimmt"
  }
};

const en: ContractQuestionCopy = {
  ...de,
  title: "Draft a clarification request",
  intro: "BureauCare helps you turn unclear or noticeable contract points into a calm question.",
  pointLabel: "Ask about this",
  modeHint: "Choose one point for a single question or several points for one combined message.",
  toneLabel: "Tone",
  formatLabel: "Format",
  generate: "Create question",
  generating: "Creating question...",
  generatedTitle: "Your question",
  previousTitle: "Earlier questions",
  copy: "Copy text",
  copied: "Copied",
  openReply: "Open in the regular reply generator",
  noPoints: "There are no clear points for a follow-up question right now.",
  email: "Short email",
  message: "Formal message",
  questionList: "Several questions",
  tones: {
    friendly: "Friendly",
    factual: "Factual",
    formal: "More formal",
    careful_firm: "Careful but firm"
  }
};

const zh: ContractQuestionCopy = {
  ...en,
  title: "生成一条回问",
  intro: "BureauCare 可以把合同里不清楚或值得注意的地方整理成一条礼貌、清楚的回问。",
  pointLabel: "想问的点",
  modeHint: "选一个点会生成单独回问，选多个点会生成一条合并消息。",
  toneLabel: "语气",
  formatLabel: "格式",
  generate: "生成回问",
  generating: "正在生成回问...",
  generatedTitle: "你的回问",
  previousTitle: "之前的回问",
  copy: "复制文本",
  copied: "已复制",
  openReply: "在普通回复生成器中打开",
  noPoints: "目前没有特别适合继续追问的明确点。",
  email: "简短邮件",
  message: "正式消息",
  questionList: "多个问题",
  tones: {
    friendly: "友好",
    factual: "客观",
    formal: "更正式",
    careful_firm: "谨慎但明确"
  }
};

const copy = { de, en, tr: en, uk: en, es: en, zh } as const;

export function getContractQuestionCopy(locale: string | null | undefined) {
  return copy[normalizePreferredLanguage(locale)];
}

export function getContractQuestionFormatLabel(locale: string | null | undefined, format: ContractQuestionFormat) {
  const selected = getContractQuestionCopy(locale);
  if (format === "message") return selected.message;
  if (format === "question_list") return selected.questionList;
  return selected.email;
}

