import type { Metadata } from "next";
import { db } from "@/lib/db";
import PublicCvGallery, { type PublicCvSummary } from "@/components/CVGenerator/public/PublicCvGallery";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "CV — slaega",
  description:
    "CV de Seba Gedeon Matsoula Malonga, ciblés par domaine (banque, fintech, full-stack, DevOps…). Architecte logiciel.",
};

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
