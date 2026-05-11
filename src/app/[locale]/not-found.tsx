import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import CarteCongoDecor from '@/components/CarteCongoDecor';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'notFound' });

  return (
    <main className="w-full relative overflow-hidden bg-background flex flex-col items-center justify-center min-h-screen mt-0 px-6">

      {/* Congo map — décoratif, très estompé */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none opacity-[0.04]">
        <CarteCongoDecor className="w-[600px] max-w-full" />
      </div>

      {/* Halo vert en arrière-plan */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, color-mix(in srgb, var(--green-app) 8%, transparent) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-lg">

        {/* Grand nombre 404 */}
        <div className="flex items-center gap-2 select-none" aria-hidden="true">
          <span className="text-[120px] sm:text-[160px] font-extrabold leading-none text-foreground/10 tracking-tighter">
            4
          </span>
          <div
            className="w-20 h-20 sm:w-28 sm:h-28 rounded-full flex-shrink-0 flex items-center justify-center"
            style={{
              background: 'var(--green-app)',
              boxShadow: '0 0 60px color-mix(in srgb, var(--green-app) 40%, transparent)',
            }}
          >
            <span className="text-[40px] sm:text-[56px] font-extrabold leading-none text-white">
              0
            </span>
          </div>
          <span className="text-[120px] sm:text-[160px] font-extrabold leading-none text-foreground/10 tracking-tighter">
            4
          </span>
        </div>

        {/* Texte */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-foreground/55 text-base leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-foreground/85 transition-all hover:gap-3 w-full sm:w-auto justify-center"
          >
            {t('backHome')}
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                fill="currentColor"
              />
            </svg>
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="inline-flex items-center gap-2 border border-foreground/20 text-foreground/70 px-7 py-3.5 rounded-full font-semibold text-sm hover:border-foreground/50 hover:text-foreground transition-all w-full sm:w-auto justify-center"
          >
            {t('contact')}
          </Link>
        </div>

      </div>
    </main>
  );
}
