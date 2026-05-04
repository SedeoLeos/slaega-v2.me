'use client';

import { useTranslations } from 'next-intl';
import type { Experience } from '@/entities/experience';
import ContentRenderer from '@/components/Content/ContentRenderer';

type Props = { experience: Experience; isLast?: boolean };

export default function ExperienceItem({ experience: exp, isLast }: Props) {
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
    <div className="relative flex gap-6 sm:gap-8">
      {/* Timeline line */}
      <div className="flex flex-col items-center">
        <div
          className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${
            exp.current ? 'bg-green-app ring-4 ring-green-app/20' : 'bg-foreground/30'
          }`}
        />
        {!isLast && <div className="w-px flex-1 bg-foreground/10 mt-2 min-h-[2rem]" />}
      </div>

      {/* Content */}
      <div className="pb-10 flex-1 min-w-0">
        <div className="flex flex-wrap items-start gap-x-3 gap-y-1 mb-1">
          <h3 className="font-semibold text-base text-foreground">{exp.role}</h3>
          {exp.current && (
            <span className="text-xs bg-green-app/10 text-green-app border border-green-app/20 px-2 py-0.5 rounded-full font-medium">
              {t('experience.currentBadge')}
            </span>
          )}
        </div>
        <p className="text-sm text-foreground/60 mb-1">
          {exp.companyUrl ? (
            <a
              href={exp.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-app transition-colors"
            >
              {exp.company}
            </a>
          ) : (
            exp.company
          )}
          {exp.location && ` · ${exp.location}`}
        </p>
        <p className="text-xs text-foreground/40 mb-3 font-mono">{period}</p>

        {/* Rich description (HTML / Markdown) — uses the same renderer as projects */}
        {exp.description && (
          <div className="text-foreground/70 leading-relaxed max-w-3xl experience-desc">
            <ContentRenderer content={exp.description} collapseThreshold={600} />
          </div>
        )}

        {exp.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-4">
            {exp.skills.map((s) => (
              <span
                key={s}
                className="text-xs bg-foreground/5 border border-foreground/10 text-foreground/60 px-2.5 py-0.5 rounded-full"
              >
                {s}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
