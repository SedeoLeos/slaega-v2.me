"use client";

import { useEffect } from "react";
import SlaegaHero from "./SlaegaHero";
import SlaegaServices, { type SlaegaProject, type SlaegaService } from "./SlaegaServices";

export default function SlaegaLanding({
  projects = [],
  services = [],
}: {
  projects?: SlaegaProject[];
  services?: SlaegaService[];
}) {
  // Own the viewport: hide portfolio chrome + go dark while mounted.
  useEffect(() => {
    const html = document.documentElement;
    const prev = html.getAttribute("data-immersive");
    html.setAttribute("data-immersive", "1");
    return () => {
      if (prev === null) html.removeAttribute("data-immersive");
      else html.setAttribute("data-immersive", prev);
    };
  }, []);

  // Keep ScrollTrigger in sync with the (global Lenis) smooth scroll.
  useEffect(() => {
    let cleanup = () => {};
    (async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);
      const onScroll = () => ScrollTrigger.update();
      window.addEventListener("scroll", onScroll, { passive: true });
      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      cleanup = () => {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("load", refresh);
      };
    })();
    return () => cleanup();
  }, []);

  return (
    <main className="slaega-root relative w-full bg-[#0B0B0B] font-[var(--font-inter)] text-white selection:bg-[#FF5A00] selection:text-[#0B0B0B]">
      <SlaegaHero />
      <SlaegaServices projects={projects} services={services} />

      <footer className="border-t border-white/10 px-6 py-12 md:px-12 lg:px-16">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <span className="font-space text-2xl font-bold lowercase text-white">slaega</span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/35">
            Seba Gedeon · ingénieur logiciel full-stack &amp; devops
          </span>
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/35">
            © {new Date().getFullYear()}
          </span>
        </div>
      </footer>

      <style jsx global>{`
        .slaega-root .font-space {
          font-family: var(--font-space), ui-sans-serif, system-ui, sans-serif;
        }
        @keyframes slaega-bob {
          0%,
          100% {
            transform: translate3d(0, -6px, 0);
          }
          50% {
            transform: translate3d(0, 6px, 0);
          }
        }
        .slaega-node-inner {
          animation: slaega-bob 5.5s ease-in-out infinite;
          transition: border-color 0.3s ease, background-color 0.3s ease;
        }
        .slaega-node:hover .slaega-node-inner {
          border-color: rgba(255, 90, 0, 0.6);
          background: rgba(255, 90, 0, 0.08);
        }
        .slaega-node[data-dragging="1"] .slaega-node-inner {
          animation: none;
          border-color: #ff5a00;
          background: rgba(255, 90, 0, 0.14);
          box-shadow: 0 20px 60px -20px rgba(255, 90, 0, 0.5);
        }
        @keyframes slaega-scroll {
          0%,
          100% {
            transform: scaleY(0.4);
            opacity: 0.3;
          }
          50% {
            transform: scaleY(1);
            opacity: 0.8;
          }
        }
        .slaega-scroll {
          transform-origin: top;
          animation: slaega-scroll 2.2s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .slaega-node-inner,
          .slaega-scroll {
            animation: none;
          }
        }
      `}</style>
    </main>
  );
}
