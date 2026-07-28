"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView } from "framer-motion";

/**
 * Counts up the numeric part of a stat value when it scrolls into view, while
 * preserving any prefix/suffix (e.g. "2B+", "+50", "100%"). Also scales in
 * (0.8 → 1). Respects prefers-reduced-motion. Value stays exact — only the
 * numeric run animates.
 */
export default function AnimatedCounter({
  value,
  className,
  duration = 1.4,
}: {
  value: string;
  className?: string;
  duration?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const match = value.match(/^(\D*)(\d[\d\s.,]*)(.*)$/);
  const prefix = match?.[1] ?? "";
  const rawNum = match?.[2] ?? "";
  const suffix = match?.[3] ?? "";
  const target = rawNum ? parseFloat(rawNum.replace(/[\s,]/g, "")) : NaN;
  const decimals = rawNum.includes(".") ? (rawNum.split(".")[1]?.length ?? 0) : 0;

  const [display, setDisplay] = useState(Number.isNaN(target) ? value : `${prefix}0${suffix}`);

  useEffect(() => {
    if (Number.isNaN(target)) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!inView) return;
    if (reduced) {
      setDisplay(value);
      return;
    }
    const controls = animate(0, target, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(`${prefix}${v.toFixed(decimals)}${suffix}`),
      onComplete: () => setDisplay(value),
    });
    return () => controls.stop();
  }, [inView, target, decimals, duration, prefix, suffix, value]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
