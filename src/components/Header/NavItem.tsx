import Link from "next/link";
import React from "react";
export interface NavItemProps {
  href: string;
  text: string;
}
export default function NavItem(props: NavItemProps) {
  return (
    <li >
      <Link href={props.href} className="flex flex-col group drawer-group  gap-2 cursor-pointer">
        {props.text}
        <div className="relative w-full h-0.5">
          <div className="bg-secondary h-0.5"></div>
          <div className="top-0 absolute h-full w-0 group-hover:w-full bg-accent transition-all duration-300"></div>
        </div>
      </Link>
    </li>
  );
}
