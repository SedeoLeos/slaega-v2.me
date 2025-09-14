'use server';
import fs from "fs";
import path from "path";
import matter from "gray-matter";
type ProjectMeta = {
  title:string;
  date:Date;
  tags:string [];
  categories:string[];
  image:string;
  slug:string;
  desc:string;
}

export async function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "src/content/project", `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { content, data } = matter(fileContent);

  return {
    content, // texte MDX sans le front-matter
    meta: data as ProjectMeta
  };
}


const postsDirectory = path.join(process.cwd(), "src/content/project");

/**
 * Récupère la liste de tous les posts MDX avec leurs métadonnées
 */
type Params = {
  page: number;
  pageSize: number;
  categories?: string[];
};

export async function getAllProjects (){
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((name) => name.endsWith(".mdx"))
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      const { data ,content} = matter(fileContent) as unknown as { data: ProjectMeta,content: string };
      // Extraire la description : premier paragraphe de texte (pas les titres)
      const desc = content
        .replace(/^#{1,6}\s+.*$/gm, '') // Supprimer les titres markdown
        .replace(/^\s*$/gm, '') // Supprimer les lignes vides
        .split('\n')
        .find(line => line.trim().length > 0) // Premier paragraphe non vide
        ?.trim() || ''
        // .substring(0, 150) + '...' || ''; // Limiter à 150 caractères
      const slug = filename.replace(/\.mdx$/, "");
      return {  ...data , slug, desc  };
    });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getProjects({ page, pageSize, categories }: Params): Promise<ProjectMeta[]> {
  let projects = await  getAllProjects();
  if (categories && categories.length > 0) {
    projects = projects.filter((post) =>
      post.categories?.some((cat) => categories.includes(cat))
    );
  }

  const start = page * pageSize;
  const end = start + pageSize;

  return projects.slice(start, end);
}


export async function getAllCategories() {
  const projects = await getAllProjects()
  return [...new Set(projects.map(item => item.categories).flat())];
}


export async function  getPostPath (){
  const files = fs.readdirSync(path.join(process.cwd(), "src/content/project"))

  return files.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.mdx$/, ''),
    },
  }))
}