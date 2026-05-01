import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getAllProjects } from '@/features/projects/use-cases/get-projects.use-case';
import { getExperiences } from '@/features/experience/use-cases/get-experiences.use-case';

function extractKeywords(text: string): string[] {
  const tech = [
    'react', 'next.js', 'nextjs', 'vue', 'angular', 'typescript', 'javascript',
    'node.js', 'nodejs', 'python', 'java', 'go', 'rust', 'php', 'ruby',
    'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'terraform', 'ci/cd',
    'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest', 'api',
    'react native', 'flutter', 'swift', 'kotlin', 'android', 'ios',
    'tailwind', 'css', 'html', 'sass', 'webpack', 'vite',
    'git', 'github', 'gitlab', 'devops', 'linux', 'nginx',
    'electron', '.net', 'spring', 'express', 'fastapi', 'django',
  ];
  const lower = text.toLowerCase();
  return tech.filter((t) => lower.includes(t));
}

function scoreExperience(exp: { description: string; skills: string[] }, keywords: string[]): number {
  const text = `${exp.description} ${exp.skills.join(' ')}`.toLowerCase();
  return keywords.filter((k) => text.includes(k)).length;
}

function scoreProject(proj: { desc: string; tags: string[]; categories: string[] }, keywords: string[]): number {
  const text = `${proj.desc} ${proj.tags.join(' ')} ${proj.categories.join(' ')}`.toLowerCase();
  return keywords.filter((k) => text.includes(k)).length;
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: 'Non autorisé — connexion requise' }, { status: 401 });

  const { jobOffer } = await req.json();
  if (!jobOffer || typeof jobOffer !== 'string' || jobOffer.trim().length < 50) {
    return NextResponse.json({ message: "L'offre d'emploi est trop courte" }, { status: 400 });
  }

  const [allProjects, allExperiences] = await Promise.all([
    getAllProjects().catch(() => []),
    getExperiences().catch(() => []),
  ]);

  const keywords = extractKeywords(jobOffer);

  // Score and sort
  const scoredExperiences = allExperiences
    .map((e) => ({ ...e, score: scoreExperience(e, keywords) }))
    .sort((a, b) => b.score - a.score);

  const scoredProjects = allProjects
    .map((p) => ({ ...p, score: scoreProject(p, keywords) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  const relevantSkills = [...new Set([
    ...scoredExperiences.flatMap((e) => e.skills),
    ...scoredProjects.flatMap((p) => p.tags),
  ])].filter((s) => keywords.some((k) => s.toLowerCase().includes(k))).slice(0, 12);

  const allSkills = [...new Set([
    ...scoredExperiences.flatMap((e) => e.skills),
    ...scoredProjects.flatMap((p) => p.tags),
  ])].slice(0, 20);

  const cvData = {
    keywords,
    experiences: scoredExperiences,
    projects: scoredProjects,
    relevantSkills,
    allSkills,
    jobTitle: extractJobTitle(jobOffer),
  };

  return NextResponse.json({ ok: true, cv: cvData });
}

function extractJobTitle(text: string): string {
  const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
  const titleLine = lines.find((l) =>
    l.length < 80 && (
      l.toLowerCase().includes('développeur') || l.toLowerCase().includes('ingénieur') ||
      l.toLowerCase().includes('engineer') || l.toLowerCase().includes('developer') ||
      l.toLowerCase().includes('architect') || l.toLowerCase().includes('lead')
    )
  );
  return titleLine ?? 'Ingénieur Logiciel Full-Stack';
}
