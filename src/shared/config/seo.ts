import type { Metadata } from 'next';
import { SiteConfig } from './site-config';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://slaega.com';

export const FULL_NAME = 'Seba Gedeon Matsoula Malonga';

// Every name / alias the owner is known by — powers keywords + structured data.
export const ALIASES = [
  'slaega',
  'Slaega',
  'king sedeo leos',
  'King Sedeo Leos',
  'Sedeo Leos',
  'sedeo',
  'GDBA',
  'BKBSL',
  'BIG KING OF BEST SEDEO LEOS',
  'Leos',
  'Arion Evans',
  'Slaega19',
  'Slaega X',
  'tatomir',
];

// Professional / tech references — "me référencer par la tech, le niveau".
export const TECH_KEYWORDS = [
  'Architecte logiciel',
  'Software architect',
  'Ingénieur logiciel',
  'Développeur full-stack',
  'Full-stack developer',
  'DevOps',
  'Cloud',
  'Mobile',
  'Backend',
  'React',
  'Next.js',
  'React Native',
  'Node.js',
  'NestJS',
  'TypeScript',
  'Kubernetes',
  'Docker',
  'Argo CD',
  'GitOps',
  'OpenFGA',
  'Keycloak',
  'SpiceDB',
  'Permit.io',
  'IAM',
  'PostgreSQL',
  'Brazzaville',
  'Congo',
];

export const KEYWORDS = [FULL_NAME, 'Seba Gedeon', 'Seba Gedeon Matsoula', ...ALIASES, ...TECH_KEYWORDS];

// Public profiles for schema.org sameAs.
export const SAME_AS = [
  SiteConfig.socialLinks.github,
  SiteConfig.socialLinks.linkedin,
  SiteConfig.socialLinks.twitter,
  SiteConfig.socialLinks.youtube,
  'https://audiomack.com/seba-g',
].filter((u) => u && u !== '#');

/** schema.org Person JSON-LD for the site owner. */
export function personJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: FULL_NAME,
    alternateName: ALIASES,
    jobTitle: 'Architecte logiciel',
    description:
      'Architecte logiciel & développeur full-stack — mobile, web, backend et infrastructures cloud sécurisées (DevOps, IAM). Basé à Brazzaville.',
    url: SITE_URL,
    image: `${SITE_URL}/images/me.jpg`,
    email: `mailto:${SiteConfig.email}`,
    sameAs: SAME_AS,
    knowsAbout: TECH_KEYWORDS,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Brazzaville',
      addressCountry: 'CG',
    },
    brand: { '@type': 'Brand', name: 'slaega', slogan: 'king sedeo leos' },
  };
}

// ── Per-page metadata helper ─────────────────────────────────────────────────
// Every public page uses this so it gets a CORRECT self-canonical + hreflang
// (otherwise sub-pages inherit the layout's canonical → they'd all point to the
// home page, which reads as duplicate content to Google).

const OG_LOCALE: Record<string, string> = {
  fr: 'fr_FR',
  en: 'en_US',
  es: 'es_ES',
  pt: 'pt_PT',
};

/** Absolute URL for a locale + path (fr has no prefix — localePrefix "as-needed"). */
export function localizedUrl(locale: string, path = ''): string {
  const prefix = locale === 'fr' ? '' : `/${locale}`;
  return `${SITE_URL}${prefix}${path}`;
}

export type PageMetaInput = {
  /** Page title (the "%s — slaega" template is applied on top). */
  title: string;
  description: string;
  /** Path after the locale prefix, e.g. "/about", "/project/foo" ("" = home). */
  path?: string;
  /** Extra, page-specific keywords (prepended to the global set). */
  keywords?: string[];
  /** OpenGraph/Twitter image (defaults to the portrait). */
  image?: string;
  /** article for content pages, website otherwise. */
  type?: 'website' | 'article';
  noIndex?: boolean;
};

/** Build a fully self-referential Metadata object for a localized page. */
export function buildPageMetadata(locale: string, opts: PageMetaInput): Metadata {
  const path = opts.path ?? '';
  const url = localizedUrl(locale, path);
  const image = opts.image ?? '/images/me.jpg';
  return {
    title: opts.title,
    description: opts.description,
    keywords: opts.keywords ? [...opts.keywords, ...KEYWORDS] : KEYWORDS,
    alternates: {
      canonical: url,
      languages: {
        fr: localizedUrl('fr', path),
        en: localizedUrl('en', path),
        'x-default': localizedUrl('fr', path),
      },
    },
    openGraph: {
      type: opts.type ?? 'website',
      title: opts.title,
      description: opts.description,
      url,
      siteName: 'slaega — ' + FULL_NAME,
      locale: OG_LOCALE[locale] ?? 'fr_FR',
      images: [{ url: image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: opts.title,
      description: opts.description,
      images: [image],
    },
    ...(opts.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}

/** schema.org WebSite JSON-LD. */
export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'slaega',
    alternateName: FULL_NAME,
    url: SITE_URL,
    inLanguage: ['fr', 'en'],
  };
}
