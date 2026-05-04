import Link from "next/link";
import ProjectForm from "@/components/admin/ProjectForm";

export default function NewProjectPage() {
  return (
    <div className="p-8 max-w-3xl">
      <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-6">
        <Link href="/admin/projects" className="hover:text-zinc-300 transition-colors">
          Projets
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Nouveau</span>
      </nav>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white tracking-tight">Nouveau projet</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Créez un nouveau projet pour votre portfolio.
        </p>
      </div>

      <ProjectForm mode="create" />
    </div>
  );
}
