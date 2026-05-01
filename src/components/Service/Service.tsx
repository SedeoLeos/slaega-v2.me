import { getTranslations } from 'next-intl/server';
import { StaggerContainer, StaggerItem } from '@/components/animations/StaggerChildren';
import FadeIn from '@/components/animations/FadeIn';

const icons = [
  // Mobile/Web
  <svg key="mobile" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>,
  // Backend
  <svg key="backend" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2" /></svg>,
  // Desktop
  <svg key="desktop" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  // Security
  <svg key="security" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
  // DevOps
  <svg key="devops" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
];

export default async function Service() {
  const t = await getTranslations();
  const items = t.raw('services.items') as Array<{ title: string; description: string }>;

  return (
    <section className="w-full bg-zinc-950 py-20 flex justify-center">
      <div className="w-full max-w-content px-6 md:px-20">
        <FadeIn>
          <div className="mb-12">
            <span className="text-xs font-semibold uppercase tracking-widest text-green-400">{t('services.subtitle')}</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-2 text-white">{t('services.title')}</h2>
          </div>
        </FadeIn>

        <StaggerContainer className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {items.map((service, index) => (
            <StaggerItem key={index}>
              <div className="h-full flex flex-col gap-4 p-6 border border-zinc-800 rounded-2xl hover:border-zinc-700 bg-zinc-900/50 hover:bg-zinc-900 transition-all duration-300">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
                  {icons[index]}
                </div>
                <h3 className="font-semibold text-white text-base">{service.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed flex-1">{service.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
