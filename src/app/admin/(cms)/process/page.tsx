import { processRepository } from "@/features/process/repositories/process.repository";
import ProcessEditor from "@/components/admin/ProcessEditor";

export const metadata = { title: "Processus — Admin" };

export default async function ProcessPage() {
  const steps = await processRepository.getAll();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-100">Mon processus</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Étapes STEP 01 / 02 / 03 affichées dans la section approche du portfolio.
        </p>
      </div>
      <ProcessEditor initialSteps={steps} />
    </div>
  );
}
