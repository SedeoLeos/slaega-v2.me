import React from 'react'
import Light from '../icons/light'
import Illustation from '../Illustration/Illustation'
import { useTranslations } from 'next-intl'

function Service() {
    const t = useTranslations()
    
    return (
        <div className='bg-neutral-500 min-h-screen flex justify-center relative'>
            <div className="absolute -right-1/2 sm:right-0 -top-[calc(720px/2)] opacity-25 sm:opacity-100">
                <Illustation />
            </div>
            <div className='w-full max-w-content  text-white py-20 px-10 lg:px-20 flex flex-col gap-20 justify-center items-center  relative'>
                <div className='text-center space-y-1.5'>
                    <h2 className='text-5xl font-extrabold '>{t('services.title')}</h2>
                    <span className='text-sm '>{t('services.subtitle')}</span>
                </div>

                <div className='grid md:grid-cols-2 xl:grid-cols-3  max-w-[1044px] gap-7'>
                    {t.raw('services.items').map((service: any, index: number) =>
                        <div key={index} className={`self-center  place-self-center gap-5 flex flex-col p-7 border-stone-900 relative  ${index===3 ? 'md:col-span-2 md:max-w-full md:h-full':'md:max-w-80'} `}>
                            <div className='aspect-square w-10 bg-accent flex justify-center items-center rounded-lg z-[2]'>
                                <Light />
                            </div>
                            <h4 className='z-[2]'>{service.title}</h4>
                            <p className='text-gray-200 z-[2]'>
                                {service.description}
                            </p>
                            <div className='bg-gradient-to-br from-zinc-900/50 to-zinc-950/100 mix-blend-plus-lighter absolute top-0 left-0 right-0 bottom-0 z-0 border-stone-900 border-2 rounded-xl'></div>
                        </div>)}
                </div>
            </div>
        </div>
    )
}

export default Service