"use client";

/**
 * AdminShell — responsive frame for the CMS.
 *
 * Desktop (lg+): the sidebar is a static left column, exactly as before.
 * Mobile (< lg): the sidebar becomes an off-canvas drawer opened from a fixed
 * top bar (hamburger), with a dimming overlay; the main content takes the full
 * width instead of being squished beside a 256px column.
 *
 * The sidebar markup (which contains a server-action sign-out form) is rendered
 * on the server and passed in as the `sidebar` prop — this client component only
 * controls its visibility.
 */
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AdminShell({
  sidebar,
  children,
}: {
  sidebar: React.ReactNode;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  // Close the drawer whenever the route changes (a nav item was tapped).
  useEffect(() => setOpen(false), [pathname]);

  // Lock body scroll while the mobile drawer is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="flex h-full">
      {/* ── Mobile top bar (hidden on lg+) ── */}
      <header className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center gap-3 px-4 bg-zinc-900 border-b border-zinc-800/60">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Ouvrir le menu"
          aria-expanded={open}
          className="w-9 h-9 -ml-1.5 flex items-center justify-center rounded-lg text-zinc-300 hover:bg-zinc-800 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-green-app flex items-center justify-center shadow-sm shadow-green-app/30">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          <span className="text-white font-semibold text-sm leading-none">Slaega</span>
        </div>
      </header>

      {/* ── Dimming overlay (mobile, when open) ── */}
      <div
        onClick={() => setOpen(false)}
        aria-hidden="true"
        className={`lg:hidden fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* ── Sidebar: static column on lg, off-canvas drawer on mobile ── */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 flex-shrink-0 transform transition-transform duration-300 ease-out lg:transform-none ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {sidebar}
      </div>

      {/* ── Main content ── */}
      <main className="flex-1 min-w-0 overflow-auto min-h-full bg-zinc-950 pt-14 lg:pt-0">
        {children}
      </main>
    </div>
  );
}
