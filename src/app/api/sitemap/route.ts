/**
 * Sitemap served as an explicit Route Handler (not the `sitemap.ts` metadata
 * convention). Route handlers deploy on Vercel exactly like /api/* routes, so
 * this is immune to the metadata-route/edge-middleware quirks that made
 * /sitemap.xml 404 in production. The i18n middleware (proxy.ts) also skips
 * dotted paths, and /sitemap.xml is additionally excluded by name.
 */
import { getAllProjects } from "@/libs/posts";
import { AppConfig } from "@/utils/app-config";
import { getExperiences } from "@/features/experience/use-cases/get-experiences.use-case";
import { groupByCompany } from "@/features/experience/group";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://slaega.com";

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

const STATIC_ROUTES: { path: string; priority: number; changeFrequency: Freq }[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/project", priority: 0.9, changeFrequency: "weekly" },
  { path: "/experience", priority: 0.8, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/moi", priority: 0.7, changeFrequency: "monthly" },
  { path: "/philosophie", priority: 0.6, changeFrequency: "monthly" },
  { path: "/pensees", priority: 0.6, changeFrequency: "weekly" },
  { path: "/cv", priority: 0.6, changeFrequency: "monthly" },
  { path: "/birthday", priority: 0.4, changeFrequency: "yearly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];

const url = (locale: string, path: string) =>
  `${BASE}${locale === AppConfig.defaultLocale ? "" : `/${locale}`}${path}`;

const xmlEscape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

type Entry = { path: string; lastmod: string; changefreq: Freq; priority: number };

function renderUrl(e: Entry): string {
  const loc = url(AppConfig.defaultLocale, e.path);
  const alternates = AppConfig.locales
    .map(
      (l) =>
        `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(url(l, e.path))}"/>`,
    )
    .join("\n");
  return `  <url>
    <loc>${xmlEscape(loc)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
${alternates}
  </url>`;
}

export async function GET() {
  const now = new Date().toISOString();

  const entries: Entry[] = STATIC_ROUTES.map((r) => ({
    path: r.path,
    lastmod: now,
    changefreq: r.changeFrequency,
    priority: r.priority,
  }));

  try {
    const projects = await getAllProjects();
    for (const p of projects) {
      if (p.published === false) continue;
      entries.push({
        path: `/project/${p.slug}`,
        lastmod: p.date ? new Date(p.date).toISOString() : now,
        changefreq: "monthly",
        priority: 0.75,
      });
    }
  } catch {
    /* DB unavailable — skip gracefully */
  }

  try {
    const companies = groupByCompany(await getExperiences());
    for (const c of companies) {
      entries.push({ path: `/experience/${c.slug}`, lastmod: now, changefreq: "monthly", priority: 0.6 });
    }
  } catch {
    /* skip gracefully */
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(renderUrl).join("\n")}
</urlset>`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=0, must-revalidate",
    },
  });
}
