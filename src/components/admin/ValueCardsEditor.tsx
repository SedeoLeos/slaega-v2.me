"use client";

import { useState } from "react";
import type { ValueCardsConfig, ValueCard } from "@/features/site-config/types";

type Props = { initialConfig: ValueCardsConfig };

export default function ValueCardsEditor({ initialConfig }: Props) {
  const [cfg,    setCfg]    = useState<ValueCardsConfig>(initialConfig);
  const [saving, setSaving] = useState(false);
  const [saved,  setSaved]  = useState(false);
  const [error,  setError]  = useState("");

  const update = (patch: Partial<ValueCardsConfig>) => {
    setCfg((p) => ({ ...p, ...patch }));
    setSaved(false);
  };

  const updateCard = (idx: number, field: keyof ValueCard, val: string) => {
    const next = [...cfg.cards];
    next[idx] = { ...next[idx], [field]: val };
    update({ cards: next });
  };

  const save = async () => {
    setSaving(true); setError("");
    try {
      const res = await fetch("/api/site-config", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ "value-cards": cfg }),
      });
      if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
      else setError("Erreur lors de la sauvegarde");
    } catch { setError("Erreur réseau"); }
    finally  { setSaving(false); }
  };

  return (
    <div className="space-y-6">
      {/* Enable toggle */}
      <div className="flex items-center justify-between bg-zinc-800/60 border border-zinc-700 rounded-xl px-4 py-3">
        <p className="text-sm font-medium text-zinc-200">Afficher les cartes valeurs</p>
        <button type="button" role="switch" aria-checked={cfg.enabled}
          onClick={() => update({ enabled: !cfg.enabled })}
          className={`relative w-11 h-6 rounded-full transition-colors ${cfg.enabled ? "bg-green-app" : "bg-zinc-700"}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${cfg.enabled ? "translate-x-5" : "translate-x-0"}`} />
        </button>
      </div>

      {/* Cards */}
      <div className="space-y-4">
        {cfg.cards.map((card, idx) => (
          <div key={idx} className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Carte {idx + 1}</p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Badge</label>
                <input type="text" value={card.badge}
                  onChange={(e) => updateCard(idx, "badge", e.target.value)}
                  placeholder="DISPONIBLE"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 mb-1 block">Titre</label>
                <input type="text" value={card.title}
                  onChange={(e) => updateCard(idx, "title", e.target.value)}
                  placeholder="Prêt à démarrer"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Description</label>
              <textarea rows={2} value={card.description}
                onChange={(e) => updateCard(idx, "description", e.target.value)}
                placeholder="Description courte…"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app resize-none" />
            </div>
          </div>
        ))}
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
