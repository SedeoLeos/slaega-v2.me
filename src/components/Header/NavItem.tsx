import Link from "next/link";

export interface NavItemProps {
  href: string;
  text: string;
  onClick?: () => void;
}

export default function NavItem({ href, text, onClick }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        className="flex items-center px-3 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg transition-all duration-200 group"
      >
        {text}
      </Link>
    </li>
  );
}
