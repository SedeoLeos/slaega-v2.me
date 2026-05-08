import CoverLetterGenerator from "@/components/admin/CoverLetterGenerator";

export const dynamic = "force-dynamic";
export const metadata = { title: "Lettre de motivation — Admin" };

export default function AdminCoverLetterPage() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-semibold text-green-app uppercase tracking-widest mb-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Outil
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Lettre de motivation</h1>
        <p className="text-zinc-500 mt-1 text-sm max-w-2xl">
          Colle une offre pour générer un brouillon avec l&apos;IA, ou écris ton contenu
          toi-même. Tous les champs sont éditables — la prévisualisation A4 se met à jour
          en direct.
        </p>
      </div>

      <CoverLetterGenerator />
    </div>
  );
}
