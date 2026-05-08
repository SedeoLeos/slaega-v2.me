import { db } from "@/lib/db";
import type { FaqItem, CreateFaqItemInput, UpdateFaqItemInput } from "@/entities/faq-item";

const toFaqItem = (r: {
  id: string;
  question: string;
  answer: string;
  order: number;
  published: boolean;
}): FaqItem => ({
  id: r.id,
  question: r.question,
  answer: r.answer,
  order: r.order,
  published: r.published,
});

export const faqRepository = {
  async getAll(): Promise<FaqItem[]> {
    const rows = await db.faqItem.findMany({ orderBy: { order: "asc" } });
    return rows.map(toFaqItem);
  },
  async getPublished(): Promise<FaqItem[]> {
    const rows = await db.faqItem.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toFaqItem);
  },
  async getById(id: string): Promise<FaqItem | null> {
    const row = await db.faqItem.findUnique({ where: { id } });
    return row ? toFaqItem(row) : null;
  },
  async create(data: CreateFaqItemInput): Promise<FaqItem> {
    const row = await db.faqItem.create({ data });
    return toFaqItem(row);
  },
  async update(id: string, data: UpdateFaqItemInput): Promise<FaqItem | null> {
    const existing = await db.faqItem.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.faqItem.update({ where: { id }, data });
    return toFaqItem(row);
  },
  async delete(id: string): Promise<boolean> {
    try {
      await db.faqItem.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
