'use server';

import { getProjectBySlug, getProjectPaths } from "@/features/projects/use-cases/get-project-by-slug.use-case";
import { getAllProjects, getProjectCategories, getProjects } from "@/features/projects/use-cases/get-projects.use-case";

export async function getPost(slug: string) {
  return getProjectBySlug(slug);
}

export async function getAllCategories() {
  return getProjectCategories();
}

export async function getPostPath() {
  return getProjectPaths();
}

// Re-export with legacy API compatibility
export { getAllProjects, getProjects };
