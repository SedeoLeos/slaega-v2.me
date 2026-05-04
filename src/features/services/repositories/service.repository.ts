import { db } from "@/lib/db";
import type {
  Service,
  CreateServiceInput,
  UpdateServiceInput,
} from "@/entities/service";

const toService = (r: {
  id: string;
  title: string;
  description: string;
  icon: string;
  order: number;
  published: boolean;
}): Service => ({
  id: r.id,
  title: r.title,
  description: r.description,
  icon: r.icon,
  order: r.order,
  published: r.published,
});

export const serviceRepository = {
  async getAll(): Promise<Service[]> {
    const rows = await db.service.findMany({ orderBy: { order: "asc" } });
    return rows.map(toService);
  },
  async getPublished(): Promise<Service[]> {
    const rows = await db.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toService);
  },
  async getById(id: string): Promise<Service | null> {
    const row = await db.service.findUnique({ where: { id } });
    return row ? toService(row) : null;
  },
  async create(data: CreateServiceInput): Promise<Service> {
    const row = await db.service.create({ data });
    return toService(row);
  },
  async update(id: string, data: UpdateServiceInput): Promise<Service | null> {
    const existing = await db.service.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.service.update({ where: { id }, data });
    return toService(row);
  },
  async delete(id: string): Promise<boolean> {
    try {
      await db.service.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
