"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface Props {
  id: string;
  archived: boolean;
  email: string;
  subject: string;
}

export default function MessageDetailActions({ id, archived, email, subject }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const update = async (data: { archived?: boolean; read?: boolean }, key: string) => {
    setLoading(key);
    try {
      const res = await fetch(`/api/contact?id=${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      toast.success(data.archived === true ? "Archivé" : data.archived === false ? "Restauré" : "Mis à jour");
      router.refresh();
    } catch {
      toast.error("Erreur");
    } finally {
      setLoading(null);
    }
  };

  const remove = async () => {
    if (!confirm("Supprimer définitivement ce message ?")) return;
    setLoading("delete");
    try {
      const res = await fetch(`/api/contact?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Supprimé");
      router.push("/admin/messages");
      router.refresh();
    } catch {
      toast.error("Erreur de suppression");
      setLoading(null);
    }
  };

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {email && (
        <a
          href={`mailto:${email}?subject=${encodeURIComponent(`Re: ${subject}`)}`}
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-app hover:bg-green-app/85 text-white px-4 py-2 rounded-full transition-colors shadow-sm shadow-green-app/30"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Répondre
        </a>
      )}

      <button
        type="button"
        onClick={() => update({ archived: !archived }, "archive")}
        disabled={loading !== null}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
      >
        {archived ? (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M3 10h18M3 6l1.5-1.5a2 2 0 011.414-.586H17.086a2 2 0 011.414.586L20 6M3 10v9a2 2 0 002 2h14a2 2 0 002-2v-9M9 14l3 3m0 0l3-3m-3 3V8" />
            </svg>
            Restaurer
          </>
        ) : (
          <>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Archiver
          </>
        )}
      </button>

      <button
        type="button"
        onClick={remove}
        disabled={loading !== null}
        className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-zinc-900 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 border border-zinc-800 px-3 py-2 rounded-lg transition-colors disabled:opacity-50"
        aria-label="Supprimer"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        Supprimer
      </button>
    </div>
  );
}
