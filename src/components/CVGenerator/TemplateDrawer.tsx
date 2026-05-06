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

/** Duo — dark sidebar + dot skill ratings */
function PreviewDuo({ p }: { p: CVPalette }) {
  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* sidebar */}
      <div
        className="w-[38%] flex flex-col items-center pt-2 gap-[3px] px-1"
        style={{ backgroundColor: p.sidebar }}
      >
        <div
          className="w-8 h-8 rounded-full border-2 mb-[2px]"
          style={{ borderColor: p.accent, backgroundColor: p.border + "30" }}
        />
        <div
          className="h-[5px] w-12 rounded"
          style={{ backgroundColor: p.onDark }}
        />
        <div
          className="h-[3px] w-8 rounded"
          style={{ backgroundColor: p.accent }}
        />
        <div
          className="h-[0.5px] w-full my-[2px]"
          style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
        />
        <div
          className="h-[3px] w-7 rounded self-start"
          style={{ backgroundColor: p.accent + "aa" }}
        />
        {/* skill dot rows */}
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex w-full justify-between items-center px-0.5"
          >
            <div
              className="h-[2.5px] w-8 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
            />
            <div className="flex gap-[2px]">
              {[1, 2, 3].map((d) => (
                <div
                  key={d}
                  className="w-[4px] h-[4px] rounded-full"
                  style={{
                    backgroundColor:
                      d <= (i < 3 ? 3 : 2)
                        ? p.accent
                        : "rgba(255,255,255,0.15)",
                  }}
                />
              ))}
            </div>
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
                  className="h-[3.5px] w-14 rounded"
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

/** Orbit — globe header + two-column body */
function PreviewOrbit({ p }: { p: CVPalette }) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden p-2 gap-[3px]"
      style={{ backgroundColor: p.paper }}
    >
      {/* header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-[2px]">
          <div
            className="h-[7px] w-20 rounded"
            style={{ backgroundColor: p.primary }}
          />
          <div
            className="h-[3.5px] w-12 rounded"
            style={{ backgroundColor: p.accent }}
          />
          <div
            className="h-[3px] w-16 rounded"
            style={{ backgroundColor: p.border }}
          />
        </div>
        {/* Globe SVG */}
        <svg width="28" height="28" viewBox="0 0 28 28">
          <circle
            cx="14"
            cy="14"
            r="12"
            stroke={p.accent}
            strokeWidth="0.8"
            fill="none"
          />
          <circle
            cx="14"
            cy="14"
            r="7"
            stroke={p.accent}
            strokeWidth="0.5"
            fill="none"
          />
          <line
            x1="2"
            y1="14"
            x2="26"
            y2="14"
            stroke={p.accent}
            strokeWidth="0.5"
          />
          <line
            x1="14"
            y1="2"
            x2="14"
            y2="26"
            stroke={p.accent}
            strokeWidth="0.5"
          />
          <path
            d="M14,2 Q21,14 14,26 Q7,14 14,2"
            stroke={p.accent}
            strokeWidth="0.5"
            fill="none"
          />
        </svg>
      </div>
      {/* accent bar */}
      <div
        className="h-[2px] rounded-full"
        style={{ backgroundColor: p.accent }}
      />
      {/* body columns */}
      <div className="flex gap-1.5 flex-1">
        <div className="w-[28%] flex flex-col gap-[2px]">
          <div
            className="w-8 h-8 rounded-full mb-1"
            style={{ backgroundColor: p.border }}
          />
          <div
            className="h-[3px] w-7 rounded"
            style={{ backgroundColor: p.accent + "aa" }}
          />
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-[2.5px] rounded"
              style={{ backgroundColor: p.border }}
            />
          ))}
          <div
            className="h-[3px] w-7 rounded mt-1"
            style={{ backgroundColor: p.accent + "aa" }}
          />
          <div className="flex flex-wrap gap-[2px]">
            {[14, 18, 12, 16, 20, 14].map((w, i) => (
              <div
                key={i}
                className="h-[5px] rounded"
                style={{
                  width: w + "px",
                  backgroundColor: i < 2 ? p.accent : p.accentLight,
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-[3px]">
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
                <div key={i} className="flex flex-col gap-[1.5px]">
                  <div
                    className="h-[3.5px] w-14 rounded"
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
    </div>
  );
}

/** Nova — bold dark header band + sidebar below */
function PreviewNova({ p }: { p: CVPalette }) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: p.paper }}
    >
      {/* header band */}
      <div
        className="px-2 pt-2 pb-1.5 flex justify-between items-center"
        style={{ backgroundColor: p.sidebar }}
      >
        <div className="flex flex-col gap-[2px]">
          <div
            className="h-[9px] w-18 rounded font-bold"
            style={{ backgroundColor: p.onDark, width: 56 }}
          />
          <div
            className="h-[4px] w-10 rounded"
            style={{ backgroundColor: p.onDark + "aa", width: 40 }}
          />
          <div
            className="h-[3px] w-12 rounded"
            style={{ backgroundColor: p.accent, width: 36 }}
          />
        </div>
        <div
          className="w-7 h-7 rounded-full border-2"
          style={{ borderColor: p.accent, backgroundColor: p.border + "30" }}
        />
      </div>
      {/* accent strip */}
      <div className="h-[2px]" style={{ backgroundColor: p.accent }} />
      {/* body */}
      <div className="flex flex-1 overflow-hidden">
        {/* sidebar */}
        <div
          className="w-[30%] flex flex-col gap-[2px] p-1 border-r"
          style={{ borderColor: p.border, backgroundColor: p.sidebar + "14" }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[3px] rounded"
              style={{ backgroundColor: p.border }}
            />
          ))}
          <div
            className="h-[0.5px] my-1"
            style={{ backgroundColor: p.border }}
          />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-start gap-1">
              <div
                className="w-[3px] h-[3px] rounded-sm mt-0.5"
                style={{ backgroundColor: p.accent }}
              />
              <div
                className="flex-1 h-[2.5px] rounded"
                style={{ backgroundColor: p.border }}
              />
            </div>
          ))}
        </div>
        {/* main */}
        <div className="flex-1 flex flex-col p-1.5 gap-[3px]">
          {["EXP", "PROJ", "SK"].map((sec) => (
            <div key={sec} className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-1">
                <div
                  className="w-[3px] h-[7px] rounded"
                  style={{ backgroundColor: p.accent }}
                />
                <div
                  className="h-[3px] w-8 rounded"
                  style={{ backgroundColor: p.primary + "99" }}
                />
              </div>
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="flex flex-col gap-[1.5px] pl-1"
                  style={{ borderLeft: `1.5px solid ${p.border}` }}
                >
                  <div
                    className="h-[3.5px] w-14 rounded"
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
    </div>
  );
}

/** Pulse — cards arrondies + hashtags */
function PreviewPulse({ p }: { p: CVPalette }) {
  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{ backgroundColor: "#f4f5f7" }}
    >
      {/* Left */}
      <div className="w-[44%] flex flex-col p-1.5 gap-[3px]">
        <div
          className="h-[8px] w-14 rounded font-bold"
          style={{ backgroundColor: p.primary }}
        />
        <div
          className="h-[6px] w-10 rounded"
          style={{ backgroundColor: p.accent }}
        />
        {/* Card section */}
        {["EXP", "PROJ"].map((s) => (
          <div
            key={s}
            className="rounded-lg border p-1.5 flex flex-col gap-[2px] mt-[3px]"
            style={{ backgroundColor: "#fff", borderColor: "#e8eaed" }}
          >
            <div
              className="h-[3px] w-10 rounded mx-auto"
              style={{ backgroundColor: p.primary + "88" }}
            />
            <div className="flex flex-wrap gap-[2px]">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="rounded-md p-[2px] flex flex-col gap-[1px]"
                  style={{
                    width: "47%",
                    backgroundColor: i === 1 ? p.accent + "18" : "#f4f5f7",
                    border: `0.5px solid ${i === 1 ? p.accent + "40" : "#e8eaed"}`,
                  }}
                >
                  <div
                    className="h-[3px] rounded"
                    style={{ backgroundColor: i === 1 ? p.accent : p.primary }}
                  />
                  <div
                    className="h-[2px] rounded"
                    style={{ backgroundColor: "#ccc" }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Right */}
      <div className="flex-1 flex flex-col p-1.5 gap-[3px]">
        <div className="flex gap-1">
          <div
            className="h-[5px] w-12 rounded-full"
            style={{ backgroundColor: p.accent }}
          />
          <div
            className="h-[5px] w-14 rounded-full border"
            style={{ borderColor: p.accent }}
          />
        </div>
        <div
          className="rounded-lg border p-1"
          style={{ backgroundColor: "#fff", borderColor: "#e8eaed" }}
        >
          <div className="flex gap-1">
            <div
              className="w-7 h-7 rounded"
              style={{ backgroundColor: p.border }}
            />
            <div
              className="flex-1 h-[3.5px] rounded"
              style={{ backgroundColor: p.primary }}
            />
          </div>
        </div>
        <div
          className="rounded-lg border p-1"
          style={{ backgroundColor: "#fff", borderColor: "#e8eaed" }}
        >
          <div className="flex flex-wrap gap-[2px]">
            {[12, 18, 10, 16, 14, 20, 12, 16].map((w, i) => (
              <div
                key={i}
                className="h-[5px] rounded-full px-[2px]"
                style={{
                  width: w + "px",
                  backgroundColor: i < 3 ? p.accent : p.accentLight,
                  border: `0.5px solid ${p.border}`,
                }}
              />
            ))}
          </div>
        </div>
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

/** Hello — photo hero + "Hello," text + progress bars */
function PreviewHello({ p }: { p: CVPalette }) {
  return (
    <div
      className="w-full h-full flex flex-col overflow-hidden"
      style={{ backgroundColor: "#f5f5f5" }}
    >
      {/* Hero */}
      <div className="flex h-[40px]">
        <div
          className="w-[42%] relative overflow-hidden"
          style={{ backgroundColor: p.sidebar }}
        >
          <div
            className="absolute bottom-1 left-1 text-white font-black leading-none"
            style={{ fontSize: 14, opacity: 0.9, fontFamily: "sans-serif" }}
          >
            Hello,
          </div>
        </div>
        <div className="flex-1 bg-white p-1.5 flex flex-col justify-center gap-[2px]">
          <div
            className="h-[5px] w-14 rounded"
            style={{ backgroundColor: p.primary }}
          />
          <div
            className="h-[3.5px] w-10 rounded"
            style={{ backgroundColor: p.accent }}
          />
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-[2.5px] rounded"
              style={{ backgroundColor: "#ddd" }}
            />
          ))}
        </div>
      </div>
      {/* Band */}
      <div className="h-[6px]" style={{ backgroundColor: p.accent }} />
      {/* Body */}
      <div className="flex flex-1">
        <div
          className="w-[38%] bg-white border-r p-1 flex flex-col gap-[2px]"
          style={{ borderColor: "#ebebeb" }}
        >
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-1">
              <div
                className="h-[3px] w-8"
                style={{ backgroundColor: "#ddd" }}
              />
              <div
                className="flex-1 h-[3px] rounded"
                style={{
                  backgroundColor: p.accent,
                  width: `${[80, 65, 40, 25][i - 1]}%`,
                }}
              />
            </div>
          ))}
          <div className="flex flex-wrap gap-[2px] mt-1">
            {[14, 18, 12, 16].map((w, i) => (
              <div
                key={i}
                style={{
                  width: w + "px",
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: i < 2 ? p.accent : "#ddd",
                }}
              />
            ))}
          </div>
        </div>
        <div className="flex-1 p-1.5 flex flex-col gap-[3px]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col gap-[1.5px]">
              <div
                className="h-[3.5px] w-16 rounded"
                style={{ backgroundColor: p.primary }}
              />
              <div
                className="h-[2.5px] rounded"
                style={{ backgroundColor: "#ddd" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Julien — card bicolonne, header coloré, hashtags, timeline */
function PreviewJulien({ p }: { p: CVPalette }) {
  return (
    <div
      className="w-full h-full flex overflow-hidden"
      style={{ backgroundColor: "#F5F5F5" }}
    >
      {/* Gauche */}
      <div className="w-[45%] flex flex-col">
        {/* Header coloré */}
        <div
          className="px-2 pt-3 pb-2.5 flex flex-col gap-[2px]"
          style={{ backgroundColor: p.sidebar }}
        >
          <div
            className="w-7 h-7 rounded-full mb-1"
            style={{
              border: `1.5px solid ${p.accent}`,
              backgroundColor: "rgba(255,255,255,0.15)",
            }}
          />
          <div
            className="h-[3px] w-6 rounded"
            style={{ backgroundColor: p.onDark, opacity: 0.6 }}
          />
          <div
            className="h-[6px] w-14 rounded"
            style={{ backgroundColor: p.onDark }}
          />
          <div
            className="h-[5px] w-12 rounded"
            style={{ backgroundColor: p.onDark }}
          />
          <div
            className="h-[5px] w-10 rounded-full mt-1"
            style={{ backgroundColor: p.accent }}
          />
        </div>
        {/* Timeline */}
        <div
          className="p-2 flex flex-col gap-[3px]"
          style={{ backgroundColor: "#F5F5F5" }}
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex items-start gap-[3px]">
              <div
                className="w-[5px] h-[5px] rounded-full mt-[1px] flex-shrink-0"
                style={{ backgroundColor: i <= 2 ? p.accent : "#ccc" }}
              />
              <div className="flex flex-col gap-[1px] flex-1">
                <div
                  className="h-[3.5px] rounded"
                  style={{
                    width: `${60 + i * 5}%`,
                    backgroundColor: i <= 2 ? p.primary : "#bbb",
                  }}
                />
                <div
                  className="h-[2.5px] rounded"
                  style={{
                    backgroundColor: i <= 2 ? p.accent + "80" : "#ddd",
                    width: "60%",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Droite */}
      <div className="flex-1 bg-white p-1.5 flex flex-col gap-[2.5px]">
        {[14, 18, 12].map((w, i) => (
          <div
            key={i}
            className="h-[3px] rounded"
            style={{ width: w * 3 + "px", backgroundColor: "#e0e0e0" }}
          />
        ))}
        <div className="flex flex-wrap gap-[2px] mt-1">
          {[12, 16, 10, 18, 14, 12, 16, 10].map((w, i) => (
            <div
              key={i}
              className="h-[5px] rounded-full px-1"
              style={{
                width: w + "px",
                backgroundColor: i < 3 ? p.accent : "#eee",
              }}
            />
          ))}
        </div>
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-[1.5px] p-1 rounded mt-1"
            style={{
              backgroundColor: "#f5f5f5",
              borderLeft: `1.5px solid ${p.accent}`,
            }}
          >
            <div
              className="h-[3.5px] w-12 rounded"
              style={{ backgroundColor: p.primary }}
            />
            <div
              className="h-[2.5px] rounded"
              style={{ backgroundColor: "#ccc" }}
            />
          </div>
        ))}
        <div className="flex flex-col gap-[2px] mt-1">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-[2px]">
              <div
                className="w-[3px] h-[3px] rounded-full"
                style={{ backgroundColor: p.accent }}
              />
              <div
                className="h-[2.5px] flex-1 rounded"
                style={{ backgroundColor: "#ddd" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Mosaic — fixed blue mosaic tiles (no palette) */
function PreviewMosaic() {
  const BLUE_DARK = "#0a1f5e";
  const BLUE_MED = "#2855b8";
  const BLUE_PALE = "#b8cef5";
  const SHADES = [
    "#b8cef5",
    "#9ab8f0",
    "#aac5f3",
    "#7aa2eb",
    "#4a7de4",
    "#2855b8",
    "#d8e7fb",
    "#e0ecfc",
  ];
  const tiles = Array.from({ length: 40 }, (_, i) => ({
    color: SHADES[(i * 7 + (i % 3)) % SHADES.length],
    op: 0.6 + (i % 5) * 0.08,
  }));

  return (
    <div className="w-full h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex h-[42px]">
        {/* Mosaic col */}
        <div
          className="w-[38%] flex flex-wrap overflow-hidden"
          style={{ backgroundColor: BLUE_MED }}
        >
          {tiles.slice(0, 24).map((t, i) => (
            <div
              key={i}
              style={{
                width: "16.66%",
                height: "50%",
                backgroundColor: t.color,
                opacity: t.op,
              }}
            />
          ))}
        </div>
        {/* Identity col */}
        <div
          className="flex-1 flex flex-col justify-center px-2 gap-[2px]"
          style={{ backgroundColor: BLUE_DARK }}
        >
          <div
            className="h-[5px] w-14 rounded"
            style={{ backgroundColor: "#fff" }}
          />
          <div
            className="h-[3.5px] w-10 rounded"
            style={{ backgroundColor: BLUE_PALE }}
          />
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-[2.5px] rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
            />
          ))}
        </div>
      </div>
      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div
          className="w-[34%] p-1 flex flex-col gap-[2px]"
          style={{ backgroundColor: BLUE_DARK }}
        >
          <div
            className="h-[3px] w-8 rounded mb-[2px]"
            style={{ backgroundColor: BLUE_MED }}
          />
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-[3px] rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            />
          ))}
        </div>
        {/* Main */}
        <div
          className="flex-1 p-1.5 flex flex-col gap-[3px]"
          style={{ backgroundColor: "#f8faff" }}
        >
          {["EXP", "PROJ"].map((s) => (
            <div key={s} className="flex flex-col gap-[2px]">
              <div className="flex items-center gap-1">
                <div
                  className="w-[4px] h-[4px] rounded-sm"
                  style={{ backgroundColor: BLUE_MED }}
                />
                <div
                  className="h-[3px] w-8 rounded"
                  style={{ backgroundColor: BLUE_DARK + "88" }}
                />
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col gap-[1.5px]">
                  <div
                    className="h-[3.5px] w-14 rounded"
                    style={{ backgroundColor: BLUE_DARK }}
                  />
                  <div
                    className="h-[2.5px] rounded"
                    style={{ backgroundColor: "#dde8fb" }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Bright — sidebar couleur accent vive + main blanc */
function PreviewBright({ p }: { p: CVPalette }) {
  return (
    <div className="w-full h-full flex overflow-hidden">
      {/* Sidebar accent */}
      <div
        className="w-[38%] flex flex-col items-center pt-2 gap-[3px] px-1.5"
        style={{ backgroundColor: p.accent }}
      >
        <div
          className="w-8 h-8 rounded-full mb-1"
          style={{ backgroundColor: "rgba(255,255,255,0.25)" }}
        />
        <div
          className="h-[5px] w-12 rounded"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        />
        <div
          className="h-[3px] w-8 rounded"
          style={{ backgroundColor: "rgba(255,255,255,0.6)" }}
        />
        <div
          className="h-[0.5px] w-full my-[3px]"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        />
        {[1, 2, 3].map((i) => (
          <div key={i} className="w-full flex items-center gap-1">
            <div
              className="w-[3px] h-[3px] rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.8)" }}
            />
            <div
              className="h-[2.5px] flex-1 rounded"
              style={{ backgroundColor: "rgba(255,255,255,0.35)" }}
            />
          </div>
        ))}
        <div
          className="h-[0.5px] w-full my-[2px]"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        />
        <div className="flex flex-wrap gap-[2px] w-full">
          {[14, 18, 12, 16, 10, 20].map((w, i) => (
            <div
              key={i}
              className="h-[4px] rounded"
              style={{
                width: w + "px",
                backgroundColor:
                  i < 2 ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              }}
            />
          ))}
        </div>
      </div>
      {/* Main blanc */}
      <div className="flex-1 flex flex-col p-1.5 gap-[3px] bg-white">
        <div
          className="h-[3.5px] w-16 rounded"
          style={{ backgroundColor: p.accent + "88" }}
        />
        <div
          className="h-[0.5px] my-[2px]"
          style={{ backgroundColor: "#F0F0F0" }}
        />
        {["EXP", "PROJ"].map((sec) => (
          <div key={sec} className="flex flex-col gap-[2px]">
            <div className="flex items-center gap-1">
              <div
                className="w-[4px] h-[4px] rounded-full"
                style={{ backgroundColor: p.accent }}
              />
              <div
                className="h-[3px] w-8 rounded"
                style={{ backgroundColor: p.primary + "99" }}
              />
              <div
                className="flex-1 h-[0.5px]"
                style={{ backgroundColor: "#EBEBEB" }}
              />
            </div>
            {[1, 2].map((i) => (
              <div
                key={i}
                className="pl-1.5 flex flex-col gap-[1.5px]"
                style={{
                  borderLeft: `1.5px solid ${p.accent}`,
                }}
              >
                <div
                  className="h-[3.5px] w-14 rounded"
                  style={{ backgroundColor: p.primary }}
                />
                <div
                  className="h-[2.5px] rounded"
                  style={{ backgroundColor: "#E0E0E0" }}
                />
              </div>
            ))}
          </div>
        ))}
        {/* Projets 2-col */}
        <div className="flex gap-[3px] mt-[2px]">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex-1 rounded p-[3px] flex flex-col gap-[2px]"
              style={{
                backgroundColor: "#FAFAFA",
                borderTop: `1.5px solid ${p.accent}`,
              }}
            >
              <div
                className="h-[3px] w-8 rounded"
                style={{ backgroundColor: p.primary }}
              />
              <div
                className="h-[2px] rounded"
                style={{ backgroundColor: "#DDD" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const PREVIEW_MAP: Record<CVTemplateId, (p: CVPalette) => React.ReactNode> = {
  kronos: (p) => <PreviewKronos p={p} />,
  nexus: (p) => <PreviewNexus p={p} />,
  prism: (p) => <PreviewPrism p={p} />,
  duo: (p) => <PreviewDuo p={p} />,
  orbit: (p) => <PreviewOrbit p={p} />,
  nova: (p) => <PreviewNova p={p} />,
  pulse: (p) => <PreviewPulse p={p} />,
  supra: (p) => <PreviewSupra p={p} />,
  hello: (p) => <PreviewHello p={p} />,
  mosaic: (_) => <PreviewMosaic />,
  julien: (p) => <PreviewJulien p={p} />,
  bright: (p) => <PreviewBright p={p} />,
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
