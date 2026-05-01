import type { LocalePrefixMode } from 'next-intl/routing';

// 'as-needed' = default locale (fr) has no prefix in URL (/), other locales get /en/
const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
    name: 'Slaega Me',
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localePrefix,
};