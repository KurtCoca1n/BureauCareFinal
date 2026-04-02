"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CircleHelp, X } from "lucide-react";

import { getGlossaryCopy, getGlossaryEntry } from "@/lib/glossary";

type ExplainableTermProps = {
  termId: string;
  locale: string;
  children: string;
};

type PopupPosition =
  | {
      mode: "floating";
      top: number;
      left: number;
      width: number;
    }
  | {
      mode: "sheet";
    };

export function ExplainableTerm({ termId, locale, children }: ExplainableTermProps) {
  const entry = useMemo(() => getGlossaryEntry(termId, locale), [termId, locale]);
  const copy = useMemo(() => getGlossaryCopy(locale), [locale]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const popupId = useId();
  const [hoverOpen, setHoverOpen] = useState(false);
  const [pinnedOpen, setPinnedOpen] = useState(false);
  const [position, setPosition] = useState<PopupPosition | null>(null);

  const isOpen = Boolean(entry) && (hoverOpen || pinnedOpen);

  const supportsHover = useMemo(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia("(hover: hover)").matches;
  }, []);

  useEffect(() => {
    if (!isOpen || !entry || !triggerRef.current) {
      return;
    }

    const updatePosition = () => {
      const rect = triggerRef.current?.getBoundingClientRect();
      if (!rect) return;

      if (window.innerWidth < 640) {
        setPosition((current) => (current?.mode === "sheet" ? current : { mode: "sheet" }));
        return;
      }

      const width = Math.min(360, Math.max(280, window.innerWidth * 0.28));
      const left = Math.min(window.innerWidth - width - 16, Math.max(16, rect.left));
      const top = Math.min(window.innerHeight - 24, rect.bottom + 12);

      setPosition((current) => {
        if (
          current?.mode === "floating" &&
          current.top === top &&
          current.left === left &&
          current.width === width
        ) {
          return current;
        }

        return {
          mode: "floating",
          top,
          left,
          width
        };
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [entry, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handlePointer = (event: MouseEvent) => {
      const target = event.target as Node;
      if (triggerRef.current?.contains(target) || popupRef.current?.contains(target)) {
        return;
      }

      setHoverOpen(false);
      setPinnedOpen(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setHoverOpen(false);
        setPinnedOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  if (!entry) {
    return <>{children}</>;
  }

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        aria-describedby={isOpen ? popupId : undefined}
        aria-expanded={isOpen}
        onMouseEnter={() => {
          if (supportsHover) {
            setHoverOpen(true);
          }
        }}
        onMouseLeave={() => {
          if (supportsHover && !pinnedOpen) {
            setHoverOpen(false);
          }
        }}
        onClick={() => {
          setPinnedOpen((current) => !current);
          setHoverOpen(false);
        }}
        className="explainable-term"
      >
        <span>{children}</span>
        <CircleHelp className="h-3.5 w-3.5 shrink-0" />
      </button>

      {isOpen && position
        ? createPortal(
            <div
              id={popupId}
              ref={popupRef}
              role="dialog"
              aria-label={entry.label}
              onMouseEnter={() => {
                if (supportsHover) {
                  setHoverOpen(true);
                }
              }}
              onMouseLeave={() => {
                if (supportsHover && !pinnedOpen) {
                  setHoverOpen(false);
                }
              }}
              className="explainable-term-popover"
              style={
                position.mode === "sheet"
                  ? {
                      left: 16,
                      right: 16,
                      bottom: 16
                    }
                  : {
                      top: position.top,
                      left: position.left,
                      width: position.width
                    }
              }
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-strong)]">{copy.label}</p>
                  <h4 className="mt-2 text-base font-semibold text-[var(--foreground)]">{entry.label}</h4>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHoverOpen(false);
                    setPinnedOpen(false);
                  }}
                  className="rounded-full p-1 text-[var(--muted)] transition hover:bg-[var(--surface)] hover:text-[var(--foreground)]"
                  aria-label={copy.closeLabel}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <p className="mt-3 text-sm leading-6 text-[var(--foreground)]/88">{entry.explanation}</p>
              {entry.example ? (
                <div className="mt-4 rounded-[20px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">{copy.exampleLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--foreground)]/82">{entry.example}</p>
                </div>
              ) : null}
            </div>,
            document.body
          )
        : null}
    </>
  );
}
