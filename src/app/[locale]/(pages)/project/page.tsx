import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ProjectList from '@/components/Projects/ProjectList';
import { Suspense } from 'react';
import { buildPageMetadata } from '@/shared/config/seo';

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: '/project',
    title: locale === 'en' ? 'Projects' : 'Projets',
    description:
      locale === 'en'
        ? 'Selected projects by Seba Gedeon Matsoula Malonga (slaega) — web, mobile, backend and cloud/DevOps: architecture, React/Next.js, NestJS, Kubernetes, IAM.'
        : 'Projets sélectionnés de Seba Gedeon Matsoula Malonga (slaega) — web, mobile, backend et cloud/DevOps : architecture, React/Next.js, NestJS, Kubernetes, IAM.',
    keywords: ['projets', 'portfolio', 'réalisations', 'architecture logicielle', 'full-stack'],
  });
}

export default async function ProjectPage() {
  const t = await getTranslations('common');
  return (
    <Suspense fallback={<div className="py-32 text-center text-foreground/50">{t('loading')}</div>}>
      <ProjectList origin="project" />
    </Suspense>
  );
}
