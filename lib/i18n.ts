import { getLanguageLabel, normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

export type AppLocale = SupportedLanguage;

export function getDateLocale(locale: AppLocale) {
  switch (locale) {
    case "en":
      return "en-GB";
    case "tr":
      return "tr-TR";
    case "uk":
      return "uk-UA";
    case "es":
      return "es-ES";
    case "zh":
      return "zh-CN";
    default:
      return "de-DE";
  }
}

type Copy = {
  nav: { home: string; upload: string; cases: string; processes: string; refunds: string; welcome: string; tasks: string; settings: string; desk: string; brand: string };
  common: {
    uploaded: string;
    analysisAvailable: string;
    analysisPending: string;
    unknown: string;
    noClearDeadline: string;
    deadline: string;
    subject: string;
    sender: string;
    urgency: string;
    statusOpen: string;
    statusDone: string;
    document: string;
    openDocument: string;
    saveInProgress: string;
    moreDetails: string;
    shortExplained: string;
    signOut: string;
    dateUploaded: string;
    currentStatus: string;
    name: string;
    language: string;
    session: string;
  };
  urgency: { high: string; medium: string; low: string; unclear: string };
  actionMode: { online: string; onSite: string; byPost: string; byPhone: string };
  home: {
    welcome: string;
    titleFallback: string;
    intro: string;
    newLetter: string;
    uploadTitle: string;
    uploadText: string;
    latestDocuments: string;
    entries: string;
    noDocuments: string;
    openDeadlines: string;
    tasks: string;
    noDeadlinesTitle: string;
    noDeadlinesText: string;
    extrasSectionTitle: string;
    extrasSectionIntro: string;
    extraRefundsBlurb: string;
    extraWelcomeBlurb: string;
    extraGoalsBlurb: string;
    /** Label nur für den Welcome-Button auf der Startseite (Extras-Kachel) */
    extrasWelcomeButton: string;
    statusOverviewTitle: string;
    statusOpenLabel: string;
    statusCriticalLabel: string;
    statusDoneLabel: string;
    statusToTasks: string;
    uploadActionHint: string;
    documentsEmptyCompact: string;
  };
  settings: {
    section: string;
    title: string;
    intro: string;
    currentState: string;
    noName: string;
    sessionText: string;
    fullName: string;
    translationLanguage: string;
    save: string;
    saving: string;
    namePlaceholder: string;
  };
  upload: {
    badge: string;
    title: string;
    heroLine: string;
    intro: string;
    kindsTitle: string;
    kindsIntro: string;
    kindContracts: string;
    kindOfficial: string;
    kindInvoices: string;
    kindReminders: string;
    kindTerminations: string;
    kindForms: string;
    kindTravel: string;
    kindTickets: string;
    kindOther: string;
    valuePromise: string;
    kindsInvitation: string;
    journeyTitle: string;
    journeyStep1: string;
    journeyStep2: string;
    journeyStep3: string;
    journeyStep4: string;
    journeyStep5: string;
    trustPillar1: string;
    trustPillar2: string;
    trustPillar3: string;
    trustCardTitle: string;
    afterUploadHint: string;
    saveInfoTitle: string;
    saveInfoText: string;
    /** Kurzer Vertrauenssatz auf der Upload-Seite */
    saveInfoLine: string;
    /** Eine Zeile unter der Headline */
    uploadSubline: string;
    /** Kompakter Hinweis wenn Kategorien eingeklappt */
    kindsPeekLine: string;
    expandMore: string;
    expandLess: string;
    /** Titel für Ablauf nach Upload (kompakt) */
    journeyHeading: string;
    /** Eine Zeile, wenn der Ablauf eingeklappt ist */
    journeyPeekLine: string;
    cardTitle: string;
    allowedFormats: string;
    dropzoneTitle: string;
    dropzoneText: string;
    pickFile: string;
    takePhoto: string;
    submit: string;
    submitting: string;
  };
  tasks: {
    section: string;
    title: string;
    intro: string;
    none: string;
    topic: string;
    whatToDo: string;
    noLinkedDocument: string;
    toDocument: string;
    markDone: string;
    openOfficialLink: string;
  };
  documents: {
    badge: string;
    introReady: string;
    introPending: string;
    topBox: string;
    topTitle: string;
    reactionNeeded: string;
    noDirectPressure: string;
    keyPoints: string;
    keyPointsText: string;
    explainTitle: string;
    explainText: string;
    nextStepsTitle: string;
    nextStepsText: string;
    noNextStep: string;
    ifIgnoredTitle: string;
    ifIgnoredText: string;
    noClearConsequence: string;
    understandTitle: string;
    understandText: string;
    beforeAnalysis: string;
    beforeAnalysisText: string;
    analyzeDocument: string;
    analyzingDocument: string;
    createReply: string;
    whereToDoIt: string;
    kind: string;
    office: string;
    address: string;
    openOfficialLink: string;
    nextStep: string;
    nextStepText: string;
    unknownFileType: string;
    noDownloadLink: string;
  };
  reply: {
    back: string;
    badge: string;
    title: string;
    intro: string;
    unknownSender: string;
    situation: string;
    situationText: string;
    note: string;
    noteText: string;
    tone: string;
    format: string;
    asLetter: string;
    asEmail: string;
    includeName: string;
    create: string;
    creating: string;
    regenerate: string;
    regenerating: string;
    previousDrafts: string;
    german: string;
    neutral: string;
    friendly: string;
    veryFormal: string;
    objection: string;
    appeal: string;
    needMoreTime: string;
  };
};

const de: Copy = {
  nav: { home: "Home", upload: "Upload", cases: "Fälle", processes: "Anträge & Vorgänge", refunds: "Geld zurück", welcome: "Welcome", tasks: "Aufgaben", settings: "Einstellungen", desk: "Dein Büro im Blick", brand: "BureauCare" },
  common: { uploaded: "Hochgeladen", analysisAvailable: "Analyse verfügbar", analysisPending: "Analyse ausstehend", unknown: "Unbekannt", noClearDeadline: "Keine klare Frist", deadline: "Frist", subject: "Thema", sender: "Absender", urgency: "Dringlichkeit", statusOpen: "Offen", statusDone: "Erledigt", document: "Dokument", openDocument: "Dokument öffnen", saveInProgress: "Wird gespeichert...", moreDetails: "Mehr Details", shortExplained: "Kurz erklärt", signOut: "Abmelden", dateUploaded: "Hochgeladen am", currentStatus: "Aktueller Stand", name: "Name", language: "Sprache", session: "Sitzung" },
  urgency: { high: "Hoch", medium: "Mittel", low: "Niedrig", unclear: "Noch unklar" },
  actionMode: { online: "Online möglich", onSite: "Vor Ort", byPost: "Per Post", byPhone: "Telefonisch" },
  home: {
    welcome: "Willkommen zurück",
    titleFallback: "Dein BureauCare",
    intro: "Alle wichtigen Dokumente an einem geschützten Ort, mit klaren Erklärungen, Fristen und nächsten Schritten.",
    newLetter: "Neues Dokument",
    uploadTitle: "Neues Dokument hochladen",
    uploadText: "Lade ein amtliches Dokument oder ein offizielles Schreiben hoch und speichere es sicher in deinem Konto.",
    latestDocuments: "Letzte Dokumente",
    entries: "Einträge",
    noDocuments: "Noch keine Dokumente vorhanden. Lade dein erstes Dokument hoch, um hier eine Übersicht zu sehen.",
    openDeadlines: "Offene Fristen",
    tasks: "Aufgaben",
    noDeadlinesTitle: "Noch keine offenen Fristen",
    noDeadlinesText: "Sobald ein Dokument mit Frist erkannt wird, erscheint hier automatisch dein nächster To-do-Punkt.",
    extrasSectionTitle: "Weitere praktische Funktionen",
    extrasSectionIntro: "Alles, was den Alltag mit Bürokratie leichter macht.",
    extraRefundsBlurb: "Finde mögliche Erstattungen und Ansprüche.",
    extraWelcomeBlurb: "Hilfen und Orientierung für deinen Start in Deutschland.",
    extraGoalsBlurb: "Behalte deine nächsten wichtigen Schritte im Blick.",
    extrasWelcomeButton: "Welcome To Germany",
    statusOverviewTitle: "Dein Status",
    statusOpenLabel: "Offen",
    statusCriticalLabel: "Kritisch",
    statusDoneLabel: "Erledigt",
    statusToTasks: "Zu den Aufgaben",
    uploadActionHint: "Schnell erfassen, sicher ablegen – BureauCare ordnet für dich.",
    documentsEmptyCompact: "Noch keine Dokumente. Ein erstes Dokument reicht, um loszulegen."
  },
  settings: { section: "Einstellungen", title: "Konto und Sprache", intro: "Lege fest, wie dein Name in Antworten erscheint und in welche Sprache BureauCare zusätzlich übersetzen soll.", currentState: "Aktueller Stand", noName: "Kein Name hinterlegt", sessionText: "Du kannst dich jederzeit sicher abmelden. Deine Dokumente bleiben in deinem geschützten Bereich.", fullName: "Dein Name", translationLanguage: "Sprache für Übersetzungen", save: "Einstellungen speichern", saving: "Wird gespeichert...", namePlaceholder: "Max Mustermann" },
  upload: {
    badge: "Dokument hochladen",
    title: "Dokument hochladen",
    uploadSubline: "Wir zeigen dir sofort, was wichtig ist.",
    heroLine:
      "Lade Unterlagen hoch – BureauCare schaut sie an, ordnet sie ein und macht Wichtiges für dich sichtbar.",
    intro:
      "Lade Verträge, Bescheide, Rechnungen oder andere wichtige Dokumente hoch. BureauCare erkennt, worum es geht, erklärt den Inhalt und zeigt dir den nächsten sinnvollen Schritt.",
    kindsTitle: "Was du hochladen kannst",
    kindsPeekLine: "Verträge, Bescheide, Rechnungen und mehr.",
    expandMore: "Mehr anzeigen",
    expandLess: "Weniger anzeigen",
    journeyHeading: "Was passiert danach?",
    journeyPeekLine: "In fünf Schritten – vom Erkennen bis zu deinen nächsten Schritten.",
    kindsIntro: "Vom Alltag bis zur Ausnahme: Wenn es für dich wichtig ist, passt es hierher – ohne feste Systemgrenzen.",
    kindsInvitation: "Kein Formularstau, sondern eine ruhige Einladung: Lad hoch, was dich beschäftigt.",
    kindContracts: "Verträge",
    kindOfficial: "Bescheide & Behörden",
    kindInvoices: "Rechnungen",
    kindReminders: "Mahnungen",
    kindTerminations: "Kündigungen",
    kindForms: "Formulare & Anträge",
    kindTravel: "Reisebuchungen",
    kindTickets: "Tickets & Passes",
    kindOther: "Sonstiges Wichtiges",
    valuePromise:
      "Egal ob Frist, Risiko, Rückerstattung oder einfach Klarheit – BureauCare hilft dir, schneller zu verstehen, was zählt.",
    journeyTitle: "So läuft es nach dem Upload",
    journeyStep1: "Dokument erkennen",
    journeyStep2: "Inhalt einordnen",
    journeyStep3: "Fristen sichtbar machen",
    journeyStep4: "Passende Analyse empfehlen",
    journeyStep5: "Nächste Schritte erklären",
    trustPillar1: "Klartext statt Behördendschungel",
    trustPillar2: "Einordnung statt Rätselraten",
    trustPillar3: "Vorschlag fürs Modul – du entscheidest",
    trustCardTitle: "Darauf legen wir Wert",
    afterUploadHint:
      "Nach dem Upload erkennt BureauCare den Dokumenttyp, fasst den Inhalt zusammen und schlägt die passende Analyse vor – Fristen, Risiken und Chancen werden klar.",
    saveInfoTitle: "So wird gespeichert",
    saveInfoText:
      "Deine Datei landet im privaten Supabase-Bucket documents. Jeder Pfad wird unter deiner Nutzer-ID gespeichert, damit ausschließlich du Zugriff auf deine Dokumente hast.",
    saveInfoLine: "Deine Dokumente sind geschützt und nur für dich sichtbar.",
    cardTitle: "Datei sicher hochladen",
    allowedFormats: "Erlaubte Formate: PDF, JPG, JPEG, PNG. Maximale Dateigröße: 15 MB.",
    dropzoneTitle: "Dokument hier ablegen oder auswählen",
    dropzoneText: "Ziehe die Datei hierher oder nutze die Buttons unten.",
    pickFile: "Datei auswählen",
    takePhoto: "Dokument fotografieren",
    submit: "Dokument hochladen",
    submitting: "Datei wird hochgeladen..."
  },
  tasks: { section: "Aufgaben", title: "Offene Fristen im Blick", intro: "Hier siehst du, was gerade wichtig ist, warum es zählt und wie du direkt zum passenden Dokument kommst.", none: "Noch keine Aufgaben vorhanden.", topic: "Thema", whatToDo: "Was zu tun ist", noLinkedDocument: "Kein Dokument verknüpft", toDocument: "Zum Dokument und nächsten Schritt", markDone: "Als erledigt markieren", openOfficialLink: "Offiziellen Link öffnen" },
  documents: { badge: "Dokument", introReady: "Hier ist in einfachen Worten, was das Dokument von dir will.", introPending: "Dokument hochgeladen. Analyse folgt.", topBox: "Das Wichtigste", topTitle: "Sofort erkennen, was jetzt wichtig ist", reactionNeeded: "Reaktion nötig", noDirectPressure: "Kein direkter Handlungsdruck", keyPoints: "Kernpunkte", keyPointsText: "Die wichtigsten Aussagen in sehr kurzer Form.", explainTitle: "Vereinfacht erklärt", explainText: "Kurz oder mit etwas mehr Kontext, aber ohne Behördensprache.", nextStepsTitle: "Was du jetzt tun solltest", nextStepsText: "Die nächsten sinnvollen Schritte aus dem Dokument.", noNextStep: "Noch kein klarer nächster Schritt erkannt.", ifIgnoredTitle: "Wenn du nichts machst", ifIgnoredText: "Mögliche Folgen, soweit aus dem Dokument erkennbar.", noClearConsequence: "Dazu war im Dokument keine klare Folge erkennbar.", understandTitle: "Dokument verstehen", understandText: "BureauCare liest das Dokument serverseitig und erklärt es dir in einfachen Worten.", beforeAnalysis: "Vor der Analyse", beforeAnalysisText: "Wir prüfen, wer das Dokument geschickt hat, worum es geht, ob du etwas tun musst, bis wann Zeit ist und was du jetzt am besten machen solltest.", analyzeDocument: "Dokument analysieren", analyzingDocument: "Dokument wird analysiert...", createReply: "Antwort erstellen", whereToDoIt: "Wo du das erledigen kannst", kind: "Art", office: "Stelle", address: "Adresse", openOfficialLink: "Offiziellen Link öffnen", nextStep: "Nächster Schritt", nextStepText: "Hier kannst du direkt eine passende Antwort vorbereiten.", unknownFileType: "Unbekannter Dateityp", noDownloadLink: "Für diese Datei konnte kein Download-Link erzeugt werden." },
  reply: { back: "Zurück zum Dokument", badge: "Antwortgenerator", title: "Passende Antwort vorbereiten", intro: "Wähle einen Ton und lasse dir einen direkt nutzbaren Entwurf für dieses Schreiben erstellen.", unknownSender: "Unbekannter Absender", situation: "Ausgangslage", situationText: "Diese vereinfachte Zusammenfassung fließt in die Antwort ein.", note: "Hinweis", noteText: "Prüfe den Entwurf kurz, bevor du ihn verschickst.", tone: "Antwortton", format: "Format", asLetter: "Als Schreiben", asEmail: "Als E-Mail", includeName: "Meinen Namen am Ende einfügen", create: "Antwort generieren", creating: "Antwort wird erstellt...", regenerate: "Neue Antwort generieren", regenerating: "Neue Version wird erstellt...", previousDrafts: "Frühere Entwürfe", german: "Deutsch", neutral: "Neutral", friendly: "Freundlich", veryFormal: "Sehr formell", objection: "Widerspruch", appeal: "Einspruch", needMoreTime: "Ich brauche mehr Zeit" }
};

const en: Copy = {
  ...de,
  nav: { home: "Home", upload: "Upload", cases: "Cases", processes: "Applications & processes", refunds: "Money back", welcome: "Welcome", tasks: "Tasks", settings: "Settings", desk: "Your desk at a glance", brand: "BureauCare" },
  common: { ...de.common, analysisAvailable: "Analysis ready", analysisPending: "Analysis pending", unknown: "Unknown", noClearDeadline: "No clear deadline", deadline: "Deadline", subject: "Subject", sender: "Sender", urgency: "Urgency", statusOpen: "Open", statusDone: "Done", document: "Document", openDocument: "Open document", saveInProgress: "Saving...", moreDetails: "More details", shortExplained: "Quick view", signOut: "Sign out", dateUploaded: "Uploaded on", currentStatus: "Current status", language: "Language", session: "Session" },
  urgency: { high: "High", medium: "Medium", low: "Low", unclear: "Still unclear" },
  actionMode: { online: "Online possible", onSite: "In person", byPost: "By mail", byPhone: "By phone" },
  home: {
    ...de.home,
    welcome: "Welcome back",
    titleFallback: "Your BureauCare",
    intro: "All important documents in one protected place, with clear explanations, deadlines and next steps.",
    newLetter: "New document",
    uploadTitle: "Upload a new document",
    uploadText: "Upload an official document or notice and keep it safe in your account.",
    latestDocuments: "Recent documents",
    entries: "entries",
    noDocuments: "No documents yet. Upload your first document to see an overview here.",
    openDeadlines: "Open deadlines",
    tasks: "tasks",
    noDeadlinesTitle: "No open deadlines yet",
    noDeadlinesText: "As soon as a document with a deadline is detected, your next task appears here automatically.",
    extrasSectionTitle: "Further practical functions",
    extrasSectionIntro: "Everything that makes everyday life a little easier with bureaucracy.",
    extraRefundsBlurb: "Find possible refunds and claims.",
    extraWelcomeBlurb: "Guidance and orientation for getting started in Germany.",
    extraGoalsBlurb: "Keep your next important steps in view.",
    extrasWelcomeButton: "Welcome To Germany",
    statusOverviewTitle: "Your status",
    statusOpenLabel: "Open",
    statusCriticalLabel: "Critical",
    statusDoneLabel: "Done",
    statusToTasks: "Go to tasks",
    uploadActionHint: "Capture quickly, store safely — BureauCare keeps things sorted.",
    documentsEmptyCompact: "No documents yet. Upload one file to get started."
  },
  settings: { ...de.settings, section: "Settings", title: "Account and language", intro: "Choose how your name appears in replies and which language BureauCare should additionally translate into.", currentState: "Current status", noName: "No name saved", sessionText: "You can sign out safely at any time. Your documents stay in your protected area.", fullName: "Your name", translationLanguage: "Translation language", save: "Save settings", saving: "Saving..." },
  upload: {
    ...de.upload,
    badge: "Upload document",
    title: "Upload a document",
    uploadSubline: "We'll show you what matters right away.",
    heroLine: "Upload your papers – BureauCare reads them, sorts them out, and highlights what matters for you.",
    intro:
      "Upload contracts, official letters, invoices or other important documents. BureauCare figures out what it is, explains the content, and suggests a sensible next step.",
    kindsTitle: "What you can upload",
    kindsPeekLine: "Contracts, official letters, invoices, and more.",
    expandMore: "Show more",
    expandLess: "Show less",
    journeyHeading: "What happens next?",
    journeyPeekLine: "Five steps—from spotting the type to your next steps.",
    kindsIntro: "From everyday papers to the odd one out: if it matters to you, it belongs here.",
    kindsInvitation: "No cold upload slot – just a calm invite to bring whatever is on your mind.",
    kindContracts: "Contracts",
    kindOfficial: "Decisions & authority letters",
    kindInvoices: "Invoices",
    kindReminders: "Reminders & dunning",
    kindTerminations: "Terminations",
    kindForms: "Forms & applications",
    kindTravel: "Trip & hotel bookings",
    kindTickets: "Tickets & boarding passes",
    kindOther: "Other important papers",
    valuePromise:
      "Deadlines, risk, refunds or simply clarity – BureauCare helps you see what matters sooner, without the hype.",
    journeyTitle: "After you upload",
    journeyStep1: "Spot the document type",
    journeyStep2: "Sort the content",
    journeyStep3: "Surface likely deadlines",
    journeyStep4: "Recommend the right analysis",
    journeyStep5: "Explain sensible next steps",
    trustPillar1: "Plain language, less bureaucracy fog",
    trustPillar2: "Structure instead of guessing",
    trustPillar3: "We suggest the path – you stay in charge",
    trustCardTitle: "What we care about here",
    afterUploadHint:
      "After upload, BureauCare detects the document type, summarises the content, and suggests the right analysis – deadlines, risks and opportunities become visible.",
    saveInfoTitle: "How it is stored",
    saveInfoText:
      "Your file is stored in the private Supabase bucket documents. Each path is saved under your user ID so only you can access your documents.",
    saveInfoLine: "Your documents are protected and only visible to you.",
    cardTitle: "Upload file securely",
    allowedFormats: "Allowed formats: PDF, JPG, JPEG, PNG. Maximum file size: 15 MB.",
    dropzoneTitle: "Drop or choose your document here",
    dropzoneText: "Drag the file here or use the buttons below.",
    pickFile: "Choose file",
    takePhoto: "Take a photo",
    submit: "Upload document",
    submitting: "Uploading file..."
  },
  tasks: { ...de.tasks, section: "Tasks", title: "Keep deadlines in view", intro: "Here you can see what matters now, why it matters, and how to jump to the right document.", none: "No tasks yet.", topic: "Subject", whatToDo: "What to do", noLinkedDocument: "No linked document", toDocument: "Open document and next step", markDone: "Mark as done", openOfficialLink: "Open official link" },
  documents: { ...de.documents, introReady: "Here is what the document wants from you, in simple words.", introPending: "Document uploaded. Analysis is coming.", topBox: "What matters most", topTitle: "See right away what matters now", reactionNeeded: "Action needed", noDirectPressure: "No immediate pressure", keyPoints: "Key points", keyPointsText: "The most important statements in a very short form.", explainTitle: "Explained simply", explainText: "Short or with more context, but without official jargon.", nextStepsTitle: "What you should do now", nextStepsText: "The next sensible steps from the document.", noNextStep: "No clear next step detected yet.", ifIgnoredTitle: "If you do nothing", ifIgnoredText: "Possible consequences, as far as they can be seen in the document.", noClearConsequence: "No clear consequence could be identified from the document.", understandTitle: "Understand the document", understandText: "BureauCare reads the document on the server and explains it in simple words.", beforeAnalysis: "Before the analysis", beforeAnalysisText: "We check who sent the document, what it is about, whether you need to do something, by when, and what you should do next.", analyzeDocument: "Analyze document", analyzingDocument: "Document is being analyzed...", createReply: "Create reply", whereToDoIt: "Where you can do this", kind: "Type", office: "Office", address: "Address", openOfficialLink: "Open official link", nextStep: "Next step", nextStepText: "Here you can prepare a fitting reply right away.", unknownFileType: "Unknown file type", noDownloadLink: "No download link could be created for this file." },
  reply: { ...de.reply, back: "Back to document", badge: "Reply generator", title: "Prepare a suitable reply", intro: "Choose a tone and generate a ready-to-use draft for this message.", unknownSender: "Unknown sender", situation: "Situation", situationText: "This simplified summary is used for the reply.", note: "Note", noteText: "Please check the draft briefly before sending it.", tone: "Reply tone", format: "Format", asLetter: "As message", asEmail: "As email", includeName: "Add my name at the end", create: "Generate reply", creating: "Generating reply...", regenerate: "Generate a new reply", regenerating: "Creating a new version...", previousDrafts: "Earlier drafts", german: "German", neutral: "Neutral", friendly: "Friendly", veryFormal: "Very formal", objection: "Objection", appeal: "Appeal", needMoreTime: "I need more time" }
};

const tr: Copy = {
  ...en,
  nav: {
    ...en.nav,
    home: "Ana sayfa",
    upload: "Yukle",
    cases: "Dosyalar",
    processes: "Basvurular",
    refunds: "Para iadesi",
    welcome: "Welcome",
    tasks: "Gorevler",
    settings: "Ayarlar",
    desk: "Masandaki ozet"
  },
  common: {
    ...en.common,
    uploaded: "Yuklendi",
    analysisAvailable: "Analiz hazir",
    analysisPending: "Analiz bekleniyor",
    unknown: "Bilinmiyor",
    noClearDeadline: "Net bir son tarih yok",
    deadline: "Son tarih",
    subject: "Konu",
    sender: "Gonderen",
    urgency: "Aciliyet",
    statusOpen: "Acik",
    statusDone: "Tamamlandi",
    openDocument: "Belgeyi ac",
    saveInProgress: "Kaydediliyor...",
    moreDetails: "Daha fazla detay",
    shortExplained: "Kisa aciklama",
    signOut: "Cikis yap",
    dateUploaded: "Yuklenme tarihi",
    currentStatus: "Mevcut durum",
    name: "Isim",
    language: "Dil",
    session: "Oturum"
  },
  urgency: { high: "Yuksek", medium: "Orta", low: "Dusuk", unclear: "Henuz belirsiz" },
  actionMode: { online: "Cevrim ici mumkun", onSite: "Yerinde", byPost: "Posta ile", byPhone: "Telefonla" }
};
const uk: Copy = {
  ...en,
  nav: {
    ...en.nav,
    home: "Holovna",
    upload: "Zavantazhyty",
    cases: "Spravy",
    processes: "Zayavy i protsesy",
    refunds: "Povernennia koshtiv",
    welcome: "Welcome",
    tasks: "Zavdannya",
    settings: "Nalashtuvannya",
    desk: "Vse vazhlyve pid rukoyu"
  },
  common: {
    ...en.common,
    uploaded: "Zavantazheno",
    analysisAvailable: "Analiz hotovyy",
    analysisPending: "Analiz ochikuyetsya",
    unknown: "Nevidomo",
    noClearDeadline: "Nemae choitkoho stroku",
    deadline: "Strok",
    subject: "Tema",
    sender: "Vidpravnyk",
    urgency: "Terminovist",
    statusOpen: "Vidkryto",
    statusDone: "Vykonano",
    openDocument: "Vidkryty dokument",
    saveInProgress: "Zberezhennya...",
    moreDetails: "Bilshe detaley",
    shortExplained: "Korotko",
    signOut: "Vyity",
    currentStatus: "Potochnyy stan",
    name: "Imya",
    language: "Mova",
    session: "Seans"
  },
  urgency: { high: "Vysoka", medium: "Serednya", low: "Nyzka", unclear: "Shche neyasno" },
  actionMode: { online: "Mozhna onlayn", onSite: "Osobysto", byPost: "Poshtoyu", byPhone: "Telefonom" }
};
const es: Copy = {
  ...en,
  nav: { ...en.nav, home: "Inicio", upload: "Subir", cases: "Casos", processes: "Tramites y gestiones", refunds: "Dinero de vuelta", welcome: "Welcome", tasks: "Tareas", settings: "Ajustes", desk: "Todo importante a la vista" },
  common: {
    ...en.common,
    uploaded: "Subido",
    analysisAvailable: "An谩lisis listo",
    analysisPending: "An谩lisis pendiente",
    unknown: "Desconocido",
    noClearDeadline: "No hay plazo claro",
    deadline: "Plazo",
    subject: "Tema",
    sender: "Remitente",
    urgency: "Urgencia",
    statusOpen: "Abierto",
    statusDone: "Hecho",
    openDocument: "Abrir documento",
    saveInProgress: "Guardando...",
    moreDetails: "M谩s detalles",
    shortExplained: "Explicaci贸n corta",
    signOut: "Cerrar sesi贸n",
    dateUploaded: "Subido el",
    currentStatus: "Estado actual",
    name: "Nombre",
    language: "Idioma",
    session: "Sesi贸n"
  },
  urgency: { high: "Alta", medium: "Media", low: "Baja", unclear: "A煤n no est谩 claro" },
  actionMode: { online: "Posible en l铆nea", onSite: "En persona", byPost: "Por correo", byPhone: "Por tel茅fono" },
  home: {
    ...en.home,
    welcome: "Bienvenido de nuevo",
    titleFallback: "Tu BureauCare",
    intro: "Todos tus documentos importantes en un lugar protegido, con explicaciones claras, plazos y pr贸ximos pasos.",
    newLetter: "Nuevo documento",
    uploadTitle: "Subir un nuevo documento",
    uploadText: "Sube un documento oficial o una notificaci贸n y gu谩rdalo de forma segura en tu cuenta.",
    latestDocuments: "Documentos recientes",
    entries: "entradas",
    noDocuments: "Todav铆a no hay documentos. Sube tu primer documento para ver aqu铆 un resumen.",
    openDeadlines: "Plazos abiertos",
    tasks: "tareas",
    noDeadlinesTitle: "Todav铆a no hay plazos abiertos",
    noDeadlinesText: "En cuanto se detecte un documento con plazo, tu siguiente tarea aparecer谩 aqu铆 autom谩ticamente.",
    extrasSectionTitle: "Más funciones prácticas",
    extrasSectionIntro: "Todo lo que hace un poco más fácil el día a día con la burocracia.",
    extraRefundsBlurb: "Encuentra posibles devoluciones y reclamaciones.",
    extraWelcomeBlurb: "Orientación para tus primeros pasos en Alemania.",
    extraGoalsBlurb: "Mantén a la vista tus próximos pasos importantes.",
    extrasWelcomeButton: "Welcome To Germany"
  },
  settings: {
    ...en.settings,
    section: "Ajustes",
    title: "Cuenta e idioma",
    intro: "Elige c贸mo debe aparecer tu nombre en las respuestas y a qu茅 idioma adicional debe traducir BureauCare.",
    currentState: "Estado actual",
    noName: "No hay nombre guardado",
    sessionText: "Puedes cerrar sesi贸n de forma segura en cualquier momento. Tus documentos permanecen en tu zona protegida.",
    fullName: "Tu nombre",
    translationLanguage: "Idioma de traducci贸n",
    save: "Guardar ajustes",
    saving: "Guardando..."
  },
  upload: {
    ...en.upload,
    badge: "Subir documento",
    title: "Subir un documento",
    uploadSubline: "Te mostramos al instante lo que importa.",
    kindsTitle: "Qué puedes subir",
    kindsPeekLine: "Contratos, cartas oficiales, facturas y más.",
    expandMore: "Ver más",
    expandLess: "Ver menos",
    journeyHeading: "Qué ocurre después",
    journeyPeekLine: "Cinco pasos: del tipo de documento a tus siguientes pasos.",
    saveInfoLine: "Tus documentos están protegidos y solo tú los ves.",
    heroLine:
      "Sube tus documentos: BureauCare los lee, los ordena y resalta lo que importa.",
    intro:
      "Sube contratos, notificaciones oficiales, facturas u otros documentos importantes. BureauCare identifica de qué se trata, explica el contenido y te propone el siguiente paso razonable.",
    kindsIntro: "Una guía rápida – también valen documentos mixtos o poco habituales.",
    kindContracts: "Contratos",
    kindOfficial: "Cartas de la administración",
    kindInvoices: "Facturas",
    kindReminders: "Avisos y reclamaciones",
    kindTerminations: "Rescisiones y bajas",
    kindForms: "Formularios y solicitudes",
    kindTravel: "Reservas de viaje y hotel",
    kindTickets: "Billetes y abonos de transporte",
    kindsInvitation: "Sin frío trámite digital: sube lo que te preocupa y lo miramos con calma.",
    valuePromise:
      "Plazo, riesgo, devolución o solo entender el papel: BureauCare te ayuda a ver qué importa, sin drama.",
    journeyTitle: "Después de subirlo",
    journeyStep1: "Detectar el tipo de documento",
    journeyStep2: "Ordenar el contenido",
    journeyStep3: "Aclarar plazos si las hay",
    journeyStep4: "Recomendar el análisis adecuado",
    journeyStep5: "Explicar los próximos pasos",
    trustPillar1: "Lenguaje claro, menos laberinto",
    trustPillar2: "Orden en lugar de adivinar",
    trustPillar3: "Te sugerimos el camino, tú decides",
    trustCardTitle: "En lo que nos enfocamos",
    kindOther: "Otros documentos importantes",
    afterUploadHint:
      "Tras la subida, BureauCare detecta el tipo de documento, resume el contenido y sugiere el análisis adecuado: plazos, riesgos y oportunidades quedan claros.",
    saveInfoTitle: "Cómo se guarda",
    saveInfoText:
      "Tu archivo se guarda en el bucket privado documents de Supabase. Cada ruta se guarda bajo tu ID de usuario, así que solo tú puedes acceder a tus documentos.",
    cardTitle: "Subir archivo de forma segura",
    allowedFormats: "Formatos permitidos: PDF, JPG, JPEG, PNG. Tamaño máximo: 15 MB.",
    dropzoneTitle: "Deja o elige tu documento aquí",
    dropzoneText: "Arrastra el archivo aquí o usa los botones de abajo.",
    pickFile: "Elegir archivo",
    submit: "Subir documento",
    submitting: "Subiendo archivo..."
  },
  tasks: {
    ...en.tasks,
    section: "Tareas",
    title: "Mant茅n tus plazos a la vista",
    intro: "Aqu铆 ves qu茅 es importante ahora, por qu茅 importa y c贸mo abrir directamente el documento correcto.",
    none: "Todav铆a no hay tareas.",
    topic: "Tema",
    whatToDo: "Qu茅 hacer",
    noLinkedDocument: "No hay documento vinculado",
    toDocument: "Abrir documento y siguiente paso",
    markDone: "Marcar como hecho",
    openOfficialLink: "Abrir enlace oficial"
  },
  documents: {
    ...en.documents,
    badge: "Documento",
    introReady: "Aqu铆 tienes en palabras simples lo que este documento quiere de ti.",
    introPending: "Documento subido. El an谩lisis viene despu茅s.",
    topBox: "Lo m谩s importante",
    topTitle: "Ver enseguida qu茅 es importante ahora",
    reactionNeeded: "Hace falta actuar",
    noDirectPressure: "No hay presi贸n inmediata",
    keyPoints: "Puntos clave",
    keyPointsText: "Las afirmaciones m谩s importantes en forma muy corta.",
    explainTitle: "Explicado de forma simple",
    explainText: "Corto o con un poco m谩s de contexto, pero sin lenguaje burocr谩tico.",
    nextStepsTitle: "Qu茅 deber铆as hacer ahora",
    nextStepsText: "Los siguientes pasos m谩s razonables del documento.",
    noNextStep: "Todav铆a no se ha detectado un siguiente paso claro.",
    ifIgnoredTitle: "Si no haces nada",
    ifIgnoredText: "Posibles consecuencias, en la medida en que se puedan ver en el documento.",
    noClearConsequence: "No se pudo identificar una consecuencia clara a partir del documento.",
    understandTitle: "Entender el documento",
    understandText: "BureauCare lee el documento en el servidor y te lo explica con palabras simples.",
    beforeAnalysis: "Antes del an谩lisis",
    beforeAnalysisText: "Comprobamos qui茅n envi贸 el documento, de qu茅 trata, si tienes que hacer algo, hasta cu谩ndo tienes tiempo y cu谩l es el mejor siguiente paso.",
    analyzeDocument: "Analizar documento",
    analyzingDocument: "El documento se est谩 analizando...",
    createReply: "Crear respuesta",
    whereToDoIt: "D贸nde puedes hacerlo",
    kind: "Tipo",
    office: "Oficina",
    address: "Direcci贸n",
    openOfficialLink: "Abrir enlace oficial",
    nextStep: "Siguiente paso",
    nextStepText: "Aqu铆 puedes preparar directamente una respuesta adecuada.",
    unknownFileType: "Tipo de archivo desconocido",
    noDownloadLink: "No se pudo crear un enlace de descarga para este archivo."
  },
  reply: {
    ...en.reply,
    back: "Volver al documento",
    badge: "Generador de respuestas",
    title: "Preparar una respuesta adecuada",
    intro: "Elige un tono y genera un borrador listo para usar para este mensaje.",
    unknownSender: "Remitente desconocido",
    situation: "Situaci贸n",
    situationText: "Este resumen simplificado se usa para la respuesta.",
    note: "Nota",
    noteText: "Revisa brevemente el borrador antes de enviarlo.",
    tone: "Tono de la respuesta",
    format: "Formato",
    asLetter: "Como escrito",
    asEmail: "Como correo electr贸nico",
    includeName: "A帽adir mi nombre al final",
    create: "Generar respuesta",
    creating: "Se est谩 generando la respuesta...",
    regenerate: "Generar una nueva respuesta",
    regenerating: "Se est谩 creando una nueva versi贸n...",
    previousDrafts: "Borradores anteriores",
    german: "Alem谩n",
    neutral: "Neutral",
    friendly: "Amable",
    veryFormal: "Muy formal",
    objection: "Oposici贸n",
    appeal: "Recurso",
    needMoreTime: "Necesito m谩s tiempo"
  }
};

const zh: Copy = {
  ...en,
  nav: { ...en.nav, home: "首页", upload: "上传", cases: "案件", processes: "申请与流程", refunds: "退款查找", welcome: "Welcome", tasks: "任务", settings: "设置", desk: "你的事务一目了然", brand: "BureauCare" },
  common: { ...en.common, uploaded: "已上传", analysisAvailable: "分析已完成", analysisPending: "分析进行中", unknown: "未知", noClearDeadline: "没有明确期限", deadline: "期限", subject: "主题", sender: "发件方", urgency: "紧急程度", statusOpen: "进行中", statusDone: "已完成", document: "文件", openDocument: "打开文件", saveInProgress: "正在保存...", moreDetails: "更多详情", shortExplained: "简要说明", signOut: "退出登录", dateUploaded: "上传于", currentStatus: "当前状态", name: "姓名", language: "语言", session: "会话" },
  urgency: { high: "高", medium: "中", low: "低", unclear: "暂不明确" },
  actionMode: { online: "可在线办理", onSite: "需要到现场", byPost: "通过邮寄", byPhone: "通过电话" },
  home: {
    ...en.home,
    welcome: "欢迎回来",
    titleFallback: "你的 BureauCare",
    intro: "把重要文件放在一个安全的地方，并获得清晰说明、期限提醒和下一步建议。",
    newLetter: "新文件",
    uploadTitle: "上传新文件",
    uploadText: "上传官方文件或通知，并安全保存在你的账号中。",
    latestDocuments: "最近文件",
    entries: "条",
    noDocuments: "还没有文件。上传第一份文件后，这里就会出现总览。",
    openDeadlines: "待处理期限",
    tasks: "任务",
    noDeadlinesTitle: "目前没有开放期限",
    noDeadlinesText: "一旦识别到带期限的文件，你的下一步任务会自动显示在这里。",
    extrasSectionTitle: "更多实用功能",
    extrasSectionIntro: "让日常面对官僚流程时更轻松的一切入口。",
    extraRefundsBlurb: "查找可能的退款与索赔线索。",
    extraWelcomeBlurb: "在德国起步时的帮助与方向指引。",
    extraGoalsBlurb: "把接下来重要的步骤看清楚。",
    extrasWelcomeButton: "Welcome To Germany"
  },
  settings: { ...en.settings, section: "设置", title: "账号与语言", intro: "设置你的姓名如何出现在回复中，以及 BureauCare 还要额外翻译成哪种语言。", currentState: "当前状态", noName: "还没有保存姓名", sessionText: "你可以随时安全退出登录。你的文件会继续保存在受保护区域中。", fullName: "你的姓名", translationLanguage: "翻译语言", save: "保存设置", saving: "正在保存..." },
  upload: {
    ...en.upload,
    badge: "上传文件",
    title: "上传文档",
    uploadSubline: "我们会立刻标出对你重要的内容。",
    kindsTitle: "可以上传什么",
    kindsPeekLine: "合同、官方函件、发票等。",
    expandMore: "展开",
    expandLess: "收起",
    journeyHeading: "上传之后会怎样",
    journeyPeekLine: "五个步骤：从识别类型到下一步该怎么做。",
    saveInfoLine: "你的文件受到保护，仅你本人可见。",
    heroLine: "上传材料后，BureauCare 会阅读、整理并突出对你重要的内容。",
    intro:
      "上传合同、官方函件、发票或其他重要文件。BureauCare 会识别主题、说明内容，并提示合理的下一步。",
    kindsIntro: "从常见函件到冷门附件：对你重要的，就值得放上来。",
    kindContracts: "合同",
    kindOfficial: "官方函件与通知",
    kindInvoices: "发票与账单",
    kindReminders: "催款与提醒",
    kindTerminations: "解约与终止",
    kindForms: "表格与申请",
    kindTravel: "酒店与行程预订",
    kindTickets: "机票与电子票",
    kindsInvitation: "不是冷冰冰的“上传框”，而是请你把在意的那份文件放下就好。",
    valuePromise:
      "无论是期限、风险、退款还是单纯想弄懂内容，BureauCare 帮你更快抓住重点，语气克制、不夸大。",
    journeyTitle: "上传之后会发生什么",
    journeyStep1: "识别文件类型",
    journeyStep2: "整理内容要点",
    journeyStep3: "尽量标出相关期限",
    journeyStep4: "推荐合适的分析方式",
    journeyStep5: "用清晰语言说明下一步",
    trustPillar1: "少点官样文章，多点听得懂的话",
    trustPillar2: "帮你理清，而不是让你猜",
    trustPillar3: "我们提示合适入口，决定仍在你手里",
    trustCardTitle: "我们坚持的几件事",
    kindOther: "其他重要材料",
    afterUploadHint:
      "上传后，BureauCare 会识别文件类型、归纳内容并建议合适的分析——期限、风险与机会一目了然。",
    saveInfoTitle: "保存方式",
    saveInfoText: "你的文件会保存在 Supabase 的私有 documents 存储桶中。每个路径都绑定到你的用户 ID，因此只有你能访问这些文件。",
    cardTitle: "安全上传文件",
    allowedFormats: "允许格式：PDF、JPG、JPEG、PNG。最大文件大小：15 MB。",
    dropzoneTitle: "将文档拖放到此处或点击选择",
    dropzoneText: "把文件拖到这里，或使用下方按钮。",
    pickFile: "选择文件",
    submit: "上传文件",
    submitting: "正在上传文件..."
  },
  tasks: { ...en.tasks, section: "任务", title: "关注你的期限", intro: "这里会告诉你现在最重要的事情、原因，以及如何直接打开对应文件。", none: "目前还没有任务。", topic: "主题", whatToDo: "需要做什么", noLinkedDocument: "没有关联文件", toDocument: "打开文件和下一步", markDone: "标记为完成", openOfficialLink: "打开官方链接" },
  documents: { ...en.documents, badge: "文件", introReady: "这里会用简单的话告诉你，这份文件希望你做什么。", introPending: "文件已上传。分析即将开始。", topBox: "最重要的信息", topTitle: "马上看清现在最重要的事", reactionNeeded: "需要处理", noDirectPressure: "目前没有直接压力", keyPoints: "重点内容", keyPointsText: "最重要的内容会以简短方式展示。", explainTitle: "简单说明", explainText: "简短但清楚，不使用难懂的官方语言。", nextStepsTitle: "你现在应该做什么", nextStepsText: "从这份文件中整理出的下一步建议。", noNextStep: "目前还没有识别到明确的下一步。", ifIgnoredTitle: "如果你不处理", ifIgnoredText: "根据文件可见内容，可能出现的后果。", noClearConsequence: "这份文件里没有明确说明后果。", understandTitle: "理解这份文件", understandText: "BureauCare 会在服务器上读取文件，并用简单语言为你解释。", beforeAnalysis: "分析前", beforeAnalysisText: "我们会查看是谁发来的、内容是什么、你是否需要行动、截止时间，以及最合适的下一步。", analyzeDocument: "分析文件", analyzingDocument: "正在分析文件...", createReply: "生成回复", whereToDoIt: "你可以在哪里办理", kind: "类型", office: "机构", address: "地址", openOfficialLink: "打开官方链接", nextStep: "下一步", nextStepText: "你可以直接在这里准备一份合适的回复。", unknownFileType: "未知文件类型", noDownloadLink: "无法为这个文件生成下载链接。" },
  reply: { ...en.reply, back: "返回文件", badge: "回复生成器", title: "准备合适的回复", intro: "选择语气，然后为这份来信生成一份可直接使用的回复草稿。", unknownSender: "未知发件方", situation: "当前情况", situationText: "这份简化总结会用于生成回复。", note: "提示", noteText: "发送前请简短检查一下草稿。", tone: "回复语气", format: "格式", asLetter: "正式信件", asEmail: "电子邮件", includeName: "在结尾加入我的姓名", create: "生成回复", creating: "正在生成回复...", regenerate: "重新生成回复", regenerating: "正在生成新版本...", previousDrafts: "之前的草稿", german: "德语", neutral: "中性", friendly: "友好", veryFormal: "非常正式", objection: "异议", appeal: "申诉", needMoreTime: "我需要更多时间" }
};
const copy: Record<AppLocale, Copy> = { de, en, tr, uk, es, zh };

export function getCopy(locale: string | null | undefined) {
  return copy[normalizePreferredLanguage(locale)];
}

export function getAltLanguageLabel(locale: string | null | undefined) {
  return getLanguageLabel(normalizePreferredLanguage(locale));
}

export function getReminderCopy(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en": return { dueToday: "Due today", dueSoon: "Due soon", overdue: "Overdue", openLater: "Upcoming", completed: "Completed", reminderIntro: "Keep an eye on the next deadlines so nothing slips through.", noItems: "Nothing in this section right now." };
    case "tr": return { dueToday: "Bugün son gün", dueSoon: "Yak谋nda son gün", overdue: "Süresi ge莽ti", openLater: "Daha sonra", completed: "Tamamlananlar", reminderIntro: "Hi莽bir 艧eyi ka莽谋rmamak i莽in s谋radaki son tarihleri burada gör.", noItems: "Bu bölümde 艧u anda bir 艧ey yok." };
    case "uk": return { dueToday: "袩芯褌褉褨斜薪芯 褋褜芯谐芯写薪褨", dueSoon: "袧械蟹邪斜邪褉芯屑", overdue: "小褌褉芯泻 屑懈薪褍胁", openLater: "袩褨蟹薪褨褕械", completed: "袙懈泻芯薪邪薪芯", reminderIntro: "孝褍褌 胁懈写薪芯 薪邪泄斜谢懈卸褔褨 褋褌褉芯泻懈, 褖芯斜 薪褨褔芯谐芯 薪械 锌褉芯锌褍褋褌懈褌懈.", noItems: "校 褑褜芯屑褍 褉芯蟹写褨谢褨 蟹邪褉邪蟹 薪褨褔芯谐芯 薪械屑邪褦." };
    case "es": return { dueToday: "Vence hoy", dueSoon: "Vence pronto", overdue: "Vencido", openLater: "M谩s adelante", completed: "Completado", reminderIntro: "Aqu铆 ves los pr贸ximos plazos para que no se te pase nada.", noItems: "Ahora mismo no hay nada en esta secci贸n." };
    case "zh": return { dueToday: "今天到期", dueSoon: "即将到期", overdue: "已逾期", openLater: "稍后处理", completed: "已完成", reminderIntro: "在这里查看接下来的期限，这样就不会漏掉重要事情。", noItems: "这个区域目前没有内容。" };
    default: return { dueToday: "Heute fällig", dueSoon: "Bald fällig", overdue: "Überfällig", openLater: "Später offen", completed: "Erledigt", reminderIntro: "Hier siehst du die nächsten Fristen auf einen Blick, damit nichts untergeht.", noItems: "In diesem Bereich ist gerade nichts offen." };
  }
}

export function getUsageCopy(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en": return { title: "Usage this month", analyses: "free analyses used", replies: "reply drafts created", note: "This is a gentle preview of future free plan limits.", limitReached: "You have reached your free monthly analysis limit.", unlimited: "Unlimited" };
    case "tr": return { title: "Bu ay kullan谋m", analyses: "ücretsiz analiz kullan谋ld谋", replies: "yan谋t tasla臒谋 olu艧turuldu", note: "Bu alan ilerideki ücretsiz plan limitleri i莽in hafif bir önizlemedir.", limitReached: "Bu ay i莽in ücretsiz analiz limitine ula艧t谋n.", unlimited: "Sinirsiz" };
    case "uk": return { title: "袙懈泻芯褉懈褋褌邪薪薪褟 蟹邪 屑褨褋褟褑褜", analyses: "斜械蟹泻芯褕褌芯胁薪懈褏 邪薪邪谢褨蟹褨胁 胁懈泻芯褉懈褋褌邪薪芯", replies: "褔械褉薪械褌芯泻 胁褨写锌芯胁褨写褨 褋褌胁芯褉械薪芯", note: "笑械 薪械薪邪胁鈥櫻徯沸恍感残?锌褨写谐芯褌芯胁泻邪 写芯 屑邪泄斜褍褌薪褨褏 谢褨屑褨褌褨胁 斜械蟹泻芯褕褌芯胁薪芯谐芯 锌谢邪薪褍.", limitReached: "袙懈 写芯褋褟谐谢懈 斜械蟹泻芯褕褌芯胁薪芯谐芯 屑褨褋褟褔薪芯谐芯 谢褨屑褨褌褍 邪薪邪谢褨蟹褨胁.", unlimited: "袘械蟹谢褨屑褨褌薪芯" };
    case "es": return { title: "Uso este mes", analyses: "an谩lisis gratuitos usados", replies: "borradores de respuesta creados", note: "Esto es una vista previa discreta de los futuros l铆mites del plan gratuito.", limitReached: "Has alcanzado tu l铆mite mensual gratuito de an谩lisis.", unlimited: "Sin limite" };
    case "zh": return { title: "本月使用情况", analyses: "已使用的免费分析次数", replies: "已生成的回复草稿", note: "这是对以后免费计划额度的一种温和预览。", limitReached: "你已经达到本月免费的分析上限。", unlimited: "不限" };
    default: return { title: "Nutzung in diesem Monat", analyses: "kostenlose Analysen genutzt", replies: "Antwortentwürfe erstellt", note: "Das ist eine dezente Vorschau auf spätere Freemium-Limits.", limitReached: "Du hast dein kostenloses Monatslimit für Analysen erreicht.", unlimited: "Unbegrenzt" };
  }
}

export function getDocumentTrustCopy(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en": return { pageLabel: "Page", pageCountSuffix: "pages", referencesTitle: "Important places in the document", referencesText: "These details were linked to specific pages.", pageSummaryTitle: "Page overview", pageSummaryText: "A short view of what each page contains." };
    case "tr": return { pageLabel: "Sayfa", pageCountSuffix: "sayfa", referencesTitle: "Belgedeki önemli yerler", referencesText: "Bu bilgiler belirli sayfalara ba臒lanabildi.", pageSummaryTitle: "Sayfa özeti", pageSummaryText: "Her sayfada ne oldu臒una dair k谋sa bir bak谋艧." };
    case "uk": return { pageLabel: "小褌芯褉褨薪泻邪", pageCountSuffix: "褋褌芯褉褨薪芯泻", referencesTitle: "袙邪卸谢懈胁褨 屑褨褋褑褟 胁 写芯泻褍屑械薪褌褨", referencesText: "笑褨 写邪薪褨 胁写邪谢芯褋褟 锌褉懈胁鈥櫻徯沸把傂?写芯 泻芯薪泻褉械褌薪懈褏 褋褌芯褉褨薪芯泻.", pageSummaryTitle: "袨谐谢褟写 褋褌芯褉褨薪芯泻", pageSummaryText: "袣芯褉芯褌泻芯 锌褉芯 褌械, 褖芯 褦 薪邪 泻芯卸薪褨泄 褋褌芯褉褨薪褑褨." };
    case "es": return { pageLabel: "P谩gina", pageCountSuffix: "p谩ginas", referencesTitle: "Lugares importantes del documento", referencesText: "Estos datos se pudieron vincular a p谩ginas concretas.", pageSummaryTitle: "Resumen por p谩ginas", pageSummaryText: "Una vista corta de lo que contiene cada p谩gina." };
    default: return { pageLabel: "Seite", pageCountSuffix: "Seiten", referencesTitle: "Wichtige Stellen im Dokument", referencesText: "Diese Angaben konnten konkreten Seiten zugeordnet werden.", pageSummaryTitle: "Seitenüberblick", pageSummaryText: "Kurz erklärt, was auf den einzelnen Seiten steht." };
  }
}


