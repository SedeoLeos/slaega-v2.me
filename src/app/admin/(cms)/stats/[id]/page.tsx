import Link from "next/link";
import { notFound } from "next/navigation";
import { statRepository } from "@/features/banner/repositories/banner.repository";
import StatForm from "@/components/admin/StatForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditStatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const stat = await statRepository.getById(id);
  if (!stat) notFound();

  return (
    <div className="p-8">
      {/* Header — full width, left aligned */}
      <nav className="flex items-center gap-2 text-xs font-medium mb-4">
        <Link
          href="/admin/stats"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Stats
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-500 truncate">Édition</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/60">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">{stat.value}</h1>
          <p className="text-zinc-500 text-sm mt-1">{stat.label}</p>
        </div>
        <div className="inline-flex items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors flex-shrink-0">
          <DeleteButton url={`/api/stats?id=${id}`} label="Supprimer" redirect="/admin/stats" />
        </div>
      </div>

      {/* Form — centered, wider */}
      <div className="max-w-3xl mx-auto">
        <StatForm mode="edit" id={id} initial={stat} />
      </div>
    </div>
  );
}
