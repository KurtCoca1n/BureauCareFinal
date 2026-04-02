import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

type LocalizedText = Partial<Record<SupportedLanguage, string>>;

export type ProcessRealityType = "official_form" | "request_first" | "appointment" | "online_portal" | "combination";
export type ProcessRealityConfidence = "clear" | "likely" | "depends_on_city";

export type ProcessOfficialForm = {
  name: LocalizedText;
  source: "download" | "online_portal" | "appointment" | "postal_request";
  authority: LocalizedText;
  note: LocalizedText;
};

export type ProcessRequestPath = { needed: boolean; note: LocalizedText };
export type ProcessAppointmentPath = { needed: boolean; note: LocalizedText };
export type ProcessPortalPath = { available: boolean; note: LocalizedText };

export type ProcessRealityDocument = {
  id: string;
  label: LocalizedText;
  note: LocalizedText;
  importance: "core" | "helpful";
};

export type ProcessRealityStep = {
  id: string;
  title: LocalizedText;
  note: LocalizedText;
};

export type ProcessReality = {
  type: ProcessRealityType;
  confidence: ProcessRealityConfidence;
  intro: LocalizedText;
  transparency: LocalizedText;
  officialForm?: ProcessOfficialForm | null;
  requestPath: ProcessRequestPath;
  appointmentPath: ProcessAppointmentPath;
  portalPath: ProcessPortalPath;
  timeline: ProcessRealityStep[];
  documents: ProcessRealityDocument[];
};

type ProcessRealityCopy = {
  realityTitle: string;
  formTitle: string;
  documentsTitle: string;
  transparencyTitle: string;
  statusTypeLabel: string;
  statusConfidenceLabel: string;
  sourceLabel: string;
  authorityLabel: string;
  yesLabel: string;
  noLabel: string;
  officialFormLabel: string;
  requestFirstLabel: string;
  appointmentLabel: string;
  onlinePortalLabel: string;
  typeOfficialForm: string;
  typeRequestFirst: string;
  typeAppointment: string;
  typeOnlinePortal: string;
  typeCombination: string;
  confidenceClear: string;
  confidenceLikely: string;
  confidenceDependsOnCity: string;
  sourceDownload: string;
  sourceOnlinePortal: string;
  sourceAppointment: string;
  sourcePostalRequest: string;
  importanceCore: string;
  importanceHelpful: string;
};

const copyMap: Record<SupportedLanguage, ProcessRealityCopy> = {
  de: {
    realityTitle: "So läuft das in echt ab",
    formTitle: "Formular, Anfrage oder Termin",
    documentsTitle: "Typische Unterlagen",
    transparencyTitle: "Wichtig zu wissen",
    statusTypeLabel: "Ablauf",
    statusConfidenceLabel: "Einordnung",
    sourceLabel: "Wie du es bekommst",
    authorityLabel: "Zuständige Stelle",
    yesLabel: "Ja",
    noLabel: "Nein",
    officialFormLabel: "Offizielles Formular",
    requestFirstLabel: "Erst Anfrage nötig",
    appointmentLabel: "Termin nötig",
    onlinePortalLabel: "Online-Portal",
    typeOfficialForm: "Offizielles Formular direkt",
    typeRequestFirst: "Erst Anfrage, dann Unterlagen",
    typeAppointment: "Termin bei der Stelle",
    typeOnlinePortal: "Online-Antrag oder Portal",
    typeCombination: "Kombination aus mehreren Wegen",
    confidenceClear: "Das ist in der Regel klar so",
    confidenceLikely: "Das passt meistens so",
    confidenceDependsOnCity: "Je nach Stadt oder Amt etwas unterschiedlich",
    sourceDownload: "Download oder Formularseite",
    sourceOnlinePortal: "Online-Portal",
    sourceAppointment: "Beim Termin oder in der Behörde",
    sourcePostalRequest: "Nach Anfrage oder per Post",
    importanceCore: "Wird oft wirklich gebraucht",
    importanceHelpful: "Kann zusätzlich helfen"
  },
  en: {
    realityTitle: "How this usually works in real life",
    formTitle: "Form, request or appointment",
    documentsTitle: "Typical documents",
    transparencyTitle: "Good to know",
    statusTypeLabel: "Process type",
    statusConfidenceLabel: "Confidence",
    sourceLabel: "How you get it",
    authorityLabel: "Responsible office",
    yesLabel: "Yes",
    noLabel: "No",
    officialFormLabel: "Official form",
    requestFirstLabel: "Request first",
    appointmentLabel: "Appointment needed",
    onlinePortalLabel: "Online portal",
    typeOfficialForm: "Official form directly",
    typeRequestFirst: "Ask first, documents later",
    typeAppointment: "Appointment at the office",
    typeOnlinePortal: "Online application or portal",
    typeCombination: "Combination of several steps",
    confidenceClear: "This is usually clearly the case",
    confidenceLikely: "This is usually how it works",
    confidenceDependsOnCity: "Can differ by city or office",
    sourceDownload: "Download or form page",
    sourceOnlinePortal: "Online portal",
    sourceAppointment: "At the appointment or office",
    sourcePostalRequest: "After a request or by post",
    importanceCore: "Often really needed",
    importanceHelpful: "Can help in addition"
  },
  tr: {
    realityTitle: "Gerçekte süreç genelde böyle ilerler",
    formTitle: "Form, talep veya randevu",
    documentsTitle: "Tipik belgeler",
    transparencyTitle: "Bilmen iyi olur",
    statusTypeLabel: "Süreç tipi",
    statusConfidenceLabel: "Değerlendirme",
    sourceLabel: "Nasıl alırsın",
    authorityLabel: "Yetkili kurum",
    yesLabel: "Evet",
    noLabel: "Hayır",
    officialFormLabel: "Resmi form",
    requestFirstLabel: "Önce talep gerekir",
    appointmentLabel: "Randevu gerekir",
    onlinePortalLabel: "Online portal",
    typeOfficialForm: "Doğrudan resmi form",
    typeRequestFirst: "Önce talep, sonra evrak",
    typeAppointment: "Kurumda randevu",
    typeOnlinePortal: "Online başvuru veya portal",
    typeCombination: "Birden fazla yolun birleşimi",
    confidenceClear: "Bu genelde nettir",
    confidenceLikely: "Çoğu zaman süreç böyledir",
    confidenceDependsOnCity: "Şehre veya kuruma göre değişebilir",
    sourceDownload: "İndirme veya form sayfası",
    sourceOnlinePortal: "Online portal",
    sourceAppointment: "Randevuda veya kurumda",
    sourcePostalRequest: "Talep sonrası veya posta ile",
    importanceCore: "Genelde gerçekten istenir",
    importanceHelpful: "Ek olarak faydalı olabilir"
  },
  uk: {
    realityTitle: "Як це зазвичай відбувається насправді",
    formTitle: "Форма, запит або запис",
    documentsTitle: "Типові документи",
    transparencyTitle: "Що важливо знати",
    statusTypeLabel: "Тип процесу",
    statusConfidenceLabel: "Оцінка",
    sourceLabel: "Як це отримати",
    authorityLabel: "Відповідальна установа",
    yesLabel: "Так",
    noLabel: "Ні",
    officialFormLabel: "Офіційна форма",
    requestFirstLabel: "Спочатку потрібен запит",
    appointmentLabel: "Потрібен запис",
    onlinePortalLabel: "Онлайн-портал",
    typeOfficialForm: "Офіційна форма одразу",
    typeRequestFirst: "Спочатку запит, потім документи",
    typeAppointment: "Запис до установи",
    typeOnlinePortal: "Онлайн-заява або портал",
    typeCombination: "Комбінація кількох шляхів",
    confidenceClear: "Зазвичай це саме так",
    confidenceLikely: "Найчастіше все відбувається так",
    confidenceDependsOnCity: "Може відрізнятися залежно від міста або установи",
    sourceDownload: "Завантаження або сторінка форми",
    sourceOnlinePortal: "Онлайн-портал",
    sourceAppointment: "На прийомі або в установі",
    sourcePostalRequest: "Після запиту або поштою",
    importanceCore: "Часто справді потрібно",
    importanceHelpful: "Може додатково допомогти"
  },
  es: {
    realityTitle: "Así suele funcionar en la práctica",
    formTitle: "Formulario, solicitud o cita",
    documentsTitle: "Documentos típicos",
    transparencyTitle: "Conviene saberlo",
    statusTypeLabel: "Tipo de proceso",
    statusConfidenceLabel: "Valoración",
    sourceLabel: "Cómo lo consigues",
    authorityLabel: "Organismo responsable",
    yesLabel: "Sí",
    noLabel: "No",
    officialFormLabel: "Formulario oficial",
    requestFirstLabel: "Primero hace falta una solicitud",
    appointmentLabel: "Hace falta cita",
    onlinePortalLabel: "Portal online",
    typeOfficialForm: "Formulario oficial directo",
    typeRequestFirst: "Primero solicitud, luego documentos",
    typeAppointment: "Cita en la oficina",
    typeOnlinePortal: "Solicitud online o portal",
    typeCombination: "Combinación de varios pasos",
    confidenceClear: "Normalmente esto está claro",
    confidenceLikely: "Así suele funcionar la mayoría de las veces",
    confidenceDependsOnCity: "Puede variar según la ciudad o la oficina",
    sourceDownload: "Descarga o página del formulario",
    sourceOnlinePortal: "Portal online",
    sourceAppointment: "En la cita o en la oficina",
    sourcePostalRequest: "Tras una solicitud o por correo",
    importanceCore: "Suele pedirse de verdad",
    importanceHelpful: "Puede ayudar además"
  }
};

function resolveText(value: LocalizedText, locale: string | null | undefined) {
  const normalized = normalizePreferredLanguage(locale);
  return value[normalized] ?? value.en ?? value.de ?? "";
}

export function getProcessRealityCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
}

export function getLocalizedRealityValue(value: LocalizedText, locale: string | null | undefined) {
  return resolveText(value, locale);
}

const realities: Record<string, ProcessReality> = {
  wohngeld: {
    type: "official_form",
    confidence: "depends_on_city",
    intro: {
      de: "Für Wohngeld gibt es meistens einen offiziellen Antrag. Je nach Stadt läuft die Abgabe online, per Post oder direkt beim Amt.",
      en: "For housing benefit there is usually an official application. Depending on the city, submission happens online, by post or directly with the office."
    },
    transparency: {
      de: "Die genaue Stelle und der genaue Weg können je nach Stadt etwas anders sein. BureauCare zeigt dir hier den typischen echten Ablauf.",
      en: "The exact office and route can differ a bit by city. BureauCare shows you the typical real process here."
    },
    officialForm: {
      name: { de: "Wohngeldantrag", en: "Housing benefit application" },
      source: "download",
      authority: { de: "Wohngeldstelle deiner Stadt oder Gemeinde", en: "Housing benefit office in your city or town" },
      note: { de: "Meist gibt es ein offizielles Formular oder eine offizielle Online-Seite der Wohngeldstelle.", en: "There is usually an official form or an official online page from the housing benefit office." }
    },
    requestPath: { needed: false, note: { de: "Du startest normalerweise direkt mit dem offiziellen Antrag.", en: "You usually start directly with the official application." } },
    appointmentPath: { needed: false, note: { de: "Ein Termin ist nicht immer nötig. Manche Stellen arbeiten per Online-Einreichung oder Post.", en: "An appointment is not always needed. Some offices work through online submission or post." } },
    portalPath: { available: true, note: { de: "In manchen Städten gibt es ein Online-Portal, in anderen eher Formular plus Unterlagen.", en: "Some cities offer an online portal, in others it is more form plus documents." } },
    timeline: [
      { id: "form", title: { de: "Offiziellen Antrag holen", en: "Get the official application" }, note: { de: "Als Download, online oder direkt bei der Wohngeldstelle.", en: "As a download, online or directly from the office." } },
      { id: "collect", title: { de: "Unterlagen sammeln", en: "Collect documents" }, note: { de: "Oft Mietvertrag, {{einkommensnachweis|Einkommensnachweise}} und Wohnkosten.", en: "Often the rental contract, {{einkommensnachweis|proof of income}} and housing costs." } },
      { id: "submit", title: { de: "Antrag einreichen", en: "Submit the application" }, note: { de: "Je nach Stadt online, per Post oder direkt beim Amt.", en: "Depending on the city online, by post or directly at the office." } },
      { id: "review", title: { de: "Amt prüft alles", en: "The office checks everything" }, note: { de: "Es ist normal, dass noch etwas nachgefragt wird.", en: "It is normal that the office asks for more details." } },
      { id: "decision", title: { de: "Bescheid bekommen", en: "Receive the decision" }, note: { de: "Dann siehst du, ob du Wohngeld bekommst und ab wann.", en: "Then you see whether you receive housing benefit and from when." } }
    ],
    documents: [
      { id: "id", label: { de: "Ausweis oder Pass", en: "ID card or passport" }, note: { de: "Zur Identität.", en: "For identity." }, importance: "core" },
      { id: "rent", label: { de: "Mietvertrag", en: "Rental contract" }, note: { de: "Damit Wohnung und Kosten klar sind.", en: "So the flat and the costs are clear." }, importance: "core" },
      { id: "income", label: { de: "{{einkommensnachweis|Einkommensnachweise}}", en: "{{einkommensnachweis|Proof of income}}" }, note: { de: "Zum Beispiel Lohnzettel oder Bescheide.", en: "For example payslips or official notices." }, importance: "core" },
      { id: "registration", label: { de: "{{meldebescheinigung|Meldebescheinigung}}", en: "{{meldebescheinigung|Registration certificate}}" }, note: { de: "Nicht immer sofort nötig, aber oft hilfreich.", en: "Not always needed immediately, but often helpful." }, importance: "helpful" }
    ]
  },
  buergergeld: {
    type: "official_form",
    confidence: "clear",
    intro: {
      de: "Beim Bürgergeld arbeitest du meist mit einem offiziellen Hauptantrag und weiteren offiziellen Anlagen.",
      en: "For basic income support you usually work with an official main application and additional official attachments."
    },
    transparency: {
      de: "Die genauen Anlagen können je nach Situation unterschiedlich sein. Der Grundablauf mit offiziellem Antrag ist aber klar.",
      en: "The exact attachments can differ by situation. But the main path with the official application is clear."
    },
    officialForm: {
      name: { de: "Hauptantrag Bürgergeld plus Anlagen", en: "Main basic income application plus attachments" },
      source: "download",
      authority: { de: "Jobcenter", en: "Jobcenter" },
      note: { de: "Oft gibt es einen offiziellen Hauptantrag und zusätzliche Formulare für Miete, Einkommen oder Personen im Haushalt.", en: "There is often an official main application and additional forms for rent, income or household members." }
    },
    requestPath: { needed: false, note: { de: "Eine freie Anfrage vorher ist normalerweise nicht nötig.", en: "A free-form request first is normally not needed." } },
    appointmentPath: { needed: false, note: { de: "Ein Termin kann später sinnvoll sein, aber oft startet alles über die Antragsunterlagen.", en: "An appointment can be useful later, but things often start with the application papers." } },
    portalPath: { available: true, note: { de: "Viele Jobcenter haben auch digitale Wege.", en: "Many jobcenters also offer digital routes." } },
    timeline: [
      { id: "main", title: { de: "Offiziellen Hauptantrag starten", en: "Start the official main application" }, note: { de: "Danach kommen die passenden Anlagen dazu.", en: "After that the matching attachments follow." } },
      { id: "proof", title: { de: "Miete, Einkommen und Konto nachweisen", en: "Provide rent, income and bank proof" }, note: { de: "Das Jobcenter braucht dafür oft mehrere Unterlagen.", en: "The jobcenter often needs several documents for this." } },
      { id: "submit", title: { de: "Alles beim Jobcenter einreichen", en: "Submit everything to the jobcenter" }, note: { de: "Je nach Stelle online, per Upload oder persönlich.", en: "Depending on the office online, by upload or in person." } },
      { id: "follow-up", title: { de: "Rückfragen beantworten", en: "Answer follow-up questions" }, note: { de: "Es ist normal, dass noch etwas nachgereicht werden muss.", en: "It is normal that more proof has to be added later." } },
      { id: "decision", title: { de: "Bescheid abwarten", en: "Wait for the decision" }, note: { de: "Dann wird klar, ob und wie viel bewilligt wird.", en: "Then it becomes clear whether and how much is approved." } }
    ],
    documents: [
      { id: "id", label: { de: "Ausweis oder Pass", en: "ID card or passport" }, note: { de: "Für deine Identität.", en: "For your identity." }, importance: "core" },
      { id: "bank", label: { de: "Kontoauszüge", en: "Bank statements" }, note: { de: "Werden oft abgefragt.", en: "These are often requested." }, importance: "core" },
      { id: "housing", label: { de: "Mietvertrag und Wohnkosten", en: "Rental contract and housing costs" }, note: { de: "Damit Miete und Nebenkosten geprüft werden können.", en: "So rent and extra costs can be checked." }, importance: "core" },
      { id: "income", label: { de: "{{einkommensnachweis|Einkommensnachweise}}", en: "{{einkommensnachweis|Proof of income}}" }, note: { de: "Auch bei wenig Einkommen wichtig für die Einordnung.", en: "Important even with little income." }, importance: "core" }
    ]
  },
  kindergeld: {
    type: "official_form",
    confidence: "clear",
    intro: { de: "Kindergeld läuft meist über einen offiziellen Antrag bei der Familienkasse.", en: "Child benefit usually runs through an official application at the family benefits office." },
    transparency: { de: "Bei älteren Kindern kommen oft weitere Nachweise dazu, zum Beispiel für Schule oder Ausbildung.", en: "For older children more proof is often needed, for example for school or training." },
    officialForm: { name: { de: "Kindergeldantrag", en: "Child benefit application" }, source: "online_portal", authority: { de: "Familienkasse", en: "Family benefits office" }, note: { de: "Es gibt offizielle Antragswege der Familienkasse, teils auch digital.", en: "There are official routes from the family office, partly digital." } },
    requestPath: { needed: false, note: { de: "Du startest normalerweise direkt mit dem Antrag.", en: "You normally start directly with the application." } },
    appointmentPath: { needed: false, note: { de: "Ein Termin ist dafür meistens nicht der erste Schritt.", en: "An appointment is usually not the first step here." } },
    portalPath: { available: true, note: { de: "Offizielle digitale Wege sind oft möglich.", en: "Official digital routes are often possible." } },
    timeline: [
      { id: "start", title: { de: "Offiziellen Kindergeldantrag starten", en: "Start the official child benefit application" }, note: { de: "Am besten direkt über die offiziellen Wege der Familienkasse.", en: "Best through the official family office route." } },
      { id: "data", title: { de: "Daten von dir und dem Kind angeben", en: "Enter details about you and the child" }, note: { de: "Hier sind oft Grunddaten und {{steuer_id|Steuer-ID}} wichtig.", en: "Here basic details and {{steuer_id|tax ID}} are often important." } },
      { id: "proof", title: { de: "Nachweise beilegen", en: "Add the supporting documents" }, note: { de: "Zum Beispiel Geburtsurkunde oder Schulnachweise.", en: "For example the birth certificate or school proof." } },
      { id: "submit", title: { de: "Antrag senden", en: "Send the application" }, note: { de: "Je nach Weg digital oder mit offiziellen Unterlagen.", en: "Depending on the route digitally or with official papers." } },
      { id: "decision", title: { de: "Auf Rückmeldung warten", en: "Wait for the response" }, note: { de: "Danach kommt der Bescheid der Familienkasse.", en: "After that you receive the decision." } }
    ],
    documents: [
      { id: "id", label: { de: "Ausweis oder Pass", en: "ID card or passport" }, note: { de: "Für deine Daten.", en: "For your details." }, importance: "core" },
      { id: "tax", label: { de: "{{steuer_id|Steuer-ID}} von dir und vom Kind", en: "{{steuer_id|Tax ID}} for you and the child" }, note: { de: "Diese Nummer wird fast immer gebraucht.", en: "This number is almost always needed." }, importance: "core" },
      { id: "birth", label: { de: "Geburtsurkunde", en: "Birth certificate" }, note: { de: "Oft einer der wichtigsten Nachweise.", en: "Often one of the most important proofs." }, importance: "core" },
      { id: "school", label: { de: "Nachweise zu Schule oder Ausbildung", en: "Proof of school or training" }, note: { de: "Vor allem bei älteren Kindern relevant.", en: "Especially relevant for older children." }, importance: "helpful" }
    ]
  },
  ummeldung: {
    type: "appointment",
    confidence: "depends_on_city",
    intro: { de: "Bei der Ummeldung ist der reale Weg oft ein Termin beim Bürgeramt oder ein offizieller Online-Terminprozess.", en: "For changing your address, the real route is often an appointment at the citizen office or an official online booking flow." },
    transparency: { de: "Manche Städte arbeiten nur mit Termin, andere teils auch mit Online-Vorgang. Die Wohnungsgeberbestätigung ist fast immer zentral.", en: "Some cities work only with appointments, others partly also with an online route. The landlord confirmation is almost always central." },
    officialForm: { name: { de: "Anmeldung / Ummeldung beim Bürgeramt", en: "Address registration / change at the citizen office" }, source: "appointment", authority: { de: "Bürgeramt oder Einwohnermeldeamt", en: "Citizen office or registration office" }, note: { de: "Der genaue Vordruck kann vor Ort oder auf der offiziellen Stadtseite bereitstehen.", en: "The exact form can be provided on site or on the official city website." } },
    requestPath: { needed: false, note: { de: "Es geht meist nicht um eine freie Anfrage, sondern um Termin und amtliche Meldung.", en: "This is usually not about a free-form request but about the appointment and the official registration." } },
    appointmentPath: { needed: true, note: { de: "Ein Termin ist in vielen Städten der normale Weg.", en: "An appointment is the normal route in many cities." } },
    portalPath: { available: true, note: { de: "Oft gibt es wenigstens eine Online-Terminbuchung.", en: "There is often at least online appointment booking." } },
    timeline: [
      { id: "book", title: { de: "Termin buchen", en: "Book the appointment" }, note: { de: "In vielen Städten ist das der erste echte Schritt.", en: "In many cities this is the first real step." } },
      { id: "prepare", title: { de: "Unterlagen vorbereiten", en: "Prepare your documents" }, note: { de: "Vor allem Ausweis und Wohnungsgeberbestätigung.", en: "Especially ID and the landlord confirmation." } },
      { id: "visit", title: { de: "Zum Termin gehen", en: "Go to the appointment" }, note: { de: "Die Ummeldung wird oft direkt dort aufgenommen.", en: "The address change is often handled directly there." } },
      { id: "done", title: { de: "Adresse offiziell ändern lassen", en: "Have the address officially changed" }, note: { de: "Danach sind deine Meldedaten aktualisiert.", en: "After that your registration data is updated." } }
    ],
    documents: [
      { id: "id", label: { de: "Ausweis oder Pass", en: "ID card or passport" }, note: { de: "Fast immer notwendig.", en: "Almost always necessary." }, importance: "core" },
      { id: "address", label: { de: "Neue Adresse", en: "New address" }, note: { de: "Die Daten müssen klar vorliegen.", en: "The address details need to be ready." }, importance: "core" },
      { id: "landlord", label: { de: "Wohnungsgeberbestätigung", en: "Landlord confirmation" }, note: { de: "Oft einer der wichtigsten echten Nachweise.", en: "Often one of the most important real documents." }, importance: "core" }
    ]
  },
  steuererklaerung: {
    type: "online_portal",
    confidence: "likely",
    intro: { de: "Bei der Steuer gibt es oft ein offizielles Online-Portal oder offizielle Erklärungsformulare.", en: "Taxes often use an official online portal or official return forms." },
    transparency: { de: "Der genaue Weg kann von deinem Fall abhängen, aber ein digitales oder offizielles System ist der normale Weg.", en: "The exact route depends on your case, but a digital or official system is the normal path." },
    officialForm: { name: { de: "Steuererklärung / ELSTER-Weg", en: "Tax return / ELSTER route" }, source: "online_portal", authority: { de: "Finanzamt", en: "Tax office" }, note: { de: "Offizielle Steuerwege laufen oft digital, nicht über freie Fantasieformulare.", en: "Official tax routes often run digitally, not through invented forms." } },
    requestPath: { needed: false, note: { de: "Du brauchst dafür normalerweise keine freie Anfrage.", en: "You normally do not need a free-form request for this." } },
    appointmentPath: { needed: false, note: { de: "Ein Termin ist meistens nicht der Standardweg.", en: "An appointment is usually not the standard route." } },
    portalPath: { available: true, note: { de: "Der Online-Weg ist hier oft der wichtigste reale Weg.", en: "The online route is often the most important real route here." } },
    timeline: [
      { id: "collect", title: { de: "Unterlagen sammeln", en: "Collect documents" }, note: { de: "Vor allem Einkommen, Belege und {{steuer_id|Steuer-ID}}.", en: "Especially income, receipts and your {{steuer_id|tax ID}}." } },
      { id: "portal", title: { de: "Offizielles Portal oder Formular nutzen", en: "Use the official portal or form" }, note: { de: "Meist online, manchmal auch als Formularweg.", en: "Usually online, sometimes also as a paper form route." } },
      { id: "enter", title: { de: "Angaben eintragen", en: "Enter your information" }, note: { de: "Einnahmen, Ausgaben und wichtige Daten sauber eintragen.", en: "Enter income, expenses and important details carefully." } },
      { id: "send", title: { de: "Erklärung abschicken", en: "Send the return" }, note: { de: "Danach prüft das Finanzamt alles.", en: "After that the tax office checks everything." } },
      { id: "notice", title: { de: "Steuerbescheid bekommen", en: "Receive the tax notice" }, note: { de: "Dann siehst du, ob du Geld zurückbekommst oder zahlen musst.", en: "Then you see whether you get money back or need to pay." } }
    ],
    documents: [
      { id: "tax-id", label: { de: "{{steuer_id|Steuer-ID}}", en: "{{steuer_id|Tax ID}}" }, note: { de: "Fast immer wichtig.", en: "Almost always important." }, importance: "core" },
      { id: "income", label: { de: "Lohnsteuerbescheinigung oder ähnliche Nachweise", en: "Income tax statement or similar proof" }, note: { de: "Damit deine Einnahmen klar sind.", en: "So your income is clear." }, importance: "core" },
      { id: "receipts", label: { de: "Belege zu Ausgaben", en: "Receipts for expenses" }, note: { de: "Zum Beispiel Werbungskosten oder andere relevante Kosten.", en: "For example work-related costs or other relevant expenses." }, importance: "helpful" }
    ]
  },
  gewerbe: {
    type: "combination",
    confidence: "depends_on_city",
    intro: { de: "Bei der Gewerbeanmeldung ist der reale Weg oft eine Kombination: offizielle Anmeldung, je nach Stadt online oder beim Amt.", en: "Business registration is often a combination: the official registration, depending on the city online or at the office." },
    transparency: { de: "Der genaue Weg hängt stark von Stadt und Art des Gewerbes ab. Manche Berufe brauchen zusätzliche Erlaubnisse.", en: "The exact path depends strongly on the city and the type of business. Some professions need extra permits." },
    officialForm: { name: { de: "Gewerbeanmeldung", en: "Business registration" }, source: "online_portal", authority: { de: "Gewerbeamt", en: "Trade office" }, note: { de: "Je nach Stadt online oder als offizieller Vorgang beim Amt.", en: "Depending on the city online or as an official process at the office." } },
    requestPath: { needed: false, note: { de: "Meist startest du direkt mit der Gewerbeanmeldung.", en: "You usually start directly with the business registration." } },
    appointmentPath: { needed: false, note: { de: "Ein Termin kann nötig sein, ist aber nicht überall gleich.", en: "An appointment can be needed, but not everywhere." } },
    portalPath: { available: true, note: { de: "Manche Städte bieten einen echten Online-Weg, andere arbeiten eher vor Ort.", en: "Some cities offer a real online route, others work more in person." } },
    timeline: [
      { id: "check", title: { de: "Prüfen, was dein Gewerbe genau ist", en: "Check what kind of business this is" }, note: { de: "Der genaue Ablauf hängt davon oft stark ab.", en: "The exact process often depends on this." } },
      { id: "register", title: { de: "Offizielle Gewerbeanmeldung starten", en: "Start the official registration" }, note: { de: "Online oder beim zuständigen Gewerbeamt.", en: "Online or with the responsible trade office." } },
      { id: "docs", title: { de: "Unterlagen und Angaben einreichen", en: "Submit documents and details" }, note: { de: "Vor allem Identität, Adresse und Beschreibung der Tätigkeit.", en: "Especially identity, address and the description of the business activity." } },
      { id: "confirm", title: { de: "Bestätigung abwarten", en: "Wait for the confirmation" }, note: { de: "Danach folgen oft weitere Stellen wie Finanzamt.", en: "After that other offices such as the tax office often follow." } }
    ],
    documents: [
      { id: "id", label: { de: "Ausweis oder Pass", en: "ID card or passport" }, note: { de: "Für die Identität.", en: "For identity." }, importance: "core" },
      { id: "business", label: { de: "Beschreibung der Tätigkeit", en: "Description of the business activity" }, note: { de: "Das Amt will meist wissen, was genau du machen willst.", en: "The office usually wants to know what exactly you plan to do." }, importance: "core" },
      { id: "address", label: { de: "Adresse des Betriebs oder deiner Arbeit", en: "Business or work address" }, note: { de: "Damit dein Gewerbe zugeordnet werden kann.", en: "So your business can be assigned." }, importance: "core" }
    ]
  },
  visum: {
    type: "combination",
    confidence: "depends_on_city",
    intro: { de: "Beim Visum oder Aufenthalt ist der reale Ablauf oft eine Kombination aus Anfrage, Termin, offiziellen Formularen und Nachweisen.", en: "For visas or residence permits, the real process is often a combination of request, appointment, official forms and supporting documents." },
    transparency: { de: "Gerade hier ist es wichtig, keine falsche Sicherheit zu geben. Der Ablauf hängt stark von Aufenthaltsgrund, Stadt und Behörde ab.", en: "This is exactly where false certainty must be avoided. The route depends a lot on the reason for stay, the city and the office." },
    officialForm: { name: { de: "Je nach Aufenthaltsgrund offizieller Antrag oder Unterlagenpaket", en: "Depending on the residence reason, an official application or document package" }, source: "appointment", authority: { de: "Ausländerbehörde", en: "Immigration office" }, note: { de: "Nicht jeder Aufenthalt startet mit demselben Formular. Manchmal kommt der nächste Schritt erst nach Anfrage oder Termin.", en: "Not every residence path starts with the same form. Sometimes the next step comes only after a request or appointment." } },
    requestPath: { needed: true, note: { de: "Häufig brauchst du zuerst eine Kontaktaufnahme, Terminbuchung oder Fallprüfung.", en: "You often first need contact, appointment booking or a case check." } },
    appointmentPath: { needed: true, note: { de: "Ein Termin ist hier sehr oft ein echter Teil des Ablaufs.", en: "An appointment is very often a real part of this process." } },
    portalPath: { available: true, note: { de: "Manche Städte haben Portale für Termine oder erste Daten, aber nicht immer einen kompletten Online-Antrag.", en: "Some cities have portals for appointments or first data, but not always a full online application." } },
    timeline: [
      { id: "clarify", title: { de: "Klären, welcher Aufenthalt genau passt", en: "Clarify which residence path fits" }, note: { de: "Arbeit, Studium, Familie oder Verlängerung brauchen oft unterschiedliche Wege.", en: "Work, study, family or extension often follow different routes." } },
      { id: "request", title: { de: "Kontakt aufnehmen oder Termin holen", en: "Make contact or get an appointment" }, note: { de: "Das ist oft der erste echte Schritt.", en: "This is often the first real step." } },
      { id: "prepare", title: { de: "Offizielle Unterlagen vorbereiten", en: "Prepare the official documents" }, note: { de: "Häufig Pass, {{aufenthaltstitel|Aufenthaltsdokumente}} und Nachweise zu Arbeit, Studium oder Wohnung.", en: "Often passport, {{aufenthaltstitel|residence documents}} and proof about work, study or housing." } },
      { id: "appointment", title: { de: "Zum Termin gehen oder Unterlagen nachreichen", en: "Go to the appointment or submit the documents" }, note: { de: "Je nach Stelle digital vorbereitet, aber oft nicht komplett ohne Termin.", en: "Depending on the office there may be digital preparation, but often not fully without an appointment." } },
      { id: "decision", title: { de: "Auf Entscheidung oder neues Dokument warten", en: "Wait for the decision or new document" }, note: { de: "Wartezeiten sind hier leider oft normal.", en: "Waiting times are unfortunately often normal here." } }
    ],
    documents: [
      { id: "passport", label: { de: "Reisepass", en: "Passport" }, note: { de: "Fast immer zentral.", en: "Almost always central." }, importance: "core" },
      { id: "permit", label: { de: "{{aufenthaltstitel|Aktuelle Aufenthaltsdokumente}}", en: "{{aufenthaltstitel|Current residence documents}}" }, note: { de: "Wichtig, wenn du schon Dokumente hast.", en: "Important if you already have documents." }, importance: "core" },
      { id: "purpose", label: { de: "Nachweise zum Aufenthaltsgrund", en: "Proof for the reason of stay" }, note: { de: "Zum Beispiel Arbeit, Studium, Familie oder Wohnung.", en: "For example work, study, family or housing." }, importance: "core" },
      { id: "photo", label: { de: "Passfoto", en: "Passport photo" }, note: { de: "Wird oft beim echten Antrag gebraucht.", en: "Often needed for the real application." }, importance: "helpful" }
    ]
  }
};

export function getProcessReality(procedureId: string) {
  return realities[procedureId] ?? null;
}

export function getProcessRealityTypeLabel(type: ProcessRealityType, locale: string | null | undefined) {
  const copy = getProcessRealityCopy(locale);

  switch (type) {
    case "official_form":
      return copy.typeOfficialForm;
    case "request_first":
      return copy.typeRequestFirst;
    case "appointment":
      return copy.typeAppointment;
    case "online_portal":
      return copy.typeOnlinePortal;
    default:
      return copy.typeCombination;
  }
}

export function getProcessRealityConfidenceLabel(confidence: ProcessRealityConfidence, locale: string | null | undefined) {
  const copy = getProcessRealityCopy(locale);

  switch (confidence) {
    case "clear":
      return copy.confidenceClear;
    case "likely":
      return copy.confidenceLikely;
    default:
      return copy.confidenceDependsOnCity;
  }
}

export function getProcessRealitySourceLabel(source: ProcessOfficialForm["source"], locale: string | null | undefined) {
  const copy = getProcessRealityCopy(locale);

  switch (source) {
    case "download":
      return copy.sourceDownload;
    case "online_portal":
      return copy.sourceOnlinePortal;
    case "appointment":
      return copy.sourceAppointment;
    default:
      return copy.sourcePostalRequest;
  }
}
