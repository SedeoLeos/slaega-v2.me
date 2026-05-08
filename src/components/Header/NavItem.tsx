"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface NavItemProps {
  href: string;
  text: string;
  onClick?: () => void;
  /** When true, render an icon instead of the text label (used for Home). */
  icon?: "home";
}

export default function NavItem({ href, text, onClick, icon }: NavItemProps) {
  const pathname = usePathname();
  // Active when exact match (home only) or path starts with the href
  const isActive =
    href === "/"
      ? pathname === "/" || /^\/[a-z]{2}$/i.test(pathname ?? "")
      : pathname?.startsWith(href);

  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
        aria-label={text}
        title={text}
        className={`group flex flex-col gap-1.5 cursor-pointer transition-colors ${
          isActive ? "text-foreground" : "text-foreground/70 hover:text-foreground"
        }`}
      >
        {icon === "home" ? (
          <span className="inline-flex items-center justify-center h-5">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7 7 7m-9 9V11h4v10m4-9l2 2"
              />
            </svg>
          </span>
        ) : (
          <span className="leading-5">{text}</span>
        )}
        <div className="relative w-full h-0.5">
          <div className="bg-secondary/40 h-0.5" />
          <div
            className={`top-0 absolute h-full bg-green-app transition-all duration-300 ${
              isActive ? "w-full" : "w-0 group-hover:w-full"
            }`}
          />
        </div>
      </Link>
    </li>
  );
}
