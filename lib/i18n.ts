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
    default:
      return "de-DE";
  }
}

type Copy = {
  nav: { home: string; upload: string; tasks: string; settings: string; desk: string; brand: string };
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
    intro: string;
    saveInfoTitle: string;
    saveInfoText: string;
    cardTitle: string;
    allowedFormats: string;
    dropzoneTitle: string;
    dropzoneText: string;
    pickFile: string;
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
  nav: { home: "Home", upload: "Upload", tasks: "Aufgaben", settings: "Einstellungen", desk: "Dein Büro im Blick", brand: "BureauCare" },
  common: { uploaded: "Hochgeladen", analysisAvailable: "Analyse verfügbar", analysisPending: "Analyse ausstehend", unknown: "Unbekannt", noClearDeadline: "Keine klare Frist", deadline: "Frist", subject: "Thema", sender: "Absender", urgency: "Dringlichkeit", statusOpen: "Offen", statusDone: "Erledigt", document: "Dokument", openDocument: "Dokument öffnen", saveInProgress: "Wird gespeichert...", moreDetails: "Mehr Details", shortExplained: "Kurz erklärt", signOut: "Abmelden", dateUploaded: "Hochgeladen am", currentStatus: "Aktueller Stand", name: "Name", language: "Sprache", session: "Sitzung" },
  urgency: { high: "Hoch", medium: "Mittel", low: "Niedrig", unclear: "Noch unklar" },
  actionMode: { online: "Online möglich", onSite: "Vor Ort", byPost: "Per Post", byPhone: "Telefonisch" },
  home: { welcome: "Willkommen zurück", titleFallback: "Dein BureauCare", intro: "Alle wichtigen Dokumente an einem geschützten Ort, mit klaren Erklärungen, Fristen und nächsten Schritten.", newLetter: "Neues Dokument", uploadTitle: "Neues Dokument hochladen", uploadText: "Lade ein amtliches Dokument oder ein offizielles Schreiben hoch und speichere es sicher in deinem Konto.", latestDocuments: "Letzte Dokumente", entries: "Einträge", noDocuments: "Noch keine Dokumente vorhanden. Lade dein erstes Dokument hoch, um hier eine Übersicht zu sehen.", openDeadlines: "Offene Fristen", tasks: "Aufgaben", noDeadlinesTitle: "Noch keine offenen Fristen", noDeadlinesText: "Sobald ein Dokument mit Frist erkannt wird, erscheint hier automatisch dein nächster To-do-Punkt." },
  settings: { section: "Einstellungen", title: "Konto und Sprache", intro: "Lege fest, wie dein Name in Antworten erscheint und in welche Sprache BureauCare zusätzlich übersetzen soll.", currentState: "Aktueller Stand", noName: "Kein Name hinterlegt", sessionText: "Du kannst dich jederzeit sicher abmelden. Deine Dokumente bleiben in deinem geschützten Bereich.", fullName: "Dein Name", translationLanguage: "Sprache für Übersetzungen", save: "Einstellungen speichern", saving: "Wird gespeichert...", namePlaceholder: "Max Mustermann" },
  upload: { badge: "Dokument hochladen", title: "Dokument sicher in BureauCare speichern", intro: "Lade hier ein amtliches Dokument oder ein offizielles Schreiben hoch. BureauCare erklärt dir, was du tun musst.", saveInfoTitle: "So wird gespeichert", saveInfoText: "Deine Datei landet im privaten Supabase-Bucket documents. Jeder Pfad wird unter deiner Nutzer-ID gespeichert, damit ausschließlich du Zugriff auf deine Dokumente hast.", cardTitle: "Datei sicher hochladen", allowedFormats: "Erlaubte Formate: PDF, JPG, JPEG, PNG. Maximale Dateigröße: 15 MB.", dropzoneTitle: "Datei hier hineinziehen", dropzoneText: "Am Desktop kannst du die Datei per Drag & Drop ablegen oder unten direkt auswählen.", pickFile: "Datei auswählen", submit: "Dokument hochladen", submitting: "Datei wird hochgeladen..." },
  tasks: { section: "Aufgaben", title: "Offene Fristen im Blick", intro: "Hier siehst du, was gerade wichtig ist, warum es zählt und wie du direkt zum passenden Dokument kommst.", none: "Noch keine Aufgaben vorhanden.", topic: "Thema", whatToDo: "Was zu tun ist", noLinkedDocument: "Kein Dokument verknüpft", toDocument: "Zum Dokument und nächsten Schritt", markDone: "Als erledigt markieren", openOfficialLink: "Offiziellen Link öffnen" },
  documents: { badge: "Dokument", introReady: "Hier ist in einfachen Worten, was das Dokument von dir will.", introPending: "Dokument hochgeladen. Analyse folgt.", topBox: "Das Wichtigste", topTitle: "Sofort erkennen, was jetzt wichtig ist", reactionNeeded: "Reaktion nötig", noDirectPressure: "Kein direkter Handlungsdruck", keyPoints: "Kernpunkte", keyPointsText: "Die wichtigsten Aussagen in sehr kurzer Form.", explainTitle: "Vereinfacht erklärt", explainText: "Kurz oder mit etwas mehr Kontext, aber ohne Behördensprache.", nextStepsTitle: "Was du jetzt tun solltest", nextStepsText: "Die nächsten sinnvollen Schritte aus dem Dokument.", noNextStep: "Noch kein klarer nächster Schritt erkannt.", ifIgnoredTitle: "Wenn du nichts machst", ifIgnoredText: "Mögliche Folgen, soweit aus dem Dokument erkennbar.", noClearConsequence: "Dazu war im Dokument keine klare Folge erkennbar.", understandTitle: "Dokument verstehen", understandText: "BureauCare liest das Dokument serverseitig und erklärt es dir in einfachen Worten.", beforeAnalysis: "Vor der Analyse", beforeAnalysisText: "Wir prüfen, wer das Dokument geschickt hat, worum es geht, ob du etwas tun musst, bis wann Zeit ist und was du jetzt am besten machen solltest.", analyzeDocument: "Dokument analysieren", analyzingDocument: "Dokument wird analysiert...", createReply: "Antwort erstellen", whereToDoIt: "Wo du das erledigen kannst", kind: "Art", office: "Stelle", address: "Adresse", openOfficialLink: "Offiziellen Link öffnen", nextStep: "Nächster Schritt", nextStepText: "Hier kannst du direkt eine passende Antwort vorbereiten.", unknownFileType: "Unbekannter Dateityp", noDownloadLink: "Für diese Datei konnte kein Download-Link erzeugt werden." },
  reply: { back: "Zurück zum Dokument", badge: "Antwortgenerator", title: "Passende Antwort vorbereiten", intro: "Wähle einen Ton und lasse dir einen direkt nutzbaren Entwurf für dieses Schreiben erstellen.", unknownSender: "Unbekannter Absender", situation: "Ausgangslage", situationText: "Diese vereinfachte Zusammenfassung fließt in die Antwort ein.", note: "Hinweis", noteText: "Prüfe den Entwurf kurz, bevor du ihn verschickst.", tone: "Antwortton", format: "Format", asLetter: "Als Schreiben", asEmail: "Als E-Mail", includeName: "Meinen Namen am Ende einfügen", create: "Antwort generieren", creating: "Antwort wird erstellt...", regenerate: "Neue Antwort generieren", regenerating: "Neue Version wird erstellt...", previousDrafts: "Frühere Entwürfe", german: "Deutsch", neutral: "Neutral", friendly: "Freundlich", veryFormal: "Sehr formell", objection: "Widerspruch", appeal: "Einspruch", needMoreTime: "Ich brauche mehr Zeit" }
};

const en: Copy = {
  ...de,
  nav: { home: "Home", upload: "Upload", tasks: "Tasks", settings: "Settings", desk: "Your desk at a glance", brand: "BureauCare" },
  common: { ...de.common, analysisAvailable: "Analysis ready", analysisPending: "Analysis pending", unknown: "Unknown", noClearDeadline: "No clear deadline", deadline: "Deadline", subject: "Subject", sender: "Sender", urgency: "Urgency", statusOpen: "Open", statusDone: "Done", document: "Document", openDocument: "Open document", saveInProgress: "Saving...", moreDetails: "More details", shortExplained: "Quick view", signOut: "Sign out", dateUploaded: "Uploaded on", currentStatus: "Current status", language: "Language", session: "Session" },
  urgency: { high: "High", medium: "Medium", low: "Low", unclear: "Still unclear" },
  actionMode: { online: "Online possible", onSite: "In person", byPost: "By mail", byPhone: "By phone" },
  home: { ...de.home, welcome: "Welcome back", titleFallback: "Your BureauCare", intro: "All important documents in one protected place, with clear explanations, deadlines and next steps.", newLetter: "New document", uploadTitle: "Upload a new document", uploadText: "Upload an official document or notice and keep it safe in your account.", latestDocuments: "Recent documents", entries: "entries", noDocuments: "No documents yet. Upload your first document to see an overview here.", openDeadlines: "Open deadlines", tasks: "tasks", noDeadlinesTitle: "No open deadlines yet", noDeadlinesText: "As soon as a document with a deadline is detected, your next task appears here automatically." },
  settings: { ...de.settings, section: "Settings", title: "Account and language", intro: "Choose how your name appears in replies and which language BureauCare should additionally translate into.", currentState: "Current status", noName: "No name saved", sessionText: "You can sign out safely at any time. Your documents stay in your protected area.", fullName: "Your name", translationLanguage: "Translation language", save: "Save settings", saving: "Saving..." },
  upload: { ...de.upload, badge: "Upload document", title: "Store your document safely in BureauCare", intro: "Upload an official document or notice here. BureauCare explains what you need to do.", saveInfoTitle: "How it is stored", saveInfoText: "Your file is stored in the private Supabase bucket documents. Each path is saved under your user ID so only you can access your documents.", cardTitle: "Upload file securely", allowedFormats: "Allowed formats: PDF, JPG, JPEG, PNG. Maximum file size: 15 MB.", dropzoneTitle: "Drop your file here", dropzoneText: "On desktop you can drag and drop the file here or choose it below.", pickFile: "Choose file", submit: "Upload document", submitting: "Uploading file..." },
  tasks: { ...de.tasks, section: "Tasks", title: "Keep deadlines in view", intro: "Here you can see what matters now, why it matters, and how to jump to the right document.", none: "No tasks yet.", topic: "Subject", whatToDo: "What to do", noLinkedDocument: "No linked document", toDocument: "Open document and next step", markDone: "Mark as done", openOfficialLink: "Open official link" },
  documents: { ...de.documents, introReady: "Here is what the document wants from you, in simple words.", introPending: "Document uploaded. Analysis is coming.", topBox: "What matters most", topTitle: "See right away what matters now", reactionNeeded: "Action needed", noDirectPressure: "No immediate pressure", keyPoints: "Key points", keyPointsText: "The most important statements in a very short form.", explainTitle: "Explained simply", explainText: "Short or with more context, but without official jargon.", nextStepsTitle: "What you should do now", nextStepsText: "The next sensible steps from the document.", noNextStep: "No clear next step detected yet.", ifIgnoredTitle: "If you do nothing", ifIgnoredText: "Possible consequences, as far as they can be seen in the document.", noClearConsequence: "No clear consequence could be identified from the document.", understandTitle: "Understand the document", understandText: "BureauCare reads the document on the server and explains it in simple words.", beforeAnalysis: "Before the analysis", beforeAnalysisText: "We check who sent the document, what it is about, whether you need to do something, by when, and what you should do next.", analyzeDocument: "Analyze document", analyzingDocument: "Document is being analyzed...", createReply: "Create reply", whereToDoIt: "Where you can do this", kind: "Type", office: "Office", address: "Address", openOfficialLink: "Open official link", nextStep: "Next step", nextStepText: "Here you can prepare a fitting reply right away.", unknownFileType: "Unknown file type", noDownloadLink: "No download link could be created for this file." },
  reply: { ...de.reply, back: "Back to document", badge: "Reply generator", title: "Prepare a suitable reply", intro: "Choose a tone and generate a ready-to-use draft for this message.", unknownSender: "Unknown sender", situation: "Situation", situationText: "This simplified summary is used for the reply.", note: "Note", noteText: "Please check the draft briefly before sending it.", tone: "Reply tone", format: "Format", asLetter: "As message", asEmail: "As email", includeName: "Add my name at the end", create: "Generate reply", creating: "Generating reply...", regenerate: "Generate a new reply", regenerating: "Creating a new version...", previousDrafts: "Earlier drafts", german: "German", neutral: "Neutral", friendly: "Friendly", veryFormal: "Very formal", objection: "Objection", appeal: "Appeal", needMoreTime: "I need more time" }
};

const tr: Copy = { ...en, nav: { ...en.nav, home: "Ana sayfa", upload: "Yükle", tasks: "Görevler", settings: "Ayarlar", desk: "Masandaki özet" }, common: { ...en.common, uploaded: "Yüklendi", analysisAvailable: "Analiz hazır", analysisPending: "Analiz bekleniyor", unknown: "Bilinmiyor", noClearDeadline: "Net bir son tarih yok", deadline: "Son tarih", subject: "Konu", sender: "Gönderen", urgency: "Aciliyet", statusOpen: "Açık", statusDone: "Tamamlandı", openDocument: "Belgeyi aç", saveInProgress: "Kaydediliyor...", moreDetails: "Daha fazla detay", shortExplained: "Kısa açıklama", signOut: "Çıkış yap", dateUploaded: "Yüklenme tarihi", currentStatus: "Mevcut durum", name: "İsim", language: "Dil", session: "Oturum" }, urgency: { high: "Yüksek", medium: "Orta", low: "Düşük", unclear: "Henüz belirsiz" }, actionMode: { online: "Çevrim içi mümkün", onSite: "Yerinde", byPost: "Posta ile", byPhone: "Telefonla" } };
const uk: Copy = { ...en, nav: { ...en.nav, home: "Головна", upload: "Завантажити", tasks: "Завдання", settings: "Налаштування", desk: "Усе важливе під рукою" }, common: { ...en.common, uploaded: "Завантажено", analysisAvailable: "Аналіз готовий", analysisPending: "Аналіз очікується", unknown: "Невідомо", noClearDeadline: "Чіткого строку немає", deadline: "Строк", subject: "Тема", sender: "Відправник", urgency: "Терміновість", statusOpen: "Відкрито", statusDone: "Виконано", openDocument: "Відкрити документ", saveInProgress: "Зберігається...", moreDetails: "Більше деталей", shortExplained: "Коротко", signOut: "Вийти", currentStatus: "Поточний стан", name: "Ім’я", language: "Мова", session: "Сеанс" }, urgency: { high: "Висока", medium: "Середня", low: "Низька", unclear: "Поки неясно" }, actionMode: { online: "Можна онлайн", onSite: "Особисто", byPost: "Поштою", byPhone: "Телефоном" } };
const es: Copy = {
  ...en,
  nav: { ...en.nav, home: "Inicio", upload: "Subir", tasks: "Tareas", settings: "Ajustes", desk: "Todo importante a la vista" },
  common: {
    ...en.common,
    uploaded: "Subido",
    analysisAvailable: "Análisis listo",
    analysisPending: "Análisis pendiente",
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
    moreDetails: "Más detalles",
    shortExplained: "Explicación corta",
    signOut: "Cerrar sesión",
    dateUploaded: "Subido el",
    currentStatus: "Estado actual",
    name: "Nombre",
    language: "Idioma",
    session: "Sesión"
  },
  urgency: { high: "Alta", medium: "Media", low: "Baja", unclear: "Aún no está claro" },
  actionMode: { online: "Posible en línea", onSite: "En persona", byPost: "Por correo", byPhone: "Por teléfono" },
  home: {
    ...en.home,
    welcome: "Bienvenido de nuevo",
    titleFallback: "Tu BureauCare",
    intro: "Todos tus documentos importantes en un lugar protegido, con explicaciones claras, plazos y próximos pasos.",
    newLetter: "Nuevo documento",
    uploadTitle: "Subir un nuevo documento",
    uploadText: "Sube un documento oficial o una notificación y guárdalo de forma segura en tu cuenta.",
    latestDocuments: "Documentos recientes",
    entries: "entradas",
    noDocuments: "Todavía no hay documentos. Sube tu primer documento para ver aquí un resumen.",
    openDeadlines: "Plazos abiertos",
    tasks: "tareas",
    noDeadlinesTitle: "Todavía no hay plazos abiertos",
    noDeadlinesText: "En cuanto se detecte un documento con plazo, tu siguiente tarea aparecerá aquí automáticamente."
  },
  settings: {
    ...en.settings,
    section: "Ajustes",
    title: "Cuenta e idioma",
    intro: "Elige cómo debe aparecer tu nombre en las respuestas y a qué idioma adicional debe traducir BureauCare.",
    currentState: "Estado actual",
    noName: "No hay nombre guardado",
    sessionText: "Puedes cerrar sesión de forma segura en cualquier momento. Tus documentos permanecen en tu zona protegida.",
    fullName: "Tu nombre",
    translationLanguage: "Idioma de traducción",
    save: "Guardar ajustes",
    saving: "Guardando..."
  },
  upload: {
    ...en.upload,
    badge: "Subir documento",
    title: "Guardar tu documento de forma segura en BureauCare",
    intro: "Sube aquí un documento oficial o una notificación. BureauCare te explica qué debes hacer.",
    saveInfoTitle: "Cómo se guarda",
    saveInfoText: "Tu archivo se guarda en el bucket privado documents de Supabase. Cada ruta se guarda bajo tu ID de usuario, así que solo tú puedes acceder a tus documentos.",
    cardTitle: "Subir archivo de forma segura",
    allowedFormats: "Formatos permitidos: PDF, JPG, JPEG, PNG. Tamaño máximo: 15 MB.",
    dropzoneTitle: "Suelta tu archivo aquí",
    dropzoneText: "En escritorio puedes arrastrar el archivo aquí o elegirlo abajo.",
    pickFile: "Elegir archivo",
    submit: "Subir documento",
    submitting: "Subiendo archivo..."
  },
  tasks: {
    ...en.tasks,
    section: "Tareas",
    title: "Mantén tus plazos a la vista",
    intro: "Aquí ves qué es importante ahora, por qué importa y cómo abrir directamente el documento correcto.",
    none: "Todavía no hay tareas.",
    topic: "Tema",
    whatToDo: "Qué hacer",
    noLinkedDocument: "No hay documento vinculado",
    toDocument: "Abrir documento y siguiente paso",
    markDone: "Marcar como hecho",
    openOfficialLink: "Abrir enlace oficial"
  },
  documents: {
    ...en.documents,
    badge: "Documento",
    introReady: "Aquí tienes en palabras simples lo que este documento quiere de ti.",
    introPending: "Documento subido. El análisis viene después.",
    topBox: "Lo más importante",
    topTitle: "Ver enseguida qué es importante ahora",
    reactionNeeded: "Hace falta actuar",
    noDirectPressure: "No hay presión inmediata",
    keyPoints: "Puntos clave",
    keyPointsText: "Las afirmaciones más importantes en forma muy corta.",
    explainTitle: "Explicado de forma simple",
    explainText: "Corto o con un poco más de contexto, pero sin lenguaje burocrático.",
    nextStepsTitle: "Qué deberías hacer ahora",
    nextStepsText: "Los siguientes pasos más razonables del documento.",
    noNextStep: "Todavía no se ha detectado un siguiente paso claro.",
    ifIgnoredTitle: "Si no haces nada",
    ifIgnoredText: "Posibles consecuencias, en la medida en que se puedan ver en el documento.",
    noClearConsequence: "No se pudo identificar una consecuencia clara a partir del documento.",
    understandTitle: "Entender el documento",
    understandText: "BureauCare lee el documento en el servidor y te lo explica con palabras simples.",
    beforeAnalysis: "Antes del análisis",
    beforeAnalysisText: "Comprobamos quién envió el documento, de qué trata, si tienes que hacer algo, hasta cuándo tienes tiempo y cuál es el mejor siguiente paso.",
    analyzeDocument: "Analizar documento",
    analyzingDocument: "El documento se está analizando...",
    createReply: "Crear respuesta",
    whereToDoIt: "Dónde puedes hacerlo",
    kind: "Tipo",
    office: "Oficina",
    address: "Dirección",
    openOfficialLink: "Abrir enlace oficial",
    nextStep: "Siguiente paso",
    nextStepText: "Aquí puedes preparar directamente una respuesta adecuada.",
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
    situation: "Situación",
    situationText: "Este resumen simplificado se usa para la respuesta.",
    note: "Nota",
    noteText: "Revisa brevemente el borrador antes de enviarlo.",
    tone: "Tono de la respuesta",
    format: "Formato",
    asLetter: "Como escrito",
    asEmail: "Como correo electrónico",
    includeName: "Añadir mi nombre al final",
    create: "Generar respuesta",
    creating: "Se está generando la respuesta...",
    regenerate: "Generar una nueva respuesta",
    regenerating: "Se está creando una nueva versión...",
    previousDrafts: "Borradores anteriores",
    german: "Alemán",
    neutral: "Neutral",
    friendly: "Amable",
    veryFormal: "Muy formal",
    objection: "Oposición",
    appeal: "Recurso",
    needMoreTime: "Necesito más tiempo"
  }
};

const copy: Record<AppLocale, Copy> = { de, en, tr, uk, es };

export function getCopy(locale: string | null | undefined) {
  return copy[normalizePreferredLanguage(locale)];
}

export function getAltLanguageLabel(locale: string | null | undefined) {
  return getLanguageLabel(normalizePreferredLanguage(locale));
}

export function getReminderCopy(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en": return { dueToday: "Due today", dueSoon: "Due soon", overdue: "Overdue", openLater: "Upcoming", completed: "Completed", reminderIntro: "Keep an eye on the next deadlines so nothing slips through.", noItems: "Nothing in this section right now." };
    case "tr": return { dueToday: "Bugün son gün", dueSoon: "Yakında son gün", overdue: "Süresi geçti", openLater: "Daha sonra", completed: "Tamamlananlar", reminderIntro: "Hiçbir şeyi kaçırmamak için sıradaki son tarihleri burada gör.", noItems: "Bu bölümde şu anda bir şey yok." };
    case "uk": return { dueToday: "Потрібно сьогодні", dueSoon: "Незабаром", overdue: "Строк минув", openLater: "Пізніше", completed: "Виконано", reminderIntro: "Тут видно найближчі строки, щоб нічого не пропустити.", noItems: "У цьому розділі зараз нічого немає." };
    case "es": return { dueToday: "Vence hoy", dueSoon: "Vence pronto", overdue: "Vencido", openLater: "Más adelante", completed: "Completado", reminderIntro: "Aquí ves los próximos plazos para que no se te pase nada.", noItems: "Ahora mismo no hay nada en esta sección." };
    default: return { dueToday: "Heute fällig", dueSoon: "Bald fällig", overdue: "Überfällig", openLater: "Später offen", completed: "Erledigt", reminderIntro: "Hier siehst du die nächsten Fristen auf einen Blick, damit nichts untergeht.", noItems: "In diesem Bereich ist gerade nichts offen." };
  }
}

export function getUsageCopy(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en": return { title: "Usage this month", analyses: "free analyses used", replies: "reply drafts created", note: "This is a gentle preview of future free plan limits.", limitReached: "You have reached your free monthly analysis limit." };
    case "tr": return { title: "Bu ay kullanım", analyses: "ücretsiz analiz kullanıldı", replies: "yanıt taslağı oluşturuldu", note: "Bu alan ilerideki ücretsiz plan limitleri için hafif bir önizlemedir.", limitReached: "Bu ay için ücretsiz analiz limitine ulaştın." };
    case "uk": return { title: "Використання за місяць", analyses: "безкоштовних аналізів використано", replies: "чернеток відповіді створено", note: "Це ненав’язлива підготовка до майбутніх лімітів безкоштовного плану.", limitReached: "Ви досягли безкоштовного місячного ліміту аналізів." };
    case "es": return { title: "Uso este mes", analyses: "análisis gratuitos usados", replies: "borradores de respuesta creados", note: "Esto es una vista previa discreta de los futuros límites del plan gratuito.", limitReached: "Has alcanzado tu límite mensual gratuito de análisis." };
    default: return { title: "Nutzung in diesem Monat", analyses: "kostenlose Analysen genutzt", replies: "Antwortentwürfe erstellt", note: "Das ist eine dezente Vorschau auf spätere Freemium-Limits.", limitReached: "Du hast dein kostenloses Monatslimit für Analysen erreicht." };
  }
}

export function getDocumentTrustCopy(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en": return { pageLabel: "Page", pageCountSuffix: "pages", referencesTitle: "Important places in the document", referencesText: "These details were linked to specific pages.", pageSummaryTitle: "Page overview", pageSummaryText: "A short view of what each page contains." };
    case "tr": return { pageLabel: "Sayfa", pageCountSuffix: "sayfa", referencesTitle: "Belgedeki önemli yerler", referencesText: "Bu bilgiler belirli sayfalara bağlanabildi.", pageSummaryTitle: "Sayfa özeti", pageSummaryText: "Her sayfada ne olduğuna dair kısa bir bakış." };
    case "uk": return { pageLabel: "Сторінка", pageCountSuffix: "сторінок", referencesTitle: "Важливі місця в документі", referencesText: "Ці дані вдалося прив’язати до конкретних сторінок.", pageSummaryTitle: "Огляд сторінок", pageSummaryText: "Коротко про те, що є на кожній сторінці." };
    case "es": return { pageLabel: "Página", pageCountSuffix: "páginas", referencesTitle: "Lugares importantes del documento", referencesText: "Estos datos se pudieron vincular a páginas concretas.", pageSummaryTitle: "Resumen por páginas", pageSummaryText: "Una vista corta de lo que contiene cada página." };
    default: return { pageLabel: "Seite", pageCountSuffix: "Seiten", referencesTitle: "Wichtige Stellen im Dokument", referencesText: "Diese Angaben konnten konkreten Seiten zugeordnet werden.", pageSummaryTitle: "Seitenüberblick", pageSummaryText: "Kurz erklärt, was auf den einzelnen Seiten steht." };
  }
}
