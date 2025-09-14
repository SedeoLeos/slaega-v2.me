'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import FilterCategorie from './FilterCategorie'
import { useProject } from '@/hooks/useProjects'
import { useSearchParams } from 'next/navigation'
import ProjectItem from './ProjectItem'
type ProjectListProps = {
    origin: 'home' | 'project'
}
function ProjectList(props: ProjectListProps) {

    const searchParams = useSearchParams();
    const category = searchParams.get("category");
    const categories = category?.split(',')
    const { data, fetchNextPage, hasNextPage,isLoading } = useProject({ categories })
    const [visiblePages, setVisiblePages] = useState(1)
    
    // Reset visible pages when categories change
    useEffect(() => {
        setVisiblePages(1)
    }, [categories])
    
    // Get only the visible pages
    const visibleProjects = data?.pages.slice(0, visiblePages).flat() || []
    
    const handleLoadMore = () => {
        if (data && visiblePages < data.pages.length) {
            // Show next page from already loaded data
            setVisiblePages(prev => prev + 1)
        } else if (hasNextPage) {
            // Fetch new page
            fetchNextPage().then(() => {
                setVisiblePages(prev => prev + 1)
            })
        }
    }
    
    const handleLoadLess = () => {
        if (visiblePages > 1) {
            setVisiblePages(prev => prev - 1)
        }
    }
    
    const canLoadMore = (data && visiblePages < data.pages.length) || hasNextPage
    const canLoadLess = visiblePages > 1
    
    return (
        <div className='w-full max-w-content flex py-20 px-10 md:px-20 flex-col gap-20 justify-center items-center self-center'>

            <div className='text-center space-y-1.5'>
                <h2 className='text-5xl font-extrabold '>Projects</h2>
                <span className='text-sm '>Some of my Work</span>
            </div>
            <FilterCategorie />

            <div className='grid md:grid-cols-2 xl:grid-cols-3  max-w-[1191px] gap-5'>
                {isLoading ? (
                    // Loader avec des squelettes de cartes
                    Array.from({ length: 6 }).map((_, index) => (
                        <div key={index} className="min-w-[240px] relative w-full h-[200px] border border-solid border-white/50 bg-black/5  overflow-hidden animate-pulse">
                            <div className="flex flex-col gap-1 px-6 py-5 w-full">
                                <div className="flex items-center max-w-max pr-2.5">
                                    <div className="h-4 bg-background rounded w-80"></div>
                                </div>
                                <div className="space-y-2">
                                    <div className="h-3 bg-background rounded w-full"></div>
                                    <div className="h-3 bg-background rounded w-3/4"></div>
                                </div>
                            </div>
                            <div className="absolute top-[110px] -right-10 rotate-[-5deg] w-[300px] h-[200px] bg-background rounded-md"></div>
                        </div>
                    ))
                ) : (
                    visibleProjects && visibleProjects.map((item, index) =>
                        <ProjectItem
                            key={index}
                            src={item.image || '/img.jpg'}
                            title={item.title || ''}
                            slug={item.slug}
                            desc={item.desc || ''}
                        />
                    )
                )}
            </div>
            <div className='flex justify-center items-center gap-8 w-full'>
                {props.origin === 'home' && <Link href={"/project"} className='bg-zinc-800 text-white py-4 px-8'>
                    View All
                </Link>}
                {props.origin === 'project' && <button onClick={handleLoadLess} className='bg-white text-zinc-800 py-4 px-8 disabled:opacity-25' disabled={!canLoadLess}>
                    Load Less
                </button>}
                {props.origin === 'project' && <button onClick={handleLoadMore} className='bg-zinc-800 text-white py-4 px-8 disabled:opacity-25' disabled={!canLoadMore}>
                    Load More
                </button>}
            </div>
        </div>
    )
}

export default ProjectList