import Link from "next/link";
import { notFound } from "next/navigation";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import ProjectForm from "@/components/admin/ProjectForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await projectRepository.getBySlug(slug);
  if (!project) notFound();

  const { meta, content } = project;

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-sm text-zinc-600">
          <Link href="/admin/projects" className="hover:text-zinc-300 transition-colors">
            Projets
          </Link>
          <span>/</span>
          <span className="text-zinc-300 truncate max-w-xs">{meta.title}</span>
        </nav>

        <div className="flex items-center gap-4">
          <Link
            href={`/project/${slug}`}
            target="_blank"
            className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Voir
          </Link>
          <DeleteButton
            url={`/api/projects?slug=${slug}`}
            label="Supprimer"
            redirect="/admin/projects"
          />
        </div>
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white tracking-tight">Éditer le projet</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Modifiez les informations du projet.
        </p>
      </div>

      <ProjectForm
        mode="edit"
        slug={slug}
        initial={{
          title: meta.title,
          date: meta.date,
          image: meta.image,
          desc: meta.desc,
          tags: meta.tags,
          categories: meta.categories,
          published: meta.published,
          content,
        }}
      />
    </div>
  );
}
