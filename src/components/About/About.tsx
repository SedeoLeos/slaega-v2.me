import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { aboutPageRepository } from '@/features/about/repositories/about-page.repository';
import ContentRenderer from '@/components/Content/ContentRenderer';
import Reveal from '@/components/slaega/Reveal';
import { CERTIFICATIONS } from '@/shared/config/certifications';

export default async function About() {
  const [about, t] = await Promise.all([
    aboutPageRepository.getCurrent().catch(() => null),
    getTranslations('about'),
  ]);

  // Fallback when DB has no record yet — uses i18n strings
  const data = about ?? {
    label: t('subtitle'),
    title: t('title'),
    intro: '',
    body: '',
    highlights: [],
    ctaText: t('contactCta'),
    ctaHref: '/contact',
  };

  const hasHighlights = data.highlights.length > 0;

  const explore = [
    { href: '/moi', title: 'La personne', desc: 'Seba Gedeon Matsoula Malonga' },
    { href: '/philosophie', title: 'La philosophie', desc: 'slaega = king sedeo leos' },
    { href: '/pensees', title: 'Mes écrits', desc: 'Croyances, vision, chansons' },
  ];

  return (
    <section className="slaega-root w-full px-6 pb-32 pt-28 font-[var(--font-inter)] text-foreground md:px-12 lg:px-16">
      {/* Header */}
      <Reveal className="mx-auto flex max-w-content flex-col gap-8 border-b border-foreground/10 pb-16">
        <span data-reveal-item className="font-space text-[11px] uppercase tracking-[0.25em] text-foreground/45">
          <span className="text-green-app">✦</span> {data.label}
        </span>
        <h1
          data-reveal-item
          className="font-space text-[clamp(2.6rem,9vw,7rem)] font-bold leading-[0.88] tracking-tighter text-foreground"
        >
          {data.title}
        </h1>
        {data.intro && (
          <p data-reveal-item className="max-w-[62ch] text-xl leading-relaxed text-foreground/70 md:text-2xl">
            {data.intro}
          </p>
        )}
      </Reveal>

      {/* Body — editorial two-column layout */}
      {data.body && (
        <section className="mx-auto max-w-content pt-24">
          <Reveal className="grid grid-cols-1 gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,15rem)_1fr]">
            {/* Sticky label column */}
            <div data-reveal-item className="lg:sticky lg:top-28 lg:self-start">
              <span className="font-space text-sm text-green-app">[ approche ]</span>
              <h2 className="mt-3 font-space text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
                Comment j&rsquo;interviens
              </h2>
              <span
                aria-hidden
                className="mt-6 hidden h-px w-16 bg-gradient-to-r from-green-app to-transparent lg:block"
              />
            </div>

            {/* Prose column */}
            <div
              data-reveal-item
              className="about-body max-w-[68ch] border-l border-foreground/10 pl-6 text-[15px] leading-relaxed text-foreground/70 md:pl-10 md:text-[16px]"
            >
              <ContentRenderer content={data.body} collapseThreshold={2000} />
            </div>
          </Reveal>
        </section>
      )}

      {/* Highlights */}
      {hasHighlights && (
        <section className="mx-auto max-w-content pt-24">
          <div className="mb-10 flex items-baseline gap-4 border-b border-foreground/10 pb-4">
            <span className="font-space text-sm text-green-app">[ expertise ]</span>
            <h2 className="font-space text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Ce que je maîtrise
            </h2>
          </div>
          <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-foreground/10 sm:grid-cols-2">
            {data.highlights.map((group, i) => (
              <div key={i} data-reveal-item className="bg-background p-8 md:p-10">
                <h3 className="font-space text-sm font-bold uppercase tracking-[0.15em] text-green-app">
                  {group.title}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-[2px] border border-foreground/12 px-2.5 py-1 font-space text-[11px] uppercase tracking-wide text-foreground/60"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </Reveal>
        </section>
      )}

      {/* Certifications */}
      {CERTIFICATIONS.length > 0 && (
        <section className="mx-auto max-w-content pt-24">
          <div className="mb-10 flex items-baseline gap-4 border-b border-foreground/10 pb-4">
            <span className="font-space text-sm text-green-app">[ certifications ]</span>
            <h2 className="font-space text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              Certifications
            </h2>
          </div>
          <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-foreground/10 sm:grid-cols-2">
            {CERTIFICATIONS.map((c) => {
              const Card = (
                <>
                  <div className="flex items-start gap-3">
                    <span aria-hidden className="mt-1 text-green-app">▪</span>
                    <div className="flex flex-col gap-1">
                      <p className="font-space text-[15px] font-semibold leading-snug text-foreground transition-colors group-hover:text-green-app">
                        {c.name}
                      </p>
                      <p className="text-[13px] text-foreground/55">
                        {c.issuer}
                        {c.year ? ` · ${c.year}` : ''}
                      </p>
                    </div>
                    {c.url && (
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto h-4 w-4 shrink-0 text-foreground/30 transition-all group-hover:translate-x-0.5 group-hover:text-green-app"
                      >
                        <path d="M7 17 17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    )}
                  </div>
                </>
              );
              return c.url ? (
                <a
                  key={c.url}
                  data-reveal-item
                  data-cursor
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-background p-6 transition-colors duration-500 hover:bg-foreground/[0.03]"
                >
                  {Card}
                </a>
              ) : (
                <div key={c.name} data-reveal-item className="group bg-background p-6">
                  {Card}
                </div>
              );
            })}
          </Reveal>
        </section>
      )}

      {/* CTA */}
      <Reveal className="mx-auto flex max-w-content flex-col items-start gap-8 pt-24">
        <div data-reveal-item className="flex flex-wrap gap-3">
          <Link
            data-cursor
            href={data.ctaHref}
            className="inline-flex items-center gap-3 rounded-[2px] bg-foreground px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:bg-green-app"
          >
            {data.ctaText} <span aria-hidden>→</span>
          </Link>
          <Link
            data-cursor
            href="/experience"
            className="inline-flex items-center gap-3 rounded-[2px] border border-foreground/15 px-7 py-4 font-space text-sm uppercase tracking-widest text-foreground transition-colors hover:border-green-app hover:text-green-app"
          >
            Mon parcours <span aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>

      {/* Aller plus loin */}
      <section className="mx-auto max-w-content pt-24">
        <div className="mb-8 flex items-baseline gap-4 border-b border-foreground/10 pb-4">
          <span className="font-space text-sm text-green-app">[ aller plus loin ]</span>
        </div>
        <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-foreground/10 sm:grid-cols-3">
          {explore.map((l) => (
            <Link
              key={l.href}
              data-reveal-item
              data-cursor
              href={l.href}
              className="group flex flex-col gap-1 bg-background p-8 transition-colors duration-500 hover:bg-foreground/[0.03]"
            >
              <p className="font-space text-lg font-semibold text-foreground transition-colors group-hover:text-green-app">
                {l.title}
              </p>
              <p className="text-sm text-foreground/50">{l.desc}</p>
              <span aria-hidden className="mt-3 font-space text-foreground/30 transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          ))}
        </Reveal>
      </section>
    </section>
  );
}
