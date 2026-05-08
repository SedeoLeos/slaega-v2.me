import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";
import TickerEditor from "@/components/admin/TickerEditor";

export const metadata = { title: "Ticker — Admin" };

export default async function TickerPage() {
  const ticker = await siteConfigRepository.getTicker();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-100">Bandeau défilant</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Texte en défilement horizontal affiché en haut du site.
        </p>
      </div>
      <TickerEditor initialTicker={ticker} />
    </div>
  );
}
