import fs from "fs";
import path from "path";
import matter from "gray-matter";
export function splitMarkdownByParagraphs(md: string, numberOfParagraphs = 2): [string, string] {
    // Découpe sur deux sauts de ligne (fin de paragraphe)
    const parts = md.split(/\n\s*\n/);
  
    const preview = parts.slice(0, numberOfParagraphs).join('\n\n');
    const rest = parts.slice(numberOfParagraphs).join('\n\n');
  
    return [preview, rest];
}
export function getPost(slug: string) {
  const filePath = path.join(process.cwd(), "src/content/project", `${slug}.mdx`);
  const fileContent = fs.readFileSync(filePath, "utf-8");

  const { content, data } = matter(fileContent);

  return {
    content, // texte MDX sans le front-matter
    meta: data, // { title, date, tags, ... }
  };
}


const postsDirectory = path.join(process.cwd(), "src/content/project");

/**
 * Récupère la liste de tous les posts MDX avec leurs métadonnées
 */
export function getAllPosts() {
  // Lire tous les fichiers du dossier "content"
  const filenames = fs.readdirSync(postsDirectory);

  const posts = filenames
    .filter((name) => name.endsWith(".mdx")) // ne garder que les .mdx
    .map((filename) => {
      const filePath = path.join(postsDirectory, filename);
      const fileContent = fs.readFileSync(filePath, "utf-8");
      // Extraire le front-matter
      const { data } = matter(fileContent);  
      // Générer le slug à partir du nom de fichier
      const slug = filename.replace(/\.mdx$/, "");

      return {
        slug,
        ...data, // title, date, tags, etc.
      };
    });

  // Optionnel : trier par date décroissante
  posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return posts;
}

export function  getPostPath (){
  const files = fs.readdirSync(path.join(process.cwd(), "src/content/project"))

  return files.map((fileName) => ({
    params: {
      slug: fileName.replace(/\.mdx$/, ''),
    },
  }))
}