'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/libs/i18n/navigation';
import { AppConfig } from '@/utils/app-config';
import { useTransition, useState, useRef, useEffect } from 'react';

const LOCALE_LABELS: Record<string, { label: string; flag: string }> = {
  fr: { label: 'FR', flag: '🇫🇷' },
  en: { label: 'EN', flag: '🇬🇧' },
  es: { label: 'ES', flag: '🇪🇸' },
  pt: { label: 'PT', flag: '🇧🇷' },
};

export default function LocaleSwitcher() {
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  /* Close on outside click */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const switchLocale = (next: string) => {
    if (next === locale) { setOpen(false); return; }
    startTransition(() => router.replace(pathname, { locale: next }));
    setOpen(false);
  };

  const current = LOCALE_LABELS[locale] ?? { label: locale.toUpperCase(), flag: '' };
  const others  = AppConfig.locales.filter((l) => l !== locale);

  return (
    <div ref={ref} className="relative" aria-label="Changer de langue">
      {/* Trigger — active locale only */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold
          border border-foreground/[0.08] hover:border-foreground/20
          text-foreground/60 hover:text-foreground bg-transparent hover:bg-foreground/[0.04]
          transition-all duration-200 select-none
          ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <span className="text-[12px] leading-none">{current.flag}</span>
        <span className="tracking-wide">{current.label}</span>
        {/* Chevron */}
        <svg
          className={`w-2.5 h-2.5 text-foreground/40 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-full mb-1.5 left-0 min-w-full bg-card border border-foreground/[0.08] rounded-lg shadow-lg shadow-foreground/[0.06] overflow-hidden z-50">
          {others.map((loc) => {
            const { label, flag } = LOCALE_LABELS[loc] ?? { label: loc.toUpperCase(), flag: '' };
            return (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                className="flex items-center gap-1.5 w-full px-2.5 py-1.5 text-xs font-semibold
                  text-foreground/55 hover:text-foreground hover:bg-foreground/[0.05]
                  transition-colors duration-150 select-none whitespace-nowrap"
              >
                <span className="text-[12px] leading-none">{flag}</span>
                <span className="tracking-wide">{label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
