import { db } from "@/lib/db";
import type {
  AboutPage,
  AboutHighlightGroup,
  CreateAboutPageInput,
  UpdateAboutPageInput,
} from "@/entities/about-page";

function mapRow(r: {
  id: string;
  label: string;
  title: string;
  intro: string;
  body: string;
  highlights: string;
  ctaText: string;
  ctaHref: string;
  published: boolean;
}): AboutPage {
  let highlights: AboutHighlightGroup[] = [];
  try {
    highlights = JSON.parse(r.highlights || "[]");
  } catch {
    highlights = [];
  }
  return {
    id: r.id,
    label: r.label,
    title: r.title,
    intro: r.intro,
    body: r.body,
    highlights,
    ctaText: r.ctaText,
    ctaHref: r.ctaHref,
    published: r.published,
  };
}

export const aboutPageRepository = {
  /** Returns the (single) published AboutPage record, or null. */
  async getCurrent(): Promise<AboutPage | null> {
    const row = await db.aboutPage.findFirst({
      where: { published: true },
      orderBy: { updatedAt: "desc" },
    });
    return row ? mapRow(row) : null;
  },
  async getById(id: string): Promise<AboutPage | null> {
    const row = await db.aboutPage.findUnique({ where: { id } });
    return row ? mapRow(row) : null;
  },
  /** Get the singleton (first) record — creates one if none exist. */
  async getOrCreate(): Promise<AboutPage> {
    const first = await db.aboutPage.findFirst({ orderBy: { createdAt: "asc" } });
    if (first) return mapRow(first);
    const row = await db.aboutPage.create({
      data: {
        label: "Apprenez à me connaître",
        title: "À propos",
        intro: "",
        body: "",
        highlights: "[]",
        ctaText: "Télécharger le CV",
        ctaHref: "/cv.pdf",
      },
    });
    return mapRow(row);
  },
  async create(data: CreateAboutPageInput): Promise<AboutPage> {
    const row = await db.aboutPage.create({
      data: {
        ...data,
        highlights: JSON.stringify(data.highlights ?? []),
      },
    });
    return mapRow(row);
  },
  async update(id: string, data: UpdateAboutPageInput): Promise<AboutPage | null> {
    const existing = await db.aboutPage.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.aboutPage.update({
      where: { id },
      data: {
        ...(data.label !== undefined && { label: data.label }),
        ...(data.title !== undefined && { title: data.title }),
        ...(data.intro !== undefined && { intro: data.intro }),
        ...(data.body !== undefined && { body: data.body }),
        ...(data.highlights !== undefined && { highlights: JSON.stringify(data.highlights) }),
        ...(data.ctaText !== undefined && { ctaText: data.ctaText }),
        ...(data.ctaHref !== undefined && { ctaHref: data.ctaHref }),
        ...(data.published !== undefined && { published: data.published }),
      },
    });
    return mapRow(row);
  },
};
