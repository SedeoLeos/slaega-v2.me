"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import RichEditor from "./RichEditor";
import type { AboutPage, AboutHighlightGroup } from "@/entities/about-page";

interface Props {
  initial: AboutPage;
}

export default function AboutPageForm({ initial }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [label, setLabel] = useState(initial.label);
  const [title, setTitle] = useState(initial.title);
  const [intro, setIntro] = useState(initial.intro);
  const [body, setBody] = useState(initial.body);
  const [ctaText, setCtaText] = useState(initial.ctaText);
  const [ctaHref, setCtaHref] = useState(initial.ctaHref);
  const [published, setPublished] = useState(initial.published);
  const [highlights, setHighlights] = useState<AboutHighlightGroup[]>(initial.highlights);

  const updateGroup = (index: number, patch: Partial<AboutHighlightGroup>) => {
    setHighlights((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  };

  const addGroup = () =>
    setHighlights((prev) => [...prev, { title: "", items: [] }]);

  const removeGroup = (index: number) =>
    setHighlights((prev) => prev.filter((_, i) => i !== index));

  const setItems = (index: number, raw: string) => {
    const items = raw.split(",").map((s) => s.trim()).filter(Boolean);
    updateGroup(index, { items });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/about-page?id=${initial.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label, title, intro, body, ctaText, ctaHref, published,
          highlights,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Erreur");
      }
      toast.success("À propos mis à jour");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Label + title */}
      <div className="grid sm:grid-cols-[1fr_2fr] gap-4">
        <Field label="Sur-titre">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Apprenez à me connaître"
            className="input-base"
          />
        </Field>
        <Field label="Titre principal *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="À propos"
            className="input-base"
          />
        </Field>
      </div>

      {/* Intro */}
      <Field label="Introduction (paragraphe court)">
        <textarea
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
          rows={3}
          placeholder="Résumé en quelques lignes…"
          className="input-base resize-none"
        />
      </Field>

      {/* Body — rich text */}
      <RichEditor value={body} onChange={setBody} label="Corps du contenu (Markdown)" placeholder="Texte enrichi…" />

      {/* Highlights */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-xs font-medium text-zinc-400">Groupes d&apos;informations (compétences, stack, etc.)</label>
          <button
            type="button"
            onClick={addGroup}
            className="text-xs font-semibold text-green-app hover:text-green-app/80 transition-colors"
          >
            + Ajouter un groupe
          </button>
        </div>

        <div className="space-y-3">
          {highlights.length === 0 && (
            <p className="text-xs text-zinc-600 italic">Aucun groupe — clique sur &quot;Ajouter un groupe&quot; pour commencer.</p>
          )}

          {highlights.map((g, i) => (
            <div
              key={i}
              className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-2">
                <input
                  value={g.title}
                  onChange={(e) => updateGroup(i, { title: e.target.value })}
                  placeholder="Titre du groupe (ex: Stack principale)"
                  className="input-base"
                />
                <button
                  type="button"
                  onClick={() => removeGroup(i)}
                  className="text-xs text-zinc-500 hover:text-red-400 transition-colors px-3 py-2 flex-shrink-0"
                >
                  Supprimer
                </button>
              </div>
              <textarea
                value={g.items.join(", ")}
                onChange={(e) => setItems(i, e.target.value)}
                rows={2}
                placeholder="Items séparés par des virgules : Spring Boot, NestJS, Next.js…"
                className="input-base resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Texte du bouton CTA">
          <input
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            placeholder="Me contacter"
            className="input-base"
          />
        </Field>
        <Field label="URL du bouton CTA">
          <input
            value={ctaHref}
            onChange={(e) => setCtaHref(e.target.value)}
            placeholder="/contact"
            className="input-base"
          />
        </Field>
      </div>

      {/* Published */}
      <div className="flex items-center justify-between py-3 px-4 bg-zinc-900 border border-zinc-800/60 rounded-xl">
        <div>
          <p className="text-sm font-medium text-zinc-200">Publié</p>
          <p className="text-xs text-zinc-500 mt-0.5">Visible sur la page publique</p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={published}
          onClick={() => setPublished((v) => !v)}
          className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${published ? "bg-green-app" : "bg-zinc-700"}`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${published ? "translate-x-5" : "translate-x-0"}`}
          />
        </button>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm shadow-green-app/30"
        >
          {loading ? "Enregistrement…" : "Mettre à jour"}
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
          line-height: 1.4;
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
