import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/ui/page-shell";

export default function NotFound() {
  return (
    <PageShell className="justify-center gap-6 py-10">
      <Card className="mx-auto w-full max-w-xl space-y-5 p-8 text-center">
        <p className="text-sm uppercase tracking-[0.24em] text-[var(--muted)]">404</p>
        <h1 className="text-3xl font-semibold tracking-[-0.03em]">Diese Seite wurde nicht gefunden.</h1>
        <p className="text-sm leading-7 text-[var(--muted)]">
          Möglicherweise wurde der Link verändert oder die Seite gehört nicht zu deinem aktuellen Bereich.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl bg-[var(--accent)] px-5 text-sm font-medium text-white shadow-[var(--shadow-soft)] transition hover:bg-[var(--accent-strong)]"
          >
            Zur Startseite
          </Link>
          <Link
            href="/app"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-5 text-sm font-medium text-[var(--foreground)]"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Zum Dashboard
          </Link>
        </div>
      </Card>
    </PageShell>
  );
}

