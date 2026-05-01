import Link from 'next/link';
import { getAllProjects } from '@/features/projects/use-cases/get-projects.use-case';
import { getExperiences } from '@/features/experience/use-cases/get-experiences.use-case';

export default async function AdminDashboard() {
  const [projects, experiences] = await Promise.all([
    getAllProjects().catch(() => []),
    getExperiences().catch(() => []),
  ]);

  const stats = [
    { label: 'Projets', count: projects.length, href: '/admin/projects', color: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
    { label: 'Expériences', count: experiences.length, href: '/admin/experience', color: 'bg-green-500/10 text-green-400 border-green-500/20' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-zinc-400 mt-1 text-sm">Gérez le contenu de votre portfolio</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className={`border rounded-xl p-6 ${s.color} hover:opacity-80 transition-opacity`}>
            <p className="text-4xl font-bold">{s.count}</p>
            <p className="text-sm mt-1 opacity-80">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/projects/new"
          className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-5 py-4 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Nouveau projet</p>
            <p className="text-xs text-zinc-400">Ajouter un projet au portfolio</p>
          </div>
        </Link>

        <Link
          href="/admin/experience/new"
          className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl px-5 py-4 transition-colors"
        >
          <div className="w-9 h-9 rounded-lg bg-green-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">Nouvelle expérience</p>
            <p className="text-xs text-zinc-400">Ajouter une expérience professionnelle</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
