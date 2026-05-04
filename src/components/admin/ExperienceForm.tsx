"use client";
import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import TagInput from "./TagInput";
import type { Experience } from "@/entities/experience";

interface ExperienceFormProps {
  initial?: Partial<Experience>;
  mode: "create" | "edit";
  id?: string;
}

export default function ExperienceForm({ initial, mode, id }: ExperienceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [company, setCompany] = useState(initial?.company ?? "");
  const [role, setRole] = useState(initial?.role ?? "");
  const [location, setLocation] = useState(initial?.location ?? "");
  const [companyUrl, setCompanyUrl] = useState(initial?.companyUrl ?? "");
  const [startDate, setStartDate] = useState(initial?.startDate ?? "");
  const [endDate, setEndDate] = useState(initial?.endDate ?? "");
  const [current, setCurrent] = useState(initial?.current ?? false);
  const [description, setDescription] = useState(initial?.description ?? "");
  const [skills, setSkills] = useState<string[]>(initial?.skills ?? []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !role.trim() || !startDate || !description.trim()) {
      toast.error("Entreprise, poste, date de début et description sont requis");
      return;
    }

    setLoading(true);
    try {
      const url = mode === "edit" ? `/api/experience?id=${id}` : "/api/experience";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          company, role, location, companyUrl,
          startDate, endDate: current ? null : endDate || null,
          current, description, skills,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message ?? "Erreur serveur");
      }

      toast.success(mode === "edit" ? "Expérience mise à jour !" : "Expérience créée !");
      router.push("/admin/experience");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company + role */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Entreprise *">
          <input
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            required
            placeholder="Slaega, ACME Corp…"
            className="input-base"
          />
        </Field>
        <Field label="Poste *">
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            placeholder="Développeur Full Stack"
            className="input-base"
          />
        </Field>
      </div>

      {/* Location + URL */}
      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Localisation">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Paris, France — Remote"
            className="input-base"
          />
        </Field>
        <Field label="Site web de l'entreprise">
          <input
            value={companyUrl}
            onChange={(e) => setCompanyUrl(e.target.value)}
            placeholder="https://example.com"
            type="url"
            className="input-base"
          />
        </Field>
      </div>

      {/* Dates */}
      <div className="grid sm:grid-cols-3 gap-4 items-end">
        <Field label="Date de début *">
          <input
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            placeholder="2023-01"
            pattern="\d{4}-\d{2}"
            title="Format : AAAA-MM"
            className="input-base"
          />
        </Field>
        <Field label="Date de fin">
          <input
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="2024-06"
            pattern="\d{4}-\d{2}"
            title="Format : AAAA-MM"
            disabled={current}
            className="input-base disabled:opacity-40"
          />
        </Field>
        <div className="flex items-center gap-3 pb-1">
          <button
            type="button"
            onClick={() => setCurrent((v) => !v)}
            className={`relative w-9 flex-shrink-0 rounded-full transition-colors ${current ? "bg-green-500" : "bg-zinc-700"}`}
            style={{ height: "20px" }}
          >
            <span
              className={`absolute top-0.5 w-3.5 h-3.5 bg-white rounded-full shadow transition-transform ${current ? "translate-x-4.5" : "translate-x-0.5"}`}
              style={{ transform: current ? "translateX(18px)" : "translateX(2px)" }}
            />
          </button>
          <span className="text-sm text-zinc-400">En poste actuellement</span>
        </div>
      </div>

      {/* Description */}
      <Field label="Description *">
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={4}
          placeholder="Décrivez vos missions, réalisations, responsabilités..."
          className="input-base resize-y"
        />
      </Field>

      {/* Skills */}
      <TagInput
        value={skills}
        onChange={setSkills}
        label="Compétences"
        placeholder="React, TypeScript, Docker…"
      />

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 disabled:opacity-60 disabled:cursor-not-allowed text-zinc-950 font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
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
          {loading ? "Enregistrement…" : mode === "edit" ? "Mettre à jour" : "Créer l'expérience"}
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
          border-color: #22c55e;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
        }
        .input-base::placeholder { color: #52525b; }
        .input-base:disabled { cursor: not-allowed; }
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
