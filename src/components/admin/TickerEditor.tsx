"use client";

import { useState, useRef } from "react";
import type { TickerConfig } from "@/features/site-config/types";

type Props = { initialTicker: TickerConfig };

export default function TickerEditor({ initialTicker }: Props) {
  const [cfg,     setCfg]     = useState<TickerConfig>(initialTicker);
  const [newItem, setNewItem] = useState("");
  const [saving,  setSaving]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [error,   setError]   = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const update = (patch: Partial<TickerConfig>) => {
    setCfg((prev) => ({ ...prev, ...patch }));
    setSaved(false);
  };

  const addItem = () => {
    const v = newItem.trim();
    if (!v || cfg.items.includes(v)) return;
    update({ items: [...cfg.items, v] });
    setNewItem("");
    inputRef.current?.focus();
  };

  const removeItem = (idx: number) =>
    update({ items: cfg.items.filter((_, i) => i !== idx) });

  const moveItem = (idx: number, dir: -1 | 1) => {
    const next = [...cfg.items];
    const swap = idx + dir;
    if (swap < 0 || swap >= next.length) return;
    [next[idx], next[swap]] = [next[swap], next[idx]];
    update({ items: next });
  };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticker: cfg }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else setError("Erreur lors de la sauvegarde");
    } catch { setError("Erreur réseau"); }
    finally { setSaving(false); }
  };

  /* ── Live preview ── */
  const previewItems = cfg.items.length > 0 ? cfg.items : ["Exemple d'item"];
  const track = [...previewItems, ...previewItems];

  return (
    <div className="space-y-6">
      {/* Enable toggle */}
      <div className="flex items-center justify-between bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-medium text-zinc-200">Afficher le bandeau</p>
          <p className="text-xs text-zinc-500 mt-0.5">Active ou désactive le ticker sur le site public</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={cfg.enabled}
          onClick={() => update({ enabled: !cfg.enabled })}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${cfg.enabled ? "bg-green-app" : "bg-zinc-700"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${cfg.enabled ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      {/* Items */}
      <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Items défilants</p>

        <div className="space-y-2">
          {cfg.items.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-700/50 rounded-lg px-3 py-2">
              <span className="flex-1 text-sm text-zinc-200 truncate">{item}</span>
              <button type="button" onClick={() => moveItem(idx, -1)} disabled={idx === 0}
                className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors px-1">↑</button>
              <button type="button" onClick={() => moveItem(idx, 1)} disabled={idx === cfg.items.length - 1}
                className="text-zinc-500 hover:text-zinc-200 disabled:opacity-20 transition-colors px-1">↓</button>
              <button type="button" onClick={() => removeItem(idx)}
                className="text-zinc-600 hover:text-red-400 transition-colors ml-1">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>

        {/* Add item */}
        <div className="flex gap-2 mt-2">
          <input
            ref={inputRef}
            type="text"
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            placeholder="Nouvel item…"
            className="flex-1 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app"
          />
          <button type="button" onClick={addItem}
            className="px-4 py-2 bg-green-app/20 hover:bg-green-app/30 border border-green-app/30 text-green-app rounded-lg text-sm font-medium transition-colors">
            Ajouter
          </button>
        </div>
      </div>

      {/* Colors + speed */}
      <div className="grid sm:grid-cols-3 gap-3">
        {/* BG Color */}
        <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex items-center gap-3">
          <label className="relative cursor-pointer flex-shrink-0">
            <div className="w-9 h-9 rounded-lg border-2 border-white/15 transition-transform hover:scale-110" style={{ backgroundColor: cfg.bgColor }} />
            <input type="color" value={cfg.bgColor} onChange={(e) => update({ bgColor: e.target.value })}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
          </label>
          <div>
            <p className="text-xs font-medium text-zinc-300">Fond</p>
            <input type="text" value={cfg.bgColor} onChange={(e) => update({ bgColor: e.target.value })}
              className="w-20 bg-transparent text-xs font-mono text-zinc-400 focus:outline-none focus:text-zinc-200" />
          </div>
        </div>

        {/* Text Color */}
        <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3 flex items-center gap-3">
          <label className="relative cursor-pointer flex-shrink-0">
            <div className="w-9 h-9 rounded-lg border-2 border-white/15 transition-transform hover:scale-110" style={{ backgroundColor: cfg.textColor }} />
            <input type="color" value={cfg.textColor} onChange={(e) => update({ textColor: e.target.value })}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" />
          </label>
          <div>
            <p className="text-xs font-medium text-zinc-300">Texte</p>
            <input type="text" value={cfg.textColor} onChange={(e) => update({ textColor: e.target.value })}
              className="w-20 bg-transparent text-xs font-mono text-zinc-400 focus:outline-none focus:text-zinc-200" />
          </div>
        </div>

        {/* Speed */}
        <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-3">
          <p className="text-xs font-medium text-zinc-300 mb-2">Vitesse — {cfg.speed}s</p>
          <input type="range" min={8} max={60} step={1} value={cfg.speed}
            onChange={(e) => update({ speed: Number(e.target.value) })}
            className="w-full accent-green-app h-1.5 rounded-full" />
          <div className="flex justify-between text-[10px] text-zinc-600 mt-1">
            <span>Rapide</span><span>Lent</span>
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div className="rounded-xl overflow-hidden border border-zinc-700">
        <p className="text-xs text-zinc-500 px-3 py-2 bg-zinc-800/60 border-b border-zinc-700 font-medium uppercase tracking-widest">Aperçu</p>
        <div className="overflow-hidden py-2.5" style={{ backgroundColor: cfg.bgColor }}>
          <div className="flex whitespace-nowrap" style={{ animation: `ticker-scroll ${cfg.speed}s linear infinite` }}>
            {track.map((item, i) => (
              <span key={i} className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] px-6" style={{ color: cfg.textColor }}>
                {item}
                <span className="w-1 h-1 rounded-full opacity-60" style={{ backgroundColor: cfg.textColor }} />
              </span>
            ))}
          </div>
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
