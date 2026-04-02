import { normalizePreferredLanguage } from "@/lib/languages";
import type { GoalAnalysisResult, GoalStep, GoalStepImportance } from "@/lib/types";

export type GoalClarificationQuestion = {
  id: string;
  question: string;
  options: string[];
};

type GoalsCopy = {
  navLabel: string;
  title: string;
  plannerTitle: string;
  currentGoalTitle: string;
  collectionTitle: string;
  goalInput: string;
  currentAge: string;
  targetAge: string;
  targetYear: string;
  targetModeAge: string;
  targetModeYear: string;
  financialAmount: string;
  monthlyIncome: string;
  financialHint: string;
  analyze: string;
  analyzing: string;
  continue: string;
  restart: string;
  backToPlanner: string;
  removeGoal: string;
  completeGoal: string;
  completedGoal: string;
  noGoals: string;
  overview: string;
  timeline: string;
  progress: string;
  financialProgress: string;
  steps: string;
  guidance: string;
  recommendation: string;
  done: string;
  open: string;
  duration: string;
  importance: string;
  ageNow: string;
  ageTarget: string;
  amountLabel: string;
  goalPlaceholder: string;
  financeSummaryStart: string;
  financeSummaryMid: string;
  financeSummaryStrong: string;
  saveError: string;
  saveSuccess: string;
  updateError: string;
  clarifyTitle: string;
  clarifyText: string;
  financePromptFallback: string;
  collectionHint: string;
  createdAt: string;
  noSelection: string;
  questionMissing: string;
  deleteSuccess: string;
  luckyTitle: string;
  luckyText: string;
  completeSuccess: string;
};

const copyMap: Record<string, GoalsCopy> = {
  de: {
    navLabel: "Ziele",
    title: "Ziele",
    plannerTitle: "Neues Ziel eingeben",
    currentGoalTitle: "Aktuelles Ziel",
    collectionTitle: "Meine Ziele",
    goalInput: "Dein Ziel",
    currentAge: "Dein aktuelles Alter",
    targetAge: "Gewünschtes Alter",
    targetYear: "Zieljahr",
    targetModeAge: "Alter",
    targetModeYear: "Jahr",
    financialAmount: "Aktuelles Erspartes",
    monthlyIncome: "Monatliches Einkommen",
    financialHint: "Nur wenn du diese Zahlen freiwillig angeben möchtest.",
    analyze: "Ziel analysieren",
    analyzing: "Ziel wird analysiert...",
    continue: "Weiter",
    restart: "Neues Ziel eingeben",
    backToPlanner: "Zur Eingabe zurück",
    removeGoal: "Ziel entfernen",
    completeGoal: "Ziel erfüllt",
    completedGoal: "Erfüllt",
    noGoals: "Noch kein Ziel vorhanden. Sobald du ein Ziel speicherst, erscheint es hier in deiner Sammlung.",
    overview: "Überblick",
    timeline: "Geschätzte Dauer",
    progress: "Fortschritt",
    financialProgress: "Finanzielle Nähe",
    steps: "Bürokratische Schritte",
    guidance: "KI-Hinweise",
    recommendation: "Einfache Einschätzung",
    done: "Erledigt",
    open: "Offen",
    duration: "Dauer",
    importance: "Wichtigkeit",
    ageNow: "Aktuell",
    ageTarget: "Ziel",
    amountLabel: "Finanzstatus",
    goalPlaceholder: "Zum Beispiel: Ich möchte bis 28 einen Oldtimer Porsche besitzen.",
    financeSummaryStart: "Finanziell bist du eher noch am Anfang.",
    financeSummaryMid: "Finanziell ist schon eine brauchbare Grundlage da.",
    financeSummaryStrong: "Finanziell sieht es schon recht solide aus.",
    saveError: "Das Ziel konnte gerade nicht analysiert werden.",
    saveSuccess: "Dein Ziel wurde gespeichert.",
    updateError: "Der Fortschritt konnte nicht aktualisiert werden.",
    clarifyTitle: "Damit BureauCare besser helfen kann",
    clarifyText: "Beantworte kurz diese Fragen, damit dein Ziel konkreter und hilfreicher eingeordnet werden kann.",
    financePromptFallback: "Für dieses Ziel spielen auch finanzielle Voraussetzungen eine Rolle. Wenn du möchtest, kannst du jetzt freiwillig ein paar Zahlen ergänzen.",
    collectionHint: "Deine gespeicherten Ziele bleiben hier gesammelt und lassen sich jederzeit wieder laden.",
    createdAt: "Erstellt",
    noSelection: "Links erscheint standardmäßig die Eingabe für ein neues Ziel.",
    questionMissing: "Bitte wähle erst für jede Rückfrage eine Antwort aus.",
    deleteSuccess: "Das Ziel wurde entfernt.",
    luckyTitle: "Diesmal hattest du wirklich Glück.",
    luckyText: "Für dieses Ziel wurde gerade kein nennenswertes bürokratisches Hindernis erkannt. Ein selten schöner Moment.",
    completeSuccess: "Stark. Dieses Ziel ist jetzt als erfüllt markiert."
  },
  en: {
    navLabel: "Goals",
    title: "Goals",
    plannerTitle: "Enter a new goal",
    currentGoalTitle: "Current goal",
    collectionTitle: "My goals",
    goalInput: "Your goal",
    currentAge: "Your current age",
    targetAge: "Target age",
    targetYear: "Target year",
    targetModeAge: "Age",
    targetModeYear: "Year",
    financialAmount: "Current savings",
    monthlyIncome: "Monthly income",
    financialHint: "Only if you want to share these numbers.",
    analyze: "Analyze goal",
    analyzing: "Goal is being analyzed...",
    continue: "Continue",
    restart: "Enter a new goal",
    backToPlanner: "Back to input",
    removeGoal: "Remove goal",
    completeGoal: "Goal completed",
    completedGoal: "Completed",
    noGoals: "No goal yet. As soon as you save one, it will appear here in your collection.",
    overview: "Overview",
    timeline: "Estimated timeline",
    progress: "Progress",
    financialProgress: "Financial progress",
    steps: "Bureaucratic steps",
    guidance: "AI guidance",
    recommendation: "Simple recommendation",
    done: "Done",
    open: "Open",
    duration: "Duration",
    importance: "Importance",
    ageNow: "Current",
    ageTarget: "Target",
    amountLabel: "Financial status",
    goalPlaceholder: "For example: I want to own a vintage Porsche by age 28.",
    financeSummaryStart: "Financially, you are still at an early stage.",
    financeSummaryMid: "Financially, you already have a useful base.",
    financeSummaryStrong: "Financially, this already looks quite solid.",
    saveError: "The goal could not be analyzed right now.",
    saveSuccess: "Your goal was saved.",
    updateError: "The progress could not be updated.",
    clarifyTitle: "So BureauCare can help better",
    clarifyText: "Answer these short questions so your goal can be understood more clearly.",
    financePromptFallback: "Financial conditions matter for this goal. If you want, you can now add a few optional numbers.",
    collectionHint: "Your saved goals stay collected here and can be loaded again at any time.",
    createdAt: "Created",
    noSelection: "The left side starts with the input for a new goal.",
    questionMissing: "Please pick an answer for each follow-up question first.",
    deleteSuccess: "The goal was removed.",
    luckyTitle: "You really got lucky this time.",
    luckyText: "No meaningful bureaucratic hurdle was detected for this goal right now. A rare and beautiful moment.",
    completeSuccess: "Nice. This goal is now marked as completed."
  },
  tr: {
    navLabel: "Hedefler",
    title: "Hedefler",
    plannerTitle: "Yeni hedef gir",
    currentGoalTitle: "Güncel hedef",
    collectionTitle: "Hedeflerim",
    goalInput: "Hedefin",
    currentAge: "Şu anki yaşın",
    targetAge: "Hedef yaş",
    targetYear: "Hedef yıl",
    targetModeAge: "Yaş",
    targetModeYear: "Yıl",
    financialAmount: "Mevcut birikim",
    monthlyIncome: "Aylık gelir",
    financialHint: "Bu sayıları sadece istersen paylaş.",
    analyze: "Hedefi analiz et",
    analyzing: "Hedef analiz ediliyor...",
    continue: "Devam et",
    restart: "Yeni hedef gir",
    backToPlanner: "Girişe dön",
    removeGoal: "Hedefi kaldır",
    completeGoal: "Hedef tamamlandı",
    completedGoal: "Tamamlandı",
    noGoals: "Henüz hedef yok. Bir hedef kaydettiğinde burada görünür.",
    overview: "Genel bakış",
    timeline: "Tahmini süre",
    progress: "İlerleme",
    financialProgress: "Mali yakınlık",
    steps: "Bürokratik adımlar",
    guidance: "Yapay zeka ipuçları",
    recommendation: "Basit değerlendirme",
    done: "Tamamlandı",
    open: "Açık",
    duration: "Süre",
    importance: "Önem",
    ageNow: "Şimdi",
    ageTarget: "Hedef",
    amountLabel: "Mali durum",
    goalPlaceholder: "Örneğin: 28 yaşıma kadar bir klasik Porsche sahibi olmak istiyorum.",
    financeSummaryStart: "Mali açıdan daha yolun başındasın.",
    financeSummaryMid: "Mali açıdan işe yarar bir temel var.",
    financeSummaryStrong: "Mali açıdan durum şimdiden oldukça sağlam görünüyor.",
    saveError: "Hedef şu anda analiz edilemedi.",
    saveSuccess: "Hedefin kaydedildi.",
    updateError: "İlerleme güncellenemedi.",
    clarifyTitle: "BureauCare daha iyi yardımcı olsun diye",
    clarifyText: "Hedefini daha net anlamak için bu kısa soruları cevapla.",
    financePromptFallback: "Bu hedefte maddi koşullar da önemli olabilir. İstersen şimdi birkaç isteğe bağlı sayı ekleyebilirsin.",
    collectionHint: "Kaydettiğin hedefler burada toplanır ve istediğin zaman tekrar açılır.",
    createdAt: "Oluşturuldu",
    noSelection: "Sol tarafta standart olarak yeni hedef girişi görünür.",
    questionMissing: "Lütfen önce her soru için bir cevap seç.",
    deleteSuccess: "Hedef kaldırıldı.",
    luckyTitle: "Bu kez gerçekten şanslıydın.",
    luckyText: "Bu hedef için şu anda kayda değer bir bürokratik engel görünmüyor. Ender rastlanan güzel bir durum.",
    completeSuccess: "Harika. Bu hedef artık tamamlandı olarak işaretlendi."
  },
  uk: {
    navLabel: "Цілі",
    title: "Цілі",
    plannerTitle: "Ввести нову ціль",
    currentGoalTitle: "Поточна ціль",
    collectionTitle: "Мої цілі",
    goalInput: "Твоя ціль",
    currentAge: "Твій теперішній вік",
    targetAge: "Бажаний вік",
    targetYear: "Цільовий рік",
    targetModeAge: "Вік",
    targetModeYear: "Рік",
    financialAmount: "Наявні заощадження",
    monthlyIncome: "Місячний дохід",
    financialHint: "Лише якщо хочеш добровільно поділитися цими цифрами.",
    analyze: "Проаналізувати ціль",
    analyzing: "Ціль аналізується...",
    continue: "Продовжити",
    restart: "Ввести нову ціль",
    backToPlanner: "Назад до вводу",
    removeGoal: "Видалити ціль",
    completeGoal: "Ціль виконано",
    completedGoal: "Виконано",
    noGoals: "Ще немає жодної цілі. Щойно ти її збережеш, вона з’явиться тут.",
    overview: "Огляд",
    timeline: "Орієнтовний час",
    progress: "Прогрес",
    financialProgress: "Фінансова готовність",
    steps: "Бюрократичні кроки",
    guidance: "Поради ШІ",
    recommendation: "Проста оцінка",
    done: "Виконано",
    open: "Відкрито",
    duration: "Тривалість",
    importance: "Важливість",
    ageNow: "Зараз",
    ageTarget: "Ціль",
    amountLabel: "Фінансовий стан",
    goalPlaceholder: "Наприклад: Я хочу до 28 років мати старий Porsche.",
    financeSummaryStart: "Фінансово ти ще радше на початку.",
    financeSummaryMid: "Фінансово вже є непогана база.",
    financeSummaryStrong: "Фінансово ситуація вже виглядає досить стабільно.",
    saveError: "Зараз не вдалося проаналізувати ціль.",
    saveSuccess: "Твою ціль збережено.",
    updateError: "Не вдалося оновити прогрес.",
    clarifyTitle: "Щоб BureauCare краще допоміг",
    clarifyText: "Дай короткі відповіді на ці питання, щоб зробити ціль зрозумілішою.",
    financePromptFallback: "Для цієї цілі важливі й фінансові умови. Якщо хочеш, можеш додати кілька необов’язкових цифр.",
    collectionHint: "Твої збережені цілі залишаються тут і можуть бути відкриті в будь-який момент.",
    createdAt: "Створено",
    noSelection: "Ліворуч стандартно показується введення нової цілі.",
    questionMissing: "Будь ласка, спочатку вибери відповідь для кожного уточнення.",
    deleteSuccess: "Ціль видалено.",
    luckyTitle: "Цього разу тобі справді пощастило.",
    luckyText: "Для цієї цілі зараз не видно помітної бюрократичної перешкоди. Рідкісний приємний момент.",
    completeSuccess: "Клас. Цю ціль тепер позначено як виконану."
  },
  es: {
    navLabel: "Metas",
    title: "Metas",
    plannerTitle: "Escribir una nueva meta",
    currentGoalTitle: "Meta actual",
    collectionTitle: "Mis metas",
    goalInput: "Tu meta",
    currentAge: "Tu edad actual",
    targetAge: "Edad objetivo",
    targetYear: "Año objetivo",
    targetModeAge: "Edad",
    targetModeYear: "Año",
    financialAmount: "Ahorros actuales",
    monthlyIncome: "Ingreso mensual",
    financialHint: "Solo si quieres compartir estas cifras.",
    analyze: "Analizar meta",
    analyzing: "Se está analizando la meta...",
    continue: "Continuar",
    restart: "Escribir una nueva meta",
    backToPlanner: "Volver a la entrada",
    removeGoal: "Eliminar meta",
    completeGoal: "Meta cumplida",
    completedGoal: "Cumplida",
    noGoals: "Todavía no hay ninguna meta. En cuanto guardes una, aparecerá aquí.",
    overview: "Resumen",
    timeline: "Tiempo estimado",
    progress: "Progreso",
    financialProgress: "Cercanía financiera",
    steps: "Pasos burocráticos",
    guidance: "Consejos de la IA",
    recommendation: "Valoración sencilla",
    done: "Hecho",
    open: "Abierto",
    duration: "Duración",
    importance: "Importancia",
    ageNow: "Actual",
    ageTarget: "Meta",
    amountLabel: "Estado financiero",
    goalPlaceholder: "Por ejemplo: Quiero tener un Porsche clásico antes de los 28.",
    financeSummaryStart: "A nivel financiero todavía estás más bien al principio.",
    financeSummaryMid: "A nivel financiero ya tienes una base útil.",
    financeSummaryStrong: "A nivel financiero esto ya se ve bastante sólido.",
    saveError: "La meta no se pudo analizar ahora mismo.",
    saveSuccess: "Tu meta se guardó.",
    updateError: "No se pudo actualizar el progreso.",
    clarifyTitle: "Para que BureauCare pueda ayudar mejor",
    clarifyText: "Responde brevemente a estas preguntas para que la meta quede más clara.",
    financePromptFallback: "Para esta meta también importan las condiciones económicas. Si quieres, ahora puedes añadir algunos datos opcionales.",
    collectionHint: "Tus metas guardadas permanecen aquí y puedes volver a abrirlas en cualquier momento.",
    createdAt: "Creado",
    noSelection: "A la izquierda aparece por defecto la entrada para una nueva meta.",
    questionMissing: "Primero elige una respuesta para cada pregunta.",
    deleteSuccess: "La meta se eliminó.",
    luckyTitle: "Esta vez de verdad tuviste suerte.",
    luckyText: "Ahora mismo no se detectó ningún obstáculo burocrático relevante para esta meta. Un momento raramente bonito.",
    completeSuccess: "Muy bien. Esta meta ahora está marcada como cumplida."
  }
};

export function getGoalsCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
}

export function getGoalImportanceLabel(importance: GoalStepImportance, locale: string | null | undefined) {
  const normalized = normalizePreferredLanguage(locale);
  const map = {
    de: { low: "Niedrig", medium: "Mittel", high: "Hoch" },
    en: { low: "Low", medium: "Medium", high: "High" },
    tr: { low: "Düşük", medium: "Orta", high: "Yüksek" },
    uk: { low: "Низька", medium: "Середня", high: "Висока" },
    es: { low: "Baja", medium: "Media", high: "Alta" }
  } as const;

  return map[normalized][importance];
}

export function computeGoalProgress(steps: GoalStep[]) {
  if (!steps.length) {
    return 0;
  }

  const doneCount = steps.filter((step) => step.status === "done").length;
  return Math.round((doneCount / steps.length) * 100);
}

export function getGoalFinancialSummary(locale: string | null | undefined, percentage: number | null) {
  if (percentage === null || Number.isNaN(percentage)) {
    return null;
  }

  const copy = getGoalsCopy(locale);

  if (percentage >= 70) {
    return copy.financeSummaryStrong;
  }

  if (percentage >= 40) {
    return copy.financeSummaryMid;
  }

  return copy.financeSummaryStart;
}

export function normalizeGoalAnalysis(result: GoalAnalysisResult) {
  const steps: GoalStep[] = result.bureaucracy_steps.map((step, index) => ({
    ...step,
    id: step.id || `step-${index + 1}`,
    status: step.status === "done" ? "done" : "open"
  }));
  const progress = result.progress_percentage === 100 ? 100 : computeGoalProgress(steps);

  return {
    ...result,
    bureaucracy_steps: steps,
    progress_percentage: progress
  };
}
