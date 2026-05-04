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

// Figma-spirit fixed widths (decreasing) — match the original portfolio template.
const STRIP_WIDTHS_PX = [380, 310, 260, 175];

export default async function Banner() {
  const [stats, about] = await Promise.all([
    statRepository.getPublished().catch(() => []),
    aboutBlockRepository.getFirstPublished().catch(() => null),
  ]);

  if (stats.length === 0 && !about) return null;

  return (
    <section className="w-full max-w-content self-center px-10 md:px-20 py-16 font-poppins">
      <div className="flex flex-col lg:flex-row gap-10 lg:gap-12 lg:items-center justify-between">
        {/* ── Stats: compact stacked strips, decreasing widths (Figma) ── */}
        {stats.length > 0 && (
          <div className="flex flex-col -space-y-1 text-white uppercase max-w-full">
            {stats.map((s, i) => {
              const w = STRIP_WIDTHS_PX[i] ?? STRIP_WIDTHS_PX[STRIP_WIDTHS_PX.length - 1];
              const bg = COLOR_BG[s.color] ?? COLOR_BG.green;
              const txt = COLOR_TXT[s.color] ?? COLOR_TXT.green;
              return (
                <div
                  key={s.id}
                  className={`${bg} ${txt} py-2 px-3 text-xs font-bold tracking-widest`}
                  style={{ width: `${w}px`, maxWidth: "100%" }}
                >
                  {s.value} {s.label}
                </div>
              );
            })}
          </div>
        )}

        {/* ── About card ── */}
        {about && (
          <div className="flex bg-white rounded-2xl overflow-hidden shadow-md border border-foreground/5 max-w-md w-full lg:w-auto lg:flex-shrink-0">
            <div className="bg-foreground w-2 flex-shrink-0" />
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
