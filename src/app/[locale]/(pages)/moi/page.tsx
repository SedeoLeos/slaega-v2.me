import type { Metadata } from "next";
import MoiPage from "@/components/slaega/pages/MoiPage";
import { buildPageMetadata } from "@/shared/config/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: "/moi",
    title:
      locale === "en"
        ? "Seba Gedeon Matsoula Malonga — the person"
        : "Seba Gedeon Matsoula Malonga — la personne",
    description:
      locale === "en"
        ? "Before the brand, the man: Seba Gedeon Matsoula Malonga, developer and builder based in Brazzaville."
        : "Avant la marque, l'homme : Seba Gedeon Matsoula Malonga, développeur et bâtisseur basé à Brazzaville.",
    keywords: ["Seba Gedeon", "la personne", "Brazzaville", "Congo"],
  });
}

export default function Page() {
  return <MoiPage />;
}
