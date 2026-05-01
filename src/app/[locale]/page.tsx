import About from "@/components/About/About";
import Banner from "@/components/Banner/Banner";
import Contact from "@/components/Contact/Contact";
import Hero from "@/components/Hero";
import ProjectList from "@/components/Projects/ProjectList";
import Service from "@/components/Service/Service";
import ExperienceSection from "@/components/Experience/ExperienceSection";
import FadeIn from "@/components/animations/FadeIn";

export default function Home() {
  return (
    <>
      <Hero />
      <FadeIn delay={0.1}><Banner /></FadeIn>
      <FadeIn delay={0.05}><About /></FadeIn>
      <FadeIn><ExperienceSection /></FadeIn>
      <FadeIn><Service /></FadeIn>
      <FadeIn><ProjectList origin="home" /></FadeIn>
      <FadeIn><Contact /></FadeIn>
    </>
  );
}
