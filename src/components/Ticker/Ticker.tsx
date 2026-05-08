import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";

export default async function Ticker() {
  const cfg = await siteConfigRepository.getTicker().catch(() => null);
  if (!cfg || !cfg.enabled || cfg.items.length === 0) return null;

  // Duplicate items so the loop is seamless (two identical tracks side by side)
  const track = [...cfg.items, ...cfg.items];
  const duration = `${cfg.speed}s`;

  return (
    <div
      className="w-full overflow-hidden py-2.5 select-none"
      style={{ backgroundColor: cfg.bgColor }}
      aria-hidden="true"
    >
      <div
        className="flex gap-0 whitespace-nowrap ticker-track"
        style={{ animationDuration: duration } as React.CSSProperties}
      >
        {track.map((item, i) => (
          <span
            key={i}
            className="inline-flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.18em] px-6"
            style={{ color: cfg.textColor }}
          >
            {item}
            <span
              className="w-1 h-1 rounded-full flex-shrink-0 opacity-60"
              style={{ backgroundColor: cfg.textColor }}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
