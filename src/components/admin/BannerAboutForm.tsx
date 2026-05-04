"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AboutBlock } from "@/entities/stat";

interface Props {
  initial?: Partial<AboutBlock>;
  mode: "create" | "edit";
  id?: string;
}

export default function BannerAboutForm({ initial, mode, id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [label, setLabel] = useState(initial?.label ?? "À propos de moi");
  const [body, setBody] = useState(initial?.body ?? "");
  const [ctaText, setCtaText] = useState(initial?.ctaText ?? "En savoir plus");
  const [ctaHref, setCtaHref] = useState(initial?.ctaHref ?? "/about");
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!body.trim()) {
      toast.error("Le contenu est requis");
      return;
    }
    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/about-block?id=${id}` : "/api/about-block";
      const method = mode === "edit" ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, body, ctaText, ctaHref, order, published }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Erreur");
      }
      toast.success(mode === "edit" ? "Carte mise à jour" : "Carte créée");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Field label="Sur-titre">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="À propos de moi"
          className="input-base"
        />
      </Field>

      <Field label="Contenu *">
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={3}
          placeholder="Phrase courte qui décrit qui tu es et ce que tu fais."
          required
          className="input-base resize-none"
        />
      </Field>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Texte du lien CTA">
          <input
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="En savoir plus"
            className="input-base"
          />
        </Field>
        <Field label="URL du lien CTA">
          <input
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
            placeholder="/about"
            className="input-base"
          />
        </Field>
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
          {loading ? "Enregistrement…" : mode === "edit" ? "Mettre à jour" : "Créer"}
        </button>
      </div>

      <input type="hidden" value={order} readOnly />

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
        textarea.input-base {
          height: auto;
          min-height: 80px;
          padding: 0.625rem 0.75rem;
          line-height: 1.5;
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
