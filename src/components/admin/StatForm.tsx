"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Stat, StatColor } from "@/entities/stat";

interface Props {
  initial?: Partial<Stat>;
  mode: "create" | "edit";
  id?: string;
}

const COLORS: { value: StatColor; label: string; class: string }[] = [
  { value: "green", label: "Vert (marque)", class: "bg-green-app" },
  { value: "rose", label: "Rose / Rouge", class: "bg-rose-500" },
  { value: "amber", label: "Ambre", class: "bg-amber-400" },
  { value: "dark", label: "Sombre", class: "bg-zinc-900 border border-zinc-700" },
  { value: "sky", label: "Bleu", class: "bg-sky-500" },
];

export default function StatForm({ initial, mode, id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState(initial?.value ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [color, setColor] = useState<StatColor>(initial?.color ?? "green");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || !label.trim()) {
      toast.error("Valeur et libellé requis");
      return;
    }
    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/stats?id=${id}` : "/api/stats";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value, label, color, order, published }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Erreur");
      }
      toast.success(mode === "edit" ? "Stat mise à jour" : "Stat créée");
      router.push("/admin/stats");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Valeur *">
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1434+, 17, 2B+"
            required
            className="input-base"
          />
        </Field>
        <Field label="Ordre d'affichage">
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            className="input-base"
          />
        </Field>
      </div>

      <Field label="Libellé *">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Projets livrés"
          required
          className="input-base"
        />
      </Field>

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Couleur de l&apos;accent</label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {COLORS.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => setColor(c.value)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-all ${
                color === c.value
                  ? "border-green-app bg-green-app/10 text-white"
                  : "border-zinc-700 hover:border-zinc-600 text-zinc-400"
              }`}
            >
              <span className={`w-3 h-3 rounded-full ${c.class}`} />
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between py-3 px-4 bg-zinc-900 border border-zinc-800/60 rounded-xl">
        <div>
          <p className="text-sm font-medium text-zinc-200">Publié</p>
          <p className="text-xs text-zinc-500 mt-0.5">Visible sur la page d&apos;accueil</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={published}
          onClick={() => setPublished((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
            published ? "bg-green-app" : "bg-zinc-700"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
              published ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-6 py-2.5 rounded-full text-sm shadow-sm shadow-green-app/30 disabled:opacity-50 transition-colors"
        >
          {loading ? "Enregistrement…" : mode === "edit" ? "Mettre à jour" : "Créer la stat"}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Annuler
        </button>
      </div>

      <style>{`
        .input-base {
          width: 100%;
          height: 40px;
          background: #18181b;
          border: 1px solid #3f3f46;
          border-radius: 0.5rem;
          padding: 0 0.75rem;
          font-size: 0.875rem;
          color: #e4e4e7;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
          font-family: inherit;
        }
        .input-base:focus {
          border-color: #05796B;
          box-shadow: 0 0 0 3px rgba(5, 121, 107, 0.1);
        }
        .input-base::placeholder { color: #52525b; }
      `}</style>
    </form>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}
