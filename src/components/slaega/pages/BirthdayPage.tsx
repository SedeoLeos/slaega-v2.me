"use client";

import { useState } from "react";

const COLORS = ["#FF5A00", "#FFFFFF", "#F5A623", "#22D3EE", "#FF3DA6", "#B6FF3C"];

// Deterministic confetti (no Math.random → no hydration mismatch)
const PIECES = Array.from({ length: 60 }, (_, i) => {
  const left = (i * 37) % 100;
  const delay = ((i * 13) % 60) / 10; // 0–6s
  const dur = 4 + ((i * 7) % 40) / 10; // 4–8s
  const size = 6 + ((i * 5) % 8); // 6–14px
  const rot = (i * 47) % 360;
  const color = COLORS[i % COLORS.length];
  const round = i % 3 === 0;
  return { left, delay, dur, size, rot, color, round, i };
});

export default function BirthdayPage() {
  const [wished, setWished] = useState(false);

  return (
    <div className="slaega-root relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-[#0B0B0B] px-6 py-24 font-[var(--font-inter)] text-white">
      {/* confetti */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {PIECES.map((p) => (
          <span
            key={p.i}
            className="birthday-confetti absolute top-[-24px] block"
            style={{
              left: `${p.left}%`,
              width: p.size,
              height: p.size,
              background: p.color,
              borderRadius: p.round ? "9999px" : "1px",
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.dur}s`,
              transform: `rotate(${p.rot}deg)`,
            }}
          />
        ))}
      </div>

      {/* message */}
      <div className="relative z-10 flex flex-col items-center text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-white/45">
          <span className="text-[#FF5A00]">✦</span> slaega célèbre
        </span>
        <h1 className="mt-8 font-space text-[clamp(2.6rem,11vw,9rem)] font-bold leading-[0.82] tracking-tighter text-white">
          Happy
          <br />
          <span className="text-[#FF5A00]">Birthday</span>
        </h1>
        <p className="mt-8 max-w-[42ch] text-lg leading-relaxed text-white/60">
          Une année de plus à construire, à apprendre, à monter d&apos;un cran. Que la suivante
          soit encore plus grande. 🎂
        </p>

        <button
          type="button"
          data-cursor
          onClick={() => setWished(true)}
          className="mt-10 inline-flex items-center gap-3 rounded-[2px] bg-white px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors hover:bg-[#FF5A00]"
        >
          {wished ? "Vœu envoyé ✓" : "Faire un vœu"}
          <span aria-hidden>{wished ? "🎉" : "→"}</span>
        </button>
        {wished && (
          <p className="mt-5 font-space text-sm text-[#FF5A00]">Que tous tes projets aboutissent. 🚀</p>
        )}
      </div>

      <style jsx>{`
        @keyframes birthday-fall {
          0% {
            transform: translate3d(0, -10vh, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          100% {
            transform: translate3d(0, 100vh, 0) rotate(720deg);
            opacity: 0.9;
          }
        }
        .birthday-confetti {
          animation-name: birthday-fall;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .birthday-confetti {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
