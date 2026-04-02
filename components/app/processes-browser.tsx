"use client";

import Link from "next/link";
import type { Route } from "next";
import { useDeferredValue, useMemo, useState } from "react";
import {
  ArrowRight,
  Brain,
  BriefcaseBusiness,
  Building2,
  Calculator,
  FileSearch,
  Globe2,
  GraduationCap,
  HeartHandshake,
  Search,
  ShieldPlus
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { StatusBadge } from "@/components/ui/status-badge";
import { getProcedureHref } from "@/lib/process-details";
import {
  getAuthorityDescription,
  getAuthorityLabel,
  getProcedureAvailabilityLabel,
  getProcedureSubtitle,
  getProcedureTitle,
  getProcessesCopy,
  processAuthorities,
  processProcedures,
  type ProcessAuthority
} from "@/lib/processes-ui";
import { rankProcesses } from "@/lib/process-search";
import { cn } from "@/lib/utils";

const iconMap = {
  briefcase: BriefcaseBusiness,
  search: FileSearch,
  heart: HeartHandshake,
  calculator: Calculator,
  building: Building2,
  globe: Globe2,
  shield: ShieldPlus,
  graduation: GraduationCap
} as const;

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

export function ProcessesBrowser({ locale }: { locale: string }) {
  const copy = getProcessesCopy(locale);
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query);
  const normalizedQuery = normalizeText(deferredQuery);
  const [selectedAuthorityId, setSelectedAuthorityId] = useState<string | null>(null);

  const searchOutcome = useMemo(
    () => rankProcesses(locale, deferredQuery, selectedAuthorityId),
    [deferredQuery, locale, selectedAuthorityId]
  );

  const filteredAuthorities = useMemo(() => {
    if (!normalizedQuery) {
      return processAuthorities;
    }

    if (searchOutcome.authorities.length) {
      return searchOutcome.authorities.map((entry) => entry.authority);
    }

    return processAuthorities.filter((authority) => authority.id === selectedAuthorityId);
  }, [normalizedQuery, searchOutcome.authorities, selectedAuthorityId]);

  const visibleProcedures = useMemo(() => {
    if (!normalizedQuery) {
      return processProcedures.filter((procedure) => !selectedAuthorityId || procedure.authorityIds.includes(selectedAuthorityId));
    }

    return searchOutcome.results.map((entry) => entry.procedure);
  }, [normalizedQuery, searchOutcome.results, selectedAuthorityId]);

  const activeAuthority = processAuthorities.find((authority) => authority.id === selectedAuthorityId) ?? null;
  const bestMatchProcedure = searchOutcome.bestMatch?.procedure ?? null;
  const highlightedProcedure = bestMatchProcedure ?? visibleProcedures[0] ?? null;
  const hasActiveSearch = normalizedQuery.length > 0;

  return (
    <div className="space-y-8">
      <section className="space-y-4 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone="accent">{copy.authoritySectionTitle}</StatusBadge>
          <span className="text-sm text-[var(--muted)]">{copy.intro}</span>
        </div>
        <div className="space-y-3">
          <h1 className="page-title page-title-accent text-3xl sm:text-4xl">{copy.title}</h1>
          <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(246,251,251,0.92))] p-4 sm:p-5">
            <div className="flex items-center gap-3 rounded-[24px] border border-white/80 bg-white/80 px-4 py-3 shadow-[var(--shadow-soft)]">
              <div className="rounded-2xl bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
                <Search className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={copy.searchPlaceholder}
                  aria-label={copy.searchPlaceholder}
                  className="min-h-14 border-0 bg-transparent px-0 text-base shadow-none focus:border-0 focus:shadow-none"
                />
                <p className="text-sm text-[var(--muted)]">{hasActiveSearch ? copy.searchActiveHint : copy.searchCaption}</p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {hasActiveSearch ? (
        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(244,250,249,0.94))] p-5">
            <div className="flex items-start gap-4">
              <div className="rounded-[22px] bg-[var(--accent-soft)] p-3 text-[var(--accent-strong)]">
                <Brain className="h-5 w-5" />
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-semibold text-[var(--accent-strong)]">{copy.semanticTitle}</p>
                  <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
                    {bestMatchProcedure ? copy.bestMatchText : copy.semanticHint}
                  </h2>
                </div>
                <p className="text-sm leading-6 text-[var(--muted)]">
                  {searchOutcome.hasSemanticInterpretation ? copy.semanticHint : copy.searchCaption}
                </p>
                {bestMatchProcedure ? (
                  <div className="rounded-[24px] border border-[var(--line)] bg-white/90 p-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge tone="accent">{copy.bestMatchLabel}</StatusBadge>
                      <StatusBadge tone="success">{getProcedureAvailabilityLabel(bestMatchProcedure, locale)}</StatusBadge>
                    </div>
                    <h3 className="mt-3 text-lg font-semibold">{getProcedureTitle(bestMatchProcedure, locale)}</h3>
                    <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{getProcedureSubtitle(bestMatchProcedure, locale)}</p>
                    <Link
                      href={getProcedureHref(bestMatchProcedure.id) as Route}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)]"
                    >
                      {copy.openPlaceholder}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </Card>

          <Card className="border-[var(--line)] bg-white/92 p-5">
            <div className="space-y-3">
              <h2 className="text-base font-semibold">{copy.alternativeMatchesLabel}</h2>
              <div className="flex flex-wrap gap-2">
                {(searchOutcome.authorities.length
                  ? searchOutcome.authorities.slice(0, 4).map((entry) => entry.authority)
                  : filteredAuthorities.slice(0, 4)
                ).map((authority) => (
                  <button
                    key={authority.id}
                    type="button"
                    onClick={() => setSelectedAuthorityId(authority.id)}
                    className={cn(
                      "rounded-full border px-3 py-2 text-sm font-semibold transition",
                      selectedAuthorityId === authority.id
                        ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                        : "border-[var(--line)] bg-white text-[var(--muted)] hover:text-[var(--foreground)]"
                    )}
                  >
                    {getAuthorityLabel(authority, locale)}
                  </button>
                ))}
              </div>
            </div>
          </Card>
        </section>
      ) : null}

      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{copy.authoritySectionTitle}</h2>
            <p className="text-sm text-[var(--muted)]">{copy.authoritySectionHint}</p>
          </div>
          <button
            type="button"
            onClick={() => setSelectedAuthorityId(null)}
            className={cn(
              "rounded-full border px-4 py-2 text-sm font-semibold transition",
              !selectedAuthorityId
                ? "border-[var(--accent)] bg-[var(--accent-soft)] text-[var(--accent-strong)]"
                : "border-[var(--line)] bg-white/70 text-[var(--muted)] hover:border-[var(--line-strong)] hover:text-[var(--foreground)]"
            )}
          >
            {copy.allAuthorities}
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {filteredAuthorities.map((authority) => {
            const Icon = iconMap[authority.icon];
            const isActive = selectedAuthorityId === authority.id;

            return (
              <button
                key={authority.id}
                type="button"
                onClick={() => setSelectedAuthorityId((current) => (current === authority.id ? null : authority.id))}
                className="text-left"
              >
                <Card
                  className={cn(
                    "h-full border-[var(--line)] p-5",
                    isActive && "border-[var(--line-strong)] bg-[var(--surface-strong)] shadow-[0_22px_52px_rgba(79,143,136,0.16)]"
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={cn(
                        "rounded-[22px] bg-gradient-to-br p-3 text-white shadow-[var(--shadow-soft)]",
                        authority.tint
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    {isActive ? <StatusBadge tone="accent">{copy.selectedAuthorityLabel}</StatusBadge> : null}
                  </div>
                  <div className="mt-5 space-y-2">
                    <h3 className="text-base font-semibold">{getAuthorityLabel(authority, locale)}</h3>
                    <p className="text-sm leading-6 text-[var(--muted)]">{getAuthorityDescription(authority, locale)}</p>
                  </div>
                </Card>
              </button>
            );
          })}
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.2fr)_minmax(300px,0.8fr)]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">{activeAuthority ? copy.proceduresTitle : copy.proceduresTitleAll}</h2>
              <p className="text-sm text-[var(--muted)]">
                {activeAuthority ? getAuthorityLabel(activeAuthority, locale) : hasActiveSearch ? copy.alternativeMatchesLabel : copy.authoritySectionHint}
              </p>
            </div>
            <StatusBadge tone={visibleProcedures.length ? "accent" : "neutral"}>
              {visibleProcedures.length} {copy.sampleCountLabel}
            </StatusBadge>
          </div>

          {visibleProcedures.length ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {visibleProcedures.map((procedure) => {
                const isSelected = highlightedProcedure?.id === procedure.id;
                const relatedAuthorities = procedure.authorityIds
                  .map((authorityId) => processAuthorities.find((authority) => authority.id === authorityId))
                  .filter((authority): authority is ProcessAuthority => Boolean(authority));
                const isBestMatch = bestMatchProcedure?.id === procedure.id;
                const isHighlighted = highlightedProcedure?.id === procedure.id;

                return (
                  <Link
                    key={procedure.id}
                    href={getProcedureHref(procedure.id) as Route}
                    className="text-left"
                  >
                    <Card
                      className={cn(
                        "h-full border-[var(--line)] p-5",
                        isHighlighted && "border-[var(--line-strong)] bg-[var(--surface-strong)]",
                        isBestMatch && "shadow-[0_24px_54px_rgba(95,163,163,0.14)]"
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-3">
                          <div className="flex flex-wrap gap-2">
                            {isBestMatch ? (
                              <StatusBadge tone="accent">{copy.bestMatchLabel}</StatusBadge>
                            ) : null}
                            {relatedAuthorities.map((authority) => (
                              <StatusBadge key={authority.id} tone="neutral">
                                {getAuthorityLabel(authority, locale)}
                              </StatusBadge>
                            ))}
                          </div>
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold tracking-[-0.03em]">{getProcedureTitle(procedure, locale)}</h3>
                            <p className="text-sm leading-6 text-[var(--muted)]">{getProcedureSubtitle(procedure, locale)}</p>
                          </div>
                        </div>
                        <ArrowRight className={cn("mt-1 h-4 w-4 shrink-0 text-[var(--muted)]", isHighlighted && "text-[var(--accent-strong)]")} />
                      </div>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <StatusBadge tone="success">{getProcedureAvailabilityLabel(procedure, locale)}</StatusBadge>
                        <span className="text-sm font-medium text-[var(--accent-strong)]">{copy.openPlaceholder}</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          ) : (
            <Card className="border-[var(--line)] p-6">
              <h3 className="text-lg font-semibold">{copy.emptySearchTitle}</h3>
              <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.emptySearchText}</p>
            </Card>
          )}
        </div>

        <aside>
          <Card className="border-[var(--line-strong)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,252,250,0.94))] p-6 xl:sticky xl:top-6">
            {highlightedProcedure ? (
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    <StatusBadge tone="accent">{bestMatchProcedure?.id === highlightedProcedure.id ? copy.bestMatchLabel : copy.openPlaceholder}</StatusBadge>
                    <StatusBadge tone="success">{getProcedureAvailabilityLabel(highlightedProcedure, locale)}</StatusBadge>
                  </div>
                  <h2 className="text-2xl font-semibold tracking-[-0.04em]">{getProcedureTitle(highlightedProcedure, locale)}</h2>
                  <p className="text-sm leading-6 text-[var(--muted)]">{getProcedureSubtitle(highlightedProcedure, locale)}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {highlightedProcedure.authorityIds.map((authorityId) => {
                    const authority = processAuthorities.find((entry) => entry.id === authorityId);
                    if (!authority) return null;

                    return (
                      <StatusBadge key={authority.id} tone="neutral">
                        {getAuthorityLabel(authority, locale)}
                      </StatusBadge>
                    );
                  })}
                </div>
                <div className="rounded-[24px] border border-[var(--line)] bg-white/80 p-4">
                  <p className="text-sm font-semibold text-[var(--foreground)]">{copy.authorityLabel}</p>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    {highlightedProcedure.authorityIds
                      .map((authorityId) => processAuthorities.find((entry) => entry.id === authorityId))
                      .filter((authority): authority is ProcessAuthority => Boolean(authority))
                      .map((authority) => getAuthorityLabel(authority, locale))
                      .join(" · ")}
                  </p>
                </div>
                <div className="rounded-[24px] border border-[var(--line)] bg-white/80 p-4">
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">{copy.comingSoon}</p>
                </div>
                <Link
                  href={getProcedureHref(highlightedProcedure.id) as Route}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--line-strong)] bg-white px-5 py-3 text-sm font-semibold text-[var(--foreground)] shadow-[var(--shadow-soft)] transition hover:border-[var(--accent)] hover:text-[var(--accent-strong)]"
                >
                  {copy.openPlaceholder}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">{copy.emptySearchTitle}</h2>
                <p className="text-sm leading-6 text-[var(--muted)]">{copy.emptySearchText}</p>
              </div>
            )}
          </Card>
        </aside>
      </section>
    </div>
  );
}
