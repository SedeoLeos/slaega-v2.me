import createMDX from '@next/mdx';
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const securityHeaders = [
  { key: "X-Content-Type-Options",     value: "nosniff" },
  { key: "X-Frame-Options",            value: "DENY" },
  { key: "Referrer-Policy",            value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy",         value: "camera=(), microphone=(), geolocation=()" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  poweredByHeader: false,
  reactStrictMode: true,

  images: {
    // Live project previews are rendered by WordPress mShots at runtime.
    remotePatterns: [
      { protocol: 'https', hostname: 's.wordpress.com' },
    ],
  },

  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },

  // NOTE: sitemap.xml / robots.txt are STATIC files in public/, generated at
  // build time by scripts/gen-seo.ts (see prebuild). Static public/ assets are
  // served directly by the Vercel CDN, so no rewrite/route handler is needed —
  // and none can be, given every routed attempt 404'd in production.
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
