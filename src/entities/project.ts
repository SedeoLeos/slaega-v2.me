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
};

export type UpdateProjectInput = Partial<CreateProjectInput>;
