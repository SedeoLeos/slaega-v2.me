'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import type { CompanyGroup } from '@/features/experience/group';

export default function ExperienceCompany({
  group,
  index,
}: {
  group: CompanyGroup;
  index: number;
}) {
  const t = useTranslations();
  const months = t.raw('common.monthsShort') as string[];
  const fmt = (d: string) => {
    const [y, m] = d.split('-');
    return `${months[parseInt(m) - 1]} ${y}`;
  };
  const rolePeriod = (r: CompanyGroup['roles'][number]) =>
    `${fmt(r.startDate)} — ${r.current ? t('experience.present') : r.endDate ? fmt(r.endDate) : '?'}`;
  const span = `${fmt(group.startDate)} — ${
    group.current ? t('experience.present') : group.endDate ? fmt(group.endDate) : '?'
  }`;
  const multi = group.roles.length > 1;

  return (
    <article
      data-reveal-item
      className="group grid grid-cols-1 gap-5 border-t border-foreground/10 py-10 transition-colors duration-500 hover:bg-foreground/[0.02] md:grid-cols-[minmax(0,15rem)_1fr] md:gap-12"
    >
      {/* Left — company meta */}
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="font-space text-sm font-medium text-green-app">
            {String(index + 1).padStart(2, '0')}
          </span>
          {group.current && (
            <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-green-app/30 px-2 py-0.5 font-space text-[10px] font-semibold uppercase tracking-widest text-green-app">
              <span className="h-1.5 w-1.5 rounded-full bg-green-app keep-round" />
              {t('experience.currentBadge')}
            </span>
          )}
        </div>
        <p className="font-space text-[13px] uppercase tracking-[0.15em] text-foreground/45">{span}</p>
        <p className="font-space text-xl font-bold text-foreground">
          {group.companyUrl ? (
            <a
              href={group.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor
              className="transition-colors hover:text-green-app"
            >
              {group.company}
            </a>
          ) : (
            group.company
          )}
        </p>
        {group.location && <p className="text-sm text-foreground/40">{group.location}</p>}
        {multi && (
          <p className="mt-1 font-space text-[11px] uppercase tracking-[0.15em] text-green-app/80">
            {t('experience.progression', { count: group.roles.length })}
          </p>
        )}
      </div>

      {/* Right — role progression */}
      <div className="flex flex-col">
        <ol className="flex flex-col">
          {group.roles.map((r, i) => (
            <li key={r.id} className="relative flex gap-4 pb-5 last:pb-0">
              {/* marker */}
              <div className="flex flex-col items-center pt-1.5">
                <span
                  className={`h-2.5 w-2.5 flex-shrink-0 rounded-full keep-round ${
                    i === 0 ? 'bg-green-app' : 'bg-foreground/25'
                  }`}
                />
                {i < group.roles.length - 1 && <span className="mt-1 w-px flex-1 bg-foreground/12" />}
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className={`font-space text-xl font-bold tracking-tight md:text-2xl ${
                    i === 0 ? 'text-foreground' : 'text-foreground/75'
                  }`}
                >
                  {r.role}
                </h3>
                <p className="mt-0.5 font-space text-[12px] uppercase tracking-[0.12em] text-foreground/40">
                  {rolePeriod(r)}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {group.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {group.skills.slice(0, 8).map((s) => (
              <span
                key={s}
                className="rounded-[2px] border border-foreground/12 px-2.5 py-1 font-space text-[11px] uppercase tracking-wide text-foreground/55"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <Link
          data-cursor
          href={`/experience/${group.slug}`}
          className="mt-6 inline-flex w-max items-center gap-2 font-space text-sm font-medium text-foreground transition-colors hover:text-green-app"
        >
          {t('experience.viewDetail')}
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </Link>
      </div>
    </article>
  );
}
