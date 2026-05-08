import { siteConfigRepository } from "@/features/site-config/repositories/site-config.repository";

export default async function ValueCards() {
  const cfg = await siteConfigRepository.getValueCards().catch(() => null);
  if (!cfg || !cfg.enabled || cfg.cards.length === 0) return null;

  return (
    <section className="w-full bg-card">
      <div className="h-px w-full bg-border" />

      <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-border">
        {cfg.cards.map((card) => (
          <div
            key={card.badge}
            className="flex flex-col gap-4 px-10 md:px-14 py-14 group relative overflow-hidden"
          >
            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase self-start px-2.5 py-1 rounded-full border border-green-app/30 text-green-app bg-green-app/8">
              <span className="w-1 h-1 rounded-full bg-current" />
              {card.badge}
            </span>

            {/* Title */}
            <h3 className="text-2xl sm:text-3xl font-extrabold leading-tight text-foreground">
              {card.title}
            </h3>

            {/* Description */}
            <p className="text-sm leading-relaxed text-secondary">
              {card.description}
            </p>

            {/* Hover glow accent */}
            <div
              className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out bg-green-app opacity-40"
            />
          </div>
        ))}
      </div>

      <div className="h-px w-full bg-border" />
    </section>
  );
}
