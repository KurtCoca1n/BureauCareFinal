import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

type LocalizedText = Partial<Record<SupportedLanguage, string>>;

export type ProcessAuthority = {
  id: string;
  icon: "briefcase" | "search" | "heart" | "calculator" | "building" | "globe" | "shield" | "graduation";
  tint: string;
  label: LocalizedText;
  description: LocalizedText;
  keywords: string[];
};

export type ProcessProcedure = {
  id: string;
  authorityIds: string[];
  title: LocalizedText;
  subtitle: LocalizedText;
  keywords: string[];
  availability: "online" | "hybrid" | "in_person";
};

type ProcessesCopy = {
  title: string;
  intro: string;
  searchPlaceholder: string;
  searchCaption: string;
  searchActiveHint: string;
  authoritySectionTitle: string;
  authoritySectionHint: string;
  allAuthorities: string;
  proceduresTitle: string;
  proceduresTitleAll: string;
  selectedAuthorityLabel: string;
  sampleCountLabel: string;
  semanticTitle: string;
  semanticHint: string;
  bestMatchLabel: string;
  bestMatchText: string;
  alternativeMatchesLabel: string;
  authorityLabel: string;
  emptySearchTitle: string;
  emptySearchText: string;
  openPlaceholder: string;
  comingSoon: string;
  chipOnline: string;
  chipHybrid: string;
  chipInPerson: string;
};

function t(locale: SupportedLanguage, value: LocalizedText) {
  return value[locale] ?? value.en ?? value.de ?? "";
}

export const processAuthorities: ProcessAuthority[] = [
  {
    id: "jobcenter",
    icon: "briefcase",
    tint: "from-[#8fb8d8] to-[#648fb3]",
    label: {
      de: "Jobcenter",
      en: "Jobcenter",
      tr: "Jobcenter",
      uk: "Jobcenter",
      es: "Jobcenter"
    },
    description: {
      de: "Leistungen, Nachweise und Termine rund um Bürgergeld",
      en: "Benefits, proofs and appointments around basic income support",
      tr: "Vatanda艧l谋k geliri, belgeler ve randevular",
      uk: "袙懈锌谢邪褌懈, 写芯胁褨写泻懈 褌邪 蟹邪锌懈褋懈 褖芯写芯 斜邪蟹芯胁芯褩 写芯锌芯屑芯谐懈",
      es: "Prestaciones, justificantes y citas sobre ayuda b谩sica"
    },
    keywords: ["bürgergeld", "jobcenter", "leistung", "bewilligung"]
  },
  {
    id: "agentur",
    icon: "search",
    tint: "from-[#9ad0c7] to-[#5fa3a3]",
    label: {
      de: "Arbeitsagentur",
      en: "Employment agency",
      tr: "陌艧 ajans谋",
      uk: "袗谐械薪褌褋褌胁芯 蟹邪泄薪褟褌芯褋褌褨",
      es: "Agencia de empleo"
    },
    description: {
      de: "Arbeitslosmeldung, Förderung und Berufswege",
      en: "Unemployment registration, support and career paths",
      tr: "陌艧sizlik kayd谋, destek ve kariyer yollar谋",
      uk: "袪械褦褋褌褉邪褑褨褟 斜械蟹褉芯斜褨褌褌褟, 锌褨写褌褉懈屑泻邪 泄 泻邪褉鈥櫻斞€薪懈泄 褕谢褟褏",
      es: "Registro de desempleo, ayudas y trayectoria laboral"
    },
    keywords: ["arbeitslos", "agentur", "alg", "vermittlung"]
  },
  {
    id: "familienkasse",
    icon: "heart",
    tint: "from-[#f2c38a] to-[#ef9f65]",
    label: {
      de: "Familienkasse",
      en: "Family benefits office",
      tr: "Aile kasas谋",
      uk: "小褨屑械泄薪邪 泻邪褋邪",
      es: "Caja familiar"
    },
    description: {
      de: "Kindergeld und Unterstützung für Familien",
      en: "Child benefit and support for families",
      tr: "脟ocuk paras谋 ve aile deste臒i",
      uk: "袛懈褌褟褔褨 胁懈锌谢邪褌懈 泄 锌褨写褌褉懈屑泻邪 写谢褟 褉芯写懈薪",
      es: "Prestaci贸n por hijos y apoyo para familias"
    },
    keywords: ["kindergeld", "familie", "kinderzuschlag"]
  },
  {
    id: "finanzamt",
    icon: "calculator",
    tint: "from-[#d2b4dd] to-[#9d81c4]",
    label: {
      de: "Finanzamt",
      en: "Tax office",
      tr: "Vergi dairesi",
      uk: "袩芯写邪褌泻芯胁邪",
      es: "Hacienda"
    },
    description: {
      de: "Steuern, Bescheide und Erstattungen",
      en: "Taxes, notices and refunds",
      tr: "Vergiler, bildirimler ve iadeler",
      uk: "袩芯写邪褌泻懈, 锌芯胁褨写芯屑谢械薪薪褟 褌邪 锌芯胁械褉薪械薪薪褟",
      es: "Impuestos, notificaciones y devoluciones"
    },
    keywords: ["steuer", "finanzamt", "steuererklärung", "bescheid"]
  },
  {
    id: "buergeramt",
    icon: "building",
    tint: "from-[#cdd6a4] to-[#92a163]",
    label: {
      de: "Bürgeramt",
      en: "Citizen office",
      tr: "Vatanda艧l谋k ofisi",
      uk: "笑袧袗袩 / Bürgeramt",
      es: "Oficina ciudadana"
    },
    description: {
      de: "Anmeldung, Ummeldung und Meldeangelegenheiten",
      en: "Registration, change of address and local records",
      tr: "Kay谋t, adres de臒i艧ikli臒i ve ikamet i艧leri",
      uk: "袪械褦褋褌褉邪褑褨褟, 蟹屑褨薪邪 邪写褉械褋懈 褌邪 写芯胁褨写泻懈",
      es: "Empadronamiento, cambio de domicilio y tr谩mites locales"
    },
    keywords: ["ummelden", "anmelden", "wohnsitz", "bürgeramt"]
  },
  {
    id: "auslaenderbehoerde",
    icon: "globe",
    tint: "from-[#8db4e3] to-[#5475b4]",
    label: {
      de: "Ausländerbehörde",
      en: "Immigration office",
      tr: "Yabanc谋lar dairesi",
      uk: "袦褨谐褉邪褑褨泄薪邪 褋谢褍卸斜邪",
      es: "Oficina de extranjer铆a"
    },
    description: {
      de: "Aufenthalt, Verlängerung und Visum",
      en: "Residence permits, renewals and visas",
      tr: "Oturum, uzatma ve vize",
      uk: "袩芯褋胁褨写泻邪, 锌褉芯写芯胁卸械薪薪褟 褌邪 胁褨蟹邪",
      es: "Residencia, pr贸rrogas y visado"
    },
    keywords: ["aufenthalt", "visum", "fiktionsbescheinigung", "ausländerbehörde"]
  },
  {
    id: "krankenkasse",
    icon: "shield",
    tint: "from-[#9cc9c0] to-[#4a9388]",
    label: {
      de: "Krankenkasse",
      en: "Health insurance",
      tr: "Sa臒l谋k sigortas谋",
      uk: "袦械写懈褔薪械 褋褌褉邪褏褍胁邪薪薪褟",
      es: "Seguro m茅dico"
    },
    description: {
      de: "Mitgliedschaft, Nachweise und Leistungen",
      en: "Membership, proofs and benefits",
      tr: "Üyelik, belgeler ve haklar",
      uk: "效谢械薪褋褌胁芯, 写芯胁褨写泻懈 褌邪 锌芯褋谢褍谐懈",
      es: "Afiliaci贸n, justificantes y prestaciones"
    },
    keywords: ["krankenkasse", "versicherung", "mitgliedschaft"]
  },
  {
    id: "bafoeg",
    icon: "graduation",
    tint: "from-[#f2d1a2] to-[#d59e68]",
    label: {
      de: "Studium / BAföG",
      en: "Studies / student aid",
      tr: "Üniversite / BAföG",
      uk: "袧邪胁褔邪薪薪褟 / BAföG",
      es: "Estudios / BAföG"
    },
    description: {
      de: "Förderung für Ausbildung und Studium",
      en: "Funding for education and studies",
      tr: "E臒itim ve üniversite deste臒i",
      uk: "袩褨写褌褉懈屑泻邪 写谢褟 芯褋胁褨褌懈 褌邪 薪邪胁褔邪薪薪褟",
      es: "Financiaci贸n para estudios y formaci贸n"
    },
    keywords: ["bafög", "studium", "förderung", "ausbildung"]
  }
];

export const processProcedures: ProcessProcedure[] = [
  {
    id: "buergergeld",
    authorityIds: ["jobcenter"],
    title: { de: "Bürgergeld beantragen", en: "Apply for basic income support", tr: "Bürgergeld ba艧vurusu", uk: "袩芯写邪褌懈 蟹邪褟胁褍 薪邪 Bürgergeld", es: "Solicitar Bürgergeld" },
    subtitle: { de: "Grundsicherung und laufende Leistungen", en: "Basic support and ongoing benefits", tr: "Temel destek ve devam eden ödemeler", uk: "袘邪蟹芯胁邪 锌褨写褌褉懈屑泻邪 褌邪 褉械谐褍谢褟褉薪褨 胁懈锌谢邪褌懈", es: "Ayuda b谩sica y prestaciones continuas" },
    keywords: ["bürgergeld", "jobcenter", "antrag"],
    availability: "hybrid"
  },
  {
    id: "arbeitslosmeldung",
    authorityIds: ["agentur"],
    title: { de: "Arbeitslos melden", en: "Register as unemployed", tr: "陌艧siz olarak kay谋t ol", uk: "小褌邪褌懈 薪邪 芯斜谢褨泻 褟泻 斜械蟹褉芯斜褨褌薪懈泄", es: "Inscribirse como desempleado" },
    subtitle: { de: "Fristen vor dem ersten Leistungsbezug", en: "Deadlines before receiving benefits", tr: "陌lk ödeme öncesi süreler", uk: "小褌褉芯泻懈 写芯 锌械褉褕芯褩 胁懈锌谢邪褌懈", es: "Plazos antes de recibir la ayuda" },
    keywords: ["arbeitslos", "agentur", "meldung"],
    availability: "online"
  },
  {
    id: "kindergeld",
    authorityIds: ["familienkasse"],
    title: { de: "Kindergeld beantragen", en: "Apply for child benefit", tr: "脟ocuk paras谋 ba艧vurusu", uk: "袩芯写邪褌懈 蟹邪褟胁褍 薪邪 写懈褌褟褔褨 胁懈锌谢邪褌懈", es: "Solicitar prestaci贸n por hijos" },
    subtitle: { de: "Für Kinder und junge Erwachsene in Ausbildung", en: "For children and young adults in education", tr: "脟ocuklar ve e臒itimdeki gen莽ler i莽in", uk: "袛谢褟 写褨褌械泄 褌邪 屑芯谢芯写褨 薪邪 薪邪胁褔邪薪薪褨", es: "Para hijos y j贸venes en formaci贸n" },
    keywords: ["kindergeld", "familienkasse", "kinder"],
    availability: "hybrid"
  },
  {
    id: "wohngeld",
    authorityIds: ["jobcenter", "buergeramt"],
    title: { de: "Wohngeld beantragen", en: "Apply for housing benefit", tr: "Konut yard谋m谋 ba艧vurusu", uk: "袩芯写邪褌懈 蟹邪褟胁褍 薪邪 卸懈褌谢芯胁褍 写芯锌芯屑芯谐褍", es: "Solicitar ayuda de vivienda" },
    subtitle: { de: "Unterstützung bei Miete oder Eigentum", en: "Support with rent or owned housing", tr: "Kira veya konut i莽in destek", uk: "袩褨写褌褉懈屑泻邪 写谢褟 芯褉械薪写懈 褔懈 卸懈褌谢邪", es: "Apoyo para alquiler o vivienda" },
    keywords: ["wohngeld", "miete", "wohnung"],
    availability: "hybrid"
  },
  {
    id: "steuererklaerung",
    authorityIds: ["finanzamt"],
    title: { de: "Steuererklärung vorbereiten", en: "Prepare a tax return", tr: "Vergi beyan谋 haz谋rla", uk: "袩褨写谐芯褌褍胁邪褌懈 锌芯写邪褌泻芯胁褍 写械泻谢邪褉邪褑褨褞", es: "Preparar la declaraci贸n de impuestos" },
    subtitle: { de: "Bescheide prüfen und Unterlagen sammeln", en: "Check notices and collect documents", tr: "Bildirimleri kontrol et ve belgeleri topla", uk: "袩械褉械胁褨褉懈褌懈 锌芯胁褨写芯屑谢械薪薪褟 泄 蟹褨斜褉邪褌懈 写芯泻褍屑械薪褌懈", es: "Revisar notificaciones y reunir documentos" },
    keywords: ["steuer", "finanzamt", "erklärung"],
    availability: "online"
  },
  {
    id: "ummeldung",
    authorityIds: ["buergeramt"],
    title: { de: "Ummelden", en: "Change your address registration", tr: "Adresini güncelle", uk: "袟屑褨薪懈褌懈 褉械褦褋褌褉邪褑褨褞 邪写褉械褋懈", es: "Cambiar el empadronamiento" },
    subtitle: { de: "Neue Adresse beim Bürgeramt eintragen", en: "Register a new address", tr: "Yeni adresi resmi kayda ge莽ir", uk: "袟邪褉械褦褋褌褉褍胁邪褌懈 薪芯胁褍 邪写褉械褋褍", es: "Registrar la nueva direcci贸n" },
    keywords: ["ummelden", "adresse", "wohnung"],
    availability: "in_person"
  },
  {
    id: "visum",
    authorityIds: ["auslaenderbehoerde"],
    title: { de: "Visum oder Aufenthalt beantragen", en: "Apply for a visa or residence permit", tr: "Vize veya oturum ba艧vurusu", uk: "袩芯写邪褌懈 蟹邪褟胁褍 薪邪 胁褨蟹褍 邪斜芯 锌芯褋胁褨写泻褍", es: "Solicitar visado o permiso de residencia" },
    subtitle: { de: "Früh Unterlagen und Termine vorbereiten", en: "Prepare documents and appointments early", tr: "Belgeleri ve randevular谋 erken haz谋rla", uk: "袟邪蟹写邪谢械谐褨写褜 锌褨写谐芯褌褍胁邪褌懈 写芯泻褍屑械薪褌懈 褌邪 蟹邪锌懈褋", es: "Preparar pronto documentos y citas" },
    keywords: ["visum", "aufenthalt", "ausländerbehörde"],
    availability: "hybrid"
  },
  {
    id: "krankenkasse-wechsel",
    authorityIds: ["krankenkasse"],
    title: { de: "Krankenkasse anmelden oder wechseln", en: "Join or switch health insurance", tr: "Sa臒l谋k sigortas谋na kay谋t ol veya de臒i艧tir", uk: "袨褎芯褉屑懈褌懈 邪斜芯 蟹屑褨薪懈褌懈 屑械写懈褔薪械 褋褌褉邪褏褍胁邪薪薪褟", es: "Darse de alta o cambiar de seguro m茅dico" },
    subtitle: { de: "Mitgliedschaft und Nachweise ordnen", en: "Organize membership and proof", tr: "Üyelik ve belgeleri düzenle", uk: "袨褎芯褉屑懈褌懈 褔谢械薪褋褌胁芯 泄 写芯胁褨写泻懈", es: "Organizar afiliaci贸n y justificantes" },
    keywords: ["krankenkasse", "versicherung", "wechsel"],
    availability: "online"
  },
  {
    id: "bafoeg-antrag",
    authorityIds: ["bafoeg"],
    title: { de: "BAföG beantragen", en: "Apply for student aid", tr: "BAföG ba艧vurusu", uk: "袩芯写邪褌懈 蟹邪褟胁褍 薪邪 BAföG", es: "Solicitar BAföG" },
    subtitle: { de: "Finanzierung für Studium oder Ausbildung", en: "Funding for studies or training", tr: "Üniversite veya e臒itim i莽in finansman", uk: "肖褨薪邪薪褋褍胁邪薪薪褟 薪邪胁褔邪薪薪褟 褔懈 芯褋胁褨褌懈", es: "Financiaci贸n para estudios o formaci贸n" },
    keywords: ["bafög", "studium", "förderung"],
    availability: "hybrid"
  },
  {
    id: "gewerbe",
    authorityIds: ["buergeramt", "finanzamt"],
    title: { de: "Gewerbe anmelden", en: "Register a business", tr: "陌艧letme kayd谋 yap", uk: "袟邪褉械褦褋褌褉褍胁邪褌懈 锌褨写锌褉懈褦屑薪懈褑褜泻褍 写褨褟谢褜薪褨褋褌褜", es: "Registrar una actividad comercial" },
    subtitle: { de: "Start in die Selbstständigkeit vorbereiten", en: "Prepare your start into self-employment", tr: "Serbest 莽al谋艧maya ba艧lang谋c谋 haz谋rla", uk: "袩褨写谐芯褌褍胁邪褌懈 褋褌邪褉褌 褋邪屑芯蟹邪泄薪褟褌芯褋褌褨", es: "Preparar el inicio como aut贸nomo" },
    keywords: ["gewerbe", "selbstständig", "anmelden"],
    availability: "hybrid"
  }
];

const copyMap: Partial<Record<SupportedLanguage, ProcessesCopy>> = {
  de: {
    title: "Anträge & Vorgänge",
    intro: "Geführte Wege durch die wichtigsten Behörden-Themen.",
    searchPlaceholder: "Was möchtest du erledigen?",
    searchCaption: "Suche nach Anträgen, Behörden oder typischen Anliegen.",
    searchActiveHint: "BureauCare deutet dein Anliegen und ordnet passende Vorgänge.",
    authoritySectionTitle: "Bereiche",
    authoritySectionHint: "Wähle eine Behörde oder scanne alle Themen.",
    allAuthorities: "Alle Bereiche",
    proceduresTitle: "Beispiel-Vorgänge",
    proceduresTitleAll: "Beliebte Vorgänge",
    selectedAuthorityLabel: "Aktiver Bereich",
    sampleCountLabel: "Beispiele",
    semanticTitle: "Passende Vorschläge",
    semanticHint: "Alltagssprache, ungenaue Begriffe und mehrere Sprachen werden mitgedacht.",
    bestMatchLabel: "Passt wahrscheinlich am besten",
    bestMatchText: "Das könnte der richtige Vorgang für dich sein.",
    alternativeMatchesLabel: "Weitere plausible Treffer",
    authorityLabel: "Zuständig",
    emptySearchTitle: "Noch kein passender Vorgang dabei",
    emptySearchText: "Versuche einen anderen Begriff oder wähle einen Bereich aus.",
    openPlaceholder: "Vorgang öffnen",
    comingSoon: "Mehr Führung folgt in den nächsten Schritten.",
    chipOnline: "Online möglich",
    chipHybrid: "Online oder vor Ort",
    chipInPerson: "Vor Ort"
  },
  en: {
    title: "Applications & processes",
    intro: "Guided paths through important public-office topics.",
    searchPlaceholder: "What would you like to get done?",
    searchCaption: "Search for applications, offices or common requests.",
    searchActiveHint: "BureauCare interprets your request and suggests matching processes.",
    authoritySectionTitle: "Areas",
    authoritySectionHint: "Choose an office or scan all topics.",
    allAuthorities: "All areas",
    proceduresTitle: "Example processes",
    proceduresTitleAll: "Popular processes",
    selectedAuthorityLabel: "Active area",
    sampleCountLabel: "Examples",
    semanticTitle: "Recommended matches",
    semanticHint: "Everyday wording, rough descriptions and multiple languages are taken into account.",
    bestMatchLabel: "Probably the best fit",
    bestMatchText: "This could be the right process for you.",
    alternativeMatchesLabel: "Other plausible matches",
    authorityLabel: "Responsible",
    emptySearchTitle: "No matching process yet",
    emptySearchText: "Try another term or choose an area.",
    openPlaceholder: "Open process",
    comingSoon: "Deeper guidance will follow in the next steps.",
    chipOnline: "Possible online",
    chipHybrid: "Online or in person",
    chipInPerson: "In person"
  },
  tr: {
    title: "Ba艧vurular",
    intro: "Önemli resmi i艧lemler i莽in rehberli ba艧lang谋莽 noktas谋.",
    searchPlaceholder: "Ne yapmak istiyorsun?",
    searchCaption: "Ba艧vuru, kurum veya tipik i艧lem ara.",
    searchActiveHint: "BureauCare iste臒ini yorumlar ve uygun i艧lemleri önerir.",
    authoritySectionTitle: "Alanlar",
    authoritySectionHint: "Bir kurum se莽 ya da tüm konulara göz at.",
    allAuthorities: "Tüm alanlar",
    proceduresTitle: "Örnek i艧lemler",
    proceduresTitleAll: "Popüler i艧lemler",
    selectedAuthorityLabel: "Aktif alan",
    sampleCountLabel: "Örnekler",
    semanticTitle: "Önerilen e艧le艧meler",
    semanticHint: "Günlük dil, belirsiz ifadeler ve farkl谋 diller hesaba kat谋l谋r.",
    bestMatchLabel: "En uygun se莽enek olabilir",
    bestMatchText: "Bu i艧lem senin i莽in en do臒ru se莽enek olabilir.",
    alternativeMatchesLabel: "Di臒er olas谋 e艧le艧meler",
    authorityLabel: "Kurum",
    emptySearchTitle: "Uygun i艧lem bulunamad谋",
    emptySearchText: "Ba艧ka bir ifade dene veya bir alan se莽.",
    openPlaceholder: "陌艧lemi a莽",
    comingSoon: "Daha ayr谋nt谋l谋 yönlendirme sonraki ad谋mlarda gelecek.",
    chipOnline: "Online mümkün",
    chipHybrid: "Online veya yerinde",
    chipInPerson: "Yerinde"
  },
  uk: {
    title: "袟邪褟胁懈 泄 锌褉芯褑械褋懈",
    intro: "袟褉褍褔薪懈泄 褋褌邪褉褌 写谢褟 薪邪泄胁邪卸谢懈胁褨褕懈褏 斜褞褉芯泻褉邪褌懈褔薪懈褏 褌械屑.",
    searchPlaceholder: "些芯 胁懈 褏芯褔械褌械 蟹褉芯斜懈褌懈?",
    searchCaption: "楔褍泻邪泄褌械 蟹邪褟胁懈, 褍褋褌邪薪芯胁懈 邪斜芯 褌懈锌芯胁褨 褋锌褉邪胁懈.",
    searchActiveHint: "BureauCare 褨薪褌械褉锌褉械褌褍褦 蟹邪锌懈褌 褨 锌褉芯锌芯薪褍褦 胁褨写锌芯胁褨写薪褨 锌褉芯褑械褋懈.",
    authoritySectionTitle: "袧邪锌褉褟屑懈",
    authoritySectionHint: "袨斜械褉褨褌褜 褍褋褌邪薪芯胁褍 邪斜芯 锌械褉械谐谢褟薪褜褌械 胁褋褨 褌械屑懈.",
    allAuthorities: "校褋褨 薪邪锌褉褟屑懈",
    proceduresTitle: "袩褉懈泻谢邪写懈 锌褉芯褑械褋褨胁",
    proceduresTitleAll: "袩芯锌褍谢褟褉薪褨 锌褉芯褑械褋懈",
    selectedAuthorityLabel: "袗泻褌懈胁薪懈泄 薪邪锌褉褟屑",
    sampleCountLabel: "袩褉懈泻谢邪写懈",
    semanticTitle: "袪械泻芯屑械薪写芯胁邪薪褨 蟹斜褨谐懈",
    semanticHint: "校褉邪褏芯胁褍褞褌褜褋褟 锌芯胁褋褟泻写械薪薪褨 褎芯褉屑褍谢褞胁邪薪薪褟, 薪械褌芯褔薪褨 芯锌懈褋懈 褌邪 泻褨谢褜泻邪 屑芯胁.",
    bestMatchLabel: "袧邪泄褨屑芯胁褨褉薪褨褕械 锌褨写褏芯写懈褌褜",
    bestMatchText: "小褏芯卸械, 褑械 屑芯卸械 斜褍褌懈 锌褉邪胁懈谢褜薪懈泄 锌褉芯褑械褋 写谢褟 胁邪褋.",
    alternativeMatchesLabel: "袉薪褕褨 屑芯卸谢懈胁褨 蟹斜褨谐懈",
    authorityLabel: "校褋褌邪薪芯胁邪",
    emptySearchTitle: "袩芯泻懈 褖芯 薪褨褔芯谐芯 薪械 蟹薪邪泄写械薪芯",
    emptySearchText: "小锌褉芯斜褍泄褌械 褨薪褕懈泄 蟹邪锌懈褌 邪斜芯 胁懈斜械褉褨褌褜 薪邪锌褉褟屑.",
    openPlaceholder: "袙褨写泻褉懈褌懈 锌褉芯褑械褋",
    comingSoon: "袛械褌邪谢褜薪褨褕褨 锌褨写泻邪蟹泻懈 蟹鈥櫻徯残谎徰傃屟佈?胁 薪邪褋褌褍锌薪懈褏 泻褉芯泻邪褏.",
    chipOnline: "袦芯卸薪邪 芯薪谢邪泄薪",
    chipHybrid: "袨薪谢邪泄薪 邪斜芯 芯褋芯斜懈褋褌芯",
    chipInPerson: "袨褋芯斜懈褋褌芯"
  },
  es: {
    title: "Tr谩mites y gestiones",
    intro: "Una entrada guiada a los temas burocr谩ticos m谩s importantes.",
    searchPlaceholder: "驴Qu茅 quieres resolver?",
    searchCaption: "Busca tr谩mites, organismos o solicitudes habituales.",
    searchActiveHint: "BureauCare interpreta tu necesidad y propone los tr谩mites m谩s cercanos.",
    authoritySectionTitle: "脕reas",
    authoritySectionHint: "Elige una oficina o explora todos los temas.",
    allAuthorities: "Todas las 谩reas",
    proceduresTitle: "Procesos de ejemplo",
    proceduresTitleAll: "Procesos frecuentes",
    selectedAuthorityLabel: "脕rea activa",
    sampleCountLabel: "Ejemplos",
    semanticTitle: "Sugerencias recomendadas",
    semanticHint: "Se tienen en cuenta lenguaje cotidiano, t茅rminos imprecisos y varios idiomas.",
    bestMatchLabel: "Probablemente encaja mejor",
    bestMatchText: "Este podr铆a ser el tr谩mite adecuado para ti.",
    alternativeMatchesLabel: "Otras coincidencias plausibles",
    authorityLabel: "Responsable",
    emptySearchTitle: "A煤n no hay un proceso adecuado",
    emptySearchText: "Prueba otro t茅rmino o elige un 谩rea.",
    openPlaceholder: "Abrir proceso",
    comingSoon: "La gu铆a m谩s profunda llegar谩 en los siguientes pasos.",
    chipOnline: "Posible en l铆nea",
    chipHybrid: "En l铆nea o presencial",
    chipInPerson: "Presencial"
  }
};

const fallbackProcessesCopy = copyMap.en ?? copyMap.de!;

export function getProcessesCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)] ?? fallbackProcessesCopy;
}

export function getAuthorityLabel(authority: ProcessAuthority, locale: string | null | undefined) {
  return t(normalizePreferredLanguage(locale), authority.label);
}

export function getAuthorityDescription(authority: ProcessAuthority, locale: string | null | undefined) {
  return t(normalizePreferredLanguage(locale), authority.description);
}

export function getProcedureTitle(procedure: ProcessProcedure, locale: string | null | undefined) {
  return t(normalizePreferredLanguage(locale), procedure.title);
}

export function getProcedureSubtitle(procedure: ProcessProcedure, locale: string | null | undefined) {
  return t(normalizePreferredLanguage(locale), procedure.subtitle);
}

export function getProcedureAvailabilityLabel(
  procedure: ProcessProcedure,
  locale: string | null | undefined
) {
  const copy = getProcessesCopy(locale);

  switch (procedure.availability) {
    case "online":
      return copy.chipOnline;
    case "in_person":
      return copy.chipInPerson;
    default:
      return copy.chipHybrid;
  }
}


