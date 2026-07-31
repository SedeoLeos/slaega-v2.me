"use client";

import { useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import Reveal from "./Reveal";
import { DISCIPLINES } from "./data";

export type SlaegaProject = {
  slug: string;
  title: string;
  desc: string;
  tags: string[];
  image: string;
  category?: string;
};
export type SlaegaService = { title: string; description: string; icon?: string };
export type SlaegaStat = { value: string; label: string };
export type SlaegaStep = { stepNumber: number; title: string; description: string };
export type SlaegaFaq = { question: string; answer: string };

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

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-reveal-item className="border-b border-white/10">
      <button
        type="button"
        data-cursor
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-space text-lg font-medium text-white md:text-xl">{q}</span>
        <span
          className={`font-space text-2xl leading-none text-[#FF5A00] transition-transform duration-300 ${
            open ? "rotate-45" : ""
          }`}
        >
          +
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="max-w-[70ch] pb-6 text-[15px] leading-relaxed text-white/55">{a}</p>
        </div>
      </div>
    </div>
  );
}

export default function SlaegaServices({
  projects,
  services,
  stats,
  steps,
  faq,
}: {
  projects: SlaegaProject[];
  services: SlaegaService[];
  stats: SlaegaStat[];
  steps: SlaegaStep[];
  faq: SlaegaFaq[];
}) {
  const tServices = useTranslations("services");
  const tProjects = useTranslations("projects");
  const tAbout = useTranslations("about");
  const tContact = useTranslations("contact");

  const expertise =
    services.length > 0
      ? services.map((s, i) => ({
          index: String(i + 1).padStart(2, "0"),
          title: s.title,
          body: s.description,
        }))
      : DISCIPLINES;

  const work = projects.slice(0, 6);

  return (
    <div className="w-full px-6 pb-32 md:px-12 lg:px-16">
      {/* ── Stats strip ─────────────────────────────────────── */}
      {stats.length > 0 && (
        <section className="pt-20">
          <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-white/10 md:grid-cols-4">
            {stats.slice(0, 4).map((s) => (
              <div key={s.label} data-reveal-item className="bg-[#0B0B0B] p-8 md:p-10">
                <div className="font-space text-4xl font-bold text-white md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-[12px] uppercase tracking-[0.18em] text-white/45">
                  {s.label}
                </div>
              </div>
            ))}
          </Reveal>
        </section>
      )}

      {/* ── Expertise ───────────────────────────────────────── */}
      <section className="pt-28">
        <SectionLabel index="[ expertise ]">{tServices("subtitle")}</SectionLabel>
        <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-white/10 md:grid-cols-2">
          {expertise.map((d) => (
            <article
              key={d.index + d.title}
              data-reveal-item
              data-cursor
              className="group relative bg-[#0B0B0B] p-8 transition-colors duration-500 hover:bg-[#111] md:p-10"
            >
              <span className="font-space text-xs text-white/30">{d.index}</span>
              <h3 className="mt-5 font-space text-2xl font-semibold text-white md:text-3xl">
                {d.title}
              </h3>
              <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-white/55">{d.body}</p>
              <span className="absolute right-8 top-8 h-2 w-2 rounded-full bg-white/10 transition-colors duration-500 group-hover:bg-[#FF5A00]" />
            </article>
          ))}
        </Reveal>
      </section>

      {/* ── Selected work ───────────────────────────────────── */}
      {work.length > 0 && (
        <section className="pt-28">
          <SectionLabel index="[ projets ]">{tProjects("subtitle")}</SectionLabel>
          <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-6">
            {work.map((p, i) => (
              <Link
                key={p.slug}
                href={`/project/${p.slug}`}
                data-reveal-item
                data-cursor
                data-cursor-label={tProjects("discover")}
                className={`group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[3px] border border-white/10 bg-[#0d0d0d] transition-all duration-500 hover:border-[#FF5A00]/50 ${
                  i % 3 === 0 ? "md:col-span-4" : "md:col-span-2"
                }`}
              >
                {p.image && (
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-45"
                    style={{ backgroundImage: `url("${p.image}")` }}
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(180deg, rgba(11,11,11,.3) 0%, rgba(11,11,11,.92) 78%)" }}
                />
                <div className="relative z-10 p-8">
                  {p.category && (
                    <span className="text-[11px] uppercase tracking-[0.2em] text-white/40">
                      {p.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-space text-2xl font-bold text-white md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-white/55 line-clamp-2">
                    {p.desc}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {p.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-[2px] border border-white/12 px-2.5 py-1 text-[11px] uppercase tracking-wide text-white/50"
                      >
                        {t}
                      </span>
                    ))}
                    <span
                      aria-hidden
                      className="ml-auto font-space text-xl text-white/20 transition-all duration-500 group-hover:translate-x-1 group-hover:text-[#FF5A00]"
                    >
                      ↗
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </Reveal>
          <Reveal className="mt-8">
            <Link
              data-reveal-item
              data-cursor
              href="/project"
              className="inline-flex items-center gap-3 font-space text-sm uppercase tracking-widest text-white/60 transition-colors hover:text-[#FF5A00]"
            >
              {tProjects("viewAll")} <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </section>
      )}

      {/* ── Process ─────────────────────────────────────────── */}
      {steps.length > 0 && (
        <section className="pt-28">
          <SectionLabel index="[ méthode ]">Ma façon de travailler</SectionLabel>
          <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-white/10 md:grid-cols-3">
            {steps.map((st) => (
              <article key={st.stepNumber} data-reveal-item className="bg-[#0B0B0B] p-8 md:p-10">
                <span className="font-space text-5xl font-bold text-white/10">
                  {String(st.stepNumber).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-space text-xl font-semibold text-white md:text-2xl">
                  {st.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-white/55">{st.description}</p>
              </article>
            ))}
          </Reveal>
        </section>
      )}

      {/* ── About ───────────────────────────────────────────── */}
      <section className="pt-28">
        <SectionLabel index="[ à propos ]">{tAbout("title")}</SectionLabel>
        <Reveal className="grid grid-cols-1 gap-10 md:grid-cols-[1.4fr_1fr]">
          <div data-reveal-item className="flex flex-col gap-6">
            <p className="text-xl leading-relaxed text-white/75 md:text-2xl">{tAbout("paragraph1")}</p>
            <p className="max-w-[62ch] text-[15px] leading-relaxed text-white/50">
              {tAbout("paragraph2")}
            </p>
          </div>
          <div data-reveal-item className="flex flex-col justify-end gap-4">
            {/* Explorer davantage — pages personnelles */}
            <div className="flex flex-col divide-y divide-white/10 border-y border-white/10">
              {[
                { href: "/moi", label: "La personne — Seba Gedeon" },
                { href: "/philosophie", label: "slaega = king sedeo leos" },
                { href: "/pensees", label: "Mes pensées & écrits" },
              ].map((l) => (
                <a
                  key={l.href}
                  data-cursor
                  href={l.href}
                  className="group flex items-center justify-between gap-3 py-4 font-space text-sm text-white/70 transition-colors hover:text-[#FF5A00]"
                >
                  {l.label}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              ))}
            </div>
            <a
              data-cursor
              href="/cv"
              className="inline-flex items-center justify-between gap-3 rounded-[2px] border border-white/15 px-6 py-4 font-space text-sm uppercase tracking-widest text-white transition-colors hover:border-[#FF5A00] hover:text-[#FF5A00]"
            >
              {tAbout("downloadResume")} <span aria-hidden>↓</span>
            </a>
            <a
              data-cursor
              href="/contact"
              className="inline-flex items-center justify-between gap-3 rounded-[2px] bg-white px-6 py-4 font-space text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors hover:bg-[#FF5A00]"
            >
              {tAbout("contactCta")} <span aria-hidden>→</span>
            </a>
          </div>
        </Reveal>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      {faq.length > 0 && (
        <section className="pt-28">
          <SectionLabel index="[ faq ]">Questions fréquentes</SectionLabel>
          <Reveal className="flex flex-col">
            {faq.map((f) => (
              <FaqRow key={f.question} q={f.question} a={f.answer} />
            ))}
          </Reveal>
        </section>
      )}

      {/* ── Contact CTA ─────────────────────────────────────── */}
      <section className="pt-32">
        <Reveal className="flex flex-col items-start gap-8 border-t border-white/10 pt-16">
          <h2
            data-reveal-item
            className="font-space text-[clamp(2.2rem,7vw,5.5rem)] font-bold leading-[0.9] tracking-tighter text-white"
          >
            {tContact("title").split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-[#FF5A00]">{tContact("title").split(" ").slice(-1)}</span>
          </h2>
          <p data-reveal-item className="max-w-[54ch] text-lg text-white/55">
            {tContact("description")}
          </p>
          <Link
            data-reveal-item
            data-cursor
            data-cursor-label="parler"
            href="/contact"
            className="inline-flex items-center gap-3 rounded-[2px] bg-white px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-[#0B0B0B] transition-colors duration-300 hover:bg-[#FF5A00]"
          >
            {tContact("form.submit")} <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
