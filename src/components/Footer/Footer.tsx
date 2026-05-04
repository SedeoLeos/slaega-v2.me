import Link from 'next/link';
import React from 'react';
import SocialLink from '../SocialLink';
import { useTranslations } from 'next-intl';
import { SiteConfig } from '@/shared/config/site-config';

function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer className='flex flex-col w-full overflow-hidden'>
      {/* CTA Section */}
      <div className='self-center max-w-content w-full px-10 md:px-20 pt-16 pb-12'>
        <div className='flex justify-between items-center flex-col md:flex-row gap-8'>
          <h2 className='text-5xl md:text-6xl font-extrabold max-w-lg leading-tight'>
            {t('footer.cta.title').split('\n').map((line, index) => (
              <React.Fragment key={index}>
                {line}
                {index === 0 && <br />}
              </React.Fragment>
            ))}
          </h2>
          <Link
            href={`mailto:${SiteConfig.email}`}
            className='inline-flex items-center gap-3 border border-foreground/20 hover:border-foreground/50 rounded-2xl px-6 py-4 transition-colors group'
          >
            {/* Gmail icon */}
            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'>
              <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
              <polyline points='22,6 12,13 2,6' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' />
            </svg>
            <span className='text-sm font-medium'>{SiteConfig.email}</span>
          </Link>
        </div>
      </div>

      <hr className='bg-foreground/10 w-full h-px border-none mx-0' />

      {/* Bottom bar */}
      <div className='self-center max-w-content w-full px-10 md:px-20 py-6 flex justify-between items-center sm:flex-row flex-col gap-4'>
        <span className='text-sm text-foreground/50'>{t('footer.copyright', { year: currentYear })}</span>
        <div className='flex gap-5'>
          <SocialLink href={SiteConfig.socialLinks.linkedin} icon='linkedin' />
          <SocialLink href={SiteConfig.socialLinks.github} icon='github' />
          <SocialLink href={SiteConfig.socialLinks.facebook} icon='facebook' />
          <SocialLink href={SiteConfig.socialLinks.instagram} icon='instagram' />
          <SocialLink href={SiteConfig.socialLinks.twitter} icon='twitter' />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
