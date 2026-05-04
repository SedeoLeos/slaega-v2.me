import Link from "next/link";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await projectRepository.getAll().catch(() => []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projets</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {projects.length} projet{projects.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-zinc-950 font-semibold px-4 py-2.5 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau projet
        </Link>
      </div>

      {/* Empty state */}
      {projects.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <p className="text-zinc-400 font-medium">Aucun projet</p>
          <p className="text-zinc-600 text-sm mt-1">Commencez par créer votre premier projet.</p>
          <Link
            href="/admin/projects/new"
            className="inline-block mt-4 text-sm text-green-400 hover:text-green-300 transition-colors"
          >
            Créer un projet →
          </Link>
        </div>
      )}

      {/* Table */}
      {projects.length > 0 && (
        <div className="border border-zinc-800/60 rounded-xl overflow-hidden">
          {/* Table header */}
          <div className="grid grid-cols-[1fr_120px_180px_100px] gap-4 px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/60">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Titre</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Catégories</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</span>
          </div>

          {/* Rows */}
          <div className="divide-y divide-zinc-800/40">
            {projects.map((p) => (
              <div
                key={p.slug}
                className="grid grid-cols-[1fr_120px_180px_100px] gap-4 px-5 py-4 items-center hover:bg-zinc-900/30 transition-colors"
              >
                {/* Title */}
                <div className="min-w-0">
                  <Link
                    href={`/admin/projects/${p.slug}`}
                    className="text-sm font-medium text-zinc-200 hover:text-white transition-colors truncate block"
                  >
                    {p.title}
                  </Link>
                  <p className="text-xs text-zinc-600 mt-0.5">{p.date}</p>
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                      p.published
                        ? "bg-green-500/15 text-green-400"
                        : "bg-yellow-500/15 text-yellow-400"
                    }`}
                  >
                    <span className={`w-1 h-1 rounded-full ${p.published ? "bg-green-400" : "bg-yellow-400"}`} />
                    {p.published ? "Publié" : "Brouillon"}
                  </span>
                </div>

                {/* Categories */}
                <div className="flex flex-wrap gap-1">
                  {p.categories.slice(0, 2).map((c) => (
                    <span
                      key={c}
                      className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md"
                    >
                      {c}
                    </span>
                  ))}
                  {p.categories.length > 2 && (
                    <span className="text-xs text-zinc-600">+{p.categories.length - 2}</span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/projects/${p.slug}`}
                    className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    Éditer
                  </Link>
                  <Link
                    href={`/project/${p.slug}`}
                    target="_blank"
                    className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                  <DeleteButton
                    url={`/api/projects?slug=${p.slug}`}
                    label=""
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
