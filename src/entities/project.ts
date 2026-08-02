export type ProjectI18n = {
  en?: { title?: string; desc?: string; content?: string };
};

export type Project = {
  id: string;
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  image: string;
  slug: string;
  desc: string;
  published: boolean;
  projectUrl?: string | null;
  githubUrl?: string | null;
  videoUrl?: string | null;
  translations?: ProjectI18n;
};

export type ProjectContent = {
  content: string;
  meta: Project;
};

export type CreateProjectInput = {
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  image?: string;
  content: string;
  description?: string;
  published?: boolean;
  projectUrl?: string;
  githubUrl?: string;
  videoUrl?: string;
  translations?: ProjectI18n;
};

export type UpdateProjectInput = Partial<CreateProjectInput>;
