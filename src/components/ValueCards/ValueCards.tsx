import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";

export default async function ValueCards() {
  const cfg = await siteConfigRepository.getValueCards().catch(() => null);
  if (!cfg || !cfg.enabled || cfg.cards.length === 0) return null;

  return (
    <section className="w-full" style={{ backgroundColor: '#141414' }}>
      {/* Top separator */}
      <div className="h-px w-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x"
        style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        {cfg.cards.map((card) => (
          <div
            key={card.badge}
            className="flex flex-col gap-4 px-10 md:px-14 py-14 group relative overflow-hidden"
          >
            {/* Badge */}
            <span
              className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase self-start px-2.5 py-1 rounded-full border"
              style={{
                color: '#E5533C',
                borderColor: 'rgba(229,83,60,0.3)',
                backgroundColor: 'rgba(229,83,60,0.08)',
              }}
            >
              <span className="w-1 h-1 rounded-full bg-current" />
              {card.badge}
            </span>

            {/* Title */}
            <h3
              className="text-2xl sm:text-3xl font-extrabold leading-tight"
              style={{ color: '#F0EDE6' }}
            >
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(240,237,230,0.45)' }}>
              {card.description}
            </p>

            {/* Hover glow */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
              style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(229,83,60,0.04) 0%, transparent 60%)' }}
            />
          </div>
        ))}
      </div>

      <div className="h-px w-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
    </section>
  );
}
