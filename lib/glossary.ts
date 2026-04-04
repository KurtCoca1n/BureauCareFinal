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

const glossaryCopyMap: Partial<Record<SupportedLanguage, GlossaryCopy>> = {
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
    label: "Basit a莽谋klama",
    exampleLabel: "Örnek",
    closeLabel: "Kapat"
  },
  uk: {
    label: "袩褉芯褋褌械 锌芯褟褋薪械薪薪褟",
    exampleLabel: "袩褉懈泻谢邪写",
    closeLabel: "袟邪泻褉懈褌懈"
  },
  es: {
    label: "Explicaci贸n simple",
    exampleLabel: "Ejemplo",
    closeLabel: "Cerrar"
  },
  zh: {
    label: "简单说明",
    exampleLabel: "例子",
    closeLabel: "关闭"
  }
};

const defaultGlossaryCopy = glossaryCopyMap.en ?? glossaryCopyMap.de!;

const glossaryEntries: Record<string, GlossaryEntry> = {
  bedarfsgemeinschaft: {
    id: "bedarfsgemeinschaft",
    label: {
      de: "Bedarfsgemeinschaft",
      en: "Benefit household",
      tr: "陌htiya莽 toplulu臒u",
      uk: "袛芯屑芯谐芯褋锌芯写邪褉褋褌胁芯 写谢褟 写芯锌芯屑芯谐懈",
      es: "Unidad de ayuda"
    },
    explanation: {
      de: "Das sind die Menschen, mit denen du zusammenlebst und mit denen euer Geld gemeinsam betrachtet wird. Oft sind das Partner oder Kinder.",
      en: "These are the people you live with whose money is looked at together with yours. Often this means a partner or children.",
      tr: "Bu, birlikte ya艧ad谋臒谋n ve paras谋 senin paranla birlikte de臒erlendirilen ki艧ilerdir. 脟o臒u zaman partner veya 莽ocuklar olur.",
      uk: "笑械 谢褞写懈, 蟹 褟泻懈屑懈 褌懈 卸懈胁械褕 褨 褔懈褩 谐褉芯褕褨 褉邪蟹芯屑 褨蟹 褌胁芯褩屑懈 写懈胁谢褟褌褜褋褟 褟泻 薪邪 褋锌褨谢褜薪褨. 效邪褋褌芯 褑械 锌邪褉褌薪械褉 邪斜芯 写褨褌懈.",
      es: "Son las personas con las que vives y cuyo dinero se mira junto con el tuyo. Muchas veces es la pareja o los hijos."
    },
    example: {
      de: "Wenn du mit deinem Partner und eurem Kind zusammenwohnst, zählt ihr oft zusammen.",
      en: "If you live with your partner and your child, you are often counted together.",
      tr: "Partnerin ve 莽ocu臒unla birlikte ya艧谋yorsan, 莽o臒u zaman birlikte de臒erlendirilirsiniz.",
      uk: "携泻褖芯 褌懈 卸懈胁械褕 褨蟹 锌邪褉褌薪械褉芯屑 褨 写懈褌懈薪芯褞, 胁邪褋 褔邪褋褌芯 褉邪褏褍褞褌褜 褉邪蟹芯屑.",
      es: "Si vives con tu pareja y tu hijo, muchas veces os cuentan juntos."
    }
  },
  bruttoeinkommen: {
    id: "bruttoeinkommen",
    label: {
      de: "Bruttoeinkommen",
      en: "Gross income",
      tr: "Brüt gelir",
      uk: "袛芯褏褨写 写芯 胁褨写褉邪褏褍胁邪薪褜",
      es: "Ingreso bruto"
    },
    explanation: {
      de: "Das ist dein Einkommen, bevor Steuern und Versicherungen abgezogen werden.",
      en: "This is your income before taxes and insurance are taken away.",
      tr: "Bu, vergiler ve sigortalar kesilmeden önceki gelirindir.",
      uk: "笑械 褌胁褨泄 写芯褏褨写 写芯 褌芯谐芯, 褟泻 胁褨写薪褨屑褍褌褜 锌芯写邪褌泻懈 褌邪 褋褌褉邪褏褍胁邪薪薪褟.",
      es: "Es tu ingreso antes de que te quiten impuestos y seguros."
    }
  },
  nettoeinkommen: {
    id: "nettoeinkommen",
    label: {
      de: "Nettoeinkommen",
      en: "Net income",
      tr: "Net gelir",
      uk: "效懈褋褌懈泄 写芯褏褨写",
      es: "Ingreso neto"
    },
    explanation: {
      de: "Das ist das Geld, das nach Abzügen wirklich auf deinem Konto ankommt.",
      en: "This is the money that really reaches your bank account after deductions.",
      tr: "Bu, kesintilerden sonra ger莽ekten hesab谋na gelen parad谋r.",
      uk: "笑械 谐褉芯褕褨, 褟泻褨 锌褨褋谢褟 胁褨写褉邪褏褍胁邪薪褜 褋锌褉邪胁写褨 锌褉懈褏芯写褟褌褜 薪邪 褌胁褨泄 褉邪褏褍薪芯泻.",
      es: "Es el dinero que de verdad llega a tu cuenta despu茅s de los descuentos."
    }
  },
  warmmiete: {
    id: "warmmiete",
    label: {
      de: "Warmmiete",
      en: "Warm rent",
      tr: "Toplam kira",
      uk: "袩芯胁薪邪 芯褉械薪写邪",
      es: "Alquiler total"
    },
    explanation: {
      de: "Warmmiete ist die Miete zusammen mit Nebenkosten und meistens auch Heizung. Also alles zusammen, was du im Monat für die Wohnung zahlst.",
      en: "Warm rent means the rent together with extra housing costs and usually heating. It is the full amount you pay each month for the home.",
      tr: "Toplam kira, kiran谋n yan giderler ve 莽o臒u zaman 谋s谋nma ile birlikte olan halidir. Yani ev i莽in ayda ödedi臒in toplam tutard谋r.",
      uk: "袩芯胁薪邪 芯褉械薪写邪 - 褑械 芯褉械薪写邪 褉邪蟹芯屑 褨蟹 写芯写邪褌泻芯胁懈屑懈 胁懈褌褉邪褌邪屑懈 褨 褔邪褋褌芯 褖械 蟹 芯锌邪谢械薪薪褟屑. 孝芯斜褌芯 胁褋褟 褋褍屑邪, 褟泻褍 褌懈 锌谢邪褌懈褕 蟹邪 卸懈褌谢芯 褖芯屑褨褋褟褑褟.",
      es: "El alquiler total es el alquiler junto con los gastos extra y normalmente tambi茅n la calefacci贸n. Es todo lo que pagas al mes por la vivienda."
    },
    example: {
      de: "Wenn die Kaltmiete 700 Euro ist und Nebenkosten plus Heizung 150 Euro sind, ist die Warmmiete 850 Euro.",
      en: "If the cold rent is 700 euros and extra costs plus heating are 150 euros, the warm rent is 850 euros.",
      tr: "脟谋plak kira 700 euro ve yan giderler ile 谋s谋nma 150 euroysa toplam kira 850 eurodur.",
      uk: "携泻褖芯 芯褉械薪写邪 斜械蟹 写芯锌谢邪褌 700 褦胁褉芯, 邪 写芯写邪褌泻芯胁褨 胁懈褌褉邪褌懈 褌邪 芯锌邪谢械薪薪褟 150 褦胁褉芯, 褌芯 锌芯胁薪邪 芯褉械薪写邪 850 褦胁褉芯.",
      es: "Si el alquiler base es 700 euros y los gastos m谩s la calefacci贸n son 150 euros, el alquiler total es 850 euros."
    }
  },
  nebenkosten: {
    id: "nebenkosten",
    label: {
      de: "Nebenkosten",
      en: "Extra housing costs",
      tr: "Yan giderler",
      uk: "袛芯写邪褌泻芯胁褨 胁懈褌褉邪褌懈",
      es: "Gastos adicionales"
    },
    explanation: {
      de: "Das sind Kosten rund um die Wohnung, zum Beispiel Wasser, Hausreinigung oder Müll. Sie kommen zur Miete dazu.",
      en: "These are costs around your home, for example water, cleaning of the building or rubbish. They are added to the rent.",
      tr: "Bunlar evle ilgili ek masraflard谋r. Örne臒in su, bina temizli臒i veya 莽öp. Kiraya eklenir.",
      uk: "笑械 写芯写邪褌泻芯胁褨 胁懈褌褉邪褌懈 薪邪 卸懈褌谢芯, 薪邪锌褉懈泻谢邪写 胁芯写邪, 锌褉懈斜懈褉邪薪薪褟 斜褍写懈薪泻褍 邪斜芯 褋屑褨褌褌褟. 袙芯薪懈 写芯写邪褞褌褜褋褟 写芯 芯褉械薪写懈.",
      es: "Son gastos extra de la vivienda, por ejemplo agua, limpieza del edificio o basura. Se suman al alquiler."
    }
  },
  aufenthaltstitel: {
    id: "aufenthaltstitel",
    label: {
      de: "Aufenthaltstitel",
      en: "Residence permit",
      tr: "Oturum izni",
      uk: "袛芯蟹胁褨谢 薪邪 锌褉芯卸懈胁邪薪薪褟",
      es: "Permiso de residencia"
    },
    explanation: {
      de: "Das ist das offizielle Dokument, das zeigt, dass du in Deutschland bleiben oder hier leben darfst.",
      en: "This is the official document that shows you are allowed to stay or live in Germany.",
      tr: "Bu, Almanya'da kalmana veya burada ya艧amana izin verildi臒ini gösteren resmi belgedir.",
      uk: "笑械 芯褎褨褑褨泄薪懈泄 写芯泻褍屑械薪褌, 褟泻懈泄 锌芯泻邪蟹褍褦, 褖芯 褌懈 屑芯卸械褕 蟹邪谢懈褕邪褌懈褋褟 邪斜芯 卸懈褌懈 胁 袧褨屑械褔褔懈薪褨.",
      es: "Es el documento oficial que muestra que puedes quedarte o vivir en Alemania."
    }
  },
  steuer_id: {
    id: "steuer_id",
    label: {
      de: "Steuer-ID",
      en: "Tax ID",
      tr: "Vergi numaras谋",
      uk: "袩芯写邪褌泻芯胁懈泄 薪芯屑械褉",
      es: "Identificaci贸n fiscal"
    },
    explanation: {
      de: "Das ist deine persönliche Nummer für Steuern. Sie bleibt meistens immer gleich.",
      en: "This is your personal number for taxes. It usually stays the same.",
      tr: "Bu, vergiler i莽in ki艧isel numarand谋r. Genelde hep ayn谋 kal谋r.",
      uk: "笑械 褌胁褨泄 芯褋芯斜懈褋褌懈泄 薪芯屑械褉 写谢褟 锌芯写邪褌泻褨胁. 袟邪蟹胁懈褔邪泄 胁褨薪 薪械 蟹屑褨薪褞褦褌褜褋褟.",
      es: "Es tu n煤mero personal para impuestos. Normalmente siempre es el mismo."
    }
  },
  meldebescheinigung: {
    id: "meldebescheinigung",
    label: {
      de: "Meldebescheinigung",
      en: "Registration certificate",
      tr: "陌kamet belgesi",
      uk: "袛芯胁褨写泻邪 锌褉芯 褉械褦褋褌褉邪褑褨褞",
      es: "Certificado de empadronamiento"
    },
    explanation: {
      de: "Das ist ein Papier vom Bürgeramt. Es zeigt, unter welcher Adresse du gemeldet bist.",
      en: "This is a paper from the citizen office. It shows the address where you are officially registered.",
      tr: "Bu, vatanda艧l谋k ofisinden gelen bir belgedir. Hangi adreste resmi kay谋tl谋 oldu臒unu gösterir.",
      uk: "笑械 写芯泻褍屑械薪褌 胁褨写 屑褨褋褜泻芯谐芯 芯褎褨褋褍. 袙褨薪 锌芯泻邪蟹褍褦, 蟹邪 褟泻芯褞 邪写褉械褋芯褞 褌懈 芯褎褨褑褨泄薪芯 蟹邪褉械褦褋褌褉芯胁邪薪懈泄.",
      es: "Es un documento de la oficina ciudadana. Muestra en qu茅 direcci贸n est谩s registrado oficialmente."
    }
  },
  einkommensnachweis: {
    id: "einkommensnachweis",
    label: {
      de: "Einkommensnachweis",
      en: "Proof of income",
      tr: "Gelir belgesi",
      uk: "袩褨写褌胁械褉写卸械薪薪褟 写芯褏芯写褍",
      es: "Justificante de ingresos"
    },
    explanation: {
      de: "Das ist ein Dokument, das zeigt, wie viel Geld du bekommst. Das kann zum Beispiel ein Lohnzettel sein.",
      en: "This is a document that shows how much money you receive. For example, it can be a payslip.",
      tr: "Bu, ne kadar para ald谋臒谋n谋 gösteren belgedir. Örne臒in maa艧 bordrosu olabilir.",
      uk: "笑械 写芯泻褍屑械薪褌, 褟泻懈泄 锌芯泻邪蟹褍褦, 褋泻褨谢褜泻懈 谐褉芯褕械泄 褌懈 芯褌褉懈屑褍褦褕. 袧邪锌褉懈泻谢邪写, 褑械 屑芯卸械 斜褍褌懈 褉芯蟹褉邪褏褍薪泻芯胁懈泄 谢懈褋褌.",
      es: "Es un documento que muestra cu谩nto dinero recibes. Por ejemplo, puede ser una n贸mina."
    }
  },
  sozialversicherungsnummer: {
    id: "sozialversicherungsnummer",
    label: {
      de: "Sozialversicherungsnummer",
      en: "Social insurance number",
      tr: "Sosyal sigorta numaras谋",
      uk: "袧芯屑械褉 褋芯褑褨邪谢褜薪芯谐芯 褋褌褉邪褏褍胁邪薪薪褟",
      es: "N煤mero de seguridad social"
    },
    explanation: {
      de: "Das ist deine persönliche Nummer für die Sozialversicherung, also zum Beispiel für Rente oder Arbeit.",
      en: "This is your personal number for social insurance, for example for pension or work records.",
      tr: "Bu, sosyal sigorta i莽in ki艧isel numarand谋r. Örne臒in emeklilik veya 莽al谋艧ma kay谋tlar谋 i莽in kullan谋l谋r.",
      uk: "笑械 褌胁褨泄 芯褋芯斜懈褋褌懈泄 薪芯屑械褉 写谢褟 褋芯褑褨邪谢褜薪芯谐芯 褋褌褉邪褏褍胁邪薪薪褟, 薪邪锌褉懈泻谢邪写 写谢褟 锌械薪褋褨褩 邪斜芯 写邪薪懈褏 锌褉芯 褉芯斜芯褌褍.",
      es: "Es tu n煤mero personal para la seguridad social, por ejemplo para la pensi贸n o los datos de trabajo."
    }
  },
  haushaltsmitglieder: {
    id: "haushaltsmitglieder",
    label: {
      de: "Haushaltsmitglieder",
      en: "Household members",
      tr: "Hane üyeleri",
      uk: "效谢械薪懈 写芯屑芯谐芯褋锌芯写邪褉褋褌胁邪",
      es: "Miembros del hogar"
    },
    explanation: {
      de: "Das sind alle Menschen, die mit dir in derselben Wohnung leben.",
      en: "These are all the people who live with you in the same home.",
      tr: "Bunlar seninle ayn谋 evde ya艧ayan tüm ki艧ilerdir.",
      uk: "笑械 胁褋褨 谢褞写懈, 褟泻褨 卸懈胁褍褌褜 蟹 褌芯斜芯褞 胁 芯写薪芯屑褍 卸懈褌谢褨.",
      es: "Son todas las personas que viven contigo en la misma vivienda."
    }
  },
  familienstand: {
    id: "familienstand",
    label: {
      de: "Familienstand",
      en: "Family status",
      tr: "Medeni durum",
      uk: "小褨屑械泄薪懈泄 褋褌邪薪",
      es: "Estado civil"
    },
    explanation: {
      de: "Damit ist gemeint, ob du ledig, verheiratet, getrennt oder in einer Partnerschaft bist.",
      en: "This means whether you are single, married, separated or in a partnership.",
      tr: "Bu, bekar, evli, ayr谋 ya艧ayan ya da partnerlik i莽inde olup olmad谋臒谋n anlam谋na gelir.",
      uk: "笑械 芯蟹薪邪褔邪褦, 褔懈 褌懈 薪械芯写褉褍卸械薪懈泄, 芯写褉褍卸械薪懈泄, 卸懈胁械褕 芯泻褉械屑芯 邪斜芯 胁 锌邪褉褌薪械褉褋褌胁褨.",
      es: "Esto significa si eres soltero, casado, separado o si est谩s en pareja."
    }
  }
};

export function getGlossaryCopy(locale: string | null | undefined) {
  return glossaryCopyMap[normalizePreferredLanguage(locale)] ?? defaultGlossaryCopy;
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


