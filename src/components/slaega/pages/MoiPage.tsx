"use client";

import Link from "next/link";
import Reveal from "../Reveal";

const FACTS = [
  { k: "Basé à", v: "Brazzaville, Congo" },
  { k: "Métier", v: "Ingénieur logiciel full-stack & DevOps" },
  { k: "Terrain", v: "Mobile · Web · Backend · Cloud" },
  { k: "Marque", v: "slaega — king sedeo leos" },
];

export default function MoiPage() {
  return (
    <div className="slaega-root w-full bg-[#0B0B0B] px-6 pb-32 pt-16 font-[var(--font-inter)] text-white md:px-12 lg:px-16">
      {/* Header */}
      <Reveal className="flex flex-col gap-8 border-b border-white/10 pb-16">
        <span data-reveal-item className="text-[11px] uppercase tracking-[0.25em] text-white/45">
          <span className="text-[#FF5A00]">✦</span> la personne
        </span>
        <h1
          data-reveal-item
          className="font-space text-[clamp(2.4rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tighter text-white"
        >
          Seba Gedeon
          <br />
          Matsoula
        </h1>
        <p data-reveal-item className="max-w-[58ch] text-lg leading-relaxed text-white/60">
          Avant la marque, il y a l&apos;homme. Je suis Seba Gedeon Matsoula — développeur,
          curieux insatiable, bâtisseur. Ce que tu vois sous le nom <span className="text-white">slaega</span>,
          c&apos;est mon travail. Ici, c&apos;est un peu de qui je suis.
        </p>
      </Reveal>

      {/* Facts */}
      <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-white/10 pt-0 md:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.k} data-reveal-item className="bg-[#0B0B0B] p-6 md:p-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-white/40">{f.k}</div>
            <div className="mt-2 font-space text-lg font-medium text-white">{f.v}</div>
          </div>
        ))}
      </Reveal>

      {/* Story */}
      <section className="grid grid-cols-1 gap-16 pt-24 md:grid-cols-[1.5fr_1fr]">
        <Reveal className="flex flex-col gap-8">
          <p data-reveal-item className="text-2xl leading-relaxed text-white/80 md:text-3xl">
            J&apos;ai commencé par la curiosité — comprendre comment les choses tiennent, puis
            apprendre à les construire moi-même.
          </p>
          <p data-reveal-item className="max-w-[62ch] text-[15px] leading-relaxed text-white/55">
            De Brazzaville, j&apos;ai bâti une expertise qui couvre toute la chaîne : du mobile au
            backend, du web à l&apos;infrastructure cloud. J&apos;aime les systèmes qui tiennent la
            charge, les architectures propres, et l&apos;idée qu&apos;un bon code se voit à ce
            qu&apos;il ne casse pas.
          </p>
          <p data-reveal-item className="max-w-[62ch] text-[15px] leading-relaxed text-white/55">
            Le DevOps, la sécurité et la gestion des accès sont devenus mon terrain de prédilection —
            Kubernetes, GitOps, IAM, autorisation fine. Mais au fond, ce qui me motive reste simple :
            transformer une ambition en quelque chose de réel, de solide, de livré.
          </p>
          <p data-reveal-item className="max-w-[62ch] text-[15px] leading-relaxed text-white/55">
            slaega, c&apos;est la version qui construit. Seba, c&apos;est la personne qui apprend,
            doute, recommence — et avance.
          </p>
        </Reveal>

        <Reveal className="flex flex-col justify-end gap-4">
          <div data-reveal-item className="rounded-[3px] border border-white/10 bg-[#0d0d0d] p-8">
            <p className="font-space text-lg font-medium text-white">« Construire pour durer. »</p>
            <p className="mt-2 text-[13px] text-white/45">La devise qui résume tout.</p>
          </div>
          <Link
            data-reveal-item
            data-cursor
            href="/philosophie"
            className="inline-flex items-center justify-between gap-3 rounded-[2px] border border-white/15 px-6 py-4 font-space text-sm uppercase tracking-widest text-white transition-colors hover:border-[#FF5A00] hover:text-[#FF5A00]"
          >
            Ma philosophie <span aria-hidden>→</span>
          </Link>
          <Link
            data-reveal-item
            data-cursor
            href="/contact"
            className="inline-flex items-center justify-between gap-3 rounded-[2px] bg-white px-6 py-4 font-space text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors hover:bg-[#FF5A00]"
          >
            Travaillons ensemble <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
