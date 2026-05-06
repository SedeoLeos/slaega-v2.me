// ── Types & defaults — importable from client components (no DB deps) ─────────

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
