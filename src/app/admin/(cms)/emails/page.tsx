import EmailComposer from "@/components/admin/EmailComposer";

export const metadata = { title: "Emails — Admin" };

export default function AdminEmailsPage() {
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-green-app uppercase tracking-widest mb-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          Outreach
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Templates d&apos;email</h1>
        <p className="text-zinc-500 mt-1 text-sm">
          Génère et envoie des emails brandés (candidature, relance, networking…) directement depuis le CMS.
        </p>
      </div>

      <EmailComposer />
    </div>
  );
}
