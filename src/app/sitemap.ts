import type { MetadataRoute } from "next";
import { getAllProjects } from "@/libs/posts";
import { AppConfig } from "@/utils/app-config";

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://slaega.me";

// Static routes and their SEO priority / change frequency
const STATIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
}[] = [
  { path: "",           priority: 1.0, changeFrequency: "weekly"  }, // home
  { path: "/project",   priority: 0.9, changeFrequency: "weekly"  },
  { path: "/experience",priority: 0.8, changeFrequency: "monthly" },
  { path: "/about",     priority: 0.7, changeFrequency: "monthly" },
  { path: "/contact",   priority: 0.6, changeFrequency: "yearly"  },
];

/**
 * Build a URL for a given locale and path.
 * - defaultLocale (fr) has no prefix (localePrefix: "as-needed")
 * - other locales get /<locale> prefix
 */
function url(locale: string, path: string): string {
  const prefix =
    locale === AppConfig.defaultLocale ? "" : `/${locale}`;
  return `${BASE}${prefix}${path}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  // ── Static pages for every locale ──────────────────────────────────────────
  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.flatMap((route) =>
    AppConfig.locales.map((locale) => ({
      url:             url(locale, route.path),
      lastModified:    now,
      changeFrequency: route.changeFrequency,
      priority:        route.priority,
      // Alternate language links (hreflang)
      alternates: {
        languages: Object.fromEntries(
          AppConfig.locales.map((l) => [l, url(l, route.path)])
        ),
      },
    }))
  );

  // ── Dynamic project pages ───────────────────────────────────────────────────
  let projectEntries: MetadataRoute.Sitemap = [];
  try {
    const projects = await getAllProjects();
    projectEntries = projects
      .filter((p) => p.published !== false) // only published
      .flatMap((p) => {
        const projectPath = `/project/${p.slug}`;
        return AppConfig.locales.map((locale) => ({
          url:             url(locale, projectPath),
          lastModified:    p.date ? new Date(p.date) : now,
          changeFrequency: "monthly" as const,
          priority:        0.75,
          alternates: {
            languages: Object.fromEntries(
              AppConfig.locales.map((l) => [l, url(l, projectPath)])
            ),
          },
        }));
      });
  } catch {
    // If DB is unavailable at build time, skip project entries gracefully
  }

  return [...staticEntries, ...projectEntries];
}
