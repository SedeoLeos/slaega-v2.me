import Link from "next/link";
import { notFound } from "next/navigation";
import { serviceRepository } from "@/features/services/repositories/service.repository";
import ServiceForm from "@/components/admin/ServiceForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const service = await serviceRepository.getById(id);
  if (!service) notFound();

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <nav className="flex items-center gap-2 text-xs font-medium mb-4">
        <Link
          href="/admin/services"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Services
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-500 truncate">Édition</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/60">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">{service.title}</h1>
          <p className="text-zinc-500 text-sm mt-1 line-clamp-2">{service.description}</p>
        </div>
        <div className="inline-flex items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors flex-shrink-0">
          <DeleteButton url={`/api/services?id=${id}`} label="Supprimer" redirect="/admin/services" />
        </div>
      </div>

      <ServiceForm mode="edit" id={id} initial={service} />
    </div>
  );
}
