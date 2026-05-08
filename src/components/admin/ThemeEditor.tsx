'use client';

import { useState, useCallback } from 'react';
import type { PortfolioTheme } from '@/features/site-config/types';
import { DEFAULT_THEME } from '@/features/site-config/types';

const FIELDS: { key: keyof PortfolioTheme; label: string; description: string }[] = [
  { key: 'background', label: 'Arrière-plan',   description: 'Fond général de la page' },
  { key: 'card',       label: 'Cartes',          description: 'Fond des cartes / blocs' },
  { key: 'foreground', label: 'Texte principal', description: 'Couleur principale du texte' },
  { key: 'secondary',  label: 'Texte secondaire', description: 'Titres de section, labels' },
  { key: 'greenApp',   label: 'Accent / CTA',    description: 'Boutons, liens, highlights' },
  { key: 'accent',     label: 'Accent 2',        description: 'Bordures accent, icônes' },
];

// ── Preset palettes ──────────────────────────────────────────────────────────
const PRESETS = [
  {
    label: 'Olive (défaut)',
    theme: DEFAULT_THEME,
  },
  {
    label: 'Crème ivoire',
    theme: { background: '#F5F0E8', foreground: '#1A1208', greenApp: '#6B4A2A', card: '#FDFAF4', accent: '#8B6544', secondary: '#7A6855' },
  },
  {
    label: 'Gris ardoise',
    theme: { background: '#E8EAEC', foreground: '#111827', greenApp: '#2563EB', card: '#F3F4F6', accent: '#3B82F6', secondary: '#6B7280' },
  },
  {
    label: 'Nuit profonde',
    theme: { background: '#0F172A', foreground: '#F1F5F9', greenApp: '#06B6D4', card: '#1E293B', accent: '#0EA5E9', secondary: '#94A3B8' },
  },
  {
    label: 'Rose poudré',
    theme: { background: '#FDF2F8', foreground: '#1F0B16', greenApp: '#BE185D', card: '#FDF8FB', accent: '#DB2777', secondary: '#9D174D' },
  },
  {
    label: 'Rig (sombre)',
    theme: { background: '#141414', foreground: '#F0EDE6', greenApp: '#E5533C', card: '#1E1E1E', accent: '#E5533C', secondary: '#888888' },
  },
];

// ── Color preview chip ────────────────────────────────────────────────────────
function ColorChip({ color, onClick }: { color: string; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-7 h-7 rounded-lg border border-white/10 flex-shrink-0 transition-transform hover:scale-110 shadow-sm"
      style={{ backgroundColor: color }}
      title={color}
    />
  );
}

// ── Live preview strip ────────────────────────────────────────────────────────
function LivePreview({ theme }: { theme: PortfolioTheme }) {
  return (
    <div
      className="rounded-2xl overflow-hidden border border-white/10 shadow-xl"
      style={{ backgroundColor: theme.background }}
    >
      {/* Nav bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b" style={{ borderColor: `${theme.foreground}15` }}>
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold" style={{ backgroundColor: theme.greenApp, color: '#fff' }}>S</span>
          <span className="text-xs font-semibold" style={{ color: theme.foreground }}>slaega.me</span>
        </div>
        <div className="flex gap-3">
          {['Projets', 'À propos', 'Contact'].map((item) => (
            <span key={item} className="text-xs" style={{ color: theme.secondary }}>{item}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div className="px-5 py-6">
        <p className="text-[10px] mb-1 font-medium" style={{ color: theme.greenApp }}>Développeur full-stack</p>
        <p className="text-lg font-bold leading-tight mb-2" style={{ color: theme.foreground }}>
          Seba Gedeon<br />
          <span style={{ color: theme.secondary }}>Matsoula Malonga</span>
        </p>
        <p className="text-xs leading-relaxed mb-4 max-w-xs" style={{ color: theme.secondary }}>
          Je conçois et code des produits digitaux performants,<br />du prototype à la mise en production.
        </p>
        <div className="flex gap-2">
          <span className="px-4 py-1.5 rounded-full text-xs font-semibold" style={{ backgroundColor: theme.foreground, color: theme.background }}>Voir les projets</span>
          <span className="px-4 py-1.5 rounded-full text-xs font-medium border" style={{ borderColor: `${theme.foreground}30`, color: theme.foreground }}>Contact</span>
        </div>
      </div>

      {/* Card row */}
      <div className="flex gap-2 px-5 pb-5">
        {['React', 'Next.js', 'TypeScript'].map((tag) => (
          <div key={tag} className="flex-1 rounded-xl px-3 py-2.5" style={{ backgroundColor: theme.card, border: `1px solid ${theme.foreground}10` }}>
            <p className="text-[9px] font-semibold mb-0.5" style={{ color: theme.foreground }}>{tag}</p>
            <div className="flex gap-1 mt-1">
              {[60, 40, 80].map((w) => (
                <div key={w} className="h-1 rounded" style={{ width: `${w}%`, backgroundColor: `${theme.secondary}40` }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Accent strip */}
      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${theme.greenApp}, ${theme.accent})` }} />
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────────
type Props = { initialTheme: PortfolioTheme };

export default function ThemeEditor({ initialTheme }: Props) {
  const [theme,   setTheme]   = useState<PortfolioTheme>(initialTheme);
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState('');

  const updateField = useCallback((key: keyof PortfolioTheme, value: string) => {
    setTheme((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  }, []);

  const applyPreset = useCallback((preset: typeof PRESETS[number]) => {
    setTheme(preset.theme as PortfolioTheme);
    setSaved(false);
  }, []);

  const save = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/site-config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        setError('Erreur lors de la sauvegarde');
      }
    } catch {
      setError('Erreur réseau');
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    setTheme(DEFAULT_THEME);
    setSaved(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      {/* ── Controls ───────────────── */}
      <div className="space-y-6">

        {/* Presets */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Thèmes prédéfinis</h3>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => applyPreset(preset)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-zinc-500 transition-colors"
              >
                <div className="flex gap-0.5">
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.theme.background }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.theme.greenApp }} />
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: preset.theme.foreground }} />
                </div>
                <span className="text-xs text-zinc-300">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Colour fields */}
        <div>
          <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Personnaliser</h3>
          <div className="space-y-3">
            {FIELDS.map(({ key, label, description }) => (
              <div key={key} className="flex items-center gap-4 bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3">
                {/* Colour picker swatch */}
                <label className="relative flex-shrink-0 cursor-pointer" title={`Choisir ${label}`}>
                  <div
                    className="w-10 h-10 rounded-xl border-2 border-white/15 shadow-md transition-transform hover:scale-110"
                    style={{ backgroundColor: theme[key] }}
                  />
                  <input
                    type="color"
                    value={theme[key]}
                    onChange={(e) => updateField(key, e.target.value)}
                    className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  />
                </label>

                {/* Label + hex input */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-zinc-200">{label}</p>
                  <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
                </div>
                <input
                  type="text"
                  value={theme[key]}
                  onChange={(e) => updateField(key, e.target.value)}
                  className="w-24 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-green-app"
                  spellCheck={false}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="flex-1 bg-green-app text-white font-semibold py-2.5 rounded-xl text-sm hover:opacity-80 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Sauvegarde…
              </>
            ) : saved ? (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Sauvegardé !
              </>
            ) : (
              'Appliquer le thème'
            )}
          </button>
          <button
            type="button"
            onClick={reset}
            className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm hover:border-zinc-500 hover:text-zinc-200 transition-colors"
          >
            Réinitialiser
          </button>
        </div>

        {error && <p className="text-red-400 text-xs">{error}</p>}

        <p className="text-xs text-zinc-600">
          Les changements sont appliqués en temps réel sur le portfolio public à la prochaine visite.
        </p>
      </div>

      {/* ── Live preview ───────────── */}
      <div>
        <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">Aperçu en direct</h3>
        <LivePreview theme={theme} />
        <div className="flex gap-2 mt-3 flex-wrap">
          {FIELDS.map(({ key }) => (
            <ColorChip key={key} color={theme[key]} />
          ))}
        </div>
      </div>
    </div>
  );
}
