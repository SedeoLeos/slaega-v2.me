"use client";

import { useMemo, useRef, useState } from "react";

// ─────────────────────────────────────────────────────────────────────
// Types & defaults
// ─────────────────────────────────────────────────────────────────────

type Letter = {
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

type ApiResponse = {
  letter: Letter;
  aiProvider?: string;
  warning?: string;
};

const PROFILE = {
  name: "SEBA GEDEON",
  surname: "MATSOULA MALONGA",
  email: "gedeon.matsoula@gmail.com",
  phone: "+242066900110",
  linkedin: "https://www.linkedin.com/in/slaega",
  city: "Brazzaville",
  country: "Congo",
  photo: "/images/me.jpg",
};

const EMPTY_FR: Letter = {
  language: "fr",
  company: "",
  role: "",
  subject: "Objet : Candidature au poste de …",
  greeting: "Madame, Monsieur,",
  intro: "",
  body: "",
  closing: "",
  signoff:
    "Dans l'attente de votre retour, je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.",
};

const EMPTY_EN: Letter = {
  language: "en",
  company: "",
  role: "",
  subject: "Subject: Application for …",
  greeting: "Dear Hiring Manager,",
  intro: "",
  body: "",
  closing: "",
  signoff: "Sincerely,",
};

// ─────────────────────────────────────────────────────────────────────
// Pagination — same approach as CVGenerator
// ─────────────────────────────────────────────────────────────────────

// Usable height per A4 sheet (297 − 13 top − 14 bottom = 270mm).
const PAGE_CAPACITY = 268; // mm

type Block =
  | { kind: "header" }
  | { kind: "meta" }
  | { kind: "subject"; text: string }
  | { kind: "greeting"; text: string }
  | { kind: "paragraph"; text: string }
  | { kind: "signoff"; text: string }
  | { kind: "signature" };

function paragraphHeight(text: string): number {
  // ~85 chars per line × 4.6mm per line + 3mm bottom margin.
  const lines = Math.max(1, Math.ceil(text.length / 85));
  return lines * 4.6 + 3;
}

function blockHeight(b: Block): number {
  switch (b.kind) {
    case "header":     return 50;
    case "meta":       return 22;
    case "subject":    return 11;
    case "greeting":   return 9;
    case "paragraph":  return paragraphHeight(b.text);
    case "signoff":    return paragraphHeight(b.text);
    case "signature":  return 22;
  }
}

function buildBlocks(letter: Letter): Block[] {
  const blocks: Block[] = [
    { kind: "header" },
    { kind: "meta" },
    { kind: "subject", text: letter.subject || "" },
    { kind: "greeting", text: letter.greeting || "" },
  ];
  // Split body on blank-line boundaries so paragraphs paginate cleanly.
  const paragraphs = [letter.intro, letter.body, letter.closing]
    .flatMap((p) => (p ?? "").split(/\n{2,}/).map((s) => s.trim()).filter(Boolean));
  for (const p of paragraphs) {
    blocks.push({ kind: "paragraph", text: p });
  }
  blocks.push({ kind: "signoff", text: letter.signoff || "" });
  blocks.push({ kind: "signature" });
  return blocks;
}

function paginate(blocks: Block[]): Block[][] {
  const pages: Block[][] = [];
  let current: Block[] = [];
  let used = 0;
  for (const b of blocks) {
    const h = blockHeight(b);
    if (used + h > PAGE_CAPACITY && current.length > 0) {
      pages.push(current);
      current = [];
      used = 0;
    }
    current.push(b);
    used += h;
  }
  if (current.length > 0) pages.push(current);
  return pages.length > 0 ? pages : [[]];
}

// ─────────────────────────────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────────────────────────────

export default function CoverLetterGenerator() {
  const [jobOffer, setJobOffer] = useState("");
  const [letter, setLetter] = useState<Letter>(EMPTY_FR);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState("");
  const [aiProvider, setAiProvider] = useState<string | null>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const generate = async () => {
    if (jobOffer.trim().length < 30) {
      setError("L'offre est trop courte (min 30 caractères)");
      return;
    }
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobOffer }),
      });
      const data = (await res.json()) as ApiResponse & { message?: string };
      if (!res.ok) {
        setError(data.message ?? "Erreur");
        setStatus("error");
        return;
      }
      setLetter({ ...EMPTY_FR, ...data.letter });
      setAiProvider(data.aiProvider ?? null);
      setStatus("idle");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur réseau");
      setStatus("error");
    }
  };

  const reset = (lang: "fr" | "en") => {
    setLetter(lang === "en" ? EMPTY_EN : EMPTY_FR);
    setAiProvider(null);
  };

  const print = () => window.print();

  // Build pages from current letter state — recomputed on every keystroke.
  const pages = useMemo(() => paginate(buildBlocks(letter)), [letter]);

  const update = <K extends keyof Letter>(key: K, value: Letter[K]) => {
    setLetter((prev) => ({ ...prev, [key]: value }));
  };

  const today = new Date().toLocaleDateString(letter.language === "en" ? "en-US" : "fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="grid lg:grid-cols-[440px_1fr] gap-6">
      {/* ── Editor panel ── */}
      <div className="space-y-4">
        {/* Job offer */}
        <details open className="group bg-zinc-900 border border-zinc-800/60 rounded-xl">
          <summary className="cursor-pointer list-none px-4 py-3 flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wide">
              1. Offre d&apos;emploi (optionnel)
            </span>
            <svg
              className="w-3.5 h-3.5 text-zinc-500 group-open:rotate-180 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-4 pb-4 space-y-3">
            <textarea
              value={jobOffer}
              onChange={(e) => setJobOffer(e.target.value)}
              placeholder="Colle ici l'offre d'emploi pour générer un brouillon adapté…"
              rows={9}
              className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app focus:ring-2 focus:ring-green-app/20 transition-all resize-y font-mono leading-relaxed"
            />
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={generate}
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-4 py-2 rounded-full text-xs shadow-sm shadow-green-app/30 disabled:opacity-50 transition-colors"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {status === "loading" ? "Génération…" : "Générer avec l'IA"}
              </button>
              <button
                type="button"
                onClick={() => reset("fr")}
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 px-3 py-2 rounded-full text-xs font-medium transition-colors"
              >
                Vider (FR)
              </button>
              <button
                type="button"
                onClick={() => reset("en")}
                className="inline-flex items-center gap-2 border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 px-3 py-2 rounded-full text-xs font-medium transition-colors"
              >
                Empty (EN)
              </button>
            </div>
            {error && (
              <p className="text-xs text-red-400">{error}</p>
            )}
            {aiProvider && (
              <p className="text-xs text-zinc-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-app inline-block mr-1.5 align-middle" />
                IA : <span className="text-zinc-300 font-medium">{aiProvider}</span>
              </p>
            )}
          </div>
        </details>

        {/* Editable content */}
        <div className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-zinc-300 uppercase tracking-wide mb-1">
            2. Contenu de la lettre
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Entreprise">
              <input
                value={letter.company}
                onChange={(e) => update("company", e.target.value)}
                placeholder="Nom de l'entreprise"
                className="cl-input"
              />
            </Field>
            <Field label="Poste">
              <input
                value={letter.role}
                onChange={(e) => update("role", e.target.value)}
                placeholder="Poste visé"
                className="cl-input"
              />
            </Field>
          </div>

          <Field label="Objet / Subject">
            <input
              value={letter.subject}
              onChange={(e) => update("subject", e.target.value)}
              className="cl-input"
            />
          </Field>

          <Field label="Salutation">
            <input
              value={letter.greeting}
              onChange={(e) => update("greeting", e.target.value)}
              className="cl-input"
            />
          </Field>

          <Field label="Introduction">
            <textarea
              value={letter.intro}
              onChange={(e) => update("intro", e.target.value)}
              rows={3}
              className="cl-input cl-textarea"
            />
          </Field>

          <Field label="Corps (sépare les paragraphes par une ligne vide)">
            <textarea
              value={letter.body}
              onChange={(e) => update("body", e.target.value)}
              rows={8}
              className="cl-input cl-textarea"
            />
          </Field>

          <Field label="Conclusion">
            <textarea
              value={letter.closing}
              onChange={(e) => update("closing", e.target.value)}
              rows={2}
              className="cl-input cl-textarea"
            />
          </Field>

          <Field label="Formule de politesse">
            <textarea
              value={letter.signoff}
              onChange={(e) => update("signoff", e.target.value)}
              rows={2}
              className="cl-input cl-textarea"
            />
          </Field>

          <div className="flex items-center justify-between gap-2 pt-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => update("language", "fr")}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  letter.language === "fr"
                    ? "bg-green-app text-white"
                    : "border border-zinc-700 text-zinc-400 hover:text-white"
                }`}
              >
                Français
              </button>
              <button
                type="button"
                onClick={() => update("language", "en")}
                className={`text-xs px-2.5 py-1 rounded-full transition-colors ${
                  letter.language === "en"
                    ? "bg-green-app text-white"
                    : "border border-zinc-700 text-zinc-400 hover:text-white"
                }`}
              >
                English
              </button>
            </div>

            <button
              type="button"
              onClick={print}
              className="inline-flex items-center gap-1.5 bg-foreground text-background hover:opacity-90 px-4 py-2 rounded-full text-xs font-semibold transition-opacity"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              PDF ({pages.length} {pages.length > 1 ? "pages" : "page"})
            </button>
          </div>
        </div>
      </div>

      {/* ── Preview panel ── */}
      <div className="cl-preview-wrap">
        <div id="cl-print" ref={printRef} className="cl-pages">
          {pages.map((blocks, pageIndex) => (
            <LetterPage
              key={pageIndex}
              blocks={blocks}
              pageNumber={pageIndex + 1}
              totalPages={pages.length}
              today={today}
              letter={letter}
            />
          ))}
          <Styles />
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// One A4 page
// ─────────────────────────────────────────────────────────────────────

function LetterPage({
  blocks,
  pageNumber,
  totalPages,
  today,
  letter,
}: {
  blocks: Block[];
  pageNumber: number;
  totalPages: number;
  today: string;
  letter: Letter;
}) {
  return (
    <div className="cl-page">
      <GeoPattern />

      <div className="cl-content">
        {blocks.map((b, i) => {
          switch (b.kind) {
            case "header":
              return <HeaderBlock key={i} />;
            case "meta":
              return <MetaBlock key={i} today={today} letter={letter} />;
            case "subject":
              return (
                <p key={i} className="cl-subject">
                  {b.text}
                </p>
              );
            case "greeting":
              return (
                <p key={i} className="cl-greeting">
                  {b.text}
                </p>
              );
            case "paragraph":
              return (
                <p key={i} className="cl-paragraph">
                  {b.text}
                </p>
              );
            case "signoff":
              return (
                <p key={i} className="cl-signoff">
                  {b.text}
                </p>
              );
            case "signature":
              return <SignatureBlock key={i} />;
          }
        })}
      </div>

      {totalPages > 1 && (
        <div className="cl-page-number">
          {letter.language === "en" ? "Page" : "Page"} {pageNumber} / {totalPages}
        </div>
      )}
    </div>
  );
}

function HeaderBlock() {
  return (
    <header className="cl-header">
      <div className="cl-header-left">
        <h1 className="cl-name">
          {PROFILE.name}
          <br />
          {PROFILE.surname}
        </h1>
        <p className="cl-tagline">
          {PROFILE.email} · {PROFILE.phone}
          <br />
          {PROFILE.linkedin}
        </p>
        <div className="cl-divider" />
      </div>
      <div className="cl-photo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PROFILE.photo} alt="" className="cl-photo-img" />
      </div>
    </header>
  );
}

function MetaBlock({ today, letter }: { today: string; letter: Letter }) {
  return (
    <div className="cl-meta">
      <div className="cl-sender">
        <p>
          {PROFILE.city}, {PROFILE.country}
        </p>
        <p>{today}</p>
      </div>
      {(letter.company || letter.role) && (
        <div className="cl-recipient">
          {letter.company && <p className="cl-recipient-name">{letter.company}</p>}
          {letter.role && (
            <p className="cl-recipient-line">
              {letter.language === "en" ? "Re: " : "À l'attention de l'équipe RH"}
              {letter.language === "en" && letter.role}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function SignatureBlock() {
  return (
    <div className="cl-signature">
      <p className="cl-signature-name">Seba Gedeon Matsoula Malonga</p>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Background pattern (same as CV)
// ─────────────────────────────────────────────────────────────────────

function GeoPattern() {
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/cv-bg.png"
        alt=""
        aria-hidden="true"
        className="cl-geo-pattern-img"
      />
    </>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="block text-[11px] font-medium text-zinc-500 mb-1 uppercase tracking-wide">
        {label}
      </span>
      {children}
    </label>
  );
}

// ─────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────

function Styles() {
  return (
    <style>{`
      .cl-input {
        width: 100%;
        background: #09090b;
        border: 1px solid #3f3f46;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;
        font-size: 0.825rem;
        color: #e4e4e7;
        outline: none;
        transition: border-color 0.15s, box-shadow 0.15s;
        font-family: inherit;
      }
      .cl-input::placeholder { color: #52525b; }
      .cl-input:focus {
        border-color: #05796B;
        box-shadow: 0 0 0 3px rgba(5, 121, 107, 0.1);
      }
      .cl-textarea { resize: vertical; line-height: 1.5; }

      .cl-preview-wrap {
        background: #2b2d31;
        border-radius: 12px;
        padding: 24px;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
        border: 1px solid rgba(255,255,255,0.06);
      }
      .cl-pages {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 28px;
      }

      .cl-page {
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
      .cl-content {
        position: relative;
        z-index: 1;
        padding: 13mm 14mm 14mm 14mm;
        height: 100%;
      }
      .cl-page-number {
        position: absolute;
        bottom: 6mm;
        right: 14mm;
        font-size: 8pt;
        color: #6b7a93;
        z-index: 2;
      }

      .cl-geo-pattern-img {
        position: absolute;
        pointer-events: none;
        z-index: 0;
        left: 0;
        top: 0;
        width: 35%;
        height: 100%;
        object-fit: contain;
        object-position: top left;
        opacity: 0.95;
      }

      /* Header */
      .cl-header {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 14px;
        align-items: start;
        margin-bottom: 10px;
      }
      .cl-name {
        font-size: 22pt;
        font-weight: 800;
        line-height: 1;
        color: #0a1a35;
        letter-spacing: -0.02em;
        margin: 0 0 6px 0;
      }
      .cl-tagline {
        font-size: 9pt;
        color: #4a5a78;
        margin: 0 0 10px 0;
        line-height: 1.4;
      }
      .cl-divider {
        width: 70%;
        height: 1.5px;
        background: #1a2645;
      }
      .cl-photo-img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        object-fit: cover;
        border: 4px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      }

      /* Meta (date + recipient) */
      .cl-meta {
        display: flex;
        justify-content: space-between;
        gap: 24px;
        margin: 14px 0 12px 0;
        font-size: 9.5pt;
        color: #2a3a5a;
      }
      .cl-sender p,
      .cl-recipient p {
        margin: 0;
        line-height: 1.45;
      }
      .cl-recipient {
        text-align: right;
      }
      .cl-recipient-name {
        font-weight: 700;
        color: #0a1a35;
      }

      /* Body */
      .cl-subject {
        font-weight: 700;
        font-size: 10.5pt;
        color: #0a1a35;
        margin: 12px 0 10px 0;
      }
      .cl-greeting {
        font-size: 10pt;
        color: #1a2645;
        margin: 0 0 8px 0;
      }
      .cl-paragraph {
        font-size: 10pt;
        line-height: 1.55;
        color: #2a3a5a;
        margin: 0 0 10px 0;
        text-align: justify;
        text-justify: inter-word;
      }
      .cl-signoff {
        font-size: 10pt;
        line-height: 1.55;
        color: #2a3a5a;
        margin: 14px 0 18px 0;
      }
      .cl-signature {
        margin-top: 12px;
      }
      .cl-signature-name {
        font-weight: 700;
        color: #0a1a35;
        font-size: 10.5pt;
        margin: 0;
      }

      /* ───────── PRINT ───────── */
      @media print {
        @page { size: A4; margin: 0; }
        html, body {
          background: white !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        body * { visibility: hidden; }
        #cl-print, #cl-print * { visibility: visible; }
        .cl-preview-wrap {
          background: white !important;
          padding: 0 !important;
          border: none !important;
          max-height: none !important;
          overflow: visible !important;
        }
        #cl-print {
          position: absolute;
          left: 0;
          top: 0;
          width: 210mm;
        }
        .cl-pages {
          display: block;
          gap: 0;
        }
        .cl-page {
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
        .cl-page:last-child {
          page-break-after: auto;
          break-after: auto;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
      }
    `}</style>
  );
}
