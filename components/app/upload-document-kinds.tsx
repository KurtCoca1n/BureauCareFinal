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

export type UploadDocumentKindsCopy = {
  /** Kurze, warme Zeile unter der Einleitung */
  kindsInvitation?: string;
  kindsTitle: string;
  kindsIntro: string;
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
    <section className="rounded-[28px] border border-[rgba(95,163,163,0.14)] bg-[linear-gradient(165deg,rgba(255,255,255,0.96),rgba(246,250,249,0.88))] p-6 shadow-[0_14px_40px_rgba(43,43,43,0.04)] sm:p-8">
      <div className="max-w-2xl space-y-2">
        <h2 className="text-lg font-semibold tracking-[-0.02em] text-[var(--foreground)]">{copy.kindsTitle}</h2>
        <p className="text-sm leading-relaxed text-[var(--muted)]">{copy.kindsIntro}</p>
        {copy.kindsInvitation ? (
          <p className="text-sm leading-relaxed font-medium text-[var(--foreground)]/85">{copy.kindsInvitation}</p>
        ) : null}
      </div>

      <ul
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3"
        aria-label={copy.kindsTitle}
      >
        {items.map(({ label, Icon }) => (
          <li
            key={label}
            className="group flex flex-col gap-3 rounded-[22px] border border-[var(--line)] bg-white/90 p-4 shadow-[0_10px_28px_rgba(43,43,43,0.03)] transition hover:border-[rgba(95,163,163,0.35)] hover:shadow-[0_14px_32px_rgba(95,163,163,0.08)]"
          >
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[rgba(95,163,163,0.11)] text-[var(--accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition group-hover:bg-[rgba(95,163,163,0.16)]">
              <Icon className="h-5 w-5" aria-hidden />
            </span>
            <span className="text-sm font-medium leading-snug tracking-[-0.01em] text-[var(--foreground)]/95">{label}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
