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
              <div key={i} className='min-w-[240px] relative w-full h-[200px] border border-solid border-white/50 bg-black/5 overflow-hidden animate-pulse'>
                <div className='flex flex-col gap-1 px-6 py-5 w-full'>
                  <div className='flex items-center max-w-max pr-2.5'>
                    <div className='h-4 bg-background rounded w-80' />
                  </div>
                  <div className='space-y-2'>
                    <div className='h-3 bg-background rounded w-full' />
                    <div className='h-3 bg-background rounded w-3/4' />
                  </div>
                </div>
                <div className='absolute top-[110px] -right-10 rotate-[-5deg] w-[300px] h-[200px] bg-background rounded-md' />
              </div>
            ))
          : visibleProjects.map((item, index) => (
              <ProjectItem
                key={index}
                src={item.image || '/img.jpg'}
                title={item.title || ''}
                slug={item.slug}
                desc={item.desc || ''}
              />
            ))}
      </div>

      <div className='flex justify-center items-center gap-8 w-full pt-4'>
        {origin === 'home' && (
          <Link href='/project' className='bg-zinc-800 text-white py-4 px-8'>
            View All
          </Link>
        )}
        {origin === 'project' && (
          <>
            <button onClick={handleLoadLess} className='bg-white text-zinc-800 py-4 px-8 disabled:opacity-25' disabled={!canLoadLess}>
              Load Less
            </button>
            <button onClick={handleLoadMore} className='bg-zinc-800 text-white py-4 px-8 disabled:opacity-25' disabled={!canLoadMore}>
              Load More
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProjectList;
