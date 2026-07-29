"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/**
 * Custom full-screen intro loader — shown on hard page loads.
 * A massive "S" monogram (Space Grotesk) is revealed via clipPath while a thin
 * emerald progress bar fills; the overlay then lifts like a curtain to reveal
 * the page. Respects prefers-reduced-motion (short fade instead of the show).
 * Mounted once in the root layout, so it does not re-run on client navigations.
 */
export default function Loader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const isReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setReduced(isReduced);

    const duration = isReduced ? 300 : 1150;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-out cubic for a natural fill
      setProgress(Math.round((1 - Math.pow(1 - t, 3)) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else raf = requestAnimationFrame(() => setTimeout(() => setDone(true), 160) as unknown as number);
    };
    raf = requestAnimationFrame(tick);
    // lock scroll while loading
    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          key="loader"
          aria-busy="true"
          aria-label="Chargement"
          className="fixed inset-0 z-[9998] flex flex-col items-center justify-center bg-background"
          initial={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: reduced ? 0.2 : 0.7, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* Monogram — clipPath reveal bottom→top */}
          <motion.span
            className="font-display leading-none text-foreground select-none"
            style={{ fontSize: "clamp(6rem, 22vw, 16rem)" }}
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: reduced ? 0.2 : 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            S
          </motion.span>

          {/* Micro status line */}
          <span className="mt-4 font-mono text-[10px] uppercase tracking-[0.35em] text-secondary">
            {progress < 100 ? "> initializing" : "> ready"}
          </span>

          {/* Progress bar (square, emerald) */}
          <div className="mt-6 h-[2px] w-40 max-w-[60vw] bg-foreground/10 overflow-hidden">
            <div
              className="h-full bg-green-app transition-[width] duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
