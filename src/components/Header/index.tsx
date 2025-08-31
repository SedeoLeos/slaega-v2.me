import Link from "next/link";
import NavItem from "./NavItem";
import Drawer from "../icons/drawer";
const menuData = [
  { href: "/", text: "meet raees" },
  { href: "/", text: "my work" },
  { href: "/about", text: "case studies" },
  { href: "/about", text: "testimonials" },
  { href: "/contact", text: "blog" },
  { href: "/contact", text: "contact me" },
];
const Header = () => {
  return (
    <header className="w-full py-10 px-10 md:px-20  text-foreground font-poppins  flex justify-between items-center max-w-content mx-auto">
      <Link href={"/"}><h1 className="text-3xl font-bold text-green-app">
        Slaega</h1> </Link>

      <nav className="2lg:flex hidden">
        <ul className="flex text-base font-medium gap-5">
          {menuData.map((item, index) => (
            <NavItem key={index} href={item.href} text={item.text} />
          ))}
        </ul>
      </nav>

      <div className="flex items-center gap-10">
        <div className="hidden md:flex gap-5 text-xl font-bold">
          <Link href={"#"}>Gh</Link>
          <Link href={"#"}>Yt</Link>
          <Link href={"#"}>In</Link>
        </div>
        <button className="2lg:hidden block text-3xl group">
          <Drawer size={30} />
          <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-green-app text-xs flex items-center justify-center text-background font-semibold opacity-0 group-hover:opacity-100 transition">
            <span className="sr-only">Open menu</span>
          </div>
        </button>
      </div>
    </header>
  );
};

export default Header;
