"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TagInput from "./TagInput";
import RichEditor from "./RichEditor";
import type { Project } from "@/entities/project";

const CATEGORIES = [
  "Web", "Mobile", "FullStack", "Backend", "Frontend",
  "DevOps", "API", "Design", "SaaS", "Open Source",
];

interface ProjectFormProps {
  initial?: Partial<Project & { content: string }>;
  mode: "create" | "edit";
  slug?: string;
}

export default function ProjectForm({ initial, mode, slug }: ProjectFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState(initial?.title ?? "");
  const [date, setDate] = useState(initial?.date ?? new Date().toISOString().split("T")[0]);
  const [image, setImage] = useState(initial?.image ?? "");
  const [description, setDescription] = useState(initial?.desc ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [categories, setCategories] = useState<string[]>(initial?.categories ?? []);
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);

  const toggleCategory = (c: string) =>
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Le titre et le contenu sont requis");
      return;
    }

    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/projects?slug=${slug}` : "/api/projects";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, date, image, description, tags, categories, content, published }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Erreur serveur");
      }

      const data = await res.json();
      toast.success(mode === "edit" ? "Projet mis à jour !" : "Projet créé !");
      router.push(`/admin/projects/${mode === "edit" ? slug : data.slug}`);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title + Date */}
      <div className="grid sm:grid-cols-[1fr_160px] gap-4">
        <Field label="Titre *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Mon super projet"
            className="input-base"
          />
        </Field>
        <Field label="Date de publication *">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="input-base"
          />
        </Field>
      </div>

      {/* Description */}
      <Field label="Description courte">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          placeholder="Résumé en une phrase..."
          className="input-base resize-none"
        />
      </Field>

      {/* Image */}
      <Field label="URL de l'image">
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/projects/mon-projet.jpg"
          className="input-base"
        />
      </Field>

      {/* Categories */}
      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Catégories</label>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCategory(c)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                categories.includes(c)
                  ? "bg-green-app/20 border-green-app/40 text-green-app"
                  : "bg-zinc-800/50 border-zinc-700/50 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Tags */}
      <TagInput value={tags} onChange={setTags} label="Tags" placeholder="React, Node.js, …" />

      {/* Content */}
      <RichEditor
        value={content}
        onChange={setContent}
        label="Contenu"
        placeholder="Décrivez votre projet — contexte, stack, défis, résultats…"
      />

      {/* Published toggle */}
      <div className="flex items-center justify-between py-3 px-4 bg-zinc-900 border border-zinc-800/60 rounded-xl">
        <div>
          <p className="text-sm font-medium text-zinc-200">Publié</p>
          <p className="text-xs text-zinc-500 mt-0.5">
            Visible sur le portfolio public
          </p>
        </div>
        <button
          type="button"
          onClick={() => setPublished((v) => !v)}
          className={`relative w-10 h-5.5 rounded-full transition-colors ${
            published ? "bg-green-app" : "bg-zinc-700"
          }`}
          style={{ height: "22px" }}
        >
          <span
            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
              published ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm shadow-green-app/30"
        >
          {loading ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          )}
          {loading ? "Enregistrement…" : mode === "edit" ? "Mettre à jour" : "Créer le projet"}
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
          background: #18181b;
          border: 1px solid #3f3f46;
          border-radius: 0.5rem;
          padding: 0.5rem 0.75rem;
          font-size: 0.875rem;
          color: #e4e4e7;
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
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
