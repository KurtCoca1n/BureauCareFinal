"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Compass, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/status-badge";
import { cn } from "@/lib/utils";

type Step = {
  id: string;
  target: string; // data-tour value
  title: string;
  body: string;
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function getRectForTarget(target: string): DOMRect | null {
  const el = document.querySelector(`[data-tour="${CSS.escape(target)}"]`) as HTMLElement | null;
  if (!el) return null;
  const rect = el.getBoundingClientRect();
  if (!rect || rect.width <= 0 || rect.height <= 0) return null;
  return rect;
}

function useSpotlightRect(active: boolean, target: string) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  const update = useCallback(() => {
    if (!active) return;
    setRect(getRectForTarget(target));
  }, [active, target]);

  useEffect(() => {
    if (!active) return;
    update();
    const onScroll = () => update();
    const onResize = () => update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [active, update]);

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(update, 450);
    return () => window.clearInterval(id);
  }, [active, update]);

  return rect;
}

function computeCalloutPosition(rect: DOMRect | null) {
  const vw = typeof window === "undefined" ? 0 : window.innerWidth;
  const vh = typeof window === "undefined" ? 0 : window.innerHeight;

  const width = Math.min(380, Math.max(300, Math.round(vw * 0.9)));
  const gutter = 14;

  if (!rect) {
    return {
      width,
      left: clamp((vw - width) / 2, gutter, Math.max(gutter, vw - width - gutter)),
      top: clamp(vh * 0.2, 80, Math.max(80, vh - 240))
    };
  }

  const preferBelow = rect.bottom + 16 + 220 < vh;
  const top = preferBelow ? rect.bottom + 16 : Math.max(gutter, rect.top - 16 - 220);
  const left = clamp(rect.left, gutter, Math.max(gutter, vw - width - gutter));
  return { width, left, top };
}

export function HomeGuidedTour() {
  const steps = useMemo<Step[]>(
    () => [
      {
        id: "home",
        target: "home-overview",
        title: "Home / Überblick",
        body: "Hier siehst du, was gerade wichtig ist und was als Nächstes ansteht."
      },
      {
        id: "upload",
        target: "home-upload",
        title: "Upload",
        body: "Hier kannst du Dokumente hochladen, damit BureauCare sie für dich verstehen und einordnen kann."
      },
      {
        id: "cases",
        target: "nav-cases",
        title: "Fälle",
        body: "Hier findest du alle offenen Vorgänge, bei denen etwas geprüft oder erledigt werden sollte."
      },
      {
        id: "processes",
        target: "nav-processes",
        title: "Anträge & Vorgänge",
        body: "Hier startest du typische Behördenschritte und findest passende Vorgänge."
      },
      {
        id: "week",
        target: "home-weekly",
        title: "Deine Woche",
        body: "Hier bündelt BureauCare, was du bald erledigen solltest."
      }
    ],
    []
  );

  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const step = steps[index] ?? steps[0]!;
  const rect = useSpotlightRect(open, step.target);
  const callout = computeCalloutPosition(rect);
  const lastFocused = useRef<HTMLElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    setIndex(0);
    lastFocused.current?.focus?.();
  }, []);

  const start = useCallback(() => {
    lastFocused.current = document.activeElement as HTMLElement | null;
    setIndex(0);
    setOpen(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "ArrowRight") {
        setIndex((v) => Math.min(steps.length - 1, v + 1));
      }
      if (e.key === "ArrowLeft") {
        setIndex((v) => Math.max(0, v - 1));
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open, steps.length]);

  const canBack = index > 0;
  const canNext = index < steps.length - 1;

  return (
    <>
      <Card className="border border-[var(--line)] bg-[rgba(255,255,255,0.92)] p-4 shadow-[0_12px_32px_rgba(43,43,43,0.04)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 space-y-1">
            <p className="text-sm font-semibold tracking-[-0.01em] text-[var(--foreground)]">
              Fühlt sich gerade nach viel an?
            </p>
            <p className="text-sm leading-relaxed text-[var(--muted)]">
              Kurz den Überblick bekommen – freiwillig und jederzeit schließbar.
            </p>
          </div>
          <Button onClick={start} variant="secondary" className="min-h-11 gap-2">
            <Compass className="h-4 w-4" aria-hidden />
            Kurze Tour starten
          </Button>
        </div>
      </Card>

      {open ? (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label="Kurze Tour">
          <div
            className="absolute inset-0 bg-[rgba(20,24,28,0.42)] backdrop-blur-[2px]"
            onMouseDown={(e) => {
              // Klick auf den Hintergrund schließt (ruhig, nicht zwingend).
              if (e.target === e.currentTarget) close();
            }}
          />

          {rect ? (
            <div
              className="absolute rounded-[22px] ring-1 ring-white/80"
              style={{
                top: Math.max(8, rect.top - 8),
                left: Math.max(8, rect.left - 8),
                width: Math.max(12, rect.width + 16),
                height: Math.max(12, rect.height + 16),
                boxShadow: "0 0 0 9999px rgba(20,24,28,0.42)"
              }}
              aria-hidden
            />
          ) : null}

          <div
            className="absolute"
            style={{
              top: callout.top,
              left: callout.left,
              width: callout.width
            }}
          >
            <Card className="border border-white/45 bg-[rgba(255,255,255,0.96)] p-5 shadow-[0_22px_54px_rgba(0,0,0,0.16)] sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <StatusBadge tone="neutral">
                      Schritt {index + 1} / {steps.length}
                    </StatusBadge>
                  </div>
                  <h3 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-[var(--muted)]">{step.body}</p>
                </div>
                <button
                  type="button"
                  onClick={close}
                  className={cn(
                    "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[var(--line)] bg-white/90 text-[var(--muted)]",
                    "hover:bg-white"
                  )}
                  aria-label="Tour schließen"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </div>

              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  variant="ghost"
                  onClick={() => setIndex((v) => Math.max(0, v - 1))}
                  disabled={!canBack}
                  className="min-h-11"
                >
                  Zurück
                </Button>

                {canNext ? (
                  <Button onClick={() => setIndex((v) => Math.min(steps.length - 1, v + 1))} className="min-h-11">
                    Weiter
                  </Button>
                ) : (
                  <Button onClick={close} className="min-h-11">
                    Fertig
                  </Button>
                )}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-[var(--muted)]/90">
                Tipp: ESC schließt. Pfeiltasten links/rechts wechseln Schritte.
              </p>
            </Card>
          </div>
        </div>
      ) : null}
    </>
  );
}

