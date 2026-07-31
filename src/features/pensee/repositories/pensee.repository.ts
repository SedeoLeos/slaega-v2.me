import { db } from "@/lib/db";
import type {
  Pensee,
  PenseeKind,
  CreatePenseeInput,
  UpdatePenseeInput,
} from "@/entities/pensee";

const toPensee = (r: {
  id: string;
  kind: string;
  title: string;
  subtitle: string;
  body: string;
  order: number;
  published: boolean;
}): Pensee => ({
  id: r.id,
  kind: r.kind as PenseeKind,
  title: r.title,
  subtitle: r.subtitle,
  body: r.body,
  order: r.order,
  published: r.published,
});

export const penseeRepository = {
  async getAll(): Promise<Pensee[]> {
    const rows = await db.pensee.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    return rows.map(toPensee);
  },
  async getPublished(): Promise<Pensee[]> {
    const rows = await db.pensee.findMany({
      where: { published: true },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
    });
    return rows.map(toPensee);
  },
  async getById(id: string): Promise<Pensee | null> {
    const row = await db.pensee.findUnique({ where: { id } });
    return row ? toPensee(row) : null;
  },
  async create(data: CreatePenseeInput): Promise<Pensee> {
    const row = await db.pensee.create({ data });
    return toPensee(row);
  },
  async update(id: string, data: UpdatePenseeInput): Promise<Pensee | null> {
    const existing = await db.pensee.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.pensee.update({ where: { id }, data });
    return toPensee(row);
  },
  async delete(id: string): Promise<boolean> {
    try {
      await db.pensee.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
