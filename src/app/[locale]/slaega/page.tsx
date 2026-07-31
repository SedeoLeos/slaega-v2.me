import type { Metadata } from "next";
import SlaegaLanding from "@/components/slaega/SlaegaLanding";

export const metadata: Metadata = {
  title: "slaega — elite IT experts",
  description:
    "slaega : association d'experts IT — DevOps, ingénierie logicielle, gestion de projet et DSI offshore. En partenariat avec organe des orach.",
};

export default function SlaegaPage() {
  return <SlaegaLanding />;
}
