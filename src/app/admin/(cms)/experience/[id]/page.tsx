import Link from "next/link";
import { notFound } from "next/navigation";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";
import ExperienceForm from "@/components/admin/ExperienceForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const exp = await experienceRepository.getById(id);
  if (!exp) notFound();

  return (
    <div className="p-8 max-w-5xl">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium mb-4">
        <Link
          href="/admin/experience"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Expériences
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-500 truncate">Édition</span>
      </nav>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/60">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight truncate">
            {exp.role}
          </h1>
          <p className="text-zinc-500 text-sm mt-1 truncate">
            {exp.company}
            {exp.location && ` · ${exp.location}`}
          </p>
        </div>

        <div className="inline-flex items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors flex-shrink-0">
          <DeleteButton
            url={`/api/experience?id=${id}`}
            label="Supprimer"
            redirect="/admin/experience"
          />
        </div>
      </div>

      <ExperienceForm mode="edit" id={id} initial={exp} />
    </div>
  );
}
