import SlaegaLanding from "@/components/slaega/SlaegaLanding";
import { getSlaegaData } from "@/components/slaega/getData";

// The home reads CMS data (stats, services, projects, process, faq) that
// admins update at runtime.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const data = await getSlaegaData();
  return <SlaegaLanding immersive={false} {...data} />;
}
