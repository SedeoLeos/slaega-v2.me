'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from '@/libs/i18n/navigation';
import { AppConfig } from '@/utils/app-config';
import { useTransition } from 'react';

const LOCALE_LABELS: Record<string, { label: string; flag: string }> = {
  fr: { label: 'FR', flag: '🇫🇷' },
  en: { label: 'EN', flag: '🇬🇧' },
  es: { label: 'ES', flag: '🇪🇸' },
  pt: { label: 'PT', flag: '🇧🇷' },
};

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (next: string) => {
    if (next === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: next });
    });
  };

  return (
    <div className="flex items-center gap-1" aria-label="Changer de langue">
      {AppConfig.locales.map((loc) => {
        const { label, flag } = LOCALE_LABELS[loc] ?? { label: loc.toUpperCase(), flag: '' };
        const isActive = loc === locale;
        return (
          <button
            key={loc}
            type="button"
            disabled={isPending}
            onClick={() => switchLocale(loc)}
            title={label}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all duration-200 select-none
              ${isActive
                ? 'bg-green-app text-white shadow-sm shadow-green-app/30 cursor-default'
                : 'text-foreground/50 hover:text-foreground hover:bg-foreground/8 cursor-pointer'
              }
              ${isPending ? 'opacity-50 pointer-events-none' : ''}
            `}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="text-[13px] leading-none">{flag}</span>
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
