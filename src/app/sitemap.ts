import type { MetadataRoute } from "next";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";

/**
 * Native Next.js sitemap route → served at /sitemap.xml with the correct
 * `application/xml` Content-Type by the framework itself (same mechanism as
 * app/manifest.ts, which already works here). This replaces the static
 * public/sitemap.xml file, which the Vercel CDN served as text/html — a header
 * that could not be overridden via next.config or vercel.json.
 *
 * /sitemap.xml is excluded from the i18n middleware (proxy.ts matcher +
 * PASS_THROUGH), exactly like /manifest.webmanifest, so this route is reached
 * without being rewritten to a locale path.
 */
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

  // Dynamic entries are best-effort: if the DB is unreachable we still ship a
  // valid sitemap with the static routes rather than fail.
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
    // static routes only
  }

  return items;
}
