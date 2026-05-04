"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact.form");
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setStatus(null);

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      subject: String(formData.get("subject") ?? ""),
      message: String(formData.get("message") ?? ""),
      // Honeypot — bots fill it, humans don't
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        setStatus({ type: "error", text: t("error") });
        return;
      }
      setStatus({ type: "success", text: t("success") });
      event.currentTarget.reset();
    } catch {
      setStatus({ type: "error", text: t("error") });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 flex-1 max-w-xl w-full">
      {/* Honeypot — visually hidden */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="absolute opacity-0 pointer-events-none w-0 h-0"
        aria-hidden="true"
      />

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
            {t("name")}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="text"
            name="name"
            required
            placeholder={t("name")}
            className="contact-input"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
            {t("email")}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="vous@exemple.com"
            className="contact-input"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
          Sujet
        </label>
        <select name="subject" className="contact-input" defaultValue="">
          <option value="" disabled>
            Choisir un sujet
          </option>
          <option value="Mission freelance">Mission freelance</option>
          <option value="Conseil technique">Conseil technique</option>
          <option value="Recrutement">Recrutement</option>
          <option value="Question générale">Question générale</option>
          <option value="Autre">Autre</option>
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-semibold text-foreground/50 uppercase tracking-wide">
          {t("message")}
          <span className="text-red-500 ml-1">*</span>
        </label>
        <textarea
          name="message"
          required
          placeholder={t("message")}
          className="contact-input resize-none !h-40"
        />
      </div>

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
            {t("submit")}
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
        select.contact-input { padding-right: 2.5rem; }
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
