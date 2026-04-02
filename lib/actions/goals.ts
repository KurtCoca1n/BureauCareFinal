"use server";

import { revalidatePath } from "next/cache";

import { initialGoalPlannerState, type GoalPlannerState } from "@/lib/goal-planner-state";
import { getGoalsCopy, normalizeGoalAnalysis, type GoalClarificationQuestion } from "@/lib/goals-ui";
import { analyzeGoalWithOpenAI, areClarificationQuestionsComplete, buildGoalFallbackAnalysis, getGoalIntakeWithOpenAI } from "@/lib/openai/goal-analysis";
import { createClient } from "@/lib/supabase/server";
import type { GoalAnalysisResult, GoalRecord, GoalStep } from "@/lib/types";

function toOptionalInt(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim();
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseInt(normalized, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

function toOptionalFloat(value: FormDataEntryValue | null) {
  const normalized = String(value ?? "").trim().replace(",", ".");
  if (!normalized) {
    return null;
  }

  const parsed = Number.parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseAnswers(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return {};
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, string>;
    return Object.fromEntries(Object.entries(parsed).filter(([, answer]) => typeof answer === "string" && answer.trim().length > 0));
  } catch {
    return {};
  }
}

function parseQuestions(value: FormDataEntryValue | null) {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as GoalClarificationQuestion[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function computeStoredProgress(analysis: GoalAnalysisResult) {
  return analysis.bureaucracy_steps.length
    ? Math.round((analysis.bureaucracy_steps.filter((step) => step.status === "done").length / analysis.bureaucracy_steps.length) * 100)
    : 0;
}

export async function createGoalAction(_: GoalPlannerState, formData: FormData): Promise<GoalPlannerState> {
  const goalText = String(formData.get("goalText") ?? "").trim();
  const currentAgeRaw = String(formData.get("currentAge") ?? "").trim();
  const targetMode = String(formData.get("targetMode") ?? "age").trim() === "year" ? "year" : "age";
  const targetAgeRaw = String(formData.get("targetAge") ?? "").trim();
  const targetYearRaw = String(formData.get("targetYear") ?? "").trim();
  const financialAmountRaw = String(formData.get("financialAmount") ?? "").trim();
  const monthlyIncomeRaw = String(formData.get("monthlyIncome") ?? "").trim();
  const currentAge = toOptionalInt(formData.get("currentAge"));
  const targetAge = targetMode === "age" ? toOptionalInt(formData.get("targetAge")) : null;
  const targetYear = targetMode === "year" ? toOptionalInt(formData.get("targetYear")) : null;
  const financialAmount = toOptionalFloat(formData.get("financialAmount"));
  const monthlyIncome = toOptionalFloat(formData.get("monthlyIncome"));
  const answers = parseAnswers(formData.get("answersJson"));
  const questions = parseQuestions(formData.get("questionsJson"));
  const forceAnalyze = String(formData.get("forceAnalyze") ?? "") === "1";
  const financeRelevant = String(formData.get("financeRelevant") ?? "") === "1";

  if (!goalText) {
    return { ...initialGoalPlannerState, error: "Bitte beschreibe zuerst dein Ziel." };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ...initialGoalPlannerState, error: "Deine Sitzung ist abgelaufen. Bitte melde dich erneut an." };
  }

  const { data: profile } = await supabase.from("profiles").select("preferred_language").eq("id", user.id).maybeSingle();
  const copy = getGoalsCopy(profile?.preferred_language);

  try {
    if (questions.length && !areClarificationQuestionsComplete(questions, answers)) {
      return {
        ...initialGoalPlannerState,
        error: copy.questionMissing,
        requiresClarification: true,
        questions,
        answers,
        goalText,
        currentAge: currentAgeRaw,
        targetMode,
        targetAge: targetAgeRaw,
        targetYear: targetYearRaw,
        financialAmount: financialAmountRaw,
        monthlyIncome: monthlyIncomeRaw
      };
    }

    if (!forceAnalyze && questions.length && financeRelevant && financialAmount === null && monthlyIncome === null) {
      return {
        ...initialGoalPlannerState,
        awaitingFinance: true,
        financeRelevant: true,
        financialPrompt: copy.financePromptFallback,
        goalText,
        currentAge: currentAgeRaw,
        targetMode,
        targetAge: targetAgeRaw,
        targetYear: targetYearRaw,
        financialAmount: financialAmountRaw,
        monthlyIncome: monthlyIncomeRaw,
        answers
      };
    }

    if (!forceAnalyze && !questions.length) {
      try {
        const intake = await getGoalIntakeWithOpenAI({
          goalText,
          preferredLanguage: profile?.preferred_language ?? null
        });

        if (intake.needs_clarification && intake.follow_up_questions.length) {
          return {
            ...initialGoalPlannerState,
            requiresClarification: true,
            financeRelevant: intake.finance_relevant,
            financialPrompt: intake.financial_prompt ?? copy.financePromptFallback,
            questions: intake.follow_up_questions,
            goalText,
            currentAge: currentAgeRaw,
            targetMode,
            targetAge: targetAgeRaw,
            targetYear: targetYearRaw,
            financialAmount: financialAmountRaw,
            monthlyIncome: monthlyIncomeRaw
          };
        }

        if (intake.finance_relevant && financialAmount === null && monthlyIncome === null) {
          return {
            ...initialGoalPlannerState,
            awaitingFinance: true,
            financeRelevant: true,
            financialPrompt: intake.financial_prompt ?? copy.financePromptFallback,
            goalText,
            currentAge: currentAgeRaw,
            targetMode,
            targetAge: targetAgeRaw,
            targetYear: targetYearRaw,
            financialAmount: financialAmountRaw,
            monthlyIncome: monthlyIncomeRaw
          };
        }
      } catch (intakeError) {
        console.error("Goal intake failed, continuing with direct analysis fallback", { userId: user.id, intakeError });
      }
    }

    let analysis: GoalAnalysisResult;
    try {
      analysis = await analyzeGoalWithOpenAI({
        goalText,
        currentAge,
        targetAge,
        targetYear,
        financialAmount,
        monthlyIncome,
        answers,
        preferredLanguage: profile?.preferred_language ?? null
      });
    } catch (analysisError) {
      console.error("Goal analysis via OpenAI failed, using fallback", { userId: user.id, analysisError });
      analysis = buildGoalFallbackAnalysis({
        goalText,
        currentAge,
        targetAge,
        targetYear,
        financialAmount,
        monthlyIncome
      });
    }

    let insertResult = await supabase
      .from("goals")
      .insert({
        user_id: user.id,
        title: analysis.goal_title,
        goal_text: goalText,
        current_age: currentAge,
        target_age: targetAge,
        financial_amount: financialAmount,
        monthly_income: monthlyIncome,
        analysis_result: analysis,
        progress_percentage: computeStoredProgress(analysis),
        financial_readiness_percentage: analysis.financial_readiness_percentage
      })
      .select("id")
      .maybeSingle();

    if (insertResult.error && /monthly_income/i.test(insertResult.error.message)) {
      insertResult = await supabase
        .from("goals")
        .insert({
          user_id: user.id,
          title: analysis.goal_title,
          goal_text: goalText,
          current_age: currentAge,
          target_age: targetAge,
          financial_amount: financialAmount,
          analysis_result: analysis,
          progress_percentage: computeStoredProgress(analysis),
          financial_readiness_percentage: analysis.financial_readiness_percentage
        })
        .select("id")
        .maybeSingle();
    }

    if (insertResult.error || !insertResult.data) {
      console.error("Goal save failed", { userId: user.id, error: insertResult.error });
      return { ...initialGoalPlannerState, error: copy.saveError };
    }

    revalidatePath("/app");
    revalidatePath("/app/goals");

    return {
      ...initialGoalPlannerState,
      success: copy.saveSuccess,
      redirectTo: `/app/goals?mode=view&goal=${insertResult.data.id}`
    };
  } catch (error) {
    console.error("Goal analysis failed", { userId: user.id, error });
    return {
      ...initialGoalPlannerState,
      error: copy.saveError,
      goalText,
      currentAge: currentAgeRaw,
      targetMode,
      targetAge: targetAgeRaw,
      targetYear: targetYearRaw,
      financialAmount: financialAmountRaw,
      monthlyIncome: monthlyIncomeRaw,
      answers,
      questions,
      financeRelevant
    };
  }
}

export async function toggleGoalStepAction(formData: FormData): Promise<void> {
  const goalId = String(formData.get("goalId") ?? "").trim();
  const stepId = String(formData.get("stepId") ?? "").trim();

  if (!goalId || !stepId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: goal } = await supabase.from("goals").select("*").eq("id", goalId).eq("user_id", user.id).maybeSingle();
  const goalRecord = (goal as GoalRecord | null) ?? null;

  if (!goalRecord?.analysis_result) {
    return;
  }

  const normalized = normalizeGoalAnalysis(goalRecord.analysis_result as GoalAnalysisResult);
  const nextSteps: GoalStep[] = normalized.bureaucracy_steps.map((step) =>
    step.id === stepId ? { ...step, status: step.status === "done" ? "open" : "done" } : step
  );
  const nextAnalysis: GoalAnalysisResult = {
    ...normalized,
    bureaucracy_steps: nextSteps,
    progress_percentage: nextSteps.length
      ? Math.round((nextSteps.filter((step) => step.status === "done").length / nextSteps.length) * 100)
      : 0
  };

  await supabase
    .from("goals")
    .update({
      analysis_result: nextAnalysis,
      progress_percentage: nextAnalysis.progress_percentage,
      updated_at: new Date().toISOString()
    })
    .eq("id", goalId)
    .eq("user_id", user.id);

  revalidatePath("/app/goals");
  revalidatePath("/app");
}

export async function deleteGoalAction(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const goalId = String(formData.get("goalId") ?? "").trim();

  if (!goalId) {
    return { success: false, error: "missing_goal_id" };
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "not_authenticated" };
  }

  const { data, error } = await supabase.from("goals").delete().eq("id", goalId).eq("user_id", user.id).select("id").maybeSingle();
  if (error || !data) {
    console.error("Goal delete failed", { userId: user.id, goalId, error });
    return { success: false, error: error?.message ?? "goal_not_deleted" };
  }

  revalidatePath("/app");
  revalidatePath("/app/goals");
  return { success: true };
}

export async function completeGoalAction(formData: FormData): Promise<void> {
  const goalId = String(formData.get("goalId") ?? "").trim();

  if (!goalId) {
    return;
  }

  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return;
  }

  const { data: goal } = await supabase.from("goals").select("*").eq("id", goalId).eq("user_id", user.id).maybeSingle();
  const goalRecord = (goal as GoalRecord | null) ?? null;

  if (!goalRecord) {
    return;
  }

  const nextAnalysis = goalRecord.analysis_result
    ? {
        ...normalizeGoalAnalysis(goalRecord.analysis_result as GoalAnalysisResult),
        bureaucracy_steps: normalizeGoalAnalysis(goalRecord.analysis_result as GoalAnalysisResult).bureaucracy_steps.map((step) => ({
          ...step,
          status: "done" as const
        })),
        progress_percentage: 100
      }
    : null;

  await supabase
    .from("goals")
    .update({
      analysis_result: nextAnalysis,
      progress_percentage: 100,
      updated_at: new Date().toISOString()
    })
    .eq("id", goalId)
    .eq("user_id", user.id);

  revalidatePath("/app");
  revalidatePath("/app/goals");
}
