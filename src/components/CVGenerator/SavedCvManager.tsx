"use client";

/**
 * Dedicated management surface for saved CVs — roomier than the little
 * collapsible inside the generator. From here you can:
 *   · make a CV public (and set its domain/thematic label) for the /cv gallery
 *   · copy its shareable public link (/cv?cv=<id>)
 *   · reuse it in the generator (/admin/cv-generator?load=<id>)
 *   · rename or delete it
 */

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

type SavedCv = {
  id: string;
  title: string;
  language: string;
  createdAt: string;
  isPublic?: boolean;
  domain?: string;
};

export default function SavedCvManager() {
  const [items, setItems] = useState<SavedCv[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/cv-generator/saved");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setItems(Array.isArray(data.items) ? data.items : []);
    } catch {
      toast.error("Impossible de charger les CV enregistrés");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const patch = useCallback(
    async (id: string, body: { isPublic?: boolean; domain?: string; title?: string }) => {
      setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...body } : it)));
      try {
        const res = await fetch("/api/cv-generator/saved", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id, ...body }),
        });
        if (!res.ok) throw new Error();
      } catch {
        toast.error("Échec de la mise à jour");
        load();
      }
    },
    [load],
  );

  const remove = useCallback(
    async (id: string) => {
      if (!confirm("Supprimer définitivement ce CV enregistré ?")) return;
      setBusyId(id);
      try {
        await fetch(`/api/cv-generator/saved?id=${encodeURIComponent(id)}`, { method: "DELETE" });
        setItems((prev) => prev.filter((it) => it.id !== id));
        toast.success("CV supprimé");
      } catch {
        toast.error("Échec de la suppression");
      } finally {
        setBusyId(null);
      }
    },
    [],
  );

  const copyPublicLink = useCallback((id: string) => {
    const url = `${window.location.origin}/cv?cv=${encodeURIComponent(id)}`;
    navigator.clipboard.writeText(url).then(
      () => toast.success("Lien public copié"),
      () => toast.error("Copie impossible"),
    );
  }, []);

  const publicCount = items.filter((i) => i.isPublic).length;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-xs font-semibold text-green-app uppercase tracking-widest mb-2">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
          </svg>
          Bibliothèque
        </div>
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CV enregistrés</h1>
            <p className="text-zinc-500 mt-1 text-sm">
              Publie un CV par domaine sur la page publique{" "}
              <Link href="/cv" target="_blank" className="text-green-app hover:underline">/cv</Link>,
              récupère son lien de partage, ou réutilise-le dans le générateur.
            </p>
          </div>
          <Link
            href="/admin/cv-generator"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-2 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouveau CV
          </Link>
        </div>
        {items.length > 0 && (
          <p className="mt-3 text-[11px] text-zinc-600">
            {items.length} enregistré{items.length > 1 ? "s" : ""} · {publicCount} public{publicCount > 1 ? "s" : ""}
          </p>
        )}
      </div>

      {/* List */}
      {loading ? (
        <p className="text-zinc-500 text-sm py-10 text-center">Chargement…</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
          <p className="text-zinc-400 text-sm">Aucun CV enregistré pour l&apos;instant.</p>
          <Link href="/admin/cv-generator" className="inline-block mt-3 text-green-app text-sm hover:underline">
            Générer un premier CV →
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex flex-col gap-3"
            >
              {/* Top row: title + meta + delete */}
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <input
                    defaultValue={item.title}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && v !== item.title) patch(item.id, { title: v });
                    }}
                    className="w-full bg-transparent text-white font-semibold text-sm tracking-tight focus:outline-none focus:bg-zinc-950 focus:border-green-app border border-transparent rounded px-1.5 py-1 -ml-1.5"
                  />
                  <p className="text-[11px] text-zinc-500 mt-0.5 px-0.5">
                    {new Date(item.createdAt).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
                    {" · "}
                    {item.language === "en" ? "EN" : "FR"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => remove(item.id)}
                  disabled={busyId === item.id}
                  title="Supprimer"
                  className="w-8 h-8 flex-shrink-0 flex items-center justify-center rounded-lg hover:bg-zinc-800 text-zinc-600 hover:text-red-400 transition-colors disabled:opacity-40"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              {/* Controls row */}
              <div className="flex flex-wrap items-center gap-2 border-t border-zinc-800 pt-3">
                {/* Public toggle */}
                <button
                  type="button"
                  onClick={() => patch(item.id, { isPublic: !item.isPublic })}
                  title={item.isPublic ? "Retirer de /cv" : "Publier sur /cv"}
                  className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg transition-colors ${
                    item.isPublic
                      ? "bg-green-app/20 text-green-app border border-green-app/30"
                      : "bg-zinc-800 text-zinc-400 border border-zinc-700 hover:text-zinc-200"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${item.isPublic ? "bg-green-app" : "bg-zinc-500"}`} />
                  {item.isPublic ? "Public" : "Privé"}
                </button>

                {/* Domain / thematic */}
                <input
                  type="text"
                  defaultValue={item.domain ?? ""}
                  placeholder="Thématique (Banque, Fintech, Full-stack…)"
                  onBlur={(e) => {
                    const v = e.target.value.trim();
                    if (v !== (item.domain ?? "")) patch(item.id, { domain: v });
                  }}
                  className="flex-1 min-w-[180px] bg-zinc-950 border border-zinc-700 rounded-lg px-2.5 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-green-app"
                />

                {/* Reuse in generator */}
                <Link
                  href={`/admin/cv-generator?load=${encodeURIComponent(item.id)}`}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1.5 rounded-lg transition-colors"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Réutiliser
                </Link>

                {/* Public link (only when public) */}
                {item.isPublic && (
                  <>
                    <button
                      type="button"
                      onClick={() => copyPublicLink(item.id)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-2.5 py-1.5 rounded-lg transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                      </svg>
                      Copier le lien
                    </button>
                    <Link
                      href={`/cv?cv=${encodeURIComponent(item.id)}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400 hover:text-green-app px-1.5 py-1.5 transition-colors"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Voir
                    </Link>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
