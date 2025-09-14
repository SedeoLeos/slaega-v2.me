import ContentWrapper from "@/components/Content/ContentWrapper";
import IllustrationBody from "@/components/Illustration/IllustrationBody";
import IllustrationProject from "@/components/Illustration/IllustrationProject";
import ProjectItem from "@/components/Projects/ProjectItem";
import { splitMarkdownByParagraphs } from "@/libs/matter";
import { getAllProjects, getPost, getPostPath } from "@/libs/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import Image from 'next/image'


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

  const data = await getAllProjects()
  const currentIndex = data.findIndex((item) => item.slug === slug)
  
  // 1. D'abord filtrer par similarité (catégories/tags)
  const similarProjects = data.filter((item) => item.slug !== slug)
    .filter((item) => item.categories.some((it) => meta.categories.includes(it)) || item.tags.some((it) => meta.tags.includes(it)))
  
  // 2. Puis trier par proximité de position dans la liste originale
  const sortByProximity = (projects: typeof similarProjects) => {
    return projects
      .map(project => {
        const projectIndex = data.findIndex(p => p.slug === project.slug)
        const distance = Math.min(
          Math.abs(projectIndex - currentIndex),
          data.length - Math.abs(projectIndex - currentIndex) // distance circulaire
        )
        return { project, distance }
      })
      .sort((a, b) => a.distance - b.distance)
      .map(item => item.project)
  }
  
  const posts = sortByProximity(similarProjects)


  return <article className="w-full  mx-auto  max-w-content min-h-screen px-2.5 py-20 lg:p-20 flex flex-col gap-5 lg:gap-10  items-center overflow-x-hidden">
    <div className="absolute lg:left-0 -left-3/5  opacity-30 lg:opacity-100">
      <IllustrationProject />
    </div>
    <div className="max-w-4xl w-full z-[2] flex flex-col gap-10">
      <Image width={369} height={198} src={meta.image || '/img.jpg'} alt='img' className="w-full  rounded-md " />
      <h1 className="text-4xl mb-4 pb-2  font-bold self-end lg:text-end">
        {meta.title}
      </h1>
    </div>
    <ContentWrapper 
      previewContent={<MDXRemote source={previewRaw} />}
      fullContent={<MDXRemote source={fullRaw} />}
    />
    <div className='grid md:grid-cols-2 xl:grid-cols-3  max-w-content-blog gap-5'>
      {posts.slice(0, 3).map((item, index) =>
        <ProjectItem
          key={index}
          src={item.image}
          title={item.title}
          slug={item.slug}
          desc={item.desc}
        />
      )}



    </div>
    <div className="absolute top-1/2 -right-3/5  opacity-30 lg:opacity-100 lg:right-0 ">
      <IllustrationBody />
    </div>
  </article>
}
