import { normalizePreferredLanguage } from "@/lib/languages";

export const supportLines = {
  de: [
    "Heute bringen wir Ordnung in deine Bürokratie.",
    "Ein Schritt weniger Papierkram.",
    "Du hast das im Griff.",
    "Wir kümmern uns darum."
  ],
  en: [
    "Today we bring order to your paperwork.",
    "One step less bureaucracy.",
    "You have this under control.",
    "We will take care of it."
  ],
  tr: [
    "Bugün evrak işlerine biraz daha düzen getiriyoruz.",
    "Bir adım daha az bürokrasi.",
    "Bu işi kontrol ediyorsun.",
    "Bununla birlikte ilgileniyoruz."
  ],
  uk: [
    "Сьогодні ми трохи впорядкуємо твою бюрократію.",
    "Ще на один крок менше паперової тяганини.",
    "Ти тримаєш це під контролем.",
    "Ми допоможемо з цим розібратися."
  ],
  es: [
    "Hoy ponemos un poco más de orden en tu burocracia.",
    "Un paso menos de papeleo.",
    "Lo tienes bajo control.",
    "Nos ocupamos de ello contigo."
  ]
} as const;

function getGreetingPrefix(locale: keyof typeof supportLines, hour: number) {
  if (locale === "de") {
    if (hour < 11) return "Guten Morgen";
    if (hour < 18) return "Guten Tag";
    return "Guten Abend";
  }

  if (locale === "tr") {
    if (hour < 11) return "Günaydın";
    if (hour < 18) return "İyi günler";
    return "İyi akşamlar";
  }

  if (locale === "uk") {
    if (hour < 11) return "Доброго ранку";
    if (hour < 18) return "Добрий день";
    return "Добрий вечір";
  }

  if (locale === "es") {
    if (hour < 11) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
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
  const prefix = getGreetingPrefix(locale, hour);
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
  const lines = supportLines[locale];
  const supportLine = lines[daySeed % lines.length];

  return {
    greeting: fullName ? `${prefix}, ${fullName}` : prefix,
    supportLine,
    supportLines: [...lines]
  };
}
