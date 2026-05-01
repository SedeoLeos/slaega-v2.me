import Link from 'next/link';
import { getAllProjects } from '@/features/projects/use-cases/get-projects.use-case';

export default async function AdminProjectsPage() {
  const projects = await getAllProjects().catch(() => []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Projets</h1>
          <p className="text-zinc-400 mt-1 text-sm">{projects.length} projet(s)</p>
        </div>
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-zinc-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau projet
        </Link>
      </div>

      <div className="space-y-3">
        {projects.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <p>Aucun projet pour l'instant.</p>
            <Link href="/admin/projects/new" className="text-green-400 underline mt-2 inline-block text-sm">
              Créer le premier projet
            </Link>
          </div>
        )}
        {projects.map((p) => (
          <div key={p.slug} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 flex items-center justify-between gap-4 hover:border-zinc-700 transition-colors">
            <div className="min-w-0">
              <p className="font-medium text-white truncate">{p.title}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-zinc-500">{p.date as string}</span>
                {p.categories.slice(0, 2).map((c) => (
                  <span key={c} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{c}</span>
                ))}
              </div>
            </div>
            <Link
              href={`/fr/project/${p.slug}`}
              target="_blank"
              className="flex-shrink-0 text-xs text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
            >
              Voir
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
