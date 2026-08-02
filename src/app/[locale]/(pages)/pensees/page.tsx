import type { Metadata } from "next";
import PenseesPage from "@/components/slaega/pages/PenseesPage";
import { penseeRepository } from "@/features/pensee/repositories/pensee.repository";

export const metadata: Metadata = {
  title: "Pensées & écrits — slaega",
  description:
    "Croyances, vision de l'humanité, réflexions et paroles de chansons de Seba Gedeon Matsoula Malonga.",
};

// Content is managed at runtime from the CMS.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page() {
  const items = await penseeRepository.getPublished().catch(() => []);
  return <PenseesPage items={items} />;
}
