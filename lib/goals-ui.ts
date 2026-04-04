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
    currentAge: "艦u anki ya艧谋n",
    targetAge: "Hedef ya艧",
    targetYear: "Hedef y谋l",
    targetModeAge: "Ya艧",
    targetModeYear: "Y谋l",
    financialAmount: "Mevcut birikim",
    monthlyIncome: "Ayl谋k gelir",
    financialHint: "Bu say谋lar谋 sadece istersen payla艧.",
    analyze: "Hedefi analiz et",
    analyzing: "Hedef analiz ediliyor...",
    continue: "Devam et",
    restart: "Yeni hedef gir",
    backToPlanner: "Giri艧e dön",
    removeGoal: "Hedefi kald谋r",
    completeGoal: "Hedef tamamland谋",
    completedGoal: "Tamamland谋",
    noGoals: "Henüz hedef yok. Bir hedef kaydetti臒inde burada görünür.",
    overview: "Genel bak谋艧",
    timeline: "Tahmini süre",
    progress: "陌lerleme",
    financialProgress: "Mali yak谋nl谋k",
    steps: "Bürokratik ad谋mlar",
    guidance: "Yapay zeka ipu莽lar谋",
    recommendation: "Basit de臒erlendirme",
    done: "Tamamland谋",
    open: "A莽谋k",
    duration: "Süre",
    importance: "Önem",
    ageNow: "艦imdi",
    ageTarget: "Hedef",
    amountLabel: "Mali durum",
    goalPlaceholder: "Örne臒in: 28 ya艧谋ma kadar bir klasik Porsche sahibi olmak istiyorum.",
    financeSummaryStart: "Mali a莽谋dan daha yolun ba艧谋ndas谋n.",
    financeSummaryMid: "Mali a莽谋dan i艧e yarar bir temel var.",
    financeSummaryStrong: "Mali a莽谋dan durum 艧imdiden olduk莽a sa臒lam görünüyor.",
    saveError: "Hedef 艧u anda analiz edilemedi.",
    saveSuccess: "Hedefin kaydedildi.",
    updateError: "陌lerleme güncellenemedi.",
    clarifyTitle: "BureauCare daha iyi yard谋mc谋 olsun diye",
    clarifyText: "Hedefini daha net anlamak i莽in bu k谋sa sorular谋 cevapla.",
    financePromptFallback: "Bu hedefte maddi ko艧ullar da önemli olabilir. 陌stersen 艧imdi birka莽 iste臒e ba臒l谋 say谋 ekleyebilirsin.",
    collectionHint: "Kaydetti臒in hedefler burada toplan谋r ve istedi臒in zaman tekrar a莽谋l谋r.",
    createdAt: "Olu艧turuldu",
    noSelection: "Sol tarafta standart olarak yeni hedef giri艧i görünür.",
    questionMissing: "Lütfen önce her soru i莽in bir cevap se莽.",
    deleteSuccess: "Hedef kald谋r谋ld谋.",
    luckyTitle: "Bu kez ger莽ekten 艧ansl谋yd谋n.",
    luckyText: "Bu hedef i莽in 艧u anda kayda de臒er bir bürokratik engel görünmüyor. Ender rastlanan güzel bir durum.",
    completeSuccess: "Harika. Bu hedef art谋k tamamland谋 olarak i艧aretlendi."
  },
  uk: {
    navLabel: "笑褨谢褨",
    title: "笑褨谢褨",
    plannerTitle: "袙胁械褋褌懈 薪芯胁褍 褑褨谢褜",
    currentGoalTitle: "袩芯褌芯褔薪邪 褑褨谢褜",
    collectionTitle: "袦芯褩 褑褨谢褨",
    goalInput: "孝胁芯褟 褑褨谢褜",
    currentAge: "孝胁褨泄 褌械锌械褉褨褕薪褨泄 胁褨泻",
    targetAge: "袘邪卸邪薪懈泄 胁褨泻",
    targetYear: "笑褨谢褜芯胁懈泄 褉褨泻",
    targetModeAge: "袙褨泻",
    targetModeYear: "袪褨泻",
    financialAmount: "袧邪褟胁薪褨 蟹邪芯褖邪写卸械薪薪褟",
    monthlyIncome: "袦褨褋褟褔薪懈泄 写芯褏褨写",
    financialHint: "袥懈褕械 褟泻褖芯 褏芯褔械褕 写芯斜褉芯胁褨谢褜薪芯 锌芯写褨谢懈褌懈褋褟 褑懈屑懈 褑懈褎褉邪屑懈.",
    analyze: "袩褉芯邪薪邪谢褨蟹褍胁邪褌懈 褑褨谢褜",
    analyzing: "笑褨谢褜 邪薪邪谢褨蟹褍褦褌褜褋褟...",
    continue: "袩褉芯写芯胁卸懈褌懈",
    restart: "袙胁械褋褌懈 薪芯胁褍 褑褨谢褜",
    backToPlanner: "袧邪蟹邪写 写芯 胁胁芯写褍",
    removeGoal: "袙懈写邪谢懈褌懈 褑褨谢褜",
    completeGoal: "笑褨谢褜 胁懈泻芯薪邪薪芯",
    completedGoal: "袙懈泻芯薪邪薪芯",
    noGoals: "些械 薪械屑邪褦 卸芯写薪芯褩 褑褨谢褨. 些芯泄薪芯 褌懈 褩褩 蟹斜械褉械卸械褕, 胁芯薪邪 蟹鈥櫻徯残秆傃屟佈?褌褍褌.",
    overview: "袨谐谢褟写",
    timeline: "袨褉褨褦薪褌芯胁薪懈泄 褔邪褋",
    progress: "袩褉芯谐褉械褋",
    financialProgress: "肖褨薪邪薪褋芯胁邪 谐芯褌芯胁薪褨褋褌褜",
    steps: "袘褞褉芯泻褉邪褌懈褔薪褨 泻褉芯泻懈",
    guidance: "袩芯褉邪写懈 楔袉",
    recommendation: "袩褉芯褋褌邪 芯褑褨薪泻邪",
    done: "袙懈泻芯薪邪薪芯",
    open: "袙褨写泻褉懈褌芯",
    duration: "孝褉懈胁邪谢褨褋褌褜",
    importance: "袙邪卸谢懈胁褨褋褌褜",
    ageNow: "袟邪褉邪蟹",
    ageTarget: "笑褨谢褜",
    amountLabel: "肖褨薪邪薪褋芯胁懈泄 褋褌邪薪",
    goalPlaceholder: "袧邪锌褉懈泻谢邪写: 携 褏芯褔褍 写芯 28 褉芯泻褨胁 屑邪褌懈 褋褌邪褉懈泄 Porsche.",
    financeSummaryStart: "肖褨薪邪薪褋芯胁芯 褌懈 褖械 褉邪写褕械 薪邪 锌芯褔邪褌泻褍.",
    financeSummaryMid: "肖褨薪邪薪褋芯胁芯 胁卸械 褦 薪械锌芯谐邪薪邪 斜邪蟹邪.",
    financeSummaryStrong: "肖褨薪邪薪褋芯胁芯 褋懈褌褍邪褑褨褟 胁卸械 胁懈谐谢褟写邪褦 写芯褋懈褌褜 褋褌邪斜褨谢褜薪芯.",
    saveError: "袟邪褉邪蟹 薪械 胁写邪谢芯褋褟 锌褉芯邪薪邪谢褨蟹褍胁邪褌懈 褑褨谢褜.",
    saveSuccess: "孝胁芯褞 褑褨谢褜 蟹斜械褉械卸械薪芯.",
    updateError: "袧械 胁写邪谢芯褋褟 芯薪芯胁懈褌懈 锌褉芯谐褉械褋.",
    clarifyTitle: "些芯斜 BureauCare 泻褉邪褖械 写芯锌芯屑褨谐",
    clarifyText: "袛邪泄 泻芯褉芯褌泻褨 胁褨写锌芯胁褨写褨 薪邪 褑褨 锌懈褌邪薪薪褟, 褖芯斜 蟹褉芯斜懈褌懈 褑褨谢褜 蟹褉芯蟹褍屑褨谢褨褕芯褞.",
    financePromptFallback: "袛谢褟 褑褨褦褩 褑褨谢褨 胁邪卸谢懈胁褨 泄 褎褨薪邪薪褋芯胁褨 褍屑芯胁懈. 携泻褖芯 褏芯褔械褕, 屑芯卸械褕 写芯写邪褌懈 泻褨谢褜泻邪 薪械芯斜芯胁鈥櫻徯沸盒拘残秆?褑懈褎褉.",
    collectionHint: "孝胁芯褩 蟹斜械褉械卸械薪褨 褑褨谢褨 蟹邪谢懈褕邪褞褌褜褋褟 褌褍褌 褨 屑芯卸褍褌褜 斜褍褌懈 胁褨写泻褉懈褌褨 胁 斜褍写褜-褟泻懈泄 屑芯屑械薪褌.",
    createdAt: "小褌胁芯褉械薪芯",
    noSelection: "袥褨胁芯褉褍褔 褋褌邪薪写邪褉褌薪芯 锌芯泻邪蟹褍褦褌褜褋褟 胁胁械写械薪薪褟 薪芯胁芯褩 褑褨谢褨.",
    questionMissing: "袘褍写褜 谢邪褋泻邪, 褋锌芯褔邪褌泻褍 胁懈斜械褉懈 胁褨写锌芯胁褨写褜 写谢褟 泻芯卸薪芯谐芯 褍褌芯褔薪械薪薪褟.",
    deleteSuccess: "笑褨谢褜 胁懈写邪谢械薪芯.",
    luckyTitle: "笑褜芯谐芯 褉邪蟹褍 褌芯斜褨 褋锌褉邪胁写褨 锌芯褖邪褋褌懈谢芯.",
    luckyText: "袛谢褟 褑褨褦褩 褑褨谢褨 蟹邪褉邪蟹 薪械 胁懈写薪芯 锌芯屑褨褌薪芯褩 斜褞褉芯泻褉邪褌懈褔薪芯褩 锌械褉械褕泻芯写懈. 袪褨写泻褨褋薪懈泄 锌褉懈褦屑薪懈泄 屑芯屑械薪褌.",
    completeSuccess: "袣谢邪褋. 笑褞 褑褨谢褜 褌械锌械褉 锌芯蟹薪邪褔械薪芯 褟泻 胁懈泻芯薪邪薪褍."
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
    targetYear: "A帽o objetivo",
    targetModeAge: "Edad",
    targetModeYear: "A帽o",
    financialAmount: "Ahorros actuales",
    monthlyIncome: "Ingreso mensual",
    financialHint: "Solo si quieres compartir estas cifras.",
    analyze: "Analizar meta",
    analyzing: "Se est谩 analizando la meta...",
    continue: "Continuar",
    restart: "Escribir una nueva meta",
    backToPlanner: "Volver a la entrada",
    removeGoal: "Eliminar meta",
    completeGoal: "Meta cumplida",
    completedGoal: "Cumplida",
    noGoals: "Todav铆a no hay ninguna meta. En cuanto guardes una, aparecer谩 aqu铆.",
    overview: "Resumen",
    timeline: "Tiempo estimado",
    progress: "Progreso",
    financialProgress: "Cercan铆a financiera",
    steps: "Pasos burocr谩ticos",
    guidance: "Consejos de la IA",
    recommendation: "Valoraci贸n sencilla",
    done: "Hecho",
    open: "Abierto",
    duration: "Duraci贸n",
    importance: "Importancia",
    ageNow: "Actual",
    ageTarget: "Meta",
    amountLabel: "Estado financiero",
    goalPlaceholder: "Por ejemplo: Quiero tener un Porsche cl谩sico antes de los 28.",
    financeSummaryStart: "A nivel financiero todav铆a est谩s m谩s bien al principio.",
    financeSummaryMid: "A nivel financiero ya tienes una base 煤til.",
    financeSummaryStrong: "A nivel financiero esto ya se ve bastante s贸lido.",
    saveError: "La meta no se pudo analizar ahora mismo.",
    saveSuccess: "Tu meta se guard贸.",
    updateError: "No se pudo actualizar el progreso.",
    clarifyTitle: "Para que BureauCare pueda ayudar mejor",
    clarifyText: "Responde brevemente a estas preguntas para que la meta quede m谩s clara.",
    financePromptFallback: "Para esta meta tambi茅n importan las condiciones econ贸micas. Si quieres, ahora puedes a帽adir algunos datos opcionales.",
    collectionHint: "Tus metas guardadas permanecen aqu铆 y puedes volver a abrirlas en cualquier momento.",
    createdAt: "Creado",
    noSelection: "A la izquierda aparece por defecto la entrada para una nueva meta.",
    questionMissing: "Primero elige una respuesta para cada pregunta.",
    deleteSuccess: "La meta se elimin贸.",
    luckyTitle: "Esta vez de verdad tuviste suerte.",
    luckyText: "Ahora mismo no se detect贸 ning煤n obst谩culo burocr谩tico relevante para esta meta. Un momento raramente bonito.",
    completeSuccess: "Muy bien. Esta meta ahora est谩 marcada como cumplida."
  },
  zh: {
    navLabel: "目标",
    title: "目标",
    plannerTitle: "添加新目标",
    currentGoalTitle: "当前目标",
    collectionTitle: "我的目标",
    goalInput: "你的目标",
    currentAge: "你现在的年龄",
    targetAge: "目标年龄",
    targetYear: "目标年份",
    targetModeAge: "年龄",
    targetModeYear: "年份",
    financialAmount: "目前储蓄",
    monthlyIncome: "每月收入",
    financialHint: "只有在你愿意的情况下才需要填写这些数字。",
    analyze: "分析目标",
    analyzing: "正在分析目标...",
    continue: "继续",
    restart: "添加新目标",
    backToPlanner: "返回输入",
    removeGoal: "删除目标",
    completeGoal: "标记为已完成",
    completedGoal: "已完成",
    noGoals: "你还没有保存任何目标。一旦保存，目标就会出现在这里。",
    overview: "概览",
    timeline: "预计时间",
    progress: "进度",
    financialProgress: "财务进度",
    steps: "手续步骤",
    guidance: "AI 提示",
    recommendation: "简单判断",
    done: "已完成",
    open: "进行中",
    duration: "时长",
    importance: "重要程度",
    ageNow: "当前",
    ageTarget: "目标",
    amountLabel: "财务状态",
    goalPlaceholder: "例如：我想在 28 岁前拥有一辆经典 Porsche。",
    financeSummaryStart: "从财务上看，你还处在比较早的阶段。",
    financeSummaryMid: "从财务上看，你已经有了一个不错的基础。",
    financeSummaryStrong: "从财务上看，这已经相当稳了。",
    saveError: "目前无法分析这个目标。",
    saveSuccess: "你的目标已保存。",
    updateError: "无法更新进度。",
    clarifyTitle: "为了让 BureauCare 更好地帮助你",
    clarifyText: "请简单回答这些问题，这样系统才能更准确地理解你的目标。",
    financePromptFallback: "这个目标也和财务条件有关。如果你愿意，现在可以补充一些可选数字。",
    collectionHint: "你保存的目标会集中显示在这里，之后也可以随时继续查看。",
    createdAt: "创建于",
    noSelection: "左侧默认显示新目标的输入区域。",
    questionMissing: "请先为每个追问选择一个答案。",
    deleteSuccess: "目标已删除。",
    luckyTitle: "这次你真的算是比较幸运。",
    luckyText: "目前没有识别到与你这个目标明显相关的重要手续障碍。这种情况并不常见。",
    completeSuccess: "很好。这个目标现在已经被标记为完成。"
  }
};

export function getGoalsCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)] ?? copyMap.en;
}

export function getGoalImportanceLabel(importance: GoalStepImportance, locale: string | null | undefined) {
  const normalized = normalizePreferredLanguage(locale);
  const map = {
    de: { low: "Niedrig", medium: "Mittel", high: "Hoch" },
    en: { low: "Low", medium: "Medium", high: "High" },
    tr: { low: "Dü艧ük", medium: "Orta", high: "Yüksek" },
    uk: { low: "袧懈蟹褜泻邪", medium: "小械褉械写薪褟", high: "袙懈褋芯泻邪" },
    es: { low: "Baja", medium: "Media", high: "Alta" },
    zh: { low: "低", medium: "中", high: "高" },
  } as const;

  return map[normalized as keyof typeof map]?.[importance] ?? map.en[importance];
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



