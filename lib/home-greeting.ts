import { normalizePreferredLanguage } from "@/lib/languages";

export const supportLines = {
  de: [
    "Heute bringen wir Ordnung in deine Buerokratie.",
    "Ein Schritt weniger Papierkram.",
    "Du hast das im Griff.",
    "Wir kuemmern uns darum."
  ],
  en: [
    "Today we bring order to your paperwork.",
    "One step less bureaucracy.",
    "You have this under control.",
    "We will take care of it."
  ],
  tr: [
    "Bugun evrak islerine biraz daha duzen getiriyoruz.",
    "Bir adim daha az burokrasi.",
    "Bu isi kontrol ediyorsun.",
    "Bununla birlikte ilgileniyoruz."
  ],
  uk: [
    "Sohodni my trochu vporyadkovuyemo tvoyu byurokratiyu.",
    "Na odyn krok menshe paperovoyi tyahanyny.",
    "Ty trymayesh tse pid kontrolem.",
    "My dopomozhemo z tsym rozibratysya."
  ],
  es: [
    "Hoy ponemos un poco mas de orden en tu burocracia.",
    "Un paso menos de papeleo.",
    "Lo tienes bajo control.",
    "Nos ocupamos de ello contigo."
  ],
  zh: [
    "今天我们帮你把这些手续整理清楚。",
    "少一点折腾，多一点清楚。",
    "这件事你能掌握住。",
    "我们会陪你一起处理。"
  ]
} as const;

function getGreetingPrefix(locale: keyof typeof supportLines, hour: number) {
  if (locale === "de") {
    if (hour < 11) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  }

  if (locale === "tr") {
    if (hour < 11) return "Gunaydin";
    if (hour < 18) return "Iyi gunler";
    return "Iyi aksamlar";
  }

  if (locale === "uk") {
    if (hour < 11) return "Dobroho ranku";
    if (hour < 18) return "Dobryy den";
    return "Dobryy vechir";
  }

  if (locale === "es") {
    if (hour < 11) return "Buenos dias";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  }

  if (locale === "zh") {
    if (hour < 11) return "早上好";
    if (hour < 18) return "你好";
    return "晚上好";
  }

  if (hour < 11) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function getHomeGreeting(localeInput: string | null | undefined, fullName: string | null | undefined) {
  const locale = normalizePreferredLanguage(localeInput);
  const hour = Number(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: "Europe/Berlin",
      hour: "2-digit",
      hourCycle: "h23"
    }).format(new Date())
  );
  const prefix = getGreetingPrefix(locale as keyof typeof supportLines, hour);
  const daySeed = Number(
    new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Berlin",
      year: "numeric",
      month: "2-digit",
      day: "2-digit"
    })
      .format(new Date())
      .replaceAll("-", "")
  );
  const lines = supportLines[locale as keyof typeof supportLines] ?? supportLines.en;
  const supportLine = lines[daySeed % lines.length];

  return {
    greeting: fullName ? `${prefix}, ${fullName}` : prefix,
    supportLine,
    supportLines: [...lines]
  };
}
