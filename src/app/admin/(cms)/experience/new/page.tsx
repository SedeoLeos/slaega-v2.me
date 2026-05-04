import Link from "next/link";
import ExperienceForm from "@/components/admin/ExperienceForm";

export default function NewExperiencePage() {
  return (
    <div className="p-8 max-w-2xl">
      <nav className="flex items-center gap-2 text-sm text-zinc-600 mb-6">
        <Link href="/admin/experience" className="hover:text-zinc-300 transition-colors">
          Expériences
        </Link>
        <span>/</span>
        <span className="text-zinc-300">Nouvelle</span>
      </nav>

      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white tracking-tight">Nouvelle expérience</h1>
        <p className="text-zinc-500 text-sm mt-1">
          Ajoutez une expérience professionnelle à votre portfolio.
        </p>
      </div>

      <ExperienceForm mode="create" />
    </div>
  );
}
