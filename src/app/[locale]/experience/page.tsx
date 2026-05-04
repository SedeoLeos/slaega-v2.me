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
    <main className="w-full max-w-content self-center px-10 md:px-20 py-20 font-poppins flex flex-col items-center">
      {/* Centered header */}
      <div className="text-center mb-16 max-w-2xl mx-auto">
        <span className="text-xs font-semibold uppercase tracking-widest text-green-app">
          {t('label')}
        </span>
        <h1 className="text-5xl sm:text-6xl font-extrabold mt-3 leading-tight">{t('title')}</h1>
        <p className="text-foreground/60 mt-4 text-base leading-relaxed">{t('subtitle')}</p>
      </div>

      {/* Centered timeline container */}
      {experiences.length === 0 ? (
        <p className="text-foreground/50">{t('empty')}</p>
      ) : (
        <div className="w-full max-w-5xl mx-auto">
          {experiences.map((exp, i) => (
            <ExperienceItem
              key={exp.id}
              experience={exp}
              isLast={i === experiences.length - 1}
            />
          ))}
        </div>
      )}
    </main>
  );
}
