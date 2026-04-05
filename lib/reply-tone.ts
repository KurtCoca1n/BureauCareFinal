import type { DocumentAnalysisRecord } from "@/lib/types";

export type ReplyToneRecommendation = {
  tone: string;
  toneDetails: string;
  displayLabel: string;
  reason: string;
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

function localizeReason(locale: string, key: "appeal" | "objection" | "extension" | "deadline" | "action" | "review" | "neutral") {
  const map: Record<ToneLocale, Record<typeof key, string>> = {
    de: {
      appeal: "BureauCare schlaegt Einspruch vor, weil das Schreiben nach einer formellen Pruefung, Anfechtung oder einem offiziellen Rechtsbehelf klingt.",
      objection: "BureauCare schlaegt Widerspruch vor, weil das Schreiben nach einer formellen Gegenwehr gegen eine Entscheidung oder Forderung klingt.",
      extension: "BureauCare schlaegt mehr Zeit vor, weil es vor allem um Fristverlaengerung oder Aufschub zu gehen scheint.",
      deadline: "BureauCare schlaegt einen sehr formellen Ton vor, weil das Schreiben dringend wirkt oder eine klare Frist hat.",
      action: "BureauCare schlaegt einen freundlichen, klaren Ton vor, weil eine konkrete Rueckmeldung oder Unterlage benoetigt wird.",
      review: "BureauCare schlaegt einen sachlichen Ton vor, weil es vor allem um Pruefung, Rueckmeldung oder Klaerung geht.",
      neutral: "BureauCare schlaegt einen neutralen Ton vor, weil im Schreiben noch kein staerkerer Sonderfall erkennbar ist."
    },
    en: {
      appeal: "BureauCare suggests an appeal because the document sounds like a formal review, challenge or official remedy.",
      objection: "BureauCare suggests an objection because the document sounds like a formal response against a decision or claim.",
      extension: "BureauCare suggests asking for more time because the main issue seems to be a deadline extension or delay.",
      deadline: "BureauCare suggests a very formal tone because the document looks urgent or contains a clear deadline.",
      action: "BureauCare suggests a friendly but clear tone because a concrete reply or missing document seems to be needed.",
      review: "BureauCare suggests a factual tone because the main point seems to be review, clarification or feedback.",
      neutral: "BureauCare suggests a neutral tone because no stronger special case is clearly visible in the document."
    },
    tr: {
      appeal: "BureauCare resmi bir inceleme veya itiraz yolu ima edildigi icin resmi itiraz tonu oneriyor.",
      objection: "BureauCare bir karar ya da talebe karsi resmi cevap gerektigi icin itiraz tonu oneriyor.",
      extension: "BureauCare konu daha cok ek sure veya erteleme gibi gorundugu icin daha fazla zaman tonu oneriyor.",
      deadline: "BureauCare belge acil veya net bir son tarih iceriyor gibi gorundugu icin cok resmi bir ton oneriyor.",
      action: "BureauCare somut bir cevap ya da belge gerekli gorundugu icin nazik ama net bir ton oneriyor.",
      review: "BureauCare konu daha cok inceleme, aciklama veya geri donus oldugu icin sade bir ton oneriyor.",
      neutral: "BureauCare belgede daha guclu bir ozel durum gormedigi icin notr bir ton oneriyor."
    },
    uk: {
      appeal: "BureauCare proponuye skargu, bo dokument skhozhyy na formalnyy perehlyad chy pravovyy zasib.",
      objection: "BureauCare proponuye zaperechennya, bo dokument skhozhyy na formalnu vidpovid proty rishennya abo vymohy.",
      extension: "BureauCare proponuye poprosyty bilshe chasu, bo ymovirno ydetsya pro prodovzhennya stroku.",
      deadline: "BureauCare proponuye duzhe formalnyy ton, bo dokument vyhlyadaye terminovym abo mistyt chytkyy strok.",
      action: "BureauCare proponuye dobrychlyvyy, ale chytkyy ton, bo skhozhe potribna konkretna vidpovid abo dokument.",
      review: "BureauCare proponuye strymanyy ton, bo skhozhe ydetsya pro perevirku, utochnennya abo vidpovid.",
      neutral: "BureauCare proponuye neitralnyy ton, bo v dokumenti ne vydno sylnishoho osoblyvoho vypadka."
    },
    es: {
      appeal: "BureauCare propone un recurso porque el documento suena a revision formal, impugnacion o remedio oficial.",
      objection: "BureauCare propone una oposicion porque el documento suena a respuesta formal contra una decision o reclamacion.",
      extension: "BureauCare propone pedir mas tiempo porque parece que el punto central es una ampliacion de plazo.",
      deadline: "BureauCare propone un tono muy formal porque el documento parece urgente o tiene un plazo claro.",
      action: "BureauCare propone un tono amable y claro porque parece que hace falta una respuesta concreta o un documento.",
      review: "BureauCare propone un tono objetivo porque el punto principal parece ser una revision, aclaracion o respuesta.",
      neutral: "BureauCare propone un tono neutral porque no se ve un caso especial mas fuerte en el documento."
    },
    zh: {
      appeal: "BureauCare 建议用申诉语气，因为这份文件看起来像是在进入正式复核、申诉或其他正式救济程序。",
      objection: "BureauCare 建议用异议语气，因为这份文件看起来像是在正式反对某项决定或要求。",
      extension: "BureauCare 建议请求更多时间，因为这份文件的重点似乎是期限延长或暂缓处理。",
      deadline: "BureauCare 建议更正式的语气，因为这份文件看起来比较紧急，或者有明确期限。",
      action: "BureauCare 建议用友好但清楚的语气，因为这里更像是需要具体回复或补交材料。",
      review: "BureauCare 建议用客观语气，因为这里更像是需要复核、说明或进一步答复。",
      neutral: "BureauCare 建议用中性语气，因为文件里暂时没有更强的特殊情况。"
    }
  };

  return map[normalizeToneLocale(locale)][key];
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
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails), reason: localizeReason(locale, /(einspruch|appeal|recurso)/.test(haystack) ? "appeal" : "objection") };
  }

  if (/(fristverl|more time|extension|verlanger|prorroga|mehr zeit)/.test(haystack)) {
    const tone = localizeTone(locale, "needMoreTime");
    const toneDetails = localizeDetail(locale, "extension");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails), reason: localizeReason(locale, "extension") };
  }

  if (analysis.urgency === "high") {
    const tone = localizeTone(locale, "veryFormal");
    const toneDetails = localizeDetail(locale, "deadline");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails), reason: localizeReason(locale, "deadline") };
  }

  if (analysis.is_action_required) {
    const tone = localizeTone(locale, "friendly");
    const toneDetails = /(unterlage|nachweis|formular|meldung|bescheid|frist|reply|antwort|response|document)/.test(haystack)
      ? localizeDetail(locale, "direct")
      : localizeDetail(locale, "cooperative");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails), reason: localizeReason(locale, "action") };
  }

  if (/(pruf|review|check|ueberpr|überpr|revision|rueckmeldung|rückmeldung)/.test(haystack)) {
    const tone = localizeTone(locale, "neutral");
    const toneDetails = localizeDetail(locale, "review");
    return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails), reason: localizeReason(locale, "review") };
  }

  const tone = localizeTone(locale, "neutral");
  const toneDetails = "";
  return { tone, toneDetails, displayLabel: buildDisplayLabel(tone, toneDetails), reason: localizeReason(locale, "neutral") };
}
