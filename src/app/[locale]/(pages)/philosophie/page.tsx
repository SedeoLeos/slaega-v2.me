import type { Metadata } from "next";
import PhilosophyPage from "@/components/slaega/pages/PhilosophyPage";

export const metadata: Metadata = {
  title: "Philosophie — slaega",
  description: "slaega = king sedeo leos. La posture du bâtisseur : concevoir, coder, piloter, assumer.",
};

export default function Page() {
  return <PhilosophyPage />;
}
