import { getTranslations } from 'next-intl/server';
import Light from '../icons/light';
import Illustation from '../Illustration/Illustation';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren';

export default async function Service() {
  const t = await getTranslations();
  const items = t.raw('services.items') as Array<{ title: string; description: string }>;

  return (
    <div className='min-h-screen flex justify-center relative overflow-hidden' style={{ background: '#1A1F14' }}>
      {/* Decorative circle illustration */}
      <div className='absolute -right-1/2 sm:right-0 -top-[calc(720px/2)] opacity-10 sm:opacity-20 pointer-events-none'>
        <Illustation />
      </div>

      <div className='w-full max-w-content text-white py-24 px-10 lg:px-20 flex flex-col gap-20 justify-center items-center relative'>
        {/* Heading */}
        <div className='text-center space-y-2'>
          <h2 className='text-5xl font-extrabold'>{t('services.title')}</h2>
          <span className='text-sm text-white/50'>{t('services.subtitle')}</span>
        </div>

        {/* Cards grid */}
        <StaggerContainer className='grid md:grid-cols-2 xl:grid-cols-3 max-w-[1044px] gap-6 w-full'>
          {items.map((service, index) => (
            <StaggerItem key={index}>
              <div
                className={`relative flex flex-col gap-5 p-7 rounded-2xl overflow-hidden
                  ${index === 3 ? 'md:col-span-2 xl:col-span-1' : ''}
                `}
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)',
                }}
              >
                {/* Icon */}
                <div className='aspect-square w-11 bg-green-app flex justify-center items-center rounded-xl flex-shrink-0 z-[2]'>
                  <Light />
                </div>

                <h4 className='text-white font-bold text-lg z-[2] leading-snug'>{service.title}</h4>
                <p className='text-white/55 text-sm leading-relaxed z-[2]'>{service.description}</p>

                {/* Glow accent */}
                <div
                  className='absolute -bottom-12 -right-12 w-40 h-40 rounded-full pointer-events-none'
                  style={{ background: 'radial-gradient(circle, rgba(5,121,107,0.15) 0%, transparent 70%)' }}
                />
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </div>
  );
}
