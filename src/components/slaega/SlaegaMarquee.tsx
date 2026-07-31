"use client";

import { STACK } from "./data";

/** Full-bleed infinite marquee of the tech stack (BeNorth-style band). */
export default function SlaegaMarquee() {
  const row = [...STACK, ...STACK];
  return (
    <div className="relative w-full overflow-hidden border-y border-white/10 py-6">
      <div className="slaega-marquee flex w-max items-center gap-8 whitespace-nowrap">
        {row.map((item, i) => (
          <span key={i} className="flex items-center gap-8">
            <span className="font-space text-lg font-medium uppercase tracking-tight text-white/70">
              {item}
            </span>
            <span className="text-[#FF5A00]">✦</span>
          </span>
        ))}
      </div>
      <style jsx>{`
        @keyframes slaega-marquee {
          from {
            transform: translate3d(0, 0, 0);
          }
          to {
            transform: translate3d(-50%, 0, 0);
          }
        }
        .slaega-marquee {
          animation: slaega-marquee 42s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .slaega-marquee {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
