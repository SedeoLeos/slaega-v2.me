'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/libs/i18n/navigation';
import { AppConfig } from '@/utils/app-config';
import { useTransition, useState, useRef, useEffect } from 'react';

const LOCALES: Record<string, { label: string; native: string; flag: string }> = {
  fr: { label: 'FR', native: 'Français',   flag: '🇫🇷' },
  en: { label: 'EN', native: 'English',    flag: '🇬🇧' },
  es: { label: 'ES', native: 'Español',    flag: '🇪🇸' },
  pt: { label: 'PT', native: 'Português',  flag: '🇧🇷' },
};

export default function LocaleSwitcher() {
  const locale   = useLocale();
  const router   = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const down = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', down);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', down); document.removeEventListener('keydown', esc); };
  }, []);

  const switchLocale = (next: string) => {
    if (next === locale) { setOpen(false); return; }
    startTransition(() => router.replace(pathname, { locale: next }));
    setOpen(false);
  };

  const current = LOCALES[locale] ?? { label: locale.toUpperCase(), native: locale, flag: '🌐' };

  return (
    <div ref={ref} className="relative" aria-label="Language">

      {/* ── Trigger ── */}
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        disabled={isPending}
        className={`group inline-flex items-center gap-2 px-3 py-1.5 rounded-full
          border border-foreground/[0.07] hover:border-foreground/15
          bg-foreground/[0.03] hover:bg-foreground/[0.06]
          text-foreground/50 hover:text-foreground
          text-[11px] font-semibold tracking-widest uppercase
          transition-all duration-200 select-none
          ${isPending ? 'opacity-40 pointer-events-none' : ''}`}
      >
        {/* Globe icon */}
        <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 16 16" fill="none">
          <circle cx="8" cy="8" r="6.5" stroke="currentColor" strokeWidth="1.1"/>
          <path d="M8 1.5C8 1.5 5.5 4.5 5.5 8s2.5 6.5 2.5 6.5M8 1.5C8 1.5 10.5 4.5 10.5 8S8 14.5 8 14.5M1.5 8h13M2 5h12M2 11h12" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round"/>
        </svg>

        <span>{current.label}</span>

        {/* Chevron */}
        <svg
          className={`w-2.5 h-2.5 text-foreground/30 transition-transform duration-300 ${open ? '-rotate-180' : ''}`}
          viewBox="0 0 16 16" fill="none"
        >
          <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* ── Panel ── */}
      <div
        className={`absolute bottom-[calc(100%+8px)] left-0 z-50
          w-44 rounded-2xl overflow-hidden
          border border-foreground/[0.08]
          bg-card/90 backdrop-blur-xl
          shadow-xl shadow-foreground/[0.08]
          transition-all duration-200 origin-bottom-left
          ${open ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
      >
        {/* Header */}
        <div className="px-3 pt-2.5 pb-1.5 border-b border-foreground/[0.06]">
          <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-foreground/30">
            Language
          </p>
        </div>

        {/* Options */}
        <div className="p-1">
          {AppConfig.locales.map((loc) => {
            const info    = LOCALES[loc] ?? { label: loc.toUpperCase(), native: loc, flag: '🌐' };
            const isActive = loc === locale;
            return (
              <button
                key={loc}
                type="button"
                onClick={() => switchLocale(loc)}
                className={`flex items-center gap-2.5 w-full px-2.5 py-2 rounded-xl
                  text-left transition-all duration-150 select-none group/item
                  ${isActive
                    ? 'bg-green-app/10 text-green-app cursor-default'
                    : 'text-foreground/60 hover:text-foreground hover:bg-foreground/[0.05] cursor-pointer'
                  }`}
              >
                {/* Flag */}
                <span className="text-[15px] leading-none flex-shrink-0">{info.flag}</span>

                {/* Name */}
                <span className="flex-1 min-w-0">
                  <span className="block text-[11px] font-semibold leading-none">{info.native}</span>
                  <span className={`block text-[9px] font-medium mt-0.5 tracking-widest uppercase
                    ${isActive ? 'text-green-app/60' : 'text-foreground/30'}`}
                  >
                    {info.label}
                  </span>
                </span>

                {/* Active check */}
                {isActive && (
                  <svg className="w-3 h-3 flex-shrink-0 text-green-app" viewBox="0 0 16 16" fill="none">
                    <path d="M3 8l3.5 3.5L13 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
