import type { Experience } from "@/entities/experience";

export type CompanyGroup = {
  company: string;
  slug: string;
  location: string;
  companyUrl?: string;
  roles: Experience[]; // most-recent role first
  current: boolean; // any role ongoing
  startDate: string; // earliest start across roles
  endDate: string | null; // latest end (null if a role is current)
  skills: string[]; // union of role skills, order-preserved
};

export function companySlug(company: string): string {
  return company
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Recency key: current roles float to the top, then by end date, then start.
function recencyKey(e: Experience): string {
  return e.current ? "9999-99" : e.endDate || e.startDate || "0000-00";
}

/**
 * Group experiences by company so a career progression inside one company
 * (e.g. full-stack → tech lead → software architect) reads as a single block.
 * Input is assumed already sorted, but we re-sort defensively.
 */
export function groupByCompany(experiences: Experience[]): CompanyGroup[] {
  const map = new Map<string, CompanyGroup>();

  for (const exp of experiences) {
    const slug = companySlug(exp.company);
    let g = map.get(slug);
    if (!g) {
      g = {
        company: exp.company,
        slug,
        location: exp.location,
        companyUrl: exp.companyUrl,
        roles: [],
        current: false,
        startDate: exp.startDate,
        endDate: exp.endDate,
        skills: [],
      };
      map.set(slug, g);
    }
    g.roles.push(exp);
    g.current = g.current || exp.current;
    if (exp.startDate < g.startDate) g.startDate = exp.startDate;
    // latest end: null wins (ongoing); otherwise the max date string
    if (exp.current) {
      g.endDate = null;
    } else if (g.endDate !== null && exp.endDate && exp.endDate > g.endDate) {
      g.endDate = exp.endDate;
    }
    if (!g.companyUrl && exp.companyUrl) g.companyUrl = exp.companyUrl;
    if (!g.location && exp.location) g.location = exp.location;
    for (const s of exp.skills) if (!g.skills.includes(s)) g.skills.push(s);
  }

  const groups = Array.from(map.values());
  for (const g of groups) {
    g.roles.sort((a, b) => recencyKey(b).localeCompare(recencyKey(a)));
  }
  // Order companies by their most-recent role.
  groups.sort((a, b) => {
    const ak = a.current ? "9999-99" : a.endDate || a.startDate || "0000-00";
    const bk = b.current ? "9999-99" : b.endDate || b.startDate || "0000-00";
    return bk.localeCompare(ak);
  });
  return groups;
}

/** Projects whose tags overlap a company's skill set — "the projects of that experience". */
export function matchProjectsToSkills<T extends { tags: string[]; date?: string }>(
  projects: T[],
  skills: string[],
  limit = 6,
): T[] {
  if (skills.length === 0) return [];
  const want = new Set(skills.map((s) => s.toLowerCase()));
  return projects
    .map((p) => ({
      p,
      hits: p.tags.filter((t) => want.has(t.toLowerCase())).length,
    }))
    .filter((x) => x.hits > 0)
    .sort((a, b) => b.hits - a.hits || (b.p.date ?? "").localeCompare(a.p.date ?? ""))
    .slice(0, limit)
    .map((x) => x.p);
}
