import { db } from "@/lib/db";
import type { ProcessStep, CreateProcessStepInput, UpdateProcessStepInput } from "@/entities/process-step";

const toProcessStep = (r: {
  id: string;
  stepNumber: number;
  label: string;
  title: string;
  description: string;
  order: number;
  published: boolean;
}): ProcessStep => ({
  id: r.id,
  stepNumber: r.stepNumber,
  label: r.label,
  title: r.title,
  description: r.description,
  order: r.order,
  published: r.published,
});

export const processRepository = {
  async getAll(): Promise<ProcessStep[]> {
    const rows = await db.processStep.findMany({ orderBy: { order: "asc" } });
    return rows.map(toProcessStep);
  },
  async getPublished(): Promise<ProcessStep[]> {
    const rows = await db.processStep.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    return rows.map(toProcessStep);
  },
  async getById(id: string): Promise<ProcessStep | null> {
    const row = await db.processStep.findUnique({ where: { id } });
    return row ? toProcessStep(row) : null;
  },
  async create(data: CreateProcessStepInput): Promise<ProcessStep> {
    const row = await db.processStep.create({ data });
    return toProcessStep(row);
  },
  async update(id: string, data: UpdateProcessStepInput): Promise<ProcessStep | null> {
    const existing = await db.processStep.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.processStep.update({ where: { id }, data });
    return toProcessStep(row);
  },
  async delete(id: string): Promise<boolean> {
    try {
      await db.processStep.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
