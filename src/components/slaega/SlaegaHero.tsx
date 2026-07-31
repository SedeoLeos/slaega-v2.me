"use client";

import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { HERO_NODES } from "./data";

/**
 * Hero — huge grotesk wordmark, massive negative space, and draggable
 * ecosystem nodes (lelo, gestpro, experh.pro, cariereH, orach) the visitor
 * can toss around. Idle float via CSS, drag via pointer events (60fps).
 */
export default function SlaegaHero() {
  const drag = useRef<{
    id: string | null;
    startX: number;
    startY: number;
    baseX: number;
    baseY: number;
  }>({ id: null, startX: 0, startY: 0, baseX: 0, baseY: 0 });

  const offsets = useRef<Record<string, { x: number; y: number }>>({});

  const onPointerDown = (e: ReactPointerEvent, id: string) => {
    const cur = offsets.current[id] ?? { x: 0, y: 0 };
    drag.current = { id, startX: e.clientX, startY: e.clientY, baseX: cur.x, baseY: cur.y };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    (e.currentTarget as HTMLElement).dataset.dragging = "1";
  };

  const onPointerMove = (e: ReactPointerEvent, id: string) => {
    if (drag.current.id !== id) return;
    const x = drag.current.baseX + (e.clientX - drag.current.startX);
    const y = drag.current.baseY + (e.clientY - drag.current.startY);
    offsets.current[id] = { x, y };
    const inner = (e.currentTarget as HTMLElement).querySelector<HTMLElement>("[data-drag-inner]");
    if (inner) inner.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };

  const onPointerUp = (e: ReactPointerEvent, id: string) => {
    if (drag.current.id === id) drag.current.id = null;
    (e.currentTarget as HTMLElement).dataset.dragging = "0";
  };

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden px-6 pb-20 pt-28 md:px-12 lg:px-16">
      {/* editorial grid lines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: "88px 88px",
        }}
      />

      {/* top meta row */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4 text-[11px] uppercase tracking-[0.25em] text-white/45">
        <span className="flex items-center gap-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: "#FF5A00" }} />
          elite IT experts
        </span>
        <span className="max-w-[40ch] text-right leading-relaxed">
          en partenariat avec <span className="text-white/80">organe des orach</span>
        </span>
      </div>

      {/* draggable ecosystem nodes */}
      <div className="pointer-events-none absolute inset-0 z-20">
        {HERO_NODES.map((n) => (
          <button
            key={n.id}
            type="button"
            data-cursor
            onPointerDown={(e) => onPointerDown(e, n.id)}
            onPointerMove={(e) => onPointerMove(e, n.id)}
            onPointerUp={(e) => onPointerUp(e, n.id)}
            onPointerCancel={(e) => onPointerUp(e, n.id)}
            className="slaega-node pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 touch-none"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <span
              data-drag-inner
              className="slaega-node-inner flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-4 py-2 backdrop-blur-sm"
              style={{ animationDelay: `${(HERO_NODES.indexOf(n) % 5) * -1.4}s` }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: "#FF5A00" }} />
              <span className="font-space text-sm font-medium lowercase text-white">{n.label}</span>
              <span className="hidden text-[10px] uppercase tracking-widest text-white/40 sm:inline">
                {n.hint}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* wordmark */}
      <div className="relative z-10 flex min-h-[62vh] flex-col justify-end">
        <h1 className="font-space font-bold leading-[0.82] tracking-tighter text-white">
          <span className="block text-[clamp(3.5rem,14vw,13rem)]">slaega</span>
        </h1>
        <div className="mt-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <p className="max-w-[34ch] text-lg leading-snug text-white/60 md:text-xl">
            L&apos;association d&apos;experts qui conçoit, code et pilote —{" "}
            <span className="text-white">DevOps, ingénierie logicielle, gestion de projet et DSI offshore.</span>
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-space text-sm uppercase tracking-[0.2em] text-white/40">
            <span>DevOps</span>
            <span className="text-[#FF5A00]">/</span>
            <span>Coding</span>
            <span className="text-[#FF5A00]">/</span>
            <span>Project Mgmt</span>
            <span className="text-[#FF5A00]">/</span>
            <span>DSI</span>
          </div>
        </div>
      </div>

      {/* scroll cue */}
      <div className="relative z-10 mt-14 flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-white/40">
        <span className="slaega-scroll inline-block h-8 w-[1px] bg-white/30" />
        défiler · glissez les nodes
      </div>
    </section>
  );
}
