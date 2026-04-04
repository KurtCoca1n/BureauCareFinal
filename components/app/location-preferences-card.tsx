"use client";

import { useEffect, useState } from "react";
import { LoaderCircle, MapPin, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const STORAGE_KEY = "bureaucare-location";
const LOCATION_DECISION_KEY = "bureaucare-location-decision";

type StoredLocation = {
  latitude: number;
  longitude: number;
  grantedAt: string;
};

export function LocationPreferencesCard({
  locale
}: {
  locale: string;
}) {
  const [permissionState, setPermissionState] = useState<"idle" | "granted" | "denied" | "prompt">("idle");
  const [storedLocation, setStoredLocation] = useState<StoredLocation | null>(null);
  const [pending, setPending] = useState(false);

  const copy =
    locale === "en"
      ? {
          title: "Local hints",
          text: "Allow your location so BureauCare can show more relevant offices, addresses and nearby hints when a task has a place reference.",
          grant: "Allow location",
          granted: "Location access is active.",
          denied: "Location access is blocked. BureauCare still works normally.",
          saved: "Saved locally on this device only.",
          reset: "Reset choice",
          refresh: "Update location"
        }
      : locale === "tr"
        ? {
            title: "Yerel ipu莽lar谋",
            text: "Konumuna izin verirsen BureauCare, bir görevde yer bilgisi oldu臒unda daha uygun kurumlar谋, adresleri ve yak谋ndaki ipu莽lar谋n谋 gösterebilir.",
            grant: "Konuma izin ver",
            granted: "Konum eri艧imi aktif.",
            denied: "Konum eri艧imi engellendi. BureauCare normal 艧ekilde 莽al谋艧maya devam eder.",
            saved: "Yaln谋zca bu cihazda yerel olarak saklan谋r.",
            reset: "Karar谋 s谋f谋rla",
            refresh: "Konumu güncelle"
          }
        : locale === "uk"
          ? {
              title: "袥芯泻邪谢褜薪褨 锌褨写泻邪蟹泻懈",
              text: "袛芯蟹胁芯谢褜 谐械芯谢芯泻邪褑褨褞, 褖芯斜 BureauCare 屑褨谐 锌芯泻邪蟹褍胁邪褌懈 写芯褉械褔薪褨 褍褋褌邪薪芯胁懈, 邪写褉械褋懈 泄 锌褨写泻邪蟹泻懈 锌芯褉褍褔, 泻芯谢懈 蟹邪胁写邪薪薪褟 屑褨褋褌懈褌褜 锌褉懈胁鈥櫻徯沸貉?写芯 屑褨褋褑褟.",
              grant: "袛芯蟹胁芯谢懈褌懈 谐械芯谢芯泻邪褑褨褞",
              granted: "袛芯褋褌褍锌 写芯 谐械芯谢芯泻邪褑褨褩 邪泻褌懈胁薪懈泄.",
              denied: "袛芯褋褌褍锌 写芯 谐械芯谢芯泻邪褑褨褩 蟹邪斜谢芯泻芯胁邪薪芯. BureauCare 褨 写邪谢褨 锌褉邪褑褞褦 薪芯褉屑邪谢褜薪芯.",
              saved: "袟斜械褉褨谐邪褦褌褜褋褟 谢懈褕械 谢芯泻邪谢褜薪芯 薪邪 褑褜芯屑褍 锌褉懈褋褌褉芯褩.",
              reset: "小泻懈薪褍褌懈 褉褨褕械薪薪褟",
              refresh: "袨薪芯胁懈褌懈 屑褨褋褑械"
            }
          : locale === "es"
            ? {
                title: "Ayudas locales",
                text: "Permite tu ubicaci贸n para que BureauCare pueda mostrar oficinas, direcciones y pistas cercanas m谩s relevantes cuando una tarea tenga referencia de lugar.",
                grant: "Permitir ubicaci贸n",
                granted: "El acceso a la ubicaci贸n est谩 activo.",
                denied: "El acceso a la ubicaci贸n est谩 bloqueado. BureauCare sigue funcionando con normalidad.",
                saved: "Solo se guarda localmente en este dispositivo.",
                reset: "Restablecer decisi贸n",
                refresh: "Actualizar ubicaci贸n"
              }
            : {
                title: "Lokale Hinweise",
                text: "Erlaube deinen Standort, damit BureauCare passendere Stellen, Adressen und Hinweise in deiner Nähe zeigen kann, wenn eine Aufgabe einen Ortsbezug hat.",
                grant: "Standort erlauben",
                granted: "Standortfreigabe ist aktiv.",
                denied: "Standortfreigabe ist blockiert. BureauCare funktioniert normal weiter.",
                saved: "Wird nur lokal auf diesem Gerät gespeichert.",
                reset: "Entscheidung zurücksetzen",
                refresh: "Standort aktualisieren"
              };

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    const decision = window.localStorage.getItem(LOCATION_DECISION_KEY);
    let hasGrantedLocation = false;

    if (saved) {
      try {
        setStoredLocation(JSON.parse(saved) as StoredLocation);
        setPermissionState("granted");
        hasGrantedLocation = true;
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }

    if (!hasGrantedLocation && decision === "denied") {
      setPermissionState("denied");
    }

    if (!hasGrantedLocation && decision !== "denied" && "permissions" in navigator && navigator.permissions?.query) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((result) => setPermissionState(result.state as "granted" | "denied" | "prompt"))
        .catch(() => undefined);
    }
  }, []);

  function requestLocation() {
    if (!("geolocation" in navigator)) {
      setPermissionState("denied");
      return;
    }

    setPending(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const nextLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          grantedAt: new Date().toISOString()
        } satisfies StoredLocation;

        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextLocation));
        window.localStorage.setItem(LOCATION_DECISION_KEY, "granted");
        setStoredLocation(nextLocation);
        setPermissionState("granted");
        setPending(false);
      },
      () => {
        window.localStorage.setItem(LOCATION_DECISION_KEY, "denied");
        setPermissionState("denied");
        setPending(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 1000 * 60 * 60 * 24 }
    );
  }

  return (
    <Card className="space-y-4 p-5">
      <div className="flex items-start gap-3">
        <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent)]">
          <MapPin className="h-5 w-5" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">{copy.title}</h2>
          <p className="text-sm leading-6 text-[var(--muted)]">{copy.text}</p>
        </div>
      </div>

      {permissionState === "granted" && storedLocation ? (
        <div className="rounded-[20px] border border-[var(--line)] bg-white p-4 text-sm">
          <div className="flex items-center gap-2 font-medium text-[var(--foreground)]">
            <ShieldCheck className="h-4 w-4 text-[var(--petrol)]" />
            {copy.granted}
          </div>
          <p className="mt-2 text-[var(--muted)]">{copy.saved}</p>
        </div>
      ) : (
        <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={requestLocation} disabled={pending}>
          {pending ? (
            <>
              <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
              {copy.grant}
            </>
          ) : (
            copy.grant
          )}
        </Button>
      )}

      {permissionState === "denied" ? <p className="text-sm text-[var(--muted)]">{copy.denied}</p> : null}
      {permissionState !== "idle" ? (
        <div className="flex flex-col gap-3 sm:flex-row">
          {permissionState === "granted" ? (
            <Button type="button" variant="secondary" className="w-full sm:w-auto" onClick={requestLocation} disabled={pending}>
              {copy.refresh}
            </Button>
          ) : null}
          <button
            type="button"
            className="min-h-12 rounded-2xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--foreground)] transition hover:border-[var(--line-strong)]"
            onClick={() => {
              window.localStorage.removeItem(STORAGE_KEY);
              window.localStorage.removeItem(LOCATION_DECISION_KEY);
              setStoredLocation(null);
              setPermissionState("prompt");
            }}
          >
            {copy.reset}
          </button>
        </div>
      ) : null}
    </Card>
  );
}

