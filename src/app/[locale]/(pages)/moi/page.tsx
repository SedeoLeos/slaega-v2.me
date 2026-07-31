import type { Metadata } from "next";
import MoiPage from "@/components/slaega/pages/MoiPage";

export const metadata: Metadata = {
  title: "Seba Gedeon Matsoula — la personne",
  description: "Avant la marque, l'homme : Seba Gedeon Matsoula, développeur et bâtisseur basé à Brazzaville.",
};

export default function Page() {
  return <MoiPage />;
}
