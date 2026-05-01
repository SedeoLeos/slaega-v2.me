import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import FadeIn from '@/components/animations/FadeIn';

export default async function About() {
  const t = await getTranslations();

  return (
    <section className="w-full max-w-content self-center px-6 md:px-20 py-16 font-poppins">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <FadeIn>
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-green-app">{t('about.subtitle')}</span>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3 mb-0">{t('about.title')}</h2>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <div className="space-y-4 text-[15px] text-foreground/70 leading-relaxed">
            <p>{t('about.paragraph1')}</p>
            <p>{t('about.paragraph2')}</p>
            <p>{t('about.paragraph3')}</p>

            <div className="pt-3">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-foreground text-background font-semibold text-sm px-5 py-3 rounded-xl hover:opacity-80 transition-opacity"
              >
                {t('about.downloadResume')}
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
