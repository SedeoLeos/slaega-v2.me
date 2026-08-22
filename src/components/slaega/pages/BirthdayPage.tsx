"use client";

import { useCallback, useEffect, useRef, useState } from "react";

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

// Les remerciements de slaega — visibles sur la page.
const THANKS = [
  {
    title: "À ma maman",
    accent: "Madame Matsoula Singoula Bathilde Octavie",
    lines: [
      "Aujourd'hui, je dédie ce jour à Madame Matsoula Singoula Bathilde Octavie.",
      "Merci beaucoup, Maman. Les gens voient mes échecs et mes succès, mais ils ne connaissent pas toujours l'origine de ce que je suis devenu.",
      "J'aimerais simplement que, lorsque les gens se souviennent de moi, ils pensent aussi à toi, la femme qui a forgé ma vie.",
      "Merci pour tout, Maman.",
    ],
    sign: "❤️🕊️",
  },
  {
    title: "À vous tous ❤️",
    accent: "Ma famille, mes amis, mes proches",
    lines: [
      "Je remercie mes parents, mes frères et sœurs, mes amis, mes proches et tous ceux qui ont fait ou qui font encore partie de mon parcours.",
      "À ceux qui m'ont connu depuis le début, à ceux qui m'ont vu grandir, et à ceux qui marchent avec moi aujourd'hui : merci.",
      "Chacun de vous, à sa manière, a contribué à faire de moi la personne que je suis aujourd'hui.",
      "Merci à tous ceux qui ont été là hier, qui sont là aujourd'hui et qui continueront à faire partie de ma route.",
    ],
    sign: "❤️",
  },
];

type Wish = { id: string; name: string; message: string; createdAt: string };

export default function BirthdayPage() {
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

  // ── Vœux ──────────────────────────────────────────────────────────────────
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const loadWishes = useCallback(async () => {
    try {
      const res = await fetch("/api/birthday-wishes", { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      setWishes(Array.isArray(data.items) ? data.items : []);
    } catch {
      /* silencieux */
    }
  }, []);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  const submit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!message.trim() || state === "sending") return;
      setState("sending");
      try {
        const res = await fetch("/api/birthday-wishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: name.trim(), message: message.trim() }),
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        if (data.item) setWishes((prev) => [data.item as Wish, ...prev]);
        setName("");
        setMessage("");
        setState("sent");
        setTimeout(() => setState("idle"), 4000);
      } catch {
        setState("error");
        setTimeout(() => setState("idle"), 4000);
      }
    },
    [name, message, state],
  );

  const fmtDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
    } catch {
      return "";
    }
  };

  return (
    <div className="slaega-root relative flex min-h-[80vh] w-full flex-col items-center overflow-hidden bg-background px-6 py-24 font-[var(--font-inter)] text-foreground">
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
          <span className="text-green-app">✦</span> slaega célèbre · le 19 août
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
      </div>

      {/* ── Mes remerciements ─────────────────────────────────────────── */}
      <section className="relative z-10 mt-24 w-full max-w-3xl">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-foreground/40">
          mes remerciements
        </p>
        <div className="mt-6 flex flex-col gap-5">
          {THANKS.map((t) => (
            <article
              key={t.title}
              className="rounded-[2px] border border-foreground/10 bg-card/60 p-7 text-left md:p-9"
            >
              <h2 className="font-space text-2xl font-bold text-foreground md:text-3xl">{t.title}</h2>
              <p className="mt-1 font-space text-sm font-medium text-green-app">{t.accent}</p>
              <div className="mt-5 space-y-3">
                {t.lines.map((line, i) => (
                  <p key={i} className="leading-relaxed text-foreground/75">
                    {line}
                  </p>
                ))}
              </div>
              <p className="mt-5 text-2xl" aria-hidden>
                {t.sign}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* ── Faire un vœu ──────────────────────────────────────────────── */}
      <section className="relative z-10 mt-24 w-full max-w-3xl">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-foreground/40">
          fais-moi un vœu 🎉
        </p>
        <p className="mx-auto mt-3 max-w-[46ch] text-center text-foreground/55">
          Laisse un vœu, un mot, un remerciement — il apparaîtra sur le mur ci-dessous.
        </p>

        <form
          onSubmit={submit}
          className="mx-auto mt-8 flex w-full max-w-xl flex-col gap-3"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
            placeholder="Ton nom (ou Anonyme)"
            className="w-full rounded-[2px] border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-green-app"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
            rows={4}
            required
            placeholder="Ton vœu pour slaega…"
            className="w-full resize-y rounded-[2px] border border-foreground/15 bg-background px-4 py-3 text-foreground outline-none transition-colors placeholder:text-foreground/35 focus:border-green-app"
          />
          <div className="flex items-center gap-4">
            <button
              type="submit"
              data-cursor
              disabled={state === "sending" || !message.trim()}
              className="inline-flex items-center gap-3 rounded-[2px] bg-foreground px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:bg-green-app disabled:cursor-not-allowed disabled:opacity-50"
            >
              {state === "sending" ? "Envoi…" : state === "sent" ? "Vœu envoyé ✓" : "Envoyer mon vœu"}
              <span aria-hidden>{state === "sent" ? "🎉" : "→"}</span>
            </button>
            {state === "sent" && (
              <span className="font-space text-sm text-green-app">Merci du fond du cœur ! 🙏</span>
            )}
            {state === "error" && (
              <span className="font-space text-sm text-red-400">Oups, réessaie dans un instant.</span>
            )}
          </div>
        </form>

        {/* Mur des vœux */}
        {wishes.length > 0 && (
          <div className="mt-14">
            <p className="text-center text-[11px] uppercase tracking-[0.3em] text-foreground/40">
              le mur des vœux · {wishes.length}
            </p>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {wishes.map((w) => (
                <article
                  key={w.id}
                  className="flex flex-col rounded-[2px] border border-foreground/10 bg-card/60 p-5 text-left"
                >
                  <p className="leading-relaxed text-foreground/80">{w.message}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-space text-sm font-semibold text-green-app">— {w.name}</span>
                    <span className="text-xs text-foreground/35">{fmtDate(w.createdAt)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}
      </section>

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
