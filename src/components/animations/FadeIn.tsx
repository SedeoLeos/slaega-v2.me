'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  y?: number;
};

export default function FadeIn({ children, delay = 0, duration = 0.6, className, y = 24 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      // w-full + contents-like behavior so children keep their own layout
      className={`w-full flex flex-col ${className ?? ''}`}
    >
      {children}
    </motion.div>
  );
}
