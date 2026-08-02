"use client";

import { useEffect, useState } from "react";

type Mode = "light" | "dark";

/**
 * Visitor-facing light/dark switch. The initial mode is set before paint by an
 * inline script in the layout (reads localStorage → system → dark); this just
 * reflects and flips it, persisting the choice.
 */
export default function ThemeModeToggle({ className = "" }: { className?: string }) {
  const [mode, setMode] = useState<Mode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const current = (document.documentElement.getAttribute("data-theme-mode") as Mode) || "dark";
    setMode(current);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Mode = mode === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme-mode", next);
    try {
      localStorage.setItem("theme-mode", next);
    } catch {
      /* ignore */
    }
    setMode(next);
  };

  return (
    <button
      type="button"
      data-cursor
      onClick={toggle}
      aria-label={mode === "dark" ? "Passer en clair" : "Passer en sombre"}
      title={mode === "dark" ? "Mode clair" : "Mode sombre"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-[2px] border border-foreground/15 text-foreground/70 transition-colors hover:border-green-app hover:text-green-app ${className}`}
    >
      {/* Render a stable icon until mounted to avoid hydration mismatch */}
      {!mounted || mode === "dark" ? (
        // moon (currently dark → offer light)
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
        </svg>
      ) : (
        // sun (currently light → offer dark)
        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="4" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      )}
    </button>
  );
}
