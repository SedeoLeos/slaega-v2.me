/**
 * Build-time SEO generator.
 *
 * Writes STATIC `public/sitemap.xml` and `public/robots.txt`. Files under
 * `public/` are served directly by the Vercel CDN — no routing, no middleware
 * (proxy.ts), no metadata-route convention, no rewrites can touch them — so
 * `/sitemap.xml` can physically never 404. Every previous attempt (metadata
 * `sitemap.ts`, `app/sitemap.xml/route.ts` route handlers, a proxy pass-through
 * guard, `/api/sitemap` + rewrites) still 404'd in production; a static file is
 * the one approach that cannot.
 *
 * Runs in the `prebuild` step (which already has DATABASE_URL on Vercel) so the
 * project / experience URLs stay in sync with the live DB. If the DB is
 * unavailable the static routes are still emitted — the committed baseline file
 * guarantees a valid sitemap ships no matter what.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";

// ── Config (kept in sync with src/utils/app-config.ts) ───────────────
const LOCALES = ["fr", "en", "es", "pt"] as const;
const DEFAULT_LOCALE = "fr";
const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://slaega.com").replace(/\/+$/, "");

type Freq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";

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

const AI_BOTS = [
  "GPTBot",
  "ChatGPT-User",
  "CCBot",
  "anthropic-ai",
  "Claude-Web",
  "Omgilibot",
  "FacebookBot",
  "ia_archiver",
];

// ── Helpers ──────────────────────────────────────────────────────────
const loc = (locale: string, p: string) =>
  `${BASE}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${p}`;

const xmlEscape = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

type Entry = { path: string; lastmod: string; changefreq: Freq; priority: number };

function renderUrl(e: Entry): string {
  const canonical = loc(DEFAULT_LOCALE, e.path);
  const alternates = LOCALES.map(
    (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${xmlEscape(loc(l, e.path))}"/>`,
  ).join("\n");
  return `  <url>
    <loc>${xmlEscape(canonical)}</loc>
    <lastmod>${e.lastmod}</lastmod>
    <changefreq>${e.changefreq}</changefreq>
    <priority>${e.priority.toFixed(1)}</priority>
${alternates}
  </url>`;
}

function companySlug(company: string): string {
  return company
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ── DB reads (best-effort — never fatal) ─────────────────────────────
async function fetchDynamicEntries(now: string): Promise<Entry[]> {
  const url = process.env.DATABASE_URL;
  if (!url || !url.trim()) {
    console.warn("⚠  gen-seo: DATABASE_URL not set — static routes only.");
    return [];
  }

  try {
    const { PrismaClient } = await import("../src/generated/prisma/client");
    const { buildAdapter } = await import("../src/lib/db-adapter");
    const db = new PrismaClient({ adapter: buildAdapter(url) });

    const entries: Entry[] = [];

    const projects = await db.project.findMany({
      where: { published: true },
      select: { slug: true, date: true },
    });
    for (const p of projects) {
      let lastmod = now;
      if (p.date) {
        const d = new Date(p.date.includes("-") ? p.date : `${p.date}-01-01`);
        if (!Number.isNaN(d.getTime())) lastmod = d.toISOString();
      }
      entries.push({ path: `/project/${p.slug}`, lastmod, changefreq: "monthly", priority: 0.75 });
    }

    const experiences = await db.experience.findMany({ select: { company: true } });
    const seen = new Set<string>();
    for (const e of experiences) {
      const slug = companySlug(e.company);
      if (seen.has(slug)) continue;
      seen.add(slug);
      entries.push({ path: `/experience/${slug}`, lastmod: now, changefreq: "monthly", priority: 0.6 });
    }

    await db.$disconnect();
    console.log(`✓ gen-seo: ${projects.length} projects + ${seen.size} companies from DB.`);
    return entries;
  } catch (err) {
    console.warn("⚠  gen-seo: DB read failed — static routes only.", (err as Error).message);
    return [];
  }
}

// ── Main ─────────────────────────────────────────────────────────────
async function main() {
  // A fixed timestamp keeps the committed baseline diff-stable; on Vercel the
  // build regenerates it fresh each deploy anyway.
  const now = new Date().toISOString();

  const staticEntries: Entry[] = STATIC_ROUTES.map((r) => ({
    path: r.path,
    lastmod: now,
    changefreq: r.changefreq,
    priority: r.priority,
  }));

  const dynamicEntries = await fetchDynamicEntries(now);
  const entries = [...staticEntries, ...dynamicEntries];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.map(renderUrl).join("\n")}
</urlset>
`;

  const robots = `# slaega — Seba Gedeon Matsoula Malonga
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/
Disallow: /_next/

${AI_BOTS.map((ua) => `User-agent: ${ua}`).join("\n")}
Disallow: /

Host: ${BASE}
Sitemap: ${BASE}/sitemap.xml
`;

  const publicDir = path.join(process.cwd(), "public");
  fs.mkdirSync(publicDir, { recursive: true });
  fs.writeFileSync(path.join(publicDir, "sitemap.xml"), sitemap, "utf8");
  fs.writeFileSync(path.join(publicDir, "robots.txt"), robots, "utf8");

  console.log(`✓ gen-seo: wrote public/sitemap.xml (${entries.length} urls) + public/robots.txt`);
}

main().catch((err) => {
  // Never fail the build over SEO generation — the committed baseline stands.
  console.warn("⚠  gen-seo failed:", (err as Error).message);
  process.exit(0);
});
