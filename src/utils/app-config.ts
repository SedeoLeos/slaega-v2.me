import type { LocalePrefixMode } from 'next-intl/routing';

// 'as-needed': fr = no prefix (/ /contact /project), en = /en/ prefix
const localePrefix: LocalePrefixMode = 'as-needed';

export const AppConfig = {
    name: 'Slaega Me',
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localePrefix,
};