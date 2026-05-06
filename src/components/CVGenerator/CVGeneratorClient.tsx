'use client';

import { useState, useMemo, useCallback } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import type { CVData, CVSections, CVTemplateId } from './cv-types';
// (no useTranslations — this component renders in admin without NextIntlClientProvider)
import { defaultSections, CV_TEMPLATES } from './cv-types';
import { CV_PALETTES, DEFAULT_PALETTE } from './cv-palettes';
import type { CVPalette } from './cv-palettes';
import CVDocumentRenderer from './CVDocumentRenderer';

// ── i18n-free label map (component used in admin without NextIntlClientProvider)
const L = {
  jobOfferLabel:    'Offre d\'emploi',
  jobOfferPh:       'Colle le texte complet de l\'offre d\'emploi…',
  tooShort:         'L\'offre est trop courte (min 50 caractères)',
  generic:          'Une erreur est survenue',
  generating:       'Génération en cours…',
  generate:         'Générer le CV',
  download:         'Télécharger le PDF',
  preparing:        'Préparation…',
  empty:            'Le CV apparaîtra ici après génération',
  keywords:         (n: number) => `${n} mots-clés détectés`,
} as const;

// ── Section meta ─────────────────────────────────────────────────────────────
type SectionKey = keyof CVSections;
const SECTION_DEFS: { key: SectionKey; label: string; hasText: boolean; multiline?: boolean }[] = [
  { key: 'tagline',      label: 'Accroche',        hasText: true,  multiline: false },
  { key: 'summary',      label: 'Bio / Résumé',    hasText: true,  multiline: true  },
  { key: 'capabilities', label: 'Ce que j\'apporte', hasText: true, multiline: true },
  { key: 'experience',   label: 'Expériences',     hasText: false },
  { key: 'projects',     label: 'Projets',         hasText: false },
  { key: 'skills',       label: 'Compétences',     hasText: false },
  { key: 'contact',      label: 'Contact',         hasText: false },
];

// ── Palette swatch ────────────────────────────────────────────────────────────
function PaletteSwatch({ p, active, onClick }: { p: CVPalette; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={p.label}
      className={`relative w-8 h-8 rounded-full border-2 overflow-hidden transition-all ${
        active ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
      }`}
    >
      <span className="absolute inset-0 top-0 left-0 right-0 bottom-1/2" style={{ backgroundColor: p.sidebar }} />
      <span className="absolute inset-0 top-1/2 left-0 right-0 bottom-0" style={{ backgroundColor: p.accent }} />
    </button>
  );
}

// ── Template card ─────────────────────────────────────────────────────────────
function TemplateCard({
  id, label, description, active, onClick,
}: { id: string; label: string; description: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 min-w-0 rounded-xl px-3 py-2.5 text-left border transition-all ${
        active
          ? 'border-green-app bg-green-app/10 text-green-app'
          : 'border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
      }`}
    >
      <p className="text-xs font-bold">{label}</p>
      <p className="text-[10px] opacity-70 mt-0.5 truncate">{description}</p>
    </button>
  );
}

// ── Section row ───────────────────────────────────────────────────────────────
/** Payload returned by the section API for array-based sections */
type SectionRegenResult =
  | { text: string }
  | { experiences: CVData['experiences'] }
  | { projects: CVData['projects'] };

function SectionRow({
  def,
  override,
  onToggle,
  onTextChange,
  onRegenResult,
  jobOffer,
  cv,
}: {
  def: typeof SECTION_DEFS[number];
  override: CVSections[SectionKey];
  onToggle: () => void;
  onTextChange: (t: string) => void;
  /** Called with the raw API result so the parent can merge array sections */
  onRegenResult: (result: SectionRegenResult) => void;
  jobOffer: string;
  cv: CVData | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [regenLoading, setRegenLoading] = useState(false);
  const [regenError, setRegenError]     = useState('');

  const handleRegen = useCallback(async () => {
    if (!cv || !jobOffer) return;
    setRegenLoading(true);
    setRegenError('');
    try {
      const res = await fetch('/api/cv-generator/section', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: def.key, jobOffer, cv }),
      });
      const data = await res.json();
      if (!res.ok) {
        setRegenError(data.message ?? 'Erreur');
        return;
      }
      if (data.text) {
        onTextChange(data.text);
      } else {
        // experience / projects → delegate to parent
        onRegenResult(data as SectionRegenResult);
      }
    } catch {
      setRegenError('Erreur réseau');
    } finally {
      setRegenLoading(false);
    }
  }, [cv, jobOffer, def.key, onTextChange, onRegenResult]);

  return (
    <div className={`rounded-lg border transition-colors ${override.visible ? 'border-zinc-700' : 'border-zinc-800 opacity-50'}`}>
      <div className="flex items-center gap-2 px-3 py-2">
        {/* Toggle */}
        <button
          type="button"
          onClick={onToggle}
          className={`w-8 h-4 rounded-full transition-colors flex-shrink-0 relative ${override.visible ? 'bg-green-app' : 'bg-zinc-700'}`}
        >
          <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-transform ${override.visible ? 'translate-x-4' : 'translate-x-0.5'}`} />
        </button>
        <span className="flex-1 text-xs text-zinc-300 font-medium">{def.label}</span>

        {def.hasText && (
          <>
            {/* Regen button */}
            {cv && (
              <button
                type="button"
                onClick={handleRegen}
                disabled={regenLoading}
                title="Re-générer cette section avec l'IA"
                className="w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 text-zinc-500 hover:text-green-app transition-colors disabled:opacity-40"
              >
                {regenLoading ? (
                  <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                )}
              </button>
            )}
            {/* Edit toggle */}
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              title="Modifier le texte"
              className={`w-6 h-6 flex items-center justify-center rounded hover:bg-zinc-700 transition-colors ${expanded ? 'text-green-app' : 'text-zinc-500 hover:text-zinc-300'}`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Expanded text editor */}
      {def.hasText && expanded && (
        <div className="px-3 pb-3">
          {regenError && <p className="text-red-400 text-[10px] mb-1">{regenError}</p>}
          <textarea
            value={override.text ?? ''}
            onChange={(e) => onTextChange(e.target.value)}
            rows={def.multiline ? 4 : 2}
            placeholder={`Texte personnalisé pour "${def.label}"…`}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-2.5 py-2 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app resize-y"
          />
          {override.text && (
            <button
              type="button"
              onClick={() => onTextChange('')}
              className="text-[10px] text-zinc-500 hover:text-zinc-300 mt-1 transition-colors"
            >
              Réinitialiser au texte IA
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function CVGeneratorClient() {
  // t replaced by L constant (admin has no NextIntlClientProvider)

  // ── Core state
  const [jobOffer,  setJobOffer]  = useState('');
  const [cv,        setCv]        = useState<CVData | null>(null);
  const [status,    setStatus]    = useState<'idle' | 'loading' | 'error'>('idle');
  const [error,     setError]     = useState('');

  // ── Customisation state
  const [templateId, setTemplateId] = useState<CVTemplateId>('kronos');
  const [palette,    setPalette]    = useState<CVPalette>(DEFAULT_PALETTE);
  const [sections,   setSections]   = useState<CVSections>(defaultSections());

  // ── Toggle / update helpers
  const toggleSection = useCallback((key: SectionKey) => {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], visible: !prev[key].visible },
    }));
  }, []);

  const updateSectionText = useCallback((key: SectionKey, text: string) => {
    setSections((prev) => ({
      ...prev,
      [key]: { ...prev[key], text: text || undefined },
    }));
  }, []);

  /** Merge experience / project arrays rewritten by the section AI back into cv */
  const handleRegenResult = useCallback((result: SectionRegenResult) => {
    if ('experiences' in result) {
      setCv((prev) => prev ? { ...prev, experiences: result.experiences } : prev);
    } else if ('projects' in result) {
      setCv((prev) => prev ? { ...prev, projects: result.projects } : prev);
    }
  }, []);

  // ── Generate CV
  const generate = async () => {
    if (jobOffer.trim().length < 50) {
      setError(L.tooShort);
      return;
    }
    setStatus('loading');
    setError('');
    const res  = await fetch('/api/cv-generator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobOffer }),
    });
    const data = await res.json();
    if (res.ok) {
      setCv(data.cv);
      setSections(defaultSections()); // reset overrides on new generation
      setStatus('idle');
    } else {
      setError(data.message ?? L.generic);
      setStatus('error');
    }
  };

  // ── The react-pdf document node (memoised to avoid redundant re-renders)
  const docNode = useMemo(() => {
    if (!cv) return null;
    return <CVDocumentRenderer data={cv} template={templateId} palette={palette} sections={sections} />;
  }, [cv, templateId, palette, sections]);

  const lang: 'fr' | 'en' = cv?.language ?? 'fr';

  return (
    // items-start → chaque colonne a sa propre hauteur (indispensable pour sticky)
    <div className="grid lg:grid-cols-[320px_1fr] gap-6 items-start">
      {/* ── Left: controls — scrollable ──────────────────── */}
      <div className="flex flex-col gap-4">

        {/* Job offer */}
        <div>
          <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
            {L.jobOfferLabel}
          </label>
          <textarea
            value={jobOffer}
            onChange={(e) => setJobOffer(e.target.value)}
            placeholder={L.jobOfferPh}
            rows={10}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app transition-colors resize-none font-mono"
          />
          <button
            onClick={generate}
            disabled={status === 'loading'}
            className="mt-2 w-full bg-green-app text-white font-semibold py-2.5 rounded-lg text-sm hover:opacity-80 disabled:opacity-40 transition-opacity"
          >
            {status === 'loading' ? L.generating : L.generate}
          </button>
          {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
        </div>

        {/* Template picker */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-medium">Template</p>
          <div className="flex gap-2">
            {CV_TEMPLATES.map((tpl) => (
              <TemplateCard
                key={tpl.id}
                {...tpl}
                active={templateId === tpl.id}
                onClick={() => setTemplateId(tpl.id)}
              />
            ))}
          </div>
        </div>

        {/* Palette picker */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-medium">Palette</p>
          <div className="flex items-center gap-2 flex-wrap">
            {CV_PALETTES.map((p) => (
              <PaletteSwatch
                key={p.id}
                p={p}
                active={palette.id === p.id}
                onClick={() => setPalette(p)}
              />
            ))}
            <span className="text-xs text-zinc-500 ml-1">{palette.label}</span>
          </div>
        </div>

        {/* Keywords detected */}
        {cv && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-medium">
              {L.keywords(cv.keywords.length)}
            </p>
            <div className="flex flex-wrap gap-1">
              {cv.keywords.map((k) => (
                <span key={k} className="text-[10px] bg-green-app/10 text-green-app border border-green-app/20 px-1.5 py-0.5 rounded-full">
                  {k}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Section controls */}
        {cv && (
          <div>
            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-medium">
              Sections
            </p>
            <div className="flex flex-col gap-1.5">
              {SECTION_DEFS.map((def) => (
                <SectionRow
                  key={def.key}
                  def={def}
                  override={sections[def.key]}
                  onToggle={() => toggleSection(def.key)}
                  onTextChange={(text) => updateSectionText(def.key, text)}
                  onRegenResult={handleRegenResult}
                  jobOffer={jobOffer}
                  cv={cv}
                />
              ))}
            </div>
          </div>
        )}

        {/* Download */}
        {cv && docNode && (
          <div className="mt-auto">
            <PDFDownloadLink
              document={docNode}
              fileName={`cv-${cv.jobTitle.toLowerCase().replace(/\s+/g, '-')}.pdf`}
              className="w-full flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-zinc-200 font-semibold py-2.5 rounded-lg text-sm transition-colors"
            >
              {({ loading }) =>
                loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Préparation…
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {L.download}
                  </>
                )
              }
            </PDFDownloadLink>
          </div>
        )}
      </div>

      {/* ── Right: PDF preview — sticky ─────────────────── */}
      <div className="sticky top-6 flex flex-col gap-3">
        {!cv ? (
          /* Empty state — A4 proportions */
          <div
            className="w-full border border-dashed border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-900/40"
            style={{ aspectRatio: '210/297' }}
          >
            <div className="text-center">
              <svg className="w-10 h-10 mx-auto mb-3 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-zinc-500 text-sm">{L.empty}</p>
            </div>
          </div>
        ) : docNode ? (
          /* PDF Viewer — real A4 iframe, proper proportions */
          <div className="w-full rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '210/297' }}>
            <PDFViewer width="100%" height="100%" showToolbar={false}>
              {docNode}
            </PDFViewer>
          </div>
        ) : null}

        {/* Info bar */}
        {cv && (
          <div className="flex items-center gap-4 text-xs text-zinc-500 flex-wrap">
            <span>
              Lang : <span className="text-zinc-300 font-medium">{lang === 'fr' ? 'Français' : 'English'}</span>
            </span>
            <span>
              Expériences : <span className="text-zinc-300 font-medium">{cv.experiences.length}</span>
            </span>
            <span>
              Projets : <span className="text-zinc-300 font-medium">{cv.projects.length}</span>
            </span>
            <span>
              Template : <span className="text-zinc-300 font-medium capitalize">{templateId}</span>
            </span>
            <span>
              Palette : <span className="text-zinc-300 font-medium">{palette.label}</span>
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
