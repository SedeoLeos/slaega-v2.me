"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import DeleteButton from "./DeleteButton";
import Pagination from "./Pagination";
import type { Experience } from "@/entities/experience";

type View = "list" | "grid";
type StatusFilter = "all" | "current" | "past";

const MONTHS = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

function fmt(date: string | null, current: boolean): string {
  if (current) return "Aujourd'hui";
  if (!date) return "—";
  const [y, m] = date.split("-");
  return `${MONTHS[parseInt(m) - 1]} ${y}`;
}

interface ExperiencesManagerProps {
  experiences: Experience[];
}

export default function ExperiencesManager({ experiences }: ExperiencesManagerProps) {
  const [view, setView] = useState<View>("list");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [skill, setSkill] = useState<string>("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const skills = useMemo(() => {
    const set = new Set<string>();
    experiences.forEach((e) => e.skills.forEach((s) => set.add(s)));
    return Array.from(set).sort();
  }, [experiences]);

  const filtered = useMemo(() => {
    return experiences.filter((exp) => {
      if (search) {
        const q = search.toLowerCase();
        const inText =
          exp.role.toLowerCase().includes(q) ||
          exp.company.toLowerCase().includes(q) ||
          (exp.location?.toLowerCase().includes(q) ?? false);
        if (!inText) return false;
      }
      if (status === "current" && !exp.current) return false;
      if (status === "past" && exp.current) return false;
      if (skill && !exp.skills.includes(skill)) return false;
      return true;
    });
  }, [experiences, search, status, skill]);

  const hasActiveFilter = search || status !== "all" || skill;

  useEffect(() => {
    setPage(1);
  }, [search, status, skill, view]);

  const total = filtered.length;
  const safePage = Math.min(page, Math.max(1, Math.ceil(total / pageSize)));
  const paged = useMemo(
    () => filtered.slice((safePage - 1) * pageSize, safePage * pageSize),
    [filtered, safePage, pageSize]
  );

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher poste, entreprise…"
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

        <Select
          value={status}
          onChange={(v) => setStatus(v as StatusFilter)}
          options={[
            { value: "all", label: "Tous" },
            { value: "current", label: "En poste" },
            { value: "past", label: "Anciens" },
          ]}
        />

        <Select
          value={skill}
          onChange={setSkill}
          options={[
            { value: "", label: "Toutes compétences" },
            ...skills.map((s) => ({ value: s, label: s })),
          ]}
        />

        {hasActiveFilter && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatus("all");
              setSkill("");
            }}
            className="h-10 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors px-3"
          >
            Réinitialiser
          </button>
        )}

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

      {hasActiveFilter && (
        <p className="text-xs text-zinc-500">
          {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} sur {experiences.length}
        </p>
      )}

      {/* Empty */}
      {filtered.length === 0 && (
        <div className="text-center py-20 border border-dashed border-zinc-800 rounded-2xl">
          <div className="w-12 h-12 bg-zinc-800 rounded-xl mx-auto mb-4 flex items-center justify-center">
            <svg className="w-6 h-6 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75}
                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
            </svg>
          </div>
          <p className="text-zinc-400 font-medium">
            {hasActiveFilter ? "Aucune expérience ne correspond" : "Aucune expérience"}
          </p>
          <p className="text-zinc-600 text-sm mt-1">
            {hasActiveFilter ? "Essaie d'ajuster les filtres." : "Ajoute ta première expérience."}
          </p>
        </div>
      )}

      {paged.length > 0 && view === "list" && <ListView experiences={paged} />}
      {paged.length > 0 && view === "grid" && <GridView experiences={paged} />}

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

// ── shared sub-components ──
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
        active ? "bg-zinc-800 text-white" : "text-zinc-500 hover:text-zinc-300"
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

function ActionLinks({ id }: { id: string }) {
  return (
    <div className="flex items-center gap-3 flex-shrink-0">
      <Link
        href={`/admin/experience/${id}`}
        className="text-xs text-zinc-500 hover:text-zinc-200 transition-colors"
      >
        Éditer
      </Link>
      <DeleteButton url={`/api/experience?id=${id}`} label="" />
    </div>
  );
}

function CurrentBadge() {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs bg-green-app/15 text-green-app border border-green-app/25 px-2 py-0.5 rounded-full font-medium">
      <span className="w-1 h-1 rounded-full bg-green-app/90" />
      En poste
    </span>
  );
}

// ── List view ──
function ListView({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="space-y-3">
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="bg-zinc-900 border border-zinc-800/60 rounded-xl px-5 py-4 hover:border-zinc-700/80 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-white text-sm">{exp.role}</span>
                {exp.current && <CurrentBadge />}
              </div>
              <div className="flex items-center gap-2 mt-1 text-zinc-400 text-sm">
                {exp.companyUrl ? (
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    className="text-zinc-400 hover:text-white transition-colors flex items-center gap-1"
                  >
                    {exp.company}
                  </a>
                ) : (
                  <span>{exp.company}</span>
                )}
                {exp.location && (
                  <>
                    <span className="text-zinc-700">·</span>
                    <span className="text-zinc-500">{exp.location}</span>
                  </>
                )}
              </div>
              <p className="text-xs text-zinc-600 mt-1">
                {fmt(exp.startDate, false)} → {fmt(exp.endDate, exp.current)}
              </p>
              {exp.skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {exp.skills.slice(0, 6).map((s) => (
                    <span
                      key={s}
                      className="text-xs bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded-md"
                    >
                      {s}
                    </span>
                  ))}
                  {exp.skills.length > 6 && (
                    <span className="text-xs text-zinc-600">+{exp.skills.length - 6}</span>
                  )}
                </div>
              )}
            </div>
            <ActionLinks id={exp.id} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ── Grid view ──
function GridView({ experiences }: { experiences: Experience[] }) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {experiences.map((exp) => (
        <div
          key={exp.id}
          className="bg-zinc-900 border border-zinc-800/60 rounded-xl p-5 hover:border-zinc-700 transition-colors flex flex-col gap-3"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-white text-sm leading-snug line-clamp-2">
                {exp.role}
              </h3>
              <p className="text-zinc-400 text-xs mt-1 truncate">
                {exp.company}
                {exp.location && ` · ${exp.location}`}
              </p>
            </div>
            {exp.current && <CurrentBadge />}
          </div>

          <p className="text-[11px] text-zinc-600 font-mono">
            {fmt(exp.startDate, false)} → {fmt(exp.endDate, exp.current)}
          </p>

          {exp.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 flex-1">
              {exp.skills.slice(0, 4).map((s) => (
                <span key={s} className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded">
                  {s}
                </span>
              ))}
              {exp.skills.length > 4 && (
                <span className="text-[10px] text-zinc-600 self-center">+{exp.skills.length - 4}</span>
              )}
            </div>
          )}

          <div className="flex items-center justify-end pt-2 border-t border-zinc-800/60">
            <ActionLinks id={exp.id} />
          </div>
        </div>
      ))}
    </div>
  );
}
