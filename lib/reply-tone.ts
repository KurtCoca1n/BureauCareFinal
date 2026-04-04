import type { DocumentAnalysisRecord } from "@/lib/types";

export type ReplyToneRecommendation = {
  tone: string;
  toneDetails: string;
  displayLabel: string;
};

type ToneKey = "neutral" | "friendly" | "veryFormal" | "objection" | "appeal" | "needMoreTime";
type DetailKey = "direct" | "deadline" | "cooperative" | "review" | "extension" | "formal";

type ToneLocale = "de" | "en" | "tr" | "uk" | "es" | "zh";

function normalizeToneLocale(locale: string): ToneLocale {
  switch (locale) {
    case "en":
    case "tr":
    case "uk":
    case "es":
    case "zh":
      return locale;
    default:
      return "de";
  }
}

function localizeTone(locale: string, key: ToneKey) {
  const map: Record<ToneLocale, Record<ToneKey, string>> = {
    de: {
      neutral: "Neutral",
      friendly: "Freundlich",
      veryFormal: "Sehr formell",
      objection: "Widerspruch",
      appeal: "Einspruch",
      needMoreTime: "Ich brauche mehr Zeit"
    },
    en: {
      neutral: "Neutral",
      friendly: "Friendly",
      veryFormal: "Very formal",
      objection: "Objection",
      appeal: "Appeal",
      needMoreTime: "I need more time"
    },
    tr: {
      neutral: "Notr",
      friendly: "Nazik",
      veryFormal: "Cok resmi",
      objection: "Itiraz",
      appeal: "Resmi itiraz",
      needMoreTime: "Daha fazla zamana ihtiyacim var"
    },
    uk: {
      neutral: "Neitralno",
      friendly: "Dobrozichlyvo",
      veryFormal: "Duze formalno",
      objection: "Zaperechennia",
      appeal: "Skarga",
      needMoreTime: "Meni potribno bilshe chasu"
    },
    es: {
      neutral: "Neutral",
      friendly: "Amable",
      veryFormal: "Muy formal",
      objection: "Oposicion",
      appeal: "Recurso",
      needMoreTime: "Necesito mas tiempo"
    },
    zh: {
      neutral: "中性",
      friendly: "友好",
      veryFormal: "非常正式",
      objection: "提出异议",
      appeal: "申诉",
      needMoreTime: "我需要更多时间"
    }
  };

  return map[normalizeToneLocale(locale)][key];
}

function localizeDetail(locale: string, key: DetailKey) {
  const map: Record<ToneLocale, Record<DetailKey, string>> = {
    de: {
      direct: "kurz, klar und direkt",
      deadline: "direkt auf Frist und nächsten Schritt eingehen",
      cooperative: "ruhig, lösungsorientiert und freundlich bleiben",
      review: "sachlich um Prüfung oder Rückmeldung bitten",
      extension: "kurz um mehr Zeit oder Fristverlängerung bitten",
      formal: "klar, sachlich und amtstauglich formulieren"
    },
    en: {
      direct: "short, clear and direct",
      deadline: "address the deadline and next step directly",
      cooperative: "stay calm, solution-focused and friendly",
      review: "ask plainly for a review or reply",
      extension: "briefly ask for more time or an extension",
      formal: "write clearly, factually and formally"
    },
    tr: {
      direct: "kisa, net ve dogrudan",
      deadline: "son tarih ve sonraki adimi dogrudan ele al",
      cooperative: "sakin, cozum odakli ve nazik kal",
      review: "inceleme veya geri donus acikca iste",
      extension: "kisa bir sekilde daha fazla zaman iste",
      formal: "acik, resmi ve net yaz"
    },
    uk: {
      direct: "korotko, chytko i pryamo",
      deadline: "vidrazu skazhy pro strok i nastupnyi krok",
      cooperative: "zalyshaysia spokiinym, dobrychlyvym i konstruktyvnym",
      review: "prosto poprosy pro perehliad abo vidpovid",
      extension: "korotko poprosy bilshe chasu abo prodovzhennia stroku",
      formal: "pysy chytko, formalno i po suti"
    },
    es: {
      direct: "corto, claro y directo",
      deadline: "habla de forma directa sobre el plazo y el siguiente paso",
      cooperative: "mantente calmado, amable y orientado a soluciones",
      review: "pide de forma clara una revision o respuesta",
      extension: "pide brevemente mas tiempo o una prorroga",
      formal: "escribe de forma clara, formal y util"
    },
    zh: {
      direct: "简短、清楚、直接",
      deadline: "直接回应期限和下一步",
      cooperative: "保持冷静、友好并以解决问题为导向",
      review: "清楚地请求复核或回复",
      extension: "简短请求更多时间或延期",
      formal: "表达清楚、客观，适合正式机构"
    }
  };

  return map[normalizeToneLocale(locale)][key];
}

function buildDisplayLabel(tone: string, toneDetails: string) {
  return toneDetails ? `${tone} + ${toneDetails}` : tone;
}

export function getReplyToneRecommendation(
  analysis: Pick<
    DocumentAnalysisRecord,
    | "urgency"
    | "is_action_required"
    | "subject"
    | "next_steps"
    | "summary_simple"
    | "summary_simple_long"
    | "required_action"
    | "risks_if_ignored"
    | "sender"
    | "document_type"
  >,
  locale: string
): ReplyToneRecommendation {
  const haystack = [
    analysis.subject,
    analysis.required_action,
    analysis.summary_simple,
    analysis.summary_simple_long,
    analysis.risks_if_ignored,
    analysis.sender,
    analysis.document_type,
    ...(analysis.next_steps ?? [])
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/(widerspruch|einspruch|objection|appeal|contra|pruch|itiraz|oskar|zaperech|recurso)/.test(haystack)) {
    const tone = /(einspruch|appeal|recurso)/.test(haystack)
      ? localizeTone(locale, "appeal")
      : localizeTone(locale, "objection");
    const toneDetails = localizeDetail(locale, "formal");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails) };
  }

  if (/(fristverl|more time|extension|verlanger|prorroga|mehr zeit)/.test(haystack)) {
    const tone = localizeTone(locale, "needMoreTime");
    const toneDetails = localizeDetail(locale, "extension");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails) };
  }

  if (analysis.urgency === "high") {
    const tone = localizeTone(locale, "veryFormal");
    const toneDetails = localizeDetail(locale, "deadline");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails) };
  }

  if (analysis.is_action_required) {
    const tone = localizeTone(locale, "friendly");
    const toneDetails = /(unterlage|nachweis|formular|meldung|bescheid|frist|reply|antwort|response|document)/.test(haystack)
      ? localizeDetail(locale, "direct")
      : localizeDetail(locale, "cooperative");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails) };
  }

  if (/(pruf|review|check|ueberpr|überpr|revision|rueckmeldung|rückmeldung)/.test(haystack)) {
    const tone = localizeTone(locale, "neutral");
    const toneDetails = localizeDetail(locale, "review");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails) };
  }

  const tone = localizeTone(locale, "neutral");
  const toneDetails = "";
  return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails) };
}
