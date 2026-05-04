"use client";
import { useEffect, useRef, useState } from "react";

interface MonthPickerProps {
  value: string; // YYYY-MM
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

const MONTHS_FR = [
  "Jan", "Fév", "Mar", "Avr", "Mai", "Juin",
  "Juil", "Août", "Sep", "Oct", "Nov", "Déc",
];
const MONTHS_FULL = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function parse(s: string): { year: number; month: number } | null {
  const m = /^(\d{4})-(\d{2})/.exec(s);
  if (!m) return null;
  const year = parseInt(m[1]);
  const month = parseInt(m[2]) - 1;
  if (isNaN(year) || month < 0 || month > 11) return null;
  return { year, month };
}

function formatDisplay(s: string): string {
  const p = parse(s);
  if (!p) return "";
  return `${MONTHS_FULL[p.month]} ${p.year}`;
}

export default function MonthPicker({
  value,
  onChange,
  required,
  disabled,
  placeholder = "AAAA-MM",
  className = "",
}: MonthPickerProps) {
  const [open, setOpen] = useState(false);
  const today = new Date();
  const [viewYear, setViewYear] = useState(parse(value)?.year ?? today.getFullYear());
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handle = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  useEffect(() => {
    const p = parse(value);
    if (p) setViewYear(p.year);
  }, [value]);

  const selected = parse(value);
  const todayMonth = today.getMonth();
  const todayYear = today.getFullYear();

  const pick = (month: number) => {
    onChange(`${viewYear}-${pad(month + 1)}`);
    setOpen(false);
  };

  const setNow = () => {
    onChange(`${todayYear}-${pad(todayMonth + 1)}`);
    setViewYear(todayYear);
    setOpen(false);
  };

  const clear = () => {
    onChange("");
    setOpen(false);
  };

  return (
    <div ref={wrapRef} className={`relative ${className}`}>
      {/* Trigger */}
      <button
        type="button"
        onClick={() => !disabled && setOpen((o) => !o)}
        disabled={disabled}
        className="w-full h-10 flex items-center justify-between gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-0 text-sm text-zinc-200 hover:border-zinc-600 focus:border-green-app focus:ring-2 focus:ring-green-app/20 outline-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <span className={value ? "text-zinc-200" : "text-zinc-500"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {required && (
        <input
          type="text"
          required
          value={value}
          onChange={() => {}}
          tabIndex={-1}
          aria-hidden
          className="absolute opacity-0 pointer-events-none w-0 h-0"
        />
      )}

      {open && !disabled && (
        <div className="absolute z-50 mt-2 w-72 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl shadow-black/50 p-3 animate-in fade-in slide-in-from-top-1">
          {/* Year navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setViewYear((y) => y - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              aria-label="Année précédente"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-base font-bold text-white">{viewYear}</span>

            <button
              type="button"
              onClick={() => setViewYear((y) => y + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
              aria-label="Année suivante"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Months grid */}
          <div className="grid grid-cols-3 gap-1.5">
            {MONTHS_FR.map((m, i) => {
              const isSelected =
                selected !== null && selected.year === viewYear && selected.month === i;
              const isCurrent = viewYear === todayYear && i === todayMonth;
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(i)}
                  className={`
                    h-10 rounded-lg text-sm font-medium transition-all
                    ${isSelected
                      ? "bg-green-app text-white shadow-sm shadow-green-app/30"
                      : isCurrent
                        ? "bg-zinc-800 text-green-app ring-1 ring-green-app/40"
                        : "text-zinc-200 hover:bg-zinc-800"
                    }
                  `}
                >
                  {m}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-zinc-800">
            <button
              type="button"
              onClick={clear}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Effacer
            </button>
            <button
              type="button"
              onClick={setNow}
              className="text-xs font-semibold text-green-app hover:text-green-app/80 transition-colors"
            >
              Ce mois-ci
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
