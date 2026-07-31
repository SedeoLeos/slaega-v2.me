"use client";

import { useState } from "react";
import type { Pensee, PenseeKind } from "@/entities/pensee";
import { PENSEE_KINDS, penseeKindLabel } from "@/entities/pensee";

type Props = { initialItems: Pensee[] };

type Form = {
  kind: PenseeKind;
  title: string;
  subtitle: string;
  body: string;
  published: boolean;
};

const EMPTY: Form = { kind: "pensee", title: "", subtitle: "", body: "", published: true };

export default function PenseeEditor({ initialItems }: Props) {
  const [items, setItems] = useState<Pensee[]>(initialItems);
  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saving, setSaving] = useState<string | null>(null);
  const [error, setError] = useState("");

  const startEdit = (item: Pensee) => {
    setCreating(false);
    setEditing(item.id);
    setForm({
      kind: item.kind,
      title: item.title,
      subtitle: item.subtitle,
      body: item.body,
      published: item.published,
    });
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(EMPTY);
  };

  const save = async (id?: string) => {
    setSaving(id ?? "new");
    setError("");
    try {
      const url = id ? `/api/pensees?id=${id}` : "/api/pensees";
      const method = id ? "PUT" : "POST";
      const body = id ? { ...form } : { ...form, order: items.length };
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        setError("Erreur lors de la sauvegarde");
        return;
      }
      const saved: Pensee = await res.json();
      setItems((prev) => (id ? prev.map((i) => (i.id === id ? saved : i)) : [...prev, saved]));
      cancel();
    } catch {
      setError("Erreur réseau");
    } finally {
      setSaving(null);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Supprimer cet écrit ?")) return;
    setSaving(id);
    try {
      const res = await fetch(`/api/pensees?id=${id}`, { method: "DELETE" });
      if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
    } finally {
      setSaving(null);
    }
  };

  const togglePublished = async (item: Pensee) => {
    const res = await fetch(`/api/pensees?id=${item.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !item.published }),
    });
    if (res.ok) {
      const updated: Pensee = await res.json();
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    }
  };

  const fields = (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {PENSEE_KINDS.map((k) => (
          <button
            key={k.value}
            type="button"
            onClick={() => setForm((p) => ({ ...p, kind: k.value }))}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              form.kind === k.value
                ? "bg-green-app/20 border-green-app/40 text-green-app"
                : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-500"
            }`}
            title={k.blurb}
          >
            {k.label}
          </button>
        ))}
      </div>
      <input
        type="text"
        value={form.title}
        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
        placeholder="Titre"
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app"
      />
      <input
        type="text"
        value={form.subtitle}
        onChange={(e) => setForm((p) => ({ ...p, subtitle: e.target.value }))}
        placeholder="Sous-titre (optionnel)"
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app"
      />
      <textarea
        rows={form.kind === "chanson" ? 12 : 6}
        value={form.body}
        onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
        placeholder={
          form.kind === "chanson"
            ? "Paroles… (les retours à la ligne sont conservés)"
            : "Texte, réflexion, croyance…"
        }
        className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app resize-y font-mono leading-relaxed"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-zinc-400">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm((p) => ({ ...p, published: e.target.checked }))}
            className="accent-green-app"
          />
          Publié
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {error && <p className="text-red-400 text-xs">{error}</p>}

      {/* Existing items */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-zinc-800/60 border border-zinc-700 rounded-xl overflow-hidden"
          >
            {editing === item.id ? (
              <div className="p-4 space-y-3">
                {fields}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => save(item.id)}
                    disabled={!!saving || !form.title.trim() || !form.body.trim()}
                    className="px-4 py-2 bg-green-app/20 hover:bg-green-app/30 border border-green-app/30 text-green-app rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                  >
                    {saving === item.id ? "Sauvegarde…" : "Sauvegarder"}
                  </button>
                  <button
                    type="button"
                    onClick={cancel}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 rounded-lg text-sm transition-colors"
                  >
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-3 p-4">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wide text-green-app/80 flex-shrink-0 pt-1 w-24">
                  {penseeKindLabel(item.kind)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-zinc-200 truncate">{item.title}</p>
                  {item.subtitle && (
                    <p className="text-xs text-zinc-500 mt-0.5 truncate">{item.subtitle}</p>
                  )}
                  <p className="text-xs text-zinc-600 mt-1 line-clamp-2 whitespace-pre-line">
                    {item.body}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => togglePublished(item)}
                    className={`w-5 h-5 rounded-full border-2 transition-colors ${
                      item.published ? "bg-green-app border-green-app" : "bg-transparent border-zinc-600"
                    }`}
                    title={item.published ? "Masquer" : "Publier"}
                  />
                  <button
                    type="button"
                    onClick={() => startEdit(item)}
                    className="text-zinc-500 hover:text-zinc-200 transition-colors p-1"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(item.id)}
                    disabled={saving === item.id}
                    className="text-zinc-600 hover:text-red-400 transition-colors p-1 disabled:opacity-40"
                  >
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
      {editing === null &&
        (creating ? (
          <div className="bg-zinc-800/60 border border-zinc-700 rounded-xl p-4 space-y-3">
            <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">Nouvel écrit</p>
            {fields}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => save()}
                disabled={!!saving || !form.title.trim() || !form.body.trim()}
                className="px-4 py-2 bg-green-app/20 hover:bg-green-app/30 border border-green-app/30 text-green-app rounded-lg text-sm font-medium transition-colors disabled:opacity-40"
              >
                {saving === "new" ? "Ajout…" : "Ajouter"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-zinc-400 rounded-lg text-sm transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setForm(EMPTY);
              setCreating(true);
            }}
            className="w-full py-3 rounded-xl border border-dashed border-zinc-700 text-zinc-400 text-sm hover:border-green-app hover:text-green-app transition-colors"
          >
            + Ajouter un écrit
          </button>
        ))}
    </div>
  );
}
