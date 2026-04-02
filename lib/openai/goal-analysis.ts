import OpenAI from "openai";
import { z } from "zod";

import type { GoalClarificationQuestion } from "@/lib/goals-ui";
import { normalizeGoalAnalysis } from "@/lib/goals-ui";
import { getServerEnv } from "@/lib/env";
import { getLanguageLabel, normalizePreferredLanguage } from "@/lib/languages";

const clarificationQuestionSchema = z.object({
  id: z.string().min(1),
  question: z.string().min(1),
  options: z.array(z.string().min(1)).min(2).max(5)
});

const goalIntakeSchema = z.object({
  needs_clarification: z.boolean(),
  finance_relevant: z.boolean(),
  financial_prompt: z.string().nullable(),
  follow_up_questions: z.array(clarificationQuestionSchema).max(4)
});

const goalStepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description_simple: z.string().min(1),
  estimated_duration: z.string().nullable(),
  importance: z.enum(["low", "medium", "high"]),
  status: z.enum(["open", "done"]),
  related_costs_note: z.string().nullable()
});

const goalAnalysisSchema = z.object({
  goal_title: z.string().min(1),
  goal_summary_simple: z.string().min(1),
  current_age: z.number().int().min(0).max(120).nullable(),
  target_age: z.number().int().min(0).max(120).nullable(),
  target_year: z.number().int().min(1900).max(2200).nullable().optional(),
  estimated_overall_timeline: z.string().nullable(),
  bureaucracy_steps: z.array(goalStepSchema).max(8),
  progress_percentage: z.number().int().min(0).max(100),
  financial_readiness_percentage: z.number().int().min(0).max(100).nullable(),
  finance_relevant: z.boolean(),
  ai_guidance: z.array(z.string().min(1)).min(2).max(6),
  recommendation_simple: z.string().min(1)
});

export type GoalIntakeResult = z.infer<typeof goalIntakeSchema>;
export type GoalAnalysisResult = z.infer<typeof goalAnalysisSchema>;

function buildIntakeSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      needs_clarification: { type: "boolean" },
      finance_relevant: { type: "boolean" },
      financial_prompt: { type: ["string", "null"] },
      follow_up_questions: {
        type: "array",
        maxItems: 4,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            question: { type: "string" },
            options: {
              type: "array",
              minItems: 2,
              maxItems: 5,
              items: { type: "string" }
            }
          },
          required: ["id", "question", "options"]
        }
      }
    },
    required: ["needs_clarification", "finance_relevant", "financial_prompt", "follow_up_questions"]
  };
}

function buildAnalysisSchema() {
  return {
    type: "object",
    additionalProperties: false,
    properties: {
      goal_title: { type: "string" },
      goal_summary_simple: { type: "string" },
      current_age: { type: ["integer", "null"] },
      target_age: { type: ["integer", "null"] },
      target_year: { type: ["integer", "null"] },
      estimated_overall_timeline: { type: ["string", "null"] },
      bureaucracy_steps: {
        type: "array",
        maxItems: 8,
        items: {
          type: "object",
          additionalProperties: false,
          properties: {
            id: { type: "string" },
            title: { type: "string" },
            description_simple: { type: "string" },
            estimated_duration: { type: ["string", "null"] },
            importance: { type: "string", enum: ["low", "medium", "high"] },
            status: { type: "string", enum: ["open", "done"] },
            related_costs_note: { type: ["string", "null"] }
          },
          required: ["id", "title", "description_simple", "estimated_duration", "importance", "status", "related_costs_note"]
        }
      },
      progress_percentage: { type: "integer", minimum: 0, maximum: 100 },
      financial_readiness_percentage: { type: ["integer", "null"], minimum: 0, maximum: 100 },
      finance_relevant: { type: "boolean" },
      ai_guidance: {
        type: "array",
        minItems: 2,
        maxItems: 6,
        items: { type: "string" }
      },
      recommendation_simple: { type: "string" }
    },
    required: [
      "goal_title",
      "goal_summary_simple",
      "current_age",
      "target_age",
      "target_year",
      "estimated_overall_timeline",
      "bureaucracy_steps",
      "progress_percentage",
      "financial_readiness_percentage",
      "finance_relevant",
      "ai_guidance",
      "recommendation_simple"
    ]
  };
}

function extractTargetAgeFromText(goalText: string) {
  const match = goalText.match(/\b(?:bis|mit)\s+(\d{1,3})\b/i);
  if (!match) {
    return null;
  }

  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function extractTargetYearFromText(goalText: string) {
  const match = goalText.match(/\b(19\d{2}|20\d{2}|21\d{2})\b/);
  if (!match) {
    return null;
  }

  const parsed = Number.parseInt(match[1], 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function deriveTargetAge({
  currentAge,
  targetAge,
  targetYear
}: {
  currentAge: number | null;
  targetAge: number | null;
  targetYear: number | null;
}) {
  if (targetAge !== null) {
    return targetAge;
  }

  if (currentAge === null || targetYear === null) {
    return null;
  }

  const yearsUntilTarget = targetYear - new Date().getFullYear();
  if (!Number.isFinite(yearsUntilTarget)) {
    return null;
  }

  return Math.max(currentAge + yearsUntilTarget, currentAge);
}

function inferFinanceRelevant(goalText: string) {
  return /(wohnung|haus|kaufen|kauf|eigentum|auto|oldtimer|porsche|studium|auswandern|unternehmen|selbstst[aä]ndig|gr[üu]nden|finanz|darlehen|kredit)/i.test(
    goalText.toLowerCase()
  );
}

function inferGoalTitle(goalText: string) {
  const trimmed = goalText.trim().replace(/[.?!]+$/, "");
  if (trimmed.length <= 72) {
    return trimmed;
  }

  return `${trimmed.slice(0, 69).trimEnd()}...`;
}

function inferTimeline(targetAge: number | null, targetYear: number | null) {
  if (targetYear !== null) {
    return `Bis ungefähr ${targetYear}`;
  }

  if (targetAge !== null) {
    return `Bis ungefähr zum Alter ${targetAge}`;
  }

  return "Schritt für Schritt in den nächsten Monaten planbar";
}

function buildContextText({
  goalText,
  currentAge,
  targetAge,
  targetYear,
  financialAmount,
  monthlyIncome,
  answers
}: {
  goalText: string;
  currentAge: number | null;
  targetAge: number | null;
  targetYear: number | null;
  financialAmount: number | null;
  monthlyIncome: number | null;
  answers: Record<string, string>;
}) {
  const clarificationText = Object.entries(answers)
    .map(([questionId, answer]) => `${questionId}: ${answer}`)
    .join("\n");

  return `Ziel: ${goalText}
Aktuelles Alter: ${currentAge ?? "nicht angegeben"}
Zielalter: ${targetAge ?? "nicht angegeben"}
Zieljahr: ${targetYear ?? "nicht angegeben"}
Aktuelles Erspartes: ${financialAmount ?? "nicht angegeben"}
Monatliches Einkommen: ${monthlyIncome ?? "nicht angegeben"}
Zusätzliche Antworten:
${clarificationText || "keine"}`;
}

function buildFallbackSteps(goalText: string) {
  const normalized = goalText.toLowerCase();

  if (/(oldtimer|auto|porsche|fahrzeug|wagen)/i.test(normalized)) {
    return [
      {
        id: "step-1",
        title: "Budget und Unterlagen sortieren",
        description_simple: "Kläre zuerst, wie viel du wirklich ausgeben kannst und welche Unterlagen für Kauf, Versicherung und Anmeldung wichtig sind.",
        estimated_duration: "1 bis 2 Wochen",
        importance: "high" as const,
        status: "open" as const,
        related_costs_note: "Dazu zählen oft Kaufpreis, Versicherung, Kennzeichen, Zulassung und mögliche Gutachten."
      },
      {
        id: "step-2",
        title: "Fahrzeugdaten und Nachweise prüfen",
        description_simple: "Prüfe, ob Fahrzeugbrief, Historie, TÜV-Unterlagen und bei einem Oldtimer besondere Nachweise vollständig sind.",
        estimated_duration: "einige Tage",
        importance: "high" as const,
        status: "open" as const,
        related_costs_note: "Fehlende Nachweise können später Zeit und zusätzliches Geld kosten."
      },
      {
        id: "step-3",
        title: "Kauf und Anmeldung vorbereiten",
        description_simple: "Wenn alles passt, brauchst du im nächsten Schritt meist Kaufvertrag, Versicherung und danach die Anmeldung bei der Zulassungsstelle.",
        estimated_duration: "1 bis 3 Wochen",
        importance: "medium" as const,
        status: "open" as const,
        related_costs_note: "Für Anmeldung und Kennzeichen können zusätzliche Gebühren anfallen."
      }
    ];
  }

  if (/(wohnung|haus|immobilie|eigentum|kaufen)/i.test(normalized)) {
    return [
      {
        id: "step-1",
        title: "Finanzierung und Nachweise vorbereiten",
        description_simple: "Ordne zuerst Einkommen, Erspartes und wichtige Unterlagen, damit du später bei Bank oder Verkäufer nicht stockst.",
        estimated_duration: "2 bis 6 Wochen",
        importance: "high" as const,
        status: "open" as const,
        related_costs_note: "Eigenkapital, Rücklagen und laufende Nebenkosten spielen oft eine große Rolle."
      },
      {
        id: "step-2",
        title: "Unterlagen vollständig sammeln",
        description_simple: "Typisch sind Ausweise, Einkommensnachweise, Kontoauszüge und weitere Bonitätsunterlagen.",
        estimated_duration: "1 bis 3 Wochen",
        importance: "high" as const,
        status: "open" as const,
        related_costs_note: "Je nach Situation können Gebühren für Auskünfte oder Dokumente anfallen."
      },
      {
        id: "step-3",
        title: "Kaufprozess mit Vertrag und Notar planen",
        description_simple: "Später folgen meist Kaufvertrag, Notartermin, Eintragungen und weitere formale Schritte.",
        estimated_duration: "mehrere Wochen bis Monate",
        importance: "medium" as const,
        status: "open" as const,
        related_costs_note: "Notar, Steuern und Gebühren solltest du früh mit einplanen."
      }
    ];
  }

  if (/(heirat|heiraten|eheschlie)/i.test(normalized)) {
    return [
      {
        id: "step-1",
        title: "Unterlagen für die Anmeldung prüfen",
        description_simple: "Schau früh, welche Dokumente für die Anmeldung beim Standesamt gebraucht werden.",
        estimated_duration: "einige Tage bis 2 Wochen",
        importance: "high" as const,
        status: "open" as const,
        related_costs_note: "Je nach Dokument oder Übersetzung können kleinere Gebühren anfallen."
      },
      {
        id: "step-2",
        title: "Termine und Fristen im Blick behalten",
        description_simple: "Viele Schritte sind einfach, aber Termine und Dokumentfristen sollten rechtzeitig geklärt werden.",
        estimated_duration: "einige Wochen",
        importance: "medium" as const,
        status: "open" as const,
        related_costs_note: null
      }
    ];
  }

  if (/(unternehmen|firma|selbstst[aä]ndig|gr[üu]nden)/i.test(normalized)) {
    return [
      {
        id: "step-1",
        title: "Rechtsform und Anmeldung klären",
        description_simple: "Überlege zuerst, welche Form zu dir passt und welche Anmeldung dafür nötig ist.",
        estimated_duration: "1 bis 3 Wochen",
        importance: "high" as const,
        status: "open" as const,
        related_costs_note: "Je nach Form können Gebühren für Anmeldung oder Beratung anfallen."
      },
      {
        id: "step-2",
        title: "Pflichten bei Behörden prüfen",
        description_simple: "Typisch sind Meldungen bei Gewerbeamt, Finanzamt und je nach Bereich weitere Stellen.",
        estimated_duration: "mehrere Wochen",
        importance: "high" as const,
        status: "open" as const,
        related_costs_note: null
      }
    ];
  }

  return [];
}

export function buildGoalFallbackAnalysis({
  goalText,
  currentAge,
  targetAge,
  targetYear,
  financialAmount,
  monthlyIncome
}: {
  goalText: string;
  currentAge: number | null;
  targetAge: number | null;
  targetYear: number | null;
  financialAmount: number | null;
  monthlyIncome: number | null;
}) {
  const resolvedTargetYear = targetYear ?? extractTargetYearFromText(goalText);
  const resolvedTargetAge = deriveTargetAge({
    currentAge,
    targetAge: targetAge ?? extractTargetAgeFromText(goalText),
    targetYear: resolvedTargetYear
  });
  const steps = buildFallbackSteps(goalText);
  const financeRelevant = inferFinanceRelevant(goalText);
  const hasFinanceNumbers = financialAmount !== null || monthlyIncome !== null;
  const financialReadinessPercentage =
    financeRelevant && hasFinanceNumbers
      ? Math.max(
          10,
          Math.min(
            85,
            Math.round(((financialAmount ?? 0) / 25000) * 45 + ((monthlyIncome ?? 0) / 3000) * 25 + 15)
          )
        )
      : null;

  return normalizeGoalAnalysis({
    goal_title: inferGoalTitle(goalText),
    goal_summary_simple: steps.length
      ? "Ich habe dein Ziel schon grob geordnet und die wichtigsten bürokratischen Punkte für dich zusammengezogen."
      : "Für dieses Ziel sieht es gerade erstaunlich unkompliziert aus. Diesmal hattest du wirklich Glück.",
    current_age: currentAge,
    target_age: resolvedTargetAge,
    target_year: resolvedTargetYear,
    estimated_overall_timeline: inferTimeline(resolvedTargetAge, resolvedTargetYear),
    bureaucracy_steps: steps,
    progress_percentage: 0,
    financial_readiness_percentage: financialReadinessPercentage,
    finance_relevant: financeRelevant,
    ai_guidance: steps.length
      ? [
          "Am besten ordnest du zuerst die wichtigsten Unterlagen und den realistischen Zeitrahmen.",
          "Danach kannst du die formalen Schritte viel ruhiger nacheinander angehen."
        ]
      : [
          "Bei diesem Ziel sieht es diesmal wirklich angenehm aus.",
          "Behalte trotzdem kleine Formalitäten im Blick, damit später nichts Überraschendes auftaucht."
        ],
    recommendation_simple: steps.length
      ? "Das Ziel wirkt grundsätzlich machbar. Am wichtigsten ist jetzt, die ersten formalen Schritte ruhig und geordnet anzugehen."
      : "Diesmal scheint kaum Bürokratie im Weg zu stehen. Ein selten schöner Treffer."
  });
}

export async function getGoalIntakeWithOpenAI({
  goalText,
  preferredLanguage
}: {
  goalText: string;
  preferredLanguage: string | null;
}) {
  const env = getServerEnv();
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const languageLabel = getLanguageLabel(normalizePreferredLanguage(preferredLanguage));

  const response = await client.responses.create({
    model: env.OPENAI_MODEL ?? "gpt-5.4",
    instructions: `Du prüfst für BureauCare, ob ein Lebensziel schon konkret genug ist. Antworte vollständig in ${languageLabel}. Wenn Angaben für ein brauchbares Bürokratie-Bild fehlen, stelle höchstens 3 kurze Multiple-Choice-Rückfragen. Stelle nur wirklich notwendige Fragen. Frage nie nach Zeitraum, wenn durch Alter, Zielalter, Zieljahr oder die Formulierung bereits ein klarer Zeitrahmen erkennbar ist. Frage nie nach Dingen, die für die Bürokratie-Einschätzung nichts sichtbar ändern würden. Setze finance_relevant auf true, wenn das Ziel typischerweise stark von Geld, Finanzierung, Erspartem oder Einkommen abhängt.`,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Ziel: ${goalText}

Beurteile:
- Ist das Ziel schon konkret genug?
- Spielen finanzielle Voraussetzungen wahrscheinlich eine wichtige Rolle?
- Wenn Informationen fehlen, stelle bitte nur die wichtigsten kurzen Rückfragen mit klaren Antwortoptionen.`
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "bureaucare_goal_intake",
        strict: true,
        schema: buildIntakeSchema()
      }
    }
  });

  const rawText = response.output_text;

  if (!rawText) {
    throw new Error("Die Zielklärung ist leer zurückgekommen.");
  }

  const parsed = goalIntakeSchema.safeParse(JSON.parse(rawText));

  if (!parsed.success) {
    throw new Error("Die Zielklärung war unvollständig.");
  }

  return parsed.data;
}

export async function analyzeGoalWithOpenAI({
  goalText,
  currentAge,
  targetAge,
  targetYear,
  financialAmount,
  monthlyIncome,
  answers,
  preferredLanguage
}: {
  goalText: string;
  currentAge: number | null;
  targetAge: number | null;
  targetYear: number | null;
  financialAmount: number | null;
  monthlyIncome: number | null;
  answers: Record<string, string>;
  preferredLanguage: string | null;
}) {
  const env = getServerEnv();
  const client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  const languageLabel = getLanguageLabel(normalizePreferredLanguage(preferredLanguage));
  const resolvedTargetYear = targetYear ?? extractTargetYearFromText(goalText);
  const resolvedTargetAge = deriveTargetAge({
    currentAge,
    targetAge: targetAge ?? extractTargetAgeFromText(goalText),
    targetYear: resolvedTargetYear
  });

  const contextText = buildContextText({
    goalText,
    currentAge,
    targetAge: resolvedTargetAge,
    targetYear: resolvedTargetYear,
    financialAmount,
    monthlyIncome,
    answers
  });

  const response = await client.responses.create({
    model: env.OPENAI_MODEL ?? "gpt-5.4",
    instructions: `Du bist BureauCare und hilfst Menschen, bürokratische Lebensziele zu verstehen. Antworte vollständig in ${languageLabel}. Schreibe ruhig, einfach, freundlich und sehr verständlich. Keine komplizierte Fachsprache, keine erfundenen Details und keine harten Versprechen. bureaucracy_steps sollen echte bürokratische Hürden und Schritte abbilden. Nutze einfache Sprache. finance_relevant soll nur true sein, wenn Geld wirklich eine wichtige Rolle spielt. Wenn es wirklich keine nennenswerte Bürokratie gibt, darf bureaucracy_steps leer sein. In diesem Fall soll recommendation_simple freundlich erwähnen, dass man diesmal wirklich Glück hatte.`,
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: `Analysiere dieses Ziel und ordne die bürokratischen Schritte:

${contextText}

Wichtig:
- bureaucracy_steps sollen die wichtigsten formalen Schritte und Hürden enthalten, aber nur wenn es echte Bürokratie gibt.
- status ist bei neuen Zielen standardmäßig open.
- progress_percentage soll sich für neue Ziele aus offenen Schritten ergeben.
- financial_readiness_percentage nur setzen, wenn Geld für das Ziel wirklich wichtig ist.
- recommendation_simple soll in 1 bis 3 Sätzen sagen, wie realistisch das Ziel wirkt und was jetzt am wichtigsten ist.`
          }
        ]
      }
    ],
    text: {
      format: {
        type: "json_schema",
        name: "bureaucare_goal_analysis",
        strict: true,
        schema: buildAnalysisSchema()
      }
    }
  });

  const rawText = response.output_text;

  if (!rawText) {
    throw new Error("Die Zielanalyse ist leer zurückgekommen.");
  }

  const parsed = goalAnalysisSchema.safeParse(JSON.parse(rawText));

  if (!parsed.success) {
    throw new Error("Die Zielanalyse war unvollständig.");
  }

  return normalizeGoalAnalysis({
    ...parsed.data,
    target_age: parsed.data.target_age ?? resolvedTargetAge,
    target_year: parsed.data.target_year ?? resolvedTargetYear
  });
}

export function areClarificationQuestionsComplete(questions: GoalClarificationQuestion[], answers: Record<string, string>) {
  return questions.every((question) => typeof answers[question.id] === "string" && answers[question.id].trim().length > 0);
}
