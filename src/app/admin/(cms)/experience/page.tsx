import Link from "next/link";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function fmt(date: string | null, current: boolean): string {
  if (current) return "Aujourd'hui";
  if (!date) return "—";
  const [y, m] = date.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
}

export default async function AdminExperiencePage() {
  const experiences = await experienceRepository.getAll().catch(() => []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Expériences</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {experiences.length} expérience{experiences.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          href="/admin/experience/new"
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors shadow-sm shadow-green-app/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle expérience
        </Link>
      </div>

      {/* Empty state */}
      {experiences.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-zinc-400 font-medium">Aucune expérience</p>
          <p className="text-zinc-600 text-sm mt-1">Ajoutez vos expériences professionnelles.</p>
          <Link
            href="/admin/experience/new"
            className="inline-block mt-4 text-sm text-green-app hover:text-green-app/80 transition-colors"
          >
            Ajouter une expérience →
          </Link>
        </div>
      )}

      {/* List */}
      {experiences.length > 0 && (
        <div className="space-y-3">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="bg-zinc-900 border border-zinc-800/60 rounded-xl px-5 py-4 hover:border-zinc-700/80 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-white text-sm">{exp.role}</span>
                    {exp.current && (
                      <span className="text-xs bg-green-app/15 text-green-app border border-green-app/25 px-2 py-0.5 rounded-full font-medium">
                        En poste
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-zinc-400 text-sm">
                    {exp.companyUrl ? (
                      <a
                        href={exp.companyUrl}
                        target="_blank"
                        className="hover:text-white transition-colors flex items-center gap-1"
                      >
                        {exp.company}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    ) : (
                      <span>{exp.company}</span>
                    )}
                    {exp.location && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span className="text-zinc-500">{exp.location}</span>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-zinc-600 mt-1">
                    {fmt(exp.startDate, false)} → {fmt(exp.endDate, exp.current)}
                  </p>
                  {exp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2.5">
                      {exp.skills.slice(0, 6).map((s) => (
                        <span
                          key={s}
                          className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md"
                        >
                          {s}
                        </span>
                      ))}
                      {exp.skills.length > 6 && (
                        <span className="text-xs text-zinc-600">+{exp.skills.length - 6}</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <Link
                    href={`/admin/experience/${exp.id}`}
                    className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    Éditer
                  </Link>
                  <DeleteButton
                    url={`/api/experience?id=${exp.id}`}
                    label=""
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
