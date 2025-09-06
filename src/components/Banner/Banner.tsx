import Link from 'next/link'
import React from 'react'

function Banner() {
    return (

        <div className='self-center w-full max-w-content  justify-between sm:flex-col  flex py-10 lg:px-20 flex-wrap lg:flex-row gap-10 lg:gap-0 flex-col lg:flex-nowrap '>

            <div className='text-white uppercase -space-y-2'>
                <div className='w-[384px] h-[42]  bg-red-400 py-2 px-1'>1434 DESIGNED COMPLETED</div>
                <div className='w-[310px] h-[42]  bg-green-app py-2 px-1'>17 clients every month</div>
                <div className='w-[280px] h-[42]  bg-orange-300 py-2 px-1'>2 billion lines of code written</div>
                <div className='w-[173px] h-[42]  bg-red-950 px-2 py-1 '>1200+ clients</div>
            </div>


            <div className='w-full sm:w-md flex  bg-white self-end lg:self-center lg:absolute lg:right-0'>
                <div className='bg-black w-56'>

                </div>          
                <div className='p-3 sm:p-5'>
                    <p>Frontend Developer with a Passion for Responsive Web Design</p>
                    <Link href={""}>learn more</Link>
                </div>
            </div>
        </div>
    )
}

export default Banner