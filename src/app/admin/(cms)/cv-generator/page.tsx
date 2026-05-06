// CVGeneratorNoSSR is a client component that wraps CVGeneratorClient with
// `dynamic + ssr:false` — the App Router only allows that pattern in client components.
import CVGeneratorNoSSR from "@/components/CVGenerator/CVGeneratorNoSSR";

export const dynamic = "force-dynamic";
export const metadata = { title: "Générateur de CV — Admin" };

export default function AdminCVGeneratorPage() {
  return (
    <div className="p-6 h-full flex flex-col">
      {/* Header */}
      <div className="mb-6 flex-shrink-0">
        <div className="flex items-center gap-2 text-xs font-semibold text-green-app uppercase tracking-widest mb-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Outil IA
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Générateur de CV</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          Colle une offre d&apos;emploi · choisis un template et une palette · télécharge en PDF.
        </p>
      </div>

      <div className="flex-1 min-h-0">
        <CVGeneratorNoSSR />
      </div>
    </div>
  );
}
