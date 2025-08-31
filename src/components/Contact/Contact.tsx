import React from 'react'
import Linkden from '../icons/linkden'
import Sport from '../icons/sport'
import Facebook from '../icons/facebook'
import Instagram from '../icons/instagram'
import Tweeter from '../icons/tweeter'
import Link from 'next/link'
import IllustrationContact from '../Illustration/IllustrationContact'

function Contact() {
    return (
        <div className='w-full bg-white flex flex-col items-center justify-center'>
            <div className='absolute left-0'>
                <IllustrationContact />
            </div>
            <div className='w-full max-w-content self-center flex py-40 justify-between z-[2] px-20'>

                <div className='max-w-md gap-10 flex flex-col'>
                    <h2 className='text-5xl'>Let’s work together</h2>
                    <p className='leading-8 text-lg'>
                        This is a template Figma file, turned into code using Anima. Learn more at AnimaApp.com This is a template Figma file, turned into code using Anima. Learn more at AnimaApp.com
                    </p>
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


                <div>
                    <form action="" method="post" className='flex flex-col gap-7'>
                        <input type="email" name="" id="" />
                        <input type="name" name="" id="" />
                        <textarea></textarea>

                        <button type="submit" className='self-start outline-0 px-12 py-4 bg-zinc-900 text-white'>
                            Submit
                        </button>
                    </form>

                </div>


            </div>

        </div>
    )
}

export default Contact