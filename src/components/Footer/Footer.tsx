import Link from 'next/link'
import React from 'react'
import Gmail from '../icons/gmail'
import Linkden from '../icons/linkden'
import Sport from '../icons/sport'
import Facebook from '../icons/facebook'
import Instagram from '../icons/instagram'
import Tweeter from '../icons/tweeter'

function Footer() {
    return (

        <div className='mt-52 flex flex-col gap-y-10'>
            <div className='self-center max-w-content w-full px-20'>

                <div className='flex justify-between items-center'>

                    <h2 className='text-6xl max-w-lg'>
                        Let’s <br />
                        Work Together -
                    </h2>

                    <Link href={"mailto:smatsoula19@gmail.com"} className='py-4 px-10 border-zinc-800 border flex justify-center items-center gap-2'>
                        <Gmail />
                        <span>
                            smatsoula19@gmail.com
                        </span>
                    </Link>
                </div>

            </div>

            <div className='bg-zinc-800 w-full h-0.5'></div>
            <div className='self-center max-w-content w-full px-20 pb-5 flex justify-between items-center'>

                <div>
                    <span>
                        © 2025 All rights reserved.
                    </span>
                </div>
                <div className='flex gap-5'>
                    <Link href={""} className='p-2 rounded-full border-zinc-900 border aspect-square justify-center items-center flex'>
                        <Linkden />
                    </Link>
                    <Link href={""} className='p-2 rounded-full border-zinc-900 border aspect-square justify-center items-center flex'>
                        <Sport />
                    </Link>
                    <Link href={""} className='p-2 rounded-full border-zinc-900 border aspect-square justify-center items-center flex'>
                        <Facebook />
                    </Link>
                    <Link href={""} className='p-2 rounded-full border-zinc-900 border aspect-square justify-center items-center flex'>
                        <Instagram />
                    </Link>
                    <Link href={""} className='p-2 rounded-full border-zinc-900 border aspect-square justify-center items-center flex'>
                        <Tweeter />
                    </Link>
                </div>
            </div>

        </div>
    )
}

export default Footer