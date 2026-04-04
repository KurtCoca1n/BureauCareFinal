import { getDayPhaseFromHour, type DayPhase } from "@/lib/day-phase";
import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";

type GreetingSet = {
  greetings: string[];
  supportLines: string[];
};

type GreetingCopy = Record<DayPhase, GreetingSet>;

const greetingCopy: Record<SupportedLanguage, GreetingCopy> = {
  de: {
    morning: {
      greetings: ["Guten Morgen", "Schön, dass du da bist"],
      supportLines: ["Heute kriegen wir deine Bürokratie geregelt.", "Ein ruhiger Start ist die halbe Miete."]
    },
    day: {
      greetings: ["Schön, dich wiederzusehen", "Ich hoffe, du hast einen guten Tag"],
      supportLines: ["Was heute ansteht, schaffen wir Schritt für Schritt.", "Lass uns das heute einfach halten."]
    },
    evening: {
      greetings: ["Guten Abend", "Lass uns noch kurz Ordnung reinbringen"],
      supportLines: ["Ein bisschen Ordnung, dann hast du Ruhe.", "Wir machen das noch schnell zusammen."]
    },
    night: {
      greetings: ["Noch spät unterwegs", "Gut, dass wir das jetzt noch sortieren"],
      supportLines: ["Ich helfe dir, damit du schneller fertig bist.", "Nachts muss Bürokratie wenigstens einfach sein."]
    }
  },
  en: {
    morning: {
      greetings: ["Good morning", "Glad you are here"],
      supportLines: ["Let us get your paperwork sorted today.", "A calm start already helps a lot."]
    },
    day: {
      greetings: ["Good to see you again", "Hope your day is going well"],
      supportLines: ["We can handle today step by step.", "Let us keep things simple today."]
    },
    evening: {
      greetings: ["Good evening", "Let us bring a little order into this"],
      supportLines: ["A little order now can give you some peace later.", "We can finish this together quickly."]
    },
    night: {
      greetings: ["Still up late", "Let us sort this out before the day ends"],
      supportLines: ["I will help you get through this faster.", "At night, bureaucracy should at least feel simple."]
    }
  },
  tr: {
    morning: {
      greetings: ["Gunaydin", "Burada olman ne guzel"],
      supportLines: ["Bugun bu isleri duzene koyuyoruz.", "Sakin bir baslangic cok seyi kolaylastirir."]
    },
    day: {
      greetings: ["Seni yeniden gormek guzel", "Umarim gunun iyi geciyordur"],
      supportLines: ["Bugunku isleri adim adim hallederiz.", "Bugun bunu sade tutalim."]
    },
    evening: {
      greetings: ["Iyi aksamlar", "Hadi buna biraz daha duzen getirelim"],
      supportLines: ["Biraz duzen, sonra daha fazla huzur.", "Bunu birlikte hizlica hallederiz."]
    },
    night: {
      greetings: ["Hala ayakta misin", "Bunu gece bitirmek iyi olur"],
      supportLines: ["Daha cabuk bitirmen icin yardim ederim.", "Gece saatlerinde burokrasi en azindan kolay olmali."]
    }
  },
  uk: {
    morning: {
      greetings: ["Dobroho ranku", "Pryyemno bachyty tebe znovu"],
      supportLines: ["Sohodni my spokiyno vporyadkuyemo tvoyi spravy.", "Spokiynyy pochatok vzhe bahato daje."]
    },
    day: {
      greetings: ["Radyi bachyty tebe", "Spodivayus, den mynaye dobre"],
      supportLines: ["Use, shcho vazhlyve sohodni, zrobymo krok za krokom.", "Davaj zrobymo tse prostishe."]
    },
    evening: {
      greetings: ["Dobryy vechir", "Davaj shche trokhy navedemo lad"],
      supportLines: ["Trokhy poryadku, i bude spokiynishe.", "Shvydko zrobymo tse razom."]
    },
    night: {
      greetings: ["Shche ne spysh", "Davaj shvydko rozberemos z tsym"],
      supportLines: ["Ya dopomozhu, shchob ty shvydshe zakinchyv.", "Vnochi biurokratiya maye buty khocha b prostishoyu."]
    }
  },
  es: {
    morning: {
      greetings: ["Buenos dias", "Que bueno verte por aqui"],
      supportLines: ["Hoy ponemos en orden tu burocracia.", "Un inicio tranquilo ya ayuda mucho."]
    },
    day: {
      greetings: ["Me alegra verte de nuevo", "Espero que estes teniendo un buen dia"],
      supportLines: ["Lo de hoy lo resolvemos paso a paso.", "Vamos a mantenerlo simple hoy."]
    },
    evening: {
      greetings: ["Buenas tardes", "Vamos a dejar esto un poco mas en orden"],
      supportLines: ["Un poco de orden ahora te da mas tranquilidad despues.", "Lo hacemos juntos rapidamente."]
    },
    night: {
      greetings: ["Todavia despierto", "Vamos a resolver esto rapido"],
      supportLines: ["Te ayudo para que termines antes.", "De noche la burocracia deberia sentirse al menos un poco mas facil."]
    }
  },
  zh: {
    morning: {
      greetings: ["早上好", "很高兴见到你"],
      supportLines: ["今天我们把这些手续慢慢理顺。", "平静地开始，事情就会轻松很多。"]
    },
    day: {
      greetings: ["很高兴再次见到你", "希望你今天一切顺利"],
      supportLines: ["今天要做的事，我们一步一步来。", "今天我们把事情尽量处理得简单一些。"]
    },
    evening: {
      greetings: ["晚上好", "我们再把事情整理一下"],
      supportLines: ["稍微整理一下，心里会轻松很多。", "我们一起把这件事快点处理好。"]
    },
    night: {
      greetings: ["这么晚还在忙吗", "我们把这件事尽快处理完"],
      supportLines: ["我来帮你更快结束这件事。", "到了晚上，手续至少应该更简单一点。"]
    }
  }
};

function getBerlinHour() {
  return Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      hourCycle: "h23"
    }).format(new Date())
  );
}

function getDaySeed() {
  return Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
      .format(new Date())
      .replaceAll("-", "")
  );
}

export function getHomeGreetingCopy(localeInput: string | null | undefined) {
  const locale = normalizePreferredLanguage(localeInput);
  return greetingCopy[locale] ?? greetingCopy.en;
}

export function joinGreetingName(baseGreeting: string, fullName: string | null | undefined, localeInput: string | null | undefined) {
  if (!fullName) {
    return baseGreeting;
  }

  const locale = normalizePreferredLanguage(localeInput);
  return locale === "zh" ? `${baseGreeting}，${fullName}` : `${baseGreeting}, ${fullName}`;
}

export function getHomeGreeting(localeInput: string | null | undefined, fullName: string | null | undefined) {
  const locale = normalizePreferredLanguage(localeInput);
  const phase = getDayPhaseFromHour(getBerlinHour());
  const copy = getHomeGreetingCopy(locale);
  const phaseCopy = copy[phase];
  const seed = getDaySeed();
  const greetingBase = phaseCopy.greetings[seed % phaseCopy.greetings.length] ?? phaseCopy.greetings[0];
  const supportLine = phaseCopy.supportLines[seed % phaseCopy.supportLines.length] ?? phaseCopy.supportLines[0];

  return {
    phase,
    greeting: joinGreetingName(greetingBase, fullName, locale),
    supportLine,
    greetings: [...phaseCopy.greetings],
    supportLines: [...phaseCopy.supportLines]
  };
}
