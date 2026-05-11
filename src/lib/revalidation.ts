import { revalidatePath } from "next/cache";
import { AppConfig } from "@/utils/app-config";

/**
 * Builds the URL path for a given locale + path segment.
 * Uses `as-needed` convention: default locale (fr) has no prefix,
 * all other locales get their /<locale> prefix.
 */
function localePath(locale: string, path: string): string {
  const prefix = locale === AppConfig.defaultLocale ? "" : `/${locale}`;
  return `${prefix}${path}`;
}

/** Revalidate a single path across ALL configured locales. */
export function revalidateAllLocales(path: string) {
  for (const locale of AppConfig.locales) {
    revalidatePath(localePath(locale, path));
  }
}

/** Home page (/) — all locales. */
export function revalidateHome() {
  revalidateAllLocales("/");
}

/** Project listing + optional detail page — all locales. */
export function revalidateProjects(slug?: string) {
  revalidateAllLocales("/project");
  revalidateHome();
  if (slug) {
    revalidateAllLocales(`/project/${slug}`);
  }
}

/** Experience listing — all locales. */
export function revalidateExperience() {
  revalidateAllLocales("/experience");
  revalidateHome();
}

/** About page — all locales. */
export function revalidateAbout() {
  revalidateAllLocales("/about");
  revalidateHome();
}

/**
 * Full-site revalidation — use for site-config changes (theme, ticker…)
 * that affect every rendered page.
 * `revalidatePath("/", "layout")` tells Next.js to bust the cache for
 * the root layout and everything nested beneath it.
 */
export function revalidateEverything() {
  revalidatePath("/", "layout");
}
