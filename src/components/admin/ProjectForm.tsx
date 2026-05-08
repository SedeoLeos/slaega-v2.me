"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TagInput from "./TagInput";
import RichEditor from "./RichEditor";
import DatePicker from "./DatePicker";
import ImageInput from "./ImageInput";
import type { Project } from "@/entities/project";

const CATEGORIES = [
  "Web",
  "Mobile",
  "FullStack",
  "Backend",
  "Frontend",
  "DevOps",
  "API",
  "Design",
  "SaaS",
  "Open Source",
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
  const [date, setDate] = useState(
    initial?.date ?? new Date().toISOString().split("T")[0],
  );
  const [image, setImage] = useState(initial?.image ?? "");
  const [description, setDescription] = useState(initial?.desc ?? "");
  const [tags, setTags] = useState<string[]>(initial?.tags ?? []);
  const [categories, setCategories] = useState<string[]>(
    initial?.categories ?? [],
  );
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [projectUrl, setProjectUrl] = useState(initial?.projectUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(initial?.githubUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(initial?.videoUrl ?? "");
  const [videoUploading, setVideoUploading] = useState(false);

  const toggleCategory = (c: string) =>
    setCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Le titre et le contenu sont requis");
      return;
    }

    setLoading(true);
    try {
      const url =
        mode === "edit" ? `/api/projects?slug=${slug}` : "/api/projects";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          date,
          image,
          description,
          tags,
          categories,
          content,
          published,
          projectUrl: projectUrl || undefined,
          githubUrl: githubUrl || undefined,
          videoUrl: videoUrl || undefined,
        }),
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
    <form
      onSubmit={handleSubmit}
      className="grid lg:grid-cols-[1fr_320px] gap-6 items-start"
    >
      {/* ═════════ MAIN COLUMN ═════════ */}
      <div className="space-y-6 min-w-0">
        <Field label="Titre *">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Mon super projet"
            className="input-base"
          />
        </Field>

        <Field label="Description courte">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            placeholder="Résumé en une phrase…"
            className="input-base resize-none"
          />
        </Field>

        <RichEditor
          value={content}
          onChange={setContent}
          label="Contenu"
          placeholder="Décrivez votre projet — contexte, stack, défis, résultats…"
        />

        <div className="flex items-center gap-3 pt-2 lg:hidden">
          <SubmitBlock loading={loading} mode={mode} />
        </div>
      </div>

      {/* ═════════ SIDEBAR ═════════ */}
      <aside className="space-y-5 lg:sticky lg:top-8">
        {/* Publish status — call to action */}
        <SidebarCard>
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-sm font-medium text-zinc-200">Publié</p>
              <p className="text-xs text-zinc-500 mt-0.5">
                Visible sur le portfolio
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={published}
              aria-label="Publier le projet"
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
          <div className="hidden lg:block">
            <SubmitBlock loading={loading} mode={mode} fullWidth />
          </div>
        </SidebarCard>

        <SidebarCard title="Métadonnées">
          <Field label="Date de publication *">
            <DatePicker value={date} onChange={setDate} required />
          </Field>
        </SidebarCard>

        <SidebarCard title="Image de couverture">
          <ImageInput value={image} onChange={setImage} />
        </SidebarCard>

        {/* ── Vidéo de démo ── */}
        <SidebarCard title="Vidéo de démo (optionnel)">
          <p className="text-[11px] text-zinc-500 mb-3 leading-relaxed">
            Remplace l'image par une vidéo. Upload direct ou colle une URL (YouTube, Vimeo, mp4…).
          </p>

          {/* Upload local / S3 */}
          <label className="flex items-center gap-2 cursor-pointer w-full justify-center py-2 px-3 rounded-lg border border-dashed border-zinc-700 hover:border-zinc-500 transition-colors text-xs text-zinc-400 mb-3">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            {videoUploading ? "Envoi en cours…" : "Uploader une vidéo (mp4 / webm)"}
            <input
              type="file"
              accept="video/mp4,video/webm,video/ogg,video/quicktime"
              className="hidden"
              disabled={videoUploading}
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setVideoUploading(true);
                try {
                  const fd = new FormData();
                  fd.append("file", file);
                  const res = await fetch("/api/upload", { method: "POST", body: fd });
                  if (!res.ok) {
                    const d = await res.json();
                    toast.error(d.message ?? "Erreur upload vidéo");
                    return;
                  }
                  const d = await res.json();
                  setVideoUrl(d.url);
                  toast.success("Vidéo uploadée !");
                } catch {
                  toast.error("Erreur réseau");
                } finally {
                  setVideoUploading(false);
                  e.target.value = "";
                }
              }}
            />
          </label>

          {/* URL manuelle */}
          <Field label="URL de la vidéo">
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=… ou /api/uploads/…"
              type="url"
              className="input-base"
            />
          </Field>

          {/* Preview miniature */}
          {videoUrl && (
            <div className="mt-3 relative rounded-lg overflow-hidden bg-zinc-900 aspect-video flex items-center justify-center">
              {videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be") ? (
                <p className="text-xs text-zinc-400 text-center px-4">
                  ▶ YouTube — prévisualisation dans la page projet
                </p>
              ) : videoUrl.includes("vimeo.com") ? (
                <p className="text-xs text-zinc-400 text-center px-4">
                  ▶ Vimeo — prévisualisation dans la page projet
                </p>
              ) : (
                // eslint-disable-next-line jsx-a11y/media-has-caption
                <video
                  src={videoUrl}
                  className="w-full h-full object-cover"
                  controls={false}
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
              <button
                type="button"
                onClick={() => setVideoUrl("")}
                className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-red-600 transition-colors text-xs"
                title="Supprimer la vidéo"
              >✕</button>
            </div>
          )}
        </SidebarCard>

        <SidebarCard title="Liens du projet">
          <Field label="URL du projet (live)">
            <input
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://monprojet.com"
              type="url"
              className="input-base"
            />
          </Field>
          <div className="mt-3">
            <Field label="GitHub (si public)">
              <input
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/user/repo"
                type="url"
                className="input-base"
              />
            </Field>
          </div>
        </SidebarCard>

        <SidebarCard title="Catégories">
          <div className="flex flex-wrap gap-1.5">
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
        </SidebarCard>

        <SidebarCard>
          <TagInput
            value={tags}
            onChange={setTags}
            label="Tags"
            placeholder="React, Node.js, …"
          />
        </SidebarCard>
      </aside>

      {/* Hidden submit so Enter still triggers form submit on inputs */}
      <button
        type="submit"
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />

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
        .input-base:disabled { cursor: not-allowed; opacity: 0.5; }
      `}</style>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-zinc-400 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

function SidebarCard({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-zinc-900/60 border border-zinc-800/60 rounded-xl p-4">
      {title && (
        <p className="text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-3">
          {title}
        </p>
      )}
      {children}
    </div>
  );
}

function SubmitBlock({
  loading,
  mode,
  fullWidth,
}: {
  loading: boolean;
  mode: "create" | "edit";
  fullWidth?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 bg-green-app hover:bg-green-app/85 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold px-6 py-2.5 rounded-full text-sm transition-colors shadow-sm shadow-green-app/30 ${
        fullWidth ? "w-full" : ""
      }`}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      {loading
        ? "Enregistrement…"
        : mode === "edit"
          ? "Mettre à jour"
          : "Créer le projet"}
    </button>
  );
}
