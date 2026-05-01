'use server';

import type { Project } from "@/entities/project";
import { getAllProjects, getProjectCategories, getProjects } from "@/features/projects/use-cases/get-projects.use-case";
import { getProjectBySlug, getProjectPaths } from "@/features/projects/use-cases/get-project-by-slug.use-case";

type Params = {
  page: number;
  pageSize: number;
  categories?: string[];
};

export async function getPost(slug: string) {
  return getProjectBySlug(slug);
}

export async function getAllCategories() {
  return getProjectCategories();
}

export async function getPostPath() {
  return getProjectPaths();
}

export async function getAllProjectsLegacy(): Promise<Project[]> {
  return getAllProjects();
}

export async function getProjectsLegacy({ page, pageSize, categories }: Params): Promise<Project[]> {
  return getProjects({ page, pageSize, categories });
}

// Backward-compatible alias used by current UI/hook imports.
export const getAllProjects = getAllProjectsLegacy;
export const getProjects = getProjectsLegacy;
