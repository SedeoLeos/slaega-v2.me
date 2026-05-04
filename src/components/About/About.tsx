import Link from 'next/link';
import { aboutPageRepository } from '@/features/about/repositories/about-page.repository';
import ContentRenderer from '@/components/Content/ContentRenderer';

export default async function About() {
  const about = await aboutPageRepository.getCurrent().catch(() => null);

  // Fallback when DB has no record yet
  const data = about ?? {
    label: 'Apprenez à me connaître',
    title: 'À propos',
    intro: '',
    body: '',
    highlights: [],
    ctaText: 'Me contacter',
    ctaHref: '/contact',
  };

  const hasHighlights = data.highlights.length > 0;

  return (
    <section className="w-full max-w-content self-center px-10 md:px-20 py-24 font-poppins flex flex-col items-center">
      {/* Centered header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-green-app">
          {data.label}
        </span>
        <h2 className="text-5xl sm:text-6xl font-extrabold mt-3 leading-tight">{data.title}</h2>
      </div>

      {/* Intro paragraph — centered, big */}
      {data.intro && (
        <p className="max-w-3xl text-center text-lg leading-relaxed text-foreground/80 mb-10">
          {data.intro}
        </p>
      )}

      {/* Body — markdown content with collapse */}
      {data.body && (
        <div className="max-w-3xl w-full mb-12">
          <ContentRenderer content={data.body} collapseThreshold={2000} />
        </div>
      )}

      {/* Highlights grid */}
      {hasHighlights && (
        <div className="max-w-5xl w-full grid sm:grid-cols-2 gap-5 mb-12">
          {data.highlights.map((group, i) => (
            <div
              key={i}
              className="bg-card border border-foreground/5 rounded-2xl p-6 hover:border-foreground/15 transition-colors"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-5 rounded-full bg-green-app" />
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  {group.title}
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-xs font-medium text-foreground/70 bg-foreground/5 border border-foreground/10 px-3 py-1.5 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CTA */}
      <Link
        href={data.ctaHref}
        className="inline-flex items-center gap-2 bg-foreground text-background py-3.5 px-8 rounded-full font-semibold text-sm hover:bg-foreground/85 transition-colors"
      >
        {data.ctaText}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </section>
  );
}
