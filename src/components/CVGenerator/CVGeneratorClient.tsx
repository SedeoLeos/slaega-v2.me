'use client';

import { useRef, useState } from 'react';

type CVData = {
  keywords: string[];
  tagline?: string;
  summary?: string;
  language?: 'fr' | 'en';
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
};

const MONTHS_FR = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
const MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PROFILE = {
  name: 'SEBA GEDEON',
  surname: 'MATSOULA MALONGA',
  email: 'gedeon.matsoula@gmail.com',
  phone: '+242066900110',
  linkedin: 'https://www.linkedin.com/in/slaega',
  photo: '/images/me.jpg',
};

const LABELS = {
  fr: {
    email: 'EMAIL',
    phone: 'PHONE',
    linkedin: 'LINKEDIN',
    canDo: 'WHAT I CAN DELIVER',
    experience: 'EXPERIENCE',
    projects: 'SELECTED PROJECTS',
    skills: 'KEY SKILLS',
    present: 'PRÉSENT',
  },
  en: {
    email: 'EMAIL',
    phone: 'PHONE',
    linkedin: 'LINKEDIN',
    canDo: 'WHAT I CAN DELIVER',
    experience: 'EXPERIENCE',
    projects: 'SELECTED PROJECTS',
    skills: 'KEY SKILLS',
    present: 'PRESENT',
  },
};

function formatMonth(date: string | null, current: boolean, lang: 'fr' | 'en') {
  if (current) return LABELS[lang].present;
  if (!date) return '';
  const [y, m] = date.split('-');
  const months = lang === 'en' ? MONTHS_EN : MONTHS_FR;
  return `${months[parseInt(m) - 1]} ${y}`;
}

function stripHtml(s: string): string {
  return (s ?? '')
    .replace(/<\/?(p|br|div|h[1-6]|li|ul|ol|strong|em|a|u|span|table|tr|td|th|img|hr)[^>]*>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="cv-section-title">
      <span className="cv-section-title-marker" />
      {children}
    </h2>
  );
}

function BackgroundPattern() {
  return (
    <div className="cv-bg-pattern">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/cv-bg.png" alt="" aria-hidden="true" className="cv-bg-image" />
    </div>
  );
}

export default function CVGeneratorClient() {
  const [jobOffer, setJobOffer] = useState('');
  const [cv, setCv] = useState<CVData | null>(null);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const printRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (jobOffer.trim().length < 50) {
      setError("L'offre est trop courte (min 50 caractères)");
      return;
    }
    setStatus('loading');
    setError('');
    const res = await fetch('/api/cv-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobOffer }),
    });
    const data = await res.json();
    if (res.ok) {
      setCv(data.cv);
      setStatus('idle');
    } else {
      setError(data.message ?? 'Erreur');
      setStatus('error');
    }
  };

  const print = () => window.print();

  const lang: 'fr' | 'en' = cv?.language ?? 'fr';
  const L = LABELS[lang];

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Input panel */}
      <div>
        <label className="block text-sm font-semibold mb-2">Offre d&apos;emploi</label>
        <textarea
          value={jobOffer}
          onChange={(e) => setJobOffer(e.target.value)}
          placeholder="Colle ici l'offre d'emploi complète..."
          rows={16}
          className="w-full bg-background border border-foreground/15 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-foreground/30 focus:outline-none focus:border-green-app transition-colors resize-y font-mono"
        />
        <div className="flex items-center gap-3 mt-3">
          <button
            onClick={generate}
            disabled={status === 'loading'}
            className="bg-green-app text-white font-semibold px-5 py-2.5 rounded-lg text-sm hover:opacity-80 disabled:opacity-40 transition-opacity"
          >
            {status === 'loading' ? 'Génération...' : 'Générer le CV'}
          </button>
          {cv && (
            <button
              onClick={print}
              className="border border-foreground/20 text-foreground/70 font-medium px-5 py-2.5 rounded-lg text-sm hover:border-foreground/50 transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
                />
              </svg>
              PDF
            </button>
          )}
        </div>
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
        {cv && (
          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-foreground/50">Langue:</span>
              <span className="text-foreground font-medium">{lang === 'fr' ? 'Français' : 'English'}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs text-foreground/50">Mots-clés détectés ({cv.keywords.length}):</span>
              {cv.keywords.map((k) => (
                <span
                  key={k}
                  className="text-xs bg-green-app/10 text-green-app border border-green-app/20 px-2 py-0.5 rounded-full"
                >
                  {k}
                </span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-foreground/5 rounded-lg">
                <p className="text-foreground/50">Expériences</p>
                <p className="text-foreground font-bold text-base">{cv.experiences.length}</p>
              </div>
              <div className="p-2 bg-foreground/5 rounded-lg">
                <p className="text-foreground/50">Projets</p>
                <p className="text-foreground font-bold text-base">{cv.projects.length}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* CV Preview */}
      <div className="overflow-auto">
        {!cv ? (
          <div className="h-full min-h-[600px] border border-dashed border-foreground/15 rounded-xl flex items-center justify-center">
            <p className="text-foreground/30 text-sm">Le CV généré apparaîtra ici</p>
          </div>
        ) : (
          <div id="cv-print" ref={printRef} className="cv-paper">
            <BackgroundPattern />

            <div className="cv-content">
              {/* Header */}
              <header className="cv-header">
                <div className="cv-header-left">
                  <p className="cv-tagline">{cv.tagline}</p>
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

              {/* Bio */}
              <p className="cv-bio">{stripHtml(cv.summary || '')}</p>

              {/* Contact */}
              <div className="cv-contact-row">
                <div>
                  <p className="cv-contact-label">{L.email}</p>
                  <p className="cv-contact-value">{PROFILE.email}</p>
                </div>
                <div>
                  <p className="cv-contact-label">{L.phone}</p>
                  <p className="cv-contact-value">{PROFILE.phone}</p>
                </div>
                <div>
                  <p className="cv-contact-label">{L.linkedin}</p>
                  <p className="cv-contact-value">{PROFILE.linkedin}</p>
                </div>
              </div>

              {/* Capabilities */}
              {cv.capabilities && cv.capabilities.length > 0 && (
                <div className="cv-capabilities">
                  <p className="cv-mini-heading">{L.canDo}</p>
                  <ul className="cv-bullets">
                    {cv.capabilities.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Experience */}
              {cv.experiences.length > 0 && (
                <section className="cv-section">
                  <SectionTitle>{L.experience}</SectionTitle>
                  <div className="cv-section-body">
                    {cv.experiences.map((exp) => (
                      <article key={exp.id} className="cv-job">
                        <div className="cv-job-header">
                          <div className="cv-job-title-wrap">
                            <span className="cv-job-marker" />
                            <h3 className="cv-job-title">{exp.role}</h3>
                          </div>
                          <span className="cv-job-date">
                            {formatMonth(exp.startDate, false, lang)} -{' '}
                            {formatMonth(exp.endDate, exp.current, lang)}
                          </span>
                        </div>
                        <p className="cv-job-company">
                          {exp.company.toUpperCase()}
                          {exp.location && `, ${exp.location.toUpperCase()}`}
                        </p>
                        <p className="cv-job-desc">{stripHtml(exp.description)}</p>
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {cv.projects.length > 0 && (
                <section className="cv-section">
                  <SectionTitle>{L.projects}</SectionTitle>
                  <div className="cv-section-body">
                    {cv.projects.slice(0, 5).map((p) => (
                      <article key={p.slug} className="cv-job">
                        <div className="cv-job-header">
                          <div className="cv-job-title-wrap">
                            <span className="cv-job-marker" />
                            <h3 className="cv-job-title">{p.title}</h3>
                          </div>
                        </div>
                        <p className="cv-job-desc">{stripHtml(p.desc)}</p>
                        {p.tags.length > 0 && <p className="cv-job-tags">{p.tags.slice(0, 6).join(' · ')}</p>}
                      </article>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {cv.allSkills.length > 0 && (
                <section className="cv-section">
                  <SectionTitle>{L.skills}</SectionTitle>
                  <div className="cv-skills-grid">
                    {cv.allSkills.map((s) => {
                      const relevant = cv.relevantSkills.includes(s);
                      return (
                        <div key={s} className="cv-skill-item">
                          <span className={`cv-skill-marker ${relevant ? 'is-relevant' : ''}`} />
                          <span className={`cv-skill-label ${relevant ? 'is-relevant' : ''}`}>{s}</span>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}
            </div>

            <style>{`
              .cv-paper {
                width: 210mm;
                min-height: 297mm;
                max-height: 297mm;
                position: relative;
                font-family: 'Inter', 'Helvetica Neue', Arial, sans-serif;
                color: #1a2645;
                background: #ffffff;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0,0,0,0.15);
              }
              /* Multiple pages container - adds gap between pages in preview */
              #cv-print {
                display: flex;
                flex-direction: column;
                gap: 20px;
                background: #f0f0f0;
                padding: 20px;
              }

              /* Background pattern - positioned on the LEFT side with contain */
              .cv-bg-pattern {
                position: absolute;
                top: 0;
                left: 0;
                width: 35%;
                height: 100%;
                overflow: hidden;
                z-index: 0;
                pointer-events: none;
              }
              .cv-bg-image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: contain;
                object-position: top left;
                opacity: 0.95;
              }

              .cv-content {
                padding: 16mm 18mm 16mm 16mm; /* Left padding for background image */
                position: relative;
                z-index: 1;
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
                font-size: 9pt;
                color: #1a2645;
                font-weight: 500;
                line-height: 1.4;
                margin-bottom: 8px;
                max-width: 75%;
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
                font-size: 28pt;
                font-weight: 800;
                line-height: 1.05;
                color: #0a1a35;
                letter-spacing: -0.02em;
                margin: 0;
              }
              .cv-photo-img {
                width: 100px;
                height: 100px;
                border-radius: 50%;
                object-fit: cover;
                box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                border: 3px solid white;
              }

              /* Bio */
              .cv-bio {
                font-size: 9.5pt;
                line-height: 1.5;
                color: #2a3a5a;
                margin: 12px 0 14px 0;
                max-width: 70%;
              }

              /* Contact row */
              .cv-contact-row {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr;
                gap: 12px;
                margin-bottom: 16px;
              }
              .cv-contact-label {
                font-size: 7.5pt;
                font-weight: 700;
                color: #1a2645;
                letter-spacing: 0.05em;
                margin: 0 0 2px 0;
              }
              .cv-contact-value {
                font-size: 8.5pt;
                color: #2a3a5a;
                word-break: break-word;
                margin: 0;
              }

              /* Capabilities */
              .cv-capabilities {
                margin-bottom: 18px;
              }
              .cv-mini-heading {
                font-size: 8pt;
                font-weight: 700;
                color: #1a2645;
                letter-spacing: 0.05em;
                margin: 0 0 6px 0;
              }
              .cv-bullets {
                list-style: none;
                padding: 0;
                margin: 0;
              }
              .cv-bullets li {
                font-size: 9pt;
                color: #2a3a5a;
                padding-left: 12px;
                position: relative;
                margin-bottom: 3px;
                line-height: 1.45;
              }
              .cv-bullets li::before {
                content: '';
                position: absolute;
                left: 0;
                top: 6px;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background: #2a3a5a;
              }

              /* Sections */
              .cv-section {
                margin-top: 16px;
              }
              .cv-section-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-size: 12pt;
                font-weight: 700;
                color: #0a1a35;
                letter-spacing: 0.02em;
                margin: 0 0 10px 0;
              }
              .cv-section-title-marker {
                width: 4px;
                height: 18px;
                background: #ed5e3c;
                flex-shrink: 0;
              }

              /* Job entries */
              .cv-job {
                margin-bottom: 12px;
                padding-left: 14px;
                border-left: 2px solid #e3e8f0;
                position: relative;
              }
              .cv-job-header {
                display: flex;
                justify-content: space-between;
                align-items: baseline;
                gap: 10px;
                margin-bottom: 2px;
              }
              .cv-job-title-wrap {
                display: flex;
                align-items: center;
                gap: 6px;
              }
              .cv-job-marker {
                width: 5px;
                height: 5px;
                background: #ed5e3c;
                border-radius: 1px;
                flex-shrink: 0;
                margin-left: -18px;
              }
              .cv-job-title {
                font-size: 10pt;
                font-weight: 700;
                color: #0a1a35;
                margin: 0;
              }
              .cv-job-date {
                font-size: 8pt;
                color: #6b7a93;
                font-weight: 500;
                white-space: nowrap;
              }
              .cv-job-company {
                font-size: 8pt;
                font-weight: 600;
                color: #4a5a78;
                letter-spacing: 0.04em;
                margin: 2px 0 4px 0;
              }
              .cv-job-desc {
                font-size: 8.5pt;
                line-height: 1.5;
                color: #3a4a68;
                margin: 0;
              }
              .cv-job-tags {
                font-size: 7.5pt;
                color: #6b7a93;
                font-style: italic;
                margin: 3px 0 0 0;
              }

              /* Skills grid */
              .cv-skills-grid {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 5px 12px;
              }
              .cv-skill-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 8pt;
              }
              .cv-skill-marker {
                width: 6px;
                height: 6px;
                background: #1a2645;
                flex-shrink: 0;
              }
              .cv-skill-marker.is-relevant {
                background: #ed5e3c;
              }
              .cv-skill-label { color: #2a3a5a; }
              .cv-skill-label.is-relevant {
                font-weight: 700;
                color: #0a1a35;
              }

              /* Print styles - multi-page with background on each page */
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
                  display: block;
                  gap: 0;
                  background: white !important;
                  padding: 0 !important;
                  margin: 0 !important;
                }
                .cv-paper {
                  width: 210mm;
                  height: 297mm;
                  max-height: 297mm;
                  page-break-after: always;
                  position: relative;
                  overflow: hidden;
                  box-shadow: none !important;
                  background: #ffffff !important;
                }
                .cv-paper:last-child {
                  page-break-after: auto;
                }
                /* Background on each page */
                .cv-bg-pattern {
                  position: absolute;
                  top: 0;
                  left: 0;
                  width: 35%;
                  height: 100%;
                }
                .cv-content {
                  position: relative;
                  z-index: 1;
                  padding-left: 16mm;
                  height: 100%;
                  overflow: hidden;
                }
                * {
                  -webkit-print-color-adjust: exact !important;
                  print-color-adjust: exact !important;
                  color-adjust: exact !important;
                }
              }
            `}</style>
          </div>
        )}
      </div>
    </div>
  );
}
