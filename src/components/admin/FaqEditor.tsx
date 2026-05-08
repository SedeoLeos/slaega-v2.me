"use client";

import { useState } from "react";
import type { FaqItem } from "@/entities/faq-item";

type Props = { initialItems: FaqItem[] };

export default function FaqEditor({ initialItems }: Props) {
  const [items,   setItems]   = useState<FaqItem[]>(initialItems);
  const [editing, setEditing] = useState<string | null>(null);
  const [form,    setForm]    = useState({ question: "", answer: "", published: true });
  const [saving,  setSaving]  = useState<string | null>(null);
  const [error,   setError]   = useState("");

  /* ── helpers ── */
  const resetForm = () => setForm({ question: "", answer: "", published: true });

  const startEdit = (item: FaqItem) => {
    setEditing(item.id);
    setForm({ question: item.question, answer: item.answer, published: item.published });
  };

  const cancelEdit = () => { setEditing(null); resetForm(); };

  /* ── CRUD ── */
  const save = async (id?: string) => {
    setSaving(id ?? "new");
    setError("");
    try {
      const url  = id ? `/api/faq?id=${id}` : "/api/faq";
      const method = id ? "PUT" : "POST";
      const body = id
        ? { ...form }
        : { ...form, order: items.length };

      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) { setError("Erreur lors de la sauvegarde"); return; }
      const saved: FaqItem = await res.json();

      setItems((prev) =>
        id ? prev.map((i) => i.id === id ? saved : i) : [...prev, saved]
      );
      cancelEdit();
    } catch { setError("Erreur réseau"); }
    finally  { setSaving(null); }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cette question ?")) return;
    setSaving(id);
    try {
      const res = await fetch(`/api/faq?id=${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
    } finally { setSaving(null); }
  };

  const togglePublished = async (item: FaqItem) => {
    const res = await fetch(`/api/faq?id=${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    if (res.ok) {
      const updated: FaqItem = await res.json();
      setItems((prev) => prev.map((i) => i.id === item.id ? updated : i));
    }
  };

  return (
    <div className="space-y-6">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Existing items */}
      <div className="space-y-3">
        {items.map((item, idx) => (
          <div key={item.id} className="bg-zinc-800/60 border border-zinc-700 rounded-xl overflow-hidden">
            {editing === item.id ? (
              /* Edit form */
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  value={form.question}
                  onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
                  placeholder="Question"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app"
                />
                <textarea
                  rows={3}
                  value={form.answer}
                  onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
                  placeholder="Réponse"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app resize-none"
                />
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => save(item.id)}
                    disabled={!!saving}
                    className="px-4 py-2 bg-green-app/20 hover:bg-green-app/30 border border-green-app/30 text-green-app rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {saving === item.id ? "Sauvegarde…" : "Sauvegarder"}
                  </button>
                  <button type="button" onClick={cancelEdit}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 rounded-lg text-sm transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              /* Read row */
              <div className="flex items-start gap-3 p-4">
                <span className="text-xs font-mono font-bold text-zinc-600 flex-shrink-0 pt-0.5 w-6">
                  {String(idx + 1).padStart(2, '0')}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 truncate">{item.question}</p>
                  <p className="text-xs text-zinc-500 mt-0.5 line-clamp-2">{item.answer}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Published toggle */}
                  <button
                    type="button"
                    onClick={() => togglePublished(item)}
                    className={`w-5 h-5 rounded-full border-2 transition-colors ${item.published ? "bg-green-app border-green-app" : "bg-transparent border-zinc-600"}`}
                    title={item.published ? "Masquer" : "Publier"}
                  />
                  <button type="button" onClick={() => startEdit(item)}
                    className="text-zinc-500 hover:text-zinc-200 transition-colors p-1">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button type="button" onClick={() => remove(item.id)} disabled={saving === item.id}
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
          <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Ajouter une question</p>
          <input
            type="text"
            value={form.question}
            onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && form.question && form.answer && save()}
            placeholder="Question…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app"
          />
          <textarea
            rows={3}
            value={form.answer}
            onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))}
            placeholder="Réponse…"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app resize-none"
          />
          <button
            type="button"
            onClick={() => save()}
            disabled={!!saving || !form.question.trim() || !form.answer.trim()}
            className="px-4 py-2 bg-green-app/20 hover:bg-green-app/30 border border-green-app/30 text-green-app rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
          >
            {saving === "new" ? "Ajout…" : "Ajouter"}
          </button>
        </div>
      )}
    </div>
  );
}
