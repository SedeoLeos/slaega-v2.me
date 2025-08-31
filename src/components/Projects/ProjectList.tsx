import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import Arrow60 from '../icons/arrow60'
function ProjectList() {
    return (
        <div className='w-full max-w-content flex py-20  flex-col gap-20 justify-center items-center self-center'>

            <div className='text-center space-y-1.5'>
                <h2 className='text-5xl font-extrabold '>Projects</h2>
                <span className='text-sm '>Some of my Work</span>
            </div>

            <div className='grid md:grid-cols-2 xl:grid-cols-3  max-w-[1191px] gap-5'>
                {Array.from({ length: 6 }).map((item, index) =>
                    <div key={index} className='self-center  place-self-center  flex flex-col p-7 border-stone-900 relative  '>

                        <Image width={369} height={198} src={'/img.jpg'} alt='img' />
                        <div className='bg-background -mt-7 mx-1 py-2 px-4 flex flex-col gap-5 shadow-[0_4px_8px_0_rgba(0,0,0,0.04)]'>
                            <div className='flex gap-2.5 text-neutral-600 font-light items-center'>
                                <span>April 24, 2025 </span>
                                <span className='w-1.5 aspect-square bg-accent'></span>
                                <span>5min read</span>

                            </div>
                            <h4 className=''> Designing for Compliance: ISO 13485 in Action</h4>
                            <div className='flex items-center w-5/6 justify-between'>
                            <Link href={""} className='text-accent'>Read More</Link>
                            <Link href={""} className='w-9 h-9 rounded-full bg-accent justify-center items-center flex'>
                                <Arrow60/>
                            </Link>
                            </div>
                           
                        </div>

                    </div>)}



            </div>

            <Link href={""} className='bg-zinc-800 text-white py-4 px-8'>
                    View All
            </Link>
        </div>
    )
}

export default ProjectList