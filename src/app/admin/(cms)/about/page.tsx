import { aboutPageRepository } from "@/features/about/repositories/about-page.repository";
import AboutPageForm from "@/components/admin/AboutPageForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "À propos — Admin" };

export default async function AdminAboutPage() {
  const data = await aboutPageRepository.getOrCreate();

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8 pb-6 border-b border-zinc-800/60">
        <h1 className="text-2xl font-bold text-white tracking-tight">Section &quot;À propos&quot;</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          Édite le contenu affiché sur la page publique <code className="text-zinc-300">/about</code>.
        </p>
      </div>

      <AboutPageForm initial={data} />
    </div>
  );
}
