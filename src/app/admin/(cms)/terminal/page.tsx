import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";
import TerminalEditor from "@/components/admin/TerminalEditor";

export const metadata = { title: "Terminal — Admin" };

export default async function TerminalPage() {
  const config = await siteConfigRepository.getTerminal();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-100">Section terminal</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Fenêtre terminal avec annotations tech stack affichée sur le portfolio.
        </p>
      </div>
      <TerminalEditor initialConfig={config} />
    </div>
  );
}
