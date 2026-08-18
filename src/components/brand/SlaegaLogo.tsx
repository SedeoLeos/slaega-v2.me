/**
 * slaega logo — the "SL" monogram (Sedeo Leos) as the mark, locked up with the
 * SLAEGA / 19 wordmark. Theme-aware (S = foreground, L = accent), Space Grotesk.
 *
 *   variant="horizontal" → SL + SLAEGA·19 stacked tight   (header, compact)
 *   variant="vertical"   → SL above SLAEGA19               (footer, hero)
 *
 * `size` scales the lockup (sm/md for the header scroll states, lg for hero).
 */

export function SlaegaMonogram({ className = '' }: { className?: string }) {
  return (
    <span
      className={`font-space font-extrabold leading-none tracking-tighter ${className}`}
      aria-hidden
    >
      <span className="text-foreground">S</span>
      <span className="text-green-app">L</span>
    </span>
  );
}

const MONO_SIZE = { sm: 'text-2xl', md: 'text-[1.9rem]', lg: 'text-5xl' } as const;

export default function SlaegaLogo({
  variant = 'horizontal',
  size = 'md',
  className = '',
}: {
  variant?: 'horizontal' | 'vertical';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}) {
  if (variant === 'vertical') {
    return (
      <span
        className={`inline-flex flex-col items-center gap-2 ${className}`}
        role="img"
        aria-label="slaega19"
      >
        <SlaegaMonogram className={MONO_SIZE.lg} />
        <span className="font-space text-[11px] font-semibold uppercase tracking-[0.35em] text-foreground">
          SLAEGA
          <sub className="ml-0.5 align-sub text-[0.7em] font-bold text-green-app">19</sub>
        </span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-baseline gap-2.5 ${className}`}
      role="img"
      aria-label="slaega — SL 19"
    >
      <SlaegaMonogram className={MONO_SIZE[size === 'lg' ? 'lg' : size]} />
      <span className="font-space text-[0.62rem] font-semibold uppercase tracking-[0.28em] text-foreground/80">
        SLAEGA<span className="text-green-app">·19</span>
      </span>
    </span>
  );
}
