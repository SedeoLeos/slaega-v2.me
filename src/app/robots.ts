import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "https://slaega.me";

  return {
    rules: [
      {
        // All well-behaved crawlers
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",     // CMS — never index
          "/api/",       // API routes
          "/_next/",     // Next.js internals
        ],
      },
      {
        // Block aggressive AI scrapers that ignore standard rules
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "CCBot",
          "anthropic-ai",
          "Claude-Web",
          "Omgilibot",
          "FacebookBot",
          "ia_archiver",
        ],
        disallow: "/",
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  };
}
