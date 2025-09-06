import Content from "@/components/Content/Content";
import Arrow60 from "@/components/icons/arrow60";
import IllustrationBody from "@/components/Illustration/IllustrationBody";
import IllustrationProject from "@/components/Illustration/IllustrationProject";
import { splitMarkdownByParagraphs } from "@/libs/matter";
import { getAllPosts, getPost, getPostPath } from "@/libs/posts";
import { serialize } from "next-mdx-remote/serialize";
import Image from 'next/image'
import Link from "next/link";


export async function generateStaticParams() {

  const paths = getPostPath()

  return {
    paths,
    fallback: false,
  }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {

  const paramWait = await params;
  const slug = paramWait.slug;
  const { content, meta } = await getPost(slug)

  const [previewRaw, fullRaw] = splitMarkdownByParagraphs(content, 5)

  const previewSource = await serialize(previewRaw || '')
  const fullSource = await serialize(fullRaw || '')

  const posts = await getAllPosts()


  return <article className="w-full  mx-auto  max-w-content min-h-screen p-2.5 lg:p-20 flex flex-col gap-5 lg:gap-10  items-center overflow-x-hidden">
    <div className="absolute lg:left-0 -left-3/5  opacity-30 lg:opacity-100">
      <IllustrationProject />
    </div>
    <div className="max-w-4xl w-full z-[2] flex flex-col gap-10">
      <Image width={369} height={198} src={meta.image || '/img.jpg'} alt='img' className="w-full" />
      <h1 className="text-4xl mb-4 pb-2  font-bold self-end lg:text-end">{meta.title}
        {meta.title}
      </h1>
    </div>
    <Content previewSource={previewSource} fullSource={fullSource} />
    <div className='grid md:grid-cols-2 xl:grid-cols-3  max-w-[1191px] gap-5'>
      {posts.slice(0, 3).map((item, index) =>
        <div key={index} className='self-center  place-self-center  flex flex-col p-7 border-stone-900 relative  '>

          <Image
            width={369} height={198}
            src={item.image || '/img.jpg'} alt='img'
            placeholder={'data:image/img.jpg'}
          />
          <div className='bg-background -mt-7 mx-1 py-2 px-4 flex flex-col gap-5 shadow-[0_4px_8px_0_rgba(0,0,0,0.04)]'>
            <div className='flex gap-2.5 text-neutral-600 font-light items-center'>
              <span>{new Date(item.date || '2025-01-15').toDateString()}</span>
              <span className='w-1.5 aspect-square bg-accent'></span>
              <span>5min read</span>

            </div>
            <h4 className=''> {item.title || ''}</h4>
            <div className='flex items-center w-5/6 justify-between'>
              <Link href={`fr/project/${item.slug}`} className='text-accent'>Read More</Link>
              <Link href={`fr/project/${item.slug}`} className='w-9 h-9 rounded-full bg-accent justify-center items-center flex'>
                <Arrow60 />
              </Link>
            </div>

          </div>

        </div>)}



    </div>
    <div className="absolute top-1/2 -right-3/5  opacity-30 lg:opacity-100 lg:right-0 ">
      <IllustrationBody />
    </div>
  </article>
}
