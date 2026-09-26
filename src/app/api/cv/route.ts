import { NextRequest, NextResponse } from "next/server";
import { experienceRepository } from "@/features/experience/repositories/experience.repository";
import { projectRepository } from "@/features/projects/repositories/project.repository";
import { CERTIFICATIONS } from "@/shared/config/certifications";
import { SiteConfig } from "@/shared/config/site-config";
import { FULL_NAME, SITE_URL } from "@/shared/config/seo";
import type { Experience } from "@/entities/experience";
import type { Project } from "@/entities/project";

/**
 * PUBLIC CV / RÉSUMÉ DATA API — /api/cv
 * ─────────────────────────────────────────────────────────────────────────────
 * Un point d'entrée unique, SANS CLÉ API, qui expose toute la matière de carrière
 * (profil, expériences, projets & POC, certifications, compétences, formation,
 * stats). But : pouvoir donner cette URL à n'importe quel modèle d'IA pour qu'il
 * génère un CV à partir de données réelles, même sans clé API.
 *
 *   GET /api/cv               → JSON complet (projets = résumé)
 *   GET /api/cv?full=1        → JSON complet + contenu détaillé de chaque projet
 *   GET /api/cv?format=md     → un document Markdown prêt à coller dans un modèle
 *
 * Endpoints connexes (déjà publics) : /api/experience, /api/projects, /api/stats.
 * CORS ouvert (lecture publique). Aucune donnée privée n'est exposée (numéro de
 * téléphone exclu volontairement).
 */

export const dynamic = "force-dynamic";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const PROFILE = {
  name: FULL_NAME,
  title: "Développeur Full-Stack & Mobile — React Native / Expo · Node / NestJS",
  location: "Brazzaville, République du Congo",
  remote: true,
  email: SiteConfig.email,
  website: SITE_URL,
  github: SiteConfig.socialLinks.github,
  linkedin: SiteConfig.socialLinks.linkedin,
  youtube: SiteConfig.socialLinks.youtube,
  languages: [
    { language: "Français", level: "natif" },
    { language: "Anglais", level: "professionnel" },
  ],
  summary:
    "Développeur full-stack & mobile qui conçoit, architecture et livre des produits de bout en bout — du mobile (React Native / Expo, Flutter) au backend (Node / NestJS, Spring Boot, Django, Laravel) et à l'infrastructure (Docker, CI/CD, self-hosted). Adepte de la Clean Architecture et des design patterns éprouvés (Saga, Outbox, injection de dépendances, microservices). Expérience concrète en fintech, mobile money, temps réel, ERP et intégrations métier.",
};

const EDUCATION = [
  {
    degree: "Licence en Informatique",
    specialization: "Génie Logiciel",
    school: "CFI-CIRAS",
    location: "Brazzaville, République du Congo",
  },
];

function sortExperiences(list: Experience[]): Experience[] {
  return [...list].sort((a, b) => {
    if (a.current !== b.current) return a.current ? -1 : 1;
    return (b.startDate ?? "").localeCompare(a.startDate ?? "");
  });
}

function aggregateSkills(experiences: Experience[], projects: Project[]): string[] {
  const set = new Set<string>();
  for (const e of experiences) (e.skills ?? []).forEach((s) => s && set.add(s));
  for (const p of projects) (p.tags ?? []).forEach((t) => t && set.add(t));
  return [...set].sort((a, b) => a.localeCompare(b));
}

function esc(s: unknown): string {
  return String(s ?? "").trim();
}

async function buildPayload(full: boolean) {
  const [experiencesRaw, projectsMeta] = await Promise.all([
    experienceRepository.getAll().catch(() => [] as Experience[]),
    projectRepository.getPublished().catch(() => [] as Project[]),
  ]);

  const experiences = sortExperiences(experiencesRaw);

  // Projects: metadata always; full MDX content only when ?full=1.
  let projects: Array<Project & { content?: string }> = projectsMeta;
  if (full) {
    projects = await Promise.all(
      projectsMeta.map(async (p) => {
        const detail = await projectRepository.getBySlug(p.slug).catch(() => null);
        return { ...p, content: detail?.content };
      }),
    );
  }

  return {
    profile: PROFILE,
    education: EDUCATION,
    certifications: CERTIFICATIONS,
    skills: aggregateSkills(experiences, projectsMeta),
    experiences: experiences.map((e) => ({
      company: e.company,
      role: e.role,
      startDate: e.startDate,
      endDate: e.endDate,
      current: e.current,
      location: e.location,
      description: e.description,
      skills: e.skills,
      companyUrl: e.companyUrl ?? null,
      translations: e.translations ?? null,
    })),
    projects: projects.map((p) => ({
      title: p.title,
      slug: p.slug,
      date: p.date,
      categories: p.categories,
      tags: p.tags,
      description: p.desc,
      url: p.projectUrl ?? null,
      github: p.githubUrl ?? null,
      demo: p.videoUrl ?? null,
      link: `${SITE_URL}/project/${p.slug}`,
      ...(full ? { content: p.content ?? null } : {}),
    })),
    _meta: {
      source: SITE_URL,
      generatedAt: new Date().toISOString(),
      apiKeyRequired: false,
      usage:
        "Donnez cette URL (ou son contenu) à un modèle d'IA pour générer un CV à partir de données réelles. N'inventez aucun fait : utilisez uniquement ce qui est ici.",
      endpoints: {
        full: `${SITE_URL}/api/cv?full=1`,
        markdown: `${SITE_URL}/api/cv?format=md`,
        experiences: `${SITE_URL}/api/experience`,
        projects: `${SITE_URL}/api/projects`,
        stats: `${SITE_URL}/api/stats`,
      },
    },
  };
}

function toMarkdown(data: Awaited<ReturnType<typeof buildPayload>>): string {
  const p = data.profile;
  const lines: string[] = [];
  lines.push(`# ${p.name}`);
  lines.push(`**${p.title}**`);
  lines.push(
    `${p.location}${p.remote ? " · full remote" : ""} · ${p.email} · ${p.website} · ${p.github} · ${p.linkedin}`,
  );
  lines.push("");
  lines.push(
    `> Données de carrière réelles de ${p.name}, exposées pour générer un CV. N'inventez aucun fait ; utilisez uniquement ce document.`,
  );
  lines.push("");
  lines.push(`## Profil`);
  lines.push(esc(p.summary));
  lines.push("");
  lines.push(`## Langues`);
  lines.push(p.languages.map((l) => `${l.language} (${l.level})`).join(" · "));
  lines.push("");
  lines.push(`## Compétences`);
  lines.push(data.skills.join(", "));
  lines.push("");
  lines.push(`## Expérience professionnelle`);
  for (const e of data.experiences) {
    const period = `${esc(e.startDate)} – ${e.current ? "aujourd'hui" : esc(e.endDate)}`;
    lines.push(`### ${esc(e.role)} — ${esc(e.company)}`);
    lines.push(`*${period}${e.location ? ` · ${esc(e.location)}` : ""}*`);
    if (e.description) lines.push(esc(e.description));
    if (e.skills?.length) lines.push(`Stack : ${e.skills.join(", ")}`);
    lines.push("");
  }
  lines.push(`## Projets & POC`);
  for (const pr of data.projects) {
    lines.push(`### ${esc(pr.title)}`);
    const tagline = [pr.categories?.join(", "), pr.date].filter(Boolean).join(" · ");
    if (tagline) lines.push(`*${tagline}*`);
    if (pr.description) lines.push(esc(pr.description));
    if (pr.tags?.length) lines.push(`Stack : ${pr.tags.join(", ")}`);
    lines.push(`Lien : ${pr.link}`);
    lines.push("");
  }
  lines.push(`## Certifications`);
  for (const c of data.certifications) {
    lines.push(`- ${esc(c.name)} — ${esc(c.issuer)}${c.year ? ` (${c.year})` : ""}${c.url ? ` — ${c.url}` : ""}`);
  }
  lines.push("");
  lines.push(`## Formation`);
  for (const ed of data.education) {
    lines.push(`- ${esc(ed.degree)} — ${esc(ed.specialization)}, ${esc(ed.school)} (${esc(ed.location)})`);
  }
  lines.push("");
  return lines.join("\n");
}

export async function GET(req: NextRequest) {
  const format = req.nextUrl.searchParams.get("format");
  const full = req.nextUrl.searchParams.get("full") === "1" || format === "md";

  const data = await buildPayload(full);

  if (format === "md") {
    return new NextResponse(toMarkdown(data), {
      headers: {
        ...CORS,
        "Content-Type": "text/markdown; charset=utf-8",
        "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
      },
    });
  }

  return NextResponse.json(data, {
    headers: {
      ...CORS,
      "Cache-Control": "public, max-age=0, s-maxage=3600, must-revalidate",
    },
  });
}

export function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}
