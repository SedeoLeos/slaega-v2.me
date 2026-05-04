'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FilterCategorie from './FilterCategorie';
import { useProject } from '@/hooks/useProjects';
import { useSearchParams } from 'next/navigation';
import ProjectItem from './ProjectItem';
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
    <div className='w-full max-w-content flex py-20 px-10 md:px-20 flex-col gap-10 justify-center items-center self-center'>
      <div className='text-center space-y-1.5'>
        <h2 className='text-5xl font-extrabold'>{t('projects.title')}</h2>
        <span className='text-sm'>{t('projects.subtitle')}</span>
      </div>

      <FilterCategorie />

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
                src={item.image || '/img.jpg'}
                title={item.title || ''}
                slug={item.slug}
                desc={item.desc || ''}
                date={item.date}
              />
            ))}
      </div>

      <div className='flex justify-center items-center gap-4 w-full pt-4'>
        {origin === 'home' && (
          <Link
            href='/project'
            className='inline-flex items-center gap-2 bg-foreground text-background py-3.5 px-8 rounded-full font-semibold text-sm hover:bg-foreground/80 transition-colors'
          >
            View All Projects
          </Link>
        )}
        {origin === 'project' && (
          <>
            <button
              onClick={handleLoadLess}
              className='py-3.5 px-8 rounded-full border border-foreground/20 text-sm font-semibold text-foreground/60 hover:text-foreground hover:border-foreground/50 disabled:opacity-25 transition-colors'
              disabled={!canLoadLess}
            >
              Load Less
            </button>
            <button
              onClick={handleLoadMore}
              className='inline-flex items-center gap-2 bg-foreground text-background py-3.5 px-8 rounded-full font-semibold text-sm hover:bg-foreground/80 disabled:opacity-25 transition-colors'
              disabled={!canLoadMore}
            >
              Load More
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
