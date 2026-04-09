import type { TaskRecord } from "@/lib/types";

export type TaskTipLang = "de" | "en";

function hashToPct(input: string): number {
  // Small deterministic hash (0..99) for stable sampling.
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h) % 100;
}

function shouldShowTipForTask(task: TaskRecord, pct = 35): boolean {
  const id = (task.id ?? "").toString();
  if (!id) return false;
  return hashToPct(id) < pct;
}

function normalizeText(value: string | null | undefined): string {
  return (value ?? "").toLowerCase();
}

function pickTipByKeywords(text: string, lang: TaskTipLang): string | null {
  const has = (re: RegExp) => re.test(text);

  if (has(/\b(antwort|antworten|reply|respond|widerspruch|einspruch|rückmeldung|rueckmeldung)\b/)) {
    return lang === "en"
      ? "Tip: You can often send the reply by email directly."
      : "Tipp: Diese Antwort kannst du oft direkt per E-Mail senden.";
  }

  if (has(/\b(termin|appointment|bürgeramt|bürgeramt|amtstermin|sprechstunde)\b/)) {
    return lang === "en"
      ? "Tip: Early mornings often have more free slots."
      : "Tipp: Früh morgens sind oft noch Termine frei.";
  }

  if (has(/\b(unterlagen|dokumente|nachweis|bescheinigung|formular|formulare|anhang)\b/)) {
    return lang === "en"
      ? "Tip: A clear photo is often enough — no need to print."
      : "Tipp: Ein klares Foto reicht oft aus – du musst nichts ausdrucken.";
  }

  if (has(/\b(online|link|portal|website|webseite)\b/)) {
    return lang === "en"
      ? "Tip: Save the official link in the task so you can find it quickly."
      : "Tipp: Speichere den offiziellen Link in der Aufgabe, damit du ihn schnell wiederfindest.";
  }

  if (has(/\b(post|brief|einschreiben|per post)\b/)) {
    return lang === "en"
      ? "Tip: A short proof (photo or receipt) can help if something goes missing."
      : "Tipp: Ein kurzer Nachweis (Foto oder Beleg) hilft, falls etwas verloren geht.";
  }

  return null;
}

export function getOptionalTaskTip(task: TaskRecord, lang: TaskTipLang): string | null {
  if (task.status === "done") return null;
  if (!shouldShowTipForTask(task, 35)) return null;

  const combined = [
    normalizeText(task.title),
    normalizeText(task.action_summary),
    normalizeText(task.document_subject),
    normalizeText(task.document_sender)
  ].join(" ");

  return pickTipByKeywords(combined, lang);
}

