export const SiteConfig = {
  brand: 'Slaega',
  email: 'smatsoula19@gmail.com',
  socialLinks: {
    linkedin: '#',
    github: '#',
    facebook: '#',
    instagram: '#',
    twitter: '#',
    youtube: '#',
  },
  navLinks: [
    { href: '/', i18nKey: 'header.navigation.home' },
    { href: '/project', i18nKey: 'header.navigation.myWork' },
    { href: '/about', i18nKey: 'header.navigation.about' },
    { href: '/tools/cv-generator', i18nKey: 'header.navigation.cvGenerator' },
    { href: '/tools/content-editor', i18nKey: 'header.navigation.contentEditor' },
    { href: '/contact', i18nKey: 'header.navigation.contactMe' },
  ],
} as const;
