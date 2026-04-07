import type { Route } from "next";

import type { DocumentKindDetection } from "@/lib/document-kind";
import type { AppLocale } from "@/lib/i18n";
import type { DocumentAnalysisRecord } from "@/lib/types";

/** Wenn die schnelle Erkennung fehlschlägt – trotzdem klare Erkläre-Route */
export function getGeneralExplainNoDetectionFallback(locale: AppLocale): { title: string; text: string; cta: string } {
  switch (locale) {
    case "de":
      return {
        title: "Trotzdem können wir dir helfen",
        text: "Die schnelle Einordnung ist gerade ausgefallen – dein Dokument ist sicher gespeichert. Mit der allgemeinen Erklärung bekommst du strukturiert verständlich, worum es geht.",
        cta: "Jetzt erklären lassen"
      };
    case "es":
      return {
        title: "Aun así podemos ayudarte",
        text: "La clasificación rápida no está disponible, pero tu archivo está guardado. La explicación general te da una lectura clara y ordenada.",
        cta: "Explicar ahora"
      };
    case "zh":
      return {
        title: "我们仍然可以帮到你",
        text: "快速识别暂不可用，文件已安全保存。通用说明会用清晰结构帮你读懂内容。",
        cta: "开始说明"
      };
    case "tr":
      return {
        title: "Yine de yardımcı olabiliriz",
        text: "Hızlı sınıflandırma şu an yok; belgeniz kayıtlı. Genel açıklama yapılandırılmış ve anlaşılır bir özet sunar.",
        cta: "Şimdi açıkla"
      };
    case "uk":
      return {
        title: "Все одно ми можемо допомогти",
        text: "Швидке впорядкування зараз недоступне, але файл збережено. Загальне пояснення дасть зрозумілу структуру.",
        cta: "Пояснити зараз"
      };
    default:
      return {
        title: "You still get a clear walkthrough",
        text: "Quick sorting did not run, but your file is saved. The plain-language explanation still breaks the document down in simple, structured steps.",
        cta: "Start explanation"
      };
  }
}

/** Volldokument-Analyse mit Klartext-Erwartung (ohne Modul-Fokus) */
export function generalExplainAnchor(documentId: string): Route {
  return `/app/documents/${documentId}?flow=explain#document-analyze` as Route;
}

export function getGeneralExplainPreAnalyzeBanner(locale: AppLocale): { title: string; lines: string[] } {
  switch (locale) {
    case "de":
      return {
        title: "Allgemeine Dokument-Erklärung",
        lines: [
          "Du bekommst eine verständliche Struktur: worum es geht, was auffällt und was du dir merken solltest.",
          "Wenn etwas wie eine Frist, eine Forderung oder eine Verpflichtung aussieht, heben wir das vorsichtig hervor – ohne Drama.",
          "Konkrete nächste Schritte und Risiko-Hinweise helfen dir zu sortieren. BureauCare ersetzt keine Beratung, aber ersetzt Blindflug beim Lesen."
        ]
      };
    case "es":
      return {
        title: "Explicación general del documento",
        lines: [
          "Verás una estructura clara: de qué va, qué destaca y qué conviene tener presente.",
          "Si parece haber un plazo, una reclamación u obligación, lo señalamos con cuidado.",
          "Siguientes pasos prácticos y riesgos te ayudan a orientarte. BureauCare no es asesoramiento legal, pero sí evita leer a ciegas."
        ]
      };
    case "zh":
      return {
        title: "通用文档说明",
        lines: [
          "我们会用清晰结构说明：讲了什么、有哪些重点、你需要留意什么。",
          "若看似有期限、付款或义务，我们会谨慎标出，不做危言耸听。",
          "可执行的下一步与风险提示帮你理清思路。BureauCare 不替代专业建议，但可减少盲目阅读。"
        ]
      };
    case "tr":
      return {
        title: "Genel belge açıklaması",
        lines: [
          "Belgenin özünü, dikkat çeken noktaları ve hatırlamanızı önerdiğimizi anlaşılır şekilde sunarız.",
          "Süre, talep veya yükümlülüğe benzeyen ifadeler varsa ölçülü şekilde vurgularız.",
          "Sonraki adımlar ve risk notları yön verir. BureauCare hukuki danışmanlık değildir; ama kör okumayı azaltır."
        ]
      };
    case "uk":
      return {
        title: "Загальне пояснення документа",
        lines: [
          "Отримаєте зрозумілу структуру: про що документ, що особливо видно, на що варто звернути увагу.",
          "Якщо є натяки на строк, вимогу чи зобов'язання — обережно позначимо без зайвої тривоги.",
          "Конкретні наступні кроки та ризики допоможуть зорієнтуватися. BureauCare не юридична порада, але знімає «сліпе» читання."
        ]
      };
    default:
      return {
        title: "Plain-language document walkthrough",
        lines: [
          "You get a clear structure: what it is about, what stands out, and what is worth keeping in mind.",
          "If something looks like a deadline, a claim or an obligation, we flag it carefully – no alarmism.",
          "Practical next steps and cautious risk notes help you sort things out. BureauCare is not legal advice, but it beats reading in the dark."
        ]
      };
  }
}

/** Decision Screen: immer sichtbare Fallback-Karte (wenn Hauptempfehlung nicht „Erklärung“ ist) */
export function getGeneralExplainRoutingFallbackCard(locale: AppLocale): {
  eyebrow: string;
  title: string;
  intro: string;
  bullets: string[];
  cta: string;
} {
  switch (locale) {
    case "de":
      return {
        eyebrow: "Standard-Fallback",
        title: "Einfach verstehen – auch ohne perfekte Einordnung",
        intro:
          "Wenn du nur Klartext willst oder der Typ noch unscharf ist: Wir erklären dir strukturiert, worum es in diesem Dokument geht.",
        bullets: [
          "Kurzfassung, wichtige Punkte und Auffälliges",
          "Fristen, Forderungen oder Pflichten – nur wenn sie sich im Text zeigen",
          "Ruhige Risiko-Hinweise und mögliche nächste Schritte",
          "Spezielle Module bleiben optional unten in den Weitere-Optionen"
        ],
        cta: "Dokument jetzt erklären lassen"
      };
    case "es":
      return {
        eyebrow: "Opción base",
        title: "Entender el documento aunque no encaje en un módulo",
        intro:
          "Si solo quieres claridad o el tipo aún no está claro: te lo explicamos con estructura y lenguaje sencillo.",
        bullets: [
          "Resumen breve, puntos clave y lo que destaca",
          "Plazos o posibles obligaciones si el texto lo sugiere",
          "Riesgos con tono prudente y pasos siguientes",
          "Los módulos específicos siguen disponibles más abajo"
        ],
        cta: "Explicar el documento ahora"
      };
    case "zh":
      return {
        eyebrow: "稳妥选项",
        title: "即便类型不清晰，也能先读懂内容",
        intro: "若你只想先搞清楚文本，或目前还不好归类：我们用简单结构帮你拆解这份文件。",
        bullets: ["简短主旨、要点与显眼信息", "若文中有期限或义务线索，会谨慎提示", "温和的风险与可行下一步", "专项功能仍在下方可选"],
        cta: "现在开始说明文档"
      };
    case "tr":
      return {
        eyebrow: "Temel seçenek",
        title: "Tür net değilse bile anlaşılır özet",
        intro:
          "Sadece düz metin istiyorsanız veya tür belirsizse: Belgeyi yapılandırılmış ve sade şekilde açıklarız.",
        bullets: [
          "Kısa özet, ana noktalar ve göze çarpanlar",
          "Metinde görünen süre veya yükümlülük ipuçları",
          "Sakin risk notları ve olası sonraki adımlar",
          "Özel modüller aşağıda seçeneğiniz olarak durur"
        ],
        cta: "Belgeyi şimdi açıklayın"
      };
    case "uk":
      return {
        eyebrow: "Базовий варіант",
        title: "Зрозуміло — навіть якщо тип ще не ясний",
        intro:
          "Якщо потрібен простий текст або тип не визначено: пояснимо структуровано й людяно, про що документ.",
        bullets: [
          "Коротко про зміст, важливе та помітне",
          "Строки чи можливі обов'язки — лише якщо про це свідчить текст",
          "Спокійні зауваги про ризики та ймовірні кроки",
          "Спеціалізовані модулі лишаються нижче як опції"
        ],
        cta: "Пояснити документ зараз"
      };
    default:
      return {
        eyebrow: "Always available",
        title: "Understand the document without a perfect label",
        intro:
          "If you just want plain language or the type is still fuzzy, we walk you through what matters in simple, structured steps.",
        bullets: [
          "Short gist, key points and what jumps out",
          "Deadlines, claims or duties when the text supports that read",
          "Calm risk notes and sensible next steps",
          "Specialist modules stay optional below"
        ],
        cta: "Explain this document now"
      };
  }
}

export function getGeneralExplainAlternativeCopy(locale: AppLocale): { label: string; description: string } {
  switch (locale) {
    case "de":
      return {
        label: "Dokument einfach erklären",
        description: "Struktur: Kurzfassung, Punkte, Fristen, nächste Schritte – in Alltagssprache."
      };
    case "es":
      return {
        label: "Explicar el documento",
        description: "Resumen corto, puntos, plazos y siguientes pasos en lenguaje llano."
      };
    case "zh":
      return {
        label: "通俗说明全文",
        description: "简报、要点、期限线索与下一步，使用平易表达。"
      };
    case "tr":
      return {
        label: "Belgeyi basitçe anlat",
        description: "Özet, madde madde noktalar, tarihler ve sonraki adımlar; sade dil."
      };
    case "uk":
      return {
        label: "Пояснити документ просто",
        description: "Коротко, пунктами, строками та кроками — звичайною мовою."
      };
    default:
      return {
        label: "Plain-language explanation",
        description: "Structured: gist, key lines, deadlines, next steps – no legal jargon."
      };
  }
}

/** Text für die Hauptempfehlungs-Karte, wenn „Dokument-Erklärung“ primär ist */
export function getGeneralExplainPrimaryNarrative(locale: AppLocale): string {
  switch (locale) {
    case "de":
      return "Wir erklären in einfachen Worten, worum es geht: kurz gefasst, mit den wichtigsten Punkten, mit vorsichtigen Hinweisen zu Fristen oder Forderungen, zu möglichen Risiken und mit nächsten Schritten – übersichtlich gegliedert, nicht als Textwüste. Spezial-Module kannst du danach weiter nutzen.";
    case "es":
      return "Te lo contamos en palabras sencillas: en qué consiste, qué importa, qué podría implicar en plazos o exigencias, riesgos con tono prudente y pasos siguientes, todo ordenado y fácil de leer.";
    case "zh":
      return "用直白的语言说明主旨、要点，谨慎提示期限或款项、可能风险与下一步，结构清晰，而不是大段堆砌。之后你仍可选用专项模块。";
    case "tr":
      return "Sade dilde özet, ana noktalar, süre veya talepler için ölçülü uyarılar, sakince risk notları ve sonraki adımlar sunarız; düzenli ve okunaklı. İsterseniz sonra özel modüllere geçebilirsiniz.";
    case "uk":
      return "Доступною мовою: про що документ, що важливо, обережні зауваги щодо строків чи вимог, спокійні ризики та наступні кроки — структуровано, без води. Спеціалізовані модулі лишаються після цього на вибір.";
    default:
      return "We explain in plain words what it is about: a short gist, key points, careful notes on deadlines or claims, calm risk context and sensible next steps – structured, not a wall of text. You can still use specialist modules afterward.";
  }
}

export function getGeneralExplainPrimaryCta(locale: AppLocale): string {
  switch (locale) {
    case "de":
      return "Jetzt verständlich erklären lassen";
    case "es":
      return "Explicar ahora en lenguaje claro";
    case "zh":
      return "开始通俗说明";
    case "tr":
      return "Şimdi anlaşılır şekilde açıkla";
    case "uk":
      return "Пояснити зараз доступною мовою";
    default:
      return "Get a plain-language walkthrough";
  }
}

/** Nach Analyse: dezent, wenn Erst-Einordnung nicht „Vertrag“ war, die Analyse aber Klauseln liefert */
export function getOptionalContractDepthHint(
  locale: AppLocale,
  detection: DocumentKindDetection | null,
  analysis: Pick<DocumentAnalysisRecord, "contract_flagged_clauses">
): { text: string; anchorLabel: string } | null {
  const clauses = analysis.contract_flagged_clauses ?? [];
  if (!clauses.length) return null;
  if (detection?.kind === "contract") return null;

  switch (locale) {
    case "de":
      return {
        text: "Die Analyse zeigt vertragsähnliche Stellen. Wenn du vertiefen willst, nutze den Klausel‑Bereich oben – ganz ohne neues Hochladen.",
        anchorLabel: "Zu den Klauseln"
      };
    case "es":
      return {
        text: "El análisis detecta partes parecidas a un contrato. Puedes profundizar en la sección de cláusulas arriba.",
        anchorLabel: "Ver cláusulas"
      };
    case "zh":
      return {
        text: "分析中发现类似合同的条款。若需细看，可跳转到上方的条款部分。",
        anchorLabel: "查看条款"
      };
    case "tr":
      return {
        text: "Analiz sözleşmeye benzer bölümler buldu. İsterseniz üstteki maddeler bölümünde derinleşebilirsiniz.",
        anchorLabel: "Maddelere git"
      };
    case "uk":
      return {
        text: "Аналіз бачить фрагменти, схожі на договір. Можна глибше переглянути блок пунктів вище.",
        anchorLabel: "До пунктів"
      };
    default:
      return {
        text: "The analysis flagged contract-like passages. You can go deeper in the clause section above without uploading again.",
        anchorLabel: "Open clauses"
      };
  }
}
