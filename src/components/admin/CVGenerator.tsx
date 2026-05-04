"use client";

import { useRef, useState } from "react";

type CVData = {
  keywords: string[];
  tagline?: string;
  summary?: string;
  jobTitle: string;
  capabilities?: string[];
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
    score: number;
  }>;
  projects: Array<{
    title: string;
    desc: string;
    tags: string[];
    slug: string;
    score: number;
  }>;
  relevantSkills: string[];
  allSkills: string[];
  aiProvider?: string;
};

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
const MONTHS_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function isEnglish(s: string): boolean {
  const en = /\b(engineer|developer|architect|manager|lead|senior|junior|software)\b/i;
  return en.test(s) && !/\b(ingénieur|développeur|architecte|chef|équipe|logiciel)\b/i.test(s);
}

function formatMonth(date: string | null, current: boolean, lang: "fr" | "en") {
  if (current) return lang === "en" ? "PRESENT" : "PRÉSENT";
  if (!date) return "";
  const [y, m] = date.split("-");
  const months = lang === "en" ? MONTHS_EN : MONTHS_FR;
  return `${months[parseInt(m) - 1]} ${y}`;
}

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

const DEFAULT_FR = {
  tagline: "ARCHITECTE LOGICIEL & INGÉNIEUR FULL-STACK ORIENTÉ SOLUTIONS MÉTIERS ET INSTITUTIONNELLES",
  capabilities: [
    "Contribuer à des projets numériques à enjeux financiers et institutionnels",
    "Proposer et intégrer des solutions fiables adaptées aux contraintes métiers",
    "Sécuriser les accès et les données dans des systèmes sensibles",
    "Automatiser et améliorer des processus pour gagner en efficacité",
    "Travailler avec des équipes métiers et techniques dans des environnements réglementés",
  ],
  bio: "Architecte logiciel et ingénieur full-stack avec une expérience couvrant des projets institutionnels, des missions de conseil et des solutions métiers à enjeux financiers.",
  labels: {
    email: "E-MAIL",
    phone: "TÉLÉPHONE",
    linkedin: "LINKEDIN",
    canDo: "CE QUE JE PEUX RÉALISER",
    experience: "EXPÉRIENCE",
    projects: "PROJETS SÉLECTIONNÉS",
    skills: "COMPÉTENCES",
    page: "Page",
    of: "sur",
  },
};
const DEFAULT_EN = {
  tagline: "SOFTWARE ARCHITECT & FULL-STACK ENGINEER FOCUSED ON BUSINESS AND INSTITUTIONAL SOLUTIONS",
  capabilities: [
    "Deliver digital projects with financial and institutional stakes",
    "Design and integrate reliable solutions adapted to business constraints",
    "Secure access and data in sensitive systems",
    "Automate and improve processes for efficiency gains",
    "Collaborate with business and tech teams in regulated environments",
  ],
  bio: "Software architect and full-stack engineer with experience across institutional projects, consulting missions and business-critical solutions with financial stakes.",
  labels: {
    email: "EMAIL",
    phone: "PHONE",
    linkedin: "LINKEDIN",
    canDo: "WHAT I CAN DELIVER",
    experience: "EXPERIENCE",
    projects: "SELECTED PROJECTS",
    skills: "SKILLS",
    page: "Page",
    of: "of",
  },
};

const PROFILE = {
  name: "SEBA GEDEON",
  surname: "MATSOULA MALONGA",
  email: "gedeon.matsoula@gmail.com",
  phone: "+242066900110",
  linkedin: "https://www.linkedin.com/in/slaega",
  photo: "/images/me.jpg",
};

// ─────────────────────────────────────────────────────────────────
// Pagination: distribute content into A4 pages
// Approximate "weight" for each block to know when a page is full.
// One A4 (with 18mm margin top/bottom) leaves ~248mm of usable height.
// Weights are tuned empirically.
// ─────────────────────────────────────────────────────────────────

// Usable height per A4 page (297mm − 15mm top − 15mm bottom = 267mm).
// Tuned slightly conservative to avoid bottom overflow.
const PAGE_CAPACITY = 262; // mm

type ExperienceItem = CVData["experiences"][number];
type ProjectItem = CVData["projects"][number];

type Block =
  | { type: "header"; weight: number }
  | { type: "bio"; weight: number; text: string }
  | { type: "contact"; weight: number }
  | { type: "capabilities"; weight: number; items: string[] }
  | { type: "section-title"; weight: number; label: string }
  | { type: "experience"; weight: number; data: ExperienceItem }
  | { type: "project"; weight: number; data: ProjectItem }
  | { type: "skills"; weight: number; relevant: string[]; all: string[] };

function estimateExperienceWeight(exp: ExperienceItem): number {
  const text = stripHtml(exp.description);
  // role+date row ~7mm, company line ~5mm, then ~4.3mm per ~120 chars of body.
  const descMm = Math.ceil(text.length / 120) * 4.3;
  return 13 + descMm;
}

function estimateProjectWeight(p: ProjectItem): number {
  const text = stripHtml(p.desc);
  const descMm = Math.ceil(text.length / 120) * 4.3;
  const tagsMm = p.tags.length > 0 ? 4 : 0;
  return 11 + descMm + tagsMm;
}

function estimateSkillsWeight(all: string[]): number {
  // 3-column grid → ~5mm per row.
  return 6 + Math.ceil(all.length / 3) * 5;
}

function buildBlocks(cv: CVData, summary: string, capabilities: string[], L: typeof DEFAULT_FR): Block[] {
  const blocks: Block[] = [];

  // Header bundles tagline + name + photo (rendered on every page actually,
  // but here we only count it once for page-1 layout).
  blocks.push({ type: "header", weight: 52 });
  // Bio: ~4.5mm per ~120 chars of summary, min 12mm.
  const bioMm = Math.max(12, Math.ceil(summary.length / 120) * 4.5);
  blocks.push({ type: "bio", weight: bioMm, text: summary });
  // Contact row (single line of 3 columns): ~14mm.
  blocks.push({ type: "contact", weight: 14 });
  if (capabilities.length > 0) {
    blocks.push({
      type: "capabilities",
      weight: 10 + capabilities.length * 5,
      items: capabilities,
    });
  }

  if (cv.experiences.length > 0) {
    blocks.push({ type: "section-title", weight: 14, label: L.labels.experience });
    cv.experiences.forEach((exp) => {
      blocks.push({ type: "experience", weight: estimateExperienceWeight(exp), data: exp });
    });
  }

  if (cv.projects.length > 0) {
    blocks.push({ type: "section-title", weight: 14, label: L.labels.projects });
    cv.projects.slice(0, 5).forEach((p) => {
      blocks.push({ type: "project", weight: estimateProjectWeight(p), data: p });
    });
  }

  if (cv.allSkills.length > 0) {
    blocks.push({ type: "section-title", weight: 14, label: L.labels.skills });
    blocks.push({
      type: "skills",
      weight: estimateSkillsWeight(cv.allSkills),
      relevant: cv.relevantSkills,
      all: cv.allSkills,
    });
  }

  return blocks;
}

function paginate(blocks: Block[]): Block[][] {
  const pages: Block[][] = [];
  let current: Block[] = [];
  let used = 0;

  for (const block of blocks) {
    // Avoid orphan section titles at bottom: if a section-title would be the
    // last thing on a page (less than ~25mm of room remaining), bump to next.
    if (block.type === "section-title" && PAGE_CAPACITY - used < 25 && current.length > 0) {
      pages.push(current);
      current = [];
      used = 0;
    }

    if (used + block.weight > PAGE_CAPACITY && current.length > 0) {
      pages.push(current);
      current = [];
      used = 0;
    }

    current.push(block);
    used += block.weight;
  }

  if (current.length > 0) pages.push(current);
  return pages.length > 0 ? pages : [[]];
}

// ─────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────

export default function CVGenerator() {
  const [jobOffer, setJobOffer] = useState("");
  const [cv, setCv] = useState<CVData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const printRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (jobOffer.trim().length < 50) {
      setError("L'offre est trop courte (min 50 caractères)");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/cv-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobOffer }),
      });
      const data = await res.json();
      if (res.ok) {
        setCv(data.cv);
        setStatus("idle");
      } else {
        setError(data.message ?? "Erreur");
        setStatus("error");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
      setStatus("error");
    }
  };

  const print = () => window.print();

  const lang: "fr" | "en" = cv && isEnglish(`${cv.jobTitle} ${cv.tagline ?? ""} ${cv.summary ?? ""}`) ? "en" : "fr";
  const L = lang === "en" ? DEFAULT_EN : DEFAULT_FR;
  const tagline = cv?.tagline?.trim() || L.tagline;
  const summary = cv?.summary?.trim() || L.bio;
  const capabilities =
    cv?.capabilities && cv.capabilities.length > 0 ? cv.capabilities : L.capabilities;

  const pages = cv ? paginate(buildBlocks(cv, summary, capabilities, L)) : [];

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-6">
      {/* ── Input panel ── */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-zinc-400 mb-1.5">
            Offre d&apos;emploi
          </label>
          <textarea
            value={jobOffer}
            onChange={(e) => setJobOffer(e.target.value)}
            placeholder="Colle ici l'offre d'emploi complète…"
            rows={14}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app focus:ring-2 focus:ring-green-app/20 transition-all resize-y font-mono leading-relaxed"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={generate}
            disabled={status === "loading"}
            className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-5 py-2.5 rounded-full text-sm shadow-sm shadow-green-app/30 disabled:opacity-50 transition-colors"
          >
            {status === "loading" ? "Génération…" : "Générer le CV"}
          </button>

          {cv && (
            <button
              type="button"
              onClick={print}
              className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-300 hover:text-white hover:border-zinc-500 px-4 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              PDF ({pages.length} {pages.length > 1 ? "pages" : "page"})
            </button>
          )}
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {cv && (
          <div className="space-y-3">
            {cv.aiProvider && (
              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-app" />
                IA: <span className="text-zinc-300 font-medium">{cv.aiProvider}</span>
                <span className="text-zinc-600">·</span>
                <span>Langue: {lang === "fr" ? "Français" : "English"}</span>
              </div>
            )}

            {cv.keywords.length > 0 && (
              <div className="p-3 bg-zinc-900 border border-zinc-800/60 rounded-lg">
                <p className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-wide">
                  Mots-clés détectés ({cv.keywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {cv.keywords.map((k) => (
                    <span
                      key={k}
                      className="text-xs bg-green-app/15 text-green-app border border-green-app/25 px-2 py-0.5 rounded-full font-medium"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2.5 bg-zinc-900 border border-zinc-800/60 rounded-lg">
                <p className="text-zinc-500">Pages</p>
                <p className="text-zinc-200 font-bold text-base">{pages.length}</p>
              </div>
              <div className="p-2.5 bg-zinc-900 border border-zinc-800/60 rounded-lg">
                <p className="text-zinc-500">Exp.</p>
                <p className="text-zinc-200 font-bold text-base">{cv.experiences.length}</p>
              </div>
              <div className="p-2.5 bg-zinc-900 border border-zinc-800/60 rounded-lg">
                <p className="text-zinc-500">Projets</p>
                <p className="text-zinc-200 font-bold text-base">{cv.projects.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── CV Preview ── */}
      <div className="cv-preview-wrap">
        {!cv ? (
          <div className="h-full min-h-[600px] border border-dashed border-zinc-700 rounded-xl flex flex-col items-center justify-center text-center p-8">
            <div className="w-12 h-12 rounded-xl bg-zinc-800 flex items-center justify-center mb-3">
              <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-zinc-300">Aucun CV généré</p>
            <p className="text-xs text-zinc-500 mt-1 max-w-xs">
              Colle une offre d&apos;emploi puis clique sur &quot;Générer le CV&quot;.
              L&apos;IA sélectionnera et reformulera les expériences et projets pertinents
              dans la langue de l&apos;offre.
            </p>
          </div>
        ) : (
          <div id="cv-print" ref={printRef} className="cv-pages">
            {pages.map((blocks, pageIndex) => (
              <CVPage
                key={pageIndex}
                pageNumber={pageIndex + 1}
                totalPages={pages.length}
                blocks={blocks}
                tagline={tagline}
                lang={lang}
                L={L}
              />
            ))}

            <CVStyles />
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// One A4 page
// ─────────────────────────────────────────────────────────────────

function CVPage({
  blocks,
  pageNumber,
  totalPages,
  tagline,
  lang,
  L,
}: {
  blocks: Block[];
  pageNumber: number;
  totalPages: number;
  tagline: string;
  lang: "fr" | "en";
  L: typeof DEFAULT_FR;
}) {
  return (
    <div className="cv-page">
      {/* Background pattern — present on every page */}
      <GeoPattern />

      <div className="cv-content">
        {blocks.map((block, i) => {
          switch (block.type) {
            case "header":
              return <HeaderBlock key={i} tagline={tagline} />;
            case "bio":
              return (
                <p key={i} className="cv-bio">
                  {block.text}
                </p>
              );
            case "contact":
              return <ContactBlock key={i} L={L} />;
            case "capabilities":
              return (
                <div key={i} className="cv-capabilities">
                  <p className="cv-mini-heading">{L.labels.canDo}</p>
                  <ul className="cv-bullets">
                    {block.items.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              );
            case "section-title":
              return <SectionTitle key={i}>{block.label}</SectionTitle>;
            case "experience":
              return <ExperienceArticle key={i} exp={block.data} lang={lang} />;
            case "project":
              return <ProjectArticle key={i} project={block.data} />;
            case "skills":
              return (
                <div key={i} className="cv-skills-grid">
                  {block.all.map((s) => {
                    const relevant = block.relevant.includes(s);
                    return (
                      <div key={s} className="cv-skill-item">
                        <span className={`cv-skill-marker ${relevant ? "is-relevant" : ""}`} />
                        <span className={`cv-skill-label ${relevant ? "is-relevant" : ""}`}>{s}</span>
                      </div>
                    );
                  })}
                </div>
              );
          }
        })}
      </div>

      {/* Page number footer */}
      {totalPages > 1 && (
        <div className="cv-page-number">
          {L.labels.page} {pageNumber} {L.labels.of} {totalPages}
        </div>
      )}
    </div>
  );
}

function HeaderBlock({ tagline }: { tagline: string }) {
  return (
    <header className="cv-header">
      <div className="cv-header-left">
        <p className="cv-tagline">{tagline}</p>
        <div className="cv-divider" />
        <h1 className="cv-name">
          {PROFILE.name}
          <br />
          {PROFILE.surname}
        </h1>
      </div>
      <div className="cv-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PROFILE.photo} alt="Seba Gedeon" className="cv-photo-img" />
      </div>
    </header>
  );
}

function ContactBlock({ L }: { L: typeof DEFAULT_FR }) {
  return (
    <div className="cv-contact-row">
      <div>
        <p className="cv-contact-label">{L.labels.email}</p>
        <p className="cv-contact-value">{PROFILE.email}</p>
      </div>
      <div>
        <p className="cv-contact-label">{L.labels.phone}</p>
        <p className="cv-contact-value">{PROFILE.phone}</p>
      </div>
      <div>
        <p className="cv-contact-label">{L.labels.linkedin}</p>
        <p className="cv-contact-value">{PROFILE.linkedin}</p>
      </div>
    </div>
  );
}

function ExperienceArticle({ exp, lang }: { exp: ExperienceItem; lang: "fr" | "en" }) {
  return (
    <article className="cv-job">
      <div className="cv-job-header">
        <div className="cv-job-title-wrap">
          <span className="cv-job-marker" />
          <h3 className="cv-job-title">{exp.role}</h3>
        </div>
        <span className="cv-job-date">
          {formatMonth(exp.startDate, false, lang)}
          {" - "}
          {formatMonth(exp.endDate, exp.current, lang)}
        </span>
      </div>
      <p className="cv-job-company">
        {exp.company.toUpperCase()}
        {exp.location && `, ${exp.location.toUpperCase()}`}
      </p>
      <p className="cv-job-desc">{stripHtml(exp.description)}</p>
    </article>
  );
}

function ProjectArticle({ project }: { project: ProjectItem }) {
  return (
    <article className="cv-job">
      <div className="cv-job-header">
        <div className="cv-job-title-wrap">
          <span className="cv-job-marker" />
          <h3 className="cv-job-title">{project.title}</h3>
        </div>
      </div>
      <p className="cv-job-desc">{stripHtml(project.desc)}</p>
      {project.tags.length > 0 && (
        <p className="cv-job-tags">{project.tags.slice(0, 6).join(" · ")}</p>
      )}
    </article>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cv-section-title">
      <span className="cv-section-title-marker" />
      {children}
    </h2>
  );
}

function GeoPattern() {
  const styleLeft: React.CSSProperties = {
    top: 0,
    left: 0,
    width: "35%",
    height: "100%",
    objectFit: "contain",
    objectPosition: "top left",
    opacity: 0.95,
  };

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cv-bg.png"
        alt=""
        aria-hidden="true"
        className="cv-geo-pattern-img"
        style={styleLeft}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
          const next = e.currentTarget.nextElementSibling as HTMLElement | null;
          if (next) next.style.display = "block";
        }}
      />
      <SvgGeoFallback />
    </>
  );
}

function SvgGeoFallback() {
  const SKEW = 6;
  const rows = 9;
  const cols = 6;
  const tileW = 18;
  const tileH = 13;
  const gap = 1;

  const opacityPattern = [
    0.22, 0.08, 0.18, 0.06, 0.20, 0.11,
    0.25, 0.09, 0.14, 0.05, 0.18, 0.13,
    0.07, 0.21, 0.10, 0.17, 0.06, 0.23,
    0.12, 0.08, 0.19, 0.15, 0.07, 0.20,
    0.11, 0.04, 0.17, 0.13, 0.09, 0.06,
    0.18, 0.10, 0.14, 0.07, 0.22, 0.16,
    0.05, 0.20, 0.12, 0.08, 0.15, 0.06,
    0.19, 0.11, 0.07, 0.16, 0.09, 0.13,
  ];

  const tiles: { x: number; y: number; op: number }[] = [];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (tileW / 2);
    for (let c = 0; c < cols; c++) {
      const x = c * (tileW + gap) + offset - 5;
      const y = r * (tileH + gap);
      const op = opacityPattern[idx % opacityPattern.length];
      idx++;
      if (x < 110 && y < 130) tiles.push({ x, y, op });
    }
  }

  const parallelogram = (x: number, y: number) =>
    `M${x + SKEW},${y} L${x + tileW + SKEW},${y} L${x + tileW},${y + tileH} L${x},${y + tileH} Z`;

  return (
    <div
      className="cv-geo-pattern-fallback"
      style={{
        position: "absolute",
        pointerEvents: "none",
        overflow: "hidden",
        top: 0,
        left: 0,
        width: "35%",
        height: "100%",
        display: "none",
      }}
    >
      <svg viewBox="0 0 110 130" preserveAspectRatio="none" className="w-full h-full">
        {tiles.map((t, i) => (
          <path key={i} d={parallelogram(t.x, t.y)} fill="#7da3f0" opacity={t.op} />
        ))}
      </svg>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────

function CVStyles() {
  return (
    <style>{`
      /* Wrapper around all pages — gray background, scrollable, centered */
      .cv-preview-wrap {
        background: #2b2d31;
        border-radius: 12px;
        padding: 24px;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
        border: 1px solid rgba(255,255,255,0.06);
      }
      .cv-pages {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
      }

      /* One A4 page */
      .cv-page {
        width: 210mm;
        height: 297mm;
        position: relative;
        background: #ffffff;
        overflow: hidden;
        box-shadow: 0 6px 24px rgba(0,0,0,0.4);
        font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
        color: #1a2645;
        flex-shrink: 0;
      }
      .cv-content {
        position: relative;
        z-index: 1;
        padding: 15mm 15mm 15mm 15mm;
        height: 100%;
      }

      .cv-page-number {
        position: absolute;
        bottom: 6mm;
        right: 14mm;
        font-size: 8pt;
        color: #6b7a93;
        z-index: 2;
      }

      /* Header */
      .cv-header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 16px;
        align-items: start;
        margin-bottom: 12px;
      }
      .cv-header-left { padding-top: 4px; }
      .cv-tagline {
        font-size: 9.5pt;
        color: #1a2645;
        font-weight: 500;
        line-height: 1.4;
        margin-bottom: 8px;
        max-width: 90%;
        text-transform: uppercase;
        letter-spacing: 0.02em;
      }
      .cv-divider {
        width: 70%;
        height: 1.5px;
        background: #1a2645;
        margin-bottom: 12px;
      }
      .cv-name {
        font-size: 29pt;
        font-weight: 800;
        line-height: 1;
        color: #0a1a35;
        letter-spacing: -0.02em;
        margin: 0;
      }
      .cv-photo-img {
        width: 105px;
        height: 105px;
        border-radius: 50%;
        object-fit: cover;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        border: 4px solid white;
      }

      /* Bio */
      .cv-bio {
        font-size: 9.5pt;
        line-height: 1.55;
        color: #2a3a5a;
        margin: 14px 0 16px 0;
        max-width: 88%;
      }

      /* Contact row */
      .cv-contact-row {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        gap: 16px;
        margin-bottom: 16px;
      }
      .cv-contact-label {
        font-size: 8pt;
        font-weight: 700;
        color: #1a2645;
        letter-spacing: 0.05em;
        margin: 0 0 2px 0;
      }
      .cv-contact-value {
        font-size: 9pt;
        color: #2a3a5a;
        word-break: break-word;
        margin: 0;
      }

      /* Capabilities */
      .cv-capabilities {
        margin-bottom: 18px;
      }
      .cv-mini-heading {
        font-size: 8.5pt;
        font-weight: 700;
        color: #1a2645;
        letter-spacing: 0.05em;
        margin: 0 0 6px 0;
      }
      .cv-bullets { list-style: none; padding: 0; margin: 0; }
      .cv-bullets li {
        font-size: 9.5pt;
        color: #2a3a5a;
        padding-left: 14px;
        position: relative;
        margin-bottom: 4px;
        line-height: 1.5;
      }
      .cv-bullets li::before {
        content: '';
        position: absolute;
        left: 0;
        top: 7px;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background: #2a3a5a;
      }

      /* Sections */
      .cv-section-title {
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 13.5pt;
        font-weight: 700;
        color: #0a1a35;
        letter-spacing: 0.02em;
        margin: 16px 0 12px 0;
      }
      .cv-section-title-marker {
        width: 4px;
        height: 19px;
        background: #1a2645;
        flex-shrink: 0;
      }

      /* Job entries */
      .cv-job {
        margin-bottom: 13px;
        padding-left: 16px;
        border-left: 2px solid #e3e8f0;
        position: relative;
      }
      .cv-job-header {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        gap: 12px;
        margin-bottom: 2px;
      }
      .cv-job-title-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
      }
      .cv-job-marker {
        width: 5px;
        height: 5px;
        background: #1a2645;
        border-radius: 1px;
        flex-shrink: 0;
        margin-left: -20px;
      }
      .cv-job-title {
        font-size: 10.5pt;
        font-weight: 700;
        color: #0a1a35;
        margin: 0;
      }
      .cv-job-date {
        font-size: 8.5pt;
        color: #6b7a93;
        font-weight: 500;
        white-space: nowrap;
      }
      .cv-job-company {
        font-size: 8.5pt;
        font-weight: 600;
        color: #4a5a78;
        letter-spacing: 0.04em;
        margin: 2px 0 5px 0;
      }
      .cv-job-desc {
        font-size: 9pt;
        line-height: 1.5;
        color: #3a4a68;
        margin: 0;
      }
      .cv-job-tags {
        font-size: 8pt;
        color: #6b7a93;
        font-style: italic;
        margin: 4px 0 0 0;
      }

      /* Skills grid */
      .cv-skills-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 6px 16px;
      }
      .cv-skill-item {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 9pt;
      }
      .cv-skill-marker {
        width: 7px;
        height: 7px;
        background: #cfd6e6;
        flex-shrink: 0;
      }
      .cv-skill-marker.is-relevant { background: #1a2645; }
      .cv-skill-label { color: #4a5a78; }
      .cv-skill-label.is-relevant {
        font-weight: 700;
        color: #0a1a35;
      }

      /* Geo pattern background image */
      .cv-geo-pattern-img {
        position: absolute;
        pointer-events: none;
        z-index: 0;
        left: 0;
        top: 0;
        width: 35%;
        height: 100%;
        object-fit: contain;
        object-position: top left;
      }

      /* ───────── PRINT ───────── */
      @media print {
        @page {
          size: A4;
          margin: 0;
        }
        html, body {
          background: white !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body * { visibility: hidden; }
        #cv-print, #cv-print * { visibility: visible; }
        .cv-preview-wrap {
          background: white !important;
          padding: 0 !important;
          border: none !important;
          max-height: none !important;
          overflow: visible !important;
        }
        #cv-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 210mm;
        }
        .cv-pages {
          display: block;
          gap: 0;
        }
        .cv-page {
          width: 210mm;
          height: 297mm;
          page-break-after: always;
          page-break-inside: avoid;
          break-after: page;
          break-inside: avoid;
          box-shadow: none !important;
          margin: 0 !important;
          background: #ffffff !important;
        }
        .cv-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
        .cv-page-number { display: block !important; }

        /* Force colors in print */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `}</style>
  );
}
