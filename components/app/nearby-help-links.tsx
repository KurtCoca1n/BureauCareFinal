"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, MapPin } from "lucide-react";

const STORAGE_KEY = "bureaucare-location";

type StoredLocation = {
  latitude: number;
  longitude: number;
  grantedAt: string;
};

function getCopy(locale: string) {
  if (locale === "en") {
    return {
      title: "Nearby options",
      text: "Based on your saved location, BureauCare can open fitting places in Maps for you.",
      route: "Start route",
      routeToNearest: "Route to nearest",
      openMaps: "Open in Maps"
    };
  }

  if (locale === "tr") {
    return {
      title: "Yakındaki seçenekler",
      text: "Kaydedilen konumuna göre BureauCare senin için uygun yerleri Haritalar'da açabilir.",
      route: "Rota başlat",
      routeToNearest: "En yakınına rota",
      openMaps: "Haritada aç"
    };
  }

  if (locale === "uk") {
    return {
      title: "Варіанти поруч",
      text: "З огляду на збережене місце BureauCare може відкрити для тебе відповідні місця на мапі.",
      route: "Прокласти маршрут",
      routeToNearest: "Маршрут до найближчого",
      openMaps: "Відкрити на мапі"
    };
  }

  if (locale === "es") {
    return {
      title: "Opciones cercanas",
      text: "Según tu ubicación guardada, BureauCare puede abrir lugares adecuados en el mapa.",
      route: "Iniciar ruta",
      routeToNearest: "Ruta al más cercano",
      openMaps: "Abrir en Maps"
    };
  }

  return {
    title: "Hinweise in deiner Nähe",
    text: "Mit deinem gespeicherten Standort kann BureauCare passende Stellen direkt in Maps für dich öffnen.",
    route: "Route starten",
    routeToNearest: "Route zur nächsten",
    openMaps: "In Maps öffnen"
  };
}

function buildSuggestedQueries(seedText: string) {
  const normalized = seedText.toLowerCase();
  const suggestions: string[] = [];

  const candidates: Array<[RegExp, string]> = [
    [/\bpost|brief|einschreiben|per post\b/, "Postfiliale"],
    [/\bamtsgericht|gericht\b/, "Amtsgericht"],
    [/\bbürgeramt|einwohnermeldeamt|meldung\b/, "Bürgeramt"],
    [/\bjobcenter\b/, "Jobcenter"],
    [/\bfinanzamt|steuer\b/, "Finanzamt"],
    [/\bkrankenkasse|versicherung\b/, "Krankenkasse"],
    [/\bnotar\b/, "Notariat"],
    [/\bwohngeld|sozialamt\b/, "Sozialamt"]
  ];

  for (const [pattern, label] of candidates) {
    if (pattern.test(normalized) && !suggestions.includes(label)) {
      suggestions.push(label);
    }
  }

  return suggestions.slice(0, 3);
}

export function NearbyHelpLinks({
  locale,
  locationName,
  address,
  contextText,
  actionMode,
  actionUrl
}: {
  locale: string;
  locationName?: string | null;
  address?: string | null;
  contextText?: string | null;
  actionMode?: string | null;
  actionUrl?: string | null;
}) {
  const [storedLocation, setStoredLocation] = useState<StoredLocation | null>(null);
  const copy = getCopy(locale);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }

    try {
      setStoredLocation(JSON.parse(raw) as StoredLocation);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const nearbyQueries = useMemo(() => {
    const actionModeSeed =
      actionMode === "per_post"
        ? "per post post brief einschreiben"
        : actionMode === "vor_ort"
          ? "vor ort behörde amt"
          : actionMode === "telefon"
            ? "telefon hotline service"
            : actionMode === "online"
              ? "online portal service"
              : "";
    const base = [locationName, address, contextText, actionModeSeed].filter(Boolean).join(" ");
    return buildSuggestedQueries(base);
  }, [actionMode, address, contextText, locationName]);

  if (!storedLocation || (!locationName && !address && nearbyQueries.length === 0 && !actionUrl)) {
    return null;
  }

  const routeHref =
    address && storedLocation
      ? `https://www.google.com/maps/dir/?api=1&origin=${storedLocation.latitude},${storedLocation.longitude}&destination=${encodeURIComponent(address)}`
      : null;
  const mapsHref = address
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`
    : locationName
      ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(locationName)}`
      : null;
  const queryRouteLinks = nearbyQueries.map((query) => ({
    query,
    href: `https://www.google.com/maps/dir/?api=1&origin=${storedLocation.latitude},${storedLocation.longitude}&destination=${encodeURIComponent(query)}`
  }));

  return (
    <div className="rounded-[20px] border border-[rgba(95,163,163,0.2)] bg-[linear-gradient(135deg,rgba(95,163,163,0.1),rgba(111,168,220,0.08))] p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-white/75 p-2 text-[var(--accent-strong)] shadow-[var(--shadow-soft)]">
          <MapPin className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="space-y-1">
            <p className="text-sm font-semibold text-[var(--foreground)]">{copy.title}</p>
            <p className="text-sm leading-6 text-[var(--muted)]">{copy.text}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {routeHref ? (
              <a
                href={routeHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5"
              >
                {copy.route}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            ) : null}

            {!routeHref && mapsHref ? (
              <a
                href={mapsHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5"
              >
                {copy.openMaps}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            ) : null}

            {queryRouteLinks.map(({ query, href }) => (
              <a
                key={query}
                href={href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/70 bg-white/75 px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-white hover:bg-white"
              >
                {copy.routeToNearest} {query}
              </a>
            ))}

            {actionUrl ? (
              <a
                href={actionUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-white/70 bg-white/75 px-4 text-sm font-medium text-[var(--foreground)] transition hover:border-white hover:bg-white"
              >
                {copy.openMaps}
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
