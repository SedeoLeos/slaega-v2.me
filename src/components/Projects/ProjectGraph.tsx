"use client";

import { useState, useRef, useCallback, useMemo } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type NodeType = "title" | "category" | "tag";

type NodeData = {
  id: string;
  label: string;
  type: NodeType;
  x: number; // 0–100 (% of container)
  y: number;
};

type EdgeData = { from: string; to: string };

type DragState = {
  id: string;
  startClientX: number;
  startClientY: number;
  origX: number;
  origY: number;
};

// ─── Graph builder ────────────────────────────────────────────────────────────

function trunc(s: string, max: number) {
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function buildGraph(
  title: string,
  categories: string[],
  tags: string[],
): { nodes: NodeData[]; edges: EdgeData[] } {
  const nodes: NodeData[] = [];
  const edges: EdgeData[] = [];

  /* ── Title (center) ── */
  nodes.push({ id: "root", label: trunc(title, 18), type: "title", x: 50, y: 50 });

  /* ── Categories — inner ring ── */
  const cats = categories.slice(0, 5);
  cats.forEach((cat, i) => {
    const angle = (i / Math.max(cats.length, 1)) * 2 * Math.PI - Math.PI / 2;
    const r = cats.length <= 1 ? 24 : 26;
    const id = `cat-${i}`;
    nodes.push({
      id,
      label: trunc(cat, 14),
      type: "category",
      x: clamp(50 + r * Math.cos(angle), 8, 92),
      y: clamp(50 + r * Math.sin(angle), 8, 92),
    });
    edges.push({ from: "root", to: id });
  });

  /* ── Tags — outer ring ── */
  const tgs = tags.slice(0, 9);
  tgs.forEach((tag, i) => {
    const angle = (i / Math.max(tgs.length, 1)) * 2 * Math.PI - Math.PI / 8;
    const r = cats.length > 0 ? 44 : 30;
    const id = `tag-${i}`;
    nodes.push({
      id,
      label: trunc(tag, 12),
      type: "tag",
      x: clamp(50 + r * Math.cos(angle), 4, 96),
      y: clamp(50 + r * Math.sin(angle), 4, 96),
    });
    /* connect to nearest category if any, otherwise to root */
    const parentId =
      cats.length > 0
        ? `cat-${Math.floor((i / tgs.length) * cats.length)}`
        : "root";
    edges.push({ from: parentId, to: id });
  });

  return { nodes, edges };
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
  title: string;
  tags?: string[];
  categories?: string[];
  /** Compact mode for small cards */
  compact?: boolean;
};

export default function ProjectGraph({
  title,
  tags = [],
  categories = [],
  compact = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const dragging = useRef<DragState | null>(null);

  /* Build the static graph structure once */
  const { nodes: initialNodes, edges } = useMemo(
    () => buildGraph(title, categories, tags),
    [title, categories, tags],
  );

  /* Store only positions in state — avoids rebuilding labels on every drag */
  const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>(
    () =>
      Object.fromEntries(initialNodes.map((n) => [n.id, { x: n.x, y: n.y }])),
  );

  /* Merge initial node data with live positions */
  const nodes = useMemo(
    () => initialNodes.map((n) => ({ ...n, ...(positions[n.id] ?? {}) })),
    [initialNodes, positions],
  );

  const nodeMap = useMemo(
    () => Object.fromEntries(nodes.map((n) => [n.id, n])),
    [nodes],
  );

  /* ── Drag handlers (per node, with pointer capture) ── */

  const makeHandlers = useCallback(
    (nodeId: string, nodeX: number, nodeY: number) => ({
      onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
        e.stopPropagation();
        e.preventDefault();
        e.currentTarget.setPointerCapture(e.pointerId);
        dragging.current = {
          id: nodeId,
          startClientX: e.clientX,
          startClientY: e.clientY,
          origX: nodeX,
          origY: nodeY,
        };
      },
      onPointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const d = dragging.current;
        if (!d || d.id !== nodeId || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const dx = ((e.clientX - d.startClientX) / rect.width) * 100;
        const dy = ((e.clientY - d.startClientY) / rect.height) * 100;
        setPositions((prev) => ({
          ...prev,
          [nodeId]: {
            x: clamp(d.origX + dx, 4, 96),
            y: clamp(d.origY + dy, 4, 96),
          },
        }));
      },
      onPointerUp() {
        dragging.current = null;
      },
    }),
    [],
  );

  /* ── Node styles ── */
  const nodeClass = (type: NodeType, compact: boolean) => {
    const base = "absolute select-none touch-none cursor-grab active:cursor-grabbing z-10 whitespace-nowrap";
    if (type === "title")
      return `${base} rounded-xl border font-extrabold bg-foreground/10 border-foreground/25 text-foreground ${compact ? "px-2.5 py-1 text-[9px]" : "px-3 py-1.5 text-[11px]"}`;
    if (type === "category")
      return `${base} rounded-full border font-bold uppercase tracking-widest bg-green-app/15 border-green-app/35 text-green-app ${compact ? "px-2 py-[2px] text-[7px]" : "px-2.5 py-1 text-[8.5px]"}`;
    /* tag */
    return `${base} rounded-full border font-medium bg-foreground/[0.06] border-foreground/[0.1] text-foreground/45 ${compact ? "px-1.5 py-[1px] text-[6.5px]" : "px-2 py-[3px] text-[8px]"}`;
  };

  return (
    <div
      ref={containerRef}
      className="w-full h-full relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, var(--card) 0%, color-mix(in srgb, var(--card) 72%, var(--green-app)) 100%)",
      }}
    >
      {/* ── Dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, color-mix(in srgb, var(--foreground) 9%, transparent) 1px, transparent 1px)",
          backgroundSize: compact ? "16px 16px" : "22px 22px",
        }}
      />

      {/* ── Soft center glow ── */}
      <div
        className="absolute pointer-events-none rounded-full"
        style={{
          width: compact ? 80 : 140,
          height: compact ? 80 : 140,
          top: "35%",
          left: "35%",
          background: "radial-gradient(circle, var(--green-app), transparent 70%)",
          opacity: 0.07,
          filter: `blur(${compact ? 20 : 32}px)`,
        }}
      />

      {/* ── SVG edges ── */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ overflow: "visible" }}
      >
        <defs>
          <marker
            id="arrow"
            markerWidth="5"
            markerHeight="5"
            refX="3"
            refY="2.5"
            orient="auto"
          >
            <path
              d="M0,0 L0,5 L5,2.5 z"
              style={{ fill: "var(--green-app)", opacity: 0.35 }}
            />
          </marker>
        </defs>

        {edges.map(({ from, to }) => {
          const f = nodeMap[from];
          const t = nodeMap[to];
          if (!f || !t) return null;
          return (
            <line
              key={`${from}→${to}`}
              x1={`${f.x}%`}
              y1={`${f.y}%`}
              x2={`${t.x}%`}
              y2={`${t.y}%`}
              markerEnd="url(#arrow)"
              style={{
                stroke: "var(--green-app)",
                strokeOpacity: 0.22,
                strokeWidth: 1,
                strokeDasharray: "4 3",
              }}
            />
          );
        })}

        {/* Small dot at each node centre (behind the div node) */}
        {nodes.map((n) => (
          <circle
            key={`dot-${n.id}`}
            cx={`${n.x}%`}
            cy={`${n.y}%`}
            r={compact ? 2 : 3}
            style={{
              fill: n.type === "title" ? "var(--foreground)" : "var(--green-app)",
              opacity: n.type === "tag" ? 0.15 : 0.25,
            }}
          />
        ))}
      </svg>

      {/* ── Draggable nodes ── */}
      {nodes.map((node) => {
        const handlers = makeHandlers(node.id, node.x, node.y);
        return (
          <div
            key={node.id}
            className={nodeClass(node.type, compact)}
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            {...handlers}
          >
            {node.label}
          </div>
        );
      })}

      {/* ── Drag hint ── */}
      <span
        className="absolute bottom-2 right-2.5 pointer-events-none font-medium text-foreground/20"
        style={{ fontSize: compact ? 6 : 8 }}
      >
        drag
      </span>
    </div>
  );
}
