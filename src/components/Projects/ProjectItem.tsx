"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";

type ProjectItemProps = {
  src: string;
  title: string;
  desc: string;
  slug: string;
  date?: string;
  categories?: string[];
};

export default function ProjectItem({
  src,
  title,
  desc,
  slug,
  date,
  categories,
}: ProjectItemProps) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const cleanDesc = desc?.replace(/<[^>]*>/g, "") ?? "";
  const readTime = Math.max(1, Math.ceil(cleanDesc.length / 200));
  const formattedDate = date
    ? new Intl.DateTimeFormat(locale === "en" ? "en-US" : "fr-FR", {
        month: "short",
        year: "numeric",
      }).format(new Date(date.includes("-") ? date : `${date}-01-01`))
    : null;

  const primaryCategory = categories?.[0];
  const extraCategories = categories?.slice(1, 3) ?? [];

  return (
    <Link
      href={`/project/${slug}`}
      className="group relative flex flex-col bg-card rounded-xl overflow-hidden border border-foreground/[0.06] hover:border-foreground/10 hover:shadow-xl hover:shadow-foreground/[0.08] hover:-translate-y-0.5 transition-all duration-300 ease-out"
    >
      {/* Animated left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2px] bg-green-app scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-out z-20" />

      {/* ── Image ── */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-foreground/5">
        <Image
          src={src || "/img.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />

        {/* Bottom scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Category chip — top-left */}
        {primaryCategory && (
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center text-[8px] font-bold uppercase tracking-[0.12em] text-green-app bg-black/45 backdrop-blur-md border border-green-app/30 px-2 py-[4px] rounded-full">
              {primaryCategory}
            </span>
          </div>
        )}

        {/* Read time — top-right */}
        <div className="absolute top-2.5 right-2.5">
          <span className="text-[8px] font-semibold text-white/65 bg-black/30 backdrop-blur-md px-2 py-[4px] rounded-full border border-white/10">
            {readTime} min
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col gap-1.5 px-4 pt-3 pb-3.5 flex-1">
        {/* Date */}
        {formattedDate && (
          <time className="text-[9px] text-foreground/30 font-semibold tracking-widest uppercase">
            {formattedDate}
          </time>
        )}

        {/* Title */}
        <h3 className="text-[13.5px] font-extrabold leading-snug line-clamp-1 group-hover:text-green-app transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        {cleanDesc && (
          <p className="text-[11.5px] text-foreground/45 leading-relaxed line-clamp-3 flex-1">
            {cleanDesc}
          </p>
        )}

        {/* Extra category tags */}
        {extraCategories.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {extraCategories.map((cat) => (
              <span
                key={cat}
                className="text-[8.5px] font-semibold text-foreground/35 bg-foreground/[0.05] border border-foreground/[0.07] px-2 py-0.5 rounded-full"
              >
                {cat}
              </span>
            ))}
          </div>
        )}

        {/* ── CTA bar ── */}
        <div className="flex items-center gap-2 mt-1 pt-2.5 border-t border-foreground/[0.07]">
          <span className="text-[9.5px] font-bold uppercase tracking-widest text-foreground/30 group-hover:text-green-app transition-colors duration-300 flex-shrink-0">
            {t("discover")}
          </span>
          {/* Expanding line */}
          <div className="flex-1 h-px bg-foreground/[0.06] group-hover:bg-green-app/40 transition-colors duration-500" />
          {/* Arrow circle */}
          <div className="w-6 h-6 rounded-full bg-foreground/[0.04] border border-foreground/[0.07] group-hover:bg-green-app group-hover:border-green-app flex items-center justify-center flex-shrink-0 transition-all duration-300">
            <svg
              width="10"
              height="10"
              viewBox="0 0 16 16"
              fill="none"
              className="text-foreground/40 group-hover:text-white group-hover:translate-x-px transition-all duration-300"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
