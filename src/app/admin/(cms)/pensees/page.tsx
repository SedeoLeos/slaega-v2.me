import { penseeRepository } from "@/features/pensee/repositories/pensee.repository";
import PenseeEditor from "@/components/admin/PenseeEditor";

export const metadata = { title: "Mes pensées — Admin" };

export default async function PenseesPage() {
  const items = await penseeRepository.getAll().catch(() => []);
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-100">Mes pensées &amp; écrits</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Croyances, vision de l&apos;humanité, réflexions et paroles de chansons. Publiés sur la
          page <code className="text-green-app">/pensees</code>.
        </p>
      </div>
      <PenseeEditor initialItems={items} />
    </div>
  );
}
