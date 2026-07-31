"use client";

import { useEffect, useRef } from "react";

/**
 * Premium magnetic cursor. A small tangerine dot that trails the pointer,
 * plus a ring that grows and inverts over interactive elements
 * ([data-cursor] or a/button). Hidden on touch devices.
 */
export default function SlaegaCursor() {
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const d = dot.current;
    const r = ring.current;
    if (!d || !r) return;

    let mx = window.innerWidth / 2;
    let my = window.innerHeight / 2;
    let rx = mx;
    let ry = my;
    let raf = 0;
    let hovering = false;
    let label = "";

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      d.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;

      const t = (e.target as HTMLElement)?.closest?.(
        "a, button, [data-cursor], input, textarea, [role='button']",
      ) as HTMLElement | null;
      const nextHover = !!t;
      const nextLabel = t?.getAttribute("data-cursor-label") ?? "";
      if (nextHover !== hovering || nextLabel !== label) {
        hovering = nextHover;
        label = nextLabel;
        r.dataset.hover = hovering ? "1" : "0";
        r.textContent = label;
      }
    };

    const loop = () => {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      r.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <>
      <div
        ref={ring}
        data-hover="0"
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden select-none items-center justify-center rounded-full text-[10px] font-medium uppercase tracking-widest transition-[width,height,background-color,color] duration-300 ease-out md:flex"
        style={{
          width: 40,
          height: 40,
          border: "1px solid rgba(255,255,255,0.4)",
          color: "#FF5A00",
        }}
      />
      <div
        ref={dot}
        className="pointer-events-none fixed left-0 top-0 z-[10000] hidden rounded-full md:block"
        style={{ width: 6, height: 6, background: "#FF5A00" }}
      />
      <style jsx global>{`
        [data-hover="1"] {
          width: 76px !important;
          height: 76px !important;
          background: #ff5a00;
          border-color: #ff5a00 !important;
          color: #0b0b0b !important;
        }
      `}</style>
    </>
  );
}
