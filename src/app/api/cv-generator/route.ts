import { auth } from "@/auth";
import { aboutPageRepository } from "@/features/about/repositories/about-page.repository";
import { getExperiences } from "@/features/experience/use-cases/get-experiences.use-case";
import { getAllProjects } from "@/features/projects/use-cases/get-projects.use-case";
import { aiGenerate, getActiveAiProvider } from "@/lib/ai-provider";
import { NextRequest, NextResponse } from "next/server";

// ── Helpers ────────────────────────────────────────────────────────
function stripHtml(s: string): string {
  return (s ?? "")
    .replace(/<\/?(p|br|div|h[1-6]|li|ul|ol|strong|em|a|u|span|table|tr|td|th|img|hr)[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function extractKeywords(text: string): string[] {
  const tech = [
    "react", "next.js", "nextjs", "vue", "angular", "typescript", "javascript",
    "node.js", "nodejs", "python", "java", "go", "rust", "php", "ruby", "kotlin",
    "spring", "spring boot", "nestjs", "fastapi", "django", "express", "laravel",
    "docker", "kubernetes", "aws", "azure", "gcp", "terraform", "ci/cd", "jenkins",
    "postgresql", "postgres", "mysql", "mongodb", "redis", "graphql", "rest", "api",
    "react native", "flutter", "swift", "android", "ios", "expo",
    "tailwind", "css", "html", "sass", "webpack", "vite",
    "git", "github", "gitlab", "devops", "linux", "nginx", "coolify",
    "electron", ".net", "keycloak", "openfga", "cerbos", "oauth", "jwt",
    "microservices", "saas", "erp", "crm", "cms", "n8n", "langchain",
  ];
  const lower = text.toLowerCase();
  return Array.from(new Set(tech.filter((t) => lower.includes(t))));
}

function scoreExperience(
  exp: { description: string; skills: string[]; role: string },
  keywords: string[]
): number {
  const text = `${stripHtml(exp.description)} ${exp.skills.join(" ")} ${exp.role}`.toLowerCase();
  return keywords.filter((k) => text.includes(k)).length;
}

function scoreProject(
  proj: { desc: string; tags: string[]; categories: string[]; title: string },
  keywords: string[]
): number {
  const text = `${stripHtml(proj.desc)} ${proj.tags.join(" ")} ${proj.categories.join(" ")} ${proj.title}`.toLowerCase();
  return keywords.filter((k) => text.includes(k)).length;
}

function extractJobTitle(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const titleLine = lines.find(
    (l) =>
      l.length < 80 &&
      (l.toLowerCase().includes("développeur") ||
        l.toLowerCase().includes("ingénieur") ||
        l.toLowerCase().includes("engineer") ||
        l.toLowerCase().includes("developer") ||
        l.toLowerCase().includes("architect") ||
        l.toLowerCase().includes("lead"))
  );
  return titleLine ?? "Ingénieur Logiciel Full-Stack";
}

// ── AI tailoring ───────────────────────────────────────────────────
type TailoredOutput = {
  language: 'fr' | 'en';
  tagline: string;
  summary: string;
  jobTitle: string;
  capabilities: string[];
  experiences: Array<{
    id: string;
    role: string;
    description: string;
    score: number;
  }>;
  projects: Array<{
    slug: string;
    title: string;
    desc: string;
    score: number;
  }>;
  relevantSkills: string[];
};

async function tailorWithAI(args: {
  jobOffer: string;
  about: { intro: string; body: string } | null;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
    skills: string[];
    location: string;
  }>;
  projects: Array<{
    title: string;
    desc: string;
    tags: string[];
    categories: string[];
    slug: string;
  }>;
  keywords: string[];
}): Promise<TailoredOutput | null> {
  const provider = getActiveAiProvider();
  if (provider === "mock") return null;

  const system = `You are an expert recruiter and CV writer. From a job offer and the candidate's full portfolio, you build an ULTRA-TARGETED CV that rewrites each section to match the offer.

CRITICAL — Language detection:
1. Detect the dominant language of the JOB OFFER (French OR English).
2. Write ALL output fields (tagline, summary, jobTitle, capabilities, experience descriptions, project descriptions) in THAT detected language. Always.
3. If the offer is in French, write the CV in French. If in English, in English.

Strict rules:
- Reply ONLY with a valid JSON object. No text before/after. No markdown fence.
- "language": "fr" or "en" (detected from the job offer).
- "tagline": single line in UPPERCASE, ~80-110 chars, positioning the candidate vs the offer. Example FR: "INGÉNIEUR FULL-STACK SPÉCIALISÉ EN APIS DISTRIBUÉES ET DEVOPS CLOUD". Example EN: "FULL-STACK ENGINEER FOCUSED ON DISTRIBUTED APIS AND CLOUD DEVOPS".
- "summary": 2-3 concise sentences (~60 words max) rewriting the bio to match the offer. Include KEY METRICS and ACHIEVEMENTS when possible (years of experience, number of projects delivered, systems scaled, users impacted, performance improvements). Do NOT copy the bio verbatim. Focus on business impact and measurable results.
- "jobTitle": job title coherent with the offer, in the detected language.
- "capabilities": 4-6 short bullets (5-12 words each) listing what the candidate brings to this role, business-value oriented, in detected language.
- "experiences": ONLY pick the experiences relevant to this offer (3-5 max). Rewrite each description as 2-3 concise result-oriented sentences in detected language. Include quantifiable achievements where possible. ID must match an input id.
- "projects": ONLY pick relevant projects (3-5 max). Rewrite as 1-2 impact sentences in detected language. Mention scale, users, or business outcomes if applicable. SLUG must match an input slug.
- "relevantSkills": 8-15 key skills (strictly from the portfolio) that match the offer. Skills can stay in their natural form (tech names like "Spring Boot" don't translate).

Strict JSON format:
{
  "language": "fr" | "en",
  "tagline": "string",
  "summary": "string",
  "jobTitle": "string",
  "capabilities": ["string", ...],
  "experiences": [{"id":"string","role":"string","description":"string"}],
  "projects": [{"slug":"string","title":"string","desc":"string"}],
  "relevantSkills": ["string", ...]
}`;

  const cleanExperiences = args.experiences.map((e) => ({
    id: e.id,
    company: e.company,
    role: e.role,
    startDate: e.startDate,
    endDate: e.endDate ?? (e.current ? "présent" : ""),
    location: e.location,
    skills: e.skills,
    description: stripHtml(e.description),
  }));
  const cleanProjects = args.projects.map((p) => ({
    slug: p.slug,
    title: p.title,
    desc: stripHtml(p.desc),
    tags: p.tags,
    categories: p.categories,
  }));

  const userPayload = {
    jobOffer: args.jobOffer,
    detectedKeywords: args.keywords,
    candidate: {
      bio: args.about?.intro ?? "",
      bioBody: stripHtml(args.about?.body ?? ""),
    },
    portfolio: {
      experiences: cleanExperiences,
      projects: cleanProjects,
    },
  };

  try {
    const result = await aiGenerate({
      system,
      messages: [
        {
          role: "user",
          content: `Génère le CV ciblé en JSON pour cette offre + portfolio.\n\n${JSON.stringify(
            userPayload,
            null,
            2
          )}`,
        },
      ],
      json: true,
      maxTokens: 4096,
      temperature: 0.4,
    });

    let raw = result.text.trim();
    if (raw.startsWith("```")) {
      raw = raw.replace(/^```(?:json)?/i, "").replace(/```$/g, "").trim();
    }
    const firstBrace = raw.indexOf("{");
    const lastBrace = raw.lastIndexOf("}");
    if (firstBrace > 0) raw = raw.slice(firstBrace, lastBrace + 1);

    const parsed = JSON.parse(raw);

    const expById = new Map(cleanExperiences.map((e) => [e.id, e]));
    const projBySlug = new Map(cleanProjects.map((p) => [p.slug, p]));

    const tailoredExperiences = (parsed.experiences ?? [])
      .filter((e: { id?: string }) => e.id && expById.has(e.id))
      .map((e: { id: string; role: string; description: string }) => {
        const src = expById.get(e.id)!;
        return {
          id: e.id,
          role: e.role || src.role,
          description: e.description || src.description,
          score: scoreExperience(src, args.keywords),
        };
      });

    const tailoredProjects = (parsed.projects ?? [])
      .filter((p: { slug?: string }) => p.slug && projBySlug.has(p.slug))
      .map((p: { slug: string; title: string; desc: string }) => {
        const src = projBySlug.get(p.slug)!;
        return {
          slug: p.slug,
          title: p.title || src.title,
          desc: p.desc || src.desc,
          score: scoreProject(
            { ...src, title: p.title || src.title },
            args.keywords
          ),
        };
      });

    // Inline language detection (isEnglish defined later in file)
    const detectedLanguage: 'fr' | 'en' = parsed.language ?? (args.jobOffer.match(/\b(we are looking for|job description|requirements|engineer|developer)\b/gi)?.length ?? 0) >
      (args.jobOffer.match(/\b(nous recherchons|description du poste|profil recherché|ingénieur|développeur)\b/gi)?.length ?? 0) ? 'en' : 'fr';

    return {
      language: detectedLanguage,
      tagline: parsed.tagline ?? "",
      summary: parsed.summary ?? "",
      jobTitle: parsed.jobTitle ?? extractJobTitle(args.jobOffer),
      capabilities: Array.isArray(parsed.capabilities) ? parsed.capabilities : [],
      experiences: tailoredExperiences,
      projects: tailoredProjects,
      relevantSkills: Array.isArray(parsed.relevantSkills) ? parsed.relevantSkills : [],
    };
  } catch (e) {
    console.error("[cv-generator] AI tailoring failed:", e);
    return null;
  }
}

// ── Heuristic fallback (no AI) ─────────────────────────────────────
function tailorHeuristic(args: {
  jobOffer: string;
  about: { intro: string; body: string } | null;
  experiences: Array<{
    id: string;
    company: string;
    role: string;
    startDate: string;
    endDate: string | null;
    current: boolean;
    description: string;
    skills: string[];
    location: string;
  }>;
  projects: Array<{
    title: string;
    desc: string;
    tags: string[];
    categories: string[];
    slug: string;
  }>;
  keywords: string[];
  lang: 'fr' | 'en';
}): TailoredOutput {
  const exps = args.experiences
    .map((e) => ({
      id: e.id,
      role: e.role,
      description: stripHtml(e.description),
      score: scoreExperience(e, args.keywords),
    }))
    .sort((a, b) => b.score - a.score)
    // Keep only experiences with at least one keyword match (or top 3 if no match)
    .filter((e, i) => e.score > 0 || i < 3)
    .slice(0, 5);

  const projs = args.projects
    .map((p) => ({
      slug: p.slug,
      title: p.title,
      desc: stripHtml(p.desc),
      score: scoreProject(p, args.keywords),
    }))
    .sort((a, b) => b.score - a.score)
    .filter((p, i) => p.score > 0 || i < 3)
    .slice(0, 5);

  const allSkillsSet = new Set<string>();
  args.experiences.forEach((e) => e.skills.forEach((s) => allSkillsSet.add(s)));
  args.projects.forEach((p) => p.tags.forEach((t) => allSkillsSet.add(t)));
  const allSkills = Array.from(allSkillsSet);
  const relevantSkills = allSkills.filter((s) =>
    args.keywords.some((k) => s.toLowerCase().includes(k))
  );

  return {
    language: args.lang,
    tagline: "",
    summary: stripHtml(args.about?.intro ?? ""),
    jobTitle: extractJobTitle(args.jobOffer),
    capabilities: [],
    experiences: exps,
    projects: projs,
    relevantSkills: relevantSkills.slice(0, 12),
  };
}

// ── Main handler ───────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json(
      { message: "Non autorisé — connexion requise" },
      { status: 401 }
    );
  }

  const { jobOffer } = await req.json();
  if (!jobOffer || typeof jobOffer !== "string" || jobOffer.trim().length < 50) {
    return NextResponse.json(
      { message: "L'offre d'emploi est trop courte (min 50 caractères)" },
      { status: 400 }
    );
  }

  const [allProjects, allExperiences, about] = await Promise.all([
    getAllProjects().catch(() => []),
    getExperiences().catch(() => []),
    aboutPageRepository.getCurrent().catch(() => null),
  ]);

  const keywords = extractKeywords(jobOffer);

  const projectsForAi = allProjects.map((p) => ({
    title: p.title,
    desc: p.desc,
    tags: p.tags,
    categories: p.categories,
    slug: p.slug,
  }));

  const aiResult = await tailorWithAI({
    jobOffer,
    about: about ? { intro: about.intro, body: about.body } : null,
    experiences: allExperiences,
    projects: projectsForAi,
    keywords,
  });

  // Inline language detection
  const enMatches = (jobOffer.match(/\b(we are looking for|job description|requirements|engineer|developer|architect|senior|junior|software)\b/gi) || []).length;
  const frMatches = (jobOffer.match(/\b(nous recherchons|description du poste|profil recherché|ingénieur|développeur|architecte|senior|junior|logiciel)\b/gi) || []).length;
  const detectedLang: 'fr' | 'en' = enMatches > frMatches ? 'en' : 'fr';

  const tailored =
    aiResult ??
    tailorHeuristic({
      jobOffer,
      about: about ? { intro: about.intro, body: about.body } : null,
      experiences: allExperiences,
      projects: projectsForAi,
      keywords,
      lang: detectedLang,
    });

  // Hydrate experience metadata (company, location, dates) from source
  const expById = new Map(allExperiences.map((e) => [e.id, e]));
  const hydratedExperiences = tailored.experiences
    .map((te) => {
      const src = expById.get(te.id);
      if (!src) return null;
      return {
        id: src.id,
        company: src.company,
        role: te.role,
        startDate: src.startDate,
        endDate: src.endDate,
        current: src.current,
        description: te.description,
        skills: src.skills,
        location: src.location,
        score: te.score,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  // Hydrate project metadata from source
  const projBySlug = new Map(allProjects.map((p) => [p.slug, p]));
  const hydratedProjects = tailored.projects
    .map((tp) => {
      const src = projBySlug.get(tp.slug);
      if (!src) return null;
      return {
        slug: tp.slug,
        title: tp.title,
        desc: tp.desc,
        tags: src.tags,
        score: tp.score,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);

  // All skills (for the Compétences section)
  const allSkills = Array.from(
    new Set([
      ...hydratedExperiences.flatMap((e) => e.skills),
      ...hydratedProjects.flatMap((p) => p.tags),
    ])
  ).slice(0, 24);

  const cv = {
    keywords,
    language: tailored.language,
    tagline: tailored.tagline,
    summary: tailored.summary,
    jobTitle: tailored.jobTitle,
    capabilities: tailored.capabilities,
    experiences: hydratedExperiences,
    projects: hydratedProjects,
    relevantSkills: tailored.relevantSkills,
    allSkills,
    aiProvider: getActiveAiProvider(),
  };

  return NextResponse.json({ ok: true, cv });
}
