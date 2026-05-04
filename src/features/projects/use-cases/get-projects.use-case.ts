import type { Project } from "@/entities/project";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import type { ProjectQuery } from "@/features/projects/types/project-query";

export const getProjects = async (query: ProjectQuery): Promise<Project[]> => {
  return projectRepository.findPaginated(query);
};

// Public: only published projects (for portfolio pages)
export const getAllProjects = async (): Promise<Project[]> => {
  return projectRepository.getPublished();
};

export const getProjectCategories = async (): Promise<string[]> => {
  return projectRepository.getAllCategories();
};
