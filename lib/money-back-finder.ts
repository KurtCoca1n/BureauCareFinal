import { getMoneyBackFinderCopy } from "@/lib/money-back-finder-ui";

export type MoneyBackCategory = "travel" | "contracts";
export type TravelIssue =
  | "flight_delay"
  | "flight_cancellation"
  | "missed_connection"
  | "baggage_problem"
  | "unused_travel_service"
  | "travel_disruption";
export type ContractIssue =
  | "unclear_charge"
  | "double_payment"
  | "cancellation_problem"
  | "subscription_continues"
  | "service_not_provided"
  | "service_partly_provided";
export type MoneyBackIssue = TravelIssue | ContractIssue;
export type TernaryAnswer = "yes" | "no" | "unknown";
export type ServiceReceivedStatus = "full" | "partly" | "none";
export type MoneyBackAssessment = "very_likely" | "likely" | "unclear" | "rather_unlikely";

export type MoneyBackFinderInput = {
  category: MoneyBackCategory;
  issue: MoneyBackIssue;
  issueDate: string;
  providerName: string;
  bookedService: string;
  whatHappened: string;
  amountPaid: string;
  delayHours: string;
  extraCosts: string;
  serviceReceived: ServiceReceivedStatus;
  cancellationSent: TernaryAnswer;
  hasBookingOrContract: boolean;
  hasPaymentProof: boolean;
  hasCommunication: boolean;
  hasCancellationProof: boolean;
};

export type MoneyBackFinderResult = {
  shortResult: string;
  assessment: MoneyBackAssessment;
  possibleAmount: string;
  reasoning: string[];
  missingInfo: string[];
  suggestedDocuments: string[];
  nextSteps: string[];
};

function asNumber(value: string) {
  const normalized = value.replace(",", ".").trim();
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatEuro(locale: string, value: number) {
  return new Intl.NumberFormat(locale === "de" ? "de-DE" : locale === "zh" ? "zh-CN" : "en-GB", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: value % 1 === 0 ? 0 : 2
  }).format(value);
}

function unique(items: string[]) {
  return [...new Set(items.filter(Boolean))];
}

export function getInitialMoneyBackFinderInput(): MoneyBackFinderInput {
  return {
    category: "travel",
    issue: "flight_delay",
    issueDate: "",
    providerName: "",
    bookedService: "",
    whatHappened: "",
    amountPaid: "",
    delayHours: "",
    extraCosts: "",
    serviceReceived: "partly",
    cancellationSent: "unknown",
    hasBookingOrContract: false,
    hasPaymentProof: false,
    hasCommunication: false,
    hasCancellationProof: false
  };
}

export function getIssuesForCategory(category: MoneyBackCategory): MoneyBackIssue[] {
  return category === "travel"
    ? [
        "flight_delay",
        "flight_cancellation",
        "missed_connection",
        "baggage_problem",
        "unused_travel_service",
        "travel_disruption"
      ]
    : [
        "unclear_charge",
        "double_payment",
        "cancellation_problem",
        "subscription_continues",
        "service_not_provided",
        "service_partly_provided"
      ];
}

export function buildMoneyBackFinderResult(
  input: MoneyBackFinderInput,
  locale: string | null | undefined
): MoneyBackFinderResult {
  const copy = getMoneyBackFinderCopy(locale);
  const englishMode = locale !== "de";
  const effectiveLocale = locale ?? "de";
  const amountPaid = asNumber(input.amountPaid);
  const delayHours = asNumber(input.delayHours);
  const extraCosts = asNumber(input.extraCosts);
  let score = 0;
  const reasoning: string[] = [];
  const missingInfo: string[] = [];
  const documents: string[] = [];
  const nextSteps: string[] = [];
  let possibleAmount = copy.shortResults.more_info_needed;
  let shortResult = copy.shortResults.more_info_needed;

  if (!input.issueDate) {
    missingInfo.push(englishMode ? "The exact date of the incident is still missing." : "Das genaue Datum des Vorfalls fehlt noch.");
  }
  if (!input.providerName.trim()) {
    missingInfo.push(englishMode ? "It should still be clear who the other side is." : "Wer die Gegenseite ist, sollte noch klar benannt werden.");
  }
  if (!input.bookedService.trim()) {
    missingInfo.push(englishMode ? "Which service was booked or paid for is still missing." : "Welche Leistung genau gebucht oder bezahlt wurde, fehlt noch.");
  }
  if (!input.whatHappened.trim()) {
    missingInfo.push(englishMode ? "Please still explain briefly what exactly went wrong." : "Beschreibe noch kurz, was genau schiefgelaufen ist.");
  }
  if (!input.hasPaymentProof) {
    documents.push(englishMode ? "Payment proof or bank statement" : "Zahlungsnachweis oder Kontoauszug");
  }
  if (!input.hasBookingOrContract) {
    documents.push(input.category === "travel" ? (englishMode ? "Booking confirmation or ticket" : "Buchungsbestätigung oder Ticket") : (englishMode ? "Contract, subscription or order confirmation" : "Vertrag, Abo oder Bestellbestätigung"));
  }
  if (!input.hasCommunication) {
    documents.push(englishMode ? "Written communication with the provider" : "Schriftverkehr mit dem Anbieter");
  }

  if (input.category === "travel") {
    shortResult = copy.shortResults.compensation_possible;

    if (input.issue === "flight_delay") {
      if (delayHours !== null && delayHours >= 3) {
        score += 4;
        reasoning.push(englishMode ? "Arrival with at least about three hours of delay can be a strong sign of compensation for flights." : "Eine Ankunft mit mindestens etwa drei Stunden Verspätung kann bei Flügen ein starkes Zeichen für eine Entschädigung sein.");
        possibleAmount = englishMode ? "For flights, the possible compensation is often roughly between 250 and 600 euros. The exact amount depends on the route and what happened." : "Häufig liegt die mögliche Entschädigung bei Flügen grob zwischen 250 und 600 Euro. Die genaue Höhe hängt von Strecke und Ablauf ab.";
      } else if (delayHours !== null) {
        score += 1;
        reasoning.push(englishMode ? "There was a delay, but for a stronger assessment it matters how long the final arrival delay really was." : "Es gab eine Verspätung, aber für eine stärkere Einschätzung ist wichtig, wie lang sie am Ende wirklich war.");
        missingInfo.push(englishMode ? "Please still check the exact arrival delay." : "Prüfe noch die genaue Ankunftsverspätung.");
        possibleAmount = englishMode ? "Compensation may be possible, but with the current details the amount is still open." : "Eine Entschädigung ist möglich, die Höhe ist mit den aktuellen Angaben aber noch offen.";
      } else {
        missingInfo.push(englishMode ? "How many hours of delay there were is still important." : "Wie viele Stunden Verspätung es gab, ist noch wichtig.");
        possibleAmount = englishMode ? "The possible amount is still open." : "Die mögliche Höhe ist noch offen.";
      }
      nextSteps.push(englishMode ? "Check the exact arrival time and keep your ticket or boarding pass ready." : "Prüfe die genaue Ankunftszeit und halte Ticket oder Boardingpass bereit.");
    }

    if (input.issue === "flight_cancellation") {
      score += 4;
      reasoning.push(englishMode ? "A cancelled flight can be a strong sign of a refund or compensation." : "Ein gestrichener Flug kann ein starkes Zeichen für eine Erstattung oder Entschädigung sein.");
      possibleAmount = englishMode ? "Depending on what happened, a refund and for some flights an additional 250 to 600 euros of compensation may be possible." : "Je nach Ablauf kommen oft eine Erstattung und bei manchen Flügen zusätzlich etwa 250 bis 600 Euro Entschädigung in Betracht.";
      nextSteps.push(englishMode ? "Ask the airline for clear confirmation of the disruption and the replacement option offered." : "Bitte die Airline zuerst um klare Bestätigung der Störung und der angebotenen Ersatzlösung.");
    }

    if (input.issue === "missed_connection") {
      score += 3;
      reasoning.push(englishMode ? "If you missed your connection because of a disruption, that can be relevant for compensation or a refund." : "Wenn du wegen einer Störung den Anschlussflug verpasst hast, kann das für eine Entschädigung oder Erstattung relevant sein.");
      if (delayHours !== null && delayHours >= 3) {
        score += 1;
      } else {
        missingInfo.push(englishMode ? "You should still check how much later you arrived at your destination." : "Wie viel später du am Ziel angekommen bist, solltest du noch prüfen.");
      }
      possibleAmount = englishMode ? "Possible compensation is conceivable. The exact amount depends strongly on the full travel route." : "Eine mögliche Entschädigung ist denkbar. Die genaue Höhe hängt stark vom gesamten Reiseablauf ab.";
      nextSteps.push(englishMode ? "Keep all bookings for the same trip and check the real arrival time at the final destination." : "Sichere alle Buchungen derselben Reise und prüfe die tatsächliche Ankunftszeit am Ziel.");
    }

    if (input.issue === "baggage_problem") {
      score += 3;
      reasoning.push(englishMode ? "With delayed or lost baggage, reimbursement for documented replacement purchases or other claims may be possible." : "Bei verspätetem oder verlorenem Gepäck kann eine Erstattung für belegte Ersatzkäufe oder weitere Ansprüche möglich sein.");
      possibleAmount = englishMode ? "The possible amount is open. Receipts for replacement purchases or the damage are especially important." : "Die mögliche Summe ist offen. Wichtig sind vor allem Belege für Ersatzkäufe oder den Schaden.";
      nextSteps.push(englishMode ? "Keep the baggage report and receipts for necessary replacement purchases ready." : "Halte die Gepäckmeldung und Belege für notwendige Ersatzkäufe bereit.");
    }

    if (input.issue === "unused_travel_service") {
      score += 2;
      reasoning.push(englishMode ? "If a booked travel service could not be used or was not provided, a refund may be possible." : "Wenn eine gebuchte Reiseleistung nicht genutzt werden konnte oder nicht erbracht wurde, kann eine Rückzahlung möglich sein.");
      possibleAmount =
        amountPaid !== null
          ? englishMode
            ? `A refund of up to about ${formatEuro(effectiveLocale, amountPaid)} may be possible if the service really was not provided.`
            : `Eine Rückzahlung bis etwa ${formatEuro(effectiveLocale, amountPaid)} könnte möglich sein, wenn die Leistung wirklich nicht erbracht wurde.`
          : englishMode
            ? "A refund may be possible, but the amount is still open."
            : "Eine Rückzahlung ist möglich, die Höhe ist aber noch offen.";
      nextSteps.push(englishMode ? "Check which part of the travel service really failed and what can be proven." : "Prüfe, welcher Teil der Reiseleistung wirklich ausgefallen ist und was davon belegbar ist.");
    }

    if (input.issue === "travel_disruption") {
      score += 2;
      reasoning.push(englishMode ? "There are signs of a travel disruption. BureauCare still needs a bit more context for a clear assessment." : "Es gibt Anzeichen für eine Störung der Reise. Für eine klare Einschätzung braucht BureauCare noch etwas mehr Kontext.");
      possibleAmount = englishMode ? "A claim may be possible, but the amount is open." : "Anspruch möglich, aber Höhe offen.";
      nextSteps.push(englishMode ? "Still collect confirmations, times and possible extra costs." : "Sammle noch Bestätigung, Zeiten und mögliche Zusatzkosten.");
    }

    if (extraCosts !== null && extraCosts > 0) {
      score += 1;
      reasoning.push(englishMode ? "Additional documented costs can matter for reimbursement." : "Zusätzliche belegte Kosten können für eine Erstattung wichtig sein.");
      nextSteps.push(englishMode ? "Upload receipts for your extra costs." : "Lade Belege für deine Zusatzkosten hoch.");
    }
  } else {
    shortResult = copy.shortResults.refund_possible;

    if (input.issue === "unclear_charge") {
      score += 2;
      reasoning.push(englishMode ? "An unclear charge can be a sign that the payment should be checked more closely and may need to be reclaimed." : "Eine unklare Abbuchung kann ein Zeichen dafür sein, dass die Zahlung genauer geprüft und möglicherweise zurückgefordert werden sollte.");
      possibleAmount =
        amountPaid !== null
          ? englishMode
            ? `Based on the current details, the possible refund is about ${formatEuro(effectiveLocale, amountPaid)}.`
            : `Die mögliche Rückzahlung liegt nach den aktuellen Angaben bei etwa ${formatEuro(effectiveLocale, amountPaid)}.`
          : englishMode
            ? "A refund may be possible, but the amount is still open."
            : "Eine Rückzahlung ist möglich, die Höhe ist aber noch offen.";
      nextSteps.push(englishMode ? "First ask the provider for a clear explanation of the charge." : "Bitte den Anbieter zuerst um eine klare Erklärung der Abbuchung.");
    }

    if (input.issue === "double_payment") {
      score += 4;
      reasoning.push(englishMode ? "A double payment is a clear sign of a possible refund." : "Eine doppelte Zahlung ist ein deutliches Zeichen für eine mögliche Rückerstattung.");
      possibleAmount =
        amountPaid !== null
          ? englishMode
            ? `The likely refund is about ${formatEuro(effectiveLocale, amountPaid)}.`
            : `Die mögliche Rückzahlung liegt wahrscheinlich bei etwa ${formatEuro(effectiveLocale, amountPaid)}.`
          : englishMode
            ? "The amount will likely depend on the duplicate charge."
            : "Die Höhe dürfte sich an der doppelten Abbuchung orientieren.";
      nextSteps.push(englishMode ? "Compare the bank statement and invoice and ask for the duplicate payment back." : "Vergleiche Kontoauszug und Rechnung und fordere die doppelte Zahlung zurück.");
    }

    if (input.issue === "cancellation_problem") {
      score += 2;
      reasoning.push(englishMode ? "If cancellation is hard to understand or is not processed properly, that can matter for later refunds." : "Wenn eine Kündigung schwer verständlich ist oder nicht sauber verarbeitet wird, kann das für spätere Rückzahlungen wichtig sein.");
      if (input.cancellationSent === "yes") {
        score += 2;
      } else {
        missingInfo.push(englishMode ? "It is still important whether a cancellation or objection has already been sent." : "Ob bereits eine Kündigung oder ein Widerspruch geschickt wurde, ist noch wichtig.");
      }
      if (!input.hasCancellationProof) {
        documents.push(englishMode ? "Cancellation or objection with date" : "Kündigung oder Widerspruch mit Datum");
      }
      possibleAmount = englishMode ? "A refund may be possible if the cancellation was on time or if the conditions are unclear." : "Eine Rückzahlung ist möglich, wenn die Kündigung rechtzeitig war oder unklare Bedingungen vorliegen.";
      nextSteps.push(englishMode ? "Check when the cancellation was sent and whether you have proof." : "Prüfe, wann die Kündigung geschickt wurde und ob du einen Nachweis hast.");
    }

    if (input.issue === "subscription_continues") {
      score += 3;
      reasoning.push(englishMode ? "If a subscription keeps running despite wanting to cancel, reclaiming the later charges may be possible." : "Wenn ein Abo trotz Kündigungswunsch weiterläuft, kann eine Rückforderung der weiteren Abbuchungen möglich sein.");
      if (input.cancellationSent === "yes") {
        score += 2;
      }
      if (!input.hasCancellationProof) {
        documents.push(englishMode ? "Proof of cancellation" : "Kündigungsnachweis");
      }
      possibleAmount =
        amountPaid !== null
          ? englishMode
            ? `The possible refund could at least be based on the later charges, here starting from about ${formatEuro(effectiveLocale, amountPaid)}.`
            : `Die mögliche Rückzahlung könnte sich mindestens an den weiteren Abbuchungen orientieren, hier also ab etwa ${formatEuro(effectiveLocale, amountPaid)}.`
          : englishMode
            ? "The possible refund depends on the later charges."
            : "Die mögliche Rückzahlung hängt von den weiteren Abbuchungen ab.";
      nextSteps.push(englishMode ? "Keep the proof of cancellation and the later charges together." : "Sichere Kündigungsnachweis und die späteren Abbuchungen zusammen.");
    }

    if (input.issue === "service_not_provided") {
      score += 4;
      reasoning.push(englishMode ? "If payment was made but the service was not provided at all, that strongly supports a possible refund." : "Wenn bezahlt wurde, aber die Leistung gar nicht erbracht wurde, spricht das deutlich für eine mögliche Rückzahlung.");
      possibleAmount =
        amountPaid !== null
          ? englishMode
            ? `A refund of up to about ${formatEuro(effectiveLocale, amountPaid)} may be possible.`
            : `Eine Rückzahlung bis etwa ${formatEuro(effectiveLocale, amountPaid)} könnte möglich sein.`
          : englishMode
            ? "A refund may be possible, but the exact amount is still open."
            : "Eine Rückzahlung ist möglich, die genaue Höhe ist aber noch offen.";
      nextSteps.push(englishMode ? "Write down which service was promised and what was actually not delivered." : "Halte fest, welche Leistung versprochen war und was tatsächlich nicht geliefert wurde.");
    }

    if (input.issue === "service_partly_provided") {
      score += 3;
      reasoning.push(englishMode ? "If a service was provided only partly, a partial refund may be worth considering." : "Wenn eine Leistung nur teilweise erbracht wurde, kann eine anteilige Rückzahlung in Betracht kommen.");
      possibleAmount =
        amountPaid !== null
          ? englishMode
            ? `A partial refund based on about ${formatEuro(effectiveLocale, amountPaid)} may be possible.`
            : `Eine teilweise Rückzahlung auf Basis von etwa ${formatEuro(effectiveLocale, amountPaid)} könnte möglich sein.`
          : englishMode
            ? "A partial refund may be possible, but the exact amount is still open."
            : "Eine anteilige Rückzahlung ist möglich, die genaue Höhe ist noch offen.";
      nextSteps.push(englishMode ? "Check as precisely as possible which part of the service was missing." : "Prüfe möglichst genau, welcher Teil der Leistung fehlte.");
    }

    if (input.serviceReceived === "none") {
      score += 2;
    } else if (input.serviceReceived === "partly") {
      score += 1;
    }
  }

  if (input.hasPaymentProof) score += 1;
  if (input.hasBookingOrContract) score += 1;
  if (input.hasCommunication) score += 1;
  if (input.hasCancellationProof) score += 1;

  if (!reasoning.length) {
    reasoning.push(englishMode ? "With the current details there is not yet a strong pattern for a clear refund or compensation." : "Mit den aktuellen Angaben gibt es noch kein starkes Muster für eine klare Rückzahlung oder Entschädigung.");
  }
  if (!nextSteps.length) {
    nextSteps.push(englishMode ? "First collect the most important proof and then review the exact claim." : "Sammle zuerst die wichtigsten Belege und prüfe dann die genaue Forderung.");
  }
  if (input.category === "travel" && !input.hasBookingOrContract) {
    nextSteps.push(englishMode ? "Upload the ticket, booking confirmation or boarding pass." : "Lade Ticket, Buchungsbestätigung oder Boardingpass hoch.");
  }
  if (input.category === "contracts" && input.cancellationSent === "yes" && !input.hasCancellationProof) {
    missingInfo.push(englishMode ? "A documentable proof of cancellation or objection would help a lot." : "Ein belegbarer Nachweis für Kündigung oder Widerspruch wäre sehr hilfreich.");
  }

  const assessment: MoneyBackAssessment =
    score >= 6 ? "very_likely" : score >= 4 ? "likely" : score >= 2 ? "unclear" : "rather_unlikely";

  if (assessment === "rather_unlikely") {
    shortResult = copy.shortResults.unlikely;
    if (!possibleAmount || possibleAmount === copy.shortResults.more_info_needed) {
      possibleAmount = englishMode ? "Right now there is no clear amount visible." : "Im Moment ist keine klare Summe erkennbar.";
    }
  } else if (assessment === "unclear" && missingInfo.length >= 2) {
    shortResult = copy.shortResults.more_info_needed;
  }

  if (!missingInfo.length) {
    missingInfo.push(englishMode ? "The most important basic details are already there. Now the main thing is the proof." : "Die wichtigsten Basisangaben sind schon da. Jetzt kommt es vor allem auf die Belege an.");
  }

  return {
    shortResult,
    assessment,
    possibleAmount,
    reasoning: unique(reasoning),
    missingInfo: unique(missingInfo),
    suggestedDocuments: unique(documents),
    nextSteps: unique(nextSteps)
  };
}
