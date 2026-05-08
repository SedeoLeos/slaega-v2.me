// ── Types & defaults — importable from client components (no DB deps) ─────────

// ── Ticker / marquee banner ───────────────────────────────────────────────────
export type TickerConfig = {
  enabled:   boolean;
  items:     string[];  // e.g. ["Full-Stack Dev", "Mobile & Web", …]
  bgColor:   string;   // hex — background of the banner
  textColor: string;   // hex — text / dot color
  speed:     number;   // animation duration in seconds (lower = faster)
};

export const DEFAULT_TICKER: TickerConfig = {
  enabled:   true,
  items:     ["Full-Stack Developer", "Mobile & Web", "Backend & API", "DevOps", "Open Source"],
  bgColor:   "#05796B",
  textColor: "#FFFFFF",
  speed:     28,
};

// ── Portfolio theme ───────────────────────────────────────────────────────────
export type PortfolioTheme = {
  background: string;
  foreground: string;
  greenApp:   string;
  card:       string;
  accent:     string;
  secondary:  string;
};

export const DEFAULT_THEME: PortfolioTheme = {
  background: "#DCDED0",
  foreground: "#0E0E0E",
  greenApp:   "#05796B",
  card:       "#F5F5EE",
  accent:     "#05796B",
  secondary:  "#8C8C8C",
};
