"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  label?: string;
  rows?: number;
}

export default function MarkdownEditor({
  value,
  onChange,
  label = "Contenu (Markdown)",
  rows = 20,
}: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
      )}
      {/* Tabs */}
      <div className="flex gap-0 border border-zinc-700 rounded-lg overflow-hidden">
        <button
          type="button"
          onClick={() => setTab("write")}
          className={`px-4 py-2 text-xs font-medium transition-colors ${
            tab === "write"
              ? "bg-zinc-800 text-white"
              : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Écrire
        </button>
        <button
          type="button"
          onClick={() => setTab("preview")}
          className={`px-4 py-2 text-xs font-medium transition-colors ${
            tab === "preview"
              ? "bg-zinc-800 text-white"
              : "bg-zinc-900 text-zinc-500 hover:text-zinc-300"
          }`}
        >
          Aperçu
        </button>
      </div>

      <div className="mt-1 border border-zinc-700 rounded-b-lg rounded-tr-lg overflow-hidden">
        {tab === "write" ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            placeholder="# Titre&#10;&#10;Décrivez votre projet en Markdown..."
            className="w-full bg-zinc-900 text-sm text-zinc-200 p-4 outline-none resize-y placeholder:text-zinc-600 font-mono"
          />
        ) : (
          <div
            className="min-h-[200px] p-4 bg-zinc-900 prose prose-invert prose-sm max-w-none"
            style={{ minHeight: `${rows * 1.5}rem` }}
          >
            {value ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
            ) : (
              <p className="text-zinc-600 italic">Rien à prévisualiser…</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
