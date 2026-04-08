"use client";

import { useState } from "react";
import {
  BellRing,
  Building2,
  ClipboardList,
  FileX,
  FolderOpen,
  Plane,
  Receipt,
  ScrollText,
  Ticket,
  type LucideIcon
} from "lucide-react";

import { Button } from "@/components/ui/button";

export type UploadDocumentKindsCopy = {
  /** Kurze, warme Zeile unter der Einleitung */
  kindsInvitation?: string;
  kindsTitle: string;
  kindsIntro: string;
  /** Kurzinfo im eingeklappten Zustand */
  kindsPeekLine: string;
  expandMore: string;
  expandLess: string;
  kindContracts: string;
  kindOfficial: string;
  kindInvoices: string;
  kindReminders: string;
  kindTerminations: string;
  kindForms: string;
  kindTravel: string;
  kindTickets: string;
  kindOther: string;
};

export function UploadDocumentKinds({ copy }: { copy: UploadDocumentKindsCopy }) {
  const [expanded, setExpanded] = useState(false);

  const items: { label: string; Icon: LucideIcon }[] = [
    { label: copy.kindContracts, Icon: ScrollText },
    { label: copy.kindOfficial, Icon: Building2 },
    { label: copy.kindInvoices, Icon: Receipt },
    { label: copy.kindReminders, Icon: BellRing },
    { label: copy.kindTerminations, Icon: FileX },
    { label: copy.kindForms, Icon: ClipboardList },
    { label: copy.kindTravel, Icon: Plane },
    { label: copy.kindTickets, Icon: Ticket },
    { label: copy.kindOther, Icon: FolderOpen }
  ];

  return (
    <section className="rounded-[22px] border border-[rgba(95,163,163,0.12)] bg-[linear-gradient(165deg,rgba(255,255,255,0.96),rgba(246,250,249,0.88))] p-5 shadow-[0_10px_32px_rgba(43,43,43,0.03)] sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
        <div className="min-w-0 space-y-1.5">
          <h2 className="text-lg font-semibold tracking-[-0.03em] text-[var(--foreground)] sm:text-xl">
            {copy.kindsTitle}
          </h2>
          {!expanded ? (
            <p className="text-sm leading-relaxed text-[var(--muted)] sm:text-[0.9375rem]">{copy.kindsPeekLine}</p>
          ) : (
            <>
              <p className="text-sm leading-relaxed text-[var(--muted)]">{copy.kindsIntro}</p>
              {copy.kindsInvitation ? (
                <p className="text-sm font-medium leading-relaxed text-[var(--foreground)]/85">{copy.kindsInvitation}</p>
              ) : null}
            </>
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          className="min-h-10 shrink-0 self-start px-4 py-2 text-xs sm:self-center"
          onClick={() => setExpanded((v) => !v)}
          aria-expanded={expanded}
        >
          {expanded ? copy.expandLess : copy.expandMore}
        </Button>
      </div>

      {expanded ? (
        <ul
          className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3"
          aria-label={copy.kindsTitle}
        >
          {items.map(({ label, Icon }) => (
            <li
              key={label}
              className="group flex flex-col gap-2.5 rounded-[18px] border border-[var(--line)] bg-white/90 p-3.5 shadow-[0_8px_22px_rgba(43,43,43,0.03)] transition hover:border-[rgba(95,163,163,0.3)]"
            >
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[rgba(95,163,163,0.11)] text-[var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition group-hover:bg-[rgba(95,163,163,0.16)]">
                <Icon className="h-4 w-4" aria-hidden />
              </span>
              <span className="text-sm font-medium leading-snug tracking-[-0.01em] text-[var(--foreground)]/95">{label}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
