import {
  getAuthorityLabel,
  getProcedureSubtitle,
  getProcedureTitle,
  processAuthorities,
  processProcedures,
  type ProcessAuthority,
  type ProcessProcedure
} from "./processes-ui";

type ProcedureSearchProfile = {
  procedureId: string;
  concepts: string[];
  aliases: string[];
};

type AuthoritySearchProfile = {
  authorityId: string;
  aliases: string[];
};

type SearchResult = {
  procedure: ProcessProcedure;
  authorityIds: string[];
  score: number;
  matchReasons: string[];
};

type RankedAuthority = {
  authority: ProcessAuthority;
  score: number;
};

type SearchOutcome = {
  results: SearchResult[];
  authorities: RankedAuthority[];
  bestMatch: SearchResult | null;
  hasSemanticInterpretation: boolean;
};

const procedureProfiles: ProcedureSearchProfile[] = [
  {
    procedureId: "buergergeld",
    concepts: ["living_support", "survival_money", "rent_support", "foreign_resident_support", "job_loss"],
    aliases: [
      "burgergeld",
      "buergergeld",
      "geld zum leben",
      "money for living",
      "living money",
      "hilfe zum leben",
      "income support",
      "basic income germany",
      "financial support for living",
      "para vivir",
      "dinero para vivir",
      "yardim para yasam",
      "gecim yardimi",
      "prozhyty",
      "деньги на жизнь",
      "допомога на життя",
      "معونة معيشة",
      "کمک هزینه زندگی",
      "allocation de subsistance",
      "aiuto per vivere"
    ]
  },
  {
    procedureId: "wohngeld",
    concepts: ["housing_support", "rent_support", "housing_costs", "foreign_resident_support"],
    aliases: [
      "wohngeld",
      "wohnhilfe",
      "wohnungshilfe",
      "hilfe bei miete",
      "geld fur wohnung",
      "money for rent",
      "rent support",
      "housing benefit",
      "housing allowance",
      "help with rent",
      "ayuda vivienda",
      "ayuda para alquiler",
      "ayuda para renta",
      "kira yardimi",
      "ev yardimi",
      "допомога на житло",
      "допомога на оренду",
      "помощь с жильем",
      "مساعدة الايجار",
      "مساعدة السكن",
      "کمک اجاره",
      "کمک مسکن",
      "aide au logement",
      "aiuto affitto"
    ]
  },
  {
    procedureId: "arbeitslosmeldung",
    concepts: ["job_loss", "employment_support"],
    aliases: [
      "arbeitslos melden",
      "arbeitslosigkeit",
      "unemployed",
      "register unemployed",
      "job loss",
      "sin trabajo",
      "desempleo",
      "issiz",
      "işsiz",
      "робота втрачена",
      "безробіття",
      "بطالة",
      "بیکار",
      "chomage",
      "disoccupato"
    ]
  },
  {
    procedureId: "kindergeld",
    concepts: ["children_support", "family_support"],
    aliases: [
      "kindergeld",
      "kind geld",
      "geld fur kinder",
      "money for children",
      "child benefit",
      "family allowance",
      "children support",
      "ayuda para ninos",
      "dinero para ninos",
      "cocuk parasi",
      "çocuk parası",
      "дитячі виплати",
      "деньги на ребенка",
      "اعانة طفل",
      "کمک هزینه فرزند",
      "allocations familiales",
      "assegno figli"
    ]
  },
  {
    procedureId: "steuererklaerung",
    concepts: ["taxes"],
    aliases: [
      "steuererklarung",
      "steuer machen",
      "tax return",
      "income tax",
      "declaracion de impuestos",
      "impuestos",
      "vergi beyani",
      "налоговая декларация",
      "податкова декларація",
      "اقرار ضريبي",
      "اظهارنامه مالیاتی",
      "declaration d impots",
      "dichiarazione dei redditi"
    ]
  },
  {
    procedureId: "ummeldung",
    concepts: ["address_registration", "move"],
    aliases: [
      "ummelden",
      "anmeldung neue wohnung",
      "anmeldung adresse",
      "new address registration",
      "register new apartment",
      "move registration",
      "change address official",
      "empadronamiento",
      "cambio de domicilio",
      "adres kaydi",
      "adres degisikligi kaydi",
      "реєстрація адреси",
      "смена адреса регистрация",
      "تسجيل عنوان جديد",
      "ثبت آدرس جدید",
      "declaration de domicile",
      "cambio residenza"
    ]
  },
  {
    procedureId: "visum",
    concepts: ["visa_residence", "foreigner", "immigration"],
    aliases: [
      "visum",
      "visa machen",
      "aufenthalt",
      "residence permit",
      "visa application",
      "foreigner permit",
      "immigration office",
      "permiso de residencia",
      "visado",
      "oturum",
      "vize",
      "посвідка",
      "віза",
      "вид на жительство",
      "اقامة",
      "تأشيرة",
      "ویزای",
      "اقامت",
      "titre de sejour",
      "permesso di soggiorno"
    ]
  },
  {
    procedureId: "krankenkasse-wechsel",
    concepts: ["health_insurance"],
    aliases: [
      "krankenkasse",
      "health insurance",
      "medical insurance",
      "seguro medico",
      "sağlık sigortası",
      "saglik sigortasi",
      "медичне страхування",
      "медстраховка",
      "تأمين صحي",
      "بیمه درمانی",
      "assurance maladie",
      "assicurazione sanitaria"
    ]
  },
  {
    procedureId: "bafoeg-antrag",
    concepts: ["student_funding", "education_support"],
    aliases: [
      "bafoeg",
      "bafog",
      "student aid",
      "study support",
      "money for study",
      "ayuda estudios",
      "beca estudios",
      "ogrenci yardimi",
      "öğrenci yardımı",
      "допомога на навчання",
      "студенческая помощь",
      "منحة دراسة",
      "کمک هزینه تحصیل",
      "aide etudiante",
      "aiuto studio"
    ]
  },
  {
    procedureId: "gewerbe",
    concepts: ["business_registration", "self_employment"],
    aliases: [
      "gewerbe anmelden",
      "business registration",
      "start business",
      "self employed",
      "autonomo registrieren",
      "registrar negocio",
      "alta autonomo",
      "isyeri kaydi",
      "iş kurma",
      "реєстрація бізнесу",
      "самозайнятість",
      "تسجيل نشاط تجاري",
      "ثبت کسب و کار",
      "creer entreprise",
      "aprire partita iva"
    ]
  }
];

const authorityProfiles: AuthoritySearchProfile[] = [
  { authorityId: "jobcenter", aliases: ["jobcenter", "basic support office", "centro de empleo", "مركز العمل", "مرکز کار"] },
  { authorityId: "agentur", aliases: ["arbeitsagentur", "employment agency", "agencia de empleo", "وكالة العمل", "ajans"] },
  { authorityId: "familienkasse", aliases: ["familienkasse", "family benefits office", "caja familiar"] },
  { authorityId: "finanzamt", aliases: ["finanzamt", "tax office", "hacienda", "impuestos"] },
  { authorityId: "buergeramt", aliases: ["burgeramt", "buergeramt", "citizen office", "oficina ciudadana"] },
  { authorityId: "auslaenderbehoerde", aliases: ["auslanderbehorde", "auslaenderbehoerde", "immigration office", "oficina de extranjeria"] },
  { authorityId: "krankenkasse", aliases: ["krankenkasse", "health insurance", "seguro medico"] },
  { authorityId: "bafoeg", aliases: ["bafoeg", "bafog", "student aid office", "study funding"] }
];

const conceptLexicon: Record<string, string[]> = {
  living_support: [
    "geld zum leben",
    "money for living",
    "living money",
    "hilfe zum leben",
    "existenz",
    "subsistence",
    "gecim",
    "допомога на життя",
    "معيشة",
    "زندگی"
  ],
  survival_money: ["bills", "food money", "essen bezahlen", "leben bezahlen", "para comer"],
  housing_support: [
    "wohnungshilfe",
    "wohnhilfe",
    "housing benefit",
    "help with rent",
    "ayuda vivienda",
    "kira yardimi",
    "допомога на житло",
    "مساعدة السكن",
    "کمک مسکن",
    "aide logement",
    "aiuto casa"
  ],
  housing_costs: ["miete", "rent", "alquiler", "kira", "оренда", "жилье", "إيجار", "اجاره", "loyer", "affitto"],
  rent_support: ["rent support", "hilfe bei miete", "money for rent", "housing allowance", "alquiler ayuda"],
  children_support: ["kind geld", "kindergeld", "child benefit", "money for children", "ayuda hijos", "çocuk parası"],
  family_support: ["family support", "familie hilfe", "familia ayuda", "aile yardimi", "родина допомога"],
  visa_residence: ["visum", "visa", "residence permit", "aufenthalt", "permiso residencia", "oturum", "віза", "اقامة", "اقامت"],
  foreigner: ["auslander", "ausländer", "foreign", "foreigner", "extranjero", "yabanci", "іноземець", "اجنبي", "اتباع خارجی"],
  immigration: ["immigration", "migracion", "goc", "міграція", "هجرة", "مهاجرت"],
  address_registration: ["ummelden", "anmeldung", "register address", "new address", "empadronamiento", "adres kaydi", "реєстрація адреси"],
  move: ["move", "moving", "umzug", "mudanza", "tasinmak", "переїзд", "نقل عنوان", "اسباب کشی"],
  job_loss: ["arbeitslos", "unemployed", "job loss", "sin trabajo", "issiz", "безробіття", "بطالة", "بیکار"],
  employment_support: ["agentur", "employment", "arbeit suchen", "busco trabajo", "iş bulma", "пошук роботи"],
  student_funding: ["bafoeg", "student aid", "study support", "beca", "ogrenci yardimi", "студентська допомога"],
  education_support: ["study", "studium", "universidad", "universite", "навчання", "دراسة", "تحصیل"],
  taxes: ["steuer", "tax", "impuestos", "vergi", "податок", "ضريبة", "مالیات"],
  health_insurance: ["krankenkasse", "health insurance", "medical insurance", "seguro medico", "sigorta", "страхування", "تأمين صحي", "بیمه درمانی"],
  business_registration: ["gewerbe", "register business", "start business", "autonomo", "isyeri", "бізнес", "نشاط تجاري", "کسب و کار"],
  self_employment: ["selbststandig", "self employed", "freelance", "autonomo", "serbest", "самозайнятість"]
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/[ة]/g, "ه")
    .replace(/[ى]/g, "ي")
    .replace(/[ؤ]/g, "و")
    .replace(/[ئ]/g, "ي")
    .replace(/[ك]/g, "ک")
    .replace(/[ي]/g, "ی")
    .replace(/[٠-٩]/g, (digit) => String("٠١٢٣٤٥٦٧٨٩".indexOf(digit)))
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value: string) {
  return normalizeSearchText(value)
    .split(/[\s-]+/)
    .map((token) => token.trim())
    .filter((token) => token.length > 1);
}

function buildProcedureText(locale: string, procedure: ProcessProcedure) {
  const authorityLabels = procedure.authorityIds
    .map((authorityId) => processAuthorities.find((entry) => entry.id === authorityId))
    .filter((authority): authority is ProcessAuthority => Boolean(authority))
    .map((authority) => getAuthorityLabel(authority, locale));

  return [
    getProcedureTitle(procedure, locale),
    getProcedureSubtitle(procedure, locale),
    ...procedure.keywords,
    ...authorityLabels
  ].map(normalizeSearchText);
}

function buildAuthorityText(locale: string, authority: ProcessAuthority) {
  return [getAuthorityLabel(authority, locale), ...authority.keywords].map(normalizeSearchText);
}

function scoreTextCollection(query: string, tokens: string[], haystack: string[]) {
  let score = 0;

  for (const entry of haystack) {
    if (entry === query) score += 18;
    else if (entry.startsWith(query) && query.length > 2) score += 14;
    else if (entry.includes(query) && query.length > 2) score += 8;

    for (const token of tokens) {
      if (entry === token) score += 6;
      else if (entry.includes(token)) score += 2.5;
    }
  }

  return score;
}

function getConceptMatches(query: string, tokens: string[]) {
  const hits = new Set<string>();

  Object.entries(conceptLexicon).forEach(([concept, aliases]) => {
    const normalizedAliases = aliases.map(normalizeSearchText);
    if (
      normalizedAliases.some((alias) => alias.includes(query) || query.includes(alias)) ||
      tokens.some((token) => normalizedAliases.some((alias) => alias.includes(token)))
    ) {
      hits.add(concept);
    }
  });

  return hits;
}

export function rankProcesses(locale: string, rawQuery: string, selectedAuthorityId?: string | null): SearchOutcome {
  const query = normalizeSearchText(rawQuery);
  const tokens = tokenize(rawQuery);

  if (!query) {
    const baseResults = processProcedures
      .filter((procedure) => !selectedAuthorityId || procedure.authorityIds.includes(selectedAuthorityId))
      .map((procedure) => ({
        procedure,
        authorityIds: procedure.authorityIds,
        score: 0,
        matchReasons: []
      }));

    const authorityResults = processAuthorities
      .filter((authority) => !selectedAuthorityId || authority.id === selectedAuthorityId)
      .map((authority) => ({ authority, score: 0 }));

    return { results: baseResults, authorities: authorityResults, bestMatch: null, hasSemanticInterpretation: false };
  }

  const conceptMatches = getConceptMatches(query, tokens);
  const results = processProcedures
    .filter((procedure) => !selectedAuthorityId || procedure.authorityIds.includes(selectedAuthorityId))
    .map((procedure) => {
      const profile = procedureProfiles.find((entry) => entry.procedureId === procedure.id);
      const baseTexts = buildProcedureText(locale, procedure);
      const aliasTexts = (profile?.aliases ?? []).map(normalizeSearchText);
      let score = scoreTextCollection(query, tokens, baseTexts) + scoreTextCollection(query, tokens, aliasTexts);
      const matchReasons: string[] = [];

      if (scoreTextCollection(query, tokens, aliasTexts) > 0) {
        matchReasons.push("semantic");
      }

      if (profile) {
        const conceptHits = profile.concepts.filter((concept) => conceptMatches.has(concept));
        if (conceptHits.length) {
          score += conceptHits.length * 7;
          matchReasons.push("concept");
        }
      }

      if (selectedAuthorityId && procedure.authorityIds.includes(selectedAuthorityId)) {
        score += 3;
      }

      return {
        procedure,
        authorityIds: procedure.authorityIds,
        score,
        matchReasons
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const authorities = processAuthorities
    .map((authority) => {
      const profile = authorityProfiles.find((entry) => entry.authorityId === authority.id);
      const baseTexts = buildAuthorityText(locale, authority);
      const aliasTexts = (profile?.aliases ?? []).map(normalizeSearchText);
      const procedureBoost = results
        .filter((result) => result.authorityIds.includes(authority.id))
        .reduce((sum, result) => sum + Math.min(result.score, 10), 0);

      return {
        authority,
        score: scoreTextCollection(query, tokens, baseTexts) + scoreTextCollection(query, tokens, aliasTexts) + procedureBoost
      };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  const bestMatch = results[0] && (results[0].score >= 16 || (results[1] ? results[0].score - results[1].score >= 6 : results[0].score >= 10))
    ? results[0]
    : null;

  return {
    results,
    authorities,
    bestMatch,
    hasSemanticInterpretation: conceptMatches.size > 0 || results.some((entry) => entry.matchReasons.length > 0)
  };
}
