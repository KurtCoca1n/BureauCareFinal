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
      "写械薪褜谐懈 薪邪 卸懈蟹薪褜",
      "写芯锌芯屑芯谐邪 薪邪 卸懈褌褌褟",
      "賲毓賵賳丞 賲毓賷卮丞",
      "讴賲讴 賴夭蹖賳賴 夭賳丿诏蹖",
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
      "写芯锌芯屑芯谐邪 薪邪 卸懈褌谢芯",
      "写芯锌芯屑芯谐邪 薪邪 芯褉械薪写褍",
      "锌芯屑芯褖褜 褋 卸懈谢褜械屑",
      "賲爻丕毓丿丞 丕賱丕賷噩丕乇",
      "賲爻丕毓丿丞 丕賱爻賰賳",
      "讴賲讴 丕噩丕乇賴",
      "讴賲讴 賲爻讴賳",
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
      "i艧siz",
      "褉芯斜芯褌邪 胁褌褉邪褔械薪邪",
      "斜械蟹褉芯斜褨褌褌褟",
      "亘胤丕賱丞",
      "亘蹖讴丕乇",
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
      "莽ocuk paras谋",
      "写懈褌褟褔褨 胁懈锌谢邪褌懈",
      "写械薪褜谐懈 薪邪 褉械斜械薪泻邪",
      "丕毓丕賳丞 胤賮賱",
      "讴賲讴 賴夭蹖賳賴 賮乇夭賳丿",
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
      "薪邪谢芯谐芯胁邪褟 写械泻谢邪褉邪褑懈褟",
      "锌芯写邪褌泻芯胁邪 写械泻谢邪褉邪褑褨褟",
      "丕賯乇丕乇 囟乇賷亘賷",
      "丕馗賴丕乇賳丕賲賴 賲丕賱蹖丕鬲蹖",
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
      "褉械褦褋褌褉邪褑褨褟 邪写褉械褋懈",
      "褋屑械薪邪 邪写褉械褋邪 褉械谐懈褋褌褉邪褑懈褟",
      "鬲爻噩賷賱 毓賳賵丕賳 噩丿賷丿",
      "孬亘鬲 丌丿乇爻 噩丿蹖丿",
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
      "锌芯褋胁褨写泻邪",
      "胁褨蟹邪",
      "胁懈写 薪邪 卸懈褌械谢褜褋褌胁芯",
      "丕賯丕賲丞",
      "鬲兀卮賷乇丞",
      "賵蹖夭丕蹖",
      "丕賯丕賲鬲",
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
      "sa臒l谋k sigortas谋",
      "saglik sigortasi",
      "屑械写懈褔薪械 褋褌褉邪褏褍胁邪薪薪褟",
      "屑械写褋褌褉邪褏芯胁泻邪",
      "鬲兀賲賷賳 氐丨賷",
      "亘蹖賲賴 丿乇賲丕賳蹖",
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
      "ö臒renci yard谋m谋",
      "写芯锌芯屑芯谐邪 薪邪 薪邪胁褔邪薪薪褟",
      "褋褌褍写械薪褔械褋泻邪褟 锌芯屑芯褖褜",
      "賲賳丨丞 丿乇丕爻丞",
      "讴賲讴 賴夭蹖賳賴 鬲丨氐蹖賱",
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
      "i艧 kurma",
      "褉械褦褋褌褉邪褑褨褟 斜褨蟹薪械褋褍",
      "褋邪屑芯蟹邪泄薪褟褌褨褋褌褜",
      "鬲爻噩賷賱 賳卮丕胤 鬲噩丕乇賷",
      "孬亘鬲 讴爻亘 賵 讴丕乇",
      "creer entreprise",
      "aprire partita iva"
    ]
  }
];

const authorityProfiles: AuthoritySearchProfile[] = [
  { authorityId: "jobcenter", aliases: ["jobcenter", "basic support office", "centro de empleo", "賲乇賰夭 丕賱毓賲賱", "賲乇讴夭 讴丕乇"] },
  { authorityId: "agentur", aliases: ["arbeitsagentur", "employment agency", "agencia de empleo", "賵賰丕賱丞 丕賱毓賲賱", "ajans"] },
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
    "写芯锌芯屑芯谐邪 薪邪 卸懈褌褌褟",
    "賲毓賷卮丞",
    "夭賳丿诏蹖"
  ],
  survival_money: ["bills", "food money", "essen bezahlen", "leben bezahlen", "para comer"],
  housing_support: [
    "wohnungshilfe",
    "wohnhilfe",
    "housing benefit",
    "help with rent",
    "ayuda vivienda",
    "kira yardimi",
    "写芯锌芯屑芯谐邪 薪邪 卸懈褌谢芯",
    "賲爻丕毓丿丞 丕賱爻賰賳",
    "讴賲讴 賲爻讴賳",
    "aide logement",
    "aiuto casa"
  ],
  housing_costs: ["miete", "rent", "alquiler", "kira", "芯褉械薪写邪", "卸懈谢褜械", "廿賷噩丕乇", "丕噩丕乇賴", "loyer", "affitto"],
  rent_support: ["rent support", "hilfe bei miete", "money for rent", "housing allowance", "alquiler ayuda"],
  children_support: ["kind geld", "kindergeld", "child benefit", "money for children", "ayuda hijos", "莽ocuk paras谋"],
  family_support: ["family support", "familie hilfe", "familia ayuda", "aile yardimi", "褉芯写懈薪邪 写芯锌芯屑芯谐邪"],
  visa_residence: ["visum", "visa", "residence permit", "aufenthalt", "permiso residencia", "oturum", "胁褨蟹邪", "丕賯丕賲丞", "丕賯丕賲鬲"],
  foreigner: ["auslander", "ausländer", "foreign", "foreigner", "extranjero", "yabanci", "褨薪芯蟹械屑械褑褜", "丕噩賳亘賷", "丕鬲亘丕毓 禺丕乇噩蹖"],
  immigration: ["immigration", "migracion", "goc", "屑褨谐褉邪褑褨褟", "賴噩乇丞", "賲賴丕噩乇鬲"],
  address_registration: ["ummelden", "anmeldung", "register address", "new address", "empadronamiento", "adres kaydi", "褉械褦褋褌褉邪褑褨褟 邪写褉械褋懈"],
  move: ["move", "moving", "umzug", "mudanza", "tasinmak", "锌械褉械褩蟹写", "賳賯賱 毓賳賵丕賳", "丕爻亘丕亘 讴卮蹖"],
  job_loss: ["arbeitslos", "unemployed", "job loss", "sin trabajo", "issiz", "斜械蟹褉芯斜褨褌褌褟", "亘胤丕賱丞", "亘蹖讴丕乇"],
  employment_support: ["agentur", "employment", "arbeit suchen", "busco trabajo", "i艧 bulma", "锌芯褕褍泻 褉芯斜芯褌懈"],
  student_funding: ["bafoeg", "student aid", "study support", "beca", "ogrenci yardimi", "褋褌褍写械薪褌褋褜泻邪 写芯锌芯屑芯谐邪"],
  education_support: ["study", "studium", "universidad", "universite", "薪邪胁褔邪薪薪褟", "丿乇丕爻丞", "鬲丨氐蹖賱"],
  taxes: ["steuer", "tax", "impuestos", "vergi", "锌芯写邪褌芯泻", "囟乇賷亘丞", "賲丕賱蹖丕鬲"],
  health_insurance: ["krankenkasse", "health insurance", "medical insurance", "seguro medico", "sigorta", "褋褌褉邪褏褍胁邪薪薪褟", "鬲兀賲賷賳 氐丨賷", "亘蹖賲賴 丿乇賲丕賳蹖"],
  business_registration: ["gewerbe", "register business", "start business", "autonomo", "isyeri", "斜褨蟹薪械褋", "賳卮丕胤 鬲噩丕乇賷", "讴爻亘 賵 讴丕乇"],
  self_employment: ["selbststandig", "self employed", "freelance", "autonomo", "serbest", "褋邪屑芯蟹邪泄薪褟褌褨褋褌褜"]
};

function normalizeSearchText(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
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

