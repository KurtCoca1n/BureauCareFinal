import { normalizePreferredLanguage, type SupportedLanguage } from "@/lib/languages";
import type { PersonalDataSuggestionPriority } from "@/lib/types";

type SuggestionsUiCopy = {
  sectionTitle: string;
  sectionText: string;
  openLabel: string;
  priorityHigh: string;
  priorityMedium: string;
  priorityLow: string;
  myDataTitle: string;
  myDataText: string;
};

const copyMap: Record<SupportedLanguage, SuggestionsUiCopy> = {
  de: {
    sectionTitle: "Das koennte fuer dich relevant sein",
    sectionText: "Wenige, sorgfaeltig ausgewaehlte Hinweise auf Basis deiner gespeicherten Angaben.",
    openLabel: "Pruefen",
    priorityHigh: "Besonders passend",
    priorityMedium: "Wahrscheinlich hilfreich",
    priorityLow: "Vielleicht interessant",
    myDataTitle: "Das koennte fuer dich relevant sein",
    myDataText: "Diese Vorschlaege sind bewusst vorsichtig formuliert und basieren nur auf deinen gespeicherten Angaben."
  },
  en: {
    sectionTitle: "This could be relevant for you",
    sectionText: "A few carefully chosen hints based on your saved details.",
    openLabel: "Check",
    priorityHigh: "Strong match",
    priorityMedium: "Likely helpful",
    priorityLow: "Possibly interesting",
    myDataTitle: "This could be relevant for you",
    myDataText: "These suggestions are deliberately cautious and only based on your saved details."
  },
  tr: {
    sectionTitle: "Bu senin icin ilgili olabilir",
    sectionText: "Kayitli bilgilerine dayanan, dikkatle secilmis birkac oneri.",
    openLabel: "Incele",
    priorityHigh: "Guclu eslesme",
    priorityMedium: "Muhtemelen faydali",
    priorityLow: "Belki ilgini cekebilir",
    myDataTitle: "Bu senin icin ilgili olabilir",
    myDataText: "Bu oneriler bilerek temkinli formul edildi ve sadece kayitli bilgilerine dayanir."
  },
  uk: {
    sectionTitle: "Tse mozhe buty relevantno dlya vas",
    sectionText: "Kilk-a oberezhno pidi-branykh pidkazok na osnovi zberezhenykh danykh.",
    openLabel: "Pereviryty",
    priorityHigh: "Sylna vidpovidnist",
    priorityMedium: "Ymavirno dopomozhe",
    priorityLow: "Mozhlyvo bude tsikavo",
    myDataTitle: "Tse mozhe buty relevantno dlya vas",
    myDataText: "Tsi propozytsiyi navmysno oberezhni ta bazuyutsya lyshe na vashykh zberezhenykh danykh."
  },
  es: {
    sectionTitle: "Esto podria ser relevante para ti",
    sectionText: "Unas pocas sugerencias cuidadosamente elegidas a partir de tus datos guardados.",
    openLabel: "Revisar",
    priorityHigh: "Muy adecuado",
    priorityMedium: "Probablemente util",
    priorityLow: "Quizas interesante",
    myDataTitle: "Esto podria ser relevante para ti",
    myDataText: "Estas sugerencias estan formuladas con prudencia y solo se basan en tus datos guardados."
  },
  zh: {
    sectionTitle: "这些内容可能和你有关",
    sectionText: "根据你已保存的信息，我们只给出少量、谨慎挑选的建议。",
    openLabel: "查看",
    priorityHigh: "非常匹配",
    priorityMedium: "可能有帮助",
    priorityLow: "也许值得看看",
    myDataTitle: "这些内容可能和你有关",
    myDataText: "这些建议会刻意保持谨慎，只基于你已经保存的信息。"
  }
};

export function getPersonalDataSuggestionsUiCopy(locale: string | null | undefined) {
  return copyMap[normalizePreferredLanguage(locale)];
}

export function getSuggestionPriorityLabel(locale: string | null | undefined, priority: PersonalDataSuggestionPriority) {
  const copy = getPersonalDataSuggestionsUiCopy(locale);

  switch (priority) {
    case "high":
      return copy.priorityHigh;
    case "medium":
      return copy.priorityMedium;
    default:
      return copy.priorityLow;
  }
}
