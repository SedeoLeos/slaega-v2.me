import Link from 'next/link'
import React from 'react'
import { useTranslations } from 'next-intl'

export default function About() {
    const t = useTranslations()
    
    return (
        <div className='flex justify-center items-center flex-col max-w-content self-center w-full gap-10 p-10 font-poppins z-[2] relative'>
            <div className='text-center space-y-1.5'>
                <h2 className='text-5xl font-extrabold '>{t('about.title')}</h2>
                <span className='text-sm font-semibold'>{t('about.subtitle')}</span>
            </div>
            <div className='max-w-3xl text-center space-y-5 text-base leading-7'>
                <p>
                    {t('about.paragraph1')}
                </p>
                <p>
                    {t('about.paragraph2')}
                </p>
                <p>
                    {t('about.paragraph3')}
                </p>
            </div>

            <Link href={""} className='bg-zinc-800 text-white py-4 px-8'>
                {t('about.downloadResume')}
            </Link>
        </div>
    )
}
