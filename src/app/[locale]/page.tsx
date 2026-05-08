import { Suspense } from "react";
import AboutPreview from "@/components/About/AboutPreview";
import Banner from "@/components/Banner/Banner";
import Contact from "@/components/Contact/Contact";
import Hero from "@/components/Hero";
import ProjectList from "@/components/Projects/ProjectList";
import Service from "@/components/Service/Service";
import Ticker from "@/components/Ticker/Ticker";
import TerminalShowcase from "@/components/TerminalShowcase/TerminalShowcase";
import ValueCards from "@/components/ValueCards/ValueCards";
import Process from "@/components/Process/Process";
import FAQ from "@/components/FAQ/FAQ";
import FadeIn from "@/components/animations/FadeIn";

// Always render fresh — the homepage reads CMS data (Banner stats, About preview,
// Services, Projects) that admins update at runtime.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <FadeIn delay={0.1}><Banner /></FadeIn>
      <FadeIn delay={0.05}><AboutPreview /></FadeIn>
      <FadeIn><Service /></FadeIn>
      <FadeIn><TerminalShowcase /></FadeIn>
      <FadeIn><ValueCards /></FadeIn>
      <FadeIn>
        <Suspense fallback={null}>
          <ProjectList origin="home" />
        </Suspense>
      </FadeIn>
      <FadeIn><Process /></FadeIn>
      <FadeIn><FAQ /></FadeIn>
      <FadeIn><Contact /></FadeIn>
    </>
  );
}
