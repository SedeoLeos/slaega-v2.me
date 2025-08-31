import IllustrationBody from "@/components/Illustration/IllustrationBody";
import IllustrationProject from "@/components/Illustration/IllustrationProject";
import { getPost } from "@/libs/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  console.log(slug);
  const { content } = getPost(slug)


  return <article className="w-full max-w-content-blog mx-auto  min-h-screen p-20 flex flex-col gap-4 project">
    <div className="absolute left-0">
      <IllustrationProject />
    </div>
    <MDXRemote source={content} />
    <div className="absolute top-1/2 right-0">
      <IllustrationBody />
    </div>
  </article>
}

// export function generateStaticParams() {
//   return [{ slug: 'welcome' }, { slug: 'about' }]
// }

// export const dynamicParams = false