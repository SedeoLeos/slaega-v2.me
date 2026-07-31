"use client";

import { useRef, type ElementType, type ReactNode } from "react";
import { useIsomorphicLayoutEffect } from "./useIsomorphicLayoutEffect";

/**
 * Staggered "fade-in-up" reveal, GSAP + ScrollTrigger (BeNorth style).
 * Animates its direct children (or `.reveal-item` descendants) as they
 * enter the viewport.
 */
export default function Reveal({
  as,
  children,
  className,
  stagger = 0.09,
  y = 44,
  duration = 0.9,
  start = "top 82%",
  once = true,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
  duration?: number;
  start?: string;
  once?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    let ctx: { revert: () => void } | null = null;

    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      ctx = gsap.context(() => {
        const marked = el.querySelectorAll<HTMLElement>("[data-reveal-item]");
        const targets = marked.length ? Array.from(marked) : Array.from(el.children);
        if (!targets.length) return;

        if (prefersReduced) {
          gsap.set(targets, { opacity: 1, y: 0 });
          return;
        }

        gsap.set(targets, { opacity: 0, y, willChange: "transform, opacity" });
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration,
          ease: "power3.out",
          stagger,
          scrollTrigger: { trigger: el, start, once },
        });
      }, el);
    })();

    return () => ctx?.revert();
  }, []);

  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}
