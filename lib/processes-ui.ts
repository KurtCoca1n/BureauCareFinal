import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

type LocalizedText = Record<SupportedLanguage, string>;

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
  return value[locale];
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
      tr: "Vatandaşlık geliri, belgeler ve randevular",
      uk: "Виплати, довідки та записи щодо базової допомоги",
      es: "Prestaciones, justificantes y citas sobre ayuda básica"
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
      tr: "İş ajansı",
      uk: "Агентство зайнятості",
      es: "Agencia de empleo"
    },
    description: {
      de: "Arbeitslosmeldung, Förderung und Berufswege",
      en: "Unemployment registration, support and career paths",
      tr: "İşsizlik kaydı, destek ve kariyer yolları",
      uk: "Реєстрація безробіття, підтримка й кар’єрний шлях",
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
      tr: "Aile kasası",
      uk: "Сімейна каса",
      es: "Caja familiar"
    },
    description: {
      de: "Kindergeld und Unterstützung für Familien",
      en: "Child benefit and support for families",
      tr: "Çocuk parası ve aile desteği",
      uk: "Дитячі виплати й підтримка для родин",
      es: "Prestación por hijos y apoyo para familias"
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
      uk: "Податкова",
      es: "Hacienda"
    },
    description: {
      de: "Steuern, Bescheide und Erstattungen",
      en: "Taxes, notices and refunds",
      tr: "Vergiler, bildirimler ve iadeler",
      uk: "Податки, повідомлення та повернення",
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
      tr: "Vatandaşlık ofisi",
      uk: "ЦНАП / Bürgeramt",
      es: "Oficina ciudadana"
    },
    description: {
      de: "Anmeldung, Ummeldung und Meldeangelegenheiten",
      en: "Registration, change of address and local records",
      tr: "Kayıt, adres değişikliği ve ikamet işleri",
      uk: "Реєстрація, зміна адреси та довідки",
      es: "Empadronamiento, cambio de domicilio y trámites locales"
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
      tr: "Yabancılar dairesi",
      uk: "Міграційна служба",
      es: "Oficina de extranjería"
    },
    description: {
      de: "Aufenthalt, Verlängerung und Visum",
      en: "Residence permits, renewals and visas",
      tr: "Oturum, uzatma ve vize",
      uk: "Посвідка, продовження та віза",
      es: "Residencia, prórrogas y visado"
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
      tr: "Sağlık sigortası",
      uk: "Медичне страхування",
      es: "Seguro médico"
    },
    description: {
      de: "Mitgliedschaft, Nachweise und Leistungen",
      en: "Membership, proofs and benefits",
      tr: "Üyelik, belgeler ve haklar",
      uk: "Членство, довідки та послуги",
      es: "Afiliación, justificantes y prestaciones"
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
      uk: "Навчання / BAföG",
      es: "Estudios / BAföG"
    },
    description: {
      de: "Förderung für Ausbildung und Studium",
      en: "Funding for education and studies",
      tr: "Eğitim ve üniversite desteği",
      uk: "Підтримка для освіти та навчання",
      es: "Financiación para estudios y formación"
    },
    keywords: ["bafög", "studium", "förderung", "ausbildung"]
  }
];

export const processProcedures: ProcessProcedure[] = [
  {
    id: "buergergeld",
    authorityIds: ["jobcenter"],
    title: { de: "Bürgergeld beantragen", en: "Apply for basic income support", tr: "Bürgergeld başvurusu", uk: "Подати заяву на Bürgergeld", es: "Solicitar Bürgergeld" },
    subtitle: { de: "Grundsicherung und laufende Leistungen", en: "Basic support and ongoing benefits", tr: "Temel destek ve devam eden ödemeler", uk: "Базова підтримка та регулярні виплати", es: "Ayuda básica y prestaciones continuas" },
    keywords: ["bürgergeld", "jobcenter", "antrag"],
    availability: "hybrid"
  },
  {
    id: "arbeitslosmeldung",
    authorityIds: ["agentur"],
    title: { de: "Arbeitslos melden", en: "Register as unemployed", tr: "İşsiz olarak kayıt ol", uk: "Стати на облік як безробітний", es: "Inscribirse como desempleado" },
    subtitle: { de: "Fristen vor dem ersten Leistungsbezug", en: "Deadlines before receiving benefits", tr: "İlk ödeme öncesi süreler", uk: "Строки до першої виплати", es: "Plazos antes de recibir la ayuda" },
    keywords: ["arbeitslos", "agentur", "meldung"],
    availability: "online"
  },
  {
    id: "kindergeld",
    authorityIds: ["familienkasse"],
    title: { de: "Kindergeld beantragen", en: "Apply for child benefit", tr: "Çocuk parası başvurusu", uk: "Подати заяву на дитячі виплати", es: "Solicitar prestación por hijos" },
    subtitle: { de: "Für Kinder und junge Erwachsene in Ausbildung", en: "For children and young adults in education", tr: "Çocuklar ve eğitimdeki gençler için", uk: "Для дітей та молоді на навчанні", es: "Para hijos y jóvenes en formación" },
    keywords: ["kindergeld", "familienkasse", "kinder"],
    availability: "hybrid"
  },
  {
    id: "wohngeld",
    authorityIds: ["jobcenter", "buergeramt"],
    title: { de: "Wohngeld beantragen", en: "Apply for housing benefit", tr: "Konut yardımı başvurusu", uk: "Подати заяву на житлову допомогу", es: "Solicitar ayuda de vivienda" },
    subtitle: { de: "Unterstützung bei Miete oder Eigentum", en: "Support with rent or owned housing", tr: "Kira veya konut için destek", uk: "Підтримка для оренди чи житла", es: "Apoyo para alquiler o vivienda" },
    keywords: ["wohngeld", "miete", "wohnung"],
    availability: "hybrid"
  },
  {
    id: "steuererklaerung",
    authorityIds: ["finanzamt"],
    title: { de: "Steuererklärung vorbereiten", en: "Prepare a tax return", tr: "Vergi beyanı hazırla", uk: "Підготувати податкову декларацію", es: "Preparar la declaración de impuestos" },
    subtitle: { de: "Bescheide prüfen und Unterlagen sammeln", en: "Check notices and collect documents", tr: "Bildirimleri kontrol et ve belgeleri topla", uk: "Перевірити повідомлення й зібрати документи", es: "Revisar notificaciones y reunir documentos" },
    keywords: ["steuer", "finanzamt", "erklärung"],
    availability: "online"
  },
  {
    id: "ummeldung",
    authorityIds: ["buergeramt"],
    title: { de: "Ummelden", en: "Change your address registration", tr: "Adresini güncelle", uk: "Змінити реєстрацію адреси", es: "Cambiar el empadronamiento" },
    subtitle: { de: "Neue Adresse beim Bürgeramt eintragen", en: "Register a new address", tr: "Yeni adresi resmi kayda geçir", uk: "Зареєструвати нову адресу", es: "Registrar la nueva dirección" },
    keywords: ["ummelden", "adresse", "wohnung"],
    availability: "in_person"
  },
  {
    id: "visum",
    authorityIds: ["auslaenderbehoerde"],
    title: { de: "Visum oder Aufenthalt beantragen", en: "Apply for a visa or residence permit", tr: "Vize veya oturum başvurusu", uk: "Подати заяву на візу або посвідку", es: "Solicitar visado o permiso de residencia" },
    subtitle: { de: "Früh Unterlagen und Termine vorbereiten", en: "Prepare documents and appointments early", tr: "Belgeleri ve randevuları erken hazırla", uk: "Заздалегідь підготувати документи та запис", es: "Preparar pronto documentos y citas" },
    keywords: ["visum", "aufenthalt", "ausländerbehörde"],
    availability: "hybrid"
  },
  {
    id: "krankenkasse-wechsel",
    authorityIds: ["krankenkasse"],
    title: { de: "Krankenkasse anmelden oder wechseln", en: "Join or switch health insurance", tr: "Sağlık sigortasına kayıt ol veya değiştir", uk: "Оформити або змінити медичне страхування", es: "Darse de alta o cambiar de seguro médico" },
    subtitle: { de: "Mitgliedschaft und Nachweise ordnen", en: "Organize membership and proof", tr: "Üyelik ve belgeleri düzenle", uk: "Оформити членство й довідки", es: "Organizar afiliación y justificantes" },
    keywords: ["krankenkasse", "versicherung", "wechsel"],
    availability: "online"
  },
  {
    id: "bafoeg-antrag",
    authorityIds: ["bafoeg"],
    title: { de: "BAföG beantragen", en: "Apply for student aid", tr: "BAföG başvurusu", uk: "Подати заяву на BAföG", es: "Solicitar BAföG" },
    subtitle: { de: "Finanzierung für Studium oder Ausbildung", en: "Funding for studies or training", tr: "Üniversite veya eğitim için finansman", uk: "Фінансування навчання чи освіти", es: "Financiación para estudios o formación" },
    keywords: ["bafög", "studium", "förderung"],
    availability: "hybrid"
  },
  {
    id: "gewerbe",
    authorityIds: ["buergeramt", "finanzamt"],
    title: { de: "Gewerbe anmelden", en: "Register a business", tr: "İşletme kaydı yap", uk: "Зареєструвати підприємницьку діяльність", es: "Registrar una actividad comercial" },
    subtitle: { de: "Start in die Selbstständigkeit vorbereiten", en: "Prepare your start into self-employment", tr: "Serbest çalışmaya başlangıcı hazırla", uk: "Підготувати старт самозайнятості", es: "Preparar el inicio como autónomo" },
    keywords: ["gewerbe", "selbstständig", "anmelden"],
    availability: "hybrid"
  }
];

const copyMap: Record<SupportedLanguage, ProcessesCopy> = {
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
    title: "Başvurular",
    intro: "Önemli resmi işlemler için rehberli başlangıç noktası.",
    searchPlaceholder: "Ne yapmak istiyorsun?",
    searchCaption: "Başvuru, kurum veya tipik işlem ara.",
    searchActiveHint: "BureauCare isteğini yorumlar ve uygun işlemleri önerir.",
    authoritySectionTitle: "Alanlar",
    authoritySectionHint: "Bir kurum seç ya da tüm konulara göz at.",
    allAuthorities: "Tüm alanlar",
    proceduresTitle: "Örnek işlemler",
    proceduresTitleAll: "Popüler işlemler",
    selectedAuthorityLabel: "Aktif alan",
    sampleCountLabel: "Örnekler",
    semanticTitle: "Önerilen eşleşmeler",
    semanticHint: "Günlük dil, belirsiz ifadeler ve farklı diller hesaba katılır.",
    bestMatchLabel: "En uygun seçenek olabilir",
    bestMatchText: "Bu işlem senin için en doğru seçenek olabilir.",
    alternativeMatchesLabel: "Diğer olası eşleşmeler",
    authorityLabel: "Kurum",
    emptySearchTitle: "Uygun işlem bulunamadı",
    emptySearchText: "Başka bir ifade dene veya bir alan seç.",
    openPlaceholder: "İşlemi aç",
    comingSoon: "Daha ayrıntılı yönlendirme sonraki adımlarda gelecek.",
    chipOnline: "Online mümkün",
    chipHybrid: "Online veya yerinde",
    chipInPerson: "Yerinde"
  },
  uk: {
    title: "Заяви й процеси",
    intro: "Зручний старт для найважливіших бюрократичних тем.",
    searchPlaceholder: "Що ви хочете зробити?",
    searchCaption: "Шукайте заяви, установи або типові справи.",
    searchActiveHint: "BureauCare інтерпретує запит і пропонує відповідні процеси.",
    authoritySectionTitle: "Напрями",
    authoritySectionHint: "Оберіть установу або перегляньте всі теми.",
    allAuthorities: "Усі напрями",
    proceduresTitle: "Приклади процесів",
    proceduresTitleAll: "Популярні процеси",
    selectedAuthorityLabel: "Активний напрям",
    sampleCountLabel: "Приклади",
    semanticTitle: "Рекомендовані збіги",
    semanticHint: "Ураховуються повсякденні формулювання, неточні описи та кілька мов.",
    bestMatchLabel: "Найімовірніше підходить",
    bestMatchText: "Схоже, це може бути правильний процес для вас.",
    alternativeMatchesLabel: "Інші можливі збіги",
    authorityLabel: "Установа",
    emptySearchTitle: "Поки що нічого не знайдено",
    emptySearchText: "Спробуйте інший запит або виберіть напрям.",
    openPlaceholder: "Відкрити процес",
    comingSoon: "Детальніші підказки з’являться в наступних кроках.",
    chipOnline: "Можна онлайн",
    chipHybrid: "Онлайн або особисто",
    chipInPerson: "Особисто"
  },
  es: {
    title: "Trámites y gestiones",
    intro: "Una entrada guiada a los temas burocráticos más importantes.",
    searchPlaceholder: "¿Qué quieres resolver?",
    searchCaption: "Busca trámites, organismos o solicitudes habituales.",
    searchActiveHint: "BureauCare interpreta tu necesidad y propone los trámites más cercanos.",
    authoritySectionTitle: "Áreas",
    authoritySectionHint: "Elige una oficina o explora todos los temas.",
    allAuthorities: "Todas las áreas",
    proceduresTitle: "Procesos de ejemplo",
    proceduresTitleAll: "Procesos frecuentes",
    selectedAuthorityLabel: "Área activa",
    sampleCountLabel: "Ejemplos",
    semanticTitle: "Sugerencias recomendadas",
    semanticHint: "Se tienen en cuenta lenguaje cotidiano, términos imprecisos y varios idiomas.",
    bestMatchLabel: "Probablemente encaja mejor",
    bestMatchText: "Este podría ser el trámite adecuado para ti.",
    alternativeMatchesLabel: "Otras coincidencias plausibles",
    authorityLabel: "Responsable",
    emptySearchTitle: "Aún no hay un proceso adecuado",
    emptySearchText: "Prueba otro término o elige un área.",
    openPlaceholder: "Abrir proceso",
    comingSoon: "La guía más profunda llegará en los siguientes pasos.",
    chipOnline: "Posible en línea",
    chipHybrid: "En línea o presencial",
    chipInPerson: "Presencial"
  }
};

export function getProcessesCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
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
