import Link from "next/link";
import StatForm from "@/components/admin/StatForm";

export default function NewStatPage() {
  return (
    <div className="p-8 max-w-2xl mx-auto">
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
        <span className="text-zinc-500">Nouvelle</span>
      </nav>

      <div className="mb-8 pb-6 border-b border-zinc-800/60">
        <h1 className="text-2xl font-bold text-white tracking-tight">Nouvelle stat</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Crée une nouvelle stat affichée dans le banner d&apos;accueil.
        </p>
      </div>

      <StatForm mode="create" />
    </div>
  );
}
