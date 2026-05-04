'use client';
import Link from 'next/link';
import NavItem from './NavItem';
import Drawer from '../icons/drawer';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SiteConfig } from '@/shared/config/site-config';

const Header = () => {
  const t = useTranslations();
  const [menu, setMenu] = useState(false);

  return (
    <div className='w-full backdrop-blur-xl bg-background/70 fixed justify-center flex z-30 border-b border-foreground/5'>
      <header className='w-full py-6 px-10 md:px-20 text-foreground font-poppins flex justify-between items-center max-w-content'>
        {/* Logo */}
        <Link href='/'>
          <h1 className='text-2xl font-extrabold text-green-app tracking-tight'>{SiteConfig.brand}</h1>
        </Link>

        {/* Desktop nav */}
        <nav className='2lg:flex hidden'>
          <ul className='flex text-sm font-medium gap-7'>
            {SiteConfig.navLinks.map((item, index) => (
              <NavItem
                key={index}
                href={item.href}
                text={t(item.i18nKey)}
                icon={"icon" in item ? item.icon : undefined}
              />
            ))}
          </ul>
        </nav>

        {/* Right actions */}
        <div className='flex items-center gap-8'>
          {/* Social abbreviations */}
          <div className='hidden md:flex gap-5 text-sm font-bold'>
            <Link
              href={SiteConfig.socialLinks.github}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-green-app transition-colors'
            >
              {t('header.social.github')}
            </Link>
            <Link
              href={SiteConfig.socialLinks.twitter}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-green-app transition-colors'
            >
              {t('header.social.twitter')}
            </Link>
            <Link
              href={SiteConfig.socialLinks.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              className='hover:text-green-app transition-colors'
            >
              {t('header.social.linkedin')}
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className='relative flex flex-col'>
            <button
              className='2lg:hidden flex text-3xl group'
              type='button'
              onClick={() => setMenu((prev) => !prev)}
              aria-label='Toggle menu'
            >
              <Drawer size={26} />
            </button>

            {/* Mobile dropdown */}
            <div className={`2lg:hidden absolute right-0 top-8 w-max ${!menu ? 'hidden' : 'flex'}`}>
              <ul className='flex flex-col p-4 mt-4 rounded-2xl border border-foreground/10 bg-background/95 backdrop-blur-xl shadow-xl gap-1 min-w-[180px]'>
                {SiteConfig.navLinks.map((item, index) => (
                  <NavItem
                    key={index}
                    href={item.href}
                    text={t(item.i18nKey)}
                    icon={"icon" in item ? item.icon : undefined}
                    onClick={() => setMenu(false)}
                  />
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>
    </div>
  );
};

export default Header;
