import { db } from "@/lib/db";
import type { PortfolioTheme } from "../types";
import { DEFAULT_THEME } from "../types";

export type { PortfolioTheme } from "../types";
export { DEFAULT_THEME } from "../types";

// ── Repository ────────────────────────────────────────────────────────────────

export const siteConfigRepository = {
  /** Get a single config value, parsed as JSON. Returns null if not set. */
  async get<T>(key: string): Promise<T | null> {
    const row = await db.siteConfig.findUnique({ where: { key } });
    if (!row) return null;
    try {
      return JSON.parse(row.value) as T;
    } catch {
      return null;
    }
  },

  /** Upsert a config value (serialised as JSON). */
  async set<T>(key: string, value: T): Promise<void> {
    const json = JSON.stringify(value);
    await db.siteConfig.upsert({
      where:  { key },
      create: { key, value: json },
      update: { value: json },
    });
  },

  /** Returns the portfolio theme, falling back to defaults if not set. */
  async getTheme(): Promise<PortfolioTheme> {
    const stored = await siteConfigRepository.get<Partial<PortfolioTheme>>("theme");
    return { ...DEFAULT_THEME, ...(stored ?? {}) };
  },

  /** Saves the portfolio theme (partial — only provided keys are merged). */
  async setTheme(patch: Partial<PortfolioTheme>): Promise<PortfolioTheme> {
    const current = await siteConfigRepository.getTheme();
    const merged  = { ...current, ...patch };
    await siteConfigRepository.set("theme", merged);
    return merged;
  },
};
