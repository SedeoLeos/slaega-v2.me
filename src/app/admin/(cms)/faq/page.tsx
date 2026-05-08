import { faqRepository } from "@/features/faq/repositories/faq.repository";
import FaqEditor from "@/components/admin/FaqEditor";

export const metadata = { title: "FAQ — Admin" };

export default async function FaqPage() {
  const items = await faqRepository.getAll();
  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-zinc-100">FAQ</h1>
        <p className="text-zinc-400 text-sm mt-1">
          Questions fréquentes affichées sur le portfolio. Numérotées automatiquement.
        </p>
      </div>
      <FaqEditor initialItems={items} />
    </div>
  );
}
