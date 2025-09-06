'use client';
import Link from "next/link";
import NavItem from "./NavItem";
import Drawer from "../icons/drawer";
import { useState } from "react";

const menuData = [
  { href: "/", text: "meet raees" },
  { href: "/", text: "my work" },
  { href: "/about", text: "case studies" },
  { href: "/about", text: "testimonials" },
  { href: "/contact", text: "blog" },
  { href: "/contact", text: "contact me" },
];
const Header = () => {

  const [menu, setMenu] = useState(false);

  const onClick = () => {
    setMenu((prev) => !prev)
  }
  return (
    <div className="w-full backdrop-blur-lg bg-background/50 fixed justify-center flex z-30">
      <header className="w-full py-10 px-10 md:px-20  text-foreground font-poppins  flex justify-between items-center max-w-content ">
        <Link href={"/"}><h1 className="text-3xl font-bold text-green-app">
          Slaega</h1> </Link>

        <nav className="2lg:flex hidden ">
          <ul className="flex text-base font-medium gap-5">
            {menuData.map((item, index) => (
              <NavItem key={index} href={item.href} text={item.text} />
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-10 ">
          <div className="hidden md:flex gap-5 text-xl font-bold">
            <Link href={"#"}>Gh</Link>
            <Link href={"#"}>Yt</Link>
            <Link href={"#"}>In</Link>
          </div>
          <div className="relative flex flex-col ">
            <button className="2lg:hidden flex text-3xl group" type="button" onClick={onClick}>
              <Drawer size={30} />
            </button>
            <div className={`2lg:hidden  absolute right-0 top-5 w-max ${!menu ? "hidden" : 'flex'}`}>
              <ul className="flex flex-col p-4  mt-4 border border-gray-100  bg-gray-50/50 backdrop-blur-3xl gap-2">
                {menuData.map((item, index) => (
                  <NavItem key={index} href={item.href} text={item.text} />
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
