import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import ReactMarkdown from 'react-markdown'
type ProjectItemProps = {
    src: string,
    title:string,
    desc:string,
    slug:string,
}
export default function ProjectItem(props:ProjectItemProps) {
    return (
        <Link className="group relative min-w-[240px] w-full h-[200px] border border-solid border-white/20 bg-black/5  overflow-hidden transition-all duration-100 ease-out justify-self-start focus-visible:outline-none focus-visible:shadow-focus-ring" href={"/project/" +props.slug}><div className="flex flex-col gap-1 px-6 py-5">
            <div className="flex items-center max-w-max pr-2.5">
                <h3 className="text-heading-16 font-medium m-0 w-max whitespace-nowrap overflow-hidden text-ellipsis flex-1 mr-0">{props.title}</h3>
                <svg className="rotate-[-45deg] translate-x-[-2px] opacity-0 transition-all duration-100 ease-out origin-center group-hover:opacity-100 group-hover:rotate-[-45deg] group-hover:translate-x-[4px]" data-testid="geist-icon" height="16" strokeLinejoin="round" viewBox="0 0 16 16" width="16" style={{ width: '12px', height: '12px', color: 'currentcolor' }}><path fillRule="evenodd" clipRule="evenodd" d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z" fill="currentColor"></path></svg>
            </div>
            <div className="text-label-14 text-gray-800 m-0 line-clamp-2 text-pretty description">
                <ReactMarkdown>{props.desc}</ReactMarkdown>
            </div>
        </div>
            <Image alt={props.title} loading="lazy" width="300" height="100" decoding="async" data-nimg="1" className="absolute top-[110px] -right-10 rotate-[-5deg] border border-solid border-gray-300 rounded-md transition-transform duration-100 ease-out group-hover:-rotate-3 group-hover:-translate-y-1 group-hover:-translate-x-0.5"
                src={props.src}
                style={{ color: "transparent", boxShadow: "var(--shadow-small)" }}
            />
        </Link>
    )
}
