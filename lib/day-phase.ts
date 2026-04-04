export type DayPhase = "morning" | "day" | "evening" | "night";

export const DAY_PHASE_SESSION_KEY = "bureaucare-day-phase";

export function getDayPhaseFromHour(hour: number): DayPhase {
  if (hour >= 5 && hour <= 10) return "morning";
  if (hour >= 11 && hour <= 16) return "day";
  if (hour >= 17 && hour <= 21) return "evening";
  return "night";
}

export function getLocalDayPhase() {
  return getDayPhaseFromHour(new Date().getHours());
}

export function getSessionDayPhase() {
  if (typeof window === "undefined") {
    return "day" as DayPhase;
  }

  const existing = window.sessionStorage.getItem(DAY_PHASE_SESSION_KEY);
  if (existing === "morning" || existing === "day" || existing === "evening" || existing === "night") {
    return existing;
  }

  const phase = getLocalDayPhase();
  window.sessionStorage.setItem(DAY_PHASE_SESSION_KEY, phase);
  return phase;
}
