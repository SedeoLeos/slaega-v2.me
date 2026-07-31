"use client";

import Link from "next/link";
import Reveal from "../Reveal";

const PILLARS = [
  { k: "01", t: "Strength", d: "La force tranquille de qui livre. Le code tient, l'infra tient, la parole tient." },
  { k: "02", t: "Leadership", d: "Montrer la voie par l'exemple. Cadrer, décider, embarquer — puis livrer." },
  { k: "03", t: "Ambition", d: "Voir grand, commencer petit, itérer vite. Toujours viser le cran au-dessus." },
  { k: "04", t: "Endurance", d: "Les vrais systèmes se prouvent dans la durée. On construit pour tenir, pas pour briller." },
  { k: "05", t: "Growth", d: "Apprendre chaque jour un outil, un pattern, une limite de plus. Ne jamais stagner." },
  { k: "06", t: "Ascension", d: "De Brazzaville au monde. Chaque projet est une marche de plus vers le sommet." },
];

export default function PhilosophyPage() {
  return (
    <div className="slaega-root w-full bg-[#0B0B0B] px-6 pb-32 pt-16 font-[var(--font-inter)] text-white md:px-12 lg:px-16">
      {/* Hero statement */}
      <Reveal className="flex flex-col gap-8 border-b border-white/10 pb-16">
        <span data-reveal-item className="text-[11px] uppercase tracking-[0.25em] text-white/45">
          <span className="text-[#FF5A00]">✦</span> philosophie
        </span>
        <h1
          data-reveal-item
          className="font-space text-[clamp(2.6rem,10vw,8rem)] font-bold leading-[0.85] tracking-tighter text-white"
        >
          slaega
        </h1>
        <p data-reveal-item className="font-space text-2xl font-medium text-white/70 md:text-4xl">
          <span className="text-white/40">=</span> king <span className="text-[#FF5A00]">sedeo leos</span>
        </p>
        <p data-reveal-item className="max-w-[60ch] text-lg leading-relaxed text-white/55">
          slaega n&apos;est pas qu&apos;un nom — c&apos;est une posture. Celle du bâtisseur-roi :
          on conçoit, on code, on pilote, et on assume. Derrière la marque, un état d&apos;esprit —
          <span className="text-white"> king sedeo leos</span> — qui transforme les idées en systèmes
          qui tiennent.
        </p>
      </Reveal>

      {/* Manifesto */}
      <Reveal className="pt-20">
        <p
          data-reveal-item
          className="max-w-[24ch] font-space text-[clamp(1.8rem,5vw,3.6rem)] font-bold leading-[1] tracking-tight text-white"
        >
          Construire ce qui <span className="text-[#FF5A00]">dure</span>. Livrer ce qui{" "}
          <span className="text-[#FF5A00]">compte</span>.
        </p>
      </Reveal>

      {/* Pillars */}
      <section className="pt-24">
        <div className="mb-10 flex items-baseline gap-4 border-b border-white/10 pb-4">
          <span className="font-space text-sm text-[#FF5A00]">[ piliers ]</span>
          <h2 className="font-space text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Ce qui me tient
          </h2>
        </div>
        <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-white/10 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.k} data-reveal-item data-cursor className="group bg-[#0B0B0B] p-8 transition-colors duration-500 hover:bg-[#111] md:p-10">
              <span className="font-space text-5xl font-bold text-white/10 transition-colors group-hover:text-[#FF5A00]/30">
                {p.k}
              </span>
              <h3 className="mt-4 font-space text-2xl font-semibold text-white">{p.t}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/55">{p.d}</p>
            </article>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <Reveal className="flex flex-col items-start gap-8 pt-28">
        <h2 data-reveal-item className="font-space text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[0.9] tracking-tighter text-white">
          On bâtit <span className="text-[#FF5A00]">ensemble ?</span>
        </h2>
        <Link
          data-reveal-item
          data-cursor
          href="/contact"
          className="inline-flex items-center gap-3 rounded-[2px] bg-white px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors hover:bg-[#FF5A00]"
        >
          Me contacter <span aria-hidden>→</span>
        </Link>
      </Reveal>
    </div>
  );
}
