'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FilterCategorie from './FilterCategorie';
import { useProject } from '@/hooks/useProjects';
import { useSearchParams } from 'next/navigation';
import ProjectItem from './ProjectItem';
import EmptyState from '@/components/ui/EmptyState';
import { useTranslations } from 'next-intl';

type ProjectListProps = {
  origin: 'home' | 'project';
};

function ProjectList({ origin }: ProjectListProps) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const categories = category?.split(',');
  const { data, fetchNextPage, hasNextPage, isLoading } = useProject({ categories });
  const [visiblePages, setVisiblePages] = useState(1);

  useEffect(() => {
    setVisiblePages(1);
  }, [categories]);

  const visibleProjects = data?.pages.slice(0, visiblePages).flat() || [];
  const canLoadMore = (data && visiblePages < data.pages.length) || hasNextPage;
  const canLoadLess = visiblePages > 1;

  const handleLoadMore = () => {
    if (data && visiblePages < data.pages.length) {
      setVisiblePages((prev) => prev + 1);
    } else if (hasNextPage) {
      fetchNextPage().then(() => setVisiblePages((prev) => prev + 1));
    }
  };

  const handleLoadLess = () => {
    if (visiblePages > 1) setVisiblePages((prev) => prev - 1);
  };

  return (
    <div className='slaega-root w-full max-w-content self-center flex flex-col gap-10 px-6 md:px-12 lg:px-16 pt-28 pb-24 font-[var(--font-inter)] text-foreground'>
      <div className='flex flex-col gap-5 border-b border-foreground/10 pb-10'>
        <span className='font-space text-[11px] uppercase tracking-[0.25em] text-foreground/45'>
          <span className='text-green-app'>✦</span> {t('projects.subtitle')}
        </span>
        <h1 className='font-space text-[clamp(2.4rem,8vw,6rem)] font-bold leading-[0.9] tracking-tighter text-foreground'>
          {t('projects.title')}
        </h1>
      </div>

      <FilterCategorie />

      {!isLoading && visibleProjects.length === 0 ? (
        <EmptyState
          variant={categories && categories.length > 0 ? 'search' : 'default'}
          title={
            categories && categories.length > 0
              ? t('emptyState.projectsFiltered.title')
              : t('emptyState.projects.title')
          }
          description={
            categories && categories.length > 0
              ? t('emptyState.projectsFiltered.description')
              : t('emptyState.projects.description')
          }
          cta={
            categories && categories.length > 0
              ? {
                  label: t('emptyState.projectsFiltered.ctaLabel'),
                  href: t('emptyState.projectsFiltered.ctaHref'),
                }
              : {
                  label: t('emptyState.projects.ctaLabel'),
                  href: t('emptyState.projects.ctaHref'),
                }
          }
        />
      ) : (
        <div className='grid md:grid-cols-2 xl:grid-cols-3 max-w-[1191px] gap-5 w-full'>
          {isLoading
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className='flex flex-col bg-card rounded-2xl overflow-hidden border border-black/5 animate-pulse'>
                  <div className='w-full aspect-[16/9] bg-foreground/8' />
                  <div className='flex flex-col gap-3 p-5'>
                    <div className='h-3 bg-foreground/8 rounded w-1/3' />
                    <div className='h-4 bg-foreground/8 rounded w-3/4' />
                    <div className='h-4 bg-foreground/8 rounded w-1/2' />
                    <div className='flex items-center gap-3 pt-1'>
                      <div className='h-3 bg-foreground/8 rounded w-20' />
                      <div className='w-8 h-8 rounded-full bg-foreground/8' />
                    </div>
                  </div>
                </div>
              ))
            : visibleProjects.map((item, index) => (
                <ProjectItem
                  key={index}
                  src={item.image || undefined}
                  title={item.title || ''}
                  slug={item.slug}
                  desc={item.desc || ''}
                  date={item.date}
                  categories={item.categories}
                  tags={item.tags}
                />
              ))}
        </div>
      )}

      <div className='flex justify-center items-center gap-3 w-full pt-4'>
        {origin === 'home' && visibleProjects.length > 0 && (
          <Link
            href='/project'
            data-cursor
            className='inline-flex items-center gap-3 rounded-[2px] bg-foreground px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:bg-green-app'
          >
            {t('projects.viewAll')} <span aria-hidden>→</span>
          </Link>
        )}
        {origin === 'project' && (
          <>
            <button
              onClick={handleLoadLess}
              data-cursor
              className='rounded-[2px] border border-foreground/15 px-7 py-4 font-space text-sm uppercase tracking-widest text-foreground/60 transition-colors hover:border-green-app hover:text-green-app disabled:opacity-25'
              disabled={!canLoadLess}
            >
              {t('projects.loadLess')}
            </button>
            <button
              onClick={handleLoadMore}
              data-cursor
              className='inline-flex items-center gap-3 rounded-[2px] bg-foreground px-7 py-4 font-space text-sm font-semibold uppercase tracking-widest text-background transition-colors hover:bg-green-app disabled:opacity-25'
              disabled={!canLoadMore}
            >
              {t('projects.loadMore')} <span aria-hidden>↓</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
