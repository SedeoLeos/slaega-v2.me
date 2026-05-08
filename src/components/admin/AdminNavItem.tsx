"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AdminNavItemProps {
  href: string;
  children: ReactNode;
  exact?: boolean;
  external?: boolean;
}

export default function AdminNavItem({ href, children, exact, external }: AdminNavItemProps) {
  const pathname = usePathname();
  const isActive = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
        isActive
          ? "bg-zinc-800 text-white"
          : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
      }`}
    >
      {children}
    </Link>
  );
}
