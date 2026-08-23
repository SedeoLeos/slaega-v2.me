import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getTranslations, setRequestLocale, getLocale } from 'next-intl/server';
import { getExperiences } from '@/features/experience/use-cases/get-experiences.use-case';
import { getAllProjects } from '@/features/projects/use-cases/get-projects.use-case';
import { localizeExperience, localizeProject } from '@/features/i18n/localize';
import { groupByCompany, matchProjectsToSkills } from '@/features/experience/group';
import ExperienceItem from '@/components/Experience/ExperienceItem';
import Reveal from '@/components/slaega/Reveal';
import { buildPageMetadata, FULL_NAME } from '@/shared/config/seo';

export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'experience' });
  const group = groupByCompany(await getExperiences().catch(() => [])).find((c) => c.slug === slug);
  if (!group) {
    return buildPageMetadata(locale, { path: `/experience/${slug}`, title: t('pageTitle'), description: '' });
  }
  const roles = group.roles.map((r) => r.role).join(' → ');
  return buildPageMetadata(locale, {
    path: `/experience/${slug}`,
    title: `${group.company} — ${t('title')}`,
    description:
      locale === 'en'
        ? `${FULL_NAME} at ${group.company}: ${roles}.`
        : `${FULL_NAME} chez ${group.company} : ${roles}.`,
    keywords: [group.company, ...group.skills.slice(0, 12)],
    type: 'article',
  });
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const t = await getTranslations();
  const activeLocale = await getLocale();
  const [rawExperiences, rawProjects] = await Promise.all([
    getExperiences().catch(() => []),
    getAllProjects().catch(() => []),
  ]);
  const experiences = rawExperiences.map((e) => localizeExperience(e, activeLocale));
  const projects = rawProjects.map((p) => localizeProject(p, activeLocale));

  const group = groupByCompany(experiences).find((c) => c.slug === slug);
  if (!group) notFound();

  const related = matchProjectsToSkills(projects, group.skills, 6);
  const months = t.raw('common.monthsShort') as string[];
  const fmt = (d: string) => {
    const [y, m] = d.split('-');
    return `${months[parseInt(m) - 1]} ${y}`;
  };
  const span = `${fmt(group.startDate)} — ${
    group.current ? t('experience.present') : group.endDate ? fmt(group.endDate) : '?'
  }`;

  return (
    <main className="slaega-root w-full px-6 pb-32 pt-28 font-[var(--font-inter)] text-foreground md:px-12 lg:px-16">
      <div className="mx-auto max-w-content">
        {/* Back */}
        <Link
          data-cursor
          href="/experience"
          className="inline-flex items-center gap-2 font-space text-sm text-foreground/50 transition-colors hover:text-green-app"
        >
          <span aria-hidden>←</span> {t('experience.back')}
        </Link>

        {/* Header */}
        <Reveal className="mt-8 flex flex-col gap-5 border-b border-foreground/10 pb-12">
          <div data-reveal-item className="flex flex-wrap items-center gap-3">
            <span className="font-space text-[11px] uppercase tracking-[0.25em] text-foreground/45">
              <span className="text-green-app">✦</span> {span}
            </span>
            {group.current && (
              <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-green-app/30 px-2 py-0.5 font-space text-[10px] font-semibold uppercase tracking-widest text-green-app">
                <span className="h-1.5 w-1.5 rounded-full bg-green-app keep-round" />
                {t('experience.currentBadge')}
              </span>
            )}
          </div>
          <h1
            data-reveal-item
            className="font-space text-[clamp(2.4rem,8vw,6rem)] font-bold leading-[0.9] tracking-tighter text-foreground"
          >
            {group.company}
          </h1>
          {(group.location || group.companyUrl) && (
            <p data-reveal-item className="text-foreground/50">
              {group.location}
              {group.location && group.companyUrl && ' · '}
              {group.companyUrl && (
                <a
                  href={group.companyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor
                  className="text-foreground/70 underline-offset-4 transition-colors hover:text-green-app hover:underline"
                >
                  {group.companyUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                </a>
              )}
            </p>
          )}
        </Reveal>

        {/* Role progression */}
        <section className="pt-12">
          <div className="mb-2 flex items-baseline gap-4">
            <span className="font-space text-sm text-green-app">[ {group.roles.length} ]</span>
            <h2 className="font-space text-2xl font-semibold tracking-tight text-foreground">
              {t('experience.rolesHeading')}
            </h2>
          </div>
          <Reveal>
            {group.roles.map((r, i) => (
              <ExperienceItem key={r.id} experience={r} index={i} />
            ))}
          </Reveal>
        </section>

        {/* Related projects */}
        {related.length > 0 && (
          <section className="pt-20">
            <div className="mb-10 flex items-baseline gap-4 border-b border-foreground/10 pb-4">
              <span className="font-space text-sm text-green-app">[ {t('projects.subtitle')} ]</span>
              <h2 className="font-space text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                {t('experience.projectsHere')}
              </h2>
            </div>
            <Reveal className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {related.map((p) => (
                <Link
                  key={p.slug}
                  data-reveal-item
                  data-cursor
                  href={`/project/${p.slug}`}
                  className="group relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-[3px] border border-foreground/10 bg-card transition-all duration-500 hover:border-green-app/50"
                >
                  {p.image && (
                    <div
                      aria-hidden
                      className="absolute inset-0 bg-cover bg-center opacity-30 transition-all duration-700 group-hover:scale-105 group-hover:opacity-45"
                      style={{ backgroundImage: `url("${p.image}")` }}
                    />
                  )}
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        'linear-gradient(180deg, color-mix(in srgb, var(--background) 30%, transparent) 0%, color-mix(in srgb, var(--background) 94%, transparent) 78%)',
                    }}
                  />
                  <div className="relative z-10 p-6">
                    <h3 className="font-space text-xl font-bold text-foreground">{p.title}</h3>
                    <p className="mt-2 line-clamp-2 max-w-[52ch] text-[13px] leading-relaxed text-foreground/55">
                      {p.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {p.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-[2px] border border-foreground/12 px-2 py-0.5 text-[10px] uppercase tracking-wide text-foreground/50"
                        >
                          {tag}
                        </span>
                      ))}
                      <svg
                        aria-hidden
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto h-5 w-5 text-foreground/25 transition-all duration-500 group-hover:translate-x-1 group-hover:text-green-app"
                      >
                        <path d="M7 17 17 7" />
                        <path d="M8 7h9v9" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </Reveal>
          </section>
        )}
      </div>
    </main>
  );
}
