export type Project = {
  title: string;
  date: string | Date;
  tags: string[];
  categories: string[];
  image: string;
  slug: string;
  desc: string;
};

export type ProjectContent = {
  content: string;
  meta: Project;
};
