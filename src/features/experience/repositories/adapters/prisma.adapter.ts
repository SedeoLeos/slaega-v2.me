import { db } from "@/lib/db";
import type { Experience, CreateExperienceInput, UpdateExperienceInput } from "@/entities/experience";

function mapRow(row: {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string;
  location: string;
  companyUrl: string | null;
}): Experience {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    startDate: row.startDate,
    endDate: row.endDate,
    current: row.current,
    description: row.description,
    skills: JSON.parse(row.skills || "[]") as string[],
    location: row.location,
    companyUrl: row.companyUrl ?? undefined,
  };
}

const makeId = (company: string, startDate: string) =>
  `${company.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${startDate.replace("-", "")}`;

export const prismaExperienceAdapter = {
  async getAll(): Promise<Experience[]> {
    const rows = await db.experience.findMany({ orderBy: { startDate: "desc" } });
    return rows.map(mapRow).sort((a, b) => {
      const aKey = a.current ? "9999-99" : (a.endDate ?? "0000-00");
      const bKey = b.current ? "9999-99" : (b.endDate ?? "0000-00");
      return bKey.localeCompare(aKey);
    });
  },

  async getById(id: string): Promise<Experience | null> {
    const row = await db.experience.findUnique({ where: { id } });
    return row ? mapRow(row) : null;
  },

  async create(data: CreateExperienceInput): Promise<Experience> {
    const id = makeId(data.company, data.startDate);
    const row = await db.experience.create({
      data: {
        id,
        company: data.company,
        role: data.role,
        startDate: data.startDate,
        endDate: data.current ? null : (data.endDate ?? null),
        current: data.current,
        description: data.description,
        skills: JSON.stringify(data.skills ?? []),
        location: data.location ?? "",
        companyUrl: data.companyUrl ?? null,
      },
    });
    return mapRow(row);
  },

  async update(id: string, data: UpdateExperienceInput): Promise<Experience | null> {
    const existing = await db.experience.findUnique({ where: { id } });
    if (!existing) return null;
    const row = await db.experience.update({
      where: { id },
      data: {
        ...(data.company !== undefined && { company: data.company }),
        ...(data.role !== undefined && { role: data.role }),
        ...(data.startDate !== undefined && { startDate: data.startDate }),
        ...(data.endDate !== undefined && { endDate: data.current ? null : data.endDate }),
        ...(data.current !== undefined && { current: data.current }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.skills !== undefined && { skills: JSON.stringify(data.skills) }),
        ...(data.location !== undefined && { location: data.location }),
        ...(data.companyUrl !== undefined && { companyUrl: data.companyUrl }),
      },
    });
    return mapRow(row);
  },

  async delete(id: string): Promise<boolean> {
    try {
      await db.experience.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
