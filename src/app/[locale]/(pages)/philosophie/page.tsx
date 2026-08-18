import type { Metadata } from "next";
import PhilosophyPage from "@/components/slaega/pages/PhilosophyPage";
import { buildPageMetadata } from "@/shared/config/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: "/philosophie",
    title: locale === "en" ? "Philosophy" : "Philosophie",
    description:
      locale === "en"
        ? "slaega = king sedeo leos. The builder's stance: design, code, lead, own it."
        : "slaega = king sedeo leos. La posture du bâtisseur : concevoir, coder, piloter, assumer.",
    keywords: ["slaega", "king sedeo leos", "philosophie", "vision"],
  });
}

export default function Page() {
  return <PhilosophyPage />;
}
