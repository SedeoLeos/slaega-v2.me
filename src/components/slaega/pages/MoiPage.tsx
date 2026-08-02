"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "../Reveal";

const FACTS = [
  { k: "Basé à", v: "Brazzaville, Congo" },
  { k: "Métier", v: "Architecte logiciel — full-stack & DevOps" },
  { k: "Terrain", v: "Mobile · Web · Backend · Cloud" },
  { k: "Marque", v: "slaega — king sedeo leos" },
];

export default function MoiPage() {
  return (
    <div className="slaega-root w-full bg-background px-6 pb-32 pt-16 font-[var(--font-inter)] text-foreground md:px-12 lg:px-16">
      {/* Header */}
      <Reveal className="grid grid-cols-1 gap-10 border-b border-foreground/10 pb-16 md:grid-cols-[1.35fr_1fr] md:items-end">
        <div className="flex flex-col gap-8">
          <span data-reveal-item className="text-[11px] uppercase tracking-[0.25em] text-foreground/45">
            <span className="text-green-app">✦</span> la personne
          </span>
          <h1
            data-reveal-item
            className="font-space text-[clamp(2.4rem,8vw,6.5rem)] font-bold leading-[0.9] tracking-tighter text-foreground"
          >
            Seba Gedeon
            <br />
            Matsoula Malonga
          </h1>
          <p data-reveal-item className="max-w-[58ch] text-lg leading-relaxed text-foreground/60">
            Avant la marque, il y a l&apos;homme. Je suis Seba Gedeon Matsoula Malonga — architecte
            logiciel, curieux insatiable, bâtisseur. Ce que tu vois sous le nom <span className="text-foreground">slaega</span>,
            c&apos;est mon travail. Ici, c&apos;est un peu de qui je suis.
          </p>
        </div>

        {/* Portrait */}
        <div data-reveal-item className="relative w-full max-w-[360px] justify-self-start md:justify-self-end">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[3px] border border-foreground/10 bg-card">
            <Image
              src="/images/me.jpg"
              alt="Seba Gedeon Matsoula Malonga"
              fill
              sizes="(max-width: 768px) 90vw, 360px"
              className="object-cover object-top"
              priority
            />
            {/* voile bas pour le label — reste sombre : posé sur une photo */}
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-24"
              style={{ background: "linear-gradient(to top, rgba(10,10,10,0.85), transparent)" }}
            />
            <div className="absolute bottom-0 left-0 flex items-center gap-2 p-4">
              <span className="h-1.5 w-1.5 rounded-full bg-green-app" />
              <span className="font-space text-[11px] uppercase tracking-[0.2em] text-white/85">
                Brazzaville · 2000
              </span>
            </div>
          </div>
          {/* accent tangerine */}
          <span
            aria-hidden
            className="absolute -bottom-2 -right-2 -z-10 hidden h-full w-full rounded-[3px] border border-green-app/40 md:block"
          />
        </div>
      </Reveal>

      {/* Facts */}
      <Reveal className="grid grid-cols-2 gap-px overflow-hidden rounded-[2px] bg-foreground/10 pt-0 md:grid-cols-4">
        {FACTS.map((f) => (
          <div key={f.k} data-reveal-item className="bg-background p-6 md:p-8">
            <div className="text-[11px] uppercase tracking-[0.18em] text-foreground/40">{f.k}</div>
            <div className="mt-2 font-space text-lg font-medium text-foreground">{f.v}</div>
          </div>
        ))}
      </Reveal>

      {/* Story */}
      <section className="grid grid-cols-1 gap-16 pt-24 md:grid-cols-[1.5fr_1fr]">
        <Reveal className="flex flex-col gap-8">
          <p data-reveal-item className="text-2xl leading-relaxed text-foreground/80 md:text-3xl">
            J&apos;ai commencé par la curiosité — comprendre comment les choses tiennent, puis
            apprendre à les construire moi-même.
          </p>
          <p data-reveal-item className="max-w-[62ch] text-[15px] leading-relaxed text-foreground/55">
            De Brazzaville, j&apos;ai bâti une expertise qui couvre toute la chaîne : du mobile au
            backend, du web à l&apos;infrastructure cloud. J&apos;aime les systèmes qui tiennent la
            charge, les architectures propres, et l&apos;idée qu&apos;un bon code se voit à ce
            qu&apos;il ne casse pas.
          </p>
          <p data-reveal-item className="max-w-[62ch] text-[15px] leading-relaxed text-foreground/55">
            Le DevOps, la sécurité et la gestion des accès sont devenus mon terrain de prédilection —
            Kubernetes, GitOps, IAM, autorisation fine. Mais au fond, ce qui me motive reste simple :
            transformer une ambition en quelque chose de réel, de solide, de livré.
          </p>
          <p data-reveal-item className="max-w-[62ch] text-[15px] leading-relaxed text-foreground/55">
            slaega, c&apos;est la version qui construit. Seba, c&apos;est la personne qui apprend,
            doute, recommence — et avance.
          </p>
        </Reveal>

        <Reveal className="flex flex-col justify-end gap-4">
          <div data-reveal-item className="rounded-[3px] border border-foreground/10 bg-card p-8">
            <p className="font-space text-lg font-medium text-foreground">« Construire pour durer. »</p>
            <p className="mt-2 text-[13px] text-foreground/45">La devise qui résume tout.</p>
          </div>
          <Link
            data-reveal-item
            data-cursor
            href="/philosophie"
            className="inline-flex items-center justify-between gap-3 rounded-[2px] border border-foreground/15 px-6 py-4 font-space text-sm uppercase tracking-widest text-foreground transition-colors hover:border-green-app hover:text-green-app"
          >
            Ma philosophie <span aria-hidden>→</span>
          </Link>
          <Link
            data-reveal-item
            data-cursor
            href="/contact"
            className="inline-flex items-center justify-between gap-3 rounded-[2px] bg-foreground px-6 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:bg-green-app"
          >
            Travaillons ensemble <span aria-hidden>→</span>
          </Link>
        </Reveal>
      </section>
    </div>
  );
}
