import Arrow60 from "@/components/icons/arrow60";
import IllustrationBody from "@/components/Illustration/IllustrationBody";
import IllustrationProject from "@/components/Illustration/IllustrationProject";
import { getAllPosts, getPost } from "@/libs/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from 'next/image'
import Link from "next/link";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  const { content, meta } = getPost(slug)
  const posts = getAllPosts()


  return <article className="w-full  mx-auto  maw-w-content min-h-screen p-20 flex flex-col gap-4  items-center">
    <div className="absolute left-0 ">
      <IllustrationProject />
    </div>
    <div className="w-5/6 z-[2] flex flex-col gap-10">
      <Image width={369} height={198} src={meta.image || '/img.jpg'} alt='img' className="w-full" />
      <h1 className="text-4xl mb-4 pb-2  font-bold self-end">{meta.title}</h1>
    </div>
    <div className="max-w-content-blog z-[2] project">
      <MDXRemote source={content} />
    </div>
    <div className='grid md:grid-cols-2 xl:grid-cols-3  max-w-[1191px] gap-5'>
                {posts.slice(0 ,3).map((item, index) =>
                    <div key={index} className='self-center  place-self-center  flex flex-col p-7 border-stone-900 relative  '>

                        <Image 
                        width={369} height={198} 
                        src={item.image || '/img.jpg'} alt='img'
                        placeholder={'data:image/img.jpg'}
                         />
                        <div className='bg-background -mt-7 mx-1 py-2 px-4 flex flex-col gap-5 shadow-[0_4px_8px_0_rgba(0,0,0,0.04)]'>
                            <div className='flex gap-2.5 text-neutral-600 font-light items-center'>
                                <span>{new Date(item.date|| '2025-01-15').toDateString()}</span>
                                <span className='w-1.5 aspect-square bg-accent'></span>
                                <span>5min read</span>

                            </div>
                            <h4 className=''> {item.title || ''}</h4>
                            <div className='flex items-center w-5/6 justify-between'>
                            <Link href={`fr/project/${item.slug}`} className='text-accent'>Read More</Link>
                            <Link href={`fr/project/${item.slug}`} className='w-9 h-9 rounded-full bg-accent justify-center items-center flex'>
                                <Arrow60/>
                            </Link>
                            </div>
                           
                        </div>

                    </div>)}



            </div>
    <div className="absolute top-1/2 right-0">
      <IllustrationBody />
    </div>
  </article>
}

// export function generateStaticParams() {
//   return [{ slug: 'welcome' }, { slug: 'about' }]
// }

// export const dynamicParams = false