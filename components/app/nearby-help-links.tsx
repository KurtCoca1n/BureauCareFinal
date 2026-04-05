"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, LoaderCircle, MapPin } from "lucide-react";

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
      openMaps: "Open in Maps",
      allowLocation: "Use location for routes"
    };
  }

  if (locale === "tr") {
    return {
      title: "Yak谋ndaki se莽enekler",
      text: "Kaydedilen konumuna göre BureauCare senin i莽in uygun yerleri Haritalar'da a莽abilir.",
      route: "Rota ba艧lat",
      routeToNearest: "En yak谋n谋na rota",
      openMaps: "Haritada a莽",
      allowLocation: "Rota i莽in konumu kullan"
    };
  }

  if (locale === "uk") {
    return {
      title: "袙邪褉褨邪薪褌懈 锌芯褉褍褔",
      text: "袟 芯谐谢褟写褍 薪邪 蟹斜械褉械卸械薪械 屑褨褋褑械 BureauCare 屑芯卸械 胁褨写泻褉懈褌懈 写谢褟 褌械斜械 胁褨写锌芯胁褨写薪褨 屑褨褋褑褟 薪邪 屑邪锌褨.",
      route: "袩褉芯泻谢邪褋褌懈 屑邪褉褕褉褍褌",
      routeToNearest: "袦邪褉褕褉褍褌 写芯 薪邪泄斜谢懈卸褔芯谐芯",
      openMaps: "袙褨写泻褉懈褌懈 薪邪 屑邪锌褨",
      allowLocation: "袙懈泻芯褉懈褋褌邪褌懈 屑褨褋褑械 写谢褟 屑邪褉褕褉褍褌褍"
    };
  }

  if (locale === "es") {
    return {
      title: "Opciones cercanas",
      text: "Seg煤n tu ubicaci贸n guardada, BureauCare puede abrir lugares adecuados en el mapa.",
      route: "Iniciar ruta",
      routeToNearest: "Ruta al m谩s cercano",
      openMaps: "Abrir en Maps",
      allowLocation: "Usar ubicacion para la ruta"
    };
  }

  return {
    title: "Hinweise in deiner Nähe",
    text: "Mit deinem gespeicherten Standort kann BureauCare passende Stellen direkt in Maps für dich öffnen.",
    route: "Route starten",
    routeToNearest: "Route zur nächsten",
    openMaps: "In Maps öffnen",
    allowLocation: "Standort fuer Routen nutzen"
  };
}

function buildSuggestedQueries(seedText: string) {
  const normalized = seedText.toLowerCase();
  const suggestions: string[] = [];

  const candidates: Array<[RegExp, string]> = [
    [/\bpost|brief|einschreiben|per post\b/, "Postfiliale"],
    [/\bamtsgericht|gericht\b/, "Amtsgericht"],
    [/\bbürgeramt|buergeramt|einwohnermeldeamt|meldung\b/, "Buergeramt"],
    [/\bjobcenter\b/, "Jobcenter"],
    [/\bfinanzamt|steuer\b/, "Finanzamt"],
    [/\bkrankenkasse|versicherung\b/, "Krankenkasse"],
    [/\bausländerbehörde|auslaenderbehoerde|immigration office\b/, "Auslaenderbehoerde"],
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
  actionUrl,
  initialLocation
}: {
  locale: string;
  locationName?: string | null;
  address?: string | null;
  contextText?: string | null;
  actionMode?: string | null;
  actionUrl?: string | null;
  initialLocation?: StoredLocation | null;
}) {
  const [storedLocation, setStoredLocation] = useState<StoredLocation | null>(initialLocation ?? null);
  const [requestPending, setRequestPending] = useState(false);
  const copy = getCopy(locale);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setStoredLocation(JSON.parse(raw) as StoredLocation);
        return;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (initialLocation) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(initialLocation));
      setStoredLocation(initialLocation);
    }
  }, [initialLocation]);

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
    const derived = buildSuggestedQueries(base);
    const directSeeds = [locationName, address]
      .filter((value): value is string => Boolean(value))
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    for (const seed of directSeeds) {
      if (!derived.includes(seed)) {
        derived.unshift(seed);
      }
    }

    return derived.slice(0, 3);
  }, [actionMode, address, contextText, locationName]);

  const hasPlaces = Boolean(locationName || address || nearbyQueries.length > 0 || actionUrl);

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      return;
    }

    setRequestPending(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          grantedAt: new Date().toISOString()
        } satisfies StoredLocation;

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocation));
        setStoredLocation(nextLocation);
        setRequestPending(false);
      },
      () => {
        setRequestPending(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 * 60 * 60 * 24 }
    );
  }

  if (!hasPlaces) {
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
  const queryRouteLinks = storedLocation
    ? nearbyQueries.map((query) => ({
        query,
        href: `https://www.google.com/maps/dir/?api=1&origin=${storedLocation.latitude},${storedLocation.longitude}&destination=${encodeURIComponent(query)}`
      }))
    : [];

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
            {!storedLocation ? (
              <button
                type="button"
                onClick={requestLocation}
                disabled={requestPending}
                className="inline-flex min-h-11 items-center justify-center rounded-2xl bg-white px-4 text-sm font-medium text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {requestPending ? (
                  <>
                    <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                    {copy.allowLocation}
                  </>
                ) : (
                  copy.allowLocation
                )}
              </button>
            ) : null}

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

