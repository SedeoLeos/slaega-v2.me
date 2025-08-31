import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
 
const components: MDXComponents = {

  img: (props) => (<Image {...(props as ImageProps)} />)
}
 
export function useMDXComponents(): MDXComponents {
  return components
}