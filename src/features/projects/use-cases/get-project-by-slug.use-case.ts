import type { ProjectContent } from "@/entities/project";
import { projectRepository } from "@/features/projects/repositories/project.repository";

export const getProjectBySlug = async (slug: string): Promise<ProjectContent> => {
  return projectRepository.getBySlug(slug);
};

export const getProjectPaths = async (): Promise<{ slug: string }[]> => {
  return projectRepository.getAllSlugs();
};
