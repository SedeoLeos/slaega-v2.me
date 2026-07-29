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
import ScrollSlide from "@/components/animations/ScrollSlide";

// Always render fresh — the homepage reads CMS data (Banner stats, About preview,
// Services, Projects) that admins update at runtime.
export const dynamic = "force-dynamic";
export const revalidate = 0;

// Home reads like a slide deck: each section fades + glides in as it enters and
// out as it leaves (ScrollSlide). Hero + Ticker stay plain; Contact keeps a
// simple entrance so the form is never faded while in use.
export default function Home() {
  return (
    <>
      <Hero />
      <ScrollSlide><Banner /></ScrollSlide>
      <ScrollSlide><AboutPreview /></ScrollSlide>
      <Ticker />
      <ScrollSlide><Service /></ScrollSlide>
      <ScrollSlide><TerminalShowcase /></ScrollSlide>
      <ScrollSlide><ValueCards /></ScrollSlide>
      <ScrollSlide>
        <Suspense fallback={null}>
          <ProjectList origin="home" />
        </Suspense>
      </ScrollSlide>
      <ScrollSlide><Process /></ScrollSlide>
      <ScrollSlide><FAQ /></ScrollSlide>
      <FadeIn><Contact /></FadeIn>
    </>
  );
}
