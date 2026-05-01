import { getTranslations } from 'next-intl/server';
import { getExperiences } from '@/features/experience/use-cases/get-experiences.use-case';
import ExperienceItem from '@/components/Experience/ExperienceItem';
import { setRequestLocale } from 'next-intl/server';

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'experience' });
  return { title: t('pageTitle') };
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('experience');
  const experiences = await getExperiences().catch(() => []);

  return (
    <main className="w-full max-w-content self-center px-10 md:px-20 py-16 font-poppins">
      <div className="mb-12">
        <span className="text-xs font-semibold uppercase tracking-widest text-green-app">{t('label')}</span>
        <h1 className="text-4xl sm:text-5xl font-bold mt-3">{t('title')}</h1>
        <p className="text-foreground/60 mt-4 max-w-xl text-sm leading-relaxed">{t('subtitle')}</p>
      </div>

      {experiences.length === 0 ? (
        <p className="text-foreground/50">{t('empty')}</p>
      ) : (
        <div>
          {experiences.map((exp, i) => (
            <ExperienceItem key={exp.id} experience={exp} isLast={i === experiences.length - 1} />
          ))}
        </div>
      )}
    </main>
  );
}
