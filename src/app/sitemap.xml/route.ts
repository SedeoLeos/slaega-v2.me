import { projectRepository } from "@/features/projects/repositories/project.repository";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";

/**
 * /sitemap.xml — served by an explicit Route Handler so we control the raw XML
 * output. We serve plain, native XML (no XSLT stylesheet): desktop browsers show
 * their built-in XML tree view, and crawlers parse it directly. hreflang
 * alternates (<xhtml:link>) are kept for multilingual SEO.
 *
 * Reliability on Vercel:
 *  - `dynamic = "force-static"` makes Next prerender this into the build output
 *    as a first-class static asset at /sitemap.xml — the same reliable path that
 *    fixed the earlier 404 (a force-dynamic sitemap is served as an on-demand
 *    function, a known source of 404s on Vercel). `revalidate` refreshes it from
 *    the DB once a day.
 *  - We set Content-Type: application/xml ourselves, so crawlers and Search
 *    Console always parse it as XML. The stylesheet PI is ignored by crawlers.
 *
 * /sitemap.xml is excluded from the i18n middleware (matcher + PASS_THROUGH),
 * so it is never rewritten to a locale path.
 */
export const dynamic = "force-static";
export const revalidate = 86400; // 1 day

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://slaega.com").replace(/\/+$/, "");
const LOCALES = ["fr", "en", "es", "pt"] as const;
const DEFAULT_LOCALE = "fr";

const abs = (path: string, locale: string = DEFAULT_LOCALE) =>
  `${BASE}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${path}`;

/** Escape the five XML-significant characters so URLs never break the document. */
function xml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

type Freq = "weekly" | "monthly" | "yearly";
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

function companySlug(company: string): string {
  return company
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type Entry = { path: string; lastmod: string; changefreq: string; priority: number };

function renderUrl(e: Entry): string {
  const alternates = LOCALES.map(
    (l) => `<xhtml:link rel="alternate" hreflang="${l}" href="${xml(abs(e.path, l))}"/>`,
  ).join("\n");
  return `<url>
<loc>${xml(abs(e.path))}</loc>
${alternates}
<lastmod>${e.lastmod}</lastmod>
<changefreq>${e.changefreq}</changefreq>
<priority>${e.priority.toFixed(1)}</priority>
</url>`;
}

export async function GET(): Promise<Response> {
  const lastmod = new Date().toISOString();

  const entries: Entry[] = STATIC_ROUTES.map((r) => ({
    path: r.path,
    lastmod,
    changefreq: r.changeFrequency,
    priority: r.priority,
  }));

  // Best-effort dynamic entries — never fail the sitemap over a DB hiccup.
  try {
    const projects = await projectRepository.getPublished();
    for (const p of projects) {
      if (!p?.slug) continue;
      entries.push({ path: `/project/${p.slug}`, lastmod, changefreq: "monthly", priority: 0.75 });
    }

    const experiences = await experienceRepository.getAll();
    const seen = new Set<string>();
    for (const ex of experiences) {
      const slug = companySlug(ex?.company ?? "");
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      entries.push({ path: `/experience/${slug}`, lastmod, changefreq: "monthly", priority: 0.6 });
    }
  } catch {
    /* static routes only */
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
