import About from "@/components/About/About";
import Banner from "@/components/Banner/Banner";
import Contact from "@/components/Contact/Contact";
import Hero from "@/components/Hero";
import ProjectList from "@/components/Projects/ProjectList";
import Service from "@/components/Service/Service";

export default function Home() {
  return (
    <>
      <Hero />
      <Banner />
      <About />
      <Service/>
      <ProjectList origin="home" />
      <Contact />
    </>
  );
}
