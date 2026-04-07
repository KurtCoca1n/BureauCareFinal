import type { AppLocale } from "@/lib/i18n";
import type { DocumentKindDetection, DocumentKindId, ImportanceHint, SuggestedModuleId } from "@/lib/document-kind";

function headlineDe(kind: DocumentKindId, confidence: DocumentKindDetection["confidence"]): string {
  const w = (a: string, b: string, c: string) => (confidence === "high" ? a : confidence === "medium" ? b : c);

  switch (kind) {
    case "contract":
      return w("Wahrscheinlich ein Vertrag", "Sieht nach einem Vertrag aus", "Möglicherweise vertragsähnlich");
    case "authority_notice":
      return w(
        "Wahrscheinlich ein Behördenschreiben oder Bescheid",
        "Sieht aus wie ein Behördenschreiben",
        "Könnte ein amtliches Schreiben sein"
      );
    case "invoice":
      return w("Wahrscheinlich eine Rechnung", "Sieht nach einer Rechnung aus", "Möglicherweise eine Rechnung");
    case "reminder":
      return w("Wahrscheinlich eine Mahnung", "Sieht nach einer Mahnung aus", "Möglicherweise eine Zahlungsaufforderung");
    case "termination":
      return w("Wahrscheinlich eine Kündigung oder Beendigung", "Sieht nach einer Kündigung aus", "Könnte eine Beendigung betreffen");
    case "form":
      return w("Wahrscheinlich ein Formular oder Antrag", "Sieht nach einem Formular aus", "Möglicherweise ein Formular");
    case "travel_booking":
      return w("Wahrscheinlich eine Buchung oder Reiseunterlage", "Sieht nach Ticket oder Buchung aus", "Könnte Reise oder Transport betreffen");
    default:
      return w("Dokument erkannt", "Dokumentenart noch unsicher", "Noch nicht eindeutig einordenbar");
  }
}

function headlineEn(kind: DocumentKindId, confidence: DocumentKindDetection["confidence"]): string {
  const w = (a: string, b: string, c: string) => (confidence === "high" ? a : confidence === "medium" ? b : c);

  switch (kind) {
    case "contract":
      return w("Likely a contract", "Looks like a contract", "Possibly contract-related");
    case "authority_notice":
      return w("Likely a letter from an authority or official notice", "Looks like an official letter", "May be an authority document");
    case "invoice":
      return w("Likely an invoice", "Looks like an invoice", "Possibly an invoice");
    case "reminder":
      return w("Likely a reminder or dunning letter", "Looks like a payment reminder", "Possibly a payment request");
    case "termination":
      return w("Likely a termination notice", "Looks like a termination", "May concern ending an agreement");
    case "form":
      return w("Likely a form or application", "Looks like a form", "Possibly a form");
    case "travel_booking":
      return w("Likely a booking or travel document", "Looks like a ticket or booking", "May relate to travel or transport");
    default:
      return w("Document received", "Type still unclear", "Not easy to classify yet");
  }
}

export function getKindDetectionHeadline(locale: AppLocale, detection: DocumentKindDetection): string {
  switch (locale) {
    case "de":
      return headlineDe(detection.kind, detection.confidence);
    default:
      return headlineEn(detection.kind, detection.confidence);
  }
}

function importanceDe(h: ImportanceHint): string {
  switch (h) {
    case "urgent":
      return "Eher dringend";
    case "relevant":
      return "Relevant";
    case "informative":
      return "Eher informativ";
    default:
      return "Noch unklar";
  }
}

function importanceEn(h: ImportanceHint): string {
  switch (h) {
    case "urgent":
      return "Rather urgent";
    case "relevant":
      return "Relevant";
    case "informative":
      return "Mostly informational";
    default:
      return "Still unclear";
  }
}

export function getImportanceLabel(locale: AppLocale, hint: ImportanceHint): string {
  return locale === "de" ? importanceDe(hint) : importanceEn(hint);
}

function moduleLabel(locale: AppLocale, id: SuggestedModuleId): string {
  if (locale === "de") {
    switch (id) {
      case "contract_scanner":
        return "Vertragsscanner";
      case "money_back_finder":
        return "Geld-zurück-Finder";
      case "notice_scanner":
        return "Bescheid-Scanner";
      case "document_summary":
        return "Dokumentenzusammenfassung";
      default:
        return "Fristen & To-dos";
    }
  }
  switch (id) {
    case "contract_scanner":
      return "Contract review";
    case "money_back_finder":
      return "Money-back finder";
    case "notice_scanner":
      return "Notice scanner";
    case "document_summary":
      return "Document summary";
    default:
      return "Deadlines & tasks";
  }
}

export function getModuleLabels(locale: AppLocale, modules: SuggestedModuleId[]): string[] {
  return modules.map((m) => moduleLabel(locale, m));
}

export function getKindDetectionIntro(locale: AppLocale): string {
  return locale === "de"
    ? "Wir haben dein Dokument eingeordnet – so können wir dich passend weiterführen."
    : "We've sorted your document so we can guide you in a useful way.";
}

export function getKindDetectionSignalsLabel(locale: AppLocale): string {
  return locale === "de" ? "Erkannte Hinweise" : "Signals noticed";
}

export function getKindDetectionNextHint(locale: AppLocale): string {
  return locale === "de"
    ? "Als Nächstes: Vollständige Analyse starten – dann werden Inhalt, Fristen und nächste Schritte konkret."
    : "Next: run the full analysis for concrete content, deadlines and next steps.";
}
