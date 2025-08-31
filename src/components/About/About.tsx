import Link from 'next/link'
import React from 'react'

export default function About() {
    return (
        <div className='flex justify-center items-center flex-col max-w-content self-center w-full gap-10 p-10 font-poppins'>
            <div className='text-center space-y-1.5'>
                <h2 className='text-5xl font-extrabold '>About</h2>
                <span className='text-sm font-semibold'>Get to know me</span>

            </div>
            <div className='max-w-3xl text-center space-y-5 text-base leading-7'>
                <p>
                    Hi there! I&apos;m Seba Gedeon, a data scientist specializing in data analytics, predictive modeling, natural language processing, machine learning, and AI chatbots. With a passion for unraveling insights from complex datasets, I&apos;m dedicated to helping businesses make informed decisions and stay ahead in today&apos;s data-driven world.
                </p>
                <p>
                    I bring a blend of technical expertise, hands-on experience, and a commitment to clear communication to every project. Whether it&apos;s uncovering hidden patterns, predicting future trends, or automating processes with AI, I&apos;m here to help you harness the full potential of your data.
                </p>
                <p>
                    Let&apos;s work together to transform your data into actionable insights that drive real results. Get in touch, and let&apos;s start unlocking the power of your data today!
                </p>
            </div>

            <Link href={""} className='bg-zinc-800 text-white py-4 px-8'>
            Download Resume
            </Link>
        </div>
    )
}
