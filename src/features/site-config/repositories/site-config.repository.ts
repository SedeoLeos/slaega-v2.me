import { db } from "@/lib/db";
import type { PortfolioTheme, TickerConfig, TerminalConfig, ValueCardsConfig } from "../types";
import { DEFAULT_THEME, DEFAULT_TICKER, DEFAULT_TERMINAL, DEFAULT_VALUE_CARDS } from "../types";

export type { PortfolioTheme, TickerConfig, TerminalConfig, ValueCardsConfig } from "../types";
export { DEFAULT_THEME, DEFAULT_TICKER, DEFAULT_TERMINAL, DEFAULT_VALUE_CARDS } from "../types";

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

  /** Returns the ticker config, falling back to defaults if not set. */
  async getTicker(): Promise<TickerConfig> {
    const stored = await siteConfigRepository.get<Partial<TickerConfig>>("ticker");
    return { ...DEFAULT_TICKER, ...(stored ?? {}) };
  },

  /** Saves the ticker config (partial merge). */
  async setTicker(patch: Partial<TickerConfig>): Promise<TickerConfig> {
    const current = await siteConfigRepository.getTicker();
    const merged  = { ...current, ...patch };
    await siteConfigRepository.set("ticker", merged);
    return merged;
  },

  /** Returns the terminal showcase config, falling back to defaults if not set. */
  async getTerminal(): Promise<TerminalConfig> {
    const stored = await siteConfigRepository.get<Partial<TerminalConfig>>("terminal");
    return { ...DEFAULT_TERMINAL, ...(stored ?? {}) };
  },

  /** Saves the terminal config (partial merge). */
  async setTerminal(patch: Partial<TerminalConfig>): Promise<TerminalConfig> {
    const current = await siteConfigRepository.getTerminal();
    const merged  = { ...current, ...patch };
    await siteConfigRepository.set("terminal", merged);
    return merged;
  },

  /** Returns the value cards config, falling back to defaults if not set. */
  async getValueCards(): Promise<ValueCardsConfig> {
    const stored = await siteConfigRepository.get<Partial<ValueCardsConfig>>("value-cards");
    return { ...DEFAULT_VALUE_CARDS, ...(stored ?? {}) };
  },

  /** Saves the value cards config (partial merge). */
  async setValueCards(patch: Partial<ValueCardsConfig>): Promise<ValueCardsConfig> {
    const current = await siteConfigRepository.getValueCards();
    const merged  = { ...current, ...patch };
    await siteConfigRepository.set("value-cards", merged);
    return merged;
  },
};
