import Link from 'next/link';
import SocialLink from '../SocialLink';
import SlaegaLogo from '../brand/SlaegaLogo';
import { useTranslations } from 'next-intl';
import { SiteConfig } from '@/shared/config/site-config';
import CarteCongoDecor from '@/components/CarteCongoDecor';
import LocaleSwitcher from '@/components/LocaleSwitcher';

function Footer() {
  const t = useTranslations();
  const currentYear = new Date().getUTCFullYear();

  return (
    <footer
      data-global-footer
      className="relative w-full overflow-hidden border-t border-foreground/10 bg-background font-space"
    >
      {/* Subtle Congo signature */}
      <CarteCongoDecor
        stroke="var(--green-app)"
        className="pointer-events-none absolute bottom-0 right-0 w-64 select-none md:w-[380px]"
        style={{
          zoom: '80%',
          opacity: 0.14,
          maskImage: 'linear-gradient(135deg, transparent 0%, black 60%)',
          WebkitMaskImage: 'linear-gradient(135deg, transparent 0%, black 60%)',
        }}
      />

      <div className="relative z-[1] mx-auto w-full max-w-content px-6 py-20 md:px-16">
        {/* CTA */}
        <div className="flex flex-col gap-8 border-b border-foreground/10 pb-16 md:flex-row md:items-end md:justify-between">
          <h2 className="max-w-[16ch] text-[clamp(2.2rem,6vw,4.5rem)] font-bold leading-[0.92] tracking-tighter text-foreground">
            {t('footer.cta.title').replace('\n', ' ')}
          </h2>
          <Link
            href={`mailto:${SiteConfig.email}`}
            data-cursor
            className="group inline-flex items-center gap-3 whitespace-nowrap text-lg text-foreground/70 transition-colors hover:text-green-app"
          >
            <span className="border-b border-foreground/20 pb-1 group-hover:border-green-app">
              {SiteConfig.email}
            </span>
            <span aria-hidden className="text-green-app transition-transform group-hover:translate-x-1">
              →
            </span>
          </Link>
        </div>

        {/* Brand + meta */}
        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <SlaegaLogo variant="vertical" className="items-start" />


          <div className="flex flex-col items-start gap-5 md:items-end">
            <div className="flex gap-5">
              <SocialLink href={SiteConfig.socialLinks.linkedin} icon="linkedin" />
              <SocialLink href={SiteConfig.socialLinks.github} icon="github" />
              <SocialLink href={SiteConfig.socialLinks.facebook} icon="facebook" />
              <SocialLink href={SiteConfig.socialLinks.instagram} icon="instagram" />
              <SocialLink href={SiteConfig.socialLinks.twitter} icon="twitter" />
            </div>
            <div className="flex items-center gap-6">
              <LocaleSwitcher />
              <span className="text-[11px] uppercase tracking-[0.2em] text-foreground/40">
                {t('footer.copyright', { year: currentYear })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
