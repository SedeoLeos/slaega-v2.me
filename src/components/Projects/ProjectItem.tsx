"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import ProjectGraph from "./ProjectGraph";

type ProjectItemProps = {
  src?: string;
  title: string;
  desc: string;
  slug: string;
  date?: string;
  categories?: string[];
  tags?: string[];
};

export default function ProjectItem({
  src,
  title,
  desc,
  slug,
  date,
  categories,
  tags,
}: ProjectItemProps) {
  const t = useTranslations("projects");
  const locale = useLocale();
  const cleanDesc = desc?.replace(/<[^>]*>/g, "") ?? "";
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
      data-cursor
      data-cursor-label={t("discover")}
      className="group relative flex min-h-[300px] flex-col justify-end overflow-hidden rounded-[3px] border border-foreground/10 bg-card transition-all duration-500 hover:border-green-app/50"
    >
      {/* Cover — CSS background so arbitrary image hosts work without next/image config */}
      {src ? (
        <div
          aria-hidden
          className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-45"
          style={{ backgroundImage: `url("${src}")` }}
        />
      ) : (
        <div aria-hidden className="absolute inset-0 opacity-40">
          <ProjectGraph title={title} tags={tags} categories={categories} compact />
        </div>
      )}

      {/* Legibility scrim (theme-aware) */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, color-mix(in srgb, var(--background) 25%, transparent) 0%, color-mix(in srgb, var(--background) 94%, transparent) 78%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2 p-6">
        <div className="flex items-center gap-3">
          {primaryCategory && (
            <span className="font-space text-[11px] uppercase tracking-[0.2em] text-green-app">
              {primaryCategory}
            </span>
          )}
          {formattedDate && (
            <time className="font-space text-[11px] uppercase tracking-[0.15em] text-foreground/40">
              {formattedDate}
            </time>
          )}
        </div>

        <h3 className="font-space text-2xl font-bold tracking-tight text-foreground transition-colors group-hover:text-green-app">
          {title}
        </h3>

        {cleanDesc && (
          <p className="line-clamp-2 max-w-[52ch] text-[13px] leading-relaxed text-foreground/55">
            {cleanDesc}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {tags?.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="rounded-[2px] border border-foreground/12 px-2 py-0.5 font-space text-[10px] uppercase tracking-wide text-foreground/50"
            >
              {tag}
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
  );
}
