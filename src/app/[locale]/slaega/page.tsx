import type { Metadata } from "next";
import SlaegaLanding from "@/components/slaega/SlaegaLanding";
import { getSlaegaData } from "@/components/slaega/getData";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "slaega — Seba Gedeon",
  description:
    "Seba Gedeon — ingénieur logiciel full-stack & DevOps. Mobile, web, backend et infrastructures cloud sécurisées.",
};

export default async function SlaegaPage() {
  const data = await getSlaegaData();
  return <SlaegaLanding immersive {...data} />;
}
