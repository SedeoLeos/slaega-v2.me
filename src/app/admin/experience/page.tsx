import Link from 'next/link';
import { getExperiences } from '@/features/experience/use-cases/get-experiences.use-case';

function formatDate(date: string | null, current: boolean) {
  if (current) return "Aujourd'hui";
  if (!date) return '';
  const [y, m] = date.split('-');
  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  return `${months[parseInt(m) - 1]} ${y}`;
}

export default async function AdminExperiencePage() {
  const experiences = await getExperiences().catch(() => []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Expériences</h1>
          <p className="text-zinc-400 mt-1 text-sm">{experiences.length} expérience(s)</p>
        </div>
        <Link
          href="/admin/experience/new"
          className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-zinc-950 font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle expérience
        </Link>
      </div>

      <div className="space-y-3">
        {experiences.length === 0 && (
          <div className="text-center py-16 text-zinc-500">
            <p>Aucune expérience pour l'instant.</p>
            <Link href="/admin/experience/new" className="text-green-400 underline mt-2 inline-block text-sm">
              Ajouter la première expérience
            </Link>
          </div>
        )}
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 hover:border-zinc-700 transition-colors">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-medium text-white">{exp.role}</p>
                  {exp.current && (
                    <span className="text-xs bg-green-500/20 text-green-400 border border-green-500/30 px-2 py-0.5 rounded-full">
                      En poste
                    </span>
                  )}
                </div>
                <p className="text-sm text-zinc-400 mt-0.5">{exp.company} · {exp.location}</p>
                <p className="text-xs text-zinc-500 mt-1">
                  {formatDate(exp.startDate, false)} → {formatDate(exp.endDate, exp.current)}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {exp.skills.slice(0, 5).map((s) => (
                    <span key={s} className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-full">{s}</span>
                  ))}
                  {exp.skills.length > 5 && (
                    <span className="text-xs text-zinc-500">+{exp.skills.length - 5}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
