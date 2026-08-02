'use client';

import { useTranslations } from 'next-intl';
import type { Experience } from '@/entities/experience';
import ContentRenderer from '@/components/Content/ContentRenderer';

type Props = { experience: Experience; index?: number; isLast?: boolean };

export default function ExperienceItem({ experience: exp, index }: Props) {
  const t = useTranslations();
  const months = t.raw('common.monthsShort') as string[];

  const fmt = (d: string) => {
    const [y, m] = d.split('-');
    return `${months[parseInt(m) - 1]} ${y}`;
  };
  const period = `${fmt(exp.startDate)} — ${
    exp.current ? t('experience.present') : exp.endDate ? fmt(exp.endDate) : '?'
  }`;

  return (
    <article
      data-reveal-item
      className="group grid grid-cols-1 gap-5 border-t border-foreground/10 py-10 transition-colors duration-500 hover:bg-foreground/[0.02] md:grid-cols-[minmax(0,15rem)_1fr] md:gap-12"
    >
      {/* Left — meta */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {typeof index === 'number' && (
            <span className="font-space text-sm font-medium text-green-app">
              {String(index + 1).padStart(2, '0')}
            </span>
          )}
          {exp.current && (
            <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-green-app/30 px-2 py-0.5 font-space text-[10px] font-semibold uppercase tracking-widest text-green-app">
              <span className="h-1.5 w-1.5 rounded-full bg-green-app keep-round" />
              {t('experience.currentBadge')}
            </span>
          )}
        </div>
        <p className="font-space text-[13px] uppercase tracking-[0.15em] text-foreground/45">{period}</p>
        <p className="font-space text-lg font-semibold text-foreground">
          {exp.companyUrl ? (
            <a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className="transition-colors hover:text-green-app"
            >
              {exp.company}
            </a>
          ) : (
            exp.company
          )}
        </p>
        {exp.location && <p className="text-sm text-foreground/40">{exp.location}</p>}
      </div>

      {/* Right — role, description, skills */}
      <div className="flex flex-col">
        <h3 className="font-space text-2xl font-bold tracking-tight text-foreground md:text-3xl">
          {exp.role}
        </h3>

        {exp.description && (
          <div className="experience-desc mt-4 max-w-3xl leading-relaxed text-foreground/65">
            <ContentRenderer content={exp.description} collapseThreshold={600} />
          </div>
        )}

        {exp.skills.length > 0 && (
          <div className="mt-5 flex flex-wrap gap-2">
            {exp.skills.map((s) => (
              <span
                key={s}
                className="rounded-[2px] border border-foreground/12 px-2.5 py-1 font-space text-[11px] uppercase tracking-wide text-foreground/55"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
