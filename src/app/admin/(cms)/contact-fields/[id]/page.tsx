import Link from "next/link";
import { notFound } from "next/navigation";
import { contactFieldRepository } from "@/features/contact-fields/repositories/contact-field.repository";
import ContactFieldForm from "@/components/admin/ContactFieldForm";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function EditContactFieldPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const field = await contactFieldRepository.getById(id);
  if (!field) notFound();

  return (
    <div className="p-8 max-w-3xl">
      <nav className="flex items-center gap-2 text-xs font-medium mb-4">
        <Link
          href="/admin/contact-fields"
          className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Champs de contact
        </Link>
        <span className="text-zinc-700">/</span>
        <span className="text-zinc-500 truncate">Édition</span>
      </nav>

      <div className="flex items-start justify-between gap-4 mb-8 pb-6 border-b border-zinc-800/60">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold text-white tracking-tight">{field.label}</h1>
          <p className="text-zinc-500 text-sm mt-1">
            <code className="text-zinc-400">{field.name}</code> · {field.type}
          </p>
        </div>
        <div className="inline-flex items-center bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors flex-shrink-0">
          <DeleteButton url={`/api/contact-fields?id=${id}`} label="Supprimer" redirect="/admin/contact-fields" />
        </div>
      </div>

      <ContactFieldForm mode="edit" id={id} initial={field} />
    </div>
  );
}
