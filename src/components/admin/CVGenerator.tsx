"use client";

import { useState, useRef } from "react";

type CVData = {
  keywords: string[];
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
  projects: Array<{ title: string; desc: string; tags: string[]; slug: string; score: number }>;
  relevantSkills: string[];
  allSkills: string[];
  jobTitle: string;
};

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function formatMonth(date: string | null, current: boolean) {
  if (current) return "PRÉSENT";
  if (!date) return "";
  const [y, m] = date.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
}

// Static profile data mirroring the original CV layout.
const PROFILE = {
  name: "SEBA GEDEON",
  surname: "MATSOULA MALONGA",
  email: "gedeon.matsoula@gmail.com",
  phone: "+242066900110",
  linkedin: "https://www.linkedin.com/in/slaega",
  bio: "Architecte logiciel et ingénieur full-stack avec une expérience couvrant des projets institutionnels, des missions de conseil et des solutions métiers à enjeux financiers. J'interviens sur l'analyse des besoins, la conception et l'intégration de systèmes numériques complexes, en privilégiant des solutions pragmatiques, sécurisées et adaptées aux réalités des organisations publiques et privées.",
  capabilities: [
    "Contribuer à des projets numériques à enjeux financiers et institutionnels",
    "Proposer et intégrer des solutions fiables adaptées aux contraintes métiers",
    "Sécuriser les accès et les données dans des systèmes sensibles",
    "Automatiser et améliorer des processus pour gagner en efficacité",
    "Travailler avec des équipes métiers et techniques dans des environnements réglementés",
  ],
};

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
  };

  const print = () => window.print();

  return (
    <div className="grid lg:grid-cols-[400px_1fr] gap-6">
      {/* ── Input panel (dark admin) ── */}
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
              PDF
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {cv && cv.keywords.length > 0 && (
          <div className="p-3 bg-zinc-900 border border-zinc-800/60 rounded-lg">
            <p className="text-xs text-zinc-500 font-medium mb-2 uppercase tracking-wide">
              Mots-clés détectés
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
      </div>

      {/* ── CV Preview (matches original CV template) ── */}
      <div className="overflow-auto">
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
              Colle une offre d&apos;emploi et clique sur &quot;Générer le CV&quot;.
            </p>
          </div>
        ) : (
          <div
            id="cv-print"
            ref={printRef}
            className="cv-paper bg-white text-[#1a2645] mx-auto shadow-2xl"
          >
            {/* Decorative geometric pattern (top-left) */}
            <GeoPattern position="top" />
            {/* Decorative geometric pattern (bottom-left) */}
            <GeoPattern position="bottom" />

            <div className="cv-content relative z-[1]">
              {/* ─── Header ─── */}
              <header className="cv-header">
                <div className="cv-header-left">
                  <p className="cv-tagline">
                    ARCHITECTE LOGICIEL &amp; INGÉNIEUR FULL-STACK ORIENTÉ SOLUTIONS MÉTIERS ET INSTITUTIONNELLES
                  </p>
                  <div className="cv-divider" />
                  <h1 className="cv-name">
                    {PROFILE.name}<br />{PROFILE.surname}
                  </h1>
                </div>
                <div className="cv-photo">
                  <div className="cv-photo-circle">
                    <span>SG</span>
                  </div>
                </div>
              </header>

              {/* ─── Bio ─── */}
              <p className="cv-bio">{PROFILE.bio}</p>

              {/* ─── Contact info row ─── */}
              <div className="cv-contact-row">
                <div>
                  <p className="cv-contact-label">E-MAIL</p>
                  <p className="cv-contact-value">{PROFILE.email}</p>
                </div>
                <div>
                  <p className="cv-contact-label">TÉLÉPHONE</p>
                  <p className="cv-contact-value">{PROFILE.phone}</p>
                </div>
                <div>
                  <p className="cv-contact-label">LINKEDIN</p>
                  <p className="cv-contact-value">{PROFILE.linkedin}</p>
                </div>
              </div>

              {/* ─── Capabilities ─── */}
              <div className="cv-capabilities">
                <p className="cv-mini-heading">CE QUE JE PEUX RÉALISER</p>
                <ul className="cv-bullets">
                  {PROFILE.capabilities.map((c) => (
                    <li key={c}>{c}</li>
                  ))}
                </ul>
              </div>

              {/* ─── Experience ─── */}
              {cv.experiences.length > 0 && (
                <section className="cv-section">
                  <SectionTitle>EXPÉRIENCE</SectionTitle>
                  <div className="cv-section-body">
                    {cv.experiences.map((exp) => (
                      <article key={exp.id} className="cv-job">
                        <div className="cv-job-header">
                          <div className="cv-job-title-wrap">
                            <span className="cv-job-marker" />
                            <h3 className="cv-job-title">{exp.role}</h3>
                          </div>
                          <span className="cv-job-date">
                            {formatMonth(exp.startDate, false)}
                            {" - "}
                            {formatMonth(exp.endDate, exp.current)}
                          </span>
                        </div>
                        <p className="cv-job-company">
                          {exp.company.toUpperCase()}
                          {exp.location && `, ${exp.location.toUpperCase()}`}
                        </p>
                        <p className="cv-job-desc">{exp.description}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* ─── Projects ─── */}
              {cv.projects.length > 0 && (
                <section className="cv-section">
                  <SectionTitle>PROJETS SÉLECTIONNÉS</SectionTitle>
                  <div className="cv-section-body">
                    {cv.projects.slice(0, 4).map((p) => (
                      <article key={p.slug} className="cv-job">
                        <div className="cv-job-header">
                          <div className="cv-job-title-wrap">
                            <span className="cv-job-marker" />
                            <h3 className="cv-job-title">{p.title}</h3>
                          </div>
                        </div>
                        <p className="cv-job-desc">{p.desc}</p>
                        {p.tags.length > 0 && (
                          <p className="cv-job-tags">
                            {p.tags.slice(0, 6).join(" · ")}
                          </p>
                        )}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* ─── Skills ─── */}
              <section className="cv-section">
                <SectionTitle>COMPÉTENCES</SectionTitle>
                <div className="cv-skills-grid">
                  {cv.allSkills.map((s) => (
                    <div key={s} className="cv-skill-item">
                      <span
                        className={`cv-skill-marker ${cv.relevantSkills.includes(s) ? "is-relevant" : ""}`}
                      />
                      <span
                        className={`cv-skill-label ${cv.relevantSkills.includes(s) ? "is-relevant" : ""}`}
                      >
                        {s}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── Print-only styles & full visual layout ── */}
            <style>{`
              .cv-paper {
                width: 210mm;
                min-height: 297mm;
                position: relative;
                font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
                color: #1a2645;
                overflow: hidden;
              }
              .cv-content {
                padding: 18mm 16mm 18mm 16mm;
              }

              /* Header */
              .cv-header {
                display: grid;
                grid-template-columns: 1fr auto;
                gap: 16px;
                align-items: start;
                margin-bottom: 14px;
              }
              .cv-header-left {
                padding-top: 4px;
              }
              .cv-tagline {
                font-size: 9.5pt;
                color: #1a2645;
                font-weight: 500;
                line-height: 1.4;
                margin-bottom: 8px;
                max-width: 90%;
              }
              .cv-divider {
                width: 70%;
                height: 1.5px;
                background: #1a2645;
                margin-bottom: 14px;
              }
              .cv-name {
                font-size: 32pt;
                font-weight: 800;
                line-height: 1;
                color: #0a1a35;
                letter-spacing: -0.02em;
              }
              .cv-photo-circle {
                width: 110px;
                height: 110px;
                border-radius: 50%;
                background: linear-gradient(135deg, #ed5e3c, #e85a3e);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 32pt;
                font-weight: 700;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
              }

              /* Bio */
              .cv-bio {
                font-size: 9.5pt;
                line-height: 1.55;
                color: #2a3a5a;
                margin: 16px 0 18px 0;
                max-width: 88%;
              }

              /* Contact row */
              .cv-contact-row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 16px;
                margin-bottom: 18px;
              }
              .cv-contact-label {
                font-size: 8pt;
                font-weight: 700;
                color: #1a2645;
                letter-spacing: 0.05em;
                margin-bottom: 2px;
              }
              .cv-contact-value {
                font-size: 9pt;
                color: #2a3a5a;
                word-break: break-word;
              }

              /* Capabilities */
              .cv-capabilities { margin-bottom: 22px; }
              .cv-mini-heading {
                font-size: 8.5pt;
                font-weight: 700;
                color: #1a2645;
                letter-spacing: 0.05em;
                margin-bottom: 6px;
              }
              .cv-bullets {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              .cv-bullets li {
                font-size: 9.5pt;
                color: #2a3a5a;
                padding-left: 14px;
                position: relative;
                margin-bottom: 3px;
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
              .cv-section { margin-top: 20px; }
              .cv-section-title {
                display: flex;
                align-items: center;
                gap: 10px;
                font-size: 14pt;
                font-weight: 700;
                color: #0a1a35;
                letter-spacing: 0.02em;
                margin-bottom: 14px;
              }
              .cv-section-title-marker {
                width: 5px;
                height: 22px;
                background: #ed5e3c;
                flex-shrink: 0;
              }
              .cv-section-body { padding-left: 0; }

              /* Job entries */
              .cv-job {
                margin-bottom: 16px;
                padding-left: 18px;
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
                width: 6px;
                height: 6px;
                background: #ed5e3c;
                border-radius: 1px;
                flex-shrink: 0;
                margin-left: -22px;
              }
              .cv-job-title {
                font-size: 11pt;
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
                margin: 2px 0 6px 0;
              }
              .cv-job-desc {
                font-size: 9pt;
                line-height: 1.55;
                color: #3a4a68;
                margin: 0;
              }
              .cv-job-tags {
                font-size: 8pt;
                color: #6b7a93;
                font-style: italic;
                margin-top: 4px;
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
                width: 8px;
                height: 8px;
                background: #1a2645;
                flex-shrink: 0;
              }
              .cv-skill-marker.is-relevant {
                background: #ed5e3c;
              }
              .cv-skill-label {
                color: #2a3a5a;
              }
              .cv-skill-label.is-relevant {
                font-weight: 700;
                color: #0a1a35;
              }

              /* Print */
              @media print {
                @page {
                  size: A4;
                  margin: 0;
                }
                body * { visibility: hidden; }
                #cv-print, #cv-print * { visibility: visible; }
                #cv-print {
                  position: absolute;
                  left: 0;
                  top: 0;
                  width: 210mm;
                  height: 297mm;
                  box-shadow: none !important;
                  margin: 0 !important;
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Section title with orange marker ──
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cv-section-title">
      <span className="cv-section-title-marker" />
      {children}
    </h2>
  );
}

// ── Decorative geometric tile pattern (parallelograms, like the CV template) ──
function GeoPattern({ position }: { position: "top" | "bottom" }) {
  // Deterministic but rich tile arrangement of skewed parallelograms.
  // Each tile is a parallelogram polygon, with 8-10° skew, varying opacity.
  const SKEW = 8; // horizontal skew offset for the top edge

  // Generate grid: cols × rows of tiles with offset and random-ish opacity
  const cols = 5;
  const rows = 7;
  const tileW = 22; // svg units (viewBox 100 wide)
  const tileH = 16;
  const gap = 1.5;

  const tiles: { x: number; y: number; w: number; h: number; op: number }[] = [];
  // pseudo-random opacities pattern (deterministic)
  const opacityPattern = [0.22, 0.08, 0.16, 0.06, 0.20, 0.11, 0.25, 0.09, 0.14, 0.05, 0.18, 0.13, 0.07, 0.21, 0.10, 0.17, 0.06, 0.23, 0.12, 0.08, 0.19, 0.15, 0.07, 0.20, 0.11, 0.04, 0.17, 0.13, 0.09, 0.06, 0.18, 0.10, 0.14, 0.07, 0.22];
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (tileW / 2); // brick offset every other row
    for (let c = 0; c < cols; c++) {
      const x = c * (tileW + gap) + offset;
      const y = r * (tileH + gap);
      const op = opacityPattern[idx % opacityPattern.length];
      idx++;
      // Add only if within viewBox-ish bounds
      if (x < 100 && y < 110) {
        tiles.push({ x, y, w: tileW, h: tileH, op });
      }
    }
  }

  const style: React.CSSProperties =
    position === "top"
      ? { top: 0, left: 0, width: "50%", height: "38%" }
      : { bottom: 0, left: 0, width: "38%", height: "32%", transform: "scaleY(-1)" };

  // Parallelogram path: top-left → top-right → bottom-right (shifted left by SKEW) → bottom-left (shifted left by SKEW)
  const parallelogram = (x: number, y: number, w: number, h: number) =>
    `M${x + SKEW},${y} L${x + w + SKEW},${y} L${x + w},${y + h} L${x},${y + h} Z`;

  return (
    <div
      className="cv-geo-pattern"
      style={{ position: "absolute", ...style, pointerEvents: "none", overflow: "hidden" }}
    >
      <svg viewBox="0 0 100 110" preserveAspectRatio="none" className="w-full h-full">
        {tiles.map((t, i) => (
          <path
            key={i}
            d={parallelogram(t.x, t.y, t.w, t.h)}
            fill="#7da3f0"
            opacity={t.op}
          />
        ))}
      </svg>
    </div>
  );
}
