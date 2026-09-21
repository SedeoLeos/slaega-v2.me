import type { MetadataRoute } from "next";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";

/**
 * /sitemap.xml — Next.js native metadata route (same convention as
 * app/manifest.ts, which works here). Next serves it with the correct
 * `application/xml` Content-Type.
 *
 * `force-dynamic` makes it a runtime function response rather than a statically
 * generated .xml asset — the static asset was what the Vercel CDN served as
 * text/html (browsers / Search Console then reject it as "not XML"). A dynamic
 * response can't be re-typed by the CDN.
 *
 * NOTE: a Route Handler at app/sitemap.xml/route.ts 404s in this app, so the
 * metadata convention (this file) is the only approach that both serves AND
 * sets the right Content-Type.
 */
export const dynamic = "force-dynamic";

const BASE = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://slaega.com").replace(/\/+$/, "");
const LOCALES = ["fr", "en", "es", "pt"] as const;
const DEFAULT_LOCALE = "fr";

const abs = (path: string, locale: string = DEFAULT_LOCALE) =>
  `${BASE}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}${path}`;

const languages = (path: string): Record<string, string> =>
  Object.fromEntries(LOCALES.map((l) => [l, abs(path, l)]));

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const items: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: abs(r.path),
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
    alternates: { languages: languages(r.path) },
  }));

  // Best-effort dynamic entries — never fail the sitemap over a DB hiccup.
  try {
    const projects = await projectRepository.getPublished();
    for (const p of projects) {
      if (!p?.slug) continue;
      items.push({
        url: abs(`/project/${p.slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.75,
        alternates: { languages: languages(`/project/${p.slug}`) },
      });
    }

    const experiences = await experienceRepository.getAll();
    const seen = new Set<string>();
    for (const e of experiences) {
      const slug = companySlug(e?.company ?? "");
      if (!slug || seen.has(slug)) continue;
      seen.add(slug);
      items.push({
        url: abs(`/experience/${slug}`),
        lastModified: now,
        changeFrequency: "monthly",
        priority: 0.6,
        alternates: { languages: languages(`/experience/${slug}`) },
      });
    }
  } catch {
    /* static routes only */
  }

  return items;
}
