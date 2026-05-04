import { getTranslations } from 'next-intl/server';
import Light from '../icons/light';
import Illustation from '../Illustration/Illustation';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren';

export default async function Service() {
  const t = await getTranslations();
  const items = t.raw('services.items') as Array<{ title: string; description: string }>;

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
                className="relative flex flex-col gap-4 p-7 rounded-2xl overflow-hidden h-full min-h-[260px]"
                style={{
                  background:
                    'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Icon */}
                <div className="aspect-square w-11 bg-green-app flex justify-center items-center rounded-xl flex-shrink-0 z-[2] shadow-sm shadow-green-app/30">
                  <Light />
                </div>

                {/* Title */}
                <h3 className="text-white font-bold text-lg z-[2] leading-snug">
                  {service.title}
                </h3>

                {/* Description fills remaining space */}
                <p className="text-white/55 text-sm leading-relaxed z-[2] flex-1">
                  {service.description}
                </p>

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
