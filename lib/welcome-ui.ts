import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type { WelcomeGermanLevel, WelcomeReason, WelcomeStepStatus } from "@/lib/types";
import type { WelcomeStepKey } from "@/lib/welcome";

type Choice = { value: string; label: string; description?: string };

type WelcomeStepDetailCopy = {
  title: string;
  description: string;
  what: string;
  why: string;
  when: string;
  requirements: string[];
  guide: string[];
};

export type WelcomeCopy = {
  navLabel: string;
  homeBadge: string;
  homeTitle: string;
  homeText: string;
  homeAction: string;
  pageTitle: string;
  pageIntro: string;
  onboardingBadge: string;
  onboardingTitle: string;
  onboardingText: string;
  progress: string;
  back: string;
  next: string;
  finish: string;
  saving: string;
  roadmapTitle: string;
  roadmapText: string;
  roadmapProgress: string;
  roadmapEmpty: string;
  roadmapOpenDetail: string;
  detailBack: string;
  detailIntro: string;
  detailWhatTitle: string;
  detailWhyTitle: string;
  detailWhenTitle: string;
  detailRequirementsTitle: string;
  detailGuideTitle: string;
  detailGuideText: string;
  detailStatusTitle: string;
  detailStatusText: string;
  detailPreparedTitle: string;
  detailPreparedText: string;
  detailNotFound: string;
  comingSoon: string;
  futureActions: {
    form: { title: string; text: string };
    upload: { title: string; text: string };
    reply: { title: string; text: string };
    office: { title: string; text: string };
    appointment: { title: string; text: string };
  };
  status: Record<WelcomeStepStatus, string>;
  stepActions: Record<WelcomeStepStatus, string>;
  doneCount: string;
  questions: Array<
    | { id: "reason"; title: string; text: string; options: Choice[] }
    | { id: "nationality"; title: string; text: string; placeholder: string; optional: string }
    | { id: "city"; title: string; text: string; placeholder: string }
    | { id: "housing_status"; title: string; text: string; options: Choice[] }
    | { id: "registration_status"; title: string; text: string; options: Choice[] }
    | { id: "health_insurance_status"; title: string; text: string; options: Choice[] }
    | { id: "work_status"; title: string; text: string; options: Choice[] }
    | { id: "has_children"; title: string; text: string; options: Choice[] }
    | { id: "german_level"; title: string; text: string; options: Choice[] }
  >;
  steps: Record<WelcomeStepKey, WelcomeStepDetailCopy>;
};

const de: WelcomeCopy = {
  navLabel: "Welcome",
  homeBadge: "Neu in Deutschland?",
  homeTitle: "Welcome to Germany",
  homeText: "BureauCare baut dir einen ruhigen Plan fuer die wichtigsten ersten Schritte in Deutschland.",
  homeAction: "Guide starten",
  pageTitle: "Welcome to Germany",
  pageIntro: "Wir bauen dir einen persoenlichen Plan, damit du weisst, was du in Deutschland als Naechstes erledigen solltest.",
  onboardingBadge: "Onboarding",
  onboardingTitle: "Dein Start in Deutschland",
  onboardingText: "Ein paar kurze Antworten reichen. Danach zeigt dir BureauCare die wichtigsten Schritte in der richtigen Reihenfolge.",
  progress: "Schritt {current} von {total}",
  back: "Zurueck",
  next: "Weiter",
  finish: "Roadmap erstellen",
  saving: "Roadmap wird erstellt...",
  roadmapTitle: "Dein Plan",
  roadmapText: "Das ist deine erste persoenliche Roadmap. Du kannst Schritte spaeter manuell als in Bearbeitung oder erledigt markieren.",
  roadmapProgress: "Du hast {done} von {total} Schritten erledigt.",
  roadmapEmpty: "Sobald dein Welcome-Profil gespeichert ist, erscheint dein Plan hier.",
  roadmapOpenDetail: "Details ansehen",
  detailBack: "Zurueck zur Roadmap",
  detailIntro: "Hier siehst du in einfacher Sprache, worum es geht, was du brauchst und wie du Schritt fuer Schritt vorgehst.",
  detailWhatTitle: "Was ist das?",
  detailWhyTitle: "Warum ist das wichtig?",
  detailWhenTitle: "Wann solltest du das machen?",
  detailRequirementsTitle: "Diese Dokumente brauchst du",
  detailGuideTitle: "So gehst du vor",
  detailGuideText: "Arbeite die Schritte ruhig nacheinander ab. Du musst nicht alles auf einmal machen.",
  detailStatusTitle: "Status dieses Schritts",
  detailStatusText: "Du kannst den Status hier aendern. Die Roadmap wird direkt mit aktualisiert.",
  detailPreparedTitle: "Als Naechstes moeglich",
  detailPreparedText: "Diese Bereiche sind schon vorbereitet. Die Funktionen kommen in den naechsten Schritten des Welcome Mode dazu.",
  detailNotFound: "Diesen Welcome-Schritt konnten wir gerade nicht finden.",
  comingSoon: "Kommt bald",
  futureActions: {
    form: { title: "Formular ausfuellen", text: "Hier kannst du spaeter passende Formulare Schritt fuer Schritt ausfuellen." },
    upload: { title: "Dokument hochladen", text: "Hier kannst du spaeter die wichtigsten Unterlagen direkt zu diesem Schritt hochladen." },
    reply: { title: "Antwort schreiben", text: "Falls du spaeter eine E-Mail oder Antwort brauchst, wird BureauCare dich hier unterstuetzen." },
    office: { title: "Zustaendige Stelle finden", text: "Spaeter zeigen wir dir hier die richtige Behoerde oder Stelle in deiner Naehe." },
    appointment: { title: "Termin buchen", text: "Wenn ein Termin noetig ist, bereitet BureauCare diesen Schritt spaeter hier fuer dich vor." }
  },
  status: {
    open: "Offen",
    in_progress: "In Bearbeitung",
    done: "Erledigt"
  },
  stepActions: {
    open: "Als offen markieren",
    in_progress: "Als in Bearbeitung markieren",
    done: "Als erledigt markieren"
  },
  doneCount: "{done} erledigt",
  questions: [
    {
      id: "reason",
      title: "Warum bist du in Deutschland?",
      text: "Damit BureauCare die passenden ersten Schritte fuer dich einschaetzen kann.",
      options: [
        { value: "study", label: "Studium" },
        { value: "work", label: "Arbeit" },
        { value: "training", label: "Ausbildung" },
        { value: "family", label: "Familie" },
        { value: "au_pair", label: "Au-pair" },
        { value: "refugee", label: "Gefluechtet / Asyl" },
        { value: "other", label: "Sonstiges" }
      ]
    },
    { id: "nationality", title: "Staatsangehoerigkeit", text: "Optional. Diese Angabe hilft spaeter bei Aufenthalt und Formularen.", placeholder: "Zum Beispiel: Italien", optional: "Optional" },
    { id: "city", title: "In welcher Stadt lebst du?", text: "Wir nutzen das spaeter fuer lokale Hinweise und Aemter.", placeholder: "Zum Beispiel: Berlin" },
    {
      id: "housing_status",
      title: "Hast du schon eine Wohnung?",
      text: "Das hilft bei Anmeldung und den ersten Schritten.",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" },
        { value: "temporary", label: "Voruebergehend" }
      ]
    },
    {
      id: "registration_status",
      title: "Bist du schon angemeldet?",
      text: "Also: Ist dein Wohnsitz schon offiziell angemeldet?",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" },
        { value: "unknown", label: "Weiss nicht" }
      ]
    },
    {
      id: "health_insurance_status",
      title: "Hast du schon eine Krankenversicherung?",
      text: "Das ist fuer viele weitere Schritte wichtig.",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" },
        { value: "unknown", label: "Weiss nicht" }
      ]
    },
    {
      id: "work_status",
      title: "Arbeitest du bereits in Deutschland?",
      text: "Das hilft bei Steuer, Versicherung und Arbeitserlaubnis.",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" },
        { value: "soon", label: "Bald" }
      ]
    },
    {
      id: "has_children",
      title: "Hast du Kinder?",
      text: "Damit BureauCare Familienleistungen besser einordnen kann.",
      options: [
        { value: "yes", label: "Ja" },
        { value: "no", label: "Nein" }
      ]
    },
    {
      id: "german_level",
      title: "Sprichst du Deutsch?",
      text: "Dann wissen wir besser, wie einfach Texte sein sollten.",
      options: [
        { value: "none", label: "Gar nicht" },
        { value: "basic", label: "Ein bisschen" },
        { value: "good", label: "Gut" }
      ]
    }
  ],
  steps: {
    city_registration: {
      title: "Anmeldung (Wohnsitz anmelden)",
      description: "Melde deine Adresse beim Buergeramt an. Das ist oft einer der ersten wichtigsten Schritte.",
      what: "Du meldest offiziell, wo du in Deutschland wohnst.",
      why: "Viele andere Schritte bauen darauf auf. Ohne Anmeldung wird vieles schwerer.",
      when: "Am besten so frueh wie moeglich, sobald du eine Adresse hast.",
      requirements: ["Reisepass oder Ausweis", "Wohnungsgeberbestaetigung", "Anmeldeformular", "Manchmal Mietvertrag"],
      guide: [
        "Pruefe, welches Buergeramt fuer deine Adresse zustaendig ist.",
        "Buche einen Termin, wenn deine Stadt Termine braucht.",
        "Fuelle das Anmeldeformular aus.",
        "Nimm alle Dokumente zum Termin mit.",
        "Du bekommst eine Meldebestaetigung."
      ]
    },
    tax_id: {
      title: "Steuer-ID",
      description: "Nach der Anmeldung bekommst du meist automatisch deine Steuer-ID per Post.",
      what: "Die Steuer-ID ist deine persoenliche Nummer fuer das Finanzamt.",
      why: "Arbeitgeber brauchen sie oft fuer dein Gehalt und deine Steuer.",
      when: "Kurz nach der Anmeldung. Meist musst du sie nicht extra beantragen.",
      requirements: ["Gueltige gemeldete Adresse", "Briefkasten mit deinem Namen", "Meldebestaetigung als Nachweis"],
      guide: [
        "Melde zuerst deine Adresse an.",
        "Warte auf den Brief mit deiner Steuer-ID.",
        "Bewahre den Brief gut auf.",
        "Teile die Steuer-ID deinem Arbeitgeber mit, wenn du arbeitest."
      ]
    },
    health_insurance: {
      title: "Krankenversicherung",
      description: "Pruefe, welche Krankenversicherung fuer deine Situation passt und wie du dich anmeldest.",
      what: "Du brauchst in Deutschland in der Regel eine Krankenversicherung.",
      why: "Sie ist fuer Arztbesuche wichtig und oft Pflicht.",
      when: "Sehr frueh. Spaetestens bevor du arbeitest, studierst oder offizielle Unterlagen einreichst.",
      requirements: ["Reisepass oder Ausweis", "Adresse in Deutschland", "Infos zu Arbeit, Studium oder Aufenthalt", "Manchmal Arbeitsvertrag oder Immatrikulation"],
      guide: [
        "Pruefe, ob fuer dich gesetzliche oder private Versicherung passt.",
        "Waehle eine Krankenkasse oder frage nach Beratung.",
        "Reiche die noetigen Unterlagen ein.",
        "Warte auf die Bestaetigung deiner Versicherung.",
        "Nutze die Bestaetigung fuer weitere Schritte."
      ]
    },
    bank_account: {
      title: "Bankkonto",
      description: "Ein deutsches Konto hilft spaeter bei Miete, Gehalt und Behoerden.",
      what: "Ein Bankkonto in Deutschland hilft dir beim Alltag und bei vielen Zahlungen.",
      why: "Miete, Gehalt und viele Rechnungen laufen einfacher ueber ein deutsches Konto.",
      when: "Moeglichst frueh, wenn du laenger in Deutschland bleibst.",
      requirements: ["Reisepass oder Ausweis", "Adresse in Deutschland", "Manchmal Meldebestaetigung", "Manchmal Aufenthaltstitel"],
      guide: [
        "Vergleiche Banken oder Online-Banken.",
        "Pruefe, welche Dokumente deine Bank braucht.",
        "Beantrage das Konto online oder vor Ort.",
        "Bestaetige deine Identitaet.",
        "Aktiviere dein Konto und hebe die Bankdaten gut auf."
      ]
    },
    residence_permit: {
      title: "Aufenthaltstitel",
      description: "Klaere, ob du einen Aufenthaltstitel brauchst oder schon alle Unterlagen dafuer hast.",
      what: "Der Aufenthaltstitel erlaubt dir, legal fuer laengere Zeit in Deutschland zu bleiben.",
      why: "Ohne passenden Status koennen Arbeit, Studium oder andere Schritte blockiert sein.",
      when: "So frueh wie moeglich, wenn du nicht frei ohne Titel bleiben kannst.",
      requirements: ["Reisepass", "Passfoto", "Nachweis fuer Wohnung oder Adresse", "Nachweis ueber Geld, Arbeit oder Studium", "Krankenversicherung"],
      guide: [
        "Pruefe, ob du einen Aufenthaltstitel brauchst.",
        "Sammle die Unterlagen fuer deinen Fall.",
        "Suche die zustaendige Auslaenderbehoerde.",
        "Buche einen Termin oder pruefe den Online-Antrag.",
        "Reiche den Antrag mit allen Unterlagen ein."
      ]
    },
    work_permit: {
      title: "Arbeitserlaubnis",
      description: "Wenn du arbeiten willst oder bald arbeitest, ist dieser Schritt oft wichtig.",
      what: "Die Arbeitserlaubnis regelt, ob und wie du in Deutschland arbeiten darfst.",
      why: "Arbeit ohne passenden Status kann Probleme machen.",
      when: "Bevor du einen Job startest oder spaetestens beim Beginn der Arbeit.",
      requirements: ["Reisepass", "Aufenthaltstitel oder Visum", "Arbeitsvertrag oder Jobangebot", "Manchmal Formular vom Arbeitgeber"],
      guide: [
        "Pruefe, ob dein aktueller Status Arbeit schon erlaubt.",
        "Sprich mit Arbeitgeber oder Behoerde, wenn du unsicher bist.",
        "Sammle die noetigen Nachweise.",
        "Reiche alles bei der zustaendigen Stelle ein.",
        "Starte die Arbeit erst, wenn alles geklaert ist."
      ]
    },
    broadcast_fee: {
      title: "Rundfunkbeitrag",
      description: "Wenn du eine Wohnung hast, solltest du den Rundfunkbeitrag frueh mitdenken.",
      what: "Der Rundfunkbeitrag ist ein fester Beitrag pro Wohnung in Deutschland.",
      why: "Wenn du ihn vergisst, koennen spaeter Briefe oder Nachzahlungen kommen.",
      when: "Kurz nach dem Einzug oder sobald du eine eigene Wohnung hast.",
      requirements: ["Adresse deiner Wohnung", "Einzugsdatum", "Manchmal Beitragsnummer von Mitbewohnern"],
      guide: [
        "Pruefe, ob fuer deine Wohnung schon gezahlt wird.",
        "Melde dich an, wenn noch niemand fuer die Wohnung registriert ist.",
        "Nutze das passende Online-Formular oder den Brief.",
        "Bewahre deine Beitragsnummer gut auf."
      ]
    },
    child_benefit: {
      title: "Kindergeld",
      description: "Wenn du Kinder hast, kann Kindergeld oder ein aehnlicher Schritt fuer dich relevant sein.",
      what: "Kindergeld ist Geld fuer Familien mit Kindern.",
      why: "Es kann dein monatliches Budget entlasten.",
      when: "Sobald du und dein Kind die wichtigen Voraussetzungen erfuellen.",
      requirements: ["Ausweis oder Pass", "Meldeadresse", "Geburtsurkunde vom Kind", "Steuer-ID von Eltern und Kind", "Manchmal Aufenthaltsnachweis"],
      guide: [
        "Pruefe, ob Kindergeld fuer deine Situation passt.",
        "Sammle die Unterlagen fuer dich und dein Kind.",
        "Fuelle den Antrag fuer die Familienkasse aus.",
        "Reiche den Antrag ein.",
        "Bewahre Bescheide und Nachweise gut auf."
      ]
    },
    university_enrollment: {
      title: "Uni-Einschreibung",
      description: "Wenn du fuer ein Studium hier bist, gehoert die Einschreibung meist zu den ersten Schritten.",
      what: "Mit der Einschreibung wirst du offiziell Studentin oder Student.",
      why: "Ohne Einschreibung fehlen oft wichtige Nachweise fuer Uni, Aufenthalt oder Versicherung.",
      when: "Vor Semesterstart oder in der Frist deiner Hochschule.",
      requirements: ["Zulassungsbescheid", "Reisepass oder Ausweis", "Krankenversicherungsnachweis", "Manchmal Zahlungsnachweis oder Fotos"],
      guide: [
        "Pruefe die Frist deiner Hochschule.",
        "Sammle alle Unterlagen fuer die Einschreibung.",
        "Lade Dokumente hoch oder gehe persoenlich hin, je nach Uni.",
        "Bezahle noetige Gebuehren oder Semesterbeitrag.",
        "Bewahre Immatrikulationsbescheinigung und Zugangsdaten auf."
      ]
    }
  }
};

const en: WelcomeCopy = {
  navLabel: "Welcome",
  homeBadge: "New in Germany?",
  homeTitle: "Welcome to Germany",
  homeText: "BureauCare builds a calm first roadmap for your most important steps in Germany.",
  homeAction: "Start guide",
  pageTitle: "Welcome to Germany",
  pageIntro: "We build you a personal roadmap so you can see what to do first in Germany and in which order.",
  onboardingBadge: "Onboarding",
  onboardingTitle: "Your start in Germany",
  onboardingText: "A few short answers are enough. Then BureauCare shows you the most important steps in the right order.",
  progress: "Step {current} of {total}",
  back: "Back",
  next: "Next",
  finish: "Create roadmap",
  saving: "Creating roadmap...",
  roadmapTitle: "Your plan",
  roadmapText: "This is your first personal roadmap. You can later mark steps manually as in progress or done.",
  roadmapProgress: "You have completed {done} of {total} steps.",
  roadmapEmpty: "As soon as your Welcome profile is saved, your plan appears here.",
  roadmapOpenDetail: "Open details",
  detailBack: "Back to roadmap",
  detailIntro: "Here you can see, in simple language, what this step is, what you need and what to do next.",
  detailWhatTitle: "What is this?",
  detailWhyTitle: "Why is this important?",
  detailWhenTitle: "When should you do this?",
  detailRequirementsTitle: "Documents you usually need",
  detailGuideTitle: "How to do it",
  detailGuideText: "Take the steps one by one. You do not need to do everything at once.",
  detailStatusTitle: "Status of this step",
  detailStatusText: "You can change the status here. Your roadmap will update right away.",
  detailPreparedTitle: "Prepared for later",
  detailPreparedText: "These areas are already planned. The actual features will be added in the next Welcome steps.",
  detailNotFound: "We could not find this Welcome step right now.",
  comingSoon: "Coming soon",
  futureActions: {
    form: { title: "Fill out form", text: "Later you can complete matching forms here in a simpler step-by-step flow." },
    upload: { title: "Upload document", text: "Later you can upload the most important documents for this step here." },
    reply: { title: "Write a reply", text: "If you later need an email or written reply, BureauCare will support you here." },
    office: { title: "Find the right office", text: "Later we can show you the right office or authority for this step." },
    appointment: { title: "Book an appointment", text: "If an appointment is needed, BureauCare will prepare that here later." }
  },
  status: { open: "Open", in_progress: "In progress", done: "Done" },
  stepActions: { open: "Mark as open", in_progress: "Mark as in progress", done: "Mark as done" },
  doneCount: "{done} done",
  questions: [
    {
      id: "reason",
      title: "Why are you in Germany?",
      text: "This helps BureauCare choose the most relevant first steps.",
      options: [
        { value: "study", label: "Study" },
        { value: "work", label: "Work" },
        { value: "training", label: "Training" },
        { value: "family", label: "Family" },
        { value: "au_pair", label: "Au-pair" },
        { value: "refugee", label: "Refugee / asylum" },
        { value: "other", label: "Other" }
      ]
    },
    { id: "nationality", title: "Nationality", text: "Optional. This may later help with residence and official forms.", placeholder: "For example: Italy", optional: "Optional" },
    { id: "city", title: "Which city do you live in?", text: "We can later use this for local offices and nearby hints.", placeholder: "For example: Berlin" },
    { id: "housing_status", title: "Do you already have housing?", text: "This helps with registration and first administrative steps.", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "temporary", label: "Temporary" }] },
    { id: "registration_status", title: "Have you already registered your address?", text: "In other words: is your residence officially registered already?", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unknown", label: "Not sure" }] },
    { id: "health_insurance_status", title: "Do you already have health insurance?", text: "This is important for many later steps.", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "unknown", label: "Not sure" }] },
    { id: "work_status", title: "Are you already working in Germany?", text: "This helps with tax, insurance and work permit topics.", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "soon", label: "Soon" }] },
    { id: "has_children", title: "Do you have children?", text: "This helps BureauCare understand family-related support.", options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }] },
    { id: "german_level", title: "Do you speak German?", text: "Then we can better match how simple texts should be.", options: [{ value: "none", label: "Not at all" }, { value: "basic", label: "A little" }, { value: "good", label: "Well" }] }
  ],
  steps: {
    city_registration: {
      title: "Address registration",
      description: "Register your address at the local registration office. This is often one of the first important steps.",
      what: "You officially register where you live in Germany.",
      why: "Many other steps depend on it. Without registration, many things become harder.",
      when: "As early as possible, once you have an address.",
      requirements: ["Passport or ID", "Landlord confirmation", "Registration form", "Sometimes rental contract"],
      guide: [
        "Check which registration office is responsible for your address.",
        "Book an appointment if your city needs one.",
        "Fill out the registration form.",
        "Take all documents to the appointment.",
        "Receive your registration confirmation."
      ]
    },
    tax_id: {
      title: "Tax ID",
      description: "After address registration, your tax ID is often sent to you by post.",
      what: "The tax ID is your personal number for the tax office.",
      why: "Employers often need it for salary and taxes.",
      when: "Soon after registration. In many cases you do not need to apply separately.",
      requirements: ["Registered address", "Mailbox with your name", "Registration confirmation as backup"],
      guide: [
        "Register your address first.",
        "Wait for the letter with your tax ID.",
        "Keep the letter in a safe place.",
        "Share the tax ID with your employer if you are working."
      ]
    },
    health_insurance: {
      title: "Health insurance",
      description: "Check which health insurance fits your situation and how to register for it.",
      what: "In Germany, you usually need health insurance.",
      why: "It is important for doctor visits and is often required.",
      when: "Very early, especially before work, study or official applications.",
      requirements: ["Passport or ID", "Address in Germany", "Information about work, study or residence", "Sometimes work contract or university enrollment"],
      guide: [
        "Check whether public or private insurance fits your case.",
        "Choose a health insurance provider or ask for advice.",
        "Submit the required documents.",
        "Wait for the insurance confirmation.",
        "Use that confirmation for later steps."
      ]
    },
    bank_account: {
      title: "Bank account",
      description: "A German bank account helps with rent, salary and many official processes.",
      what: "A bank account in Germany makes everyday payments easier.",
      why: "Rent, salary and many regular payments work more smoothly with it.",
      when: "Early on, if you plan to stay in Germany for a while.",
      requirements: ["Passport or ID", "Address in Germany", "Sometimes registration confirmation", "Sometimes residence permit"],
      guide: [
        "Compare banks or online banks.",
        "Check which documents the bank needs.",
        "Apply online or in person.",
        "Confirm your identity.",
        "Activate the account and keep your bank details safe."
      ]
    },
    residence_permit: {
      title: "Residence permit",
      description: "Clarify whether you need a residence permit and which documents you need.",
      what: "A residence permit allows you to stay in Germany for a longer period.",
      why: "Without the right status, work, study or other steps can be blocked.",
      when: "As early as possible if you cannot stay freely without one.",
      requirements: ["Passport", "Passport photo", "Proof of address", "Proof of money, work or study", "Health insurance"],
      guide: [
        "Check whether you need a residence permit.",
        "Collect the documents for your situation.",
        "Find the responsible immigration office.",
        "Book an appointment or check the online application.",
        "Submit the application with all documents."
      ]
    },
    work_permit: {
      title: "Work permit",
      description: "If you want to work or will start soon, this step can be important.",
      what: "A work permit defines whether and how you may work in Germany.",
      why: "Working without the right status can cause problems.",
      when: "Before you start a job, or at the latest when work begins.",
      requirements: ["Passport", "Residence permit or visa", "Work contract or job offer", "Sometimes employer form"],
      guide: [
        "Check whether your current status already allows work.",
        "Ask your employer or the office if you are unsure.",
        "Collect the required documents.",
        "Submit everything to the responsible office.",
        "Start working only after it is clarified."
      ]
    },
    broadcast_fee: {
      title: "Broadcast fee",
      description: "If you have housing, it helps to think about the broadcast fee early.",
      what: "The broadcast fee is a fixed payment per home in Germany.",
      why: "If you ignore it, letters or back payments can come later.",
      when: "Soon after moving in or once you have your own place.",
      requirements: ["Your address", "Move-in date", "Sometimes a contribution number from flatmates"],
      guide: [
        "Check whether someone already pays for the home.",
        "Register if nobody is registered for that address.",
        "Use the right online form or letter.",
        "Keep your contribution number in a safe place."
      ]
    },
    child_benefit: {
      title: "Child benefit",
      description: "If you have children, child benefit or a similar step may be relevant for you.",
      what: "Child benefit is monthly support for families with children.",
      why: "It can help your monthly budget.",
      when: "As soon as you and your child meet the main conditions.",
      requirements: ["Passport or ID", "Registered address", "Child birth certificate", "Tax ID of parent and child", "Sometimes residence proof"],
      guide: [
        "Check whether child benefit fits your situation.",
        "Collect the documents for you and your child.",
        "Fill out the family benefit application.",
        "Submit the application.",
        "Keep decisions and letters in a safe place."
      ]
    },
    university_enrollment: {
      title: "University enrollment",
      description: "If you are here for study, enrollment is usually one of the first steps.",
      what: "Enrollment makes you an official student.",
      why: "Without it, you often miss important proof for university, residence or insurance.",
      when: "Before the semester starts or within your university deadline.",
      requirements: ["Admission letter", "Passport or ID", "Proof of health insurance", "Sometimes payment confirmation or photos"],
      guide: [
        "Check your university deadline.",
        "Collect all enrollment documents.",
        "Upload the documents or go in person, depending on the university.",
        "Pay fees or semester contribution if needed.",
        "Keep your enrollment confirmation and access details safe."
      ]
    }
  }
};

const zh: WelcomeCopy = {
  navLabel: "Welcome",
  homeBadge: "\u521d\u6765\u5fb7\u56fd\uff1f",
  homeTitle: "Welcome to Germany",
  homeText: "BureauCare \u4f1a\u4e3a\u4f60\u751f\u6210\u4e00\u4e2a\u51b7\u9759\u6e05\u6670\u7684\u7b2c\u4e00\u9636\u6bb5\u8def\u7ebf\u56fe\u3002",
  homeAction: "\u5f00\u59cb\u5411\u5bfc",
  pageTitle: "Welcome to Germany",
  pageIntro: "BureauCare \u4f1a\u6839\u636e\u4f60\u7684\u60c5\u51b5\u751f\u6210\u4e00\u4e2a\u4e2a\u4eba\u8def\u7ebf\u56fe\uff0c\u5e2e\u4f60\u660e\u767d\u5728\u5fb7\u56fd\u8981\u5148\u5904\u7406\u4ec0\u4e48\u3002",
  onboardingBadge: "\u5f15\u5bfc",
  onboardingTitle: "\u4f60\u5728\u5fb7\u56fd\u7684\u8d77\u70b9",
  onboardingText: "\u53ea\u9700\u8981\u56de\u7b54\u51e0\u4e2a\u7b80\u5355\u95ee\u9898\uff0c BureauCare \u5c31\u4f1a\u4e3a\u4f60\u6574\u7406\u91cd\u8981\u6b65\u9aa4\u3002",
  progress: "\u7b2c {current} / {total} \u6b65",
  back: "\u8fd4\u56de",
  next: "\u4e0b\u4e00\u6b65",
  finish: "\u751f\u6210\u8def\u7ebf\u56fe",
  saving: "\u6b63\u5728\u751f\u6210\u8def\u7ebf\u56fe...",
  roadmapTitle: "\u4f60\u7684\u8ba1\u5212",
  roadmapText: "\u8fd9\u662f\u4f60\u7684\u7b2c\u4e00\u7248\u4e2a\u4eba\u8def\u7ebf\u56fe\u3002\u4e4b\u540e\u4f60\u53ef\u4ee5\u624b\u52a8\u628a\u6bcf\u4e00\u6b65\u6807\u8bb0\u4e3a\u8fdb\u884c\u4e2d\u6216\u5df2\u5b8c\u6210\u3002",
  roadmapProgress: "\u4f60\u5df2\u5b8c\u6210 {done} / {total} \u4e2a\u6b65\u9aa4\u3002",
  roadmapEmpty: "\u4f60\u4fdd\u5b58 Welcome \u8d44\u6599\u540e\uff0c\u4e2a\u4eba\u8def\u7ebf\u56fe\u5c31\u4f1a\u51fa\u73b0\u5728\u8fd9\u91cc\u3002",
  roadmapOpenDetail: "\u67e5\u770b\u8be6\u60c5",
  detailBack: "\u8fd4\u56de\u8def\u7ebf\u56fe",
  detailIntro: "\u8fd9\u91cc\u4f1a\u7528\u7b80\u5355\u7684\u8bdd\u544a\u8bc9\u4f60\uff1a\u8fd9\u4e00\u6b65\u662f\u4ec0\u4e48\uff0c\u4e3a\u4ec0\u4e48\u91cd\u8981\uff0c\u4ee5\u53ca\u4f60\u9700\u8981\u505a\u4ec0\u4e48\u3002",
  detailWhatTitle: "\u8fd9\u662f\u4ec0\u4e48\uff1f",
  detailWhyTitle: "\u4e3a\u4ec0\u4e48\u91cd\u8981\uff1f",
  detailWhenTitle: "\u4ec0\u4e48\u65f6\u5019\u505a\uff1f",
  detailRequirementsTitle: "\u4f60\u901a\u5e38\u9700\u8981\u8fd9\u4e9b\u6750\u6599",
  detailGuideTitle: "\u4f60\u53ef\u4ee5\u8fd9\u6837\u505a",
  detailGuideText: "\u6309\u987a\u5e8f\u4e00\u6b65\u4e00\u6b65\u6765\u5c31\u53ef\u4ee5\u3002\u4e0d\u9700\u8981\u4e00\u6b21\u5168\u90e8\u505a\u5b8c\u3002",
  detailStatusTitle: "\u8fd9\u4e00\u6b65\u7684\u72b6\u6001",
  detailStatusText: "\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u4fee\u6539\u72b6\u6001\uff0c\u8def\u7ebf\u56fe\u4f1a\u540c\u6b65\u66f4\u65b0\u3002",
  detailPreparedTitle: "\u540e\u9762\u4f1a\u52a0\u5165\u7684\u529f\u80fd",
  detailPreparedText: "\u8fd9\u4e9b\u533a\u57df\u5df2\u7ecf\u9884\u7559\u597d\u4e86\u3002\u5b83\u4eec\u4f1a\u5728 Welcome Mode \u540e\u7eed\u7248\u672c\u4e2d\u52a0\u5165\u3002",
  detailNotFound: "\u73b0\u5728\u6682\u65f6\u627e\u4e0d\u5230\u8fd9\u4e2a Welcome \u6b65\u9aa4\u3002",
  comingSoon: "\u5f88\u5feb\u63a8\u51fa",
  futureActions: {
    form: { title: "\u586b\u5199\u8868\u683c", text: "\u4e4b\u540e\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u7528\u66f4\u7b80\u5355\u7684\u65b9\u5f0f\u4e00\u6b65\u4e00\u6b65\u586b\u5199\u8868\u683c\u3002" },
    upload: { title: "\u4e0a\u4f20\u6587\u6863", text: "\u4e4b\u540e\u4f60\u53ef\u4ee5\u5728\u8fd9\u91cc\u4e3a\u8fd9\u4e00\u6b65\u4e0a\u4f20\u91cd\u8981\u6750\u6599\u3002" },
    reply: { title: "\u5199\u56de\u590d", text: "\u5982\u679c\u4f60\u4e4b\u540e\u9700\u8981\u53d1\u90ae\u4ef6\u6216\u5199\u56de\u4fe1\uff0c BureauCare \u4f1a\u5728\u8fd9\u91cc\u5e2e\u4f60\u3002" },
    office: { title: "\u67e5\u627e\u5bf9\u53e3\u673a\u6784", text: "\u4e4b\u540e\u8fd9\u91cc\u4f1a\u5e2e\u4f60\u627e\u5230\u5bf9\u5e94\u7684\u90e8\u95e8\u6216\u529e\u4e8b\u673a\u6784\u3002" },
    appointment: { title: "\u9884\u7ea6", text: "\u5982\u679c\u8fd9\u4e00\u6b65\u9700\u8981\u9884\u7ea6\uff0c BureauCare \u4e4b\u540e\u4f1a\u5728\u8fd9\u91cc\u4e3a\u4f60\u51c6\u5907\u3002" }
  },
  status: { open: "\u672a\u5f00\u59cb", in_progress: "\u8fdb\u884c\u4e2d", done: "\u5df2\u5b8c\u6210" },
  stepActions: { open: "\u6807\u8bb0\u4e3a\u672a\u5f00\u59cb", in_progress: "\u6807\u8bb0\u4e3a\u8fdb\u884c\u4e2d", done: "\u6807\u8bb0\u4e3a\u5df2\u5b8c\u6210" },
  doneCount: "\u5df2\u5b8c\u6210 {done} \u9879",
  questions: [
    { id: "reason", title: "\u4f60\u4e3a\u4ec0\u4e48\u6765\u5fb7\u56fd\uff1f", text: "BureauCare \u4f1a\u6839\u636e\u8fd9\u4e2a\u4fe1\u606f\u6574\u7406\u6700\u91cd\u8981\u7684\u7b2c\u4e00\u6279\u6b65\u9aa4\u3002", options: [{ value: "study", label: "\u7559\u5b66" }, { value: "work", label: "\u5de5\u4f5c" }, { value: "training", label: "\u57f9\u8bad / \u804c\u4e1a\u6559\u80b2" }, { value: "family", label: "\u5bb6\u5ead" }, { value: "au_pair", label: "Au-pair" }, { value: "refugee", label: "\u96be\u6c11 / \u907f\u96be" }, { value: "other", label: "\u5176\u4ed6" }] },
    { id: "nationality", title: "\u56fd\u7c4d", text: "\u53ef\u9009\u3002\u4e4b\u540e\u5728\u5c45\u7559\u548c\u8868\u683c\u8fc7\u7a0b\u4e2d\u53ef\u80fd\u4f1a\u6709\u5e2e\u52a9\u3002", placeholder: "\u4f8b\u5982\uff1a\u610f\u5927\u5229", optional: "\u53ef\u9009" },
    { id: "city", title: "\u4f60\u73b0\u5728\u4f4f\u5728\u54ea\u4e2a\u57ce\u5e02\uff1f", text: "\u4e4b\u540e BureauCare \u53ef\u4ee5\u6839\u636e\u57ce\u5e02\u7ed9\u4f60\u672c\u5730\u63d0\u793a\u3002", placeholder: "\u4f8b\u5982\uff1aBerlin" },
    { id: "housing_status", title: "\u4f60\u5df2\u7ecf\u6709\u4f4f\u5904\u4e86\u5417\uff1f", text: "\u8fd9\u4f1a\u5f71\u54cd\u767b\u8bb0\u548c\u5f00\u59cb\u9636\u6bb5\u7684\u4e00\u4e9b\u6b65\u9aa4\u3002", options: [{ value: "yes", label: "\u6709" }, { value: "no", label: "\u6ca1\u6709" }, { value: "temporary", label: "\u6682\u65f6\u7684" }] },
    { id: "registration_status", title: "\u4f60\u5df2\u7ecf\u529e\u597d\u4f4f\u5740\u767b\u8bb0\u4e86\u5417\uff1f", text: "\u4e5f\u5c31\u662f\u8bf4\uff0c\u4f60\u7684\u5c45\u4f4f\u5730\u5740\u5df2\u7ecf\u6b63\u5f0f\u767b\u8bb0\u4e86\u5417\uff1f", options: [{ value: "yes", label: "\u662f" }, { value: "no", label: "\u5426" }, { value: "unknown", label: "\u4e0d\u786e\u5b9a" }] },
    { id: "health_insurance_status", title: "\u4f60\u5df2\u7ecf\u6709\u533b\u7597\u4fdd\u9669\u4e86\u5417\uff1f", text: "\u8fd9\u5bf9\u5f88\u591a\u540e\u7eed\u6b65\u9aa4\u90fd\u5f88\u91cd\u8981\u3002", options: [{ value: "yes", label: "\u662f" }, { value: "no", label: "\u5426" }, { value: "unknown", label: "\u4e0d\u786e\u5b9a" }] },
    { id: "work_status", title: "\u4f60\u5df2\u7ecf\u5728\u5fb7\u56fd\u5de5\u4f5c\u4e86\u5417\uff1f", text: "\u8fd9\u4f1a\u5f71\u54cd\u7a0e\u52a1\u3001\u4fdd\u9669\u548c\u5de5\u4f5c\u8bb8\u53ef\u7b49\u95ee\u9898\u3002", options: [{ value: "yes", label: "\u662f" }, { value: "no", label: "\u5426" }, { value: "soon", label: "\u5f88\u5feb" }] },
    { id: "has_children", title: "\u4f60\u6709\u5b69\u5b50\u5417\uff1f", text: "\u8fd9\u53ef\u4ee5\u5e2e\u52a9 BureauCare \u5224\u65ad\u5bb6\u5ead\u76f8\u5173\u652f\u6301\u662f\u5426\u548c\u4f60\u6709\u5173\u3002", options: [{ value: "yes", label: "\u6709" }, { value: "no", label: "\u6ca1\u6709" }] },
    { id: "german_level", title: "\u4f60\u4f1a\u8bf4\u5fb7\u8bed\u5417\uff1f", text: "\u8fd9\u4f1a\u5e2e\u52a9 BureauCare \u51b3\u5b9a\u6587\u5b57\u9700\u8981\u591a\u7b80\u5355\u3002", options: [{ value: "none", label: "\u4e0d\u4f1a" }, { value: "basic", label: "\u4f1a\u4e00\u70b9" }, { value: "good", label: "\u6bd4\u8f83\u597d" }] }
  ],
  steps: {
    city_registration: {
      title: "\u4f4f\u5740\u767b\u8bb0",
      description: "\u53bb\u5c45\u6c11\u767b\u8bb0\u5904\u529e\u7406\u4f4f\u5740\u767b\u8bb0\u3002\u8fd9\u901a\u5e38\u662f\u6700\u5f00\u59cb\u4e5f\u6700\u91cd\u8981\u7684\u6b65\u9aa4\u4e4b\u4e00\u3002",
      what: "\u8fd9\u4e00\u6b65\u662f\u628a\u4f60\u5728\u5fb7\u56fd\u7684\u4f4f\u5740\u6b63\u5f0f\u767b\u8bb0\u3002",
      why: "\u5f88\u591a\u540e\u9762\u7684\u6b65\u9aa4\u90fd\u8981\u5148\u6709\u5b83\u3002",
      when: "\u53ea\u8981\u4f60\u5df2\u7ecf\u6709\u5730\u5740\uff0c\u5c31\u5c3d\u91cf\u65e9\u529e\u3002",
      requirements: ["\u62a4\u7167\u6216\u8eab\u4efd\u8bc1", "\u623f\u4e3b\u786e\u8ba4\u6587\u4ef6", "\u767b\u8bb0\u8868\u683c", "\u6709\u65f6\u9700\u8981\u79df\u623f\u5408\u540c"],
      guide: ["\u5148\u786e\u8ba4\u54ea\u4e2a\u529e\u4e8b\u5904\u7ba1\u4f60\u7684\u5730\u5740\u3002", "\u5982\u679c\u9700\u8981\uff0c\u5148\u9884\u7ea6\u3002", "\u586b\u597d\u767b\u8bb0\u8868\u683c\u3002", "\u5e26\u4e0a\u6240\u6709\u6750\u6599\u53bb\u529e\u7406\u3002", "\u62ff\u5230\u767b\u8bb0\u8bc1\u660e\u3002"]
    },
    tax_id: {
      title: "\u7a0e\u53f7",
      description: "\u529e\u597d\u5730\u5740\u767b\u8bb0\u540e\uff0c\u7a0e\u53f7\u901a\u5e38\u4f1a\u901a\u8fc7\u90ae\u5bc4\u5230\u4f60\u7684\u5730\u5740\u3002",
      what: "\u7a0e\u53f7\u662f\u4f60\u5728\u7a0e\u52a1\u65b9\u9762\u7684\u4e2a\u4eba\u53f7\u7801\u3002",
      why: "\u5de5\u4f5c\u65f6\uff0c\u96c7\u4e3b\u5f88\u53ef\u80fd\u9700\u8981\u5b83\u3002",
      when: "\u901a\u5e38\u5728\u4f4f\u5740\u767b\u8bb0\u540e\u4e0d\u4e45\u3002",
      requirements: ["\u5df2\u7ecf\u767b\u8bb0\u7684\u5730\u5740", "\u6709\u4f60\u540d\u5b57\u7684\u4fe1\u7bb1", "\u767b\u8bb0\u8bc1\u660e"],
      guide: ["\u5148\u529e\u7406\u4f4f\u5740\u767b\u8bb0\u3002", "\u7b49\u7a0e\u53f7\u4fe1\u4ef6\u5bc4\u5230\u5bb6\u91cc\u3002", "\u628a\u4fe1\u4ef6\u6536\u597d\u3002", "\u5de5\u4f5c\u65f6\u628a\u7a0e\u53f7\u7ed9\u96c7\u4e3b\u3002"]
    },
    health_insurance: {
      title: "\u533b\u7597\u4fdd\u9669",
      description: "\u5f04\u6e05\u54ea\u79cd\u533b\u7597\u4fdd\u9669\u9002\u5408\u4f60\uff0c\u4ee5\u53ca\u5982\u4f55\u53c2\u4fdd\u3002",
      what: "\u5728\u5fb7\u56fd\uff0c\u5927\u591a\u6570\u4eba\u90fd\u9700\u8981\u533b\u7597\u4fdd\u9669\u3002",
      why: "\u770b\u75c5\u548c\u5f88\u591a\u5b98\u65b9\u6d41\u7a0b\u90fd\u4f1a\u7528\u5230\u5b83\u3002",
      when: "\u5f88\u65e9\u5c31\u5e94\u8be5\u5904\u7406\uff0c\u5c24\u5176\u662f\u5728\u5de5\u4f5c\u6216\u5b66\u4e60\u524d\u3002",
      requirements: ["\u62a4\u7167\u6216\u8eab\u4efd\u8bc1", "\u5fb7\u56fd\u5730\u5740", "\u5de5\u4f5c\u3001\u5b66\u4e60\u6216\u5c45\u7559\u4fe1\u606f", "\u6709\u65f6\u9700\u8981\u5408\u540c\u6216\u5f55\u53d6\u8bc1\u660e"],
      guide: ["\u5148\u770b\u770b\u516c\u4fdd\u8fd8\u662f\u79c1\u4fdd\u66f4\u9002\u5408\u4f60\u3002", "\u9009\u62e9\u4e00\u5bb6\u4fdd\u9669\u6216\u5148\u54a8\u8be2\u3002", "\u63d0\u4ea4\u6750\u6599\u3002", "\u7b49\u5bf9\u65b9\u786e\u8ba4\u3002", "\u628a\u4fdd\u9669\u8bc1\u660e\u7528\u5728\u540e\u9762\u7684\u6b65\u9aa4\u91cc\u3002"]
    },
    bank_account: {
      title: "\u94f6\u884c\u8d26\u6237",
      description: "\u5fb7\u56fd\u94f6\u884c\u8d26\u6237\u5bf9\u623f\u79df\u3001\u5de5\u8d44\u548c\u8bb8\u591a\u5b98\u65b9\u6d41\u7a0b\u90fd\u5f88\u6709\u5e2e\u52a9\u3002",
      what: "\u5f00\u4e00\u4e2a\u5fb7\u56fd\u94f6\u884c\u8d26\u6237\uff0c\u65e5\u5e38\u751f\u6d3b\u4f1a\u65b9\u4fbf\u5f88\u591a\u3002",
      why: "\u623f\u79df\u3001\u5de5\u8d44\u548c\u8bb8\u591a\u4ed8\u6b3e\u90fd\u4f1a\u66f4\u65b9\u4fbf\u3002",
      when: "\u5982\u679c\u4f60\u4f1a\u5728\u5fb7\u56fd\u5f85\u4e00\u6bb5\u65f6\u95f4\uff0c\u6700\u597d\u5c3d\u65e9\u529e\u3002",
      requirements: ["\u62a4\u7167\u6216\u8eab\u4efd\u8bc1", "\u5fb7\u56fd\u5730\u5740", "\u6709\u65f6\u9700\u8981\u767b\u8bb0\u8bc1\u660e", "\u6709\u65f6\u9700\u8981\u5c45\u7559\u6587\u4ef6"],
      guide: ["\u5148\u6bd4\u8f83\u94f6\u884c\u6216\u7ebf\u4e0a\u94f6\u884c\u3002", "\u770b\u6e05\u695a\u9700\u8981\u4ec0\u4e48\u6750\u6599\u3002", "\u5728\u7ebf\u6216\u5230\u5e97\u7533\u8bf7\u3002", "\u5b8c\u6210\u8eab\u4efd\u9a8c\u8bc1\u3002", "\u6fc0\u6d3b\u8d26\u6237\u5e76\u4fdd\u5b58\u597d\u94f6\u884c\u4fe1\u606f\u3002"]
    },
    residence_permit: {
      title: "\u5c45\u7559\u8bb8\u53ef",
      description: "\u5f04\u6e05\u4f60\u662f\u5426\u9700\u8981\u5c45\u7559\u8bb8\u53ef\uff0c\u4ee5\u53ca\u9700\u8981\u54ea\u4e9b\u6750\u6599\u3002",
      what: "\u5c45\u7559\u8bb8\u53ef\u662f\u4f60\u5728\u5fb7\u56fd\u957f\u671f\u5c45\u7559\u7684\u91cd\u8981\u6587\u4ef6\u3002",
      why: "\u5982\u679c\u6ca1\u6709\u6b63\u786e\u7684\u5c45\u7559\u72b6\u6001\uff0c\u5de5\u4f5c\u3001\u5b66\u4e60\u6216\u5176\u4ed6\u6d41\u7a0b\u53ef\u80fd\u4f1a\u88ab\u5361\u4f4f\u3002",
      when: "\u5982\u679c\u4f60\u4e0d\u80fd\u4e0d\u529e\u5c31\u76f4\u63a5\u5c45\u7559\uff0c\u5c31\u5c3d\u65e9\u5904\u7406\u3002",
      requirements: ["\u62a4\u7167", "\u8bc1\u4ef6\u7167", "\u5730\u5740\u8bc1\u660e", "\u5de5\u4f5c\u3001\u5b66\u4e60\u6216\u8d44\u91d1\u8bc1\u660e", "\u533b\u7597\u4fdd\u9669"],
      guide: ["\u5148\u786e\u8ba4\u4f60\u662f\u5426\u9700\u8981\u5c45\u7559\u8bb8\u53ef\u3002", "\u6536\u96c6\u9002\u5408\u4f60\u60c5\u51b5\u7684\u6750\u6599\u3002", "\u627e\u5230\u5bf9\u53e3\u7684\u5916\u56fd\u4eba\u7ba1\u7406\u673a\u6784\u3002", "\u9884\u7ea6\u6216\u67e5\u770b\u662f\u5426\u53ef\u4ee5\u7ebf\u4e0a\u7533\u8bf7\u3002", "\u63d0\u4ea4\u7533\u8bf7\u548c\u5168\u90e8\u6750\u6599\u3002"]
    },
    work_permit: {
      title: "\u5de5\u4f5c\u8bb8\u53ef",
      description: "\u5982\u679c\u4f60\u5df2\u7ecf\u5de5\u4f5c\u6216\u8005\u5f88\u5feb\u5f00\u59cb\u5de5\u4f5c\uff0c\u8fd9\u4e00\u6b65\u5f88\u53ef\u80fd\u5f88\u91cd\u8981\u3002",
      what: "\u5de5\u4f5c\u8bb8\u53ef\u8bf4\u660e\u4f60\u80fd\u4e0d\u80fd\u5728\u5fb7\u56fd\u5de5\u4f5c\u3002",
      why: "\u5982\u679c\u6ca1\u6709\u6b63\u786e\u7684\u5de5\u4f5c\u8d44\u683c\uff0c\u53ef\u80fd\u4f1a\u6709\u95ee\u9898\u3002",
      when: "\u6700\u597d\u5728\u5de5\u4f5c\u524d\u5c31\u5f04\u6e05\u695a\u3002",
      requirements: ["\u62a4\u7167", "\u7b7e\u8bc1\u6216\u5c45\u7559\u8bb8\u53ef", "\u52b3\u52a8\u5408\u540c\u6216 offer", "\u6709\u65f6\u9700\u8981\u96c7\u4e3b\u6587\u4ef6"],
      guide: ["\u5148\u67e5\u4f60\u73b0\u5728\u7684\u72b6\u6001\u662f\u5426\u5df2\u7ecf\u5141\u8bb8\u5de5\u4f5c\u3002", "\u5982\u679c\u4e0d\u786e\u5b9a\uff0c\u53ef\u4ee5\u95ee\u96c7\u4e3b\u6216\u673a\u6784\u3002", "\u6536\u96c6\u6240\u9700\u6750\u6599\u3002", "\u63d0\u4ea4\u5230\u5bf9\u53e3\u673a\u6784\u3002", "\u786e\u8ba4\u6e05\u695a\u540e\u518d\u5f00\u59cb\u5de5\u4f5c\u3002"]
    },
    broadcast_fee: {
      title: "\u5e7f\u64ad\u7535\u89c6\u8d39",
      description: "\u5982\u679c\u4f60\u5df2\u7ecf\u6709\u4f4f\u5904\uff0c\u6700\u597d\u5c3d\u65e9\u628a\u8fd9\u4ef6\u4e8b\u60f3\u8d77\u6765\u3002",
      what: "\u8fd9\u662f\u5728\u5fb7\u56fd\u6309\u4f4f\u623f\u6536\u7684\u4e00\u9879\u56fa\u5b9a\u8d39\u7528\u3002",
      why: "\u5982\u679c\u5fd8\u4e86\uff0c\u540e\u9762\u53ef\u80fd\u4f1a\u6536\u5230\u50ac\u7f34\u6216\u8865\u7f34\u901a\u77e5\u3002",
      when: "\u642c\u5bb6\u540e\u4e0d\u4e45\uff0c\u6216\u8005\u4f60\u5f00\u59cb\u6709\u81ea\u5df1\u7684\u4f4f\u5904\u65f6\u3002",
      requirements: ["\u4f4f\u5740", "\u642c\u5165\u65e5\u671f", "\u6709\u65f6\u9700\u8981\u5ba4\u53cb\u7684\u8d39\u53f7"],
      guide: ["\u5148\u770b\u8fd9\u4e2a\u4f4f\u5740\u662f\u4e0d\u662f\u5df2\u7ecf\u6709\u4eba\u7f34\u8fc7\u3002", "\u5982\u679c\u8fd8\u6ca1\u6709\uff0c\u5c31\u53bb\u767b\u8bb0\u3002", "\u7528\u5bf9\u5e94\u7684\u7f51\u9875\u6216\u4fe1\u4ef6\u8868\u683c\u5904\u7406\u3002", "\u628a\u4f60\u7684\u53f7\u7801\u4fdd\u5b58\u597d\u3002"]
    },
    child_benefit: {
      title: "\u513f\u7ae5\u91d1",
      description: "\u5982\u679c\u4f60\u6709\u5b69\u5b50\uff0c\u513f\u7ae5\u91d1\u6216\u7c7b\u4f3c\u6b65\u9aa4\u53ef\u80fd\u4e0e\u4f60\u6709\u5173\u3002",
      what: "\u513f\u7ae5\u91d1\u662f\u7ed9\u6709\u5b69\u5b50\u7684\u5bb6\u5ead\u7684\u8d44\u91d1\u652f\u6301\u3002",
      why: "\u5b83\u53ef\u4ee5\u51cf\u8f7b\u4f60\u6bcf\u4e2a\u6708\u7684\u538b\u529b\u3002",
      when: "\u4f60\u548c\u5b69\u5b50\u6ee1\u8db3\u4e3b\u8981\u6761\u4ef6\u540e\uff0c\u5c31\u53ef\u4ee5\u5c3d\u65e9\u7533\u8bf7\u3002",
      requirements: ["\u8eab\u4efd\u8bc1\u4ef6", "\u767b\u8bb0\u5730\u5740", "\u5b69\u5b50\u7684\u51fa\u751f\u8bc1\u660e", "\u7236\u6bcd\u548c\u5b69\u5b50\u7684\u7a0e\u53f7", "\u6709\u65f6\u9700\u8981\u5c45\u7559\u8bc1\u660e"],
      guide: ["\u5148\u786e\u8ba4\u8fd9\u9879\u652f\u6301\u662f\u5426\u9002\u5408\u4f60\u3002", "\u6536\u96c6\u4f60\u548c\u5b69\u5b50\u7684\u6750\u6599\u3002", "\u586b\u5199\u7533\u8bf7\u3002", "\u63d0\u4ea4\u7533\u8bf7\u3002", "\u628a\u901a\u77e5\u548c\u51b3\u5b9a\u4fdd\u5b58\u597d\u3002"]
    },
    university_enrollment: {
      title: "\u5927\u5b66\u6ce8\u518c",
      description: "\u5982\u679c\u4f60\u662f\u6765\u8bfb\u4e66\u7684\uff0c\u5b66\u6821\u6ce8\u518c\u901a\u5e38\u5c5e\u4e8e\u6700\u5f00\u59cb\u7684\u51e0\u4e2a\u6b65\u9aa4\u3002",
      what: "\u5b8c\u6210\u6ce8\u518c\u540e\uff0c\u4f60\u624d\u662f\u6b63\u5f0f\u5b66\u751f\u3002",
      why: "\u5b66\u6821\u3001\u5c45\u7559\u6216\u4fdd\u9669\u7b49\u5f88\u591a\u8bc1\u660e\u90fd\u4f1a\u7528\u5230\u5b83\u3002",
      when: "\u5728\u5f00\u5b66\u524d\u6216\u5b66\u6821\u89c4\u5b9a\u7684\u622a\u6b62\u65e5\u671f\u524d\u3002",
      requirements: ["\u5f55\u53d6\u901a\u77e5", "\u62a4\u7167\u6216\u8eab\u4efd\u8bc1", "\u533b\u4fdd\u8bc1\u660e", "\u6709\u65f6\u9700\u8981\u4ed8\u8d39\u8bc1\u660e\u6216\u7167\u7247"],
      guide: ["\u5148\u770b\u5b66\u6821\u7684\u622a\u6b62\u65f6\u95f4\u3002", "\u6536\u96c6\u6ce8\u518c\u9700\u8981\u7684\u6750\u6599\u3002", "\u6309\u5b66\u6821\u8981\u6c42\u4e0a\u4f20\u6216\u73b0\u573a\u63d0\u4ea4\u3002", "\u5982\u679c\u9700\u8981\uff0c\u4ed8\u6e05\u8d39\u7528\u6216\u5b66\u671f\u8d39\u3002", "\u4fdd\u5b58\u597d\u4f60\u7684\u6ce8\u518c\u8bc1\u660e\u548c\u767b\u5f55\u4fe1\u606f\u3002"]
    }
  }
};

const fallbackMap: Record<SupportedLanguage, WelcomeCopy> = {
  de,
  en,
  tr: en,
  uk: en,
  es: en,
  zh
};

export function getWelcomeCopy(locale: string | null | undefined) {
  return fallbackMap[normalizePreferredLanguage(locale)];
}

export function formatWelcomeText(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? ""));
}
