"use client";

import { useEffect } from "react";

/**
 * Scopes full-page scroll-snap to the home route only. Adds `snap-home` to
 * <html> on mount and removes it on unmount, so other pages keep normal
 * scrolling. Disabled under prefers-reduced-motion.
 */
export default function SnapHome() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    const el = document.documentElement;
    el.classList.add("snap-home");
    return () => el.classList.remove("snap-home");
  }, []);
  return null;
}
