import { db } from "@/lib/db";
import type {
  Stat,
  AboutBlock,
  CreateStatInput,
  UpdateStatInput,
  CreateAboutBlockInput,
  UpdateAboutBlockInput,
  StatColor,
} from "@/entities/stat";

// ── Stat ──────────────────────────────────────────────────────────────
const statRow = (r: {
  id: string;
  value: string;
  label: string;
  color: string;
  order: number;
  published: boolean;
}): Stat => ({
  id: r.id,
  value: r.value,
  label: r.label,
  color: r.color as StatColor,
  order: r.order,
  published: r.published,
});

export const statRepository = {
  async getAll(): Promise<Stat[]> {
    const rows = await db.stat.findMany({ orderBy: { order: "asc" } });
    return rows.map(statRow);
  },
  async getPublished(): Promise<Stat[]> {
    const rows = await db.stat.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(statRow);
  },
  async getById(id: string): Promise<Stat | null> {
    const row = await db.stat.findUnique({ where: { id } });
    return row ? statRow(row) : null;
  },
  async create(data: CreateStatInput): Promise<Stat> {
    const row = await db.stat.create({ data });
    return statRow(row);
  },
  async update(id: string, data: UpdateStatInput): Promise<Stat | null> {
    const existing = await db.stat.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.stat.update({ where: { id }, data });
    return statRow(row);
  },
  async delete(id: string): Promise<boolean> {
    try {
      await db.stat.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};

// ── AboutBlock ─────────────────────────────────────────────────────────
const aboutRow = (r: {
  id: string;
  label: string;
  body: string;
  ctaText: string;
  ctaHref: string;
  published: boolean;
  order: number;
}): AboutBlock => ({
  id: r.id,
  label: r.label,
  body: r.body,
  ctaText: r.ctaText,
  ctaHref: r.ctaHref,
  published: r.published,
  order: r.order,
});

export const aboutBlockRepository = {
  async getAll(): Promise<AboutBlock[]> {
    const rows = await db.aboutBlock.findMany({ orderBy: { order: "asc" } });
    return rows.map(aboutRow);
  },
  async getFirstPublished(): Promise<AboutBlock | null> {
    const row = await db.aboutBlock.findFirst({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return row ? aboutRow(row) : null;
  },
  async getById(id: string): Promise<AboutBlock | null> {
    const row = await db.aboutBlock.findUnique({ where: { id } });
    return row ? aboutRow(row) : null;
  },
  async create(data: CreateAboutBlockInput): Promise<AboutBlock> {
    const row = await db.aboutBlock.create({ data });
    return aboutRow(row);
  },
  async update(id: string, data: UpdateAboutBlockInput): Promise<AboutBlock | null> {
    const existing = await db.aboutBlock.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.aboutBlock.update({ where: { id }, data });
    return aboutRow(row);
  },
  async delete(id: string): Promise<boolean> {
    try {
      await db.aboutBlock.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
