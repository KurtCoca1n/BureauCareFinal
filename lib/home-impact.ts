export type HomeImpactInputs = {
  analyzedDocumentsCount: number;
  createdRepliesCount: number;
  completedTasksCount: number;
  casesCount: number;
};

export type HomeImpactEstimate = {
  moneyEur: number;
  timeMinutes: number;
  nervesPercent: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function roundTo(value: number, step: number) {
  if (step <= 0) return value;
  return Math.round(value / step) * step;
}

/**
 * MVP-Schätzung: ruhige, nachvollziehbare Näherungswerte.
 * Ziel: "realistisch wirken" – keine Fantasiezahlen, keine Gamification.
 */
export function estimateHomeImpact(inputs: HomeImpactInputs): HomeImpactEstimate {
  const analyzed = Math.max(0, Math.floor(inputs.analyzedDocumentsCount || 0));
  const replies = Math.max(0, Math.floor(inputs.createdRepliesCount || 0));
  const tasksDone = Math.max(0, Math.floor(inputs.completedTasksCount || 0));
  const cases = Math.max(0, Math.floor(inputs.casesCount || 0));

  const hasAnyActivity = analyzed + replies + tasksDone + cases > 0;

  // Zeit: pro Analyse spart man typischerweise Recherche/Lesen, pro Antwort Entwurf, pro Task ein bisschen Koordination.
  // Werte bewusst konservativ.
  const timeMinutesRaw = analyzed * 12 + replies * 8 + tasksDone * 4 + cases * 3;
  const timeMinutes = hasAnyActivity ? clamp(roundTo(timeMinutesRaw, 5), 20, 24 * 60) : 0;

  // Geld: sehr vorsichtige Proxy-Werte (Ansprüche/Fehler vermeiden), ohne "Werbeversprechen".
  const moneyRaw = cases * 18 + analyzed * 9 + replies * 6;
  const moneyEur = hasAnyActivity ? clamp(roundTo(moneyRaw, 5), 25, 750) : 0;

  // Nerven: als Prozentreduktion – capped, damit es glaubwürdig bleibt.
  const nervesRaw = 18 + tasksDone * 2 + analyzed * 1.2 + replies * 1.5 + cases * 0.8;
  const nervesPercent = hasAnyActivity ? clamp(Math.round(nervesRaw), 15, 65) : 0;

  return { moneyEur, timeMinutes, nervesPercent };
}

