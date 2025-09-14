"use client";
import { useCategories } from '@/hooks/useCategories';
import { getAllCategories } from '@/libs/posts';
import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

function FilterCategorie() {
    const router = useRouter();
    const { data: categories } = useCategories()
    const pathname = usePathname();
    const t = useTranslations('categories');
    const searchParams = useSearchParams();
    const category = searchParams.get("category") || '';
    const categoryList = category.split(',').filter(it => it)
    const filter = (cat?: string) => {
        const params = new URLSearchParams(searchParams.toString());
        console.log(categoryList)
        let currentCat = params.get('category')?.split(',') || []
        if (!cat) {
            params.delete("category");
            return params.toString()
        }
        const includes = currentCat.includes(cat)
        if (includes) {
            return currentCat.filter(it => it != cat).join(',')
        }
        currentCat.push(cat)
        return currentCat.join(',')

    }

    const handleClick = (cat?: string) => {
        const params = filter(cat)
        console.log(params);
        if (params) {
            router.replace(`${pathname}?category=${params}`, { scroll: false });

        } else {
            router.replace(`${pathname}`, { scroll: false });
        }
    };
    return (
        <div className='flex gap-3.5 w-full  flex-wrap justify-center seba'>
            {categories && categories.map((item, index) =>
                <button key={index} onClick={() => handleClick(item)}
                    className={`group relative px-5 py-2.5 border  border-black/5 transition-all duration-300 ${categoryList.find((it => it === item)) ? 'hover:text-foreground' : 'text-foreground  '}`}>
                    <span className={`absolute top-0 bg-black/5 left-0 bottom-0   transition-all duration-300 ${categoryList.find((it => it === item)) ? 'w-full group-hover:w-0 group-active:w-0' : 'w-0 group-hover:w-full'}`} />
                    <span className='z-[2] relative'>{t(item)}</span>
                </button>
            )}
        </div>
    )
}

export default FilterCategorie