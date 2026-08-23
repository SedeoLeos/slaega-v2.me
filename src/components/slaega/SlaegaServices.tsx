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
    <div className="mb-10 flex items-baseline gap-4 border-b border-foreground/10 pb-4">
      <span className="font-space text-sm text-green-app">{index}</span>
      <h2 className="font-space text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {children}
      </h2>
    </div>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div data-reveal-item className="border-b border-foreground/10">
      <button
        type="button"
        data-cursor
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 py-6 text-left"
      >
        <span className="font-space text-lg font-medium text-foreground md:text-xl">{q}</span>
        <span
          className={`font-space text-2xl leading-none text-green-app transition-transform duration-300 ${
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
          <p className="max-w-[70ch] pb-6 text-[15px] leading-relaxed text-foreground/55">{a}</p>
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
          <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-foreground/10 md:grid-cols-4">
            {stats.slice(0, 4).map((s) => (
              <div key={s.label} data-reveal-item className="bg-background p-8 md:p-10">
                <div className="font-space text-4xl font-bold text-foreground md:text-5xl">
                  {s.value}
                </div>
                <div className="mt-2 text-[12px] uppercase tracking-[0.18em] text-foreground/45">
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
        <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-foreground/10 md:grid-cols-2">
          {expertise.map((d) => (
            <article
              key={d.index + d.title}
              data-reveal-item
              data-cursor
              className="group relative bg-background p-8 transition-colors duration-500 hover:bg-foreground/5 md:p-10"
            >
              <span className="font-space text-xs text-foreground/30">{d.index}</span>
              <h3 className="mt-5 font-space text-2xl font-semibold text-foreground md:text-3xl">
                {d.title}
              </h3>
              <p className="mt-4 max-w-[48ch] text-[15px] leading-relaxed text-foreground/55">{d.body}</p>
              <span className="absolute right-8 top-8 h-2 w-2 rounded-full bg-foreground/10 transition-colors duration-500 group-hover:bg-green-app" />
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
                className={`group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[3px] border border-foreground/10 bg-card transition-all duration-500 hover:border-green-app/50 ${
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
                  style={{
                    background:
                      "linear-gradient(180deg, color-mix(in srgb, var(--background) 30%, transparent) 0%, color-mix(in srgb, var(--background) 94%, transparent) 78%)",
                  }}
                />
                <div className="relative z-10 p-8">
                  {p.category && (
                    <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                      {p.category}
                    </span>
                  )}
                  <h3 className="mt-2 font-space text-2xl font-bold text-foreground md:text-3xl">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-[52ch] text-[14px] leading-relaxed text-foreground/55 line-clamp-2">
                    {p.desc}
                  </p>
                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    {p.tags.slice(0, 4).map((t) => (
                      <span
                        key={t}
                        className="rounded-[2px] border border-foreground/12 px-2.5 py-1 text-[11px] uppercase tracking-wide text-foreground/50"
                      >
                        {t}
                      </span>
                    ))}
                    <svg
                      aria-hidden
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="ml-auto h-5 w-5 text-foreground/25 transition-all duration-500 group-hover:translate-x-1 group-hover:text-green-app"
                    >
                      <path d="M7 17 17 7" />
                      <path d="M8 7h9v9" />
                    </svg>
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
              className="inline-flex items-center gap-3 font-space text-sm uppercase tracking-widest text-foreground/60 transition-colors hover:text-green-app"
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
          <Reveal className="grid grid-cols-1 gap-px overflow-hidden rounded-[2px] bg-foreground/10 md:grid-cols-3">
            {steps.map((st) => (
              <article key={st.stepNumber} data-reveal-item className="bg-background p-8 md:p-10">
                <span className="font-space text-5xl font-bold text-foreground/10">
                  {String(st.stepNumber).padStart(2, "0")}
                </span>
                <h3 className="mt-4 font-space text-xl font-semibold text-foreground md:text-2xl">
                  {st.title}
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-foreground/55">{st.description}</p>
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
            <p className="text-xl leading-relaxed text-foreground/75 md:text-2xl">{tAbout("paragraph1")}</p>
            <p className="max-w-[62ch] text-[15px] leading-relaxed text-foreground/50">
              {tAbout("paragraph2")}
            </p>
          </div>
          <div data-reveal-item className="flex flex-col justify-end gap-4">
            {/* Explorer davantage — pages personnelles */}
            <div className="flex flex-col divide-y divide-foreground/10 border-y border-foreground/10">
              {[
                { href: "/moi", label: "La personne — Seba Gedeon" },
                { href: "/philosophie", label: "slaega = king sedeo leos" },
                { href: "/pensees", label: "Mes pensées & écrits" },
              ].map((l) => (
                <a
                  key={l.href}
                  data-cursor
                  href={l.href}
                  className="group flex items-center justify-between gap-3 py-4 font-space text-sm text-foreground/70 transition-colors hover:text-green-app"
                >
                  {l.label}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </a>
              ))}
            </div>
            <a
              data-cursor
              href="/cv"
              className="inline-flex items-center justify-between gap-3 rounded-[2px] border border-foreground/15 px-6 py-4 font-space text-sm uppercase tracking-widest text-foreground transition-colors hover:border-green-app hover:text-green-app"
            >
              {tAbout("downloadResume")} <span aria-hidden>↓</span>
            </a>
            <a
              data-cursor
              href="/contact"
              className="inline-flex items-center justify-between gap-3 rounded-[2px] bg-foreground px-6 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:bg-green-app"
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
        <Reveal className="flex flex-col items-start gap-8 border-t border-foreground/10 pt-16">
          <h2
            data-reveal-item
            className="font-space text-[clamp(2.2rem,7vw,5.5rem)] font-bold leading-[0.9] tracking-tighter text-foreground"
          >
            {tContact("title").split(" ").slice(0, -1).join(" ")}{" "}
            <span className="text-green-app">{tContact("title").split(" ").slice(-1)}</span>
          </h2>
          <p data-reveal-item className="max-w-[54ch] text-lg text-foreground/55">
            {tContact("description")}
          </p>
          <Link
            data-reveal-item
            data-cursor
            data-cursor-label="parler"
            href="/contact"
            className="inline-flex items-center gap-3 rounded-[2px] bg-foreground px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors duration-300 hover:bg-green-app"
          >
            {tContact("form.submit")} <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
