/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PRODUCTION SEEDER — applies the real portfolio content, idempotently.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * Single entry point for ALL portfolio prod data. Safe to re-run any number of
 * times: every record is upserted on a STABLE id (or natural unique key), so a
 * second run updates rather than duplicates, and it NEVER touches user data
 * (ContactSubmission is left untouched).
 *
 * Run:   pnpm db:seed            (wired in package.json)
 *   or:  pnpm tsx prisma/seed-prod.ts
 *
 * Works across all providers (sqlite | postgresql | mysql) — it goes through
 * the same driver-adapter as the app, driven by DATABASE_URL.
 *
 * Experiences reflect the owner's real LinkedIn history (10 roles).
 *
 * ┌───────────────────────────────────────────────────────────────────────────┐
 * │ ⚑ VALUES TO CONFIRM — search "@confirm" below.                            │
 * │     • Featured-project descriptions, dates and real screenshots (/images) │
 * │     • Stats numbers (projects delivered, years, stack size)               │
 * │   Correct them in place, then re-run `pnpm db:seed`.                       │
 * └───────────────────────────────────────────────────────────────────────────┘
 *
 * Note: `prebuild` runs `migrate deploy && seed-prod`, so a PRODUCTION build
 * (re)applies this content automatically (upsert — re-syncs the DB to this
 * file). The seed is skipped on Vercel preview/dev builds and is non-fatal, so
 * a seeding hiccup never breaks a deployment.
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PrismaClient } from "../src/generated/prisma/client";
import { buildAdapter } from "../src/lib/db-adapter";
import {
  DEFAULT_TICKER,
  DEFAULT_TERMINAL,
  DEFAULT_VALUE_CARDS,
  DEFAULT_THEME,
} from "../src/features/site-config/types";

// Skip gracefully when no database is configured (e.g. a build step without a
// DATABASE_URL) — mirrors the behaviour of `scripts/db.ts migrate deploy`.
if (!process.env.DATABASE_URL || !process.env.DATABASE_URL.trim()) {
  console.warn("⚠  DATABASE_URL is not set — skipping seed.");
  process.exit(0);
}

// On Vercel, only seed on PRODUCTION deployments. Preview/development builds
// must never seed — they may share the production DATABASE_URL and would
// otherwise overwrite live content on every PR build. Locally VERCEL_ENV is
// undefined, so `pnpm db:seed` still runs normally.
if (process.env.VERCEL_ENV && process.env.VERCEL_ENV !== "production") {
  console.warn(`⚠  VERCEL_ENV=${process.env.VERCEL_ENV} — skipping seed (production deploys only).`);
  process.exit(0);
}

const db = new PrismaClient({
  adapter: buildAdapter(process.env.DATABASE_URL!),
});

// ═══════════════════════════════════════════════════════════════════════════
//  1. PROJECTS — sourced from the MDX files in src/content/project
// ═══════════════════════════════════════════════════════════════════════════
async function seedProjects() {
  const dir = path.join(process.cwd(), "src/content/project");
  if (!fs.existsSync(dir)) return;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    const slug = file.replace(/\.mdx$/, "");

    const description =
      content
        .replace(/^#{1,6}\s+.*$/gm, "")
        .replace(/^\s*$/gm, "")
        .split("\n")
        .find((l) => l.trim())
        ?.trim() ?? "";

    const payload = {
      title: String(data.title ?? slug),
      date: String(data.date ?? new Date().toISOString().split("T")[0]),
      tags: JSON.stringify(Array.isArray(data.tags) ? data.tags : []),
      categories: JSON.stringify(Array.isArray(data.categories) ? data.categories : []),
      image: String(data.image ?? "/img.jpg"),
      description,
      content,
      published: data.published === undefined ? true : Boolean(data.published),
      projectUrl: data.projectUrl ? String(data.projectUrl) : null,
      githubUrl: data.githubUrl ? String(data.githubUrl) : null,
      videoUrl: data.videoUrl ? String(data.videoUrl) : null,
    };

    await db.project.upsert({
      where: { slug },
      create: { slug, ...payload },
      update: payload,
    });
  }
  console.log(`✓ Projects (${files.length}) upserted`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  1b. FEATURED PROJECTS — Nanocreatives realisations (DB-only, not from MDX)
//      @confirm each `description` / `image` / `date`. Add a real screenshot
//      under /public/images and update `image` when available.
// ═══════════════════════════════════════════════════════════════════════════
const FEATURED_PROJECTS = [
  {
    slug: "focus-suite",
    title: "Focus Suite — Plateforme SaaS",
    date: "2023-09-01", // @confirm
    tags: ["NestJS", "Next.js", "SaaS", "Keycloak", "Multi-tenant", "TypeScript"],
    categories: ["web-app", "api-webservice"],
    description:
      "Lead developer de pro.focus-suite.com : plateforme SaaS de gestion d'entreprise. Architecture multi-tenant, authentification et autorisation fine.", // @confirm
    projectUrl: "https://pro.focus-suite.com",
  },
  {
    slug: "civis-cms",
    title: "Civis — CMS institutionnel",
    date: "2023-06-01", // @confirm
    tags: ["CMS", "Next.js", "NestJS", "Government", "Public Sector", "Multi-site"],
    categories: ["web-app", "platform-deployment"],
    description:
      "CMS institutionnel Civis, utilisé par des ministères en RDC pour gérer et publier leurs contenus officiels.", // @confirm
    projectUrl: null as string | null,
  },
  {
    slug: "ordre-des-pharmaciens-cg",
    title: "Ordre des Pharmaciens du Congo",
    date: "2023-04-01", // @confirm
    tags: ["Next.js", "Institutional", "Showcase", "SEO", "Public Sector"],
    categories: ["web-app", "showcase-site"],
    description:
      "Site institutionnel de l'Ordre des Pharmaciens du Congo — présentation de l'institution et services aux membres.", // @confirm
    projectUrl: "https://ordredespharmaciens.cg/",
  },
  {
    slug: "nutrisports-shop",
    title: "Nutrisports Shop — E-commerce",
    date: "2023-05-01", // @confirm
    tags: ["E-commerce", "Next.js", "NestJS", "Payment", "Catalog", "Cart"],
    categories: ["web-app", "api-webservice"],
    description:
      "Boutique e-commerce Nutrisports : catalogue produits, panier, paiement et gestion des commandes.", // @confirm
    projectUrl: "https://nutrisports-shop.com/",
  },
  {
    slug: "societe-cg",
    title: "Societe.cg",
    date: "2023-03-01", // @confirm
    tags: ["Next.js", "NestJS", "Web App", "Congo"],
    categories: ["web-app"],
    description:
      "Plateforme web Societe.cg développée chez Nanocreatives.", // @confirm — préciser la nature du projet
    projectUrl: "https://societe.cg",
  },
  {
    slug: "bralima",
    title: "Bralima",
    date: "2023-10-01", // @confirm
    tags: ["Next.js", "Institutional", "Showcase", "Corporate", "SEO"],
    categories: ["web-app", "showcase-site"],
    description:
      "Site corporate Bralima (bralima.net) développé chez Nanocreatives.", // @confirm — préciser la nature du projet
    projectUrl: "https://bralima.net/",
  },
  {
    slug: "retailix-partners",
    title: "Retailix Partners",
    date: "2023-07-01", // @confirm
    tags: ["Next.js", "NestJS", "Retail", "Web App", "B2B"],
    categories: ["web-app"],
    description:
      "Plateforme Retailix Partners développée chez Nanocreatives.", // @confirm — préciser la nature du projet
    projectUrl: "https://retailixpartners.com/",
  },
  {
    slug: "iolifescience-infra",
    title: "IO Life Science — Infrastructure",
    date: "2023-08-01", // @confirm
    tags: ["DevOps", "Docker", "Coolify", "Nginx", "Infrastructure", "Provisioning"],
    categories: ["platform-deployment", "self-hosted-platform"],
    description:
      "Configuration et provisioning de l'infrastructure d'iolifescience.com : serveurs, déploiement via Coolify et mise en production.", // @confirm
    projectUrl: "https://iolifescience.com/",
  },
];

async function seedFeaturedProjects() {
  for (const p of FEATURED_PROJECTS) {
    const payload = {
      title: p.title,
      date: p.date,
      tags: JSON.stringify(p.tags),
      categories: JSON.stringify(p.categories),
      image: "/images/img.jpg", // @confirm — remplacer par une vraie capture
      description: p.description,
      content: p.description,
      published: true,
      projectUrl: p.projectUrl,
      githubUrl: null,
      videoUrl: null,
    };
    await db.project.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, ...payload },
      update: payload,
    });
  }
  console.log(`✓ Featured projects (${FEATURED_PROJECTS.length}) upserted`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  2. EXPERIENCES — real professional history
//     @confirm roles / dates / "current" flags below.
// ═══════════════════════════════════════════════════════════════════════════
// Source: profil LinkedIn (Seba Gedeon Matsoula Malonga). Dates au format YYYY-MM.
const EXPERIENCES = [
  {
    id: "novenvera",
    company: "Novenvera",
    role: "Ingénieur Logiciel Senior & Principal DevOps",
    startDate: "2026-06",
    endDate: null,
    current: true,
    description:
      "Ingénieur logiciel senior avec une responsabilité DevOps de premier plan. Je conçois et fiabilise des solutions logicielles critiques et scalables : analyse technique approfondie, architecture backend et application rigoureuse des bonnes pratiques (Clean Code, sécurité, observabilité, monitoring). Je pilote également l'industrialisation — pipelines CI/CD, infrastructure et cloud — afin de livrer des systèmes fiables, maintenables et performants pour des environnements à forte exigence technique.",
    skills: ["Backend", "Architecture", "Clean Code", "Sécurité", "Observabilité", "CI/CD", "Cloud", "DevOps"],
    location: "Brazzaville, République du Congo (hybride)",
    companyUrl: null as string | null,
  },
  {
    id: "ministere-finances-ebourse",
    company: "Ministère des Finances, du Budget et du Portefeuille Public — Congo",
    role: "Senior Software Engineer — Projet e-Bourse",
    startDate: "2025-10",
    endDate: null,
    current: true,
    description:
      "Intervention sur e-Bourse, projet institutionnel à enjeux financiers de l'administration publique. Je développe l'application mobile (React Native / Expo) ainsi que son backend mobile (BFF) en Spring Boot : conception des parcours et écrans, exposition d'API adaptées au mobile, sécurité et performance — pour une solution fiable et accessible aux usagers du dispositif e-Bourse.",
    skills: ["React Native", "Expo", "Spring Boot", "Java", "BFF", "PostgreSQL", "Sécurité"],
    location: "Brazzaville, République du Congo",
    companyUrl: null as string | null,
  },
  {
    id: "slaega",
    company: "Slaega",
    role: "Principal / CEO",
    startDate: "2018-01",
    endDate: null,
    current: true,
    description:
      "Fondateur et dirigeant de Slaega. Je porte une vision d'innovation et d'excellence technique : transformer des idées ambitieuses en réalisations concrètes, structurer des produits robustes et évolutifs, et inspirer une nouvelle génération d'ingénieurs à repousser les limites de l'exploration, de la science et du logiciel.",
    skills: ["Leadership", "Vision produit", "Architecture", "Entrepreneuriat"],
    location: "République du Congo",
    companyUrl: null as string | null,
  },
  {
    id: "nanocreatives",
    company: "Nanocreatives",
    role: "Architecte Logiciel & Lead Full-Stack",
    startDate: "2023-11",
    endDate: "2026-06",
    current: false,
    description:
      "Progression d'Ingénieur Full-Stack à Lead puis Architecte logiciel. Conception d'architectures robustes (API-first, microservices, intégrations tierces), développement web & mobile (Next.js, React Native, Node.js/NestJS), pipelines CI/CD et DevOps, gestion des environnements serveurs et cloud, mentorat de l'équipe. Réalisations livrées en production : societe.cg, ordredespharmaciens.cg, nutrisports-shop.com, retailixpartners.com, bralima.net, le CMS Civis (ministères en RDC), et lead developer de pro.focus-suite.com. Mise en place de l'infrastructure (provisioning serveurs, Coolify, dont iolifescience.com).",
    skills: ["Next.js", "React Native", "Node.js", "NestJS", "Microservices", "CI/CD", "Coolify", "Docker", "Keycloak", "OpenFGA", "Cerbos"],
    location: "Thiais, Île-de-France, France (à distance)",
    companyUrl: null as string | null,
  },
  {
    id: "baye-conception",
    company: "Baye Conception",
    role: "Software Full-Stack Engineer (Freelance)",
    startDate: "2023-10",
    endDate: "2024-12",
    current: false,
    description:
      "Conception et développement de solutions digitales sur mesure, sur l'ensemble du cycle (analyse des besoins, architecture, développement front & back, intégration, tests, mise en production). Conseil technique, amélioration des processus et accélération des livraisons.",
    skills: ["Full-Stack", "Architecture", "API", "Cloud", "CI/CD", "React", "Next.js"],
    location: "Maroc (à distance)",
    companyUrl: null as string | null,
  },
  {
    id: "ginov-digital",
    company: "Ginov Digital",
    role: "Développeur Backend",
    startDate: "2023-01",
    endDate: "2023-11",
    current: false,
    description:
      "Développement et intégration de solutions backend, avec un focus sur les middleware, la gestion et le traitement des données et la communication entre systèmes : orchestration de services, intégration de données multi-sources, API sécurisées et robustes, monitoring et maintenance.",
    skills: ["Node.js", "Middleware", "API", "Intégration de données", "Backend"],
    location: "Brazzaville, République du Congo",
    companyUrl: null as string | null,
  },
  {
    id: "cfi-ciras",
    company: "CFI CIRAS",
    role: "Formateur en Développement Mobile",
    startDate: "2023-05",
    endDate: "2023-09",
    current: false,
    description:
      "Conception et animation de modules de formation en développement mobile (Flutter) : transmission des bonnes pratiques, encadrement des projets pratiques, sensibilisation aux méthodologies agiles et aux workflows DevOps, mentorat et évaluation des apprenants.",
    skills: ["Flutter", "Formation", "Mentorat", "Agile", "Mobile"],
    location: "République du Congo",
    companyUrl: null as string | null,
  },
  {
    id: "ministere-finances-alternance",
    company: "Ministère des Finances, du Budget et du Portefeuille Public — Congo",
    role: "Full-Stack Software Engineer (Alternance)",
    startDate: "2022-06",
    endDate: "2022-12",
    current: false,
    description:
      "Stage pré-emploi. Développement et amélioration des outils numériques internes soutenant les opérations administratives et financières, en front-end et back-end, sur l'ensemble du cycle de développement logiciel.",
    skills: ["Full-Stack", "Frontend", "Backend", "Transformation digitale"],
    location: "Brazzaville, République du Congo",
    companyUrl: null as string | null,
  },
  {
    id: "soprim",
    company: "SOPRIM — Société de Promotion Immobilière",
    role: "Informaticien (Alternance)",
    startDate: "2021-12",
    endDate: "2022-05",
    current: false,
    description:
      "Poste d'informaticien en alternance au sein d'une société de promotion immobilière. Analyse des besoins, conception et développement d'une solution de gestion de stock, maintenance des outils internes et contribution à la digitalisation des processus métiers, avec le framework Django / Django REST.",
    skills: ["Django", "Django REST", "Python", "PostgreSQL", "Gestion de stock"],
    location: "Brazzaville, République du Congo",
    companyUrl: null as string | null,
  },
  {
    id: "freelance-2019",
    company: "Freelance / Indépendant",
    role: "Développeur Logiciel Freelance",
    startDate: "2019-11",
    endDate: "2021-06",
    current: false,
    description:
      "Développement de solutions logicielles pour des PME locales : applications de gestion de stocks (boutiques, pharmacies), systèmes de gestion de tontines et outils financiers simples, développement backend et frontend, support IT, analyse des besoins et modélisation des données.",
    skills: ["Full-Stack", "Django", "Gestion de stock", "PME", "Support IT"],
    location: "République du Congo",
    companyUrl: null as string | null,
  },
];

async function seedExperiences() {
  for (const exp of EXPERIENCES) {
    const payload = {
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.endDate,
      current: exp.current,
      description: exp.description,
      skills: JSON.stringify(exp.skills),
      location: exp.location,
      companyUrl: exp.companyUrl,
    };
    await db.experience.upsert({
      where: { id: exp.id },
      create: { id: exp.id, ...payload },
      update: payload,
    });
  }
  console.log(`✓ Experiences (${EXPERIENCES.length}) upserted`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  3. STATS — banner counters   @confirm the exact numbers
// ═══════════════════════════════════════════════════════════════════════════
const STATS = [
  { id: "stat-projets", value: "30+", label: "Projets livrés", color: "green", order: 0 }, // @confirm
  { id: "stat-experience", value: "5+", label: "Années d'expérience", color: "rose", order: 1 }, // @confirm
  { id: "stat-stack", value: "15+", label: "Technologies maîtrisées", color: "amber", order: 2 }, // @confirm
  { id: "stat-engagement", value: "100%", label: "Engagement", color: "dark", order: 3 },
];

async function seedStats() {
  for (const s of STATS) {
    const payload = { value: s.value, label: s.label, color: s.color, order: s.order, published: true };
    await db.stat.upsert({ where: { id: s.id }, create: { id: s.id, ...payload }, update: payload });
  }
  console.log(`✓ Stats (${STATS.length}) upserted`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  4. SERVICES
// ═══════════════════════════════════════════════════════════════════════════
const SERVICES = [
  {
    id: "svc-mobile-web",
    title: "Développement Mobile & Web",
    description:
      "Applications mobiles cross-platform et applications web modernes et responsives. Expertise en Flutter, Expo (React Native), Next.js.",
    icon: "device",
  },
  {
    id: "svc-backend-api",
    title: "Backend & API",
    description:
      "Backends robustes, APIs RESTful et microservices, architectures distribuées. Maîtrise de Spring Boot, NestJS, Laravel, Go et bases de données.",
    icon: "code",
  },
  {
    id: "svc-securite-auth",
    title: "Sécurité & Autorisation",
    description:
      "Authentification et autorisation fine : Keycloak, OpenFGA, Cerbos, OAuth / OIDC, JWT. Sécurisation des accès et des données sensibles.",
    icon: "shield",
  },
  {
    id: "svc-devops",
    title: "DevOps & Infrastructure",
    description:
      "Pipelines CI/CD, Docker, Coolify, déploiement et monitoring sur cloud (AWS, Azure, OpenStack).",
    icon: "cloud",
  },
  {
    id: "svc-integration",
    title: "Intégration & Automatisation",
    description:
      "Orchestration multi-systèmes (ERP, CRM, CMS, SaaS), automatisation de processus métiers avec n8n et intégration d'APIs tierces.",
    icon: "cog",
  },
];

async function seedServices() {
  for (const [i, s] of SERVICES.entries()) {
    const payload = { title: s.title, description: s.description, icon: s.icon, order: i, published: true };
    await db.service.upsert({ where: { id: s.id }, create: { id: s.id, ...payload }, update: payload });
  }
  console.log(`✓ Services (${SERVICES.length}) upserted`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  5. CONTACT FIELDS — form definition (upsert on unique `name`)
// ═══════════════════════════════════════════════════════════════════════════
const CONTACT_FIELDS = [
  { name: "name", label: "Nom", type: "text", placeholder: "Votre nom", required: true, options: "[]", order: 0 },
  { name: "email", label: "Email", type: "email", placeholder: "vous@exemple.com", required: true, options: "[]", order: 1 },
  {
    name: "subject",
    label: "Sujet",
    type: "select",
    placeholder: "Choisir un sujet",
    required: false,
    options: JSON.stringify(["Mission freelance", "Conseil technique", "Recrutement", "Question générale", "Autre"]),
  },
  { name: "message", label: "Message", type: "textarea", placeholder: "Décrivez votre projet…", required: true, options: "[]", order: 3 },
];

async function seedContactFields() {
  for (const f of CONTACT_FIELDS) {
    const payload = {
      label: f.label,
      type: f.type,
      placeholder: f.placeholder,
      required: f.required,
      options: f.options,
      order: f.order,
      published: true,
    };
    await db.contactField.upsert({ where: { name: f.name }, create: { name: f.name, ...payload }, update: payload });
  }
  console.log(`✓ Contact fields (${CONTACT_FIELDS.length}) upserted`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  6. ABOUT BLOCK — small banner card (singleton)
// ═══════════════════════════════════════════════════════════════════════════
async function seedAboutBlock() {
  const payload = {
    label: "À propos de moi",
    body: "Architecte logiciel & ingénieur full-stack — solutions métiers et institutionnelles à enjeux financiers.",
    ctaText: "En savoir plus",
    ctaHref: "/about",
    published: true,
  };
  await db.aboutBlock.upsert({ where: { id: "about-block-main" }, create: { id: "about-block-main", ...payload }, update: payload });
  console.log("✓ AboutBlock upserted");
}

// ═══════════════════════════════════════════════════════════════════════════
//  7. ABOUT PAGE — /about singleton (CV-enriched)
// ═══════════════════════════════════════════════════════════════════════════
const ABOUT_PAGE = {
  label: "Apprenez à me connaître",
  title: "À propos",
  intro:
    "Salut ! Je suis Seba Gedeon Matsoula Malonga — architecte logiciel & ingénieur full-stack basé à Brazzaville, avec une expérience couvrant des projets institutionnels, des missions de conseil et des solutions métiers à enjeux financiers.",
  body: `J'interviens sur l'analyse des besoins, la conception et l'intégration de **systèmes numériques complexes**, en privilégiant des solutions pragmatiques, sécurisées et adaptées aux réalités des organisations publiques et privées.

Au sein du **Ministère des Finances de Brazzaville**, je contribue à des projets institutionnels structurants : *e-Bourse* (Flutter / Spring Boot), *Syspace* (gestion des contribuables), et l'assistance technique POC auprès du DSI. En parallèle, je conçois chez **Nanocreatives** des plateformes de gestion d'entreprise (ventes, facturation, achats, RH, paie, audit) avec un focus fort sur la sécurité — intégration de **Keycloak** pour l'authentification, **OpenFGA** et **Cerbos** pour la gestion fine des autorisations.

Ma stack quotidienne : **Spring Boot, NestJS, Next.js, Laravel, Flutter, Expo, Go**. J'aime particulièrement les architectures distribuées, les microservices et l'orchestration multi-systèmes (ERP, CRM, CMS, SaaS). Côté DevOps : Docker, Coolify, AWS, Azure, GitLab/GitHub CI/CD.`,
  highlights: [
    {
      title: "Ce que je peux réaliser",
      items: [
        "Projets numériques à enjeux financiers et institutionnels",
        "Solutions fiables adaptées aux contraintes métiers",
        "Sécurisation des accès et données sensibles",
        "Automatisation et optimisation de processus",
        "Travail en environnements réglementés",
      ],
    },
    {
      title: "Stack principale",
      items: ["Spring Boot", "NestJS", "Next.js", "Laravel", "Flutter", "Expo (React Native)", "Go", "LangChain", "n8n"],
    },
    {
      title: "DevOps & Infra",
      items: ["Docker", "Coolify", "AWS", "Azure", "OpenStack", "GitLab CI", "GitHub Actions"],
    },
    {
      title: "Sécurité",
      items: ["Keycloak", "OpenFGA", "Cerbos", "OAuth / OIDC", "JWT"],
    },
  ],
  ctaText: "Me contacter",
  ctaHref: "/contact",
  published: true,
};

async function seedAboutPage() {
  const payload = { ...ABOUT_PAGE, highlights: JSON.stringify(ABOUT_PAGE.highlights) };
  await db.aboutPage.upsert({ where: { id: "about-page-main" }, create: { id: "about-page-main", ...payload }, update: payload });
  console.log("✓ AboutPage upserted");
}

// ═══════════════════════════════════════════════════════════════════════════
//  8. FAQ ITEMS
// ═══════════════════════════════════════════════════════════════════════════
const FAQ_ITEMS = [
  {
    id: "faq-freelance",
    question: "Disponible pour des missions freelance ?",
    answer:
      "Oui, je suis disponible pour des missions freelance en développement web, mobile et backend. N'hésitez pas à me contacter via le formulaire pour discuter de votre projet.",
  },
  {
    id: "faq-stack",
    question: "Quelles sont tes technologies principales ?",
    answer:
      "Spring Boot, NestJS, Next.js, Laravel côté back, Flutter et Expo (React Native) pour le mobile, Go pour les services performants. Côté sécurité : Keycloak, OpenFGA, Cerbos. DevOps : Docker, Coolify, AWS, Azure, CI/CD.",
  },
  {
    id: "faq-collaboration",
    question: "Comment se passe une collaboration ?",
    answer:
      "Tout commence par un appel de découverte pour comprendre vos besoins. Ensuite je propose une architecture, un planning et un devis. On itère ensemble jusqu'à la livraison finale, avec des démos régulières.",
  },
  {
    id: "faq-remote",
    question: "Peux-tu travailler à distance ?",
    answer:
      "Absolument. Je travaille en remote depuis plusieurs années, avec des clients institutionnels et privés. Outils de collaboration et démos régulières pour garder une visibilité totale sur l'avancement.",
  },
  {
    id: "faq-delais",
    question: "Dans quels délais peux-tu livrer un projet ?",
    answer:
      "Ça dépend de la complexité. Un MVP simple peut être prêt en 2-4 semaines. Un produit complet prend généralement 2-3 mois. Je fournis toujours un planning détaillé dès le démarrage.",
  },
];

async function seedFaq() {
  for (const [i, f] of FAQ_ITEMS.entries()) {
    const payload = { question: f.question, answer: f.answer, order: i, published: true };
    await db.faqItem.upsert({ where: { id: f.id }, create: { id: f.id, ...payload }, update: payload });
  }
  console.log(`✓ FAQ items (${FAQ_ITEMS.length}) upserted`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  9. PROCESS STEPS — "Mon approche"
// ═══════════════════════════════════════════════════════════════════════════
const PROCESS_STEPS = [
  {
    id: "step-1",
    stepNumber: 1,
    label: "STEP 01",
    title: "Analyse & Découverte",
    description:
      "Écoute active de vos besoins, cadrage du projet, définition des objectifs et contraintes techniques. On aligne la vision avant d'écrire la première ligne.",
  },
  {
    id: "step-2",
    stepNumber: 2,
    label: "STEP 02",
    title: "Design & Architecture",
    description:
      "Wireframes, choix de la stack, modélisation des données et prototypage rapide. L'architecture est pensée pour durer, pas juste pour démarrer.",
  },
  {
    id: "step-3",
    stepNumber: 3,
    label: "STEP 03",
    title: "Développement & Livraison",
    description:
      "Implémentation itérative avec démos régulières, tests, review de code et déploiement. Livraison propre, documentée et maintenable.",
  },
];

async function seedProcess() {
  for (const [i, p] of PROCESS_STEPS.entries()) {
    const payload = {
      stepNumber: p.stepNumber,
      label: p.label,
      title: p.title,
      description: p.description,
      order: i,
      published: true,
    };
    await db.processStep.upsert({ where: { id: p.id }, create: { id: p.id, ...payload }, update: payload });
  }
  console.log(`✓ Process steps (${PROCESS_STEPS.length}) upserted`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  10. SITE CONFIG — ticker / terminal / value-cards / theme (JSON key-value)
//      Only sets a key if it is not already present, so admin edits win.
// ═══════════════════════════════════════════════════════════════════════════
const SITE_CONFIG: Record<string, unknown> = {
  ticker: DEFAULT_TICKER,
  terminal: DEFAULT_TERMINAL,
  "value-cards": DEFAULT_VALUE_CARDS,
  theme: DEFAULT_THEME,
};

async function seedSiteConfig() {
  for (const [key, value] of Object.entries(SITE_CONFIG)) {
    const json = JSON.stringify(value);
    // create-only: never clobber a value already customised via the admin.
    await db.siteConfig.upsert({ where: { key }, create: { key, value: json }, update: {} });
  }
  console.log(`✓ SiteConfig (${Object.keys(SITE_CONFIG).length} keys) ensured`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  Orchestrator
// ═══════════════════════════════════════════════════════════════════════════
async function main() {
  console.log("🌱 Seeding PRODUCTION portfolio data…\n");
  await seedProjects();
  await seedFeaturedProjects();
  await seedExperiences();
  await seedStats();
  await seedServices();
  await seedContactFields();
  await seedAboutBlock();
  await seedAboutPage();
  await seedFaq();
  await seedProcess();
  await seedSiteConfig();
  console.log("\n✅ Production seed complete.");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
