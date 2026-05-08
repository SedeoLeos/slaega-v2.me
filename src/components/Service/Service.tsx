import { getTranslations } from 'next-intl/server';
import Light from '../icons/light';
import Illustation from '../Illustration/Illustation';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren';
import { serviceRepository } from '@/features/services/repositories/service.repository';

type ServiceItem = { title: string; description: string; icon?: string };

// Icon resolver — keeps things simple, all icons share a green-app tile.
function ServiceIcon({ name }: { name?: string }) {
  switch (name) {
    case "code":
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      );
    case "cog":
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "shield":
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "cloud":
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      );
    case "rocket":
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    case "device":
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case "database":
      return (
        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
        </svg>
      );
    case "light":
    default:
      return <Light />;
  }
}

export default async function Service() {
  const t = await getTranslations();

  // Fetch from CMS first; fall back to static i18n items if empty (preview / fresh DB)
  const dbServices = await serviceRepository.getPublished().catch(() => []);

  const items: ServiceItem[] =
    dbServices.length > 0
      ? dbServices.map((s) => ({ title: s.title, description: s.description, icon: s.icon }))
      : (t.raw('services.items') as Array<{ title: string; description: string }>);

  return (
    <section
      className="min-h-screen flex justify-center relative overflow-hidden py-24"
      style={{ background: '#1A1F14' }}
    >
      {/* Decorative circle */}
      <div className="absolute -right-1/2 sm:right-0 -top-[calc(720px/2)] opacity-10 sm:opacity-15 pointer-events-none">
        <Illustation />
      </div>

      <div className="w-full max-w-content text-white px-10 lg:px-20 flex flex-col gap-16 items-center relative">
        {/* Centered heading */}
        <div className="text-center space-y-2 max-w-2xl">
          <h2 className="text-5xl sm:text-6xl font-extrabold">{t('services.title')}</h2>
          <p className="text-base text-white/50">{t('services.subtitle')}</p>
        </div>

        {/* Uniform cards — flex-wrap centers the last row */}
        <StaggerContainer className="flex flex-wrap justify-center gap-6 w-full max-w-[1080px]">
          {items.map((service, index) => (
            <StaggerItem
              key={index}
              className="w-full md:w-[calc(50%-12px)] xl:w-[calc(33.333%-16px)]"
            >
              <article
                className="relative flex flex-col gap-4 p-7 rounded-2xl overflow-hidden h-full min-h-[260px] group"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Top row: icon + number */}
                <div className="flex items-start justify-between z-[2]">
                  <div className="aspect-square w-11 bg-green-app flex justify-center items-center rounded-xl flex-shrink-0 shadow-sm shadow-green-app/30">
                    <ServiceIcon name={service.icon} />
                  </div>
                  {/* Rig-style index number */}
                  <span
                    className="text-[11px] font-mono font-bold tracking-widest select-none transition-colors duration-300"
                    style={{ color: 'rgba(255,255,255,0.12)' }}
                  >
                    {String(index + 1).padStart(3, '0')}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg z-[2] leading-snug">
                  {service.title}
                </h3>

                {/* Description fills remaining space */}
                <p className="text-white/55 text-sm leading-relaxed z-[2] flex-1">
                  {service.description}
                </p>

                {/* Bottom separator line — animates on hover */}
                <div
                  className="absolute bottom-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ background: 'linear-gradient(90deg, #05796B, transparent)' }}
                />

                {/* Glow accent */}
                <div
                  className="absolute -bottom-12 -right-12 w-40 h-40 rounded-full pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(5,121,107,0.15) 0%, transparent 70%)',
                  }}
                />
              </article>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
