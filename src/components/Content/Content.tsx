'use client'

import { useState } from 'react'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

export default function Content({
  previewSource,
  fullSource,
}: {
  previewSource: MDXRemoteSerializeResult
  fullSource: MDXRemoteSerializeResult
}) {
  const [showMore, setShowMore] = useState(false)
  const handleToogle = () => setShowMore(!showMore)

  return (
    <div className="max-w-content-blog z-[2] project py-2.5 lg:py-10 lg:px-20 px-2.5  flex flex-col">
      <MDXRemote {...previewSource} />

      {showMore && <MDXRemote {...fullSource} />}

      <button
        onClick={handleToogle}
        className="mt-4 bg-black text-white px-4 py-2 rounded w-max"
      >
        {showMore ? 'Voir moins ↑' : 'Lire plus ↓'}
      </button>
    </div>
  )
}
