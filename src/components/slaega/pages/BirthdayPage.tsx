"use client";

import { useEffect, useRef, useState } from "react";

// Confettis multicolores — visibles sur fond clair comme sombre (pas de blanc pur).
const COLORS = ["#FF5A00", "#5B8DEF", "#F5A623", "#22D3EE", "#FF3DA6", "#B6FF3C"];

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

// Tous les surnoms — l'histoire derrière slaega.
const ALIASES = [
  { code: "SL", name: "Sedeo Leos", note: "sedeo, le lion" },
  { code: "AE", name: "Arion Evans", note: "" },
  { code: "GDBA", name: "GeDeon seBA", note: "l'origine" },
];

export default function BirthdayPage() {
  const [wished, setWished] = useState(false);

  // Compteur slaega : slaega 1 → slaega 19 (né un 19).
  const [count, setCount] = useState(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setCount(19);
      return;
    }
    timer.current = setInterval(() => {
      setCount((c) => {
        if (c >= 19) {
          if (timer.current) clearInterval(timer.current);
          return 19;
        }
        return c + 1;
      });
    }, 140);
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return (
    <div className="slaega-root relative flex min-h-[80vh] w-full flex-col items-center justify-center overflow-hidden bg-background px-6 py-24 font-[var(--font-inter)] text-foreground">
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
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center text-center">
        <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/45">
          <span className="text-green-app">✦</span> slaega célèbre · 19 août 2000
        </span>
        <h1 className="mt-8 font-space text-[clamp(2.6rem,11vw,9rem)] font-bold leading-[0.82] tracking-tighter text-foreground">
          Happy
          <br />
          <span className="text-green-app">Birthday</span>
        </h1>
        <p className="mt-6 font-space text-lg font-medium tracking-tight text-foreground/85 md:text-xl">
          Seba Gedeon Matsoula Malonga
        </p>
        <p className="mt-6 max-w-[42ch] text-lg leading-relaxed text-foreground/60">
          Une année de plus à construire, à apprendre, à monter d&apos;un cran. Que la suivante
          soit encore plus grande. 🎂
        </p>

        {/* Compteur slaega 1 → 19 */}
        <div className="mt-12 flex flex-col items-center">
          <span className="text-[11px] uppercase tracking-[0.3em] text-foreground/40">
            le compte d&apos;une vie
          </span>
          <div className="mt-4 flex items-baseline gap-3 font-space">
            <span className="text-2xl font-medium lowercase text-foreground/70 md:text-3xl">slaega</span>
            <span
              key={count}
              className="birthday-tick font-space text-[clamp(3rem,14vw,7rem)] font-bold leading-none tracking-tighter text-green-app"
            >
              {count}
            </span>
          </div>
        </div>

        {/* Les surnoms */}
        <div className="mt-14 w-full">
          <p className="text-[11px] uppercase tracking-[0.3em] text-foreground/40">
            derrière le nom — tous mes surnoms
          </p>
          <div className="mt-5 grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-foreground/10 sm:grid-cols-3">
            {ALIASES.map((a) => (
              <div key={a.code} className="bg-background p-6">
                <div className="font-space text-3xl font-bold text-green-app">{a.code}</div>
                <div className="mt-2 font-space text-sm text-foreground/70">{a.name}</div>
                {a.note && <div className="mt-1 text-xs text-foreground/40">{a.note}</div>}
              </div>
            ))}
          </div>
          <p className="mt-5 text-sm text-foreground/45">
            <span className="text-foreground/70">sedeo</span>, la fusion de Seba &amp; Gedeon ·{" "}
            <span className="text-foreground/70">leos</span>, le lion
          </p>
          <p className="mt-3 font-space text-lg text-foreground/80">
            = <span className="lowercase text-foreground">slaega</span>
          </p>
        </div>

        <button
          type="button"
          data-cursor
          onClick={() => setWished(true)}
          className="mt-12 inline-flex items-center gap-3 rounded-[2px] bg-foreground px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:bg-green-app"
        >
          {wished ? "Vœu envoyé ✓" : "Faire un vœu"}
          <span aria-hidden>{wished ? "🎉" : "→"}</span>
        </button>
        {wished && (
          <p className="mt-5 font-space text-sm text-green-app">Que tous tes projets aboutissent. 🚀</p>
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
        @keyframes birthday-tick {
          0% {
            transform: translateY(0.15em) scale(0.85);
            opacity: 0;
          }
          100% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
        }
        .birthday-tick {
          animation: birthday-tick 0.18s ease-out;
        }
        @media (prefers-reduced-motion: reduce) {
          .birthday-confetti {
            display: none;
          }
          .birthday-tick {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
