import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import { processProcedures, type ProcessProcedure } from "@/lib/processes-ui";

type LocalizedDetailText = Partial<Record<SupportedLanguage, string>>;

type ProcessDetail = {
  summary: LocalizedDetailText;
  forWho: LocalizedDetailText[];
  notForWho?: LocalizedDetailText[];
  requirements: LocalizedDetailText[];
  needs: LocalizedDetailText[];
};

type ProcessDetailCopy = {
  backLabel: string;
  forWhoTitle: string;
  requirementsTitle: string;
  needsTitle: string;
  goodFitTitle: string;
  notIdealTitle: string;
  startCta: string;
  startHint: string;
  detailBadge: string;
};

function resolveText(value: LocalizedDetailText, locale: string | null | undefined) {
  const normalized = normalizePreferredLanguage(locale);
  return value[normalized] ?? value.en ?? value.de ?? "";
}

const detailCopyMap: Record<SupportedLanguage, ProcessDetailCopy> = {
  de: {
    backLabel: "Zurück zu Anträge & Vorgänge",
    forWhoTitle: "Für wen ist das?",
    requirementsTitle: "Wichtige Voraussetzungen",
    needsTitle: "Was du ungefähr brauchst",
    goodFitTitle: "Passt oft, wenn ...",
    notIdealTitle: "Passt oft eher nicht, wenn ...",
    startCta: "Vorgang starten",
    startHint: "BureauCare führt dich jetzt Schritt für Schritt durch die ersten Angaben.",
    detailBadge: "Vorgang im Überblick"
  },
  en: {
    backLabel: "Back to applications & processes",
    forWhoTitle: "Who is this for?",
    requirementsTitle: "Important requirements",
    needsTitle: "What you will roughly need",
    goodFitTitle: "Usually a good fit if ...",
    notIdealTitle: "Usually not the right fit if ...",
    startCta: "Start process",
    startHint: "BureauCare now guides you through the first details step by step.",
    detailBadge: "Process overview"
  },
  tr: {
    backLabel: "Başvurulara geri dön",
    forWhoTitle: "Bu kimler için?",
    requirementsTitle: "Önemli şartlar",
    needsTitle: "Kabaca ne gerekir?",
    goodFitTitle: "Genelde uygundur, eğer ...",
    notIdealTitle: "Genelde uygun değildir, eğer ...",
    startCta: "İşleme başla",
    startHint: "BureauCare şimdi seni ilk bilgiler için adım adım yönlendirir.",
    detailBadge: "İşlem özeti"
  },
  uk: {
    backLabel: "Назад до заяв і процесів",
    forWhoTitle: "Для кого це?",
    requirementsTitle: "Важливі умови",
    needsTitle: "Що приблизно знадобиться",
    goodFitTitle: "Часто підходить, якщо ...",
    notIdealTitle: "Часто не підходить, якщо ...",
    startCta: "Почати процес",
    startHint: "BureauCare зараз покроково веде вас через перші дані.",
    detailBadge: "Огляд процесу"
  },
  es: {
    backLabel: "Volver a trámites y gestiones",
    forWhoTitle: "¿Para quién es esto?",
    requirementsTitle: "Requisitos importantes",
    needsTitle: "Qué vas a necesitar más o menos",
    goodFitTitle: "Suele encajar si ...",
    notIdealTitle: "Suele no encajar si ...",
    startCta: "Iniciar trámite",
    startHint: "BureauCare te guía ahora paso a paso por los primeros datos.",
    detailBadge: "Resumen del trámite"
  }
};

const processDetailMap: Record<string, ProcessDetail> = {
  wohngeld: {
    summary: {
      de: "Wohngeld ist Geld vom Staat, wenn dein Einkommen eher niedrig ist und du Hilfe bei der Miete oder bei Wohnkosten brauchst.",
      en: "Housing benefit is money from the state when your income is on the lower side and you need help with rent or housing costs."
    },
    forWho: [
      { de: "Du zahlst Miete oder trägst eigene Wohnkosten.", en: "You pay rent or have your own housing costs." },
      { de: "Dein Einkommen reicht nur knapp für den Alltag.", en: "Your income only just covers everyday life." },
      { de: "Du wohnst in Deutschland und suchst Hilfe beim Wohnen.", en: "You live in Germany and need help with housing." }
    ],
    notForWho: [
      { de: "Du bekommst schon Bürgergeld oder eine ähnliche Grundsicherung für Wohnen und Leben.", en: "You already receive basic income support that already covers living costs." }
    ],
    requirements: [
      { de: "Du hast Wohnkosten, die du selbst tragen musst.", en: "You have housing costs that you need to cover yourself." },
      { de: "Dein Einkommen liegt nicht zu hoch.", en: "Your income is not too high." },
      { de: "Dein Aufenthalt und dein Wohnsitz sind geklärt.", en: "Your residence status and registered address are in order." }
    ],
    needs: [
      { de: "Ausweis oder Pass", en: "ID card or passport" },
      { de: "Mietvertrag oder Nachweis zu deinen Wohnkosten", en: "Rental contract or proof of housing costs" },
      { de: "Einkommensnachweise", en: "Proof of income" },
      { de: "Infos zu den Menschen, die mit dir wohnen", en: "Information about the people who live with you" }
    ]
  },
  buergergeld: {
    summary: {
      de: "Bürgergeld ist Hilfe vom Staat, wenn du gerade zu wenig Geld zum Leben hast und Unterstützung für Alltag, Miete und Grundkosten brauchst.",
      en: "Basic income support helps when you do not currently have enough money for everyday life, rent and basic costs."
    },
    forWho: [
      { de: "Du hast im Moment kein oder nur wenig Einkommen.", en: "You currently have no income or only a small income." },
      { de: "Du brauchst Hilfe für Miete, Essen und andere Grundkosten.", en: "You need help with rent, food and other basic costs." },
      { de: "Du lebst in Deutschland und kannst gerade nicht alles selbst zahlen.", en: "You live in Germany and cannot currently cover everything yourself." }
    ],
    notForWho: [
      { de: "Dein Einkommen oder Vermögen liegt wahrscheinlich deutlich über den üblichen Grenzen.", en: "Your income or savings are probably clearly above the usual limits." }
    ],
    requirements: [
      { de: "Du brauchst wirklich finanzielle Unterstützung.", en: "You really need financial support." },
      { de: "Dein Aufenthalt und dein Wohnsitz sind geklärt.", en: "Your residence status and address are in order." },
      { de: "Du gibst an, was du verdienst und was du an Geld oder Vermögen hast.", en: "You can state your income and savings." }
    ],
    needs: [
      { de: "Ausweis oder Pass", en: "ID card or passport" },
      { de: "Kontoauszüge", en: "Bank statements" },
      { de: "Mietvertrag und Infos zu Wohnkosten", en: "Rental contract and information about housing costs" },
      { de: "Nachweise zu Einkommen, Arbeit oder Arbeitslosigkeit", en: "Proof of income, work or unemployment" }
    ]
  },
  arbeitslosmeldung: {
    summary: {
      de: "Mit der Arbeitslosmeldung sagst du der Arbeitsagentur früh genug Bescheid, dass du keine Arbeit mehr hast oder bald keine mehr hast.",
      en: "Unemployment registration tells the employment agency in time that you no longer have a job or will soon lose it."
    },
    forWho: [
      { de: "Du verlierst deinen Job oder dein Vertrag endet bald.", en: "You are losing your job or your contract will end soon." },
      { de: "Du willst keine Fristen verpassen.", en: "You do not want to miss any deadlines." },
      { de: "Du brauchst vielleicht später Geld oder Unterstützung bei der Jobsuche.", en: "You may later need money or help finding work." }
    ],
    requirements: [
      { de: "Es gibt eine echte Arbeitslosigkeit oder sie steht kurz bevor.", en: "There is a real unemployment situation or it is about to happen." },
      { de: "Du meldest dich möglichst früh.", en: "You register as early as possible." },
      { de: "Deine persönlichen Daten und dein Arbeitsverhältnis sind nachvollziehbar.", en: "Your personal details and job situation can be shown clearly." }
    ],
    needs: [
      { de: "Ausweis oder Pass", en: "ID card or passport" },
      { de: "Daten zu deinem Arbeitgeber oder Vertrag", en: "Details about your employer or contract" },
      { de: "Kündigung oder Infos zum Vertragsende, wenn vorhanden", en: "Notice letter or contract end details, if you have them" },
      { de: "Kontaktdaten", en: "Contact details" }
    ]
  },
  kindergeld: {
    summary: {
      de: "Kindergeld ist Geld für Eltern oder Familien, damit die Kosten für Kinder im Alltag leichter werden.",
      en: "Child benefit is money for parents or families to make everyday costs for children easier."
    },
    forWho: [
      { de: "Du hast Kinder, für die du verantwortlich bist.", en: "You have children you are responsible for." },
      { de: "Dein Kind lebt bei dir oder du sorgst überwiegend für das Kind.", en: "Your child lives with you or you mainly care for them." },
      { de: "Auch bei Ausbildung oder Studium kann es noch passen.", en: "It can also still fit when a child is in training or studying." }
    ],
    requirements: [
      { de: "Es geht um ein Kind, für das du Anspruch haben könntest.", en: "It is about a child for whom you may have a claim." },
      { de: "Dein Wohnsitz und dein Familienstatus sind nachvollziehbar.", en: "Your residence and family situation can be shown clearly." },
      { de: "Die Familienkasse braucht Grunddaten zum Kind.", en: "The family benefits office needs basic information about the child." }
    ],
    needs: [
      { de: "Ausweis oder Pass", en: "ID card or passport" },
      { de: "Steuer-ID von dir und vom Kind", en: "Tax ID for you and your child" },
      { de: "Geburtsurkunde oder ähnliche Nachweise", en: "Birth certificate or similar proof" },
      { de: "Bei älteren Kindern: Nachweise zu Schule, Ausbildung oder Studium", en: "For older children: proof of school, training or studies" }
    ]
  },
  steuererklaerung: {
    summary: {
      de: "Die Steuererklärung hilft dir, deine Einnahmen und Ausgaben beim Finanzamt anzugeben. Oft bekommst du danach Geld zurück oder du weißt klar, woran du bist.",
      en: "A tax return helps you report your income and expenses to the tax office. Often you get money back afterwards or at least a clear result."
    },
    forWho: [
      { de: "Du arbeitest, hast Einkommen oder besondere Ausgaben gehabt.", en: "You work, have income or had special expenses." },
      { de: "Du willst prüfen, ob du Geld zurückbekommen kannst.", en: "You want to check whether you can get money back." },
      { de: "Du hast Post vom Finanzamt bekommen oder willst deine Steuer ordentlich erledigen.", en: "You got mail from the tax office or want to handle your taxes properly." }
    ],
    requirements: [
      { de: "Du kannst Angaben zu Einkommen und wichtigen Kosten machen.", en: "You can provide information about income and important costs." },
      { de: "Deine Unterlagen sind einigermaßen vollständig.", en: "Your documents are reasonably complete." },
      { de: "Wenn es Fristen gibt, solltest du sie im Blick haben.", en: "If there are deadlines, you should keep an eye on them." }
    ],
    needs: [
      { de: "Steuer-ID", en: "Tax ID" },
      { de: "Lohnsteuerbescheinigung oder ähnliche Einkommensnachweise", en: "Wage tax statement or similar proof of income" },
      { de: "Belege zu wichtigen Ausgaben", en: "Receipts for important expenses" },
      { de: "Bankverbindung", en: "Bank account details" }
    ]
  },
  "bafoeg-antrag": {
    summary: {
      de: "BAföG ist Geld für Studium oder Ausbildung, wenn du Unterstützung brauchst, damit du lernen kannst.",
      en: "Student aid is money for studies or training when you need support so you can focus on learning."
    },
    forWho: [
      { de: "Du machst eine Ausbildung oder studierst.", en: "You are in training or studying." },
      { de: "Dein eigenes Geld und die Unterstützung aus der Familie reichen nicht aus.", en: "Your own money and family support are not enough." },
      { de: "Du willst deinen Alltag während der Ausbildung besser finanzieren.", en: "You want to finance daily life during education more safely." }
    ],
    requirements: [
      { de: "Deine Ausbildung oder dein Studium ist grundsätzlich förderfähig.", en: "Your training or studies are generally eligible." },
      { de: "Dein Einkommen und oft auch das Einkommen deiner Eltern spielen eine Rolle.", en: "Your income and often your parents' income matter." },
      { de: "Du kannst Angaben zu Schule, Hochschule oder Ausbildung machen.", en: "You can provide details about your school, college or training." }
    ],
    needs: [
      { de: "Ausweis oder Pass", en: "ID card or passport" },
      { de: "Immatrikulations- oder Schulbescheinigung", en: "Enrollment or school certificate" },
      { de: "Infos zu Einkommen und Vermögen", en: "Information about income and savings" },
      { de: "Bankverbindung", en: "Bank account details" }
    ]
  },
  "krankenkasse-wechsel": {
    summary: {
      de: "Dieser Vorgang hilft dir, deine Krankenkasse neu zu ordnen: wenn du dich anmelden musst, wenn sich etwas geändert hat oder wenn du wechseln willst.",
      en: "This process helps you sort out your health insurance: when you need to join, when something changed, or when you want to switch."
    },
    forWho: [
      { de: "Du brauchst erstmals eine Krankenkasse oder willst wechseln.", en: "You need health insurance for the first time or want to switch." },
      { de: "Dein Job, dein Studium oder deine Familiensituation hat sich geändert.", en: "Your job, studies or family situation changed." },
      { de: "Du willst sicher sein, dass du richtig versichert bist.", en: "You want to be sure you are insured correctly." }
    ],
    requirements: [
      { de: "Es gibt einen Grund für Anmeldung oder Wechsel.", en: "There is a reason for joining or switching." },
      { de: "Deine persönlichen Daten und dein Status sind klar.", en: "Your personal details and status are clear." },
      { de: "Du kannst sagen, ab wann die Änderung gelten soll.", en: "You can say from when the change should apply." }
    ],
    needs: [
      { de: "Ausweis oder Pass", en: "ID card or passport" },
      { de: "Versicherungsdaten, wenn du schon versichert bist", en: "Insurance details, if you are already insured" },
      { de: "Infos zu Arbeit, Studium oder Familie", en: "Information about work, studies or family" },
      { de: "Adresse und Kontaktdaten", en: "Address and contact details" }
    ]
  },
  gewerbe: {
    summary: {
      de: "Mit einer Gewerbeanmeldung sagst du dem Amt, dass du selbstständig arbeiten oder ein kleines Unternehmen starten willst.",
      en: "Business registration tells the authorities that you want to work for yourself or start a small business."
    },
    forWho: [
      { de: "Du willst mit einer eigenen Tätigkeit Geld verdienen.", en: "You want to earn money with your own activity." },
      { de: "Du planst ein Gewerbe, einen Shop oder eine Dienstleistung.", en: "You are planning a business, shop or service." },
      { de: "Du möchtest offiziell und sauber starten.", en: "You want to start officially and properly." }
    ],
    requirements: [
      { de: "Du weißt ungefähr, was dein Geschäft machen soll.", en: "You roughly know what your business will do." },
      { de: "Deine Adresse und deine persönlichen Daten sind klar.", en: "Your address and personal details are clear." },
      { de: "Für manche Berufe brauchst du später noch extra Erlaubnisse.", en: "Some professions need extra permits later on." }
    ],
    needs: [
      { de: "Ausweis oder Pass", en: "ID card or passport" },
      { de: "Kurze Beschreibung deiner Tätigkeit", en: "A short description of your business activity" },
      { de: "Adresse des Betriebs oder deiner Tätigkeit", en: "Address of the business or your activity" },
      { de: "Je nach Beruf: zusätzliche Nachweise", en: "Depending on the profession: extra proof" }
    ]
  },
  ummeldung: {
    summary: {
      de: "Bei der Ummeldung teilst du dem Bürgeramt mit, dass du jetzt unter einer neuen Adresse wohnst.",
      en: "Address registration tells the citizen office that you now live at a new address."
    },
    forWho: [
      { de: "Du bist umgezogen oder ziehst gerade um.", en: "You have moved or are moving now." },
      { de: "Du wohnst jetzt an einer neuen Adresse in Deutschland.", en: "You now live at a new address in Germany." },
      { de: "Du willst deine Meldedaten aktuell halten.", en: "You want your registered address to be up to date." }
    ],
    requirements: [
      { de: "Du wohnst wirklich schon an der neuen Adresse oder ziehst jetzt dorthin.", en: "You already live at the new address or are moving there now." },
      { de: "Du meldest dich rechtzeitig beim Bürgeramt.", en: "You register with the citizen office in time." },
      { de: "Die neue Wohnung kann bestätigt werden.", en: "The new home can be confirmed." }
    ],
    needs: [
      { de: "Ausweis oder Pass", en: "ID card or passport" },
      { de: "Neue Adresse", en: "New address" },
      { de: "Wohnungsgeberbestätigung oder ähnlicher Nachweis", en: "Landlord confirmation or similar proof" },
      { de: "Für Familien: Daten der mitziehenden Personen", en: "For families: details of the people moving with you" }
    ]
  },
  visum: {
    summary: {
      de: "Dieser Vorgang ist für Aufenthalt, Verlängerung oder Visum. Er hilft dir, deinen Status in Deutschland zu klären oder zu verlängern.",
      en: "This process is for visas, residence permits or extensions. It helps you clarify or extend your status in Germany."
    },
    forWho: [
      { de: "Du brauchst ein Visum oder einen Aufenthaltstitel.", en: "You need a visa or a residence permit." },
      { de: "Dein jetziger Status läuft bald ab oder passt nicht mehr.", en: "Your current status will expire soon or no longer fits your situation." },
      { de: "Du musst mit der Ausländerbehörde etwas neu beantragen oder verlängern.", en: "You need to apply for something new or extend it with the immigration office." }
    ],
    requirements: [
      { de: "Dein persönlicher Aufenthaltsgrund muss klar sein.", en: "The reason for your stay should be clear." },
      { de: "Du brauchst oft einen gültigen Pass und Nachweise zu deiner Situation.", en: "You often need a valid passport and proof of your situation." },
      { de: "Fristen und Termine sind hier besonders wichtig.", en: "Deadlines and appointments are especially important here." }
    ],
    needs: [
      { de: "Reisepass", en: "Passport" },
      { de: "Aktuelle Aufenthaltsdokumente, wenn du schon welche hast", en: "Current residence documents, if you already have them" },
      { de: "Nachweise zu Arbeit, Studium, Familie oder Wohnung", en: "Proof of work, studies, family or housing" },
      { de: "Passfoto und Kontaktdaten", en: "Passport photo and contact details" }
    ]
  }
};

export function getProcessCopy(locale: string | null | undefined) {
  return detailCopyMap[normalizePreferredLanguage(locale)];
}

export function getProcedureBySlug(slug: string) {
  return processProcedures.find((procedure) => procedure.id === slug) ?? null;
}

export function getProcedureHref(procedureId: string) {
  return `/app/processes/${procedureId}`;
}

export function getProcessDetail(procedureId: string) {
  return processDetailMap[procedureId] ?? null;
}

export function getLocalizedDetailText(value: LocalizedDetailText, locale: string | null | undefined) {
  return resolveText(value, locale);
}

export function getProcedureSummary(procedureId: string, locale: string | null | undefined) {
  const detail = getProcessDetail(procedureId);
  return detail ? resolveText(detail.summary, locale) : "";
}

export function getProcessSectionItems(
  procedureId: string,
  section: "forWho" | "notForWho" | "requirements" | "needs",
  locale: string | null | undefined
) {
  const detail = getProcessDetail(procedureId);
  if (!detail) return [];
  return (detail[section] ?? []).map((item) => resolveText(item, locale)).filter(Boolean);
}

export function getProceduresWithDetails() {
  return processProcedures.filter((procedure) => Boolean(processDetailMap[procedure.id]));
}

export function getRelatedAuthorities(procedure: ProcessProcedure) {
  return procedure.authorityIds;
}
