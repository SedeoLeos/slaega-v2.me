"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Service } from "@/entities/service";

interface Props {
  initial?: Partial<Service>;
  mode: "create" | "edit";
  id?: string;
}

const ICONS = [
  { value: "light", label: "Ampoule" },
  { value: "code", label: "Code" },
  { value: "cog", label: "Engrenage" },
  { value: "shield", label: "Bouclier" },
  { value: "cloud", label: "Cloud" },
  { value: "rocket", label: "Fusée" },
  { value: "device", label: "Mobile" },
  { value: "database", label: "Base de données" },
];

export default function ServiceForm({ initial, mode, id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [icon, setIcon] = useState(initial?.icon ?? "light");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      toast.error("Titre et description requis");
      return;
    }
    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/services?id=${id}` : "/api/services";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, icon, order, published }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Erreur");
      }
      toast.success(mode === "edit" ? "Service mis à jour" : "Service créé");
      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-[1fr_120px] gap-4">
        <Field label="Titre *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Développement Mobile & Web"
            required
            className="input-base"
          />
        </Field>
        <Field label="Ordre">
          <input
            type="number"
            value={order}
            onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            className="input-base"
          />
        </Field>
      </div>

      <Field label="Description *">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Décris ce service en quelques phrases…"
          required
          rows={4}
          className="input-base"
          style={{ height: "auto", padding: "0.75rem" }}
        />
      </Field>

      <Field label="Icône">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {ICONS.map((i) => (
            <button
              key={i.value}
              type="button"
              onClick={() => setIcon(i.value)}
              className={`px-3 py-2 rounded-lg border text-sm transition-all ${
                icon === i.value
                  ? "border-green-app bg-green-app/10 text-white"
                  : "border-zinc-700 hover:border-zinc-600 text-zinc-400"
              }`}
            >
              {i.label}
            </button>
          ))}
        </div>
      </Field>

      <div className="flex items-center justify-between py-3 px-4 bg-zinc-900 border border-zinc-800/60 rounded-xl">
        <div>
          <p className="text-sm font-medium text-zinc-200">Publié</p>
          <p className="text-xs text-zinc-500 mt-0.5">Visible dans la section Services</p>
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
          {loading ? "Enregistrement…" : mode === "edit" ? "Mettre à jour" : "Créer le service"}
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
        textarea.input-base { resize: vertical; line-height: 1.55; }
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
