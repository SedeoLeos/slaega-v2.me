import Link from "next/link";
import { contactFieldRepository } from "@/features/contact-fields/repositories/contact-field.repository";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

const TYPE_LABEL: Record<string, string> = {
  text: "Texte",
  email: "Email",
  tel: "Téléphone",
  textarea: "Zone de texte",
  select: "Liste déroulante",
};

export default async function AdminContactFieldsPage() {
  const fields = await contactFieldRepository.getAll().catch(() => []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Champs du formulaire de contact
          </h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {fields.length} champ{fields.length !== 1 ? "s" : ""} · ordonné par &quot;ordre&quot;
          </p>
        </div>
        <Link
          href="/admin/contact-fields/new"
          className="inline-flex items-center gap-2 bg-green-app hover:bg-green-app/85 text-white font-semibold px-5 py-2.5 rounded-full text-sm transition-colors shadow-sm shadow-green-app/30"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouveau champ
        </Link>
      </div>

      {fields.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <p className="text-zinc-400 font-medium">Aucun champ</p>
          <Link
            href="/admin/contact-fields/new"
            className="inline-block mt-4 text-sm text-green-app hover:text-green-app/80 transition-colors"
          >
            Créer le premier →
          </Link>
        </div>
      ) : (
        <div className="border border-zinc-800/60 rounded-xl overflow-hidden">
          <div className="grid grid-cols-[80px_1fr_1fr_120px_100px_100px_120px] gap-4 px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/60">
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Ordre</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Nom (clé)</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Libellé</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Type</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Requis</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</span>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</span>
          </div>
          <div className="divide-y divide-zinc-800/40">
            {fields.map((f) => (
              <div
                key={f.id}
                className="grid grid-cols-[80px_1fr_1fr_120px_100px_100px_120px] gap-4 px-5 py-4 items-center hover:bg-zinc-900/30 transition-colors"
              >
                <span className="text-sm text-zinc-500 font-mono">#{f.order}</span>
                <code className="text-xs text-zinc-300 bg-zinc-800/50 px-2 py-1 rounded w-fit font-mono">
                  {f.name}
                </code>
                <span className="text-sm text-zinc-200">{f.label}</span>
                <span className="text-xs text-zinc-400">{TYPE_LABEL[f.type] ?? f.type}</span>
                <span className={`text-xs font-medium ${f.required ? "text-rose-400" : "text-zinc-500"}`}>
                  {f.required ? "Oui" : "Non"}
                </span>
                <span
                  className={`inline-flex items-center text-xs px-2 py-0.5 rounded-full font-medium w-fit ${
                    f.published ? "bg-green-app/15 text-green-app" : "bg-yellow-500/15 text-yellow-400"
                  }`}
                >
                  {f.published ? "Publié" : "Brouillon"}
                </span>
                <div className="flex items-center justify-end gap-3">
                  <Link
                    href={`/admin/contact-fields/${f.id}`}
                    className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
                  >
                    Éditer
                  </Link>
                  <DeleteButton url={`/api/contact-fields?id=${f.id}`} label="" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
