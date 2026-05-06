import { getTranslations } from 'next-intl/server';
import ProjectList from '@/components/Projects/ProjectList';
import { Suspense } from 'react';

export const dynamic = "force-dynamic";

export default async function ProjectPage() {
  const t = await getTranslations('common');
  return (
    <Suspense fallback={<div className="py-32 text-center text-foreground/50">{t('loading')}</div>}>
      <ProjectList origin="project" />
    </Suspense>
  );
}
