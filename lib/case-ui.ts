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
        openCount: "abierto"
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
        openCount: "offen"
      };
  }
}
