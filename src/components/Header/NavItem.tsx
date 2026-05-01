import Link from 'next/link';

export interface NavItemProps {
  href: string;
  text: string;
  onClick?: () => void;
}

export default function NavItem({ href, text, onClick }: NavItemProps) {
  return (
    <li>
      <Link href={href} onClick={onClick} className='flex flex-col group drawer-group gap-2 cursor-pointer'>
        {text}
        <div className='relative w-full h-0.5'>
          <div className='bg-secondary h-0.5' />
          <div className='top-0 absolute h-full w-0 group-hover:w-full bg-accent transition-all duration-300' />
        </div>
      </Link>
    </li>
  );
}
