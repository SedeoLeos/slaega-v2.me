import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs font-medium mb-4">
        <Link
          href="/admin/projects"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Projets
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-500">Nouveau</span>
      </nav>

      <div className="mb-8 pb-6 border-b border-zinc-800/60">
        <h1 className="text-2xl font-bold text-white tracking-tight">Nouveau projet</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Créez un nouveau projet pour votre portfolio.
        </p>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
