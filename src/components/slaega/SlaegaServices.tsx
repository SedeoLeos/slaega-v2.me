"use client";

import Reveal from "./Reveal";
import { DISCIPLINES, PRODUCTS, OFFERS, PACKS } from "./data";

function SectionLabel({ index, children }: { index: string; children: React.ReactNode }) {
  return (
    <div className="mb-10 flex items-baseline gap-4 border-b border-white/10 pb-4">
      <span className="font-space text-sm text-[#FF5A00]">{index}</span>
      <h2 className="font-space text-2xl font-semibold tracking-tight text-white md:text-3xl">
        {children}
      </h2>
    </div>
  );
}

export default function SlaegaServices() {
  return (
    <div className="w-full px-6 pb-32 md:px-12 lg:px-16">
      {/* ── Disciplines ─────────────────────────────────────── */}
      <section className="pt-24">
        <SectionLabel index="[ expertise ]">Ce que nous maîtrisons</SectionLabel>
        <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-white/10 md:grid-cols-2">
          {DISCIPLINES.map((d) => (
            <article
              key={d.index}
              data-reveal-item
              data-cursor
              className="group relative bg-[#0B0B0B] p-8 transition-colors duration-500 hover:bg-[#111] md:p-10"
            >
              <span className="font-space text-xs text-white/30">{d.index}</span>
              <h3 className="mt-5 font-space text-2xl font-semibold text-white md:text-3xl">
                {d.title}
              </h3>
              <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-white/55">
                {d.body}
              </p>
              <span className="absolute right-8 top-8 h-2 w-2 rounded-full bg-white/10 transition-colors duration-500 group-hover:bg-[#FF5A00]" />
            </article>
          ))}
        </Reveal>
      </section>

      {/* ── Ecosystem / Products ────────────────────────────── */}
      <section className="pt-28">
        <SectionLabel index="[ écosystème ]">Nos solutions logicielles</SectionLabel>
        <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-6">
          {PRODUCTS.map((p) => (
            <article
              key={p.id}
              data-reveal-item
              data-cursor
              data-cursor-label="voir"
              className={`group relative flex min-h-[280px] flex-col justify-between overflow-hidden rounded-[3px] border border-white/10 bg-[#0d0d0d] p-8 transition-all duration-500 hover:border-[#FF5A00]/50 hover:bg-[#111] ${
                p.size === "lg" ? "md:col-span-4" : "md:col-span-2"
              }`}
            >
              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-white/35">
                  {p.category}
                </span>
                <h3 className="mt-3 font-space text-3xl font-bold lowercase text-white md:text-4xl">
                  {p.name}
                </h3>
                <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-white/55">
                  {p.body}
                </p>
              </div>
              <div className="mt-6 flex flex-wrap items-center gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-[2px] border border-white/12 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/50"
                  >
                    {t}
                  </span>
                ))}
                <span
                  aria-hidden
                  className="ml-auto translate-x-0 font-space text-xl text-white/20 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#FF5A00]"
                >
                  ↗
                </span>
              </div>
            </article>
          ))}
        </Reveal>
      </section>

      {/* ── Offers ──────────────────────────────────────────── */}
      <section className="pt-28">
        <SectionLabel index="[ services ]">Et aussi</SectionLabel>
        <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {OFFERS.map((o) => (
            <article
              key={o.id}
              data-reveal-item
              data-cursor
              className="group rounded-[3px] border border-white/10 bg-[#0d0d0d] p-8 transition-colors duration-500 hover:bg-[#111] md:p-10"
            >
              <h3 className="font-space text-2xl font-semibold text-white md:text-[28px]">
                {o.title}
              </h3>
              <p className="mt-4 max-w-[50ch] text-[15px] leading-relaxed text-white/55">
                {o.body}
              </p>
              <span className="mt-6 inline-block font-space text-sm text-white/40 transition-colors group-hover:text-[#FF5A00]">
                en savoir plus →
              </span>
            </article>
          ))}
        </Reveal>
      </section>

      {/* ── Web Packs ───────────────────────────────────────── */}
      <section className="pt-28">
        <SectionLabel index="[ web packs ]">Sites vitrine</SectionLabel>
        <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {PACKS.map((pk) => (
            <article
              key={pk.id}
              data-reveal-item
              data-cursor
              data-cursor-label="choisir"
              className={`group relative flex flex-col rounded-[3px] border p-8 transition-all duration-500 ${
                pk.featured
                  ? "border-[#FF5A00]/60 bg-[#160c05]"
                  : "border-white/10 bg-[#0d0d0d] hover:border-white/25"
              }`}
            >
              {pk.featured && (
                <span className="absolute right-6 top-6 rounded-[2px] bg-[#FF5A00] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-widest text-[#0B0B0B]">
                  populaire
                </span>
              )}
              <span className="font-space text-sm uppercase tracking-[0.2em] text-white/45">
                {pk.name}
              </span>
              <div className="mt-4 flex items-baseline gap-1.5">
                <span className="font-space text-5xl font-bold text-white">{pk.price}</span>
                {pk.unit && <span className="text-sm text-white/40">{pk.unit}</span>}
              </div>
              <ul className="mt-8 flex flex-1 flex-col gap-3">
                {pk.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-[14px] text-white/60">
                    <span
                      className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full"
                      style={{ background: pk.featured ? "#FF5A00" : "rgba(255,255,255,.3)" }}
                    />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                data-cursor
                className={`mt-8 rounded-[2px] px-5 py-3 text-sm font-medium uppercase tracking-widest transition-colors duration-300 ${
                  pk.featured
                    ? "bg-[#FF5A00] text-[#0B0B0B] hover:bg-white"
                    : "border border-white/20 text-white hover:border-[#FF5A00] hover:text-[#FF5A00]"
                }`}
              >
                Démarrer
              </button>
            </article>
          ))}
        </Reveal>
      </section>

      {/* ── CTA footer ──────────────────────────────────────── */}
      <section className="pt-32">
        <Reveal className="flex flex-col items-start gap-8 border-t border-white/10 pt-16">
          <h2
            data-reveal-item
            className="font-space text-[clamp(2.2rem,7vw,5.5rem)] font-bold leading-[0.9] tracking-tighter text-white"
          >
            On construit <span className="text-[#FF5A00]">quoi</span> ensemble ?
          </h2>
          <a
            data-reveal-item
            data-cursor
            data-cursor-label="parler"
            href="mailto:hello@slaega.com"
            className="inline-flex items-center gap-3 rounded-[2px] bg-white px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors duration-300 hover:bg-[#FF5A00]"
          >
            Démarrer un projet <span aria-hidden>→</span>
          </a>
        </Reveal>
      </section>
    </div>
  );
}
