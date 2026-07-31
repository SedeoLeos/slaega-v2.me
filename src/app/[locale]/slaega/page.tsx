import type { Metadata } from "next";
import SlaegaLanding from "@/components/slaega/SlaegaLanding";
import type { SlaegaProject, SlaegaService } from "@/components/slaega/SlaegaServices";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import { serviceRepository } from "@/features/services/repositories/service.repository";

// Reads CMS data (projects, services) that admins update at runtime.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "slaega — Seba Gedeon",
  description:
    "Seba Gedeon — ingénieur logiciel full-stack & DevOps. Mobile, web, backend et infrastructures cloud sécurisées.",
};

export default async function SlaegaPage() {
  const [rawProjects, rawServices] = await Promise.all([
    projectRepository.getPublished().catch(() => []),
    serviceRepository.getPublished().catch(() => []),
  ]);

  const projects: SlaegaProject[] = rawProjects.map((p) => ({
    slug: p.slug,
    title: p.title,
    desc: p.desc ?? "",
    tags: Array.isArray(p.tags) ? p.tags : [],
    image: p.image ?? "",
    category: Array.isArray(p.categories) ? p.categories[0] : undefined,
  }));

  const services: SlaegaService[] = rawServices.map((s) => ({
    title: s.title,
    description: s.description,
    icon: s.icon,
  }));

  return <SlaegaLanding projects={projects} services={services} />;
}
