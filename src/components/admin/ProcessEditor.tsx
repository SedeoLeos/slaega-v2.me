"use client";

import { useState } from "react";
import type { ProcessStep } from "@/entities/process-step";

type Props = { initialSteps: ProcessStep[] };

export default function ProcessEditor({ initialSteps }: Props) {
  const [steps,   setSteps]   = useState<ProcessStep[]>(initialSteps);
  const [editing, setEditing] = useState<string | null>(null);
  const [form,    setForm]    = useState({ stepNumber: 1, label: "", title: "", description: "", published: true });
  const [saving,  setSaving]  = useState<string | null>(null);
  const [error,   setError]   = useState("");

  const resetForm = () => setForm({ stepNumber: steps.length + 1, label: `STEP 0${steps.length + 1}`, title: "", description: "", published: true });
  const startEdit = (s: ProcessStep) => {
    setEditing(s.id);
    setForm({ stepNumber: s.stepNumber, label: s.label, title: s.title, description: s.description, published: s.published });
  };
  const cancelEdit = () => { setEditing(null); resetForm(); };

  const save = async (id?: string) => {
    setSaving(id ?? "new");
    setError("");
    try {
      const url    = id ? `/api/process?id=${id}` : "/api/process";
      const method = id ? "PUT" : "POST";
      const body   = id ? { ...form } : { ...form, order: steps.length };
      const res    = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { setError("Erreur lors de la sauvegarde"); return; }
      const saved: ProcessStep = await res.json();
      setSteps((prev) => id ? prev.map((s) => s.id === id ? saved : s) : [...prev, saved]);
      cancelEdit();
    } catch { setError("Erreur réseau"); }
    finally  { setSaving(null); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette étape ?")) return;
    setSaving(id);
    try {
      const res = await fetch(`/api/process?id=${id}`, { method: "DELETE" });
      if (res.ok) setSteps((prev) => prev.filter((s) => s.id !== id));
    } finally { setSaving(null); }
  };

  const togglePublished = async (step: ProcessStep) => {
    const res = await fetch(`/api/process?id=${step.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !step.published }),
    });
    if (res.ok) {
      const updated: ProcessStep = await res.json();
      setSteps((prev) => prev.map((s) => s.id === step.id ? updated : s));
    }
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Existing steps */}
      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="bg-zinc-800/60 border border-zinc-700 rounded-xl overflow-hidden">
            {editing === step.id ? (
              <div className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Label (ex. STEP 01)</label>
                    <input type="text" value={form.label}
                      onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 mb-1 block">Numéro</label>
                    <input type="number" value={form.stepNumber} min={1}
                      onChange={(e) => setForm((p) => ({ ...p, stepNumber: Number(e.target.value) }))}
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
                  </div>
                </div>
                <input type="text" value={form.title}
                  onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Titre de l'étape"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
                <textarea rows={3} value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app resize-none" />
                <div className="flex gap-2">
                  <button type="button" onClick={() => save(step.id)} disabled={!!saving}
                    className="px-4 py-2 bg-green-app/20 hover:bg-green-app/30 border border-green-app/30 text-green-app rounded-lg text-sm font-medium transition-colors disabled:opacity-50">
                    {saving === step.id ? "Sauvegarde…" : "Sauvegarder"}
                  </button>
                  <button type="button" onClick={cancelEdit}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 rounded-lg text-sm transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4">
                <span className="text-xs font-mono font-bold text-green-app flex-shrink-0 pt-0.5 min-w-[52px]">
                  {step.label}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200">{step.title}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{step.description}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button type="button" onClick={() => togglePublished(step)}
                    className={`w-5 h-5 rounded-full border-2 transition-colors ${step.published ? "bg-green-app border-green-app" : "bg-transparent border-zinc-600"}`}
                    title={step.published ? "Masquer" : "Publier"} />
                  <button type="button" onClick={() => startEdit(step)}
                    className="text-zinc-500 hover:text-zinc-200 transition-colors p-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => remove(step.id)} disabled={saving === step.id}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1 disabled:opacity-40">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add new */}
      {editing === null && (
        <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Ajouter une étape</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Label</label>
              <input type="text" value={form.label}
                onChange={(e) => setForm((p) => ({ ...p, label: e.target.value }))}
                placeholder="STEP 01"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
            </div>
            <div>
              <label className="text-xs text-zinc-500 mb-1 block">Numéro</label>
              <input type="number" value={form.stepNumber} min={1}
                onChange={(e) => setForm((p) => ({ ...p, stepNumber: Number(e.target.value) }))}
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
            </div>
          </div>
          <input type="text" value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            placeholder="Titre de l'étape…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app" />
          <textarea rows={3} value={form.description}
            onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
            placeholder="Description…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 focus:outline-none focus:border-green-app resize-none" />
          <button type="button" onClick={() => save()}
            disabled={!!saving || !form.title.trim() || !form.description.trim()}
            className="px-4 py-2 bg-green-app/20 hover:bg-green-app/30 border border-green-app/30 text-green-app rounded-lg text-sm font-medium transition-colors disabled:opacity-40">
            {saving === "new" ? "Ajout…" : "Ajouter"}
          </button>
        </div>
      )}
    </div>
  );
}
