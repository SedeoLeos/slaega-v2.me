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
import SnapHome from "@/components/animations/SnapHome";

// Always render fresh — the homepage reads CMS data (Banner stats, About preview,
// Services, Projects) that admins update at runtime.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Full-page scroll: each section fills the viewport and snaps into place; its
// content reveals (FadeIn) as the section arrives. `snap-tall` marks sections
// whose content can exceed one screen (grids), so they top-align.
export default function Home() {
  return (
    <>
      <SnapHome />
      <section className="snap-section"><Hero /></section>
      <section className="snap-section"><FadeIn><Banner /></FadeIn></section>
      <section className="snap-section"><FadeIn><AboutPreview /></FadeIn></section>
      <section className="snap-section"><Ticker /></section>
      <section className="snap-section snap-tall"><FadeIn><Service /></FadeIn></section>
      <section className="snap-section"><FadeIn><TerminalShowcase /></FadeIn></section>
      <section className="snap-section"><FadeIn><ValueCards /></FadeIn></section>
      <section className="snap-section snap-tall">
        <FadeIn>
          <Suspense fallback={null}>
            <ProjectList origin="home" />
          </Suspense>
        </FadeIn>
      </section>
      <section className="snap-section snap-tall"><FadeIn><Process /></FadeIn></section>
      <section className="snap-section snap-tall"><FadeIn><FAQ /></FadeIn></section>
      <section className="snap-section snap-tall"><FadeIn><Contact /></FadeIn></section>
    </>
  );
}
