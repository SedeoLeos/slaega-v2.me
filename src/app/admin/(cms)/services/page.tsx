import Link from "next/link";
import { serviceRepository } from "@/features/services/repositories/service.repository";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await serviceRepository.getAll().catch(() => []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Services</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {services.length} service{services.length !== 1 ? "s" : ""} dans la section publique
          </p>
        </div>
        <Link
          href="/admin/services/new"
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors shadow-sm shadow-green-app/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau service
        </Link>
      </div>

      {services.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-400 font-medium">Aucun service</p>
          <Link
            href="/admin/services/new"
            className="inline-block mt-4 text-sm text-green-app hover:text-green-app/80 transition-colors"
          >
            Créer le premier →
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800/60 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[60px_1fr_120px_100px_120px] gap-4 px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/60">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">#</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Titre / Description</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Icône</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</span>
          </div>
          <div className="divide-y divide-zinc-800/40">
            {services.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[60px_1fr_120px_100px_120px] gap-4 px-5 py-4 items-center hover:bg-zinc-900/30 transition-colors"
              >
                <span className="text-sm text-zinc-500 font-mono">#{s.order}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{s.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{s.description}</p>
                </div>
                <span className="text-xs text-zinc-400 capitalize">{s.icon}</span>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                    s.published ? "bg-green-app/15 text-green-app" : "bg-yellow-500/15 text-yellow-400"
                  }`}
                >
                  {s.published ? "Publié" : "Brouillon"}
                </span>
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/services/${s.id}`}
                    className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    Éditer
                  </Link>
                  <DeleteButton url={`/api/services?id=${s.id}`} label="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
