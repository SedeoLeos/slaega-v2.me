import type { Project, ProjectContent } from "@/entities/project";
import type { Experience } from "@/entities/experience";

export type AppLocale = "fr" | "en";

// Base language stored in the entity columns.
export const BASE_LOCALE: AppLocale = "fr";

export type ProjectTranslation = { title?: string; desc?: string; content?: string };
export type ExperienceTranslation = { role?: string; description?: string; location?: string };

export type ProjectTranslations = Partial<Record<AppLocale, ProjectTranslation>>;
export type ExperienceTranslations = Partial<Record<AppLocale, ExperienceTranslation>>;

export function parseTranslations<T extends object>(raw: string | null | undefined): T {
  if (!raw) return {} as T;
  try {
    const v = JSON.parse(raw);
    return v && typeof v === "object" ? (v as T) : ({} as T);
  } catch {
    return {} as T;
  }
}

const nonEmpty = (v: unknown): v is string => typeof v === "string" && v.trim().length > 0;

/** Overlay the locale's translation onto a project (list fields). FR is the base. */
export function localizeProject(p: Project, locale: string): Project {
  if (locale === BASE_LOCALE || !p.translations) return p;
  const tr = (p.translations as Record<string, ProjectTranslation | undefined>)[locale];
  if (!tr) return p;
  return {
    ...p,
    title: nonEmpty(tr.title) ? tr.title! : p.title,
    desc: nonEmpty(tr.desc) ? tr.desc! : p.desc,
  };
}

/** Overlay onto a full project (detail — includes content). */
export function localizeProjectContent(pc: ProjectContent, locale: string): ProjectContent {
  const meta = localizeProject(pc.meta, locale);
  if (locale === BASE_LOCALE || !pc.meta.translations) return { ...pc, meta };
  const tr = (pc.meta.translations as Record<string, ProjectTranslation | undefined>)[locale];
  return {
    meta,
    content: tr && nonEmpty(tr.content) ? tr.content! : pc.content,
  };
}

export function localizeExperience(e: Experience, locale: string): Experience {
  if (locale === BASE_LOCALE || !e.translations) return e;
  const tr = (e.translations as Record<string, ExperienceTranslation | undefined>)[locale];
  if (!tr) return e;
  return {
    ...e,
    role: nonEmpty(tr.role) ? tr.role! : e.role,
    description: nonEmpty(tr.description) ? tr.description! : e.description,
    location: nonEmpty(tr.location) ? tr.location! : e.location,
  };
}
