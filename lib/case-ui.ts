import { normalizePreferredLanguage } from "@/lib/languages";
import type { CaseEventType, CaseStatus, DocumentStatus } from "@/lib/types";
import type { CaseOverview } from "@/lib/queries";

export function getCasesNavLabel(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return "Cases";
    case "tr":
      return "Dosyalar";
    case "uk":
      return "Справи";
    case "es":
      return "Casos";
    case "zh":
      return "案件";
    default:
      return "Fälle";
  }
}

export function getCaseStatusLabel(status: CaseStatus | string | null, locale: string | null | undefined) {
  const lang = normalizePreferredLanguage(locale);
  if (status === "done") {
    return lang === "en"
      ? "Done"
      : lang === "tr"
        ? "Tamamlandı"
        : lang === "uk"
          ? "Виконано"
          : lang === "es"
            ? "Hecho"
            : lang === "zh"
              ? "已完成"
              : "Erledigt";
  }
  if (status === "waiting") {
    return lang === "en"
      ? "Waiting for a reply"
      : lang === "tr"
        ? "Yanıt bekleniyor"
        : lang === "uk"
          ? "Очікуємо відповідь"
          : lang === "es"
            ? "Esperando respuesta"
            : lang === "zh"
              ? "等待回复"
              : "Warten auf Antwort";
  }
  if (status === "in_progress") {
    return lang === "en"
      ? "In progress"
      : lang === "tr"
        ? "İşlemde"
        : lang === "uk"
          ? "В роботі"
          : lang === "es"
            ? "En curso"
            : lang === "zh"
              ? "处理中"
              : "In Bearbeitung";
  }
  return lang === "en"
    ? "Open"
    : lang === "tr"
      ? "Açık"
      : lang === "uk"
        ? "Відкрито"
        : lang === "es"
          ? "Abierto"
          : lang === "zh"
            ? "待处理"
            : "Offen";
}

export function getDocumentStatusLabel(status: DocumentStatus | string | null, locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return (
        {
          neu: "New",
          analysiert: "Analyzed",
          antwort_erstellt: "Reply created",
          gesendet: "Sent",
          warten: "Waiting",
          erledigt: "Done"
        }[status ?? "neu"] ?? "New"
      );
    case "tr":
      return (
        {
          neu: "Yeni",
          analysiert: "Analiz edildi",
          antwort_erstellt: "Yanıt oluşturuldu",
          gesendet: "Gönderildi",
          warten: "Beklemede",
          erledigt: "Tamamlandı"
        }[status ?? "neu"] ?? "Yeni"
      );
    case "uk":
      return (
        {
          neu: "Нове",
          analysiert: "Проаналізовано",
          antwort_erstellt: "Відповідь створено",
          gesendet: "Надіслано",
          warten: "Очікування",
          erledigt: "Виконано"
        }[status ?? "neu"] ?? "Нове"
      );
    case "es":
      return (
        {
          neu: "Nuevo",
          analysiert: "Analizado",
          antwort_erstellt: "Respuesta creada",
          gesendet: "Enviado",
          warten: "En espera",
          erledigt: "Hecho"
        }[status ?? "neu"] ?? "Nuevo"
      );
    case "zh":
      return (
        {
          neu: "新建",
          analysiert: "已分析",
          antwort_erstellt: "已生成回复",
          gesendet: "已发送",
          warten: "等待中",
          erledigt: "已完成"
        }[status ?? "neu"] ?? "新建"
      );
    default:
      return (
        {
          neu: "Neu",
          analysiert: "Analysiert",
          antwort_erstellt: "Antwort erstellt",
          gesendet: "Gesendet",
          warten: "Warten",
          erledigt: "Erledigt"
        }[status ?? "neu"] ?? "Neu"
      );
  }
}

export function getCaseEventLabel(eventType: CaseEventType, locale: string | null | undefined) {
  const german = {
    document_uploaded: "Dokument hochgeladen",
    document_analyzed: "Dokument analysiert",
    reply_created: "Antwort erstellt",
    reply_sent: "Antwort gesendet",
    task_created: "Aufgabe erstellt",
    task_completed: "Aufgabe erledigt",
    new_document_added: "Dokument hinzugefügt",
    case_closed: "Fall abgeschlossen",
    status_changed: "Status geändert"
  } satisfies Record<CaseEventType, string>;

  if (normalizePreferredLanguage(locale) === "en") {
    return {
      document_uploaded: "Document uploaded",
      document_analyzed: "Document analyzed",
      reply_created: "Reply created",
      reply_sent: "Reply sent",
      task_created: "Task created",
      task_completed: "Task completed",
      new_document_added: "Document added",
      case_closed: "Case closed",
      status_changed: "Status changed"
    }[eventType];
  }

  if (normalizePreferredLanguage(locale) === "zh") {
    return {
      document_uploaded: "文件已上传",
      document_analyzed: "文件已分析",
      reply_created: "已生成回复",
      reply_sent: "回复已发送",
      task_created: "已创建任务",
      task_completed: "任务已完成",
      new_document_added: "已添加文件",
      case_closed: "案件已关闭",
      status_changed: "状态已更新"
    }[eventType];
  }

  return german[eventType];
}

export function getCaseText(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return {
        caseLabel: "Case",
        organization: "Organization",
        unknownOrganization: "Unknown office",
        timeline: "Timeline",
        timelineText: "All important steps in this case in chronological order.",
        noEvents: "No events yet.",
        documentsInCase: "Documents in this case",
        noDocuments: "No documents in this case yet.",
        openTasks: "Open tasks",
        noTasks: "There are currently no open tasks for this case.",
        createdAt: "Created on",
        latestActivity: "Latest activity",
        actions: "Actions",
        addDocument: "Add a new document to this case",
        markCaseDone: "Mark case as done",
        deleteCase: "Delete case",
        doneAndDelete: "Mark done and delete",
        confirmCaseDelete: "Do you really want to delete this case? Documents stay saved, but the case disappears from your cases.",
        confirmDoneAndDelete: "Is everything really done? Then this case will be marked as completed and removed from your cases.",
        openCount: "open"
      };
    case "tr":
      return {
        caseLabel: "Dosya",
        organization: "Kurum",
        unknownOrganization: "Bilinmeyen kurum",
        timeline: "Zaman akışı",
        timelineText: "Bu dosyadaki tüm önemli adımlar kronolojik sırayla.",
        noEvents: "Henüz olay yok.",
        documentsInCase: "Bu dosyadaki belgeler",
        noDocuments: "Bu dosyada henüz belge yok.",
        openTasks: "Açık görevler",
        noTasks: "Bu dosya için şu anda açık görev yok.",
        createdAt: "Oluşturulma tarihi",
        latestActivity: "Son hareket",
        actions: "İşlemler",
        addDocument: "Bu dosyaya yeni belge ekle",
        markCaseDone: "Dosyayı tamamlandı olarak işaretle",
        deleteCase: "Dosyayı sil",
        doneAndDelete: "Tamamla ve sil",
        confirmCaseDelete: "Bu dosyayı gerçekten silmek istiyor musun? Belgeler kaybolmaz ama dosya listenden kalkar.",
        confirmDoneAndDelete: "Gerçekten her şey tamam mı? O zaman bu dosya tamamlandı olarak işaretlenir ve listenden kaldırılır.",
        openCount: "açık"
      };
    case "uk":
      return {
        caseLabel: "Справа",
        organization: "Організація",
        unknownOrganization: "Невідома установа",
        timeline: "Хронологія",
        timelineText: "Усі важливі кроки цієї справи в часовому порядку.",
        noEvents: "Подій ще немає.",
        documentsInCase: "Документи у цій справі",
        noDocuments: "У цій справі ще немає документів.",
        openTasks: "Відкриті завдання",
        noTasks: "Для цієї справи зараз немає відкритих завдань.",
        createdAt: "Створено",
        latestActivity: "Остання активність",
        actions: "Дії",
        addDocument: "Додати новий документ до цієї справи",
        markCaseDone: "Позначити справу як виконану",
        deleteCase: "Видалити справу",
        doneAndDelete: "Позначити як виконану і видалити",
        confirmCaseDelete: "Ви справді хочете видалити цю справу? Документи залишаться, але справа зникне зі списку.",
        confirmDoneAndDelete: "Переконайтеся, що все справді завершено. Тоді справу буде позначено як виконану і видалено.",
        openCount: "відкрито"
      };
    case "es":
      return {
        caseLabel: "Caso",
        organization: "Organización",
        unknownOrganization: "Oficina desconocida",
        timeline: "Cronología",
        timelineText: "Todos los pasos importantes de este caso en orden cronológico.",
        noEvents: "Todavía no hay eventos.",
        documentsInCase: "Documentos en este caso",
        noDocuments: "Todavía no hay documentos en este caso.",
        openTasks: "Tareas abiertas",
        noTasks: "Ahora mismo no hay tareas abiertas para este caso.",
        createdAt: "Creado el",
        latestActivity: "Última actividad",
        actions: "Acciones",
        addDocument: "Añadir un nuevo documento a este caso",
        markCaseDone: "Marcar caso como hecho",
        deleteCase: "Eliminar caso",
        doneAndDelete: "Marcar como hecho y eliminar",
        confirmCaseDelete: "¿De verdad quieres eliminar este caso? Los documentos siguen guardados, pero el caso desaparece de tu lista.",
        confirmDoneAndDelete: "¿De verdad está todo terminado? Entonces este caso se marcará como completado y se quitará de tus casos.",
        openCount: "abierto"
      };
    case "zh":
      return {
        caseLabel: "案件",
        organization: "机构",
        unknownOrganization: "未知机构",
        timeline: "时间线",
        timelineText: "按时间顺序查看这个案件里的重要步骤。",
        noEvents: "还没有事件。",
        documentsInCase: "这个案件中的文件",
        noDocuments: "这个案件里还没有文件。",
        openTasks: "未完成任务",
        noTasks: "这个案件目前没有未完成任务。",
        createdAt: "创建于",
        latestActivity: "最近活动",
        actions: "操作",
        addDocument: "向这个案件添加新文件",
        markCaseDone: "将案件标记为完成",
        deleteCase: "删除案件",
        doneAndDelete: "完成并删除",
        confirmCaseDelete: "你确定要删除这个案件吗？文件会保留，但案件会从列表中消失。",
        confirmDoneAndDelete: "真的都处理完成了吗？这样会把案件标记为完成并从列表中移除。",
        openCount: "未完成"
      };
    default:
      return {
        caseLabel: "Fall",
        organization: "Organisation",
        unknownOrganization: "Unbekannte Stelle",
        timeline: "Timeline",
        timelineText: "Alle wichtigen Schritte dieses Falls in zeitlicher Reihenfolge.",
        noEvents: "Noch keine Ereignisse vorhanden.",
        documentsInCase: "Dokumente in diesem Fall",
        noDocuments: "Noch keine Dokumente in diesem Fall.",
        openTasks: "Offene Aufgaben",
        noTasks: "Für diesen Fall sind aktuell keine Aufgaben offen.",
        createdAt: "Erstellt am",
        latestActivity: "Letzte Aktivität",
        actions: "Aktionen",
        addDocument: "Neues Dokument zu diesem Fall",
        markCaseDone: "Fall als erledigt markieren",
        deleteCase: "Fall löschen",
        doneAndDelete: "Erledigen und löschen",
        confirmCaseDelete: "Willst du diesen Fall wirklich löschen? Die Dokumente bleiben gespeichert, aber der Fall verschwindet aus deinen Fällen.",
        confirmDoneAndDelete: "Ist wirklich alles erledigt? Dann wird dieser Fall als abgeschlossen behandelt und aus deinen Fällen entfernt.",
        openCount: "offen"
      };
  }
}

/** Decision Screen: Fall optional vor der Analyse anlegen */
export function getDecisionCaseSaveCopy(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return {
        cardTitle: "Save as a case",
        cardIntro:
          "Keep this document in your cases before analysis – so nothing feels one-off. You can run the analysis right after.",
        button: "Save as case",
        pending: "Saving…",
        linkedBadge: "In your cases",
        linkedLead: "This upload is already linked to a case.",
        linkedCta: "Open case"
      };
    case "es":
      return {
        cardTitle: "Guardar como caso",
        cardIntro:
          "Conserva este documento como un caso antes del análisis, así no se pierde ese trabajo pendiente.",
        button: "Guardar como caso",
        pending: "Guardando…",
        linkedBadge: "En tus casos",
        linkedLead: "Esta subida ya está vinculada a un caso.",
        linkedCta: "Abrir caso"
      };
    case "zh":
      return {
        cardTitle: "保存为案件",
        cardIntro: "在分析前把这份文件归入案件，避免上传后「消失不见」。之后仍可继续分析。",
        button: "保存为案件",
        pending: "保存中…",
        linkedBadge: "已在案件中",
        linkedLead: "此上传已关联到案件。",
        linkedCta: "打开案件"
      };
    case "tr":
      return {
        cardTitle: "Dava olarak kaydet",
        cardIntro:
          "Analizden önce belgeyi dosyalarda tut – böylece tek seferlik hissi kalkar. Ardından analize devam edebilirsin.",
        button: "Dava olarak kaydet",
        pending: "Kaydediliyor…",
        linkedBadge: "Dosyalarında",
        linkedLead: "Bu yükleme zaten bir dosyaya bağlı.",
        linkedCta: "Dosyayı aç"
      };
    case "uk":
      return {
        cardTitle: "Зберегти як справу",
        cardIntro:
          "Приберіть документ у своїх справах ще до повного аналізу — так нічого не здається разовим вирішенням.",
        button: "Зберегти справу",
        pending: "Зберігаємо…",
        linkedBadge: "У твоїх справах",
        linkedLead: "Це вже прив’язано до справи.",
        linkedCta: "Відкрити справу"
      };
    default:
      return {
        cardTitle: "Als Fall speichern",
        cardIntro:
          "Behalte dieses Dokument schon vor der Analyse in deinen Fällen – so wirkt nichts wie ein einmaliger Upload. Die Analyse kannst du direkt danach starten.",
        button: "Als Fall speichern",
        pending: "Wird gespeichert…",
        linkedBadge: "In deinen Fällen",
        linkedLead: "Dieser Upload ist bereits mit einem Fall verknüpft.",
        linkedCta: "Zum Fall"
      };
  }
}

export function getCaseOverviewLabels(locale: string | null | undefined) {
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return {
        title: "At a glance",
        kind: "Document type",
        summary: "Summary",
        uploaded: "Uploaded",
        analyzed: "Last analyzed",
        deadline: "Deadline",
        next: "Suggested next steps",
        risk: "Worth watching",
        openDoc: "Open document",
        none: "—"
      };
    case "es":
      return {
        title: "De un vistazo",
        kind: "Tipo de documento",
        summary: "Resumen",
        uploaded: "Subido",
        analyzed: "Último análisis",
        deadline: "Plazo",
        next: "Próximos pasos",
        risk: "A tener en cuenta",
        openDoc: "Abrir documento",
        none: "—"
      };
    case "zh":
      return {
        title: "一览",
        kind: "文件类型",
        summary: "摘要",
        uploaded: "上传时间",
        analyzed: "最近分析",
        deadline: "期限",
        next: "建议的下一步",
        risk: "需要留意",
        openDoc: "打开文件",
        none: "—"
      };
    case "tr":
      return {
        title: "Özet",
        kind: "Belge türü",
        summary: "Özet",
        uploaded: "Yüklendi",
        analyzed: "Son analiz",
        deadline: "Son tarih",
        next: "Önerilen adımlar",
        risk: "Dikkat",
        openDoc: "Belgeyi aç",
        none: "—"
      };
    case "uk":
      return {
        title: "Коротко",
        kind: "Тип документа",
        summary: "Зміст",
        uploaded: "Завантажено",
        analyzed: "Останній аналіз",
        deadline: "Строк",
        next: "Наступні кроки",
        risk: "На що звернути увагу",
        openDoc: "Відкрити документ",
        none: "—"
      };
    default:
      return {
        title: "Fall im Überblick",
        kind: "Dokumenttyp",
        summary: "Kurzfassung",
        uploaded: "Hochgeladen",
        analyzed: "Zuletzt analysiert",
        deadline: "Frist",
        next: "Empfohlene nächste Schritte",
        risk: "Auffällig / Risiko",
        openDoc: "Zum Dokument",
        none: "—"
      };
  }
}

export type CasesListCopy = {
  pageSubtitle: string;
  filterAll: string;
  filterOpen: string;
  filterImportant: string;
  filterDone: string;
  filterEmpty: string;
  priorityHigh: string;
  prioritySoon: string;
  priorityOpen: string;
  priorityDone: string;
  homeActionTitle: string;
  homeAllCases: string;
  homeNoCases: string;
  homeSummaryNone: string;
  /** {count} = eine Zahl */
  homeSummaryTotal: string;
  homeSummaryImportant: string;
  homeSummaryWaiting: string;
  homeSummaryOpen: string;
};

export function getCasesListCopy(locale: string | null | undefined): CasesListCopy {
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return {
        pageSubtitle:
          "Important matters in one place — with a clear view of what still needs your attention.",
        filterAll: "All",
        filterOpen: "Open",
        filterImportant: "Priority",
        filterDone: "Done",
        filterEmpty: "No cases in this view.",
        priorityHigh: "Needs attention",
        prioritySoon: "Follow up soon",
        priorityOpen: "Open",
        priorityDone: "Settled",
        homeActionTitle: "Cases needing attention",
        homeAllCases: "All cases",
        homeNoCases: "When BureauCare spots something relevant, your cases will show up here.",
        homeSummaryNone: "Nothing pending right now.",
        homeSummaryTotal: "{count} active",
        homeSummaryImportant: "{count} priority",
        homeSummaryWaiting: "{count} awaiting reply",
        homeSummaryOpen: "{count} open"
      };
    case "tr":
      return {
        pageSubtitle:
          "Önemli süreçler tek yerde — neyin hâlâ seni beklediğini net görmek için.",
        filterAll: "Tümü",
        filterOpen: "Açık",
        filterImportant: "Öncelikli",
        filterDone: "Tamamlandı",
        filterEmpty: "Bu görünümde dosya yok.",
        priorityHigh: "İşlem gerekli",
        prioritySoon: "Yakında bak",
        priorityOpen: "Açık",
        priorityDone: "Tamamlandı",
        homeActionTitle: "İşlem gerektiren dosyalar",
        homeAllCases: "Tüm dosyalar",
        homeNoCases: "BureauCare bir şey yakaladığında dosyaların burada görünür.",
        homeSummaryNone: "Şu an bekleyen yok.",
        homeSummaryTotal: "{count} aktif",
        homeSummaryImportant: "{count} öncelikli",
        homeSummaryWaiting: "{count} yanıt bekliyor",
        homeSummaryOpen: "{count} açık"
      };
    case "uk":
      return {
        pageSubtitle:
          "Усі важливі процеси в одному місці — зрозуміло, що ще потребує твоєї уваги.",
        filterAll: "Усі",
        filterOpen: "Відкриті",
        filterImportant: "Пріоритет",
        filterDone: "Виконано",
        filterEmpty: "У цьому вигляді справ немає.",
        priorityHigh: "Потрібна дія",
        prioritySoon: "Незабаром переглянути",
        priorityOpen: "Відкрито",
        priorityDone: "Завершено",
        homeActionTitle: "Справа з потребою дій",
        homeAllCases: "Усі справи",
        homeSummaryNone: "Зараз нічого не очікує.",
        homeSummaryTotal: "{count} активних",
        homeSummaryImportant: "{count} пріоритетних",
        homeSummaryWaiting: "{count} очікують відповіді",
        homeSummaryOpen: "{count} відкритих",
        homeNoCases: "Коли BureauCare знайде щось важливе, справи зʼявляться тут."
      };
    case "es":
      return {
        pageSubtitle:
          "Los asuntos importantes en un solo sitio, con claridad sobre lo que sigue pendiente.",
        filterAll: "Todos",
        filterOpen: "Abiertos",
        filterImportant: "Prioridad",
        filterDone: "Hechos",
        filterEmpty: "No hay casos en esta vista.",
        priorityHigh: "Requiere acción",
        prioritySoon: "Revisar pronto",
        priorityOpen: "Abierto",
        priorityDone: "Cerrado",
        homeActionTitle: "Casos que requieren acción",
        homeAllCases: "Todos los casos",
        homeNoCases: "Cuando BureauCare detecte algo relevante, tus casos aparecerán aquí.",
        homeSummaryNone: "Nada pendiente ahora mismo.",
        homeSummaryTotal: "{count} activos",
        homeSummaryImportant: "{count} prioritarios",
        homeSummaryWaiting: "{count} esperando respuesta",
        homeSummaryOpen: "{count} abiertos"
      };
    case "zh":
      return {
        pageSubtitle: "重要事项集中在一处，清楚显示仍需你处理的内容。",
        filterAll: "全部",
        filterOpen: "进行中",
        filterImportant: "优先",
        filterDone: "已完成",
        filterEmpty: "此视图下没有案件。",
        priorityHigh: "需要处理",
        prioritySoon: "尽快跟进",
        priorityOpen: "待处理",
        priorityDone: "已结束",
        homeActionTitle: "需要跟进的案件",
        homeAllCases: "全部案件",
        homeNoCases: "当 BureauCare 识别到相关内容时，案件会显示在这里。",
        homeSummaryNone: "目前没有待处理项。",
        homeSummaryTotal: "{count} 个进行中",
        homeSummaryImportant: "{count} 个优先",
        homeSummaryWaiting: "{count} 个等待回复",
        homeSummaryOpen: "{count} 个待办"
      };
    default:
      return {
        pageSubtitle:
          "Alle wichtigen Vorgänge an einem Ort – mit klarem Überblick über offenen Handlungsbedarf.",
        filterAll: "Alle",
        filterOpen: "Offen",
        filterImportant: "Wichtig",
        filterDone: "Erledigt",
        filterEmpty: "Keine Fälle in dieser Ansicht.",
        priorityHigh: "Handlungsbedarf",
        prioritySoon: "Bald prüfen",
        priorityOpen: "Offen",
        priorityDone: "Erledigt",
        homeActionTitle: "Fälle mit Handlungsbedarf",
        homeAllCases: "Alle Fälle",
        homeNoCases: "Sobald BureauCare Zusammenhänge erkennt, erscheinen deine Fälle hier automatisch.",
        homeSummaryNone: "Aktuell nichts Offenes.",
        homeSummaryTotal: "{count} aktiv",
        homeSummaryImportant: "{count} mit Priorität",
        homeSummaryWaiting: "{count} warten auf Antwort",
        homeSummaryOpen: "{count} offen"
      };
  }
}

/** Kompakte Einzeile für die Home-Zusammenfassung (nur aktive / handlungsrelevante Fälle). */
export function buildHomeCaseSummaryLine(cases: CaseOverview[], copy: CasesListCopy): string {
  const active = cases.filter((c) => c.status !== "done");
  if (active.length === 0) {
    return copy.homeSummaryNone;
  }
  const important = active.filter((c) => c.status === "in_progress" || c.openTasksCount > 0).length;
  const waiting = active.filter((c) => c.status === "waiting").length;
  const parts: string[] = [copy.homeSummaryTotal.replace("{count}", String(active.length))];
  if (important > 0) {
    parts.push(copy.homeSummaryImportant.replace("{count}", String(important)));
  }
  if (waiting > 0) {
    parts.push(copy.homeSummaryWaiting.replace("{count}", String(waiting)));
  }
  return parts.join(" · ");
}
