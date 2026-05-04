import Link from "next/link";
import {
  statRepository,
  aboutBlockRepository,
} from "@/features/banner/repositories/banner.repository";
import type { StatColor } from "@/entities/stat";

const COLOR_BG: Record<StatColor, string> = {
  green: "bg-green-app",
  rose: "bg-rose-500",
  amber: "bg-amber-400",
  dark: "bg-zinc-900",
  sky: "bg-sky-500",
};
const COLOR_TXT: Record<StatColor, string> = {
  green: "text-white",
  rose: "text-white",
  amber: "text-zinc-900",
  dark: "text-white",
  sky: "text-white",
};

// Figma-spirit decreasing widths
const STRIP_WIDTHS = ["w-full", "w-[88%]", "w-[72%]", "w-[52%]"];

export default async function Banner() {
  const [stats, about] = await Promise.all([
    statRepository.getPublished().catch(() => []),
    aboutBlockRepository.getFirstPublished().catch(() => null),
  ]);

  if (stats.length === 0 && !about) return null;

  return (
    <section className="w-full max-w-content self-center px-10 md:px-20 py-16 font-poppins">
      <div className="grid lg:grid-cols-[1fr_360px] gap-10 items-center">
        {/* ── Stats: offset colored strips (Figma spirit) ── */}
        {stats.length > 0 && (
          <div className="flex flex-col gap-1 text-white uppercase">
            {stats.map((s, i) => {
              const widthCls = STRIP_WIDTHS[i] ?? STRIP_WIDTHS[STRIP_WIDTHS.length - 1];
              const bg = COLOR_BG[s.color] ?? COLOR_BG.green;
              const txt = COLOR_TXT[s.color] ?? COLOR_TXT.green;
              return (
                <div
                  key={s.id}
                  className={`${bg} ${txt} ${widthCls} py-2.5 px-4 text-xs font-bold tracking-widest flex items-baseline gap-3`}
                >
                  <span className="text-base font-extrabold">{s.value}</span>
                  <span className="opacity-90">{s.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── About card ── */}
        {about && (
          <div className="flex bg-white rounded-2xl overflow-hidden shadow-sm border border-foreground/5">
            <div className="bg-foreground w-1.5 flex-shrink-0" />
            <div className="p-6 flex flex-col gap-3 flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-widest text-green-app">
                {about.label}
              </span>
              <p className="text-sm font-semibold leading-relaxed text-foreground">
                {about.body}
              </p>
              <Link
                href={about.ctaHref}
                className="inline-flex items-center gap-1.5 text-sm font-bold text-green-app hover:gap-2 transition-all w-fit"
              >
                {about.ctaText}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
