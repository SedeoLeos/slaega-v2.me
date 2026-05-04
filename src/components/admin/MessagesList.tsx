"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { ContactSubmission } from "@/entities/contact-submission";

type Tab = "inbox" | "archived";

interface Props {
  inbox: ContactSubmission[];
  archived: ContactSubmission[];
}

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const min = Math.floor(ms / 60000);
  if (min < 1) return "À l'instant";
  if (min < 60) return `Il y a ${min} min`;
  const h = Math.floor(min / 60);
  if (h < 24) return `Il y a ${h}h`;
  const d = Math.floor(h / 24);
  if (d < 30) return `Il y a ${d}j`;
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export default function MessagesList({ inbox, archived }: Props) {
  const [tab, setTab] = useState<Tab>("inbox");
  const [search, setSearch] = useState("");

  const list = tab === "inbox" ? inbox : archived;
  const filtered = useMemo(() => {
    if (!search) return list;
    const q = search.toLowerCase();
    return list.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        Object.values(m.data).some((v) => v.toLowerCase().includes(q))
    );
  }, [list, search]);

  return (
    <div className="space-y-5">
      {/* Tabs + search */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="inline-flex items-center bg-zinc-900 border border-zinc-700 rounded-lg p-0.5 h-10">
          <TabBtn active={tab === "inbox"} onClick={() => setTab("inbox")}>
            Réception
            {inbox.length > 0 && (
              <span className="ml-2 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-md">
                {inbox.length}
              </span>
            )}
          </TabBtn>
          <TabBtn active={tab === "archived"} onClick={() => setTab("archived")}>
            Archivés
            {archived.length > 0 && (
              <span className="ml-2 text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded-md">
                {archived.length}
              </span>
            )}
          </TabBtn>
        </div>

        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher…"
            className="w-full h-10 bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-3 text-sm text-zinc-200 outline-none focus:border-green-app focus:ring-2 focus:ring-green-app/20 transition-all"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-zinc-400 font-medium">
            {search ? "Aucun résultat" : tab === "inbox" ? "Aucun message reçu" : "Aucun message archivé"}
          </p>
        </div>
      )}

      {/* List */}
      {filtered.length > 0 && (
        <div className="border border-zinc-800/60 rounded-xl overflow-hidden divide-y divide-zinc-800/40">
          {filtered.map((m) => (
            <Link
              key={m.id}
              href={`/admin/messages/${m.id}`}
              className={`block px-5 py-4 hover:bg-zinc-900/40 transition-colors ${
                !m.read ? "bg-zinc-900/20" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Unread indicator */}
                <div className="flex-shrink-0">
                  <span
                    className={`block w-2 h-2 rounded-full ${
                      m.read ? "bg-zinc-700" : "bg-green-app shadow-sm shadow-green-app/40"
                    }`}
                    aria-label={m.read ? "Lu" : "Non lu"}
                  />
                </div>

                {/* Identity */}
                <div className="min-w-0 w-44 flex-shrink-0">
                  <p className={`text-sm truncate ${m.read ? "text-zinc-300" : "text-white font-semibold"}`}>
                    {m.name || "Sans nom"}
                  </p>
                  <p className="text-xs text-zinc-500 truncate">{m.email || "—"}</p>
                </div>

                {/* Subject + preview */}
                <div className="min-w-0 flex-1">
                  {m.subject && (
                    <p className={`text-sm truncate ${m.read ? "text-zinc-400" : "text-zinc-200 font-medium"}`}>
                      {m.subject}
                    </p>
                  )}
                  <p className="text-xs text-zinc-500 truncate">
                    {m.data.message || Object.values(m.data).find((v) => v && v.length > 20) || "—"}
                  </p>
                </div>

                {/* Time */}
                <div className="text-xs text-zinc-600 flex-shrink-0 whitespace-nowrap">
                  {timeAgo(m.createdAt)}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-full px-4 rounded-md transition-colors flex items-center text-sm font-medium ${
        active ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}
