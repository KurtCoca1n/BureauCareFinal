import { normalizePreferredLanguage } from "@/lib/languages";
import type { CaseEventType, CaseStatus, DocumentStatus } from "@/lib/types";

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
  switch (normalizePreferredLanguage(locale)) {
    case "en":
      return status === "done" ? "Done" : status === "waiting" ? "Waiting" : "Open";
    case "tr":
      return status === "done" ? "Tamamlandı" : status === "waiting" ? "Bekliyor" : "Açık";
    case "uk":
      return status === "done" ? "Виконано" : status === "waiting" ? "Очікування" : "Відкрито";
    case "es":
      return status === "done" ? "Hecho" : status === "waiting" ? "En espera" : "Abierto";
    case "zh":
      return status === "done" ? "已完成" : status === "waiting" ? "等待中" : "进行中";
    default:
      return status === "done" ? "Erledigt" : status === "waiting" ? "Warten" : "Offen";
  }
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
