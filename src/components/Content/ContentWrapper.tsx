'use client'

import { useState, ReactNode } from 'react'

interface ContentWrapperProps {
  previewContent: ReactNode
  fullContent: ReactNode
}

export default function ContentWrapper({ previewContent, fullContent }: ContentWrapperProps) {
  const [showMore, setShowMore] = useState(false)
  const handleToggle = () => setShowMore(!showMore)

  return (
    <div className="max-w-content-blog z-[2] project py-2.5 lg:py-10 lg:px-20 px-2.5 flex flex-col">
      {previewContent}

      {showMore && fullContent}

      <div className={`h-40 p-20 flex justify-center items-start ${showMore ? '' : 'more -mt-20'}`}>
        <button
          onClick={handleToggle}
          className="mt-4 bg-zinc-800 text-white px-8 py-4 w-max"
        >
          {showMore ? 'Voir moins ↑' : 'Lire plus ↓'}
        </button>
      </div>
    </div>
  )
}
