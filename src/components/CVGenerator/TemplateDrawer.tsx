"use client";

import { useEffect } from "react";
import type { CVTemplateId } from "./cv-types";
import { CV_TEMPLATES } from "./cv-types";
import type { CVPalette } from "./cv-palettes";

type Props = {
  current: CVTemplateId;
  palette: CVPalette;
  onSelect: (id: CVTemplateId) => void;
  onClose: () => void;
};

// ── Mini template preview thumbnails ─────────────────────────────────────────

/** Kronos — template de base (PDF), fond watermark bleu, monocolonne */
function PreviewKronos({ p }: { p: CVPalette }) {
  return (
    <div className="w-full h-full bg-white flex flex-col overflow-hidden relative">
      {/* Watermark fond bleu géométrique */}
      <div className="absolute inset-y-0 left-0 w-[42%] opacity-30 overflow-hidden">
        <div
          className="w-full h-full"
          style={{
            background: `repeating-linear-gradient(135deg, ${p.accent}22 0px, ${p.accent}22 8px, transparent 8px, transparent 16px)`,
          }}
        />
      </div>
      {/* Contenu */}
      <div className="relative p-2 flex flex-col gap-[2px]">
        {/* thin line + job title */}
        <div className="h-[0.5px]" style={{ backgroundColor: "#E5E7EB" }} />
        <div
          className="h-[3px] w-20 rounded self-center"
          style={{ backgroundColor: p.accent + "66" }}
        />
        <div
          className="h-[0.5px] mb-1"
          style={{ backgroundColor: "#E5E7EB" }}
        />
        {/* name + photo */}
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-[2px]">
            <div
              className="h-[7px] w-16 rounded"
              style={{ backgroundColor: p.primary }}
            />
            <div
              className="h-[7px] w-20 rounded"
              style={{ backgroundColor: p.primary }}
            />
          </div>
          <div
            className="w-7 h-7 rounded-full border-2 flex-shrink-0"
            style={{ borderColor: p.accent, backgroundColor: p.border + "40" }}
          />
        </div>
        {/* summary */}
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-[2.5px] rounded mt-[2px]"
            style={{ backgroundColor: "#e0e0e0" }}
          />
        ))}
        {/* contact */}
        <div
          className="h-[0.5px] my-1"
          style={{ backgroundColor: "#E5E7EB" }}
        />
        <div className="flex gap-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-[3px] rounded"
              style={{ backgroundColor: "#e0e0e0" }}
            />
          ))}
        </div>
        <div
          className="h-[0.5px] mt-1 mb-1"
          style={{ backgroundColor: "#E5E7EB" }}
        />
        {/* capabilities */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-1">
            <div
              className="w-[3px] h-[3px] rounded-full"
              style={{ backgroundColor: p.accent }}
            />
            <div
              className="h-[2.5px] flex-1 rounded"
              style={{ backgroundColor: "#e0e0e0" }}
            />
          </div>
        ))}
        {/* EXPÉRIENCE section title */}
        <div className="flex items-center gap-1 mt-[3px]">
          <div
            className="h-[5px] w-12 rounded"
            style={{ backgroundColor: p.accent }}
          />
          <div
            className="flex-1 h-[0.5px]"
            style={{ backgroundColor: p.accent + "80" }}
          />
        </div>
        {/* jobs with square marker */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-start gap-[3px] pl-[2px]">
            <div
              className="w-[4px] h-[4px] flex-shrink-0 mt-[1px]"
              style={{ backgroundColor: p.accent }}
            />
            <div className="flex flex-col gap-[1.5px] flex-1">
              <div
                className="h-[3.5px] w-14 rounded"
                style={{ backgroundColor: p.primary }}
              />
              <div
                className="h-[2.5px] rounded"
                style={{ backgroundColor: "#ddd" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Nexus — dark sidebar + white main */
function PreviewNexus({ p }: { p: CVPalette }) {
  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* sidebar */}
      <div
        className="w-[38%] flex flex-col items-center pt-2 gap-[3px] px-1"
        style={{ backgroundColor: p.sidebar }}
      >
        <div
          className="w-8 h-8 rounded-full mb-[2px]"
          style={{ backgroundColor: p.border + "40" }}
        />
        <div
          className="h-[5px] w-10 rounded"
          style={{ backgroundColor: p.onDark }}
        />
        <div
          className="h-[3px] w-8 rounded"
          style={{ backgroundColor: p.accent }}
        />
        <div
          className="h-[0.5px] w-full my-[3px]"
          style={{ backgroundColor: "rgba(255,255,255,0.12)" }}
        />
        {["Contact", "Skills", "Caps"].map((s) => (
          <div key={s} className="w-full flex flex-col gap-[2px]">
            <div
              className="h-[3px] w-8 rounded"
              style={{ backgroundColor: p.accent + "aa" }}
            />
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[3px] rounded"
                style={{ backgroundColor: "rgba(255,255,255,0.18)" }}
              />
            ))}
          </div>
        ))}
      </div>
      {/* main */}
      <div
        className="flex-1 flex flex-col p-1.5 gap-[3px]"
        style={{ backgroundColor: p.paper }}
      >
        {["EXP", "PROJ"].map((sec) => (
          <div key={sec} className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-1">
              <div
                className="h-[3px] w-8 rounded"
                style={{ backgroundColor: p.primary + "99" }}
              />
              <div
                className="flex-1 h-[0.5px]"
                style={{ backgroundColor: p.border }}
              />
            </div>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex flex-col gap-[1.5px] pl-1"
                style={{ borderLeft: `1.5px solid ${p.border}` }}
              >
                <div
                  className="h-[3.5px] w-16 rounded"
                  style={{ backgroundColor: p.primary }}
                />
                <div
                  className="h-[2.5px] rounded"
                  style={{ backgroundColor: p.border }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Prism — large colored header band */
function PreviewPrism({ p }: { p: CVPalette }) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: p.paper }}
    >
      {/* header band */}
      <div className="px-2 pt-2 pb-1.5" style={{ backgroundColor: p.band }}>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-[2px]">
            <div
              className="h-[7px] w-16 rounded"
              style={{ backgroundColor: p.onDark }}
            />
            <div
              className="h-[4px] w-10 rounded"
              style={{ backgroundColor: p.accent }}
            />
          </div>
          <div
            className="w-7 h-7 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.15)" }}
          />
        </div>
        {/* contact chips */}
        <div className="flex gap-1 mt-1.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="flex-1 h-[5px] rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>
      </div>
      {/* body */}
      <div className="flex-1 p-1.5 flex flex-col gap-[3px]">
        {["EXP", "SKILLS"].map((sec) => (
          <div key={sec} className="flex flex-col gap-[2px]">
            <div
              className="h-[3px] w-10 rounded"
              style={{ backgroundColor: p.accent }}
            />
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[3px] rounded"
                style={{ backgroundColor: p.border }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

/** Supra — photo pleine sidebar + main */
function PreviewSupra({ p }: { p: CVPalette }) {
  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{ backgroundColor: "#fafafa" }}
    >
      {/* Sidebar */}
      <div
        className="w-[34%] flex flex-col"
        style={{ backgroundColor: "#fff", borderRight: `1px solid #eee` }}
      >
        <div className="h-[40px]" style={{ backgroundColor: p.border }} />
        <div className="p-1.5 flex flex-col gap-[2px]">
          <div
            className="h-[5px] w-12 rounded"
            style={{ backgroundColor: p.primary }}
          />
          <div
            className="h-[4px] w-8 rounded"
            style={{ backgroundColor: p.accent }}
          />
          <div
            className="h-[0.5px] my-[3px]"
            style={{ backgroundColor: "#eee" }}
          />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="w-[5px] h-[5px] rounded"
                style={{ backgroundColor: p.accent + "30" }}
              />
              <div
                className="h-[2.5px] flex-1 rounded"
                style={{ backgroundColor: "#ddd" }}
              />
            </div>
          ))}
          <div
            className="h-[0.5px] my-[2px]"
            style={{ backgroundColor: "#eee" }}
          />
          <div className="flex flex-wrap gap-[2px]">
            {[14, 18, 12, 16, 20, 14].map((w, i) => (
              <div
                key={i}
                className="h-[4px] rounded"
                style={{
                  width: w + "px",
                  backgroundColor: i < 3 ? p.accent + "20" : "#eee",
                }}
              />
            ))}
          </div>
        </div>
      </div>
      {/* Main */}
      <div className="flex-1 p-1.5 flex flex-col gap-[3px]">
        {["EXP", "PROJ", "SK"].map((sec) => (
          <div key={sec} className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-1">
              <div
                className="w-[5px] h-[5px] rounded-full"
                style={{ backgroundColor: p.accent }}
              />
              <div
                className="h-[4px] w-10 rounded"
                style={{ backgroundColor: p.primary + "99" }}
              />
            </div>
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-1">
                <div
                  className="flex-1 h-[3px] rounded"
                  style={{ backgroundColor: "#eee" }}
                />
                <div
                  className="flex-1 h-[3px] rounded"
                  style={{ backgroundColor: "#ddd" }}
                />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}


const PREVIEW_MAP: Record<CVTemplateId, (p: CVPalette) => React.ReactNode> = {
  kronos: (p) => <PreviewKronos p={p} />,
  nexus: (p) => <PreviewNexus p={p} />,
  prism: (p) => <PreviewPrism p={p} />,
  supra: (p) => <PreviewSupra p={p} />,
};

// ── Drawer ────────────────────────────────────────────────────────────────────
export default function TemplateDrawer({
  current,
  palette,
  onSelect,
  onClose,
}: Props) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-3xl mx-auto bg-zinc-950 border border-zinc-800 rounded-t-2xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
          <div>
            <h2 className="text-sm font-semibold text-white">
              Choisir un template
            </h2>
            <p className="text-xs text-zinc-500 mt-0.5">
              La palette s'applique aux templates dynamiques · Mosaic, Ivoire et
              Verde ont des couleurs fixes
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Grid */}
        <div className="p-6 grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CV_TEMPLATES.map((tpl) => {
            const isActive = current === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onSelect(tpl.id)}
                className={`flex flex-col gap-2 group transition-all ${isActive ? "opacity-100" : "opacity-70 hover:opacity-100"}`}
              >
                {/* Preview card */}
                <div
                  className={`relative w-full rounded-xl overflow-hidden transition-all border-2 ${
                    isActive
                      ? "border-green-app shadow-lg shadow-green-app/20"
                      : "border-zinc-700 group-hover:border-zinc-500"
                  }`}
                  style={{ aspectRatio: "0.707" }} /* A4 ratio */
                >
                  {PREVIEW_MAP[tpl.id](palette)}

                  {/* Active checkmark */}
                  {isActive && (
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-green-app flex items-center justify-center shadow">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Label */}
                <div className="text-center">
                  <p
                    className={`text-xs font-semibold ${isActive ? "text-green-app" : "text-zinc-300 group-hover:text-white"} transition-colors`}
                  >
                    {tpl.label}
                  </p>
                  <p className="text-[10px] text-zinc-600 mt-0.5 truncate">
                    {tpl.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
