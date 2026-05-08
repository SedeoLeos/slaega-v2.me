// ─────────────────────────────────────────────
// CV Color Palettes — 5 themes
// ─────────────────────────────────────────────

export type CVPalette = {
  id: string;
  label: string;
  /** Sidebar / dark background (Nexus) */
  sidebar: string;
  /** Primary text / headings */
  primary: string;
  /** Body text */
  body: string;
  /** Muted / secondary text */
  muted: string;
  /** Accent color: markers, bars, highlights */
  accent: string;
  /** Lighter accent for badges/chips bg */
  accentLight: string;
  /** Divider / border */
  border: string;
  /** Paper background */
  paper: string;
  /** Header band background (Prism) */
  band: string;
  /** Text on dark band / sidebar */
  onDark: string;
  /** Muted text on dark band / sidebar */
  onDarkMuted: string;
};

export const CV_PALETTES: CVPalette[] = [
  {
    id: "navy",
    label: "Bleu marine",
    sidebar:      "#0a1a35",
    primary:      "#0a1a35",
    body:         "#2a3a5a",
    muted:        "#6b7a93",
    accent:       "#ed5e3c",
    accentLight:  "#fdf0ec",
    border:       "#e3e8f0",
    paper:        "#ffffff",
    band:         "#0a1a35",
    onDark:       "#ffffff",
    onDarkMuted:  "rgba(255,255,255,0.55)",
  },
  {
    id: "emerald",
    label: "Émeraude",
    sidebar:      "#0d2b22",
    primary:      "#0d2b22",
    body:         "#1a3d30",
    muted:        "#6b8a80",
    accent:       "#05796b",
    accentLight:  "#e8f7f5",
    border:       "#cce8e3",
    paper:        "#ffffff",
    band:         "#0d2b22",
    onDark:       "#ffffff",
    onDarkMuted:  "rgba(255,255,255,0.55)",
  },
  {
    id: "slate",
    label: "Ardoise violette",
    sidebar:      "#1e1b4b",
    primary:      "#1e1b4b",
    body:         "#2e2a5e",
    muted:        "#7c7a9e",
    accent:       "#7c3aed",
    accentLight:  "#f0ebff",
    border:       "#e2e0f0",
    paper:        "#ffffff",
    band:         "#1e1b4b",
    onDark:       "#ffffff",
    onDarkMuted:  "rgba(255,255,255,0.55)",
  },
  {
    id: "amber",
    label: "Ambre chaud",
    sidebar:      "#292300",
    primary:      "#292300",
    body:         "#3d3400",
    muted:        "#8a7a4a",
    accent:       "#d97706",
    accentLight:  "#fff8e6",
    border:       "#e8e0c8",
    paper:        "#fffef9",
    band:         "#292300",
    onDark:       "#ffffff",
    onDarkMuted:  "rgba(255,255,255,0.55)",
  },
  {
    id: "midnight",
    label: "Minuit cyan",
    sidebar:      "#0f172a",
    primary:      "#0f172a",
    body:         "#1e293b",
    muted:        "#64748b",
    accent:       "#06b6d4",
    accentLight:  "#e0f7fb",
    border:       "#dde6f0",
    paper:        "#ffffff",
    band:         "#0f172a",
    onDark:       "#ffffff",
    onDarkMuted:  "rgba(255,255,255,0.55)",
  },
  {
    id: "bordeaux",
    label: "Bordeaux",
    sidebar:      "#2d0a1a",
    primary:      "#2d0a1a",
    body:         "#3d1428",
    muted:        "#8a6070",
    accent:       "#be123c",
    accentLight:  "#fff0f3",
    border:       "#f0d0d8",
    paper:        "#fffbfc",
    band:         "#2d0a1a",
    onDark:       "#ffffff",
    onDarkMuted:  "rgba(255,255,255,0.55)",
  },
  {
    id: "cobalt",
    label: "Bleu institutionnel",
    sidebar:      "#1a2b5c",
    primary:      "#1a2b5c",
    body:         "#2c3e6e",
    muted:        "#7a8bac",
    accent:       "#3b6dc5",
    accentLight:  "#e8f0fb",
    border:       "#c5d5ea",
    paper:        "#ffffff",
    band:         "#1a2b5c",
    onDark:       "#ffffff",
    onDarkMuted:  "rgba(255,255,255,0.60)",
  },
];

export const DEFAULT_PALETTE = CV_PALETTES[0];
