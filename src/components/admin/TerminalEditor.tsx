"use client";

import { useState } from "react";
import type { TerminalConfig, TerminalAnnotation } from "@/features/site-config/types";

type Props = { initialConfig: TerminalConfig };

export default function TerminalEditor({ initialConfig }: Props) {
  const [cfg,    setCfg]    = useState<TerminalConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  const update = (patch: Partial<TerminalConfig>) => {
    setCfg((p) => ({ ...p, ...patch }));
    setSaved(false);
  };

  /* ── Lines ── */
  const updateLine = (idx: number, val: string) => {
    const next = [...cfg.terminalLines];
    next[idx] = val;
    update({ terminalLines: next });
  };
  const removeLine = (idx: number) =>
    update({ terminalLines: cfg.terminalLines.filter((_, i) => i !== idx) });
  const addLine = () =>
    update({ terminalLines: [...cfg.terminalLines, "> "] });

  /* ── Annotations ── */
  const updateAnnotation = (side: "left" | "right", idx: number, field: keyof TerminalAnnotation, val: string) => {
    const key = side === "left" ? "leftAnnotations" : "rightAnnotations";
    const arr = [...cfg[key]];
    arr[idx] = { ...arr[idx], [field]: val };
    update({ [key]: arr });
  };
  const removeAnnotation = (side: "left" | "right", idx: number) => {
    const key = side === "left" ? "leftAnnotations" : "rightAnnotations";
    update({ [key]: cfg[key].filter((_, i) => i !== idx) });
  };
  const addAnnotation = (side: "left" | "right") => {
    const key = side === "left" ? "leftAnnotations" : "rightAnnotations";
    update({ [key]: [...cfg[key], { label: "", sublabel: "" }] });
  };

  const save = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ terminal: cfg }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else setError("Erreur lors de la sauvegarde");
    } catch { setError("Erreur réseau"); }
    finally  { setSaving(false); }
  };

  const AnnotationList = ({ side }: { side: "left" | "right" }) => {
    const list = side === "left" ? cfg.leftAnnotations : cfg.rightAnnotations;
    return (
      <div className="space-y-2">
        {list.map((ann, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <input type="text" value={ann.label}
              onChange={(e) => updateAnnotation(side, idx, "label", e.target.value)}
              placeholder="LABEL"
              className="w-28 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-green-app" />
            <input type="text" value={ann.sublabel}
              onChange={(e) => updateAnnotation(side, idx, "sublabel", e.target.value)}
              placeholder="SOUS-LABEL"
              className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-green-app" />
            <button type="button" onClick={() => removeAnnotation(side, idx)}
              className="text-zinc-600 hover:text-red-400 transition-colors">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        <button type="button" onClick={() => addAnnotation(side)}
          className="text-xs text-green-app/70 hover:text-green-app transition-colors">
          + Ajouter
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Enable toggle */}
      <div className="flex items-center justify-between bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">Afficher la section terminal</p>
        <button type="button" role="switch" aria-checked={cfg.enabled}
          onClick={() => update({ enabled: !cfg.enabled })}
          className={`relative w-11 h-6 rounded-full transition-colors ${cfg.enabled ? "bg-green-app" : "bg-zinc-700"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${cfg.enabled ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      {/* Badge + heading */}
      <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Textes</p>
        <div className="grid sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Badge</label>
            <input type="text" value={cfg.badge} onChange={(e) => update({ badge: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
          </div>
          <div>
            <label className="text-xs text-zinc-500 mb-1 block">Titre</label>
            <input type="text" value={cfg.heading} onChange={(e) => update({ heading: e.target.value })}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
          </div>
        </div>
      </div>

      {/* Terminal lines */}
      <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Lignes du terminal</p>
        <div className="space-y-2 font-mono">
          {cfg.terminalLines.map((line, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-zinc-600 text-xs w-4 text-right flex-shrink-0">{idx + 1}</span>
              <input type="text" value={line} onChange={(e) => updateLine(idx, e.target.value)}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-2 py-1.5 text-xs text-zinc-200 font-mono focus:outline-none focus:border-green-app" />
              <button type="button" onClick={() => removeLine(idx)}
                className="text-zinc-600 hover:text-red-400 transition-colors">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={addLine}
          className="text-xs text-green-app/70 hover:text-green-app transition-colors">
          + Ajouter une ligne
        </button>
      </div>

      {/* Left / Right annotations */}
      <div className="grid sm:grid-cols-2 gap-4">
        <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Annotations gauche</p>
          <AnnotationList side="left" />
        </div>
        <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Annotations droite</p>
          <AnnotationList side="right" />
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-3">
        <button type="button" onClick={save} disabled={saving}
          className="flex-1 bg-green-app text-white font-semibold py-2.5 rounded-xl text-sm hover:opacity-80 disabled:opacity-50 transition-opacity flex items-center justify-center gap-2">
          {saving ? (
            <><svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Sauvegarde…</>
          ) : saved ? (
            <><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7"/></svg>Sauvegardé !</>
          ) : "Appliquer"}
        </button>
      </div>
      {error && <p className="text-red-400 text-xs">{error}</p>}
    </div>
  );
}
