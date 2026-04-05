import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

export type MoneyBackFinderCopy = {
  navLabel: string;
  homeBadge: string;
  homeTitle: string;
  homeText: string;
  homeAction: string;
  badge: string;
  title: string;
  intro: string;
  disclaimer: string;
  categoryTitle: string;
  scenarioTitle: string;
  detailsTitle: string;
  evidenceTitle: string;
  resultTitle: string;
  missingTitle: string;
  nextStepsTitle: string;
  amountTitle: string;
  explanationTitle: string;
  evaluateLabel: string;
  resetLabel: string;
  uploadEvidenceLabel: string;
  reviewProcessesLabel: string;
  categories: {
    travel: string;
    contracts: string;
  };
  categoryTexts: {
    travel: string;
    contracts: string;
  };
  fields: {
    issueDate: string;
    providerName: string;
    bookedService: string;
    whatHappened: string;
    amountPaid: string;
    delayHours: string;
    extraCosts: string;
    serviceReceived: string;
    cancellationSent: string;
  };
  placeholders: {
    providerName: string;
    bookedService: string;
    whatHappened: string;
    amountPaid: string;
    delayHours: string;
    extraCosts: string;
  };
  issues: {
    flight_delay: string;
    flight_cancellation: string;
    missed_connection: string;
    baggage_problem: string;
    unused_travel_service: string;
    travel_disruption: string;
    unclear_charge: string;
    double_payment: string;
    cancellation_problem: string;
    subscription_continues: string;
    service_not_provided: string;
    service_partly_provided: string;
  };
  serviceReceivedOptions: {
    full: string;
    partly: string;
    none: string;
  };
  booleanOptions: {
    yes: string;
    no: string;
    unknown: string;
  };
  evidence: {
    booking_or_contract: string;
    payment_proof: string;
    communication: string;
    cancellation_proof: string;
  };
  assessmentLabels: {
    very_likely: string;
    likely: string;
    unclear: string;
    rather_unlikely: string;
  };
  shortResults: {
    refund_possible: string;
    compensation_possible: string;
    more_info_needed: string;
    unlikely: string;
  };
  emptyResult: string;
};

const de: MoneyBackFinderCopy = {
  navLabel: "Geld zurück",
  homeBadge: "Neues Modul",
  homeTitle: "Geld-zurück-Finder",
  homeText: "Prüfe ruhig und klar, ob bei Reisen, Verträgen oder Abbuchungen Geld zurück möglich sein könnte.",
  homeAction: "Anspruch prüfen",
  badge: "Geld-zurück-Finder",
  title: "Prüfe, ob dir Geld zurück zustehen könnte",
  intro: "BureauCare schaut auf typische Störungen, Abbuchungen und Leistungsprobleme und gibt dir eine vorsichtige erste Einschätzung.",
  disclaimer: "Die Einschätzung hilft dir beim Verstehen. Sie ersetzt keine verbindliche Rechtsberatung.",
  categoryTitle: "Worum geht es?",
  scenarioTitle: "Was ist passiert?",
  detailsTitle: "Die wichtigsten Angaben",
  evidenceTitle: "Was kannst du schon belegen?",
  resultTitle: "Erste Einschätzung",
  missingTitle: "Was noch fehlt",
  nextStepsTitle: "Nächster Schritt",
  amountTitle: "Mögliche Summe",
  explanationTitle: "Warum das möglich sein könnte",
  evaluateLabel: "Einschätzung prüfen",
  resetLabel: "Zurücksetzen",
  uploadEvidenceLabel: "Belege hochladen",
  reviewProcessesLabel: "Passende Vorgänge ansehen",
  categories: {
    travel: "Flüge & Reisen",
    contracts: "Verträge & Abos"
  },
  categoryTexts: {
    travel: "Zum Beispiel bei Verspätung, Ausfall, Anschluss verpasst oder Gepäckproblemen.",
    contracts: "Zum Beispiel bei unklaren Abbuchungen, Kündigungsproblemen oder nicht erbrachter Leistung."
  },
  fields: {
    issueDate: "Datum des Vorfalls",
    providerName: "Anbieter oder Airline",
    bookedService: "Gebuchte Leistung",
    whatHappened: "Kurz erklärt, was passiert ist",
    amountPaid: "Gezahlter Betrag in Euro",
    delayHours: "Verspätung in Stunden",
    extraCosts: "Zusätzliche Kosten in Euro",
    serviceReceived: "Wie viel Leistung hast du bekommen?",
    cancellationSent: "Hast du schon gekündigt oder widersprochen?"
  },
  placeholders: {
    providerName: "Zum Beispiel Lufthansa oder Fitnessstudio",
    bookedService: "Zum Beispiel Flug Berlin-Barcelona oder Internetvertrag",
    whatHappened: "Zum Beispiel Flug kam 4 Stunden zu spät oder Abo lief trotz Kündigungswunsch weiter",
    amountPaid: "Zum Beispiel 89.90",
    delayHours: "Zum Beispiel 4",
    extraCosts: "Zum Beispiel 42.50"
  },
  issues: {
    flight_delay: "Flugverspätung",
    flight_cancellation: "Flugausfall",
    missed_connection: "Anschlussflug verpasst",
    baggage_problem: "Gepäck verspätet oder verloren",
    unused_travel_service: "Gebuchte Reiseleistung nicht genutzt",
    travel_disruption: "Allgemeine Reisestörung",
    unclear_charge: "Unklare Abbuchung",
    double_payment: "Doppelte Zahlung",
    cancellation_problem: "Kündigung schwierig oder unklar",
    subscription_continues: "Abo läuft weiter",
    service_not_provided: "Leistung nicht erbracht",
    service_partly_provided: "Leistung nur teilweise erbracht"
  },
  serviceReceivedOptions: {
    full: "Vollständig",
    partly: "Teilweise",
    none: "Gar nicht"
  },
  booleanOptions: {
    yes: "Ja",
    no: "Nein",
    unknown: "Noch unklar"
  },
  evidence: {
    booking_or_contract: "Buchung, Vertrag oder Bestätigung vorhanden",
    payment_proof: "Zahlungsnachweis oder Kontoauszug vorhanden",
    communication: "Schriftverkehr oder Nachricht vorhanden",
    cancellation_proof: "Kündigung oder Widerspruch belegbar"
  },
  assessmentLabels: {
    very_likely: "sehr wahrscheinlich",
    likely: "wahrscheinlich",
    unclear: "unklar",
    rather_unlikely: "eher unwahrscheinlich"
  },
  shortResults: {
    refund_possible: "Du könntest Anspruch auf eine Rückzahlung haben.",
    compensation_possible: "Es gibt Anzeichen für eine mögliche Entschädigung.",
    more_info_needed: "Aktuell reichen die Informationen noch nicht aus.",
    unlikely: "Im Moment ist eher kein klarer Anspruch erkennbar."
  },
  emptyResult: "Wähle zuerst einen Bereich und beschreibe kurz den Fall. Danach bekommst du eine klare erste Einschätzung."
};

const en: MoneyBackFinderCopy = {
  ...de,
  navLabel: "Money back",
  homeBadge: "New module",
  homeTitle: "Money-back finder",
  homeText: "Check calmly and clearly whether money back may be possible for travel, contracts or charges.",
  homeAction: "Check claim",
  badge: "Money-back finder",
  title: "Check whether money might be owed back to you",
  intro: "BureauCare looks at typical disruptions, charges and service problems and gives you a careful first assessment.",
  disclaimer: "This assessment helps you understand the situation. It does not replace professional legal advice.",
  categoryTitle: "What is this about?",
  scenarioTitle: "What happened?",
  detailsTitle: "The key details",
  evidenceTitle: "What can you already prove?",
  resultTitle: "First assessment",
  missingTitle: "What is still missing",
  nextStepsTitle: "Next step",
  amountTitle: "Possible amount",
  explanationTitle: "Why this might be possible",
  evaluateLabel: "Check assessment",
  resetLabel: "Reset",
  uploadEvidenceLabel: "Upload evidence",
  reviewProcessesLabel: "See matching processes",
  categories: {
    travel: "Flights & travel",
    contracts: "Contracts & subscriptions"
  },
  categoryTexts: {
    travel: "For example delays, cancellations, missed connections or baggage problems.",
    contracts: "For example unclear charges, cancellation problems or services that were not provided."
  },
  fields: {
    issueDate: "Date of the problem",
    providerName: "Provider or airline",
    bookedService: "Booked service",
    whatHappened: "Briefly explain what happened",
    amountPaid: "Amount paid in euros",
    delayHours: "Delay in hours",
    extraCosts: "Extra costs in euros",
    serviceReceived: "How much service did you receive?",
    cancellationSent: "Have you already cancelled or objected?"
  },
  placeholders: {
    providerName: "For example Lufthansa or a gym",
    bookedService: "For example flight Berlin-Barcelona or internet contract",
    whatHappened: "For example flight arrived 4 hours late or the subscription kept running",
    amountPaid: "For example 89.90",
    delayHours: "For example 4",
    extraCosts: "For example 42.50"
  },
  issues: {
    flight_delay: "Flight delay",
    flight_cancellation: "Flight cancellation",
    missed_connection: "Missed connection",
    baggage_problem: "Baggage delayed or lost",
    unused_travel_service: "Booked travel service not used",
    travel_disruption: "General travel disruption",
    unclear_charge: "Unclear charge",
    double_payment: "Double payment",
    cancellation_problem: "Cancellation difficult or unclear",
    subscription_continues: "Subscription keeps running",
    service_not_provided: "Service not provided",
    service_partly_provided: "Service only partly provided"
  },
  serviceReceivedOptions: {
    full: "Fully",
    partly: "Partly",
    none: "Not at all"
  },
  booleanOptions: {
    yes: "Yes",
    no: "No",
    unknown: "Not clear yet"
  },
  evidence: {
    booking_or_contract: "Booking, contract or confirmation available",
    payment_proof: "Payment proof or bank statement available",
    communication: "Written messages or communication available",
    cancellation_proof: "Cancellation or objection can be proven"
  },
  assessmentLabels: {
    very_likely: "very likely",
    likely: "likely",
    unclear: "unclear",
    rather_unlikely: "rather unlikely"
  },
  shortResults: {
    refund_possible: "You may have a claim for a refund.",
    compensation_possible: "There are signs of possible compensation.",
    more_info_needed: "At the moment the information is not enough yet.",
    unlikely: "Right now there is rather no clear claim visible."
  },
  emptyResult: "First choose an area and describe the case briefly. Then you will get a clear first assessment."
};

const copyMap: Record<SupportedLanguage, MoneyBackFinderCopy> = {
  de,
  en,
  tr: en,
  uk: en,
  es: en,
  zh: en
};

export function getMoneyBackFinderCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
}
