import { getTranslations, setRequestLocale, getLocale } from 'next-intl/server';
import { getExperiences } from '@/features/experience/use-cases/get-experiences.use-case';
import { localizeExperience } from '@/features/i18n/localize';
import { groupByCompany } from '@/features/experience/group';
import ExperienceCompany from '@/components/Experience/ExperienceCompany';
import Reveal from '@/components/slaega/Reveal';
import EmptyState from '@/components/ui/EmptyState';
import { buildPageMetadata } from '@/shared/config/seo';

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: '/experience',
    title: locale === 'en' ? 'Experience' : 'Expérience',
    description:
      locale === 'en'
        ? 'Career of Seba Gedeon Matsoula Malonga (slaega): role progression by company — full-stack, technical lead, software architect.'
        : "Parcours de Seba Gedeon Matsoula Malonga (slaega) : progression par entreprise — full-stack, responsable technique, architecte logiciel.",
    keywords: ['expérience', 'parcours', 'carrière', 'architecte logiciel', 'responsable technique'],
  });
}

export default async function ExperiencePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const tExp = (key: string) => t(`experience.${key}`);
  const activeLocale = await getLocale();
  const experiences = (await getExperiences().catch(() => [])).map((e) =>
    localizeExperience(e, activeLocale),
  );
  const companies = groupByCompany(experiences);

  return (
    <main className="slaega-root w-full px-6 pb-32 pt-28 font-[var(--font-inter)] text-foreground md:px-12 lg:px-16">
      {/* Header */}
      <Reveal className="mx-auto flex max-w-content flex-col gap-6 border-b border-foreground/10 pb-14">
        <span data-reveal-item className="font-space text-[11px] uppercase tracking-[0.25em] text-foreground/45">
          <span className="text-green-app">✦</span> {tExp('label')}
        </span>
        <h1
          data-reveal-item
          className="font-space text-[clamp(2.4rem,8vw,6rem)] font-bold leading-[0.9] tracking-tighter text-foreground"
        >
          {tExp('title')}
        </h1>
        <p data-reveal-item className="max-w-[60ch] text-lg leading-relaxed text-foreground/55">
          {tExp('subtitle')}
        </p>
      </Reveal>

      {/* Companies (grouped, with role progression) */}
      {companies.length === 0 ? (
        <div className="mx-auto max-w-content pt-16">
          <EmptyState
            variant="soon"
            title={t('emptyState.experience.title')}
            description={t('emptyState.experience.description')}
            cta={{
              label: t('emptyState.experience.ctaLabel'),
              href: t('emptyState.experience.ctaHref'),
            }}
          />
        </div>
      ) : (
        <Reveal className="mx-auto max-w-content">
          {companies.map((group, i) => (
            <ExperienceCompany key={group.slug} group={group} index={i} />
          ))}
        </Reveal>
      )}
    </main>
  );
}
