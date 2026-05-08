"use client";
import { useState, KeyboardEvent } from "react";

interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
  label?: string;
}

export default function TagInput({ value, onChange, placeholder = "Appuyer sur Entrée…", label }: TagInputProps) {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const remove = (tag: string) => onChange(value.filter((t) => t !== tag));

  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      add();
    } else if (e.key === "Backspace" && !input && value.length) {
      remove(value[value.length - 1]);
    }
  };

  return (
    <div>
      {label && (
        <label className="block text-xs font-medium text-zinc-400 mb-1.5">{label}</label>
      )}
      <div className="min-h-[42px] flex flex-wrap gap-1.5 items-center px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg focus-within:border-green-app focus-within:ring-1 focus-within:ring-green-app/30 transition-colors">
        {value.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 bg-zinc-800 text-zinc-300 text-xs px-2 py-0.5 rounded-md"
          >
            {tag}
            <button
              type="button"
              onClick={() => remove(tag)}
              className="text-zinc-500 hover:text-red-400 transition-colors leading-none"
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKey}
          onBlur={add}
          placeholder={value.length === 0 ? placeholder : ""}
          className="flex-1 min-w-24 bg-transparent text-sm text-zinc-200 outline-none placeholder:text-zinc-600"
        />
      </div>
    </div>
  );
}
