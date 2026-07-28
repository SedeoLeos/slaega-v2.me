"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

/**
 * clipPath reveal — content is unveiled from bottom to top on scroll-in
 * (inset(100% 0 0 0) → inset(0% 0 0 0)), with a subtle scale settle. Ideal for
 * images that should "bleed" in. Respects reduced-motion via Framer defaults.
 */
export default function Reveal({
  children,
  className,
  delay = 0,
  duration = 0.9,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.div
      initial={{ clipPath: "inset(100% 0 0 0)", scale: 1.06 }}
      whileInView={{ clipPath: "inset(0% 0 0 0)", scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
