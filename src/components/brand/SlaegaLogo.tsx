/**
 * slaega logo — "SL" badge over a lion-dragon fusion emblem (watermark),
 * with the SLAEGA19 wordmark. Theme-aware (foreground + accent), Space Grotesk.
 *
 *  variant="mark" → SL badge only (header, compact)
 *  variant="full" → badge + SLAEGA19 wordmark stacked (footer, hero)
 */

function Emblem({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <g fill="var(--accent, #FF5A00)">
        {/* dragon wings */}
        <path d="M 60 60 L 16 34 L 24 58 L 10 70 L 30 72 Z" opacity="0.6" />
        <path d="M 60 60 L 104 34 L 96 58 L 110 70 L 90 72 Z" opacity="0.6" />
        {/* dragon horns */}
        <path d="M 44 30 C 34 16, 26 8, 20 4 C 30 12, 34 22, 42 40 Z" />
        <path d="M 76 30 C 86 16, 94 8, 100 4 C 90 12, 86 22, 78 40 Z" />
        {/* lion mane */}
        <path d="M 60 14 L 71.4 28.8 L 89.4 23.5 L 89.9 42.3 L 107.6 48.5 L 97 64 L 107.6 79.5 L 89.9 85.7 L 89.4 104.5 L 71.4 99.2 L 60 114 L 48.6 99.2 L 30.6 104.5 L 30.1 85.7 L 12.4 79.5 L 23 64 L 12.4 48.5 L 30.1 42.3 L 30.6 23.5 L 48.6 28.8 Z" />
        {/* head + ears */}
        <circle cx="60" cy="64" r="32" />
        <path d="M 42 36 l 9 4 l -5 8 Z" />
        <path d="M 78 36 l -9 4 l 5 8 Z" />
        {/* fangs */}
        <path d="M 53 78 l 3 7 l 3 -6 Z" />
        <path d="M 67 78 l -3 7 l -3 -6 Z" />
      </g>
    </svg>
  );
}

export default function SlaegaLogo({
  variant = 'mark',
  className = '',
  badgeClass = 'text-xl',
}: {
  variant?: 'mark' | 'full';
  className?: string;
  badgeClass?: string;
}) {
  const badge = (
    <span
      className={`relative inline-flex items-center justify-center overflow-hidden rounded-[3px] border-2 border-green-app/45 bg-card px-2 py-1 font-space font-bold leading-none tracking-tighter ${badgeClass}`}
    >
      {/* lion-dragon fusion — background watermark */}
      <Emblem className="pointer-events-none absolute inset-[-14%] h-[128%] w-[128%] opacity-[0.16]" />
      <span className="relative text-foreground">S</span>
      <span className="relative text-green-app">L</span>
    </span>
  );

  if (variant === 'mark') {
    return (
      <span className={`inline-flex ${className}`} role="img" aria-label="slaega">
        {badge}
      </span>
    );
  }

  return (
    <span className={`inline-flex flex-col items-center gap-2 ${className}`} role="img" aria-label="slaega19">
      {badge}
      <span className="font-space text-[11px] font-semibold uppercase tracking-[0.35em] text-foreground">
        SLAEGA
        <sub className="ml-0.5 align-sub text-[0.7em] text-green-app">19</sub>
      </span>
    </span>
  );
}
