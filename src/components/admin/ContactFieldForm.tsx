"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { ContactField, ContactFieldType } from "@/entities/contact-field";

interface Props {
  initial?: Partial<ContactField>;
  mode: "create" | "edit";
  id?: string;
}

const TYPES: { value: ContactFieldType; label: string; desc: string }[] = [
  { value: "text", label: "Texte", desc: "Champ texte simple" },
  { value: "email", label: "Email", desc: "Validation email native" },
  { value: "tel", label: "Téléphone", desc: "Numéro de téléphone" },
  { value: "textarea", label: "Zone de texte", desc: "Plusieurs lignes" },
  { value: "select", label: "Liste déroulante", desc: "Choix prédéfinis" },
];

export default function ContactFieldForm({ initial, mode, id }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState(initial?.name ?? "");
  const [label, setLabel] = useState(initial?.label ?? "");
  const [type, setType] = useState<ContactFieldType>(initial?.type ?? "text");
  const [placeholder, setPlaceholder] = useState(initial?.placeholder ?? "");
  const [required, setRequired] = useState(initial?.required ?? true);
  const [order, setOrder] = useState(initial?.order ?? 0);
  const [published, setPublished] = useState(initial?.published ?? true);
  const [optionsRaw, setOptionsRaw] = useState((initial?.options ?? []).join(", "));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !label.trim()) {
      toast.error("Nom et libellé requis");
      return;
    }
    if (!/^[a-z][a-z0-9_]*$/.test(name)) {
      toast.error("Le nom doit être en lowercase, sans espaces (ex: full_name, phone)");
      return;
    }
    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/contact-fields?id=${id}` : "/api/contact-fields";
      const method = mode === "edit" ? "PUT" : "POST";
      const options = type === "select"
        ? optionsRaw.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, label, type, placeholder, required, order, published, options }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message ?? "Erreur");
      }
      toast.success(mode === "edit" ? "Champ mis à jour" : "Champ créé");
      router.push("/admin/contact-fields");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid sm:grid-cols-[1fr_1fr_120px] gap-4">
        <Field label="Nom (clé technique) *">
          <input
            value={name}
            onChange={(e) => setName(e.target.value.toLowerCase())}
            placeholder="full_name"
            required
            pattern="^[a-z][a-z0-9_]*$"
            className="input-base font-mono"
          />
        </Field>
        <Field label="Libellé affiché *">
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            placeholder="Nom complet"
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

      <div>
        <label className="block text-xs font-medium text-zinc-400 mb-2">Type de champ</label>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TYPES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setType(t.value)}
              className={`text-left px-3 py-2.5 rounded-lg border transition-all ${
                type === t.value
                  ? "border-green-app bg-green-app/10"
                  : "border-zinc-700 hover:border-zinc-600"
              }`}
            >
              <p className={`text-sm font-medium ${type === t.value ? "text-white" : "text-zinc-300"}`}>
                {t.label}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      <Field label="Placeholder (texte d'aide)">
        <input
          value={placeholder}
          onChange={(e) => setPlaceholder(e.target.value)}
          placeholder="Tapez votre nom…"
          className="input-base"
        />
      </Field>

      {type === "select" && (
        <Field label="Options (séparées par virgules)">
          <textarea
            value={optionsRaw}
            onChange={(e) => setOptionsRaw(e.target.value)}
            rows={3}
            placeholder="Mission freelance, Conseil technique, Recrutement, Autre"
            className="input-base resize-none"
          />
        </Field>
      )}

      <div className="grid sm:grid-cols-2 gap-3">
        <ToggleRow
          label="Champ requis"
          desc="L'utilisateur doit le remplir"
          checked={required}
          onChange={setRequired}
        />
        <ToggleRow
          label="Publié"
          desc="Visible sur le formulaire public"
          checked={published}
          onChange={setPublished}
        />
      </div>

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-6 py-2.5 rounded-full text-sm shadow-sm shadow-green-app/30 disabled:opacity-50 transition-colors"
        >
          {loading ? "Enregistrement…" : mode === "edit" ? "Mettre à jour" : "Créer le champ"}
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

function ToggleRow({
  label,
  desc,
  checked,
  onChange,
}: {
  label: string;
  desc: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-zinc-900 border border-zinc-800/60 rounded-xl">
      <div className="min-w-0 flex-1 mr-3">
        <p className="text-sm font-medium text-zinc-200">{label}</p>
        <p className="text-xs text-zinc-500 mt-0.5">{desc}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors flex-shrink-0 ${
          checked ? "bg-green-app" : "bg-zinc-700"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}
