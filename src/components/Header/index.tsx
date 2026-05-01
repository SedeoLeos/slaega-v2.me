'use client';
import Link from 'next/link';
import NavItem from './NavItem';
import Drawer from '../icons/drawer';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { SiteConfig } from '@/shared/config/site-config';
import Github from '../icons/github';
import Tweeter from '../icons/tweeter';
import Linkden from '../icons/linkden';

const SocialIconMap = {
  github: { Icon: Github, href: SiteConfig.socialLinks.github },
  twitter: { Icon: Tweeter, href: SiteConfig.socialLinks.twitter },
  linkedin: { Icon: Linkden, href: SiteConfig.socialLinks.linkedin },
};

const Header = () => {
  const t = useTranslations();
  const [menu, setMenu] = useState(false);

  return (
    <div className="w-full backdrop-blur-xl bg-background/70 border-b border-foreground/5 fixed justify-center flex z-30">
      <header className="w-full py-5 px-6 md:px-20 text-foreground font-poppins flex justify-between items-center max-w-content">
        <Link href="/">
          <h1 className="text-xl font-bold text-green-app tracking-tight">Slaega</h1>
        </Link>

        <nav className="2lg:flex hidden">
          <ul className="flex text-sm font-medium gap-1">
            {SiteConfig.navLinks.map((item, index) => (
              <NavItem key={index} href={item.href} text={t(item.i18nKey)} />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-4">
          {/* Social icons */}
          <div className="hidden md:flex gap-2 items-center">
            {Object.entries(SocialIconMap).map(([key, { Icon, href }]) => (
              <Link
                key={key}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-lg border border-foreground/10 flex items-center justify-center hover:border-foreground/30 hover:bg-foreground/5 transition-all"
                aria-label={key}
              >
                <Icon size={14} />
              </Link>
            ))}
          </div>

          {/* Mobile menu */}
          <div className="relative flex flex-col 2lg:hidden">
            <button
              className="flex text-foreground/70 hover:text-foreground transition-colors"
              type="button"
              onClick={() => setMenu((prev) => !prev)}
            >
              <Drawer size={22} />
            </button>
            <div className={`absolute right-0 top-8 w-56 ${!menu ? 'hidden' : 'flex'} z-50`}>
              <ul className="w-full flex flex-col p-2 bg-background/95 backdrop-blur-xl border border-foreground/10 rounded-xl shadow-xl gap-0.5">
                {SiteConfig.navLinks.map((item, index) => (
                  <NavItem key={index} href={item.href} text={t(item.i18nKey)} onClick={() => setMenu(false)} />
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
