"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import DeleteButton from "./DeleteButton";
import Pagination from "./Pagination";
import type { Project } from "@/entities/project";

type View = "list" | "grid";
type StatusFilter = "all" | "published" | "draft";

interface ProjectsManagerProps {
  projects: Project[];
}

export default function ProjectsManager({ projects }: ProjectsManagerProps) {
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // All available categories from the data
  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return Array.from(set).sort();
  }, [projects]);

  // Filtered list
  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
      if (status === "published" && !p.published) return false;
      if (status === "draft" && p.published) return false;
      if (category && !p.categories.includes(category)) return false;
      return true;
    });
  }, [projects, search, status, category]);

  const hasActiveFilter = search || status !== "all" || category;

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, category, view]);

  // Paginated slice
  const total = filtered.length;
  const safePage = Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize]
  );

  return (
    <div className="space-y-5">
      {/* ── Toolbar ───────────────────────────────────────────── */}
      <div className="flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un projet…"
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

        {/* Status filter */}
        <Select
          value={status}
          onChange={(v) => setStatus(v as StatusFilter)}
          options={[
            { value: "all", label: "Tous les statuts" },
            { value: "published", label: "Publiés" },
            { value: "draft", label: "Brouillons" },
          ]}
        />

        {/* Category filter */}
        <Select
          value={category}
          onChange={setCategory}
          options={[
            { value: "", label: "Toutes catégories" },
            ...categories.map((c) => ({ value: c, label: c })),
          ]}
        />

        {/* Clear */}
        {hasActiveFilter && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatus("all");
              setCategory("");
            }}
            className="h-10 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors px-3"
          >
            Réinitialiser
          </button>
        )}

        {/* View toggle — pushed to the right */}
        <div className="ml-auto inline-flex items-center h-10 bg-zinc-900 border border-zinc-700 rounded-lg p-0.5">
          <ViewBtn active={view === "list"} onClick={() => setView("list")} title="Liste">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </ViewBtn>
          <ViewBtn active={view === "grid"} onClick={() => setView("grid")} title="Grille">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </ViewBtn>
        </div>
      </div>

      {/* Result count */}
      {hasActiveFilter && (
        <p className="text-xs text-zinc-500">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur {projects.length}
        </p>
      )}

      {/* ── Empty state ───────────────────────────────────────── */}
      {filtered.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-zinc-400 font-medium">
            {hasActiveFilter ? "Aucun projet ne correspond" : "Aucun projet"}
          </p>
          <p className="text-zinc-600 text-sm mt-1">
            {hasActiveFilter ? "Essaie d'ajuster les filtres." : "Crée ton premier projet pour commencer."}
          </p>
        </div>
      )}

      {/* ── List view ─────────────────────────────────────────── */}
      {paged.length > 0 && view === "list" && <ListView projects={paged} />}

      {/* ── Grid view ─────────────────────────────────────────── */}
      {paged.length > 0 && view === "grid" && <GridView projects={paged} />}

      {/* ── Pagination ────────────────────────────────────────── */}
      <Pagination
        page={safePage}
        pageSize={pageSize}
        total={total}
        onPageChange={setPage}
        onPageSizeChange={(s) => {
          setPageSize(s);
          setPage(1);
        }}
      />
    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────

function ViewBtn({
  active,
  onClick,
  title,
  children,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      aria-pressed={active}
      className={`h-full px-3 rounded-md transition-colors flex items-center ${
        active
          ? "bg-zinc-800 text-white"
          : "text-zinc-500 hover:text-zinc-300"
      }`}
    >
      {children}
    </button>
  );
}

function Select({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none h-10 bg-zinc-900 border border-zinc-700 rounded-lg pl-3 pr-8 text-sm text-zinc-200 outline-none focus:border-green-app cursor-pointer transition-colors"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value} className="bg-zinc-900">
            {o.label}
          </option>
        ))}
      </select>
      <svg
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500 pointer-events-none"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  );
}

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
        published
          ? "bg-green-app/15 text-green-app"
          : "bg-yellow-500/15 text-yellow-400"
      }`}
    >
      <span className={`w-1 h-1 rounded-full ${published ? "bg-green-app/90" : "bg-yellow-400"}`} />
      {published ? "Publié" : "Brouillon"}
    </span>
  );
}

function ActionLinks({ slug }: { slug: string }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Link
        href={`/admin/projects/${slug}`}
        className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
      >
        Éditer
      </Link>
      <Link
        href={`/project/${slug}`}
        target="_blank"
        className="text-zinc-600 hover:text-zinc-400 transition-colors"
        title="Voir"
      >
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>
      </Link>
      <DeleteButton url={`/api/projects?slug=${slug}`} label="" />
    </div>
  );
}

// ─── List view ───
function ListView({ projects }: { projects: Project[] }) {
  return (
    <div className="border border-zinc-800/60 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[1fr_120px_180px_120px] gap-4 px-5 py-3 bg-zinc-900/50 border-b border-zinc-800/60">
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Titre</span>
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Statut</span>
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Catégories</span>
        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">Actions</span>
      </div>
      {/* Rows */}
      <div className="divide-y divide-zinc-800/40">
        {projects.map((p) => (
          <div
            key={p.slug}
            className="grid grid-cols-[1fr_120px_180px_120px] gap-4 px-5 py-4 items-center hover:bg-zinc-900/30 transition-colors"
          >
            <div className="min-w-0">
              <Link
                href={`/admin/projects/${p.slug}`}
                className="text-sm font-medium text-zinc-200 hover:text-white transition-colors truncate block"
              >
                {p.title}
              </Link>
              <p className="text-xs text-zinc-600 mt-0.5">{p.date}</p>
            </div>
            <div>
              <StatusBadge published={p.published} />
            </div>
            <div className="flex flex-wrap gap-1">
              {p.categories.slice(0, 2).map((c) => (
                <span
                  key={c}
                  className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md"
                >
                  {c}
                </span>
              ))}
              {p.categories.length > 2 && (
                <span className="text-xs text-zinc-600 self-center">
                  +{p.categories.length - 2}
                </span>
              )}
            </div>
            <ActionLinks slug={p.slug} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Grid view ───
function GridView({ projects }: { projects: Project[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {projects.map((p) => (
        <div
          key={p.slug}
          className="group bg-zinc-900 border border-zinc-800/60 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors"
        >
          {/* Image */}
          <Link
            href={`/admin/projects/${p.slug}`}
            className="block aspect-[16/10] bg-zinc-950 relative overflow-hidden"
          >
            {p.image ? (
              <Image
                src={p.image}
                alt={p.title}
                fill
                sizes="300px"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-700">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {/* Status badge floating */}
            <div className="absolute top-2 left-2">
              <StatusBadge published={p.published} />
            </div>
          </Link>
          {/* Body */}
          <div className="p-4 space-y-2">
            <Link
              href={`/admin/projects/${p.slug}`}
              className="text-sm font-semibold text-zinc-100 hover:text-white block leading-snug line-clamp-2 min-h-[2.4rem]"
            >
              {p.title}
            </Link>
            <p className="text-xs text-zinc-600">{p.date}</p>
            {p.categories.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {p.categories.slice(0, 3).map((c) => (
                  <span
                    key={c}
                    className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded"
                  >
                    {c}
                  </span>
                ))}
                {p.categories.length > 3 && (
                  <span className="text-[10px] text-zinc-600 self-center">+{p.categories.length - 3}</span>
                )}
              </div>
            )}
            <div className="flex items-center justify-between pt-2 border-t border-zinc-800/60">
              <ActionLinks slug={p.slug} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
