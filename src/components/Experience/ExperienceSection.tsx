import { getExperiences } from '@/features/experience/use-cases/get-experiences.use-case';
import ExperienceItem from './ExperienceItem';
import Link from 'next/link';

export default async function ExperienceSection() {
  const experiences = await getExperiences().catch(() => []);
  const preview = experiences.slice(0, 3);

  if (preview.length === 0) return null;

  return (
    <section className="w-full max-w-content self-center px-10 md:px-20 py-16 font-poppins">
      <div className="mb-10">
        <span className="text-xs font-semibold uppercase tracking-widest text-green-app">Parcours</span>
        <h2 className="text-3xl sm:text-4xl font-bold mt-2">Expériences</h2>
      </div>

      <div>
        {preview.map((exp, i) => (
          <ExperienceItem key={exp.id} experience={exp} isLast={i === preview.length - 1} />
        ))}
      </div>

      {experiences.length > 3 && (
        <Link
          href="/experience"
          className="inline-flex items-center gap-2 text-sm font-semibold text-green-app hover:underline mt-2"
        >
          Voir toutes les expériences ({experiences.length})
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      )}
    </section>
  );
}
