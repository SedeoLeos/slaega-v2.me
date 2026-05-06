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

  return (
    <Link
      href={`/project/${slug}`}
      className="group relative flex flex-col bg-card rounded-2xl overflow-hidden border border-foreground/[0.06] hover:border-foreground/10 hover:shadow-2xl hover:shadow-foreground/[0.09] hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      {/* Animated left accent bar */}
      <div className="absolute left-0 top-0 bottom-0 w-[2.5px] bg-green-app scale-y-0 group-hover:scale-y-100 origin-top transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-20" />

      {/* ── Image ── */}
      <div className="relative w-full aspect-video overflow-hidden bg-foreground/5">
        <Image
          src={src || "/img.jpg"}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />

        {/* Subtle bottom scrim for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/5 to-transparent" />

        {/* Category chip — frosted, top-left */}
        {primaryCategory && (
          <div className="absolute top-3.5 left-3.5">
            <span className="inline-flex items-center text-[9px] font-bold uppercase tracking-[0.12em] text-green-app bg-black/45 backdrop-blur-md border border-green-app/30 px-2.5 py-[5px] rounded-full">
              {primaryCategory}
            </span>
          </div>
        )}

        {/* Read time — frosted, top-right */}
        <div className="absolute top-3.5 right-3.5">
          <span className="text-[9px] font-semibold text-white/70 bg-black/30 backdrop-blur-md px-2.5 py-[5px] rounded-full border border-white/10">
            {readTime} min
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="relative z-10 flex flex-col gap-2 px-5 pt-4 pb-5 flex-1">
        {/* Date */}
        {formattedDate && (
          <time className="text-[10px] text-foreground/30 font-semibold tracking-widest uppercase">
            {formattedDate}
          </time>
        )}

        {/* Title */}
        <h3 className="text-[15px] font-extrabold leading-snug line-clamp-2 group-hover:text-green-app transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        {cleanDesc && (
          <p className="text-[12px] text-foreground/45 leading-relaxed line-clamp-2 flex-1">
            {cleanDesc}
          </p>
        )}

        {/* ── CTA bar ── */}
        <div className="flex items-center gap-2.5 mt-2 pt-3.5 border-t border-foreground/[0.07]">
          <span className="text-[10.5px] font-bold uppercase tracking-widest text-foreground/30 group-hover:text-green-app transition-colors duration-300 flex-shrink-0">
            {t("discover")}
          </span>
          {/* Animated line */}
          <div className="flex-1 h-px bg-foreground/[0.07] group-hover:bg-green-app/40 transition-colors duration-500" />
          {/* Arrow pill */}
          <div className="w-7 h-7 rounded-full bg-foreground/[0.05] border border-foreground/[0.08] group-hover:bg-green-app group-hover:border-green-app flex items-center justify-center flex-shrink-0 transition-all duration-300">
            <svg
              width="11"
              height="11"
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
