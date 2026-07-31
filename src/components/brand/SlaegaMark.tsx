/**
 * slaega — lion mark (leos = lion). Theme-aware: the body uses the theme accent
 * and the facial cut-outs use the page background, so it adapts to any theme.
 */
export default function SlaegaMark({
  className,
  title = "slaega",
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox="0 0 120 120"
      className={className}
      role="img"
      aria-label={title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* body — mane + head + ears (theme accent) */}
      <g fill="var(--accent, #FF5A00)">
        <path d="M 60 6 L 73 22.29 L 93.42 18.17 L 92.91 39 L 111.21 48.97 L 97.42 64.6 L 105.03 84 L 84.43 87.11 L 77.79 106.86 L 60 96 L 42.21 106.86 L 35.57 87.11 L 14.97 84 L 22.58 64.6 L 8.79 48.97 L 27.09 39 L 26.58 18.17 L 47 22.29 Z" />
        <circle cx="60" cy="58" r="34" />
        <path d="M 40 30 l 10 4 l -6 9 Z" />
        <path d="M 80 30 l -10 4 l 6 9 Z" />
      </g>
      {/* face — negative space (page background) */}
      <g fill="var(--background, #0B0B0B)">
        <path d="M 44 52 l 12 3 l -12 6 Z" />
        <path d="M 76 52 l -12 3 l 12 6 Z" />
        <path d="M 60 60 l 6 12 a 12 10 0 0 1 -12 0 Z" />
      </g>
      <path
        d="M 60 72 v 7 M 60 79 q -7 5 -13 1 M 60 79 q 7 5 13 1"
        stroke="var(--background, #0B0B0B)"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}
