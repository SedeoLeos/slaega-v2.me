"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Reveal from "../Reveal";
import type { Pensee, PenseeKind } from "@/entities/pensee";
import { PENSEE_KINDS, penseeKindLabel } from "@/entities/pensee";

type Filter = PenseeKind | "all";

export default function PenseesPage({ items }: { items: Pensee[] }) {
  const [filter, setFilter] = useState<Filter>("all");

  // Only show filter chips for kinds that actually have content.
  const kindsPresent = useMemo(() => {
    const set = new Set(items.map((i) => i.kind));
    return PENSEE_KINDS.filter((k) => set.has(k.value));
  }, [items]);

  const visible = useMemo(
    () => (filter === "all" ? items : items.filter((i) => i.kind === filter)),
    [items, filter],
  );

  return (
    <div className="slaega-root w-full bg-background px-6 pb-32 pt-16 font-[var(--font-inter)] text-foreground md:px-12 lg:px-16">
      {/* Header */}
      <Reveal className="flex flex-col gap-8 border-b border-foreground/10 pb-14">
        <span data-reveal-item className="text-[11px] uppercase tracking-[0.25em] text-foreground/45">
          <span className="text-green-app">✦</span> écrits &amp; pensées
        </span>
        <h1
          data-reveal-item
          className="font-space text-[clamp(2.4rem,9vw,7rem)] font-bold leading-[0.88] tracking-tighter text-foreground"
        >
          Ce que je <span className="text-green-app">crois</span>,
          <br />
          ce que j&apos;écris
        </h1>
        <p data-reveal-item className="max-w-[62ch] text-lg leading-relaxed text-foreground/55">
          Mes croyances, ma vision de l&apos;humanité, mes réflexions et les paroles de mes sons.
          slaega, ce n&apos;est pas que du code — c&apos;est aussi une voix.
        </p>
      </Reveal>

      {/* Filters */}
      {kindsPresent.length > 1 && (
        <div className="flex flex-wrap gap-2 pt-10">
          <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
            Tout
          </FilterChip>
          {kindsPresent.map((k) => (
            <FilterChip key={k.value} active={filter === k.value} onClick={() => setFilter(k.value)}>
              {k.label}
            </FilterChip>
          ))}
        </div>
      )}

      {/* Entries */}
      {visible.length === 0 ? (
        <p className="pt-16 text-foreground/40">Rien à afficher pour l&apos;instant.</p>
      ) : (
        <Reveal className="flex flex-col gap-px overflow-hidden rounded-[2px] bg-foreground/10 mt-10">
          {visible.map((p) => (
            <PenseeCard key={p.id} pensee={p} />
          ))}
        </Reveal>
      )}

      {/* CTA back */}
      <div className="flex flex-wrap gap-3 pt-20">
        <Link
          data-cursor
          href="/philosophie"
          className="inline-flex items-center gap-3 rounded-[2px] border border-foreground/15 px-6 py-4 font-space text-sm uppercase tracking-widest text-foreground transition-colors hover:border-green-app hover:text-green-app"
        >
          Ma philosophie <span aria-hidden>→</span>
        </Link>
        <Link
          data-cursor
          href="/moi"
          className="inline-flex items-center gap-3 rounded-[2px] border border-foreground/15 px-6 py-4 font-space text-sm uppercase tracking-widest text-foreground transition-colors hover:border-green-app hover:text-green-app"
        >
          Qui je suis <span aria-hidden>→</span>
        </Link>
      </div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      data-cursor
      onClick={onClick}
      className={`rounded-[2px] px-4 py-2 font-space text-xs uppercase tracking-widest transition-colors ${
        active
          ? "bg-green-app text-background"
          : "border border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function PenseeCard({ pensee }: { pensee: Pensee }) {
  const isDevise = pensee.kind === "devise";
  return (
    <article data-reveal-item className="bg-background p-8 md:p-10">
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className="font-space text-xs uppercase tracking-[0.2em] text-green-app">
          {penseeKindLabel(pensee.kind)}
        </span>
        <h2
          className={`font-space font-semibold tracking-tight text-foreground ${
            isDevise ? "text-2xl md:text-4xl" : "text-2xl md:text-3xl"
          }`}
        >
          {isDevise ? <span className="text-foreground/40">« </span> : null}
          {pensee.title}
          {isDevise ? <span className="text-foreground/40"> »</span> : null}
        </h2>
      </div>
      {pensee.subtitle && <p className="mt-1 text-sm text-foreground/40">{pensee.subtitle}</p>}
      {pensee.body && (
        <div className="mt-5 max-w-[72ch] whitespace-pre-line text-[15px] leading-relaxed text-foreground/65">
          {pensee.body}
        </div>
      )}
      {pensee.link && (
        <a
          data-cursor
          href={pensee.link}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-[2px] border border-foreground/15 px-5 py-3 font-space text-xs uppercase tracking-widest text-foreground transition-colors hover:border-green-app hover:text-green-app"
        >
          Écouter <span aria-hidden>↗</span>
        </a>
      )}
    </article>
  );
}
