// ─────────────────────────────────────────────
// Shared types for the CV generator
// ─────────────────────────────────────────────

export type CVExperience = {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  skills: string[];
  location: string;
  score: number;
};

export type CVProject = {
  title: string;
  desc: string;
  tags: string[];
  slug: string;
  score: number;
};

export type CVData = {
  keywords: string[];
  tagline?: string;
  summary?: string;
  language?: "fr" | "en";
  jobTitle: string;
  capabilities?: string[];
  experiences: CVExperience[];
  projects: CVProject[];
  relevantSkills: string[];
  allSkills: string[];
};

// ─── Section visibility / overrides ─────────────────────────────────────────
/** Per-section control: visible + optional manual text override */
export type CVSectionOverride = {
  visible: boolean;
  /** If set, replaces the AI-generated text for this field */
  text?: string;
};

export type CVSections = {
  tagline: CVSectionOverride;
  summary: CVSectionOverride;
  capabilities: CVSectionOverride;
  experience: CVSectionOverride;
  projects: CVSectionOverride;
  skills: CVSectionOverride;
  contact: CVSectionOverride;
};

export const defaultSections = (): CVSections => ({
  tagline: { visible: true },
  summary: { visible: true },
  capabilities: { visible: true },
  experience: { visible: true },
  projects: { visible: true },
  skills: { visible: true },
  contact: { visible: true },
});

// ─── Templates ───────────────────────────────────────────────────────────────
export type CVTemplateId =
  | "kronos"
  | "nexus"
  | "prism"
  | "duo"
  | "orbit"
  | "nova"
  | "pulse"
  | "supra"
  | "hello"
  | "mosaic"
  | "julien";

export type CVTemplateInfo = {
  id: CVTemplateId;
  label: string;
  description: string;
};

export const CV_TEMPLATES: CVTemplateInfo[] = [
  {
    id: "kronos",
    label: "Kronos",
    description: "Barre accent, grille compétences",
  },
  { id: "nexus", label: "Nexus", description: "Sidebar sombre, icônes" },
  { id: "prism", label: "Prism", description: "Bandeau coloré, minimaliste" },
  { id: "duo", label: "Duo", description: "Sidebar + dot ratings" },
  { id: "orbit", label: "Orbit", description: "Globe géométrique, bicolonnes" },
  { id: "nova", label: "Nova", description: "Header bold + décoration" },
  {
    id: "pulse",
    label: "Pulse",
    description: "Cards arrondies, hashtags colorés",
  },
  {
    id: "supra",
    label: "Supra",
    description: "Photo pleine + sidebar + projets",
  },
  { id: "hello", label: "Hello", description: "Photo hero + progress bars" },
  {
    id: "mosaic",
    label: "Mosaic",
    description: "Mosaïque bleue fixe (no thème)",
  },
  {
    id: "julien",
    label: "Julien",
    description: "Card bicolonne, hashtags, timeline",
  },
];

// ─── Profile ─────────────────────────────────────────────────────────────────
export const CV_PROFILE = {
  name: "SEBA GEDEON",
  surname: "MATSOULA MALONGA",
  email: "gedeon.matsoula@gmail.com",
  phone: "+242066900110",
  linkedin: "linkedin.com/in/slaega",
  photo: "/images/me.jpg",
};

// ─── Labels ──────────────────────────────────────────────────────────────────
export const CV_LABELS = {
  fr: {
    email: "EMAIL",
    phone: "TÉLÉPHONE",
    linkedin: "LINKEDIN",
    canDo: "CE QUE J'APPORTE",
    experience: "EXPÉRIENCES",
    projects: "PROJETS SÉLECTIONNÉS",
    skills: "COMPÉTENCES CLÉS",
    present: "PRÉSENT",
    contact: "CONTACT",
  },
  en: {
    email: "EMAIL",
    phone: "PHONE",
    linkedin: "LINKEDIN",
    canDo: "WHAT I CAN DELIVER",
    experience: "EXPERIENCE",
    projects: "SELECTED PROJECTS",
    skills: "KEY SKILLS",
    present: "PRESENT",
    contact: "CONTACT",
  },
} as const;

// ─── Helpers ─────────────────────────────────────────────────────────────────
const MONTHS_FR = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
];
const MONTHS_EN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function formatMonth(
  date: string | null,
  current: boolean,
  lang: "fr" | "en",
  presentLabel: string,
): string {
  if (current) return presentLabel;
  if (!date) return "";
  const [y, m] = date.split("-");
  const months = lang === "en" ? MONTHS_EN : MONTHS_FR;
  return `${months[parseInt(m) - 1]} ${y}`;
}

export function stripHtml(s: string): string {
  return (s ?? "")
    .replace(
      /<\/?(p|br|div|h[1-6]|li|ul|ol|strong|em|a|u|span|table|tr|td|th|img|hr)[^>]*>/gi,
      " ",
    )
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}
