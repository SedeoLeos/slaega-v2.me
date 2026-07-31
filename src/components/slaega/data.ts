// ─────────────────────────────────────────────────────────────
// slaega — Seba Gedeon · personal portfolio content
// (design language only is new — content stays the portfolio's own)
// ─────────────────────────────────────────────────────────────

export type Node = {
  id: string;
  label: string;
  hint: string;
  x: number; // % of hero width
  y: number; // % of hero height
};

/** Draggable skill nodes on the hero — the real stack, alive */
export const HERO_NODES: Node[] = [
  { id: "k8s", label: "kubernetes", hint: "k3s · devops", x: 15, y: 28 },
  { id: "rn", label: "react native", hint: "mobile", x: 80, y: 22 },
  { id: "node", label: "node.js", hint: "backend", x: 72, y: 64 },
  { id: "next", label: "next.js", hint: "web", x: 22, y: 68 },
  { id: "sec", label: "openfga", hint: "auth & sécurité", x: 50, y: 44 },
];

export type Discipline = { index: string; title: string; body: string };

/** Ce que je fais — expertise (fallback if the CMS has none) */
export const DISCIPLINES: Discipline[] = [
  {
    index: "01",
    title: "DevOps & Cloud",
    body: "Kubernetes, k3s, CI/CD, provisioning et administration Linux, reverse-proxy, monitoring. Des infrastructures fiables, sécurisées et scalables — livrées en production.",
  },
  {
    index: "02",
    title: "Mobile & Web",
    body: "Applications mobiles natives et cross-platform, web moderne et responsive. React Native, Flutter, React, Next.js, Vue.js.",
  },
  {
    index: "03",
    title: "Backend & API",
    body: "Backends robustes, APIs REST & GraphQL, microservices, architectures distribuées. Node.js, NestJS, Python, Java.",
  },
  {
    index: "04",
    title: "Sécurité & Auth",
    body: "Authentification, gestion des permissions, OAuth, JWT, OpenFGA. La sécurité applicative de bout en bout.",
  },
];
