import Link from 'next/link';
import Linkedin from './icons/linkedin';
import Facebook from './icons/facebook';
import Instagram from './icons/instagram';
import Sport from './icons/sport';
import Twitter from './icons/twitter';
import Youtube from './icons/youtube';
import Github from './icons/github';

const MapIcon = {
  linkedin: Linkedin,
  facebook: Facebook,
  instagram: Instagram,
  twitter: Twitter,
  github: Github,
  youtube: Youtube,
  sport: Sport,
};

type SocialLinkProps = {
  icon: keyof typeof MapIcon;
  href: string;
};

function SocialLink(props: SocialLinkProps) {
  const Icon = MapIcon[props.icon];
  return (
    <Link
      href={props.href}
      className='rounded-full border border-foreground/15 hover:border-foreground/40 hover:bg-foreground/5 aspect-square justify-center items-center flex w-10 transition-all duration-200'
      target='_blank'
      rel='noopener noreferrer'
    >
      <Icon />
    </Link>
  );
}

export default SocialLink;
