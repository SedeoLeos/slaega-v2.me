import { projectRepository } from "@/features/projects/repositories/project.repository";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";

/**
 * /sitemap.xml as an explicit Route Handler.
 *
 * Why not app/sitemap.ts (metadata route) nor public/sitemap.xml: both end up
 * as a statically-generated .xml asset that the Vercel CDN serves with a
 * text/html Content-Type on this project — which browsers and Google Search
 * Console reject as "not XML", and which neither next.config nor vercel.json
 * could override.
 *
 * A `force-dynamic` route handler is a serverless function: WE set the response
 * Content-Type ourselves, so it is always `application/xml` and never subject to
 * static-asset handling. /sitemap.xml is excluded from the i18n middleware
 * (proxy.ts) so this route is reached without being rewritten to a locale path.
 */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://slaega.com").replace(/\/+$/, "");
const LOCALES = ["fr", "en", "es", "pt"] as const;
const DEFAULT_LOCALE = "fr";

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
type Entry = { path: string; lastmod: string; changefreq: Freq; priority: number };

const STATIC_ROUTES: { path: string; priority: number; changefreq: Freq }[] = [
  { path: "", priority: 1.0, changefreq: "weekly" },
  { path: "/project", priority: 0.9, changefreq: "weekly" },
  { path: "/experience", priority: 0.8, changefreq: "monthly" },
  { path: "/about", priority: 0.7, changefreq: "monthly" },
  { path: "/moi", priority: 0.7, changefreq: "monthly" },
  { path: "/philosophie", priority: 0.6, changefreq: "monthly" },
  { path: "/pensees", priority: 0.6, changefreq: "weekly" },
  { path: "/cv", priority: 0.6, changefreq: "monthly" },
  { path: "/birthday", priority: 0.4, changefreq: "yearly" },
  { path: "/contact", priority: 0.6, changefreq: "yearly" },
];

const abs = (path: string, locale: string = DEFAULT_LOCALE) =>
  `${BASE}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${path}`;

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

function companySlug(company: string): string {
  return company
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function renderUrl(e: Entry): string {
  const alternates = LOCALES.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(abs(e.path, l))}"/>`,
  ).join("\n");
  return `  <url>
    <loc>${xmlEscape(abs(e.path))}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
${alternates}
  </url>`;
}

async function buildEntries(now: string): Promise<Entry[]> {
  const entries: Entry[] = STATIC_ROUTES.map((r) => ({
    path: r.path,
    lastmod: now,
    changefreq: r.changefreq,
    priority: r.priority,
  }));

  // Dynamic entries are best-effort — never fail the sitemap over a DB hiccup.
  try {
    const projects = await projectRepository.getPublished();
    for (const p of projects) {
      if (!p?.slug) continue;
      entries.push({ path: `/project/${p.slug}`, lastmod: now, changefreq: "monthly", priority: 0.75 });
    }
    const experiences = await experienceRepository.getAll();
    const seen = new Set<string>();
    for (const e of experiences) {
      const slug = companySlug(e?.company ?? "");
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      entries.push({ path: `/experience/${slug}`, lastmod: now, changefreq: "monthly", priority: 0.6 });
    }
  } catch {
    /* static routes only */
  }

  return entries;
}

export async function GET(): Promise<Response> {
  const now = new Date().toISOString();
  const entries = await buildEntries(now);
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(renderUrl).join("\n")}
</urlset>
`;

  return new Response(xml, {
    headers: {
      "content-type": "application/xml; charset=utf-8",
      "cache-control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}
