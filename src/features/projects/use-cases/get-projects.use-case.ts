import { getLocale } from "next-intl/server";
import type { Project } from "@/entities/project";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import { localizeProject } from "@/features/i18n/localize";
import type { ProjectQuery } from "@/features/projects/types/project-query";

async function currentLocale(): Promise<string> {
  try {
    return await getLocale();
  } catch {
    return "fr";
  }
}

export const getProjects = async (query: ProjectQuery): Promise<Project[]> => {
  const locale = await currentLocale();
  const rows = await projectRepository.findPaginated(query);
  return rows.map((p) => localizeProject(p, locale));
};

// Public: only published projects (for portfolio pages)
export const getAllProjects = async (): Promise<Project[]> => {
  const locale = await currentLocale();
  const rows = await projectRepository.getPublished();
  return rows.map((p) => localizeProject(p, locale));
};

export const getProjectCategories = async (): Promise<string[]> => {
  return projectRepository.getAllCategories();
};
