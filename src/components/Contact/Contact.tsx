import React from 'react'
import IllustrationContact from '../Illustration/IllustrationContact'
import SocialLinK from '../SocialLinK'

function Contact() {
    return (
        <div className='w-full bg-white flex flex-col items-center justify-center overflow-hidden relative'>
            <div className='absolute left-0'>
                <IllustrationContact />
            </div>
            <div className='lg:w-full max-w-content  self-center flex py-40   lg:justify-between  z-[2] px-10 lg:px-20 flex-col lg:flex-row  gap-5'>

                <div className='sm:w-md gap-10 flex flex-col'>
                    <h2 className='text-5xl'>Let’s work together</h2>
                    <p className='leading-8 text-lg'>
                        This is a template Figma file, turned into code using Anima. Learn more at AnimaApp.com This is a template Figma file, turned into code using Anima. Learn more at AnimaApp.com
                    </p>
                    <div className='flex gap-5'>
                        <SocialLinK href={""} icon='linkden' />
                        <SocialLinK href={""} icon='sport' />
                        <SocialLinK href={""} icon='facebook' />
                        <SocialLinK href={""} icon='instagram' />
                        <SocialLinK href={""} icon='tweeter' />
                    </div>

                </div>


                <form action="" method="post" className='flex flex-col gap-7 items-center flex-1 max-w-2xl '>
                    <input type="email" name="" id="" className=' border-zinc-400 border focus-visible:border-0 focus-visible:outline-2 focus-visible:outline-zinc-400' placeholder='Email' />
                    <input type="name" name="" id="" placeholder='Name' className=' border-zinc-400 border focus-visible:border-0 focus-visible:outline-2 focus-visible:outline-zinc-400' />
                    <textarea placeholder='Content' className=' border-zinc-400 border focus-visible:border-0 focus-visible:outline-2 focus-visible:outline-zinc-400'></textarea>

                    <button type="submit" className='self-start outline-0 px-12 py-4 bg-zinc-900 text-white'>
                        Submit
                    </button>
                </form>



            </div>

        </div>
    )
}

export default Contact