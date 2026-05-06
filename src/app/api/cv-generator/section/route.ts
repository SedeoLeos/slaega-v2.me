import { auth } from "@/auth";
import { aiGenerate, getActiveAiProvider } from "@/lib/ai-provider";
import { NextRequest, NextResponse } from "next/server";

type SectionKey = "tagline" | "summary" | "capabilities" | "experience" | "projects" | "skills";

function stripHtml(s: string): string {
  return (s ?? "")
    .replace(/<\/?(p|br|div|h[1-6]|li|ul|ol|strong|em|a|u|span)[^>]*>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const SECTION_PROMPTS: Record<SectionKey, (jobOffer: string, cv: Record<string, unknown>, lang: string) => string> = {
  tagline: (jobOffer, _cv, lang) => `
You are an expert CV writer. Generate a single professional tagline in ${lang === "en" ? "English" : "French"}.
The tagline must be in UPPERCASE, ~80-110 characters, positioning the candidate vs this job offer.
Example (en): "FULL-STACK ENGINEER FOCUSED ON DISTRIBUTED APIS AND CLOUD DEVOPS"
Example (fr): "INGÉNIEUR FULL-STACK SPÉCIALISÉ EN APIS DISTRIBUÉES ET DEVOPS CLOUD"

Job offer: ${jobOffer}

Reply with ONLY the tagline text. No quotes, no JSON, no explanation.`,

  summary: (jobOffer, cv, lang) => `
You are an expert CV writer. Rewrite the candidate's summary in ${lang === "en" ? "English" : "French"}.
2-3 concise sentences (~60 words max) highlighting business impact, metrics, and achievements relevant to this job offer.

Job offer: ${jobOffer}
Current summary: ${stripHtml(String(cv.summary ?? ""))}

Reply with ONLY the rewritten summary paragraph. No JSON, no explanation.`,

  capabilities: (jobOffer, cv, lang) => `
You are an expert CV writer. Generate 4-6 bullet points in ${lang === "en" ? "English" : "French"} for "What I can deliver".
Each bullet = 5-12 words, business-value oriented, relevant to this job offer.
Use the candidate's experience and skills to ground the bullets.

Job offer: ${jobOffer}
Current capabilities: ${Array.isArray(cv.capabilities) ? (cv.capabilities as string[]).join(" / ") : ""}

Reply with ONLY the bullet points, one per line. No JSON, no explanation.`,

  experience: (jobOffer, cv, lang) => `
You are an expert CV writer. Rewrite the experience descriptions in ${lang === "en" ? "English" : "French"}.
For each experience, write 2-3 result-oriented sentences. Use quantifiable achievements where possible.

Job offer: ${jobOffer}
Experiences: ${JSON.stringify(
    (cv.experiences as Array<{ id: string; role: string; company: string; description: string }>)?.map((e) => ({
      id: e.id,
      role: e.role,
      company: e.company,
      description: stripHtml(e.description),
    })) ?? []
  )}

Reply with a JSON array (no markdown fence):
[{"id": "string", "description": "string"}]`,

  projects: (jobOffer, cv, lang) => `
You are an expert CV writer. Rewrite the project descriptions in ${lang === "en" ? "English" : "French"}.
1-2 impact sentences per project, mentioning scale or outcomes if applicable.

Job offer: ${jobOffer}
Projects: ${JSON.stringify(
    (cv.projects as Array<{ slug: string; title: string; desc: string }>)?.map((p) => ({
      slug: p.slug,
      title: p.title,
      desc: stripHtml(p.desc),
    })) ?? []
  )}

Reply with a JSON array (no markdown fence):
[{"slug": "string", "desc": "string"}]`,

  skills: (_jobOffer, cv, _lang) => `
Return the same skills JSON. No change needed.
${JSON.stringify(cv.relevantSkills ?? [])}`,
};

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  const body = await req.json();
  const { section, jobOffer, cv } = body as { section: SectionKey; jobOffer: string; cv: Record<string, unknown> };

  if (!section || !jobOffer || !cv) {
    return NextResponse.json({ message: "Paramètres manquants" }, { status: 400 });
  }

  const provider = getActiveAiProvider();
  if (provider === "mock") {
    return NextResponse.json({ message: "IA non configurée" }, { status: 503 });
  }

  const lang = String(cv.language ?? "fr");
  const promptFn = SECTION_PROMPTS[section];
  if (!promptFn) {
    return NextResponse.json({ message: "Section inconnue" }, { status: 400 });
  }

  const prompt = promptFn(jobOffer, cv, lang);

  try {
    const result = await aiGenerate({
      system: "You are an expert CV writer. Follow instructions precisely.",
      messages: [{ role: "user", content: prompt }],
      json: false,
      maxTokens: 1024,
      temperature: 0.5,
    });

    const raw = result.text.trim();

    // For experience / projects sections, parse JSON and merge back into cv
    if (section === "experience" || section === "projects") {
      try {
        let jsonStr = raw;
        if (jsonStr.startsWith("```")) jsonStr = jsonStr.replace(/^```(?:json)?/i, "").replace(/```$/, "").trim();
        const parsed = JSON.parse(jsonStr);

        if (section === "experience" && Array.isArray(parsed)) {
          const updated = (cv.experiences as Array<{ id: string; description: string; [k: string]: unknown }>).map((exp) => {
            const match = parsed.find((p: { id: string }) => p.id === exp.id);
            return match ? { ...exp, description: match.description } : exp;
          });
          return NextResponse.json({ ok: true, experiences: updated });
        }

        if (section === "projects" && Array.isArray(parsed)) {
          const updated = (cv.projects as Array<{ slug: string; desc: string; [k: string]: unknown }>).map((proj) => {
            const match = parsed.find((p: { slug: string }) => p.slug === proj.slug);
            return match ? { ...proj, desc: match.desc } : proj;
          });
          return NextResponse.json({ ok: true, projects: updated });
        }
      } catch {
        return NextResponse.json({ message: "Erreur parsing IA" }, { status: 500 });
      }
    }

    // For text sections: return raw text
    return NextResponse.json({ ok: true, text: raw });
  } catch (e) {
    console.error("[cv-section] error:", e);
    return NextResponse.json({ message: "Erreur IA" }, { status: 500 });
  }
}
