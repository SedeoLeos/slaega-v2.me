import type { Metadata } from "next";
import { db } from "@/lib/db";
import PublicCvGallery, { type PublicCvSummary } from "@/components/CVGenerator/public/PublicCvGallery";
import { buildPageMetadata } from "@/shared/config/seo";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata(locale, {
    path: "/cv",
    title: locale === "en" ? "Résumé / CV" : "CV",
    description:
      locale === "en"
        ? "Résumés of Seba Gedeon Matsoula Malonga, targeted by domain (banking, fintech, full-stack, DevOps…). Software architect."
        : "CV de Seba Gedeon Matsoula Malonga, ciblés par domaine (banque, fintech, full-stack, DevOps…). Architecte logiciel.",
    keywords: ["CV", "résumé", "banque", "fintech", "full-stack", "DevOps", "architecte logiciel"],
  });
}

const PREFIX = "generated-cv:";

async function getPublicSummaries(): Promise<PublicCvSummary[]> {
  try {
    const rows = await db.siteConfig.findMany({ where: { key: { startsWith: PREFIX } } });
    return rows
      .map((r) => {
        try {
          return JSON.parse(r.value) as {
            id: string;
            title: string;
            language: string;
            createdAt: string;
            isPublic?: boolean;
            domain?: string;
          };
        } catch {
          return null;
        }
      })
      .filter((v): v is NonNullable<typeof v> => !!v && v.isPublic === true)
      .map((v) => ({
        id: v.id,
        title: v.title,
        language: v.language,
        createdAt: v.createdAt,
        domain: v.domain ?? "",
      }))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  } catch {
    return [];
  }
}

export default async function CvPage() {
  const items = await getPublicSummaries();
  return <PublicCvGallery items={items} />;
}
