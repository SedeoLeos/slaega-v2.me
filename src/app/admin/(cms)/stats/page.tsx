import Link from "next/link";
import { statRepository } from "@/features/banner/repositories/banner.repository";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const COLOR_DOT: Record<string, string> = {
  green: "bg-green-app",
  rose: "bg-rose-500",
  amber: "bg-amber-400",
  dark: "bg-zinc-900 border border-zinc-700",
  sky: "bg-sky-500",
};

export default async function AdminStatsPage() {
  const stats = await statRepository.getAll().catch(() => []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Stats du Banner</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {stats.length} stat{stats.length !== 1 ? "s" : ""} affiché{stats.length !== 1 ? "s" : ""} sur la page d&apos;accueil
          </p>
        </div>
        <Link
          href="/admin/stats/new"
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors shadow-sm shadow-green-app/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle stat
        </Link>
      </div>

      {stats.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-400 font-medium">Aucune stat</p>
          <Link
            href="/admin/stats/new"
            className="inline-block mt-4 text-sm text-green-app hover:text-green-app/80 transition-colors"
          >
            Créer la première →
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800/60 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_140px_100px_120px] gap-4 px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/60">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Ordre</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Valeur / Label</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Couleur</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</span>
          </div>
          <div className="divide-y divide-zinc-800/40">
            {stats.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[80px_1fr_140px_100px_120px] gap-4 px-5 py-4 items-center hover:bg-zinc-900/30 transition-colors"
              >
                <span className="text-sm text-zinc-500 font-mono">#{s.order}</span>
                <div>
                  <p className="text-base font-bold text-white">{s.value}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${COLOR_DOT[s.color] ?? "bg-zinc-500"}`} />
                  <span className="text-xs text-zinc-400 capitalize">{s.color}</span>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                    s.published ? "bg-green-app/15 text-green-app" : "bg-yellow-500/15 text-yellow-400"
                  }`}
                >
                  {s.published ? "Publié" : "Brouillon"}
                </span>
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/stats/${s.id}`}
                    className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    Éditer
                  </Link>
                  <DeleteButton url={`/api/stats?id=${s.id}`} label="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
