import { normalizePreferredLanguage } from "@/lib/languages";
import type { ContractClauseCategory, ContractGuidanceItem } from "@/lib/types";

type ContractAnalysisCopy = {
  sectionBadge: string;
  title: string;
  intro: string;
  summaryTitle: string;
  summaryText: string;
  keyDataTitle: string;
  keyDataText: string;
  parties: string;
  contractType: string;
  duration: string;
  noticePeriod: string;
  recurringCosts: string;
  autoRenewal: string;
  notClearlyVisible: string;
  flaggedTitle: string;
  flaggedText: string;
  watchTitle: string;
  watchText: string;
  clausesTitle: string;
  clausesText: string;
  clauseReasonLabel: string;
  sourceLabel: string;
  sourceTextLabel: string;
  sourcePageLabel: string;
  sourceSectionLabel: string;
  askAboutThis: string;
  detailsTitle: string;
  actionPointsTitle: string;
  actionPointsText: string;
  disadvantagesTitle: string;
  disadvantagesText: string;
  checklistTitle: string;
  checklistText: string;
  clarificationTitle: string;
  clarificationText: string;
  unclearTitle: string;
  unclearText: string;
  contextNote: string;
  legalNote: string;
  riskOverview: string;
  riskLevels: Record<"low" | "medium" | "elevated", string>;
  categories: Record<
    | "duration"
    | "termination"
    | "auto_renewal"
    | "costs"
    | "liability"
    | "user_duties"
    | "provider_rights"
    | "privacy"
    | "unclear_language"
    | "other",
    string
  >;
  tones: Record<"notice" | "watch" | "caution", string>;
  uploadHintTitle: string;
  uploadHintText: string;
};

const de: ContractAnalysisCopy = {
  sectionBadge: "Vertrag erkannt",
  title: "Vertrags-Scanner",
  intro: "BureauCare fasst den Vertrag in einfacher Sprache zusammen und zeigt Stellen, die du vor einer Unterschrift genauer pruefen solltest.",
  summaryTitle: "Kurz zusammengefasst",
  summaryText: "Worum es in diesem Vertrag wahrscheinlich geht.",
  keyDataTitle: "Wichtige Eckdaten",
  keyDataText: "Diese Punkte waren im Vertrag erkennbar.",
  parties: "Parteien",
  contractType: "Vertragsart",
  duration: "Laufzeit",
  noticePeriod: "Kuendigungsfrist",
  recurringCosts: "Kosten",
  autoRenewal: "Automatische Verlaengerung",
  notClearlyVisible: "Nicht klar erkennbar",
  flaggedTitle: "Auffaellige Punkte",
  flaggedText: "Das sind keine sicheren Rechtsbewertungen, sondern Stellen, die eher streng, unklar oder nachteilig wirken koennen.",
  watchTitle: "Worauf du achten solltest",
  watchText: "Diese Punkte solltest du vor einer Unterschrift oder Zustimmung kurz pruefen.",
  clausesTitle: "Auffaellige Klauseln",
  clausesText: "Diese Vertragsstellen fallen besonders auf. BureauCare ordnet sie vorsichtig nach Themen ein.",
  clauseReasonLabel: "Warum das auffaellt",
  sourceLabel: "Bezieht sich auf diese Stelle",
  sourceTextLabel: "Im Vertrag steht dazu ungefaehr",
  sourcePageLabel: "Seite",
  sourceSectionLabel: "Abschnitt",
  askAboutThis: "Dazu nachfragen",
  detailsTitle: "Mehr zu dieser Stelle",
  actionPointsTitle: "Worauf du achten solltest",
  actionPointsText: "Diese Punkte solltest du vor dem Unterschreiben besonders bewusst pruefen.",
  disadvantagesTitle: "Moegliche Nachteile",
  disadvantagesText: "So koennte sich ein auffaelliger Punkt spaeter fuer dich auswirken.",
  checklistTitle: "Vor dem Unterschreiben pruefen",
  checklistText: "Diese kleine Liste hilft dir beim letzten Gegencheck.",
  clarificationTitle: "Das solltest du noch klaeren",
  clarificationText: "Bei diesen Punkten waere eine Rueckfrage oder genauere Klaerung sinnvoll.",
  unclearTitle: "Noch unklar",
  unclearText: "Diese Punkte waren im Dokument nicht ganz eindeutig.",
  contextNote: "Wenn du willst, kannst du den Vertrag danach immer noch genauer pruefen oder mit einer Fachstelle besprechen.",
  legalNote: "BureauCare hilft beim Verstehen des Vertrags, ersetzt aber keine professionelle Rechtsberatung bei wichtigen oder riskanten Vertraegen.",
  riskOverview: "Erster Eindruck",
  riskLevels: {
    low: "Eher unauffaellig",
    medium: "Sollte geprueft werden",
    elevated: "Eher auffaellig"
  },
  categories: {
    duration: "Laufzeit",
    termination: "Kuendigung",
    auto_renewal: "Automatische Verlaengerung",
    costs: "Kosten und Gebuehren",
    liability: "Haftung und Verantwortung",
    user_duties: "Pflichten des Nutzers",
    provider_rights: "Rechte der Gegenseite",
    privacy: "Datenschutz und Datennutzung",
    unclear_language: "Unklare Formulierungen",
    other: "Sonstige Auffaelligkeiten"
  },
  tones: {
    notice: "Hinweis",
    watch: "Genauer ansehen",
    caution: "Eher streng"
  },
  uploadHintTitle: "Auch Vertraege kannst du hier hochladen",
  uploadHintText: "Zum Beispiel Mietvertraege, Arbeitsvertraege, Mobilfunkvertraege oder Versicherungsunterlagen."
};

const en: ContractAnalysisCopy = {
  ...de,
  sectionBadge: "Contract detected",
  title: "Contract scanner",
  intro: "BureauCare summarizes the contract in simple language and points out areas you may want to review before signing.",
  summaryTitle: "Short summary",
  summaryText: "What this contract most likely covers.",
  keyDataTitle: "Key details",
  keyDataText: "These points could be identified in the contract.",
  parties: "Parties",
  contractType: "Contract type",
  duration: "Duration",
  noticePeriod: "Notice period",
  recurringCosts: "Costs",
  autoRenewal: "Automatic renewal",
  notClearlyVisible: "Not clearly visible",
  flaggedTitle: "Points that stand out",
  flaggedText: "These are not firm legal judgments. They are areas that may feel strict, unclear or one-sided.",
  watchTitle: "What to watch out for",
  watchText: "These are the points worth checking before you sign or agree.",
  clausesTitle: "Clauses that stand out",
  clausesText: "These contract clauses stand out most. BureauCare groups them carefully by topic.",
  clauseReasonLabel: "Why this stands out",
  sourceLabel: "This refers to this part",
  sourceTextLabel: "The contract says roughly",
  sourcePageLabel: "Page",
  sourceSectionLabel: "Section",
  askAboutThis: "Ask about this",
  detailsTitle: "More about this part",
  actionPointsTitle: "What you should watch carefully",
  actionPointsText: "These are the points you should check especially well before signing.",
  disadvantagesTitle: "Possible disadvantages",
  disadvantagesText: "This is how an unusual point could affect you later.",
  checklistTitle: "Check before signing",
  checklistText: "This short list helps with one last careful check.",
  clarificationTitle: "What you should still clarify",
  clarificationText: "These points may be worth clarifying or asking about before you sign.",
  unclearTitle: "Still unclear",
  unclearText: "These parts were not fully clear in the document.",
  contextNote: "If you want, you can still review the contract more closely or discuss it with a professional service afterward.",
  legalNote: "BureauCare helps you understand the contract, but it does not replace professional legal advice for important or risky contracts.",
  riskOverview: "First impression",
  riskLevels: {
    low: "Rather mild",
    medium: "Worth checking",
    elevated: "More noticeable"
  },
  categories: {
    duration: "Duration",
    termination: "Termination",
    auto_renewal: "Automatic renewal",
    costs: "Costs and fees",
    liability: "Liability and responsibility",
    user_duties: "User duties",
    provider_rights: "Provider rights",
    privacy: "Privacy and data use",
    unclear_language: "Unclear wording",
    other: "Other concerns"
  },
  tones: {
    notice: "Note",
    watch: "Look closer",
    caution: "Rather strict"
  },
  uploadHintTitle: "You can upload contracts here too",
  uploadHintText: "For example rental contracts, work contracts, mobile plans or insurance documents."
};

const tr: ContractAnalysisCopy = {
  ...en,
  sectionBadge: "Sozlesme algilandi",
  title: "Sozlesme tarayici",
  intro: "BureauCare sozlesmeyi basit bir dille ozetler ve imzalamadan once tekrar bakman gereken yerleri gosterir.",
  summaryTitle: "Kisa ozet",
  summaryText: "Bu sozlesmenin buyuk ihtimalle neyle ilgili oldugu.",
  keyDataTitle: "Onemli bilgiler",
  keyDataText: "Bu noktalar sozlesmede gorulebildi.",
  parties: "Taraflar",
  contractType: "Sozlesme tipi",
  duration: "Sure",
  noticePeriod: "Fesih suresi",
  recurringCosts: "Masraflar",
  autoRenewal: "Otomatik uzatma",
  notClearlyVisible: "Net gorunmuyor",
  flaggedTitle: "Dikkat ceken noktalar",
  flaggedText: "Bunlar kesin hukuki degerlendirmeler degil. Sadece daha sert, belirsiz veya dezavantajli gorunen yerlerdir.",
  watchTitle: "Dikkat etmen gerekenler",
  watchText: "Imzalamadan veya onaylamadan once bu noktalari kisaca kontrol et.",
  unclearTitle: "Hala belirsiz",
  unclearText: "Bu noktalar belgede tam acik degildi.",
  contextNote: "Istersen daha sonra bu sozlesmeyi daha detayli inceleyebilir veya bir uzmana gosterebilirsin.",
  legalNote: "BureauCare sozlesmeyi anlamana yardim eder ama onemli veya riskli sozlesmelerde profesyonel hukuki danismanligin yerine gecmez.",
  riskOverview: "Ilk izlenim",
  tones: {
    notice: "Not",
    watch: "Daha yakindan bak",
    caution: "Daha sert"
  },
  uploadHintTitle: "Sozlesmeleri de burada yukleyebilirsin",
  uploadHintText: "Ornegin kira sozlesmeleri, is sozlesmeleri, telefon sozlesmeleri veya sigorta belgeleri."
};

const uk: ContractAnalysisCopy = {
  ...en,
  sectionBadge: "Dogovir rozpiznano",
  title: "Skaner dogovoriv",
  intro: "BureauCare poyasnyuye dogovir prostoyu movoyu i pokazuye mistsya, yaki varto pereviryty pered pidpysom.",
  summaryTitle: "Korotko",
  summaryText: "Pro shcho, ymovirno, tsey dogovir.",
  keyDataTitle: "Vazhlyvi detali",
  keyDataText: "Ci punkty vdalosya pobachyty v dogovori.",
  parties: "Storony",
  contractType: "Typ dogovoru",
  duration: "Tryvalist",
  noticePeriod: "Strok rozirvannya",
  recurringCosts: "Vytraty",
  autoRenewal: "Avtomatychne prodovzhennya",
  notClearlyVisible: "Ne duzhe zrozumilo",
  flaggedTitle: "Shcho kydayetsya v ochi",
  flaggedText: "Ce ne yurydychni vysnovky. Prosto mistsya, yaki mozhut vyhlyadaty suvoro, neyasno abo nevygidno.",
  watchTitle: "Na shcho zvernuty uvagu",
  watchText: "Ci punkty krashche shche raz pereviryty pered pidpysom chy zgodoyu.",
  unclearTitle: "Shche neyasno",
  unclearText: "Ci punkty v dokumenti buly ne do kincya zrozumili.",
  contextNote: "Za bazhannyam ty mozhesh potim rozibraty dogovir hlybche abo obhovoryty yoho z fakhivcem.",
  legalNote: "BureauCare dopomagaye zrozumity dogovir, ale ne zaminyuye profesiynu yurydychnu dopomogu dlya vazhlyvykh chy ryzykovykh dogovoriv.",
  riskOverview: "Pershe vrazhennya",
  tones: {
    notice: "Pidskazka",
    watch: "Podyvysya uvazhno",
    caution: "Dovoly suvoro"
  },
  uploadHintTitle: "Tut mozhna zavantazhuvaty y dogovory",
  uploadHintText: "Napryklad dogovir orendy, trudovyy dogovir, mobilnyy kontrakt abo strakhovi dokumenty."
};

const es: ContractAnalysisCopy = {
  ...en,
  sectionBadge: "Contrato detectado",
  title: "Escaner de contratos",
  intro: "BureauCare resume el contrato con lenguaje sencillo y muestra las partes que conviene revisar antes de firmar.",
  summaryTitle: "Resumen corto",
  summaryText: "De que trata probablemente este contrato.",
  keyDataTitle: "Datos importantes",
  keyDataText: "Estos puntos se pudieron reconocer en el contrato.",
  parties: "Partes",
  contractType: "Tipo de contrato",
  duration: "Duracion",
  noticePeriod: "Plazo de cancelacion",
  recurringCosts: "Costes",
  autoRenewal: "Renovacion automatica",
  notClearlyVisible: "No se ve con claridad",
  flaggedTitle: "Puntos llamativos",
  flaggedText: "No son valoraciones legales firmes. Son partes que pueden parecer estrictas, poco claras o desfavorables.",
  watchTitle: "En que deberias fijarte",
  watchText: "Conviene revisar estos puntos antes de firmar o aceptar.",
  unclearTitle: "Todavia no esta claro",
  unclearText: "Estas partes no se veian del todo claras en el documento.",
  contextNote: "Si quieres, despues puedes revisar el contrato con mas detalle o hablarlo con un servicio profesional.",
  legalNote: "BureauCare te ayuda a entender el contrato, pero no sustituye el asesoramiento juridico profesional en contratos importantes o arriesgados.",
  riskOverview: "Primera impresion",
  tones: {
    notice: "Nota",
    watch: "Mirar mejor",
    caution: "Mas estricto"
  },
  uploadHintTitle: "Tambien puedes subir contratos aqui",
  uploadHintText: "Por ejemplo contratos de alquiler, de trabajo, de movil o documentos de seguros."
};

const zh: ContractAnalysisCopy = {
  ...en,
  sectionBadge: "已识别为合同",
  title: "合同扫描",
  intro: "BureauCare 会用简单的话总结这份合同，并提示你在签字前值得再看一眼的地方。",
  summaryTitle: "简短总结",
  summaryText: "这份合同大概率是关于什么的。",
  keyDataTitle: "重要信息",
  keyDataText: "这些信息可以从合同中看出来。",
  parties: "合同双方",
  contractType: "合同类型",
  duration: "期限",
  noticePeriod: "解约期限",
  recurringCosts: "费用",
  autoRenewal: "自动续期",
  notClearlyVisible: "暂时看不清楚",
  flaggedTitle: "需要留意的地方",
  flaggedText: "这些不是确定的法律判断，只是看起来可能比较严格、不清楚或对你不利的地方。",
  watchTitle: "签字前你要注意",
  watchText: "在签字或同意之前，最好再看看这些点。",
  unclearTitle: "还不够清楚",
  unclearText: "这些内容在文件里还不是很明确。",
  contextNote: "如果你愿意，之后也可以再更仔细地检查合同，或者找专业机构一起看。",
  legalNote: "BureauCare 可以帮助你理解合同，但对于重要或风险较高的合同，它不能代替专业法律建议。",
  riskOverview: "初步印象",
  tones: {
    notice: "提示",
    watch: "建议细看",
    caution: "偏严格"
  },
  uploadHintTitle: "这里也可以上传合同",
  uploadHintText: "例如租房合同、劳动合同、手机合同或保险文件。"
};

const copy = { de, en, tr, uk, es, zh } as const;

export function getContractAnalysisCopy(locale: string | null | undefined) {
  return copy[normalizePreferredLanguage(locale)];
}

type GuidanceKind = "action" | "disadvantage" | "clarification" | "checklist";

function getGuidanceTemplates(locale: string | null | undefined) {
  const normalized = normalizePreferredLanguage(locale);

  if (normalized === "de") {
    return {
      action: {
        duration: "Ueberlege, ob du wirklich so lange an diesen Vertrag gebunden sein moechtest.",
        termination: "Schau dir genau an, wie und bis wann du kuendigen darfst.",
        auto_renewal: "Pruefe, bis wann du kuendigen muesstest, damit sich der Vertrag nicht automatisch verlaengert.",
        costs: "Pruefe genau, ob neben dem Grundpreis noch weitere Kosten oder Gebuehren dazukommen.",
        liability: "Achte darauf, welche Verantwortung oder Haftung du laut Vertrag uebernimmst.",
        user_duties: "Pruefe, welche Pflichten du regelmaessig erfuellen oder nachweisen musst.",
        provider_rights: "Achte darauf, ob die Gegenseite spaeter Bedingungen einseitig aendern darf.",
        privacy: "Pruefe, welche Daten genutzt oder weitergegeben werden duerfen.",
        unclear_language: "Lies diese Stelle noch einmal langsam oder lass sie dir erklaeren, wenn sie unklar bleibt.",
        other: "Pruefe diese Sonderregel vor dem Unterschreiben noch einmal genauer."
      },
      disadvantage: {
        duration: "Das koennte unpraktisch sein, wenn du frueher aus dem Vertrag herauswillst.",
        termination: "Das koennte dir spaeter Nachteile bringen, wenn eine Kuendigung nur schwer oder sehr eng moeglich ist.",
        auto_renewal: "Das koennte dazu fuehren, dass der Vertrag laenger weiterlaeuft als gedacht.",
        costs: "Das koennte teuer werden, wenn zusaetzliche Kosten dazukommen oder Preise spaeter steigen.",
        liability: "Das koennte fuer dich nachteilig sein, wenn du sehr viel Verantwortung uebernimmst.",
        user_duties: "Das koennte stressig werden, wenn du viele Pflichten oder Nachweise erfuellen musst.",
        provider_rights: "Das koennte dir spaeter Nachteile bringen, wenn die Gegenseite Bedingungen einseitig aendern darf.",
        privacy: "Das koennte fuer dich nachteilig sein, wenn viele persoenliche Daten genutzt oder weitergegeben werden duerfen.",
        unclear_language: "Das kann spaeter problematisch sein, wenn unklar bleibt, was genau gemeint ist.",
        other: "Das koennte spaeter unangenehm werden, wenn diese Sonderregel gegen dich arbeitet."
      },
      clarification: {
        duration: "Wenn dir die Bindung zu lang vorkommt, solltest du vor dem Unterschreiben noch einmal nachfragen.",
        termination: "Diese Kuendigungsregel solltest du vor dem Unterschreiben noch klaeren.",
        auto_renewal: "Hier waere es sinnvoll zu klaeren, wie die automatische Verlaengerung genau funktioniert.",
        costs: "Diese Kostenstruktur solltest du vor dem Unterschreiben noch klaeren.",
        liability: "Hier solltest du vor dem Unterschreiben nachfragen, welche Verantwortung du genau uebernimmst.",
        user_duties: "Hier lohnt sich eine Nachfrage, welche Pflichten wirklich auf dich zukommen.",
        provider_rights: "Diese einseitigen Rechte solltest du vor dem Unterschreiben noch klaeren.",
        privacy: "Hier solltest du noch klaeren, welche Daten genau genutzt oder weitergegeben werden.",
        unclear_language: "Diese Formulierung ist unklar und sollte vor dem Unterschreiben genauer geklaert werden.",
        other: "Diesen Punkt solltest du vor dem Unterschreiben noch klaeren."
      },
      checklist: {
        duration: "Habe ich die Laufzeit verstanden?",
        termination: "Weiss ich, wie und bis wann ich kuendigen kann?",
        auto_renewal: "Gibt es eine automatische Verlaengerung?",
        costs: "Sind alle Kosten und moeglichen Zusatzgebuehren klar?",
        liability: "Verstehe ich, welche Verantwortung ich uebernehme?",
        user_duties: "Weiss ich, welche Pflichten ich laut Vertrag erfuellen muss?",
        provider_rights: "Darf die Gegenseite Bedingungen spaeter einseitig aendern?",
        privacy: "Weiss ich, welche Daten genutzt oder weitergegeben werden duerfen?",
        unclear_language: "Gibt es Stellen, die ich noch nicht wirklich verstehe?",
        other: "Gibt es eine Sonderregel, die ich vor der Unterschrift noch pruefen sollte?"
      }
    } satisfies Record<GuidanceKind, Record<ContractClauseCategory, string>>;
  }

  return {
    action: {
      duration: "Think about whether you really want to stay tied to this contract for that long.",
      termination: "Check carefully how and by when you are allowed to cancel.",
      auto_renewal: "Check by when you would need to cancel so the contract does not renew automatically.",
      costs: "Check carefully whether there are extra fees besides the basic price.",
      liability: "Pay attention to how much responsibility or liability you take on.",
      user_duties: "Check which duties or proof you may have to provide regularly.",
      provider_rights: "Watch whether the other side may change conditions later on its own.",
      privacy: "Check which data may be used or shared.",
      unclear_language: "Read this part again slowly or ask for an explanation if it stays unclear.",
      other: "Take another careful look at this special rule before signing."
    },
    disadvantage: {
      duration: "This may be inconvenient if you want to leave the contract earlier.",
      termination: "This could be a disadvantage later if canceling is only possible under strict conditions.",
      auto_renewal: "This may cause the contract to continue longer than you expected.",
      costs: "This could become expensive if extra fees appear or prices rise later.",
      liability: "This could be a disadvantage if you take on a lot of responsibility.",
      user_duties: "This may become stressful if you must meet many duties or provide proof often.",
      provider_rights: "This could create disadvantages later if the other side can change conditions on its own.",
      privacy: "This could be a disadvantage if a lot of personal data may be used or shared.",
      unclear_language: "This may become a problem later if it stays unclear what the clause really means.",
      other: "This special rule could become unpleasant later if it works against you."
    },
    clarification: {
      duration: "If this binding period feels long, it is worth asking about it before you sign.",
      termination: "This cancellation rule should be clarified before you sign.",
      auto_renewal: "It would be sensible to clarify exactly how the automatic renewal works.",
      costs: "This cost structure should be clarified before you sign.",
      liability: "Ask before signing which responsibility you would actually take on.",
      user_duties: "It is worth clarifying which duties really apply to you.",
      provider_rights: "These one-sided rights should be clarified before you sign.",
      privacy: "Clarify which data may actually be used or shared.",
      unclear_language: "This wording is unclear and should be clarified before you sign.",
      other: "This point should be clarified before you sign."
    },
    checklist: {
      duration: "Have I understood the duration?",
      termination: "Do I know how and by when I can cancel?",
      auto_renewal: "Is there an automatic renewal?",
      costs: "Are all costs and possible extra fees clear?",
      liability: "Do I understand which responsibility I take on?",
      user_duties: "Do I know which duties I must meet under this contract?",
      provider_rights: "Can the other side change conditions later on its own?",
      privacy: "Do I know which data may be used or shared?",
      unclear_language: "Are there parts I still do not really understand?",
      other: "Is there a special rule I should check once more before signing?"
    }
  } satisfies Record<GuidanceKind, Record<ContractClauseCategory, string>>;
}

export function getContractGuidanceText(
  locale: string | null | undefined,
  kind: GuidanceKind,
  item: ContractGuidanceItem
) {
  return getGuidanceTemplates(locale)[kind][item.category];
}
