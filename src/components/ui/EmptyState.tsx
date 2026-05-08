import Link from "next/link";

type Variant = "default" | "search" | "soon";

interface EmptyStateProps {
  variant?: Variant;
  title: string;
  description?: string;
  cta?: { label: string; href: string };
  /** Optional override icon (otherwise picks from variant) */
  icon?: React.ReactNode;
}

/**
 * Polished empty state for public listings.
 * Use when a list is genuinely empty (no DB rows, filter returns nothing,
 * "coming soon" placeholder).
 */
export default function EmptyState({
  variant = "default",
  title,
  description,
  cta,
  icon,
}: EmptyStateProps) {
  return (
    <div className="w-full flex flex-col items-center justify-center text-center py-16 sm:py-20 px-6">
      {/* Decorative soft halo + icon */}
      <div className="relative mb-6">
        <div className="absolute inset-0 -m-3 rounded-full bg-green-app/10 blur-xl" />
        <div className="relative w-20 h-20 rounded-2xl bg-card border border-foreground/10 flex items-center justify-center text-foreground/40">
          {icon ?? defaultIconFor(variant)}
        </div>
      </div>

      <h3 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
        {title}
      </h3>
      {description && (
        <p className="text-sm sm:text-base text-foreground/55 mt-2 max-w-md leading-relaxed">
          {description}
        </p>
      )}

      {cta && (
        <Link
          href={cta.href}
          className="mt-6 inline-flex items-center gap-2 bg-foreground text-background py-3 px-6 rounded-full font-semibold text-sm hover:bg-foreground/85 transition-colors"
        >
          {cta.label}
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
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
  );
}

function defaultIconFor(variant: Variant) {
  switch (variant) {
    case "search":
      return (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      );
    case "soon":
      return (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return (
        <svg className="w-9 h-9" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
  }
}
