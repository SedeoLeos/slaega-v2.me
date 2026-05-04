"use client";
import { useEffect, useRef, useState } from "react";

interface DatePickerProps {
  value: string; // ISO YYYY-MM-DD
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  className?: string;
}

const MONTHS_FR = [
  "Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre",
];
const DAYS_FR = ["L", "M", "M", "J", "V", "S", "D"];

function pad(n: number) {
  return n < 10 ? `0${n}` : `${n}`;
}

function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function parseISO(s: string): Date | null {
  if (!s) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s);
  if (!m) return null;
  return new Date(parseInt(m[1]), parseInt(m[2]) - 1, parseInt(m[3]));
}

function formatDisplay(s: string): string {
  const d = parseISO(s);
  if (!d) return "";
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function DatePicker({
  value,
  onChange,
  required,
  placeholder = "JJ/MM/AAAA",
  className = "",
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<Date>(parseISO(value) ?? new Date());
  const wrapRef = useRef<HTMLDivElement>(null);

  // Close on outside click
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

  // Sync view month when value changes externally
  useEffect(() => {
    const parsed = parseISO(value);
    if (parsed) setView(parsed);
  }, [value]);

  const selected = parseISO(value);
  const today = new Date();

  // Build calendar grid: Monday-first
  const firstOfMonth = new Date(view.getFullYear(), view.getMonth(), 1);
  const lastOfMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0);
  const firstDayOffset = (firstOfMonth.getDay() + 6) % 7; // Mon=0..Sun=6
  const daysInMonth = lastOfMonth.getDate();

  // Previous month tail days
  const prevMonthLast = new Date(view.getFullYear(), view.getMonth(), 0).getDate();
  const cells: { date: Date; outside: boolean }[] = [];
  for (let i = firstDayOffset - 1; i >= 0; i--) {
    cells.push({
      date: new Date(view.getFullYear(), view.getMonth() - 1, prevMonthLast - i),
      outside: true,
    });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ date: new Date(view.getFullYear(), view.getMonth(), d), outside: false });
  }
  while (cells.length < 42) {
    const last = cells[cells.length - 1].date;
    cells.push({
      date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1),
      outside: true,
    });
  }

  const goPrevMonth = () =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() - 1, 1));
  const goNextMonth = () =>
    setView((v) => new Date(v.getFullYear(), v.getMonth() + 1, 1));
  const goPrevYear = () =>
    setView((v) => new Date(v.getFullYear() - 1, v.getMonth(), 1));
  const goNextYear = () =>
    setView((v) => new Date(v.getFullYear() + 1, v.getMonth(), 1));

  const pick = (d: Date) => {
    onChange(toISO(d));
    setOpen(false);
  };
  const setToday = () => {
    onChange(toISO(today));
    setView(today);
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
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between gap-2 bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 hover:border-zinc-600 focus:border-green-app focus:ring-2 focus:ring-green-app/20 outline-none transition-all"
      >
        <span className={value ? "text-zinc-200" : "text-zinc-500"}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </button>

      {/* Hidden native input for HTML5 form validation if required */}
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

      {/* Popover */}
      {open && (
        <div className="absolute z-50 mt-2 w-80 bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl shadow-black/50 p-3 animate-in fade-in slide-in-from-top-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goPrevYear}
                className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Année précédente"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goPrevMonth}
                className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Mois précédent"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            </div>

            <span className="text-sm font-semibold text-white capitalize">
              {MONTHS_FR[view.getMonth()]} {view.getFullYear()}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={goNextMonth}
                className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Mois suivant"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={goNextYear}
                className="w-7 h-7 flex items-center justify-center rounded-md text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                aria-label="Année suivante"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 gap-1 mb-1">
            {DAYS_FR.map((d, i) => (
              <div key={i} className="text-[10px] font-semibold text-zinc-500 text-center py-1.5 uppercase">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-1">
            {cells.map(({ date, outside }, i) => {
              const isSelected = selected ? sameDay(date, selected) : false;
              const isToday = sameDay(date, today);
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => pick(date)}
                  className={`
                    h-9 w-full rounded-lg text-sm font-medium transition-all
                    ${isSelected
                      ? "bg-green-app text-white shadow-sm shadow-green-app/30"
                      : isToday
                        ? "bg-zinc-800 text-green-app ring-1 ring-green-app/40"
                        : outside
                          ? "text-zinc-600 hover:bg-zinc-800/60 hover:text-zinc-400"
                          : "text-zinc-200 hover:bg-zinc-800"
                    }
                  `}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>

          {/* Footer actions */}
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
              onClick={setToday}
              className="text-xs font-semibold text-green-app hover:text-green-app/80 transition-colors"
            >
              Aujourd&apos;hui
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
