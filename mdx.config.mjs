import remarkGfm from 'remark-gfm'

/** @type {import('@next/mdx').MdxOptions} */
const mdxOptions = {
  remarkPlugins: [remarkGfm],
  rehypePlugins: [],
}

export default mdxOptions
