import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";
import ValueCardsEditor from "@/components/admin/ValueCardsEditor";

export const metadata = { title: "Cartes valeurs — Admin" };

export default async function ValueCardsPage() {
  const config = await siteConfigRepository.getValueCards();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-100">Cartes valeurs</h1>
        <p className="text-zinc-400 text-sm mt-1">
          3 cartes (DISPONIBLE / QUALITÉ / EXPERTISE) affichées sous la section terminal.
        </p>
      </div>
      <ValueCardsEditor initialConfig={config} />
    </div>
  );
}
