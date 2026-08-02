import { SiteConfig } from './site-config';

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://slaega.me';

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
