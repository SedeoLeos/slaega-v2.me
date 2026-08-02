import "server-only";
import { getLocale } from "next-intl/server";
import { localizeProject } from "@/features/i18n/localize";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import { serviceRepository } from "@/features/services/repositories/service.repository";
import { statRepository } from "@/features/banner/repositories/banner.repository";
import { processRepository } from "@/features/process/repositories/process.repository";
import { faqRepository } from "@/features/faq/repositories/faq.repository";
import type {
  SlaegaProject,
  SlaegaService,
  SlaegaStat,
  SlaegaStep,
  SlaegaFaq,
} from "./SlaegaServices";

export type SlaegaData = {
  projects: SlaegaProject[];
  services: SlaegaService[];
  stats: SlaegaStat[];
  steps: SlaegaStep[];
  faq: SlaegaFaq[];
};

/** All CMS content the brutalist home renders — resilient to a missing DB. */
export async function getSlaegaData(): Promise<SlaegaData> {
  const [rawProjects, rawServices, rawStats, rawSteps, rawFaq] = await Promise.all([
    projectRepository.getPublished().catch(() => []),
    serviceRepository.getPublished().catch(() => []),
    statRepository.getPublished().catch(() => []),
    processRepository.getPublished().catch(() => []),
    faqRepository.getPublished().catch(() => []),
  ]);

  const locale = await getLocale().catch(() => "fr");
  const projects: SlaegaProject[] = rawProjects
    .map((p) => localizeProject(p, locale))
    .map((p) => ({
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

  const stats: SlaegaStat[] = rawStats.map((s) => ({ value: s.value, label: s.label }));

  const steps: SlaegaStep[] = rawSteps
    .map((s) => ({ stepNumber: s.stepNumber, title: s.title, description: s.description }))
    .sort((a, b) => a.stepNumber - b.stepNumber);

  const faq: SlaegaFaq[] = rawFaq.map((f) => ({ question: f.question, answer: f.answer }));

  return { projects, services, stats, steps, faq };
}
