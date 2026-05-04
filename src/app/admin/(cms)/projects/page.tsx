import Link from "next/link";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import ProjectsManager from "@/components/admin/ProjectsManager";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await projectRepository.getAll().catch(() => []);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Projets</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {projects.length} projet{projects.length !== 1 ? "s" : ""} au total
          </p>
        </div>
        <Link
          href="/admin/projects/new"
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors shadow-sm shadow-green-app/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau projet
        </Link>
      </div>

      <ProjectsManager projects={projects} />
    </div>
  );
}
