import { db } from "@/lib/db";
import type {
  Project,
  ProjectContent,
  CreateProjectInput,
  UpdateProjectInput,
} from "@/entities/project";
import type { ProjectQuery } from "@/features/projects/types/project-query";

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");

function mapRow(row: {
  id: string;
  slug: string;
  title: string;
  date: string;
  tags: string;
  categories: string;
  image: string;
  description: string;
  published: boolean;
  projectUrl?: string | null;
  githubUrl?: string | null;
}): Project {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    date: row.date,
    tags: JSON.parse(row.tags || "[]") as string[],
    categories: JSON.parse(row.categories || "[]") as string[],
    image: row.image,
    desc: row.description,
    published: row.published,
    projectUrl: row.projectUrl ?? null,
    githubUrl: row.githubUrl ?? null,
  };
}

export const prismaProjectAdapter = {
  async getAll(): Promise<Project[]> {
    const rows = await db.project.findMany({ orderBy: { date: "desc" } });
    return rows.map(mapRow);
  },

  async getPublished(): Promise<Project[]> {
    const rows = await db.project.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });
    return rows.map(mapRow);
  },

  async getBySlug(slug: string): Promise<ProjectContent | null> {
    const row = await db.project.findUnique({ where: { slug } });
    if (!row) return null;
    return { content: row.content, meta: mapRow(row) };
  },

  async findPaginated({
    page,
    pageSize,
    categories,
  }: ProjectQuery): Promise<Project[]> {
    const where = categories?.length
      ? {
          published: true,
          categories: { contains: JSON.stringify(categories[0]) },
        }
      : { published: true };

    const rows = await db.project.findMany({
      where,
      orderBy: { date: "desc" },
      skip: page * pageSize,
      take: pageSize,
    });

    // Post-filter for multi-category match (SQLite doesn't support array operators)
    const all = rows.map(mapRow);
    if (!categories?.length) return all;
    return all.filter((p) => p.categories.some((c) => categories.includes(c)));
  },

  async getAllCategories(): Promise<string[]> {
    const rows = await db.project.findMany({
      where: { published: true },
      select: { categories: true },
    });
    const all = rows.flatMap(
      (r) => JSON.parse(r.categories || "[]") as string[],
    );
    return [...new Set(all)];
  },

  async getAllSlugs(): Promise<{ slug: string }[]> {
    return db.project.findMany({
      where: { published: true },
      select: { slug: true },
    });
  },

  async create(data: CreateProjectInput): Promise<Project> {
    const slug = slugify(data.title);
    const row = await db.project.create({
      data: {
        slug,
        title: data.title,
        date: data.date,
        tags: JSON.stringify(data.tags ?? []),
        categories: JSON.stringify(data.categories ?? []),
        image: data.image ?? "/img.jpg",
        description: data.description ?? "",
        content: data.content,
        published: data.published ?? true,
        projectUrl: data.projectUrl ?? null,
        githubUrl: data.githubUrl ?? null,
      },
    });
    return mapRow(row);
  },

  async update(
    slug: string,
    data: UpdateProjectInput,
  ): Promise<Project | null> {
    const existing = await db.project.findUnique({ where: { slug } });
    if (!existing) return null;
    const row = await db.project.update({
      where: { slug },
      data: {
        ...(data.title !== undefined && { title: data.title }),
        ...(data.date !== undefined && { date: data.date }),
        ...(data.tags !== undefined && { tags: JSON.stringify(data.tags) }),
        ...(data.categories !== undefined && {
          categories: JSON.stringify(data.categories),
        }),
        ...(data.image !== undefined && { image: data.image }),
        ...(data.description !== undefined && {
          description: data.description,
        }),
        ...(data.content !== undefined && { content: data.content }),
        ...(data.published !== undefined && { published: data.published }),
        ...(data.projectUrl !== undefined && {
          projectUrl: data.projectUrl || null,
        }),
        ...(data.githubUrl !== undefined && {
          githubUrl: data.githubUrl || null,
        }),
      },
    });
    return mapRow(row);
  },

  async delete(slug: string): Promise<boolean> {
    try {
      await db.project.delete({ where: { slug } });
      return true;
    } catch {
      return false;
    }
  },
};
