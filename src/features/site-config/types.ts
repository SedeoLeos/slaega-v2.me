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
  bgColor:   "#0E0E0E",
  textColor: "#FFFFFF",
  speed:     28,
};

// ── Terminal showcase section ─────────────────────────────────────────────────
export type TerminalAnnotation = { label: string; sublabel: string };

export type TerminalConfig = {
  enabled:            boolean;
  badge:              string;         // e.g. "MON STACK"
  heading:            string;         // e.g. "Code. Ship. Repeat."
  terminalLines:      string[];       // lines shown inside the terminal window
  leftAnnotations:    TerminalAnnotation[];
  rightAnnotations:   TerminalAnnotation[];
};

export const DEFAULT_TERMINAL: TerminalConfig = {
  enabled: true,
  badge:   "MON STACK",
  heading: "Code. Ship. Repeat.",
  terminalLines: [
    "> Scanning skills...",
    "> Found 5+ years experience",
    "> Loading stack   OK",
    "> Indexing 30+ projects · 50k+ lines",
    "✓ Ready.  Freelance: ON · Remote: ON",
    "λ _",
  ],
  leftAnnotations: [
    { label: "FRONTEND",  sublabel: "REACT · NEXT.JS · TYPESCRIPT" },
    { label: "MOBILE",    sublabel: "REACT NATIVE · EXPO" },
    { label: "BACKEND",   sublabel: "NODE.JS · NESTJS · PRISMA" },
  ],
  rightAnnotations: [
    { label: "DATABASE",  sublabel: "POSTGRESQL · SQLITE · REDIS" },
    { label: "DEVOPS",    sublabel: "DOCKER · GIT · CI/CD" },
    { label: "DESIGN",    sublabel: "FIGMA · TAILWIND · CSS" },
  ],
};

// ── Value cards (3-column feature section) ────────────────────────────────────
export type ValueCard = {
  badge:       string;  // e.g. "DISPONIBLE"
  title:       string;  // e.g. "Prêt à démarrer"
  description: string;
};

export type ValueCardsConfig = {
  enabled: boolean;
  cards:   ValueCard[];
};

export const DEFAULT_VALUE_CARDS: ValueCardsConfig = {
  enabled: true,
  cards: [
    {
      badge:       "DISPONIBLE",
      title:       "Prêt à démarrer",
      description: "Disponible pour missions freelance et CDI. Réponse sous 24h garantie.",
    },
    {
      badge:       "QUALITÉ",
      title:       "Code sans compromis",
      description: "Architecture propre, tests, revues et documentation à chaque livraison.",
    },
    {
      badge:       "EXPERTISE",
      title:       "Full-stack confirmé",
      description: "De la base de données à l'interface, je maîtrise toute la chaîne produit.",
    },
  ],
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
