/**
 * Cover-letter generator — drafts a tailored "lettre de motivation" from a
 * job offer using the same AI provider abstraction as the CV generator.
 *
 * Returns a structured object that the front-end can drop into editable
 * fields. The user can also write everything by hand and skip the AI call.
 */
import { auth } from "@/auth";
import { aboutPageRepository } from "@/features/about/repositories/about-page.repository";
import { getExperiences } from "@/features/experience/use-cases/get-experiences.use-case";
import { aiGenerate, getActiveAiProvider } from "@/lib/ai-provider";
import { NextRequest, NextResponse } from "next/server";

function stripHtml(s: string): string {
  return (s ?? "")
    .replace(/<\/?(p|br|div|h[1-6]|li|ul|ol|strong|em|a|u|span|table|tr|td|th|img|hr)[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function detectLanguage(text: string): "fr" | "en" {
  const en = /\b(engineer|developer|software|engineering|join the team|we are looking for|responsibilities)\b/i;
  const fr = /\b(ingénieur|développeur|équipe|nous recherchons|profil recherché|missions|poste)\b/i;
  if (en.test(text) && !fr.test(text)) return "en";
  return "fr";
}

// Pull a likely company / role / contact name from the offer text — pragmatic,
// not bulletproof. The user always has the chance to override in the form.
function extractCompany(text: string): string {
  const m = text.match(/(?:chez|au sein de|join the team at|at)\s+([A-Z][\w\s&.-]{2,60})/);
  return (m?.[1] ?? "").trim().split(/[\n,.]/)[0] ?? "";
}

function extractRole(text: string): string {
  const lines = text.split("\n").map((l) => l.trim()).filter(Boolean);
  const titleLine = lines.find(
    (l) =>
      l.length < 80 &&
      (l.toLowerCase().includes("développeur") ||
        l.toLowerCase().includes("ingénieur") ||
        l.toLowerCase().includes("engineer") ||
        l.toLowerCase().includes("developer") ||
        l.toLowerCase().includes("architect") ||
        l.toLowerCase().includes("lead") ||
        l.toLowerCase().includes("senior"))
  );
  return titleLine ?? "";
}

type LetterDraft = {
  language: "fr" | "en";
  company: string;
  role: string;
  subject: string;
  greeting: string;
  intro: string;
  body: string;
  closing: string;
  signoff: string;
};

const FALLBACK_FR = (company: string, role: string): LetterDraft => ({
  language: "fr",
  company,
  role,
  subject: role
    ? `Candidature au poste de ${role}`
    : "Candidature spontanée",
  greeting: "Madame, Monsieur,",
  intro:
    "Architecte logiciel et ingénieur full-stack avec plusieurs années d'expérience sur des projets institutionnels et des solutions métiers à enjeux financiers, votre annonce a retenu toute mon attention.",
  body:
    "Au cours de mon parcours, j'ai conçu et livré des architectures distribuées sécurisées, en m'appuyant sur des stacks modernes (Next.js, NestJS, Spring Boot, Flutter). J'attache une importance particulière à la fiabilité, à la sécurité des accès et à la qualité du code. Je suis convaincu que ma capacité à travailler avec des équipes métiers et techniques pourrait apporter une réelle valeur ajoutée à vos projets.",
  closing:
    "Je serais ravi d'échanger avec vous sur les enjeux de ce poste et la façon dont mon expérience pourrait répondre à vos besoins.",
  signoff:
    "Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
});

const FALLBACK_EN = (company: string, role: string): LetterDraft => ({
  language: "en",
  company,
  role,
  subject: role ? `Application for ${role}` : "Job application",
  greeting: "Dear Hiring Manager,",
  intro:
    "As a software architect and full-stack engineer with several years of experience delivering institutional and business-critical projects, your job posting caught my attention.",
  body:
    "Throughout my career I have designed and shipped secure distributed architectures using modern stacks (Next.js, NestJS, Spring Boot, Flutter). I value reliability, secure access management and clean code, and I enjoy bridging the gap between business and engineering teams. I believe my background could meaningfully contribute to your projects.",
  closing:
    "I would welcome the opportunity to discuss how my experience could match your needs.",
  signoff: "Sincerely,",
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  let jobOffer = "";
  try {
    const body = (await req.json()) as { jobOffer?: string };
    jobOffer = (body.jobOffer ?? "").trim();
  } catch {
    return NextResponse.json({ message: "Body invalide" }, { status: 400 });
  }
  if (jobOffer.length < 30) {
    return NextResponse.json({ message: "Offre trop courte" }, { status: 400 });
  }

  const language = detectLanguage(jobOffer);
  const company = extractCompany(jobOffer);
  const role = extractRole(jobOffer);

  // Fetch context to ground the AI in the candidate's real background.
  const [about, experiences] = await Promise.all([
    aboutPageRepository.getOrCreate().catch(() => null),
    getExperiences().catch(() => []),
  ]);

  const aboutSummary = about
    ? `${about.intro ?? ""}\n${stripHtml(about.body ?? "")}`.slice(0, 1500)
    : "";

  const recentExperiences = experiences.slice(0, 4).map((e) => ({
    role: e.role,
    company: e.company,
    description: stripHtml(e.description).slice(0, 240),
  }));

  const provider = getActiveAiProvider();

  // Heuristic / no-AI fallback
  if (provider === "mock") {
    const draft = language === "en" ? FALLBACK_EN(company, role) : FALLBACK_FR(company, role);
    return NextResponse.json({ letter: draft, aiProvider: "mock" });
  }

  const system = `You are an expert career coach who writes concise, sincere cover letters in ${
    language === "en" ? "English" : "French"
  }. You ground every paragraph in the candidate's actual background; never invent experiences.

Return ONLY valid JSON with this exact shape (no prose, no code fences):
{
  "language": "${language}",
  "company": "<company name extracted from the offer, or empty string>",
  "role": "<role title from the offer, or empty string>",
  "subject": "<one-line subject prefixed with 'Objet :' (FR) or 'Subject:' (EN)>",
  "greeting": "<formal salutation>",
  "intro": "<2–3 sentences positioning the candidate vs the offer>",
  "body": "<3–5 sentences citing 1–2 concrete experiences and matching them to the offer's needs>",
  "closing": "<1–2 sentences expressing motivation to discuss further>",
  "signoff": "<formal closing — 'Cordialement,' / 'Sincerely,' or equivalent>"
}

Tone: professional, confident, concise. No bullet points. No markdown.`;

  const userPrompt = `JOB OFFER:
"""
${jobOffer.slice(0, 4000)}
"""

CANDIDATE BACKGROUND (use as truth — do not invent):
${aboutSummary}

RECENT EXPERIENCES:
${recentExperiences
  .map(
    (e, i) =>
      `${i + 1}. ${e.role} @ ${e.company}\n   ${e.description}`
  )
  .join("\n")}

CANDIDATE NAME: Seba Gedeon Matsoula Malonga

Write the cover letter now. JSON only.`;

  try {
    const ai = await aiGenerate({
      system,
      messages: [{ role: "user", content: userPrompt }],
      json: true,
      temperature: 0.4,
      maxTokens: 1200,
    });

    const parsed = safeParseJSON(ai.text);
    if (!parsed) {
      const draft = language === "en" ? FALLBACK_EN(company, role) : FALLBACK_FR(company, role);
      return NextResponse.json({
        letter: draft,
        aiProvider: ai.provider,
        warning: "AI did not return valid JSON; using fallback draft.",
      });
    }

    // Hydrate with extracted fields when the AI left them blank.
    const letter: LetterDraft = {
      language,
      company: parsed.company || company,
      role: parsed.role || role,
      subject: parsed.subject || (language === "en" ? `Subject: Application for ${role}` : `Objet : Candidature au poste de ${role}`),
      greeting: parsed.greeting || (language === "en" ? "Dear Hiring Manager," : "Madame, Monsieur,"),
      intro: parsed.intro || "",
      body: parsed.body || "",
      closing: parsed.closing || "",
      signoff: parsed.signoff || (language === "en" ? "Sincerely," : "Cordialement,"),
    };

    return NextResponse.json({ letter, aiProvider: ai.provider });
  } catch (err) {
    const draft = language === "en" ? FALLBACK_EN(company, role) : FALLBACK_FR(company, role);
    return NextResponse.json({
      letter: draft,
      aiProvider: "fallback",
      warning: err instanceof Error ? err.message : "AI call failed",
    });
  }
}

function safeParseJSON(text: string): Partial<LetterDraft> | null {
  if (!text) return null;
  // Tolerate code fences / leading prose by extracting the largest JSON object.
  const match = text.match(/\{[\s\S]*\}/);
  const raw = match ? match[0] : text;
  try {
    return JSON.parse(raw) as Partial<LetterDraft>;
  } catch {
    return null;
  }
}
