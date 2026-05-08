import IllustrationContact from '../Illustration/IllustrationContact';
import SocialLink from '../SocialLink';
import { useTranslations } from 'next-intl';
import ContactForm from '../forms/contact-form';
import { SiteConfig } from '@/shared/config/site-config';

function Contact() {
  const t = useTranslations();

  return (
    <div className='w-full bg-white flex flex-col items-center justify-center overflow-hidden relative'>
      <div className='absolute left-0 opacity-30 pointer-events-none'>
        <IllustrationContact />
      </div>

      <div className='lg:w-full max-w-content self-center flex py-24 lg:py-32 lg:justify-between z-[2] px-10 lg:px-20 flex-col lg:flex-row gap-12'>
        {/* Left: info */}
        <div className='lg:max-w-sm flex flex-col gap-8'>
          <div className='space-y-3'>
            <h2 className='text-5xl font-extrabold leading-tight'>{t('contact.title')}</h2>
            <p className='leading-7 text-foreground/60'>{t('contact.description')}</p>
          </div>

          <div className='space-y-3'>
            <p className='text-xs font-semibold uppercase tracking-widest text-foreground/40'>{t('contact.findMeOn')}</p>
            <div className='flex gap-4'>
              <SocialLink href={SiteConfig.socialLinks.linkedin} icon='linkedin' />
              <SocialLink href={SiteConfig.socialLinks.github} icon='github' />
              <SocialLink href={SiteConfig.socialLinks.facebook} icon='facebook' />
              <SocialLink href={SiteConfig.socialLinks.instagram} icon='instagram' />
              <SocialLink href={SiteConfig.socialLinks.twitter} icon='twitter' />
            </div>
          </div>

          {/* Email badge */}
          <a
            href={`mailto:${SiteConfig.email}`}
            className='inline-flex items-center gap-3 bg-foreground/5 hover:bg-foreground/10 transition-colors rounded-2xl px-4 py-3 w-fit'
          >
            <div className='w-9 h-9 rounded-xl bg-green-app flex items-center justify-center flex-shrink-0'>
              <svg width='16' height='16' viewBox='0 0 24 24' fill='none'>
                <path d='M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
                <polyline points='22,6 12,13 2,6' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' />
              </svg>
            </div>
            <span className='text-sm font-medium text-foreground/70'>{SiteConfig.email}</span>
          </a>
        </div>

        {/* Right: form */}
        <ContactForm />
      </div>
    </div>
  );
}

export default Contact;
