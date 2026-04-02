import type { GoalClarificationQuestion } from "@/lib/goals-ui";

export type GoalPlannerState = {
  error: string;
  success: string;
  redirectTo?: string;
  requiresClarification: boolean;
  awaitingFinance: boolean;
  financeRelevant: boolean;
  financialPrompt: string;
  questions: GoalClarificationQuestion[];
  answers: Record<string, string>;
  goalText: string;
  currentAge: string;
  targetMode: "age" | "year";
  targetAge: string;
  targetYear: string;
  financialAmount: string;
  monthlyIncome: string;
};

export const initialGoalPlannerState: GoalPlannerState = {
  error: "",
  success: "",
  requiresClarification: false,
  awaitingFinance: false,
  financeRelevant: false,
  financialPrompt: "",
  questions: [],
  answers: {},
  goalText: "",
  currentAge: "",
  targetMode: "age",
  targetAge: "",
  targetYear: "",
  financialAmount: "",
  monthlyIncome: ""
};
