import { getTranslations, getLocale } from 'next-intl/server';
import Link from 'next/link';
import CarteCongoDecor from '@/components/CarteCongoDecor';

export default async function NotFound() {
  const locale = await getLocale();
  const t = await getTranslations({ locale, namespace: 'notFound' });

  return (
    <main className="slaega-root relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#0B0B0B] px-6 py-24 font-[var(--font-inter)] text-white">
      {/* Congo map — décoratif, très estompé */}
      <div className="pointer-events-none absolute inset-0 flex select-none items-center justify-center opacity-[0.05]">
        <CarteCongoDecor stroke="#FF5A00" className="w-[620px] max-w-full" />
      </div>

      <div className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-white/45">
          <span className="text-[#FF5A00]">✦</span> erreur 404
        </span>

        {/* Grand nombre 404 */}
        <div
          aria-hidden
          className="mt-8 flex select-none items-center justify-center font-space text-[clamp(5rem,26vw,15rem)] font-bold leading-none tracking-tighter"
        >
          <span className="text-white/12">4</span>
          <span className="text-[#FF5A00]">0</span>
          <span className="text-white/12">4</span>
        </div>

        {/* Texte */}
        <h1 className="mt-6 font-space text-3xl font-bold tracking-tight text-white sm:text-5xl">
          {t('title')}
        </h1>
        <p className="mt-5 max-w-[46ch] text-lg leading-relaxed text-white/55">
          {t('description')}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <Link
            data-cursor
            href={`/${locale}`}
            className="group inline-flex items-center justify-center gap-3 rounded-[2px] bg-white px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors hover:bg-[#FF5A00]"
          >
            {t('backHome')}
            <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
          </Link>
          <Link
            data-cursor
            href={`/${locale}/contact`}
            className="inline-flex items-center justify-center gap-3 rounded-[2px] border border-white/15 px-7 py-4 font-space text-sm uppercase tracking-widest text-white transition-colors hover:border-[#FF5A00] hover:text-[#FF5A00]"
          >
            {t('contact')}
          </Link>
        </div>

        {/* Wordmark */}
        <span className="mt-16 font-space text-sm lowercase tracking-tight text-white/30">
          slaega<span className="text-[#FF5A00]">.</span>
        </span>
      </div>
    </main>
  );
}
