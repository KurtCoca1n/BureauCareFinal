import { normalizePreferredLanguage } from "@/lib/languages";

export type ContractActionsCopy = {
  panelBadge: string;
  panelTitle: string;
  panelIntro: string;
  metaProvider: string;
  metaType: string;
  metaNotice: string;
  metaAutoRenewal: string;
  metaAutoRenewalYes: string;
  metaAutoRenewalNo: string;
  metaAutoRenewalUnclear: string;
  actionCancel: string;
  actionCancelHint: string;
  actionExtend: string;
  actionExtendHint: string;
  backToDocument: string;
  cancelPageTitle: string;
  cancelStepIntroTitle: string;
  cancelStepIntroBody: string;
  cancelStepFormTitle: string;
  cancelStepPreviewTitle: string;
  cancelGenerate: string;
  cancelBack: string;
  cancelCopy: string;
  cancelDownload: string;
  cancelDownloadFilename: string;
  fieldSenderName: string;
  fieldStreet: string;
  fieldPostal: string;
  fieldCity: string;
  fieldRecipientName: string;
  fieldRecipientStreet: string;
  fieldRecipientPostal: string;
  fieldRecipientCity: string;
  fieldContractType: string;
  fieldContractNumber: string;
  fieldDesiredDate: string;
  fieldEmail: string;
  fieldPhone: string;
  fieldSubjectOptional: string;
  placeholderDate: string;
  disclaimerTitle: string;
  disclaimerBody: string;
  extendPageTitle: string;
  extendIntro: string;
  extendGeneratedLabel: string;
  extendOptionPlaceholder: string;
  extendCopy: string;
  extendBack: string;
};

const de: ContractActionsCopy = {
  panelBadge: "Vertrag",
  panelTitle: "Nächste Schritte mit diesem Vertrag",
  panelIntro:
    "Hier kannst du auf Basis deiner Analyse ein Kündigungsschreiben vorbereiten oder eine höfliche Anfrage zur Verlängerung formulieren. Bitte prüfe alle Angaben, bevor du etwas versendest.",
  metaProvider: "Anbieter / Gegenpartei",
  metaType: "Vertragsart",
  metaNotice: "Kündigungsfrist laut Analyse",
  metaAutoRenewal: "Verlängerung",
  metaAutoRenewalUnclear: "Nicht aus der Analyse ersichtlich",
  metaAutoRenewalYes: "In der Analyse wird eine mögliche automatische Verlängerung erwähnt",
  metaAutoRenewalNo: "Laut Analyse ohne automatische Verlängerung bzw. nicht erwähnt",
  actionCancel: "Vertrag kündigen",
  actionCancelHint: "Formales Schreiben aus deinen Angaben",
  actionExtend: "Verlängerung anfragen",
  actionExtendHint: "Kurze höfliche Anfrage",
  backToDocument: "Zurück zum Dokument",
  cancelPageTitle: "Kündigung vorbereiten",
  cancelStepIntroTitle: "Was passiert hier?",
  cancelStepIntroBody:
    "BureauCare erstellt aus deinen Angaben ein formales Kündigungsschreiben als Entwurf. Es ersetzt keine anwaltliche Beratung. Bitte lies alles durch und ergänze fehlende Adressdaten.",
  cancelStepFormTitle: "Angaben prüfen und ergänzen",
  cancelStepPreviewTitle: "Vorschau",
  cancelGenerate: "Schreiben erzeugen",
  cancelBack: "Zurück",
  cancelCopy: "Text kopieren",
  cancelDownload: "Als Textdatei laden",
  cancelDownloadFilename: "Kuendigung.txt",
  fieldSenderName: "Dein vollständiger Name",
  fieldStreet: "Straße und Hausnummer",
  fieldPostal: "PLZ",
  fieldCity: "Ort",
  fieldRecipientName: "Empfänger (Firma oder Name)",
  fieldRecipientStreet: "Empfänger: Straße (optional)",
  fieldRecipientPostal: "Empfänger: PLZ (optional)",
  fieldRecipientCity: "Empfänger: Ort (optional)",
  fieldContractType: "Vertragsart (z. B. Handyvertrag)",
  fieldContractNumber: "Vertrags- oder Kundennummer (optional)",
  fieldDesiredDate: "Gewünschtes Kündigungsdatum / letzter Nutzungstag",
  fieldEmail: "E-Mail für Rückfragen (optional)",
  fieldPhone: "Telefon (optional)",
  fieldSubjectOptional: "Eigene Betreffzeile (optional)",
  placeholderDate: "z. B. zum nächstmöglichen Zeitpunkt / 31.12.2026",
  disclaimerTitle: "Hinweis",
  disclaimerBody:
    "Bitte prüfe alle Daten vor dem Versand. BureauCare ist keine Kanzlei und übernimmt keine rechtliche Prüfung. In besonderen Fällen kann eine zusätzliche Klärung sinnvoll sein.",
  extendPageTitle: "Verlängerung anfragen",
  extendIntro:
    "Unten findest du einen sachlichen Entwurf, mit dem du nach Optionen zur Verlängerung oder zum Ablauf fragen kannst. Du kannst ihn anpassen, kopieren und wie gewohnt versenden.",
  extendGeneratedLabel: "Entwurf",
  extendOptionPlaceholder: "Optional: z. B. gleiche Konditionen, kürzere Laufzeit …",
  extendCopy: "Kopieren",
  extendBack: "Zurück zum Dokument"
};

const en: ContractActionsCopy = {
  panelBadge: "Contract",
  panelTitle: "Next steps for this contract",
  panelIntro:
    "Prepare a formal termination draft or a polite extension request based on your analysis. Please double-check every detail before you send anything.",
  metaProvider: "Provider / counterparty",
  metaType: "Contract type",
  metaNotice: "Notice period (from analysis)",
  metaAutoRenewal: "Renewal",
  metaAutoRenewalUnclear: "Not visible from the analysis",
  metaAutoRenewalYes: "The analysis mentions a possible automatic renewal",
  metaAutoRenewalNo: "According to the analysis, no automatic renewal (or not mentioned)",
  actionCancel: "Terminate contract",
  actionCancelHint: "Formal letter from your details",
  actionExtend: "Ask about renewal",
  actionExtendHint: "Short polite request",
  backToDocument: "Back to document",
  cancelPageTitle: "Prepare termination",
  cancelStepIntroTitle: "What happens here?",
  cancelStepIntroBody:
    "BureauCare builds a formal termination letter draft from your inputs. It is not legal advice. Please read it carefully and add any missing address details.",
  cancelStepFormTitle: "Review and complete details",
  cancelStepPreviewTitle: "Preview",
  cancelGenerate: "Generate letter",
  cancelBack: "Back",
  cancelCopy: "Copy text",
  cancelDownload: "Download as text file",
  cancelDownloadFilename: "termination-notice.txt",
  fieldSenderName: "Your full name",
  fieldStreet: "Street and number",
  fieldPostal: "Postcode",
  fieldCity: "City",
  fieldRecipientName: "Recipient (company or name)",
  fieldRecipientStreet: "Recipient: street (optional)",
  fieldRecipientPostal: "Recipient: postcode (optional)",
  fieldRecipientCity: "Recipient: city (optional)",
  fieldContractType: "Contract type (e.g. mobile plan)",
  fieldContractNumber: "Contract or customer number (optional)",
  fieldDesiredDate: "Desired end date / last day of use",
  fieldEmail: "Email for replies (optional)",
  fieldPhone: "Phone (optional)",
  fieldSubjectOptional: "Custom subject line (optional)",
  placeholderDate: "e.g. at the earliest possible date / 31 Dec 2026",
  disclaimerTitle: "Note",
  disclaimerBody:
    "Please verify all details before sending. BureauCare is not a law firm and does not provide legal review. Unusual cases may need extra clarification.",
  extendPageTitle: "Ask about renewal",
  extendIntro:
    "Below is a calm draft you can use to ask about renewal options or what happens at the end of the term. Edit, copy, and send as you normally would.",
  extendGeneratedLabel: "Draft",
  extendOptionPlaceholder: "Optional: e.g. same terms, shorter term …",
  extendCopy: "Copy",
  extendBack: "Back to document"
};

const table: Record<string, ContractActionsCopy> = { de, en, tr: en, uk: en, es: en, zh: en };

export function getContractActionsCopy(locale: string | null | undefined): ContractActionsCopy {
  const key = normalizePreferredLanguage(locale ?? "de");
  return table[key] ?? de;
}
