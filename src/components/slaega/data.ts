// ─────────────────────────────────────────────────────────────
// slaega — content model for the immersive landing
// Elite IT experts association · DevOps · Coding · IT PM · DSI offshore
// ─────────────────────────────────────────────────────────────

export type Node = {
  id: string;
  label: string;
  hint: string;
  x: number; // % of hero width
  y: number; // % of hero height
};

/** Draggable floating nodes on the hero (the ecosystem, alive) */
export const HERO_NODES: Node[] = [
  { id: "lelo", label: "lelo", hint: "field tracking", x: 16, y: 30 },
  { id: "gestpro", label: "gestpro", hint: "stock & retail", x: 78, y: 24 },
  { id: "experh", label: "experh.pro", hint: "HR suite", x: 70, y: 66 },
  { id: "cariereh", label: "cariereH", hint: "recruitment", x: 24, y: 70 },
  { id: "orach", label: "orach", hint: "partner", x: 50, y: 46 },
];

export type Discipline = { index: string; title: string; body: string };

export const DISCIPLINES: Discipline[] = [
  {
    index: "01",
    title: "DevOps & Cloud",
    body: "Kubernetes, k3s, CI/CD, GitOps, observabilité. Des infrastructures fiables, sécurisées et scalables — livrées en production.",
  },
  {
    index: "02",
    title: "High-end Coding",
    body: "Architectures robustes, API-first, microservices, web & mobile. Un code tenu par des standards d'ingénieurs seniors.",
  },
  {
    index: "03",
    title: "IT Project Management",
    body: "Cadrage, delivery, pilotage. On transforme une ambition floue en jalons livrés, mesurables, tenus.",
  },
  {
    index: "04",
    title: "DSI Offshore",
    body: "Votre direction des systèmes d'information, externalisée. La compétence d'une DSI premium, sans la structure lourde.",
  },
];

export type Product = {
  id: string;
  name: string;
  category: string;
  body: string;
  tags: string[];
  size: "lg" | "md";
};

/** Existing software solutions — the slaega ecosystem */
export const PRODUCTS: Product[] = [
  {
    id: "experh",
    name: "experh.pro",
    category: "Ressources Humaines",
    body: "Suite RH complète : employés, contrats, paie, absences, activités. Le back-office des équipes qui grandissent.",
    tags: ["RH", "Paie", "Contrats"],
    size: "lg",
  },
  {
    id: "cariereh",
    name: "cariereH",
    category: "Recrutement",
    body: "Pipeline de recrutement de bout en bout — sourcing, suivi des candidats, décision.",
    tags: ["ATS", "Sourcing"],
    size: "md",
  },
  {
    id: "gestpro",
    name: "gestpro",
    category: "Gestion & Retail",
    body: "Gestion de stock et suivi des ventes / retail en temps réel. Voir, décider, réapprovisionner.",
    tags: ["Stock", "Ventes", "Retail"],
    size: "md",
  },
  {
    id: "lelo",
    name: "lelo",
    category: "Terrain",
    body: "Application de suivi terrain : arrivées et départs, pointage, présence. La réalité du terrain, en direct.",
    tags: ["Pointage", "Mobile"],
    size: "lg",
  },
];

export type Offer = { id: string; title: string; body: string };

export const OFFERS: Offer[] = [
  {
    id: "mail",
    title: "Emails Pro & Noms de domaine",
    body: "Adresses professionnelles, domaines, configuration soignée. Votre identité en ligne, propre dès le premier jour.",
  },
  {
    id: "automation",
    title: "Automatisation & Scripting",
    body: "Workflows sur-mesure, scripts, intégrations. On supprime le travail répétitif — vous gardez le temps.",
  },
];

export type Pack = {
  id: string;
  name: string;
  price: string;
  unit?: string;
  features: string[];
  featured?: boolean;
};

/** Web Packs — sites vitrine */
export const PACKS: Pack[] = [
  {
    id: "essentiel",
    name: "Essentiel",
    price: "65k",
    unit: "FCFA",
    features: ["Site vitrine", "Design responsive", "Mise en ligne", "SEO de base"],
  },
  {
    id: "premium",
    name: "Premium",
    price: "150k",
    unit: "FCFA",
    features: ["Vitrine avancée", "Animations sur-mesure", "CMS éditable", "SEO + performance", "Emails pro"],
    featured: true,
  },
  {
    id: "custom",
    name: "Sur-mesure",
    price: "Sur devis",
    features: ["Cahier des charges dédié", "Fonctionnalités custom", "Intégrations", "Accompagnement DSI"],
  },
];
