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
  { id: "k8s", label: "kubernetes", hint: "k3s · devops", x: 14, y: 26 },
  { id: "coolify", label: "coolify", hint: "self-host paas", x: 82, y: 22 },
  { id: "argocd", label: "argo cd", hint: "gitops · ci/cd", x: 73, y: 62 },
  { id: "keycloak", label: "keycloak", hint: "iam · sso", x: 19, y: 66 },
  { id: "authz", label: "openfga", hint: "authorization", x: 49, y: 43 },
  { id: "rn", label: "react native", hint: "mobile", x: 40, y: 82 },
];

/** Full tech stack — scrolling marquee band */
export const STACK: string[] = [
  "Kubernetes", "k3s", "Coolify", "Dokploy", "CapRover", "Argo CD", "Jenkins",
  "Docker", "GitOps", "CI/CD", "Nginx", "Linux",
  "Next.js", "React", "React Native", "Flutter", "Node.js", "NestJS", "Python",
  "Keycloak", "Auth0", "Okta", "OpenFGA", "SpiceDB", "Permit.io", "OAuth", "JWT",
  "TypeScript", "PostgreSQL", "GraphQL",
];

export type Discipline = { index: string; title: string; body: string };

/** Ce que je fais — expertise (fallback if the CMS has none) */
export const DISCIPLINES: Discipline[] = [
  {
    index: "01",
    title: "DevOps & Cloud",
    body: "Kubernetes & k3s, GitOps (Argo CD), CI/CD (Jenkins), PaaS self-hosted (Coolify, Dokploy, CapRover), provisioning et administration Linux, reverse-proxy, monitoring. Des infras fiables, sécurisées et scalables — livrées en production.",
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
    title: "IAM · Auth & Autorisation",
    body: "Identité & SSO (Keycloak, Auth0, Okta), autorisation fine (OpenFGA, SpiceDB, Permit.io), OAuth, JWT. La sécurité applicative et la gestion des accès, de bout en bout.",
  },
];
