import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

type LocalizedText = Partial<Record<SupportedLanguage, string>>;

export type GlossaryEntry = {
  id: string;
  label: LocalizedText;
  explanation: LocalizedText;
  example?: LocalizedText;
};

type GlossaryCopy = {
  label: string;
  exampleLabel: string;
  closeLabel: string;
};

const glossaryCopyMap: Record<SupportedLanguage, GlossaryCopy> = {
  de: {
    label: "Einfach erklärt",
    exampleLabel: "Beispiel",
    closeLabel: "Schließen"
  },
  en: {
    label: "Simple explanation",
    exampleLabel: "Example",
    closeLabel: "Close"
  },
  tr: {
    label: "Basit açıklama",
    exampleLabel: "Örnek",
    closeLabel: "Kapat"
  },
  uk: {
    label: "Просте пояснення",
    exampleLabel: "Приклад",
    closeLabel: "Закрити"
  },
  es: {
    label: "Explicación simple",
    exampleLabel: "Ejemplo",
    closeLabel: "Cerrar"
  }
};

const glossaryEntries: Record<string, GlossaryEntry> = {
  bedarfsgemeinschaft: {
    id: "bedarfsgemeinschaft",
    label: {
      de: "Bedarfsgemeinschaft",
      en: "Benefit household",
      tr: "İhtiyaç topluluğu",
      uk: "Домогосподарство для допомоги",
      es: "Unidad de ayuda"
    },
    explanation: {
      de: "Das sind die Menschen, mit denen du zusammenlebst und mit denen euer Geld gemeinsam betrachtet wird. Oft sind das Partner oder Kinder.",
      en: "These are the people you live with whose money is looked at together with yours. Often this means a partner or children.",
      tr: "Bu, birlikte yaşadığın ve parası senin paranla birlikte değerlendirilen kişilerdir. Çoğu zaman partner veya çocuklar olur.",
      uk: "Це люди, з якими ти живеш і чиї гроші разом із твоїми дивляться як на спільні. Часто це партнер або діти.",
      es: "Son las personas con las que vives y cuyo dinero se mira junto con el tuyo. Muchas veces es la pareja o los hijos."
    },
    example: {
      de: "Wenn du mit deinem Partner und eurem Kind zusammenwohnst, zählt ihr oft zusammen.",
      en: "If you live with your partner and your child, you are often counted together.",
      tr: "Partnerin ve çocuğunla birlikte yaşıyorsan, çoğu zaman birlikte değerlendirilirsiniz.",
      uk: "Якщо ти живеш із партнером і дитиною, вас часто рахують разом.",
      es: "Si vives con tu pareja y tu hijo, muchas veces os cuentan juntos."
    }
  },
  bruttoeinkommen: {
    id: "bruttoeinkommen",
    label: {
      de: "Bruttoeinkommen",
      en: "Gross income",
      tr: "Brüt gelir",
      uk: "Дохід до відрахувань",
      es: "Ingreso bruto"
    },
    explanation: {
      de: "Das ist dein Einkommen, bevor Steuern und Versicherungen abgezogen werden.",
      en: "This is your income before taxes and insurance are taken away.",
      tr: "Bu, vergiler ve sigortalar kesilmeden önceki gelirindir.",
      uk: "Це твій дохід до того, як віднімуть податки та страхування.",
      es: "Es tu ingreso antes de que te quiten impuestos y seguros."
    }
  },
  nettoeinkommen: {
    id: "nettoeinkommen",
    label: {
      de: "Nettoeinkommen",
      en: "Net income",
      tr: "Net gelir",
      uk: "Чистий дохід",
      es: "Ingreso neto"
    },
    explanation: {
      de: "Das ist das Geld, das nach Abzügen wirklich auf deinem Konto ankommt.",
      en: "This is the money that really reaches your bank account after deductions.",
      tr: "Bu, kesintilerden sonra gerçekten hesabına gelen paradır.",
      uk: "Це гроші, які після відрахувань справді приходять на твій рахунок.",
      es: "Es el dinero que de verdad llega a tu cuenta después de los descuentos."
    }
  },
  warmmiete: {
    id: "warmmiete",
    label: {
      de: "Warmmiete",
      en: "Warm rent",
      tr: "Toplam kira",
      uk: "Повна оренда",
      es: "Alquiler total"
    },
    explanation: {
      de: "Warmmiete ist die Miete zusammen mit Nebenkosten und meistens auch Heizung. Also alles zusammen, was du im Monat für die Wohnung zahlst.",
      en: "Warm rent means the rent together with extra housing costs and usually heating. It is the full amount you pay each month for the home.",
      tr: "Toplam kira, kiranın yan giderler ve çoğu zaman ısınma ile birlikte olan halidir. Yani ev için ayda ödediğin toplam tutardır.",
      uk: "Повна оренда - це оренда разом із додатковими витратами і часто ще з опаленням. Тобто вся сума, яку ти платиш за житло щомісяця.",
      es: "El alquiler total es el alquiler junto con los gastos extra y normalmente también la calefacción. Es todo lo que pagas al mes por la vivienda."
    },
    example: {
      de: "Wenn die Kaltmiete 700 Euro ist und Nebenkosten plus Heizung 150 Euro sind, ist die Warmmiete 850 Euro.",
      en: "If the cold rent is 700 euros and extra costs plus heating are 150 euros, the warm rent is 850 euros.",
      tr: "Çıplak kira 700 euro ve yan giderler ile ısınma 150 euroysa toplam kira 850 eurodur.",
      uk: "Якщо оренда без доплат 700 євро, а додаткові витрати та опалення 150 євро, то повна оренда 850 євро.",
      es: "Si el alquiler base es 700 euros y los gastos más la calefacción son 150 euros, el alquiler total es 850 euros."
    }
  },
  nebenkosten: {
    id: "nebenkosten",
    label: {
      de: "Nebenkosten",
      en: "Extra housing costs",
      tr: "Yan giderler",
      uk: "Додаткові витрати",
      es: "Gastos adicionales"
    },
    explanation: {
      de: "Das sind Kosten rund um die Wohnung, zum Beispiel Wasser, Hausreinigung oder Müll. Sie kommen zur Miete dazu.",
      en: "These are costs around your home, for example water, cleaning of the building or rubbish. They are added to the rent.",
      tr: "Bunlar evle ilgili ek masraflardır. Örneğin su, bina temizliği veya çöp. Kiraya eklenir.",
      uk: "Це додаткові витрати на житло, наприклад вода, прибирання будинку або сміття. Вони додаються до оренди.",
      es: "Son gastos extra de la vivienda, por ejemplo agua, limpieza del edificio o basura. Se suman al alquiler."
    }
  },
  aufenthaltstitel: {
    id: "aufenthaltstitel",
    label: {
      de: "Aufenthaltstitel",
      en: "Residence permit",
      tr: "Oturum izni",
      uk: "Дозвіл на проживання",
      es: "Permiso de residencia"
    },
    explanation: {
      de: "Das ist das offizielle Dokument, das zeigt, dass du in Deutschland bleiben oder hier leben darfst.",
      en: "This is the official document that shows you are allowed to stay or live in Germany.",
      tr: "Bu, Almanya'da kalmana veya burada yaşamana izin verildiğini gösteren resmi belgedir.",
      uk: "Це офіційний документ, який показує, що ти можеш залишатися або жити в Німеччині.",
      es: "Es el documento oficial que muestra que puedes quedarte o vivir en Alemania."
    }
  },
  steuer_id: {
    id: "steuer_id",
    label: {
      de: "Steuer-ID",
      en: "Tax ID",
      tr: "Vergi numarası",
      uk: "Податковий номер",
      es: "Identificación fiscal"
    },
    explanation: {
      de: "Das ist deine persönliche Nummer für Steuern. Sie bleibt meistens immer gleich.",
      en: "This is your personal number for taxes. It usually stays the same.",
      tr: "Bu, vergiler için kişisel numarandır. Genelde hep aynı kalır.",
      uk: "Це твій особистий номер для податків. Зазвичай він не змінюється.",
      es: "Es tu número personal para impuestos. Normalmente siempre es el mismo."
    }
  },
  meldebescheinigung: {
    id: "meldebescheinigung",
    label: {
      de: "Meldebescheinigung",
      en: "Registration certificate",
      tr: "İkamet belgesi",
      uk: "Довідка про реєстрацію",
      es: "Certificado de empadronamiento"
    },
    explanation: {
      de: "Das ist ein Papier vom Bürgeramt. Es zeigt, unter welcher Adresse du gemeldet bist.",
      en: "This is a paper from the citizen office. It shows the address where you are officially registered.",
      tr: "Bu, vatandaşlık ofisinden gelen bir belgedir. Hangi adreste resmi kayıtlı olduğunu gösterir.",
      uk: "Це документ від міського офісу. Він показує, за якою адресою ти офіційно зареєстрований.",
      es: "Es un documento de la oficina ciudadana. Muestra en qué dirección estás registrado oficialmente."
    }
  },
  einkommensnachweis: {
    id: "einkommensnachweis",
    label: {
      de: "Einkommensnachweis",
      en: "Proof of income",
      tr: "Gelir belgesi",
      uk: "Підтвердження доходу",
      es: "Justificante de ingresos"
    },
    explanation: {
      de: "Das ist ein Dokument, das zeigt, wie viel Geld du bekommst. Das kann zum Beispiel ein Lohnzettel sein.",
      en: "This is a document that shows how much money you receive. For example, it can be a payslip.",
      tr: "Bu, ne kadar para aldığını gösteren belgedir. Örneğin maaş bordrosu olabilir.",
      uk: "Це документ, який показує, скільки грошей ти отримуєш. Наприклад, це може бути розрахунковий лист.",
      es: "Es un documento que muestra cuánto dinero recibes. Por ejemplo, puede ser una nómina."
    }
  },
  sozialversicherungsnummer: {
    id: "sozialversicherungsnummer",
    label: {
      de: "Sozialversicherungsnummer",
      en: "Social insurance number",
      tr: "Sosyal sigorta numarası",
      uk: "Номер соціального страхування",
      es: "Número de seguridad social"
    },
    explanation: {
      de: "Das ist deine persönliche Nummer für die Sozialversicherung, also zum Beispiel für Rente oder Arbeit.",
      en: "This is your personal number for social insurance, for example for pension or work records.",
      tr: "Bu, sosyal sigorta için kişisel numarandır. Örneğin emeklilik veya çalışma kayıtları için kullanılır.",
      uk: "Це твій особистий номер для соціального страхування, наприклад для пенсії або даних про роботу.",
      es: "Es tu número personal para la seguridad social, por ejemplo para la pensión o los datos de trabajo."
    }
  },
  haushaltsmitglieder: {
    id: "haushaltsmitglieder",
    label: {
      de: "Haushaltsmitglieder",
      en: "Household members",
      tr: "Hane üyeleri",
      uk: "Члени домогосподарства",
      es: "Miembros del hogar"
    },
    explanation: {
      de: "Das sind alle Menschen, die mit dir in derselben Wohnung leben.",
      en: "These are all the people who live with you in the same home.",
      tr: "Bunlar seninle aynı evde yaşayan tüm kişilerdir.",
      uk: "Це всі люди, які живуть з тобою в одному житлі.",
      es: "Son todas las personas que viven contigo en la misma vivienda."
    }
  },
  familienstand: {
    id: "familienstand",
    label: {
      de: "Familienstand",
      en: "Family status",
      tr: "Medeni durum",
      uk: "Сімейний стан",
      es: "Estado civil"
    },
    explanation: {
      de: "Damit ist gemeint, ob du ledig, verheiratet, getrennt oder in einer Partnerschaft bist.",
      en: "This means whether you are single, married, separated or in a partnership.",
      tr: "Bu, bekar, evli, ayrı yaşayan ya da partnerlik içinde olup olmadığın anlamına gelir.",
      uk: "Це означає, чи ти неодружений, одружений, живеш окремо або в партнерстві.",
      es: "Esto significa si eres soltero, casado, separado o si estás en pareja."
    }
  }
};

export function getGlossaryCopy(locale: string | null | undefined) {
  return glossaryCopyMap[normalizePreferredLanguage(locale)];
}

export function getGlossaryEntry(id: string, locale: string | null | undefined) {
  const entry = glossaryEntries[id];
  if (!entry) {
    return null;
  }

  const normalized = normalizePreferredLanguage(locale);

  return {
    id: entry.id,
    label: entry.label[normalized] ?? entry.label.en ?? entry.label.de ?? id,
    explanation: entry.explanation[normalized] ?? entry.explanation.en ?? entry.explanation.de ?? "",
    example: entry.example?.[normalized] ?? entry.example?.en ?? entry.example?.de ?? null
  };
}

export function hasGlossaryEntry(id: string) {
  return Boolean(glossaryEntries[id]);
}

export function parseExplainableText(value: string) {
  const result: Array<
    | { type: "text"; value: string }
    | { type: "term"; termId: string; label: string }
  > = [];

  const matcher = /\{\{([a-z0-9_-]+)\|([^}]+)\}\}/gi;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = matcher.exec(value)) !== null) {
    if (match.index > lastIndex) {
      result.push({ type: "text", value: value.slice(lastIndex, match.index) });
    }

    result.push({
      type: "term",
      termId: match[1],
      label: match[2]
    });

    lastIndex = matcher.lastIndex;
  }

  if (lastIndex < value.length) {
    result.push({ type: "text", value: value.slice(lastIndex) });
  }

  return result;
}

export function stripExplainableText(value: string) {
  return value.replace(/\{\{([a-z0-9_-]+)\|([^}]+)\}\}/gi, "$2");
}
