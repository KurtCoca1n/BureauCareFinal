/**
 * Formelle Schreiben auf Basis von Nutzerangaben — keine Rechtsberatung, keine Garantien.
 * Später ersetzbar durch KI/API unter gleicher Input-Struktur.
 */

export type CancellationLetterFields = {
  locale: "de" | "en";
  senderName: string;
  senderStreet: string;
  senderPostalCode: string;
  senderCity: string;
  senderCountry?: string;
  recipientName: string;
  recipientStreet?: string;
  recipientPostalCode?: string;
  recipientCity?: string;
  contractTypeLabel: string;
  contractOrCustomerNumber?: string;
  desiredCancellationDate: string;
  contactEmail?: string;
  contactPhone?: string;
  referenceSubject?: string;
};

function joinAddress(lines: (string | undefined)[]): string {
  return lines.filter(Boolean).join("\n");
}

export function buildCancellationLetter(f: CancellationLetterFields): string {
  if (f.locale === "en") {
    return buildCancellationLetterEn(f);
  }
  return buildCancellationLetterDe(f);
}

function buildCancellationLetterDe(f: CancellationLetterFields): string {
  const senderBlock = joinAddress([
    f.senderName,
    f.senderStreet,
    `${f.senderPostalCode} ${f.senderCity}`.trim(),
    f.senderCountry
  ]);

  const recipientAddressLine =
    f.recipientPostalCode && f.recipientCity ? `${f.recipientPostalCode} ${f.recipientCity}` : f.recipientCity;
  const recipientBlock = joinAddress([f.recipientName, f.recipientStreet, recipientAddressLine]);

  const today = new Date().toLocaleDateString("de-DE", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const placeDate = `${f.senderCity || "Ort"}, den ${today}`;

  const betreff =
    f.referenceSubject?.trim() ||
    `Kündigung ${f.contractTypeLabel ? `– ${f.contractTypeLabel}` : "meines Vertrags"}`;

  const numBlock = f.contractOrCustomerNumber?.trim()
    ? `Meine Vertrags- bzw. Kundennummer lautet: ${f.contractOrCustomerNumber.trim()}.\n\n`
    : "";

  const contactBlock =
    [f.contactEmail ? `E-Mail: ${f.contactEmail}` : "", f.contactPhone ? `Telefon: ${f.contactPhone}` : ""]
      .filter(Boolean)
      .join("\n") || "";

  const contactClosing = contactBlock
    ? `Für Rückfragen erreichen Sie mich gerne unter:\n${contactBlock}\n\n`
    : "";

  return `${senderBlock}

${recipientBlock}

${placeDate}

Betreff: ${betreff}

Sehr geehrte Damen und Herren,

hiermit kündige ich den oben bezeichneten Vertrag${f.contractTypeLabel ? ` (${f.contractTypeLabel})` : ""} ordentlich und – soweit anwendbar – unter Einhaltung der vertraglichen Kündigungsfrist.

${numBlock}Als gewünschtes Beendigungsdatum nenne ich: ${f.desiredCancellationDate.trim()}.

Bitte bestätigen Sie mir den Eingang dieser Kündigung und teilen Sie mir mit, zu welchem Kalendertag der Vertrag nach Ihrer Berechnung endet. Sollten Sie Rückfragen haben oder weitere Unterlagen benötigen, setzen Sie sich bitte mit mir in Verbindung.

${contactClosing}Mit freundlichen Grüßen

${f.senderName}`;
}

function buildCancellationLetterEn(f: CancellationLetterFields): string {
  const senderBlock = joinAddress([
    f.senderName,
    f.senderStreet,
    `${f.senderPostalCode} ${f.senderCity}`.trim(),
    f.senderCountry
  ]);

  const recipientAddressLine =
    f.recipientPostalCode && f.recipientCity ? `${f.recipientPostalCode} ${f.recipientCity}` : f.recipientCity;
  const recipientBlock = joinAddress([f.recipientName, f.recipientStreet, recipientAddressLine]);

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric"
  });
  const placeDate = `${f.senderCity || "City"}, ${today}`;

  const subject =
    f.referenceSubject?.trim() ||
    `Notice of termination${f.contractTypeLabel ? ` – ${f.contractTypeLabel}` : ""}`;

  const numBlock = f.contractOrCustomerNumber?.trim()
    ? `My contract or customer reference is: ${f.contractOrCustomerNumber.trim()}.\n\n`
    : "";

  const contactBlock =
    [f.contactEmail ? `Email: ${f.contactEmail}` : "", f.contactPhone ? `Phone: ${f.contactPhone}` : ""]
      .filter(Boolean)
      .join("\n") || "";

  const contactClosing = contactBlock
    ? `You can reach me for any questions at:\n${contactBlock}\n\n`
    : "";

  return `${senderBlock}

${recipientBlock}

${placeDate}

Subject: ${subject}

Dear Sir or Madam,

Please note that I hereby give notice to terminate the above-mentioned agreement${f.contractTypeLabel ? ` (${f.contractTypeLabel})` : ""}, in line with the applicable notice period in our contract where relevant.

${numBlock}The termination date I am aiming for is: ${f.desiredCancellationDate.trim()}.

Please acknowledge receipt of this notice and confirm the effective end date from your perspective. If you need any further details or documents, please let me know.

${contactClosing}Kind regards

${f.senderName}`;
}

export type ExtensionLetterFields = {
  locale: "de" | "en";
  senderName: string;
  recipientName: string;
  contractTypeLabel: string;
  contractOrCustomerNumber?: string;
  preferredOption?: string;
};

/** Höfliche Verlängerungs- / Optionsanfrage (MVP) */
export function buildExtensionRequestLetter(f: ExtensionLetterFields): string {
  if (f.locale === "en") {
    const num = f.contractOrCustomerNumber?.trim() ? ` (reference: ${f.contractOrCustomerNumber.trim()})` : "";
    const opt = f.preferredOption?.trim()
      ? `\n\nI would appreciate information on the following: ${f.preferredOption.trim()}`
      : "";
    return `Dear Sir or Madam,

I am contacting you regarding my agreement${f.contractTypeLabel ? ` (${f.contractTypeLabel})` : ""}${num}, with ${f.recipientName}.

I would like to explore options for extending or renewing the contract on fair terms, or to understand what contract-end options exist.${opt}

Please reply at your convenience with the available choices and any deadlines I should be aware of.

Kind regards

${f.senderName}`;
  }

  const num = f.contractOrCustomerNumber?.trim() ? ` (Vertrags- bzw. Kundennummer: ${f.contractOrCustomerNumber.trim()})` : "";
  const opt = f.preferredOption
    ? `\n\nKonkret interessiert mich: ${f.preferredOption.trim()}`
    : "";

  return `Sehr geehrte Damen und Herren,

ich melde mich bezüglich meines Vertrags${f.contractTypeLabel ? ` (${f.contractTypeLabel})` : ""}${num} mit ${f.recipientName}.

Ich möchte freundlich nach den Möglichkeiten einer Vertragsverlängerung oder vergleichbaren Optionen fragen – oder darüber informiert werden, welche Alternativen zum Laufzeitende bestehen.${opt}

Über eine kurze Rückmeldung mit den für mich relevanten Schritten und Fristen freue ich mich.

Mit freundlichen Grüßen

${f.senderName}`;
}
