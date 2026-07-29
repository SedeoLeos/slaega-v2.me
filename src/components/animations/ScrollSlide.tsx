"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * "Diaporama" scroll effect — each section fades + slides IN as it enters the
 * viewport and OUT as it leaves, so scrolling feels like advancing slides.
 * Scroll-linked (useScroll/useTransform), reduced-motion safe.
 *
 * `intensity` scales the movement. Tall sections keep a long fully-visible
 * plateau in the middle so their content is never hidden while being read.
 */
export default function ScrollSlide({
  children,
  className,
  intensity = 1,
}: {
  children: ReactNode;
  className?: string;
  intensity?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const d = 60 * intensity;
  const opacity = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0, 1, 1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [d, 0, 0, -d]);
  const scale = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0.97, 1, 1, 0.97]);

  if (reduced) {
    return <div className={`w-full flex flex-col ${className ?? ""}`}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      style={{ opacity, y, scale, willChange: "transform, opacity" }}
      className={`w-full flex flex-col ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}
