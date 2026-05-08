export const SiteConfig = {
  brand: 'Slaega',
  email: 'smatsoula19@gmail.com',
  socialLinks: {
    github: 'https://github.com/slaega',
    linkedin: 'https://linkedin.com/in/slaega',
    twitter: 'https://twitter.com/slaega',
    facebook: '#',
    instagram: '#',
    youtube: 'https://www.youtube.com/@slaega',
  },
  navLinks: [
    { href: '/', i18nKey: 'header.navigation.home', icon: 'home' as const },
    { href: '/project', i18nKey: 'header.navigation.myWork' },
    { href: '/experience', i18nKey: 'header.navigation.experience' },
    { href: '/about', i18nKey: 'header.navigation.about' },
    { href: '/contact', i18nKey: 'header.navigation.contactMe' },
  ],
} as const;
