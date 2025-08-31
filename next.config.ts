import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';
import createMDX from '@next/mdx'
const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
    eslint: {
            dirs: ['.'],
        },
        poweredByHeader: false,
        reactStrictMode: true,
};
const withNextIntl = createNextIntlPlugin('./src/libs/i18n/request.ts');
const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    remarkPlugins: [ 'remark-gfm',],
    rehypePlugins: [ ],
  },
})
export default withNextIntl(withMDX(nextConfig));
