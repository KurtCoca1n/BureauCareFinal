import type { SupportedLanguage } from "@/lib/languages";

import type { OnboardingPersonaId } from "./types";

export type ContentSlide = {
  headline: string;
  sub?: string;
  bullets?: string[];
};

export type PersonaOptionCopy = {
  id: OnboardingPersonaId;
  label: string;
  emoji: string;
};

export type OnboardingCopy = {
  welcome: { headline: string; sub: string; next: string };
  persona: { headline: string; next: string; back: string };
  personas: PersonaOptionCopy[];
  dynamic: Record<OnboardingPersonaId, ContentSlide[]>;
  core: ContentSlide[];
  closing: {
    headline: string;
    sub: string;
    primary: string;
    secondary: string;
    back: string;
  };
  /** Nach Registrierung (noch ohne Login): letzter Schritt vor E-Mail-Bestätigung */
  guestClosing: {
    headline: string;
    sub: string;
    primary: string;
    secondary: string;
  };
};

const de: OnboardingCopy = {
  welcome: {
    headline: "Willkommen bei BureauCare 👋",
    sub: "Wir helfen dir, Bürokratie endlich einfach zu machen.",
    next: "Weiter"
  },
  persona: {
    headline: "Was beschreibt dich am besten?",
    next: "Weiter",
    back: "Zurück"
  },
  personas: [
    { id: "student", label: "Student / Studium", emoji: "🎓" },
    { id: "new_in_germany", label: "Neu in Deutschland", emoji: "🌍" },
    { id: "employed", label: "Berufstätig", emoji: "💼" },
    { id: "self_employed", label: "Selbstständig", emoji: "🧾" },
    { id: "everyday", label: "Weniger Bürokratie im Alltag", emoji: "😵" }
  ],
  dynamic: {
    new_in_germany: [
      {
        headline: "Willkommen in Deutschland 🇩🇪",
        sub: "Hier kann Bürokratie schnell kompliziert werden."
      },
      {
        headline: "Wir helfen dir dabei",
        bullets: ["Dokumente verstehen", "Fristen erkennen", "Antworten schreiben"]
      },
      {
        headline: "Alles in klarer Sprache",
        sub: "Ohne Amtsdeutsch. Ohne Rätsel."
      }
    ],
    student: [
      {
        headline: "Studium ist schon stressig genug 🎓",
        sub: "Wir nehmen dir Papierkram ab."
      },
      {
        headline: "Wir helfen dir mit",
        bullets: ["Immatrikulation & Bescheiden", "Versicherungen & Nachweise", "Behördenpost sortieren"]
      },
      {
        headline: "Damit du dich aufs Studium konzentrieren kannst.",
        sub: "Ein Schritt nach dem anderen."
      }
    ],
    employed: [
      {
        headline: "Beruf & Behörden unter einen Hut 💼",
        sub: "Ohne dass du Abende mit Kleingedrucktem verbringst."
      },
      {
        headline: "Wir helfen dir",
        bullets: ["Wichtiges auf einen Blick", "Fristen im Kalender-Kopf", "Antworten in klarer Sprache"]
      }
    ],
    self_employed: [
      {
        headline: "Selbstständig – viele Zettel, wenig Zeit 🧾",
        sub: "Wir sortieren mit dir, was wirklich dringt."
      },
      {
        headline: "Damit du entscheiden kannst",
        bullets: ["Formulare verstehen", "Pflichten im Blick", "Antworten vorbereiten"]
      }
    ],
    everyday: [
      {
        headline: "Alltag statt Aktenstapel 😌",
        sub: "Briefe von Behörden oder Vertragspartnern – wir fassen zusammen."
      },
      {
        headline: "Du behältst die Ruhe",
        bullets: ["Kerninfos statt Seitenwald", "Nächste Schritte klar", "Texte, die du nutzen kannst"]
      }
    ]
  },
  core: [
    {
      headline: "Verstehe Dokumente sofort 📄",
      sub: "Wir sagen dir, was wirklich wichtig ist."
    },
    {
      headline: "Verpasse keine Fristen ⏰",
      sub: "Du weißt, was wann dran ist."
    },
    {
      headline: "Antworten direkt fertig ✍️",
      sub: "Texte, die du anpassen und verschicken kannst."
    }
  ],
  closing: {
    headline: "Du kannst jederzeit starten.",
    sub: "Wenn du möchtest, schauen wir uns dein erstes Dokument an.",
    primary: "Dokument ansehen",
    secondary: "Später",
    back: "Zurück"
  },
  guestClosing: {
    headline: "Fast geschafft.",
    sub: "Bitte bestätige noch deine E-Mail-Adresse – dann ist dein Konto bereit. Den Link haben wir dir geschickt.",
    primary: "Zur E-Mail-Bestätigung",
    secondary: "Später einloggen"
  }
};

const en: OnboardingCopy = {
  welcome: {
    headline: "Welcome to BureauCare 👋",
    sub: "We help you make bureaucracy feel simple.",
    next: "Continue"
  },
  persona: {
    headline: "What describes you best?",
    next: "Continue",
    back: "Back"
  },
  personas: [
    { id: "student", label: "Student", emoji: "🎓" },
    { id: "new_in_germany", label: "New in Germany", emoji: "🌍" },
    { id: "employed", label: "Employed", emoji: "💼" },
    { id: "self_employed", label: "Self-employed", emoji: "🧾" },
    { id: "everyday", label: "Less paperwork in daily life", emoji: "😵" }
  ],
  dynamic: {
    new_in_germany: [
      {
        headline: "Welcome to Germany 🇩🇪",
        sub: "Paperwork here can get complicated quickly."
      },
      {
        headline: "We help you with",
        bullets: ["Understanding letters", "Spotting deadlines", "Drafting replies"]
      },
      {
        headline: "All in plain language",
        sub: "No jargon. No guesswork."
      }
    ],
    student: [
      {
        headline: "Studying is stressful enough 🎓",
        sub: "We take paperwork off your plate."
      },
      {
        headline: "We help with",
        bullets: ["Enrollment & notices", "Insurance & proofs", "Sorting official mail"]
      },
      {
        headline: "So you can focus on your degree.",
        sub: "One step at a time."
      }
    ],
    employed: [
      {
        headline: "Work life and paperwork in balance 💼",
        sub: "Without spending evenings on fine print."
      },
      {
        headline: "We help you",
        bullets: ["See what matters first", "Keep deadlines in view", "Replies in clear language"]
      }
    ],
    self_employed: [
      {
        headline: "Self-employed — many papers, little time 🧾",
        sub: "We help sort what actually matters."
      },
      {
        headline: "So you can decide calmly",
        bullets: ["Forms made clear", "Obligations in view", "Drafts ready to use"]
      }
    ],
    everyday: [
      {
        headline: "Everyday life, not piles of paper 😌",
        sub: "Letters from authorities or partners — we summarize."
      },
      {
        headline: "You stay in control",
        bullets: ["Key facts, not page walls", "Next steps, clear", "Texts you can use"]
      }
    ]
  },
  core: [
    {
      headline: "Understand documents instantly 📄",
      sub: "We show you what really matters."
    },
    {
      headline: "Never miss a deadline ⏰",
      sub: "You know what’s due when."
    },
    {
      headline: "Replies ready to go ✍️",
      sub: "Wording you can edit and send."
    }
  ],
  closing: {
    headline: "You can start whenever you’re ready.",
    sub: "If you like, we’ll look at your first document together.",
    primary: "View a document",
    secondary: "Later",
    back: "Back"
  },
  guestClosing: {
    headline: "Almost there.",
    sub: "Please confirm your email address to finish setting up your account. We sent you a link.",
    primary: "Confirm email",
    secondary: "Log in later"
  }
};

export function getOnboardingCopy(locale: SupportedLanguage): OnboardingCopy {
  return locale === "de" ? de : en;
}

export function dynamicSlideCount(persona: OnboardingPersonaId): number {
  return persona === "student" || persona === "new_in_germany" ? 3 : 2;
}
