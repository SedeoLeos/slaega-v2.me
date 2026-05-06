"use client";

import { useState, useRef, useEffect, useId } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  name: string;
  options: SelectOption[];
  placeholder?: string;
  defaultValue?: string;
  required?: boolean;
  onChange?: (value: string) => void;
}

export default function CustomSelect({
  name,
  options,
  placeholder = "Choisir…",
  defaultValue,
  required,
  onChange,
}: CustomSelectProps) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<SelectOption | null>(
    defaultValue
      ? (options.find((o) => o.value === defaultValue) ?? null)
      : null,
  );
  const containerRef = useRef<HTMLDivElement>(null);

  /* Close when clicking outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Keyboard navigation */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") { setOpen(false); return; }
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen((v) => !v); return; }
    if (e.key === "ArrowDown" && !open) { setOpen(true); return; }
    if (open) {
      const idx = selected ? options.findIndex((o) => o.value === selected.value) : -1;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = options[Math.min(idx + 1, options.length - 1)];
        if (next) pick(next);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = options[Math.max(idx - 1, 0)];
        if (prev) pick(prev);
      }
    }
  };

  const pick = (opt: SelectOption) => {
    setSelected(opt);
    setOpen(false);
    onChange?.(opt.value);
  };

  return (
    <div ref={containerRef} className="relative" id={id}>
      {/* Hidden native input for form submission + required validation */}
      <input
        type="hidden"
        name={name}
        value={selected?.value ?? ""}
        required={required}
      />

      {/* Trigger button */}
      <button
        type="button"
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={`${id}-list`}
        onKeyDown={handleKeyDown}
        onClick={() => setOpen((v) => !v)}
        className={`contact-input flex items-center justify-between gap-2 text-left cursor-pointer select-none ${
          selected ? "text-foreground" : "text-foreground/30"
        }`}
      >
        <span className="truncate">{selected?.label ?? placeholder}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`flex-shrink-0 text-foreground/40 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute z-50 left-0 right-0 top-[calc(100%+6px)] bg-[#f5f5ee] border border-foreground/10 rounded-xl shadow-lg shadow-foreground/8 overflow-hidden py-1"
        >
          {options.map((opt) => {
            const isActive = selected?.value === opt.value;
            return (
              <li
                key={opt.value}
                role="option"
                aria-selected={isActive}
                onClick={() => pick(opt)}
                className={`px-4 py-2.5 text-sm cursor-pointer transition-colors flex items-center justify-between gap-2
                  ${isActive
                    ? "text-green-app font-semibold bg-green-app/6"
                    : "text-foreground hover:bg-foreground/5"
                  }`}
              >
                <span>{opt.label}</span>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
