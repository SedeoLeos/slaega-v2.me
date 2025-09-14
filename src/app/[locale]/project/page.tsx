import ProjectList from '@/components/Projects/ProjectList'
import React, { Suspense } from 'react'

function PojectPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ProjectList origin='project' />
    </Suspense>
  )
}

export default PojectPage