/**
 * slaega logo — the real SL lockup (interlocking S/L monogram + swoosh + SLAEGA
 * wordmark), traced from the brand artwork. Two-tone and theme-aware: the S,
 * left foot and wordmark use --foreground; the L, its foot and the swoosh use
 * --accent. So it follows light/dark and the site accent automatically.
 *
 *   variant="horizontal" → monogram + SLAEGA·19   (header, compact)
 *   variant="vertical"   → full SL / SLAEGA lockup (footer, hero)
 */

type Glyph = { d: string; acc?: boolean };

// Paths 1-5 = monogram (S, L banner, L stem+foot, left foot, swoosh);
// 6-13 = the SLAEGA wordmark. `acc` = tangerine, else foreground.
const GLYPHS: Glyph[] = [
  { d: 'M4336 9978 c-1152 -168 -1627 -1561 -806 -2362 300 -293 601 -396 1541 -525 1054 -146 1325 -426 1260 -1301 -24 -322 27 -351 235 -132 457 478 418 1307 -84 1802 -337 331 -686 455 -1670 590 -512 71 -676 138 -782 319 -153 260 -39 605 246 745 l114 56 607 10 607 10 218 390 c119 215 217 397 218 405 0 20 -1561 14 -1704 -7z' },
  { d: 'M6063 9587 l-221 -390 -2 -533 c-3 -670 -5 -624 30 -624 190 0 749 -377 913 -615 93 -134 99 -116 89 240 -5 179 -10 773 -11 1321 l-1 995 -288 -2 -289 -3 -220 -389z', acc: true },
  { d: 'M5260 5730 l0 -1150 1707 0 1706 0 226 345 c125 190 228 359 229 375 2 26 -180 31 -1503 35 l-1505 5 0 506 c0 753 -107 890 -795 1021 l-65 12 0 -1149z', acc: true },
  { d: 'M3338 5175 c-168 -278 -318 -525 -334 -550 l-29 -45 1043 0 1042 0 0 550 0 550 -708 0 -708 0 -306 -505z' },
  { d: 'M5200 4108 c-780 -54 -1500 -145 -1900 -238 -244 -58 -250 -58 460 10 789 74 1139 89 2150 89 1012 1 1337 -13 2180 -90 231 -21 479 -43 550 -49 l130 -10 -116 30 c-274 70 -967 171 -1514 221 -330 31 -1668 55 -1940 37z', acc: true },
  { d: 'M1486 3441 c-178 -28 -286 -139 -286 -295 0 -190 136 -280 456 -303 293 -22 380 -84 296 -212 -43 -66 -125 -78 -444 -66 l-266 10 -21 -61 c-14 -40 -15 -68 -2 -81 32 -32 701 -28 761 4 148 82 205 201 163 341 -48 159 -152 207 -507 234 -227 17 -326 118 -218 226 62 62 353 77 603 30 52 -10 99 48 99 121 0 47 -438 82 -634 52z' },
  { d: 'M8250 3440 c-313 -35 -509 -233 -510 -515 -1 -385 343 -583 883 -506 233 33 219 13 213 313 l-6 258 -240 6 c-311 7 -330 2 -330 -86 l0 -69 195 -5 195 -6 6 -124 6 -123 -93 -14 c-398 -60 -672 106 -644 391 24 258 291 385 655 311 90 -18 166 -30 168 -27 15 24 52 121 52 136 0 41 -365 82 -550 60z' },
  { d: 'M2820 2930 l0 -510 420 0 420 0 0 70 0 69 -325 6 -325 5 -5 435 -6 435 -89 0 -90 0 0 -510z' },
  { d: 'M4835 3367 c-27 -42 -146 -243 -264 -447 -119 -203 -234 -399 -255 -435 l-39 -65 99 0 99 0 184 319 c101 175 195 333 208 350 20 28 53 -17 212 -289 243 -416 215 -384 327 -376 l94 6 -291 490 c-346 581 -314 543 -374 447z' },
  { d: 'M6160 3360 l0 -80 440 0 440 0 0 80 0 80 -440 0 -440 0 0 -80z' },
  { d: 'M9898 3195 c-79 -135 -205 -349 -280 -476 -186 -316 -183 -299 -62 -299 75 0 103 8 113 34 30 78 381 662 393 655 7 -5 102 -162 211 -348 l197 -340 104 -1 104 0 -304 509 c-167 281 -310 510 -318 510 -8 1 -79 -109 -158 -244z' },
  { d: 'M6160 2930 l0 -90 440 0 440 0 0 90 0 90 -440 0 -440 0 0 -90z' },
  { d: 'M6160 2500 l0 -80 440 0 440 0 0 80 0 80 -440 0 -440 0 0 -80z' },
];

const SVG_TRANSFORM = 'translate(0,600) scale(0.05,-0.05)';

function Glyphs({ count }: { count: number }) {
  return (
    <>
      {GLYPHS.slice(0, count).map((g, i) => (
        <path key={i} d={g.d} fill={g.acc ? 'var(--accent, #FF5A00)' : 'var(--foreground, #EDEDED)'} />
      ))}
    </>
  );
}

/** SL monogram only (mark) — tightly cropped, square-ish. */
export function SlaegaMonogram({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="148.5 100 308 309" className={className} aria-hidden xmlns="http://www.w3.org/2000/svg">
      <g transform={SVG_TRANSFORM} stroke="none">
        <Glyphs count={5} />
      </g>
    </svg>
  );
}

/** Full lockup — monogram + swoosh + SLAEGA wordmark, tightly cropped. */
export function SlaegaLockup({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="60 100 474 380" className={className} role="img" aria-label="slaega" xmlns="http://www.w3.org/2000/svg">
      <g transform={SVG_TRANSFORM} stroke="none">
        <Glyphs count={13} />
      </g>
    </svg>
  );
}

const MARK_SIZE = { sm: 'h-8 w-8', md: 'h-9 w-9', lg: 'h-16 w-16' } as const;

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
    return <SlaegaLockup className={`h-24 w-auto ${className}`} />;
  }

  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`} role="img" aria-label="slaega — SL 19">
      <SlaegaMonogram className={MARK_SIZE[size === 'lg' ? 'lg' : size]} />
      <span className="font-space text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-foreground/80 leading-none">
        SLAEGA<span className="text-green-app">·19</span>
      </span>
    </span>
  );
}
