import type { Metadata } from "next";
import PenseesPage from "@/components/slaega/pages/PenseesPage";
import { penseeRepository } from "@/features/pensee/repositories/pensee.repository";
import { buildPageMetadata } from "@/shared/config/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: "/pensees",
    title: locale === "en" ? "Thoughts & writings" : "Pensées & écrits",
    description:
      locale === "en"
        ? "Beliefs, a vision of humanity, reflections and song lyrics by Seba Gedeon Matsoula Malonga (slaega)."
        : "Croyances, vision de l'humanité, réflexions et paroles de chansons de Seba Gedeon Matsoula Malonga (slaega).",
    keywords: ["pensées", "écrits", "croyances", "chansons", "Seba G"],
    type: "article",
  });
}

// Content is managed at runtime from the CMS.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const items = await penseeRepository.getPublished().catch(() => []);
  return <PenseesPage items={items} />;
}
