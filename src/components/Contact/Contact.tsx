import IllustrationContact from '../Illustration/IllustrationContact';
import SocialLinK from '../SocialLinK';
import { useTranslations } from 'next-intl';
import ContactForm from '../forms/contact-form';
import { SiteConfig } from '@/shared/config/site-config';

function Contact() {
  const t = useTranslations();

  return (
    <div className='w-full bg-white flex flex-col items-center justify-center overflow-hidden relative'>
      <div className='absolute left-0'><IllustrationContact /></div>
      <div className='lg:w-full max-w-content self-center flex py-40 lg:justify-between z-[2] px-10 lg:px-20 flex-col lg:flex-row gap-5'>
        <div className='sm:w-md gap-10 flex flex-col'>
          <h2 className='text-5xl'>{t('contact.title')}</h2>
          <p className='leading-8 text-lg'>{t('contact.description')}</p>
          <div className='flex gap-5'>
            <SocialLinK href={SiteConfig.socialLinks.linkedin} icon='linkedin' />
            <SocialLinK href={SiteConfig.socialLinks.github} icon='github' />
            <SocialLinK href={SiteConfig.socialLinks.facebook} icon='facebook' />
            <SocialLinK href={SiteConfig.socialLinks.instagram} icon='instagram' />
            <SocialLinK href={SiteConfig.socialLinks.twitter} icon='twitter' />
          </div>
        </div>
        <ContactForm />
      </div>
    </div>
  );
}

export default Contact;
