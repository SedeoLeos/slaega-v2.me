import { getExperiences } from '@/features/experience/use-cases/get-experiences.use-case';
import ExperienceItem from './ExperienceItem';
import Link from 'next/link';

export default async function ExperienceSection() {
  const experiences = await getExperiences().catch(() => []);
  const preview = experiences.slice(0, 3);

  if (preview.length === 0) return null;

  return (
    <section className="w-full max-w-content self-center px-10 md:px-20 py-20 font-poppins flex flex-col items-center">
      {/* Centered header */}
      <div className="text-center mb-12 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-green-app">
          Parcours
        </span>
        <h2 className="text-4xl sm:text-5xl font-extrabold mt-2">Expériences</h2>
      </div>

      {/* Centered timeline */}
      <div className="w-full max-w-2xl mx-auto">
        {preview.map((exp, i) => (
          <ExperienceItem
            key={exp.id}
            experience={exp}
            isLast={i === preview.length - 1}
          />
        ))}
      </div>

      {experiences.length > 3 && (
        <Link
          href="/experience"
          className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-full border border-foreground/20 text-sm font-semibold text-foreground hover:border-foreground/50 hover:bg-foreground/5 transition-all"
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
