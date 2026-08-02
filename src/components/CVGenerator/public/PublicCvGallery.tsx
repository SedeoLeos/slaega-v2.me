'use client';

import { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';

// react-pdf is client-only and heavy → load the viewer on demand.
const PublicCvViewer = dynamic(() => import('./PublicCvViewer'), { ssr: false });

export type PublicCvSummary = {
  id: string;
  title: string;
  language: string;
  createdAt: string;
  domain: string;
};

export default function PublicCvGallery({ items }: { items: PublicCvSummary[] }) {
  const [domain, setDomain] = useState<string>('all');
  const [open, setOpen] = useState<PublicCvSummary | null>(null);

  const domains = useMemo(() => {
    const set = new Set(items.map((i) => i.domain).filter(Boolean));
    return Array.from(set).sort();
  }, [items]);

  const visible = useMemo(
    () => (domain === 'all' ? items : items.filter((i) => i.domain === domain)),
    [items, domain],
  );

  // Deep-link: /cv?cv=<id> opens that CV directly (shareable link from admin).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('cv');
    if (!id) return;
    const match = items.find((i) => i.id === id);
    if (match) setOpen(match);
  }, [items]);

  return (
    <main className="slaega-root w-full px-6 pb-32 pt-28 font-[var(--font-inter)] text-foreground md:px-12 lg:px-16">
      {/* Header */}
      <div className="mx-auto flex max-w-content flex-col gap-6 border-b border-foreground/10 pb-14">
        <span className="font-space text-[11px] uppercase tracking-[0.25em] text-foreground/45">
          <span className="text-green-app">✦</span> curriculum vitæ
        </span>
        <h1 className="font-space text-[clamp(2.4rem,9vw,7rem)] font-bold leading-[0.9] tracking-tighter text-foreground">
          Mon CV, <span className="text-green-app">par domaine</span>
        </h1>
        <p className="max-w-[60ch] text-lg leading-relaxed text-foreground/55">
          Des CV ciblés selon le contexte — banque, fintech, full-stack, DevOps… Choisis celui qui
          correspond, prévisualise-le et télécharge-le.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="mx-auto max-w-content pt-16">
          <p className="text-foreground/50">
            Aucun CV public pour l&apos;instant. Reviens bientôt — ou{' '}
            <Link href="/contact" data-cursor className="text-green-app underline-offset-4 hover:underline">
              contacte-moi
            </Link>{' '}
            pour un CV sur mesure.
          </p>
        </div>
      ) : (
        <div className="mx-auto max-w-content">
          {/* Domain filters */}
          {domains.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-10">
              <Chip active={domain === 'all'} onClick={() => setDomain('all')}>
                Tout
              </Chip>
              {domains.map((d) => (
                <Chip key={d} active={domain === d} onClick={() => setDomain(d)}>
                  {d}
                </Chip>
              ))}
            </div>
          )}

          {/* Cards */}
          <div className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-foreground/10 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((cv) => (
              <button
                key={cv.id}
                type="button"
                data-cursor
                onClick={() => setOpen(cv)}
                className="group flex flex-col items-start gap-4 bg-background p-8 text-left transition-colors duration-500 hover:bg-foreground/[0.03]"
              >
                <span className="font-space text-4xl font-bold text-foreground/10 transition-colors group-hover:text-green-app/40">
                  CV
                </span>
                <div>
                  {cv.domain && (
                    <span className="font-space text-[11px] uppercase tracking-[0.2em] text-green-app">
                      {cv.domain}
                    </span>
                  )}
                  <h2 className="mt-1 font-space text-xl font-semibold text-foreground">{cv.title}</h2>
                </div>
                <span className="mt-auto inline-flex items-center gap-2 font-space text-sm text-foreground/60 transition-colors group-hover:text-green-app">
                  Voir &amp; télécharger
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {open && <PublicCvViewer id={open.id} title={open.title} onClose={() => setOpen(null)} />}
    </main>
  );
}

function Chip({
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
          ? 'bg-green-app text-background'
          : 'border border-foreground/15 text-foreground/70 hover:border-foreground/40 hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}
