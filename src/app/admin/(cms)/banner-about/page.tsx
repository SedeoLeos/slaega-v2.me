import Link from "next/link";
import { aboutBlockRepository } from "@/features/banner/repositories/banner.repository";
import BannerAboutForm from "@/components/admin/BannerAboutForm";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";
export const metadata = { title: "Carte About — Banner" };

export default async function AdminBannerAboutPage() {
  const blocks = await aboutBlockRepository.getAll().catch(() => []);
  // Singleton convention: edit the first one (or create one if empty)
  const current = blocks[0] ?? null;

  if (!current) {
    return (
      <div className="p-8">
        <div className="mb-8 pb-6 border-b border-zinc-800/60">
          <h1 className="text-2xl font-bold text-white tracking-tight">Carte &quot;À propos&quot; du banner</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Petite carte affichée à droite des stats sur la page d&apos;accueil.
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <BannerAboutForm mode="create" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/60">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">Carte &quot;À propos&quot; du banner</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            Petite carte affichée à droite des stats sur la page d&apos;accueil.
          </p>
        </div>

        {blocks.length > 1 && (
          <Link
            href="#"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg"
          >
            {blocks.length} versions
          </Link>
        )}

        <div className="inline-flex items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors flex-shrink-0">
          <DeleteButton url={`/api/about-block?id=${current.id}`} label="Supprimer" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto">
        <BannerAboutForm mode="edit" id={current.id} initial={current} />
      </div>
    </div>
  );
}
