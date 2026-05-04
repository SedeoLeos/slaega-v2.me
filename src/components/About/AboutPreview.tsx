import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { aboutPageRepository } from '@/features/about/repositories/about-page.repository';

/**
 * Compact About preview for the homepage —
 * shows only label, title, intro paragraph and a CTA towards /about.
 */
export default async function AboutPreview() {
  const [about, t] = await Promise.all([
    aboutPageRepository.getCurrent().catch(() => null),
    getTranslations('aboutPreview'),
  ]);
  if (!about) return null;

  return (
    <section className="w-full max-w-content self-center px-10 md:px-20 py-20 font-poppins flex flex-col items-center">
      <div className="text-center max-w-2xl mx-auto flex flex-col items-center gap-5">
        <span className="text-xs font-semibold uppercase tracking-widest text-green-app">
          {about.label}
        </span>
        <h2 className="text-5xl sm:text-6xl font-extrabold leading-tight">{about.title}</h2>

        {about.intro && (
          <p className="text-base leading-relaxed text-foreground/70 mt-2 max-w-xl">
            {about.intro}
          </p>
        )}

        <Link
          href="/about"
          className="inline-flex items-center gap-2 bg-foreground text-background py-3.5 px-8 rounded-full font-semibold text-sm hover:bg-foreground/85 transition-colors mt-4"
        >
          {t('cta')}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
              fill="currentColor"
            />
          </svg>
        </Link>
      </div>
    </section>
  );
}
