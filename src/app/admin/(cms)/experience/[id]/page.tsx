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
    <div className="p-8 max-w-2xl">
      {/* Breadcrumb + actions */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center gap-2 text-sm text-zinc-600">
          <Link href="/admin/experience" className="hover:text-zinc-300 transition-colors">
            Expériences
          </Link>
          <span>/</span>
          <span className="text-zinc-300 truncate max-w-xs">{exp.role} — {exp.company}</span>
        </nav>
        <DeleteButton
          url={`/api/experience?id=${id}`}
          label="Supprimer"
          redirect="/admin/experience"
        />
      </div>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white tracking-tight">Éditer l'expérience</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Modifiez les informations de cette expérience.
        </p>
      </div>

      <ExperienceForm mode="edit" id={id} initial={exp} />
    </div>
  );
}
