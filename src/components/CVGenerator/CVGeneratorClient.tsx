'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import type { CVData, CVSections, CVTemplateId } from './cv-types';
// (no useTranslations — this component renders in admin without NextIntlClientProvider)
import { defaultSections, CV_TEMPLATES } from './cv-types';
import { CV_PALETTES, DEFAULT_PALETTE } from './cv-palettes';
import type { CVPalette } from './cv-palettes';
import CVDocumentRenderer from './CVDocumentRenderer';
import TemplateDrawer from './TemplateDrawer';

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
      className={`w-8 h-8 rounded-full border-2 transition-all ${
        active ? 'border-white scale-110 shadow-lg' : 'border-transparent hover:scale-105'
      }`}
      style={{ background: `linear-gradient(135deg, ${p.accent} 50%, ${p.sidebar} 50%)` }}
    />
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
          className={`relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
            override.visible ? 'bg-green-app' : 'bg-zinc-600'
          }`}
        >
          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
            override.visible ? 'translate-x-4' : 'translate-x-0'
          }`} />
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

// ── Saved-CV summary shape (from /api/cv-generator/saved) ──────────────────────
type SavedCvSummary = {
  id: string;
  title: string;
  jobOffer: string;
  language: string;
  createdAt: string;
  isPublic?: boolean;
  domain?: string;
};

// ── Main component ────────────────────────────────────────────────────────────
export default function CVGeneratorClient() {
  // t replaced by L constant (admin has no NextIntlClientProvider)

  // ── Core state
  const [jobOffer,  setJobOffer]  = useState('');
  const [cv,        setCv]        = useState<CVData | null>(null);
  const [status,    setStatus]    = useState<'idle' | 'loading' | 'error'>('idle');
  const [error,     setError]     = useState('');

  // ── Saved CVs
  const [savedList,    setSavedList]    = useState<SavedCvSummary[]>([]);
  const [savingState,  setSavingState]  = useState<'idle' | 'saving' | 'saved'>('idle');
  const [busyId,       setBusyId]       = useState<string | null>(null);

  const loadSaved = useCallback(async () => {
    try {
      const res = await fetch('/api/cv-generator/saved');
      if (!res.ok) return;
      const data = await res.json();
      setSavedList(Array.isArray(data.items) ? data.items : []);
    } catch {
      /* silencieux */
    }
  }, []);

  useEffect(() => { loadSaved(); }, [loadSaved]);

  const saveCurrent = useCallback(async () => {
    if (!cv) return;
    setSavingState('saving');
    try {
      const title = `${cv.jobTitle} — ${new Date().toLocaleDateString('fr-FR')}`;
      const res = await fetch('/api/cv-generator/saved', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, jobOffer, language: cv.language ?? 'fr', data: cv }),
      });
      if (res.ok) {
        setSavingState('saved');
        await loadSaved();
        setTimeout(() => setSavingState('idle'), 2000);
      } else {
        setSavingState('idle');
      }
    } catch {
      setSavingState('idle');
    }
  }, [cv, jobOffer, loadSaved]);

  const reuseSaved = useCallback(async (id: string) => {
    setBusyId(id);
    try {
      const res = await fetch(`/api/cv-generator/saved?id=${encodeURIComponent(id)}`);
      if (!res.ok) return;
      const data = await res.json();
      const saved = data.cv;
      if (saved?.data) {
        setCv(saved.data as CVData);
        setJobOffer(saved.jobOffer ?? '');
        setSections(defaultSections());
        setStatus('idle');
        setError('');
      }
    } catch {
      /* silencieux */
    } finally {
      setBusyId(null);
    }
  }, []);

  // Reuse a CV requested from the saved-CVs page via ?load=<id> (once, on mount).
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get('load');
    if (!id) return;
    reuseSaved(id);
    // Clean the URL so a refresh doesn't reload it.
    window.history.replaceState(null, '', window.location.pathname);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Customisation state
  const [templateId,     setTemplateId]     = useState<CVTemplateId>('kronos');
  const [palette,        setPalette]        = useState<CVPalette>(DEFAULT_PALETTE);
  const [sections,       setSections]       = useState<CVSections>(defaultSections());
  const [drawerOpen,     setDrawerOpen]     = useState(false);

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
    <>
    {/* Template drawer */}
    {drawerOpen && (
      <TemplateDrawer
        current={templateId}
        palette={palette}
        onSelect={(id) => { setTemplateId(id); setDrawerOpen(false); }}
        onClose={() => setDrawerOpen(false)}
      />
    )}

    {/* h-full + overflow-hidden → le panneau droit reste figé, le gauche défile */}
    <div className="grid lg:grid-cols-[320px_1fr] gap-6 h-full overflow-hidden">
      {/* ── Left: controls — scrollable ──────────────────── */}
      <div className="flex flex-col gap-4 overflow-y-auto pr-1 pb-4 dark-scroll">

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

        {/* ── Mes CV enregistrés → page dédiée ───────────────── */}
        <a
          href="/admin/cv-generator/saved"
          className="flex items-center justify-between px-3 py-2.5 border border-zinc-800 rounded-xl hover:border-zinc-600 hover:bg-zinc-900/50 transition-colors group"
        >
          <span className="flex items-center gap-2 text-xs font-semibold text-zinc-300">
            <svg className="w-3.5 h-3.5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            CV enregistrés
            {savedList.length > 0 && (
              <span className="text-[10px] bg-zinc-700 text-zinc-100 px-1.5 py-0.5 rounded-full">
                {savedList.length}
              </span>
            )}
          </span>
          <span className="text-[11px] text-zinc-500 group-hover:text-green-app transition-colors flex items-center gap-1">
            Gérer &amp; publier
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </span>
        </a>

        {/* Template picker — drawer trigger */}
        <div>
          <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-2 font-medium">Template</p>
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-500 rounded-xl transition-all group"
          >
            <div className="flex items-center gap-3">
              {/* Mini palette swatch */}
              <span
                className="w-5 h-5 rounded-md flex-shrink-0"
                style={{ background: `linear-gradient(135deg, ${palette.accent} 50%, ${palette.sidebar} 50%)` }}
              />
              <div className="text-left">
                <p className="text-sm font-semibold text-zinc-200">
                  {CV_TEMPLATES.find(t => t.id === templateId)?.label ?? 'Kronos'}
                </p>
                <p className="text-[10px] text-zinc-500">
                  {CV_TEMPLATES.find(t => t.id === templateId)?.description}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-zinc-500 group-hover:text-zinc-300 transition-colors">
              <span className="text-[10px]">{CV_TEMPLATES.length} templates</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
          </button>
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
                <span key={k} className="text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700 px-1.5 py-0.5 rounded-full">
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

        {/* Download + Save */}
        {cv && docNode && (
          <div className="mt-auto flex flex-col gap-2">
            <button
              type="button"
              onClick={saveCurrent}
              disabled={savingState === 'saving'}
              className="w-full flex items-center justify-center gap-2 bg-zinc-100 hover:bg-white text-zinc-900 font-semibold py-2.5 rounded-lg text-sm transition-colors disabled:opacity-40"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" style={{ display: savingState === 'saved' ? 'block' : 'none' }} />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1-4H9a2 2 0 00-2 2v6h10V5a2 2 0 00-2-2z" style={{ display: savingState === 'saved' ? 'none' : 'block' }} />
              </svg>
              {savingState === 'saving' ? 'Enregistrement…' : savingState === 'saved' ? 'Enregistré ✓' : 'Enregistrer ce CV'}
            </button>
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

      {/* ── Right: PDF preview — hauteur fixe, ne défile pas ── */}
      <div className="flex flex-col gap-3 h-full overflow-hidden">
        {!cv ? (
          /* Empty state */
          <div className="flex-1 border border-dashed border-zinc-700 rounded-xl flex items-center justify-center bg-zinc-900/40">
            <div className="text-center">
              <svg className="w-10 h-10 mx-auto mb-3 text-zinc-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-zinc-500 text-sm">{L.empty}</p>
            </div>
          </div>
        ) : docNode ? (
          /* PDF Viewer — remplit toute la hauteur disponible */
          <div className="flex-1 min-h-0 rounded-xl overflow-hidden shadow-2xl">
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
    </>
  );
}
