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

// L'ADN du nom — chaque surnom devient une lettre.
const ALIASES = [
  { code: "SL", name: "Sedeo Leos", note: "le roi lion — la posture, la fierté, le calme du souverain." },
  { code: "AE", name: "Arion Evans", note: "le poète-navigateur — la créativité, le voyage, l'imaginaire." },
  { code: "GDBA", name: "Gedeon sebA", note: "l'origine — mon nom, retourné, gardé près du cœur." },
];

const BEYOND = [
  {
    t: "La musique",
    d: "Avant le code, il y a le rythme. La musique est ma première langue — elle m'apprend la structure, la tension, la résolution. Un bon système se compose comme un morceau : des couches, un tempo, un silence qui compte autant que la note.",
  },
  {
    t: "Mes inspirations",
    d: "Les bâtisseurs qui partent de rien, les artistes qui refusent la facilité, les ingénieurs qui rendent le complexe invisible. Je m'inspire de ceux qui allient la rigueur et l'âme — la précision d'un système et la sensibilité d'une œuvre.",
  },
  {
    t: "Ma vision",
    d: "Un monde où la technologie sert l'humain, pas l'inverse. Où le code que j'écris à Brazzaville tient tête à n'importe quel système du monde. Construire local, penser global, ne jamais oublier d'où l'on vient.",
  },
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
          slaega n&apos;est pas qu&apos;un nom — c&apos;est une mémoire. Celle de tous les surnoms que
          j&apos;ai portés depuis le début. Je m&apos;appelle <span className="text-white">Seba Gedeon
          Matsoula Malonga</span>, et slaega est le mot que j&apos;ai forgé pour ne jamais oublier
          qui je suis, ni d&apos;où je viens.
        </p>
      </Reveal>

      {/* L'anatomie du nom */}
      <section className="pt-24">
        <div className="mb-10 flex items-baseline gap-4 border-b border-white/10 pb-4">
          <span className="font-space text-sm text-[#FF5A00]">[ anatomie ]</span>
          <h2 className="font-space text-2xl font-semibold tracking-tight text-white md:text-3xl">
            L&apos;ADN du nom
          </h2>
        </div>
        <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-white/10 md:grid-cols-3">
          {ALIASES.map((a) => (
            <article key={a.code} data-reveal-item data-cursor className="group bg-[#0B0B0B] p-8 transition-colors duration-500 hover:bg-[#111] md:p-10">
              <span className="font-space text-5xl font-bold text-[#FF5A00]">{a.code}</span>
              <h3 className="mt-4 font-space text-xl font-semibold text-white">{a.name}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-white/55">{a.note}</p>
            </article>
          ))}
        </Reveal>

        {/* Étymologie */}
        <Reveal className="mt-10 grid grid-cols-1 gap-6 rounded-[3px] border border-white/10 bg-[#0d0d0d] p-8 md:grid-cols-[1fr_1.2fr] md:p-10">
          <div data-reveal-item className="flex flex-col justify-center">
            <p className="font-space text-4xl font-bold text-white md:text-5xl">
              <span className="text-[#FF5A00]">se</span>deo
            </p>
            <p className="mt-2 font-space text-sm uppercase tracking-widest text-white/40">
              la racine du nom
            </p>
          </div>
          <div data-reveal-item className="flex flex-col justify-center gap-3 text-[15px] leading-relaxed text-white/60">
            <p>
              <span className="font-space text-white">se</span> — les deux premières lettres de{" "}
              <span className="text-white">Seba</span>.
            </p>
            <p>
              <span className="font-space text-white">deo</span> — le cœur de{" "}
              <span className="text-white">Gedeon</span>.
            </p>
            <p className="text-white/45">
              Deux moitiés de mon nom fondues en un seul mot. slaega, c&apos;est l&apos;acronyme
              vivant de tout ce que j&apos;ai été — <span className="text-[#FF5A00]">SL · AE · GDBA</span> —
              réuni sous une même bannière.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Manifesto */}
      <Reveal className="pt-24">
        <p
          data-reveal-item
          className="max-w-[24ch] font-space text-[clamp(1.8rem,5vw,3.6rem)] font-bold leading-[1] tracking-tight text-white"
        >
          Pas seulement du <span className="text-[#FF5A00]">code</span>. Une vie, une{" "}
          <span className="text-[#FF5A00]">vision</span>.
        </p>
        <p data-reveal-item className="mt-8 max-w-[64ch] text-lg leading-relaxed text-white/55">
          slaega, c&apos;est ma philosophie autant que mon métier. Mon existant, mon avenir, ma
          passion. Un rappel constant que je ne me résume pas à des lignes de code — je suis une
          histoire, des origines, une musique intérieure et une trajectoire qui monte.
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

      {/* Au-delà du code */}
      <section className="pt-24">
        <div className="mb-10 flex items-baseline gap-4 border-b border-white/10 pb-4">
          <span className="font-space text-sm text-[#FF5A00]">[ au-delà du code ]</span>
          <h2 className="font-space text-2xl font-semibold tracking-tight text-white md:text-3xl">
            Ce qui me fait vibrer
          </h2>
        </div>
        <Reveal className="flex flex-col gap-px overflow-hidden rounded-[2px] bg-white/10">
          {BEYOND.map((b) => (
            <article key={b.t} data-reveal-item className="bg-[#0B0B0B] p-8 md:p-10">
              <h3 className="font-space text-2xl font-semibold text-white">{b.t}</h3>
              <p className="mt-3 max-w-[70ch] text-[15px] leading-relaxed text-white/55">{b.d}</p>
            </article>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <Reveal className="flex flex-col items-start gap-8 pt-28">
        <h2 data-reveal-item className="font-space text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[0.9] tracking-tighter text-white">
          On bâtit <span className="text-[#FF5A00]">ensemble ?</span>
        </h2>
        <div data-reveal-item className="flex flex-wrap gap-3">
          <Link
            data-cursor
            href="/contact"
            className="inline-flex items-center gap-3 rounded-[2px] bg-white px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors hover:bg-[#FF5A00]"
          >
            Me contacter <span aria-hidden>→</span>
          </Link>
          <Link
            data-cursor
            href="/moi"
            className="inline-flex items-center gap-3 rounded-[2px] border border-white/15 px-7 py-4 font-space text-sm uppercase tracking-widest text-white transition-colors hover:border-[#FF5A00] hover:text-[#FF5A00]"
          >
            Qui je suis <span aria-hidden>→</span>
          </Link>
          <Link
            data-cursor
            href="/birthday"
            className="inline-flex items-center gap-3 rounded-[2px] border border-white/15 px-7 py-4 font-space text-sm uppercase tracking-widest text-white transition-colors hover:border-[#FF5A00] hover:text-[#FF5A00]"
          >
            slaega 1 → 19 <span aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
