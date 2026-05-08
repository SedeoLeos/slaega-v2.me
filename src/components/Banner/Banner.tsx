import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { StatColor } from "@/entities/stat";
import {
  aboutBlockRepository,
  statRepository,
} from "@/features/banner/repositories/banner.repository";

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
  const [stats, about, t] = await Promise.all([
    statRepository.getPublished().catch(() => []),
    aboutBlockRepository.getFirstPublished().catch(() => null),
    getTranslations("banner"),
  ]);

  if (stats.length === 0 && !about) return null;

  return (
    <section className="w-full self-center py-16 font-poppins">
      <div className="flex flex-col md:flex-row gap-10 lg:gap-12 lg:items-center justify-between">
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

        {/* ── About card — same layout, dynamic non-redundant content ── */}
        {about && (
          <div className="flex bg-white self-end overflow-hidden shadow-md border border-foreground/5 max-w-md w-full md:max-h-40 lg:flex-shrink-0">
            <div className="bg-foreground w-40 flex-shrink-0 relative overflow-hidden">
              {/* Subtle pulse dot for "available" indicator */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-app opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-app" />
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">
                  {about.label || t("statusFallback")}
                </span>
              </div>
            </div>
            <div className="p-4 flex flex-col justify-between gap-2 flex-1 min-w-0">
              <p className="text-sm font-semibold leading-relaxed text-foreground line-clamp-3">
                {about.body}
              </p>
              {about.ctaText && about.ctaHref && (
                <Link
                  href={about.ctaHref}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-green-app hover:gap-2 transition-all w-fit"
                >
                  {about.ctaText}
                  <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M9.53 2.22L9 1.69 7.94 2.75l.53.53 3.97 3.97H1.75H1V8.75h.75h10.69L8.47 12.72l-.53.53L9 14.31l.53-.53 5.07-5.07a1 1 0 000-1.41L9.53 2.22z"
                      fill="currentColor"
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
