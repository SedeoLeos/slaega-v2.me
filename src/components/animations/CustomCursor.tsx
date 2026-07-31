"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Immersive custom cursor — a small dot that follows the pointer and grows +
 * turns green (--green-app) when hovering interactive elements. Disabled on
 * touch / coarse-pointer devices, and respects prefers-reduced-motion.
 */
export default function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      const el = e.target as HTMLElement | null;
      setHovering(!!el?.closest('a, button, [role="button"], input, textarea, select, label, summary, [data-cursor="hover"]'));
    };
    window.addEventListener("mousemove", move, { passive: true });
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      data-global-cursor
      className="pointer-events-none fixed left-0 top-0 z-[9999] hidden md:block"
      style={{ x: sx, y: sy }}
    >
      <motion.span
        className="block rounded-full keep-round"
        animate={{
          width: hovering ? 40 : 10,
          height: hovering ? 40 : 10,
          backgroundColor: hovering ? "var(--green-app)" : "var(--foreground)",
          opacity: hovering ? 0.35 : 0.85,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 28 }}
        style={{ marginLeft: -5, marginTop: -5 }}
      />
    </motion.div>
  );
}
