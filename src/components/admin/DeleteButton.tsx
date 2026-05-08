"use client";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  url: string;        // DELETE endpoint, e.g. /api/projects?slug=xxx
  label?: string;
  onSuccess?: () => void;
  redirect?: string;  // redirect after delete
}

export default function DeleteButton({ url, label = "Supprimer", onSuccess, redirect }: DeleteButtonProps) {
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) throw new Error("Erreur lors de la suppression");
      toast.success("Supprimé avec succès");
      onSuccess?.();
      if (redirect) router.push(redirect);
      else router.refresh();
    } catch {
      toast.error("Erreur lors de la suppression");
    } finally {
      setLoading(false);
      setConfirm(false);
    }
  };

  if (confirm) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-zinc-400">Confirmer ?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 px-2.5 py-1 rounded-md transition-colors disabled:opacity-50"
        >
          {loading ? "…" : "Oui"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-xs text-zinc-500 hover:text-red-400 transition-colors flex items-center gap-1"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
      {label}
    </button>
  );
}
