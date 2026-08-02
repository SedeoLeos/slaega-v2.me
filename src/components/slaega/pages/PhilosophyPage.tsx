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
    <div className="slaega-root w-full bg-background px-6 pb-32 pt-16 font-[var(--font-inter)] text-foreground md:px-12 lg:px-16">
      {/* Hero statement */}
      <Reveal className="flex flex-col gap-8 border-b border-foreground/10 pb-16">
        <span data-reveal-item className="text-[11px] uppercase tracking-[0.25em] text-foreground/45">
          <span className="text-green-app">✦</span> philosophie
        </span>
        <h1
          data-reveal-item
          className="font-space text-[clamp(2.6rem,10vw,8rem)] font-bold leading-[0.85] tracking-tighter text-foreground"
        >
          slaega
        </h1>
        <p data-reveal-item className="font-space text-2xl font-medium text-foreground/70 md:text-4xl">
          <span className="text-foreground/40">=</span> king <span className="text-green-app">sedeo leos</span>
        </p>
        <p data-reveal-item className="max-w-[60ch] text-lg leading-relaxed text-foreground/55">
          Derrière slaega, il y a Seba Gedeon Matsoula Malonga — et une conviction : un nom se mérite
          par ce qu&apos;on en fait. slaega, c&apos;est la synthèse d&apos;un parcours et d&apos;une
          ambition : rester fidèle à ses racines, et viser toujours plus haut.
        </p>
      </Reveal>

      {/* Le sens du nom — inspiré, pas mécanique */}
      <section className="pt-24">
        <div className="mb-10 flex items-baseline gap-4 border-b border-foreground/10 pb-4">
          <span className="font-space text-sm text-green-app">[ le sens ]</span>
          <h2 className="font-space text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Ce que porte le nom
          </h2>
        </div>
        <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-[1.3fr_1fr]">
          <p
            data-reveal-item
            className="font-space text-[clamp(1.6rem,4vw,3rem)] font-bold leading-[1.05] tracking-tight text-foreground"
          >
            Une même bannière pour tout ce que j&apos;ai été,
            <span className="text-green-app"> et tout ce que je deviens.</span>
          </p>
          <div data-reveal-item className="flex flex-col justify-center gap-4 text-[15px] leading-relaxed text-foreground/60">
            <p>
              slaega réunit les identités et les élans qui m&apos;ont construit — la posture du
              souverain, la créativité du bâtisseur, la mémoire de mes origines.
            </p>
            <p className="text-foreground/45">
              C&apos;est un nom-repère : il me rappelle d&apos;où je viens à chaque fois qu&apos;il me
              projette plus loin. Ni un pseudo, ni une marque de plus — une ligne de conduite.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Manifesto */}
      <Reveal className="pt-24">
        <p
          data-reveal-item
          className="max-w-[24ch] font-space text-[clamp(1.8rem,5vw,3.6rem)] font-bold leading-[1] tracking-tight text-foreground"
        >
          Pas seulement du <span className="text-green-app">code</span>. Une vie, une{" "}
          <span className="text-green-app">vision</span>.
        </p>
        <p data-reveal-item className="mt-8 max-w-[64ch] text-lg leading-relaxed text-foreground/55">
          Une philosophie autant qu&apos;un métier : ce que je construis doit tenir, et ce que je
          suis ne se résume pas à des lignes de code. Il y a une histoire, une musique, et une
          trajectoire qui monte.
        </p>
      </Reveal>

      {/* Pillars */}
      <section className="pt-24">
        <div className="mb-10 flex items-baseline gap-4 border-b border-foreground/10 pb-4">
          <span className="font-space text-sm text-green-app">[ piliers ]</span>
          <h2 className="font-space text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Ce qui me tient
          </h2>
        </div>
        <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-foreground/10 md:grid-cols-3">
          {PILLARS.map((p) => (
            <article key={p.k} data-reveal-item data-cursor className="group bg-background p-8 transition-colors duration-500 hover:bg-foreground/5 md:p-10">
              <span className="font-space text-5xl font-bold text-foreground/10 transition-colors group-hover:text-green-app/30">
                {p.k}
              </span>
              <h3 className="mt-4 font-space text-2xl font-semibold text-foreground">{p.t}</h3>
              <p className="mt-3 text-[14px] leading-relaxed text-foreground/55">{p.d}</p>
            </article>
          ))}
        </Reveal>
      </section>

      {/* Au-delà du code */}
      <section className="pt-24">
        <div className="mb-10 flex items-baseline gap-4 border-b border-foreground/10 pb-4">
          <span className="font-space text-sm text-green-app">[ au-delà du code ]</span>
          <h2 className="font-space text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
            Ce qui me fait vibrer
          </h2>
        </div>
        <Reveal className="flex flex-col gap-px overflow-hidden rounded-[2px] bg-foreground/10">
          {BEYOND.map((b) => (
            <article key={b.t} data-reveal-item className="bg-background p-8 md:p-10">
              <h3 className="font-space text-2xl font-semibold text-foreground">{b.t}</h3>
              <p className="mt-3 max-w-[70ch] text-[15px] leading-relaxed text-foreground/55">{b.d}</p>
            </article>
          ))}
        </Reveal>
      </section>

      {/* CTA */}
      <Reveal className="flex flex-col items-start gap-8 pt-28">
        <h2 data-reveal-item className="font-space text-[clamp(2rem,6vw,4.5rem)] font-bold leading-[0.9] tracking-tighter text-foreground">
          On bâtit <span className="text-green-app">ensemble ?</span>
        </h2>
        <div data-reveal-item className="flex flex-wrap gap-3">
          <Link
            data-cursor
            href="/contact"
            className="inline-flex items-center gap-3 rounded-[2px] bg-foreground px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:bg-green-app"
          >
            Me contacter <span aria-hidden>→</span>
          </Link>
          <Link
            data-cursor
            href="/moi"
            className="inline-flex items-center gap-3 rounded-[2px] border border-foreground/15 px-7 py-4 font-space text-sm uppercase tracking-widest text-foreground transition-colors hover:border-green-app hover:text-green-app"
          >
            Qui je suis <span aria-hidden>→</span>
          </Link>
          <Link
            data-cursor
            href="/birthday"
            className="inline-flex items-center gap-3 rounded-[2px] border border-foreground/15 px-7 py-4 font-space text-sm uppercase tracking-widest text-foreground transition-colors hover:border-green-app hover:text-green-app"
          >
            slaega 1 → 19 <span aria-hidden>→</span>
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
