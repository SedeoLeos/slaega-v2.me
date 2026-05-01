import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { Project, ProjectContent } from "@/entities/project";
import type { ProjectQuery } from "@/features/projects/types/project-query";

const PROJECTS_DIRECTORY = path.join(process.cwd(), "src/content/project");

const extractDescription = (content: string): string => {
  return (
    content
      .replace(/^#{1,6}\s+.*$/gm, "")
      .replace(/^\s*$/gm, "")
      .split("\n")
      .find((line) => line.trim().length > 0)
      ?.trim() || ""
  );
};

const parseProjectFile = (filename: string): Project => {
  const filePath = path.join(PROJECTS_DIRECTORY, filename);
  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent) as unknown as {
    data: Omit<Project, "slug" | "desc">;
    content: string;
  };

  return {
    ...data,
    slug: filename.replace(/\.mdx$/, ""),
    desc: extractDescription(content),
  };
};

export const projectRepository = {
  async getBySlug(slug: string): Promise<ProjectContent> {
    const filePath = path.join(PROJECTS_DIRECTORY, `${slug}.mdx`);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { content, data } = matter(fileContent);

    return {
      content,
      meta: data as Project,
    };
  },

  async getAll(): Promise<Project[]> {
    const filenames = fs.readdirSync(PROJECTS_DIRECTORY);
    const projects = filenames
      .filter((name) => name.endsWith(".mdx"))
      .map(parseProjectFile)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return projects;
  },

  async findPaginated({ page, pageSize, categories }: ProjectQuery): Promise<Project[]> {
    let projects = await this.getAll();

    if (categories && categories.length > 0) {
      projects = projects.filter((project) =>
        project.categories?.some((category) => categories.includes(category)),
      );
    }

    const start = page * pageSize;
    const end = start + pageSize;

    return projects.slice(start, end);
  },

  async getAllCategories(): Promise<string[]> {
    const projects = await this.getAll();
    return [...new Set(projects.map((item) => item.categories).flat())];
  },

  async getAllSlugs(): Promise<{ slug: string }[]> {
    const files = fs.readdirSync(PROJECTS_DIRECTORY);

    return files
      .filter((fileName) => fileName.endsWith(".mdx"))
      .map((fileName) => ({ slug: fileName.replace(/\.mdx$/, "") }));
  },
};
