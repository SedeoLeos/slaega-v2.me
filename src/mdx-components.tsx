import type { MDXComponents } from 'mdx/types'
import Image, { ImageProps } from 'next/image'
 
const components: MDXComponents = {

  img: (props) => (<Image {...(props as ImageProps)} alt={props.alt||''} />)
}
 
export function useMDXComponents(): MDXComponents {
  return components
}