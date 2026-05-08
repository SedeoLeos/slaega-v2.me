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
    <div className="p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium mb-4">
        <Link
          href="/admin/projects"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Projets
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-500 truncate">Édition</span>
      </nav>

      {/* Header — title + actions in one block */}
      <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/60">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight truncate">
            {meta.title}
          </h1>
          <p className="text-zinc-500 text-sm mt-1">
            Modifiez les informations du projet.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <Link
            href={`/project/${slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
            Voir
          </Link>
          <div className="inline-flex items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors">
            <DeleteButton
              url={`/api/projects?slug=${slug}`}
              label="Supprimer"
              redirect="/admin/projects"
            />
          </div>
        </div>
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
          projectUrl: meta.projectUrl ?? "",
          githubUrl: meta.githubUrl ?? "",
          content,
        }}
      />
    </div>
  );
}
