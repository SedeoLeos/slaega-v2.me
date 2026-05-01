import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  poweredByHeader: false,
  reactStrictMode: true,

  // PROXY approach for Next.js 16 + next-intl (no middleware for i18n)
  // Rewrites non-prefixed URLs transparently to the default locale (fr)
  async rewrites() {
    return [
      {
        // Match any path that doesn't already start with a locale, admin, api, _next, or static files
        source: '/((?!fr|en|admin|api|_next|favicon\\.ico|images|icons).*)',
        destination: '/fr/$1',
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts');
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: ['remark-gfm'],
    rehypePlugins: [],
  },
});

export default withNextIntl(withMDX(nextConfig));
