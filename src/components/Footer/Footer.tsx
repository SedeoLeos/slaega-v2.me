import Link from 'next/link'
import React from 'react'
import Gmail from '../icons/gmail'
import SocialLinK from '../SocialLinK'
import { useTranslations } from 'next-intl'

function Footer() {
    const t = useTranslations()
    
    return (

        <footer className='lg:mt-52 p-5 flex flex-col gap-y-10 w-full overflow-hidden'>
            <div className='self-center max-w-content w-full px-5 md:px-20'>

                <div className='flex justify-between items-center flex-col md:flex-row gap-5'>

                    <h2 className='text-6xl max-w-lg'>
                        {t('footer.cta.title').split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                {index === 0 && <br />}
                            </React.Fragment>
                        ))}
                    </h2>

                    <Link href={`mailto:${t('footer.cta.email')}`} className='py-4 px-10 border-zinc-800 border flex justify-center items-center gap-2'>
                        <Gmail />
                        <span>
                            {t('footer.cta.email')}
                        </span>
                    </Link>
                </div>

            </div>

            <hr className='bg-zinc-800 w-full h-0.5'/>
            <div className='self-center max-w-content w-full px-20  flex justify-between items-center sm:flex-row flex-col gap-5 '>

                <div className=''>
                    <span>
                        {t('footer.copyright')}
                    </span>
                </div>
                <div className='flex gap-5 '>
                    <SocialLinK href={""} icon='linkden'/>                    
                    <SocialLinK href={""} icon='sport' />                  
                    <SocialLinK href={""} icon='facebook' />
                    <SocialLinK href={""} icon='instagram' />
                    <SocialLinK href={""} icon='tweeter' />
                </div>
            </div>

        </footer>
    )
}

export default Footer