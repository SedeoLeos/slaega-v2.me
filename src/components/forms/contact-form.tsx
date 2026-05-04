"use client";

import { FormEvent, useEffect, useState } from "react";
import type { ContactField } from "@/entities/contact-field";

export default function ContactForm() {
  const [fields, setFields] = useState<ContactField[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/contact-fields")
      .then((r) => r.json())
      .then((data) => setFields(Array.isArray(data) ? data : []))
      .catch(() => setFields([]))
      .finally(() => setLoading(false));
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const payload: Record<string, string> = {};
    fields.forEach((f) => {
      payload[f.name] = (formData.get(f.name) ?? "").toString();
    });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setStatus({ type: "error", text: "Impossible d'envoyer le message." });
        return;
      }
      setStatus({ type: "success", text: "Message envoyé avec succès." });
      event.currentTarget.reset();
    } catch {
      setStatus({ type: "error", text: "Erreur réseau. Réessaye plus tard." });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 flex-1 max-w-xl w-full animate-pulse">
        <div className="h-12 bg-foreground/5 rounded-xl" />
        <div className="h-12 bg-foreground/5 rounded-xl" />
        <div className="h-32 bg-foreground/5 rounded-xl" />
        <div className="h-12 w-32 bg-foreground/5 rounded-full" />
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className="flex-1 max-w-xl w-full p-6 bg-foreground/5 border border-foreground/10 rounded-xl">
        <p className="text-sm text-foreground/60">
          Le formulaire de contact n&apos;est pas encore configuré.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 flex-1 max-w-xl w-full">
      <div className="grid sm:grid-cols-2 gap-4">
        {fields
          .filter((f) => f.type !== "textarea" && f.type !== "select")
          .map((f) => (
            <FieldWrap key={f.id} field={f}>
              <input
                type={f.type}
                name={f.name}
                required={f.required}
                placeholder={f.placeholder}
                className="contact-input"
              />
            </FieldWrap>
          ))}
      </div>

      {fields
        .filter((f) => f.type === "select")
        .map((f) => (
          <FieldWrap key={f.id} field={f}>
            <select name={f.name} required={f.required} className="contact-input" defaultValue="">
              <option value="" disabled>
                {f.placeholder || "Sélectionner…"}
              </option>
              {f.options.map((o) => (
                <option key={o} value={o}>
                  {o}
                </option>
              ))}
            </select>
          </FieldWrap>
        ))}

      {fields
        .filter((f) => f.type === "textarea")
        .map((f) => (
          <FieldWrap key={f.id} field={f}>
            <textarea
              name={f.name}
              required={f.required}
              placeholder={f.placeholder}
              className="contact-input resize-none !h-40"
            />
          </FieldWrap>
        ))}

      <button
        type="submit"
        disabled={submitting}
        className="self-start inline-flex items-center gap-2 bg-foreground text-background py-3.5 px-8 rounded-full font-semibold text-sm hover:bg-foreground/80 disabled:opacity-60 transition-colors mt-2"
      >
        {submitting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Envoi…
          </>
        ) : (
          <>
            Envoyer
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                fill="currentColor"
              />
            </svg>
          </>
        )}
      </button>

      {status && (
        <p
          className={`text-sm font-medium ${
            status.type === "success" ? "text-green-app" : "text-red-500"
          }`}
        >
          {status.text}
        </p>
      )}

      <style>{`
        .contact-input {
          width: 100%;
          background: white;
          border: 1.5px solid rgba(14, 14, 14, 0.1);
          border-radius: 0.875rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          color: #0e0e0e;
          outline: none;
          font-family: inherit;
          transition: border-color 0.15s, box-shadow 0.15s;
          height: auto;
        }
        .contact-input:focus {
          border-color: #05796b;
          box-shadow: 0 0 0 3px rgba(5, 121, 107, 0.1);
        }
        .contact-input::placeholder {
          color: rgba(14, 14, 14, 0.3);
        }
      `}</style>
    </form>
  );
}

function FieldWrap({
  field,
  children,
}: {
  field: ContactField;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );
}
