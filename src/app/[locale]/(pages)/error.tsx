'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useLocale, useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('errorPage');
  const locale = useLocale();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="w-full flex flex-col items-center justify-center min-h-[60vh] px-6 py-24">

      {/* Halo rouge en arrière-plan */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(239,68,68,0.06) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 flex flex-col items-center text-center gap-8 max-w-md">

        {/* Icône erreur */}
        <div className="relative">
          <div className="absolute inset-0 -m-4 rounded-full blur-xl bg-red-500/20 pointer-events-none" />
          <div className="relative w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg shadow-red-500/30">
            <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
          </div>
        </div>

        {/* Texte */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            {t('title')}
          </h1>
          <p className="text-foreground/55 text-base leading-relaxed">
            {t('description')}
          </p>
          {error.digest && (
            <p className="text-xs text-foreground/25 font-mono mt-2">
              ref: {error.digest}
            </p>
          )}
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-2 bg-red-500 text-white px-7 py-3.5 rounded-full font-semibold text-sm hover:bg-red-600 transition-colors w-full sm:w-auto justify-center"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            {t('retry')}
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 border border-foreground/20 text-foreground/70 px-7 py-3.5 rounded-full font-semibold text-sm hover:border-foreground/50 hover:text-foreground transition-all w-full sm:w-auto justify-center"
          >
            {t('backHome')}
          </Link>
        </div>

      </div>
    </div>
  );
}
