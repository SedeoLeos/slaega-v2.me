import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

export default async function About() {
  const t = await getTranslations();

  return (
    <div className='flex justify-center items-center flex-col max-w-content self-center w-full gap-10 px-10 py-20 lg:px-20 font-poppins z-[2] relative'>
      {/* Heading */}
      <div className='text-center space-y-2'>
        <h2 className='text-5xl font-extrabold'>{t('about.title')}</h2>
        <span className='text-sm font-medium text-foreground/50'>{t('about.subtitle')}</span>
      </div>

      {/* Body */}
      <div className='max-w-3xl text-center space-y-5 text-base leading-7 text-foreground/75'>
        <p>{t('about.paragraph1')}</p>
        <p>{t('about.paragraph2')}</p>
        <p>{t('about.paragraph3')}</p>
      </div>

      {/* CTA */}
      <Link
        href='/contact'
        className='inline-flex items-center gap-2 bg-foreground text-background py-3.5 px-8 rounded-full font-semibold text-sm hover:bg-foreground/80 transition-colors'
      >
        {t('about.downloadResume')}
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.53033 2.21968L9 1.68935L7.93934 2.75001L8.46967 3.28034L12.4393 7.25001H1.75H1V8.75001H1.75H12.4393L8.46967 12.7197L7.93934 13.25L9 14.3107L9.53033 13.7803L14.6036 8.70711C14.9941 8.31659 14.9941 7.68342 14.6036 7.2929L9.53033 2.21968Z"
            fill="currentColor"
          />
        </svg>
      </Link>
    </div>
  );
}
