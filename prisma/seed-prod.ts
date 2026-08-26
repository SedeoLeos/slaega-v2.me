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

    const projectUrl = data.projectUrl ? String(data.projectUrl) : null;
    // Projects with a public link get a live preview of the real site; others
    // keep their front-matter image.
    const image = projectUrl ? livePreview(projectUrl) : String(data.image ?? "");

    const payload = {
      title: String(data.title ?? slug),
      date: String(data.date ?? new Date().toISOString().split("T")[0]),
      tags: JSON.stringify(Array.isArray(data.tags) ? data.tags : []),
      categories: JSON.stringify(Array.isArray(data.categories) ? data.categories : []),
      image,
      description,
      content,
      published: data.published === undefined ? true : Boolean(data.published),
      projectUrl,
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
//  Live preview thumbnail — renders a screenshot of a public URL at runtime
//  (WordPress mShots, no API key). Used as the card image for linked projects.
//  Internal / non-public hosts get a designed placeholder instead.
// ═══════════════════════════════════════════════════════════════════════════
// Empty on purpose: when a project has no real image / live preview, the UI
// renders the tech schema (ProjectGraph) instead of a default stock picture.
const PLACEHOLDER_IMG = "";
function livePreview(url: string | null, w = 1280, h = 800): string {
  if (!url) return PLACEHOLDER_IMG;
  try {
    const host = new URL(url).hostname;
    // Skip unreachable / internal hosts — a screenshot service can't reach them.
    if (host.includes(".internal.") || host.endsWith(".local") || host === "localhost") {
      return PLACEHOLDER_IMG;
    }
    return `https://s.wordpress.com/mshots/v1/${encodeURIComponent(url)}?w=${w}&h=${h}`;
  } catch {
    return PLACEHOLDER_IMG;
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  1b. FEATURED PROJECTS — Nanocreatives realisations (DB-only, not from MDX).
//      Rich editorial `content` (Markdown) so each project card opens onto a
//      proper case-study page. Card images are live previews of the real sites.
// ═══════════════════════════════════════════════════════════════════════════
const FEATURED_PROJECTS = [
  // ── R&D / POC / études — profil stratégique (fintech, paiements, banque, sécurité).
  //    Honnêtement étiquetés « Étude / POC / R&D » : recherche & prototypage, non déployés en production.
  {
    slug: "securite-mobile-money",
    title: "Sécurité du Mobile Money — MoMo & Airtel Money",
    date: "2026-02-01",
    tags: ["Mobile Money", "MTN MoMo", "Airtel Money", "Sécurité", "Fraude", "Fintech", "R&D", "Afrique"],
    categories: ["poc-prototype", "api-webservice"],
    description:
      "Recherche & article (en préparation) sur la sécurité des services Mobile Money en Afrique : surfaces d'attaque, fraude et réconciliation — étudié et prototypé.",
    content: `## Sécurité du Mobile Money — étude & article (en préparation)

**Pourquoi.** Le Mobile Money (MTN MoMo, Airtel Money) porte une part énorme des paiements en Afrique — et concentre autant de valeur que de risques : fraude, ingénierie sociale, faiblesses d'intégration côté marchand, réconciliation.

**Ce que j'étudie**, côté intégrateur/marchand :
- Cycle de vie d'une transaction et points de rupture (USSD, API, callbacks/webhooks).
- **Fraude & abus** : rejeu, idempotence, double dépense, SIM-swap, hameçonnage.
- **Réconciliation** marchand ↔ opérateur et détection d'anomalies.
- Durcissement des intégrations (signatures, secrets, journalisation, moindre privilège).

### Stack de prototypage
Node.js/NestJS · PostgreSQL · Webhooks · Observabilité

> **Étude / R&D** — recherche & prototypage (article en préparation), **volontairement générique** (aucune faille précise divulguée). Non déployé en production.`,
    translations: {
      en: {
        title: "Mobile Money Security — MoMo & Airtel Money",
        desc: "Research & article (in progress) on the security of Mobile Money services in Africa: attack surfaces, fraud and reconciliation — studied and prototyped.",
        content: `## Mobile Money Security — study & article (in progress)

**Why.** Mobile Money (MTN MoMo, Airtel Money) carries a huge share of payments in Africa — concentrating as much value as risk: fraud, social engineering, merchant-side integration weaknesses, reconciliation.

**What I study**, from the integrator/merchant side:
- Transaction lifecycle and break points (USSD, API, callbacks/webhooks).
- **Fraud & abuse**: replay, idempotency, double-spend, SIM-swap, phishing.
- **Reconciliation** merchant ↔ operator and anomaly detection.
- Hardening integrations (signatures, secrets, logging, least privilege).

### Prototyping stack
Node.js/NestJS · PostgreSQL · Webhooks · Observability

> **Study / R&D** — research & prototyping (article in progress), **deliberately generic** (no specific vulnerability disclosed). Not deployed to production.`,
      },
    },
  },
  {
    slug: "paiements-instantanes",
    title: "Paiements instantanés & interopérabilité",
    date: "2025-11-01",
    tags: ["Paiements instantanés", "Interopérabilité", "ISO 20022", "Switch", "Temps réel", "Fintech", "MVP"],
    categories: ["poc-prototype", "api-webservice"],
    description:
      "MVP d'un socle de paiements instantanés interopérables entre opérateurs et banques : messagerie normalisée, temps réel, idempotence et traçabilité.",
    content: `## Paiements instantanés & interopérabilité — MVP

**Le problème.** En Afrique centrale, opérateurs Mobile Money et banques vivent en silos : envoyer de l'argent de l'un à l'autre est lent, coûteux et opaque. L'enjeu — un socle de **paiements instantanés interopérables** où un paiement passe d'un acteur à l'autre **en temps réel**, avec une messagerie normalisée et des garanties fortes.

**Ce que j'ai construit (MVP)**
- **Messagerie inspirée ISO 20022** et notion de **switch** central qui route les paiements entre acteurs.
- **Temps réel** : file d'événements, **idempotence** et garanties de livraison (au-moins-une-fois avec déduplication).
- **Traçabilité de bout en bout** de chaque transaction et réconciliation inter-acteurs.
- **Machine à états** de la transaction (initiée, autorisée, réglée, échouée, remboursée) pour éviter les états incohérents.

**Ce que ça démontre.** Une compréhension concrète des systèmes transactionnels critiques : fiabilité, cohérence et normes du secteur — exactement ce qu'exige un système financier temps réel.

### Stack
NestJS · PostgreSQL · file d'événements · ISO 20022 · API-first

> **MVP** — socle fonctionnel, non déployé en production à grande échelle.`,
    translations: {
      en: {
        title: "Instant Payments & Interoperability",
        desc: "An MVP of an interoperable instant-payments backbone between operators and banks: standardised messaging, real time, idempotency and traceability.",
        content: `## Instant Payments & Interoperability — MVP

**The problem.** In Central Africa, Mobile Money operators and banks live in silos: moving money between them is slow, costly and opaque. The goal — an **interoperable instant-payments backbone** where a payment moves from one actor to another **in real time**, with standardised messaging and strong guarantees.

**What I built (MVP)**
- **ISO 20022-inspired messaging** and a central **switch** routing payments between actors.
- **Real time**: event queue, **idempotency** and delivery guarantees (at-least-once with deduplication).
- **End-to-end traceability** of every transaction and cross-actor reconciliation.
- A transaction **state machine** (initiated, authorised, settled, failed, refunded) to prevent inconsistent states.

**What it demonstrates.** A concrete grasp of critical transactional systems: reliability, consistency and industry standards — exactly what a real-time financial system demands.

### Stack
NestJS · PostgreSQL · event queue · ISO 20022 · API-first

> **MVP** — functional backbone, not deployed to production at scale.`,
      },
    },
  },
  {
    slug: "neobanque-internet-banking",
    title: "Néo-banque & Internet Banking — architecture",
    date: "2025-09-01",
    tags: ["Néo-banque", "Internet Banking", "KYC", "Ledger", "Cartes virtuelles", "Banque", "Fintech", "MVP"],
    categories: ["poc-prototype", "api-webservice"],
    description:
      "MVP d'une néo-banque mobile-first : comptes & ledger à double entrée, KYC/onboarding, cartes virtuelles et sécurité — pensé pour le contexte africain.",
    content: `## Néo-banque & Internet Banking — MVP

**L'objectif.** Construire les briques d'une **néo-banque** utilisable dans le contexte africain : mobile-first, interopérable avec le Mobile Money, et sûre par conception.

**Ce que j'ai construit (MVP)**
- **Comptes & ledger** : registre à **double entrée**, soldes cohérents, historique auditable — la source de vérité de l'argent.
- **Onboarding & KYC** : parcours d'ouverture, vérification d'identité, niveaux de compte progressifs.
- **Cartes virtuelles** et moyens de paiement rattachés aux comptes.
- **Sécurité & conformité** : authentification forte, journal d'audit, moindre privilège, autorisation fine (OpenFGA).

**Ce que ça démontre.** La maîtrise des invariants bancaires — un ledger qui ne perd jamais un centime, des accès traçables, une conformité pensée dès l'architecture.

### Stack
NestJS · PostgreSQL · ledger double entrée · OpenFGA · API-first

> **MVP** — briques fonctionnelles, non déployé en production à grande échelle.`,
    translations: {
      en: {
        title: "Neo-bank & Internet Banking",
        desc: "An MVP of a mobile-first neo-bank: double-entry ledger accounts, KYC/onboarding, virtual cards and security — built for the African context.",
        content: `## Neo-bank & Internet Banking — MVP

**The goal.** Build the core of a **neo-bank** usable in the African context: mobile-first, interoperable with Mobile Money, and secure by design.

**What I built (MVP)**
- **Accounts & ledger**: a **double-entry** register, consistent balances, auditable history — the source of truth for money.
- **Onboarding & KYC**: account opening flow, identity verification, tiered account levels.
- **Virtual cards** and payment methods tied to accounts.
- **Security & compliance**: strong authentication, audit log, least privilege, fine-grained authorization (OpenFGA).

**What it demonstrates.** Command of banking invariants — a ledger that never loses a cent, traceable access, compliance designed in from the start.

### Stack
NestJS · PostgreSQL · double-entry ledger · OpenFGA · API-first

> **MVP** — functional building blocks, not deployed to production at scale.`,
      },
    },
  },
  {
    slug: "reconciliation-anti-fraude",
    title: "Réconciliation & anti-fraude multi-PSP",
    date: "2025-07-01",
    tags: ["Réconciliation", "Anti-fraude", "MTN MoMo", "Airtel Money", "Stripe", "Paiements", "Fintech", "MVP"],
    categories: ["poc-prototype", "data-integration"],
    description:
      "MVP d'un moteur de réconciliation et de détection d'anomalies pour paiements multi-PSP (MoMo, Airtel Money, Stripe) — matching, écarts et alertes.",
    content: `## Réconciliation & anti-fraude multi-PSP — MVP

**Le problème.** Dès qu'un marchand accepte plusieurs moyens de paiement (MoMo, Airtel Money, Stripe), les écarts apparaissent : transactions en double, statuts divergents, timeouts, remboursements. Sans réconciliation fiable, l'argent **et** la confiance se perdent.

**Ce que j'ai construit (MVP)**
- **Réconciliation automatique** marchand ↔ PSP : matching des transactions, détection des écarts, alignement des statuts.
- **Idempotence** et gestion robuste des **webhooks/callbacks** non fiables (rejeu, ordre, doublons).
- **Détection d'anomalies** : montants inhabituels, fréquences suspectes, patterns de fraude.
- **Tableau des écarts** exploitable par une équipe finance (rapprochement, exceptions).

**Ce que ça démontre.** La capacité à fiabiliser l'argent réel dans un monde de PSP imparfaits — le nerf de la guerre en fintech.

### Stack
NestJS · PostgreSQL · règles + heuristiques · Webhooks

> **MVP** — moteur fonctionnel, non déployé en production à grande échelle.`,
    translations: {
      en: {
        title: "Multi-PSP Reconciliation & Anti-fraud",
        desc: "An MVP reconciliation and anomaly-detection engine for multi-PSP payments (MoMo, Airtel Money, Stripe) — matching, discrepancies and alerts.",
        content: `## Multi-PSP Reconciliation & Anti-fraud — MVP

**The problem.** As soon as a merchant accepts several payment methods (MoMo, Airtel Money, Stripe), discrepancies appear: duplicate transactions, diverging statuses, timeouts, refunds. Without reliable reconciliation, money **and** trust are lost.

**What I built (MVP)**
- **Automatic reconciliation** merchant ↔ PSP: transaction matching, discrepancy detection, status alignment.
- **Idempotency** and robust handling of unreliable **webhooks/callbacks** (replay, ordering, duplicates).
- **Anomaly detection**: unusual amounts, suspicious frequencies, fraud patterns.
- An actionable **discrepancy dashboard** for a finance team (matching, exceptions).

**What it demonstrates.** The ability to make real money reliable in a world of imperfect PSPs — the crux of fintech.

### Stack
NestJS · PostgreSQL · rules + heuristics · Webhooks

> **MVP** — functional engine, not deployed to production at scale.`,
      },
    },
  },
  {
    slug: "payment-gateway-unifie",
    title: "Passerelle de paiement unifiée (MoMo / Airtel / cartes)",
    date: "2025-05-01",
    tags: ["Payment Gateway", "Agrégation", "MTN MoMo", "Airtel Money", "Cartes", "API", "Webhooks", "Fintech", "MVP"],
    categories: ["poc-prototype", "api-webservice"],
    description:
      "MVP d'une passerelle de paiement unifiée : une seule API pour encaisser via MoMo, Airtel Money et cartes, avec adaptateurs, webhooks et idempotence.",
    content: `## Passerelle de paiement unifiée — MVP

**L'idée.** Offrir aux marchands **une seule API** pour encaisser, quel que soit le moyen : **MTN MoMo, Airtel Money, cartes**. La passerelle masque la complexité propre à chaque opérateur — une intégration au lieu de cinq.

**Ce que j'ai construit (MVP)**
- **API unique** d'initiation et de capture, avec un **adaptateur par opérateur** (pattern strategy) pour ajouter un PSP sans toucher au cœur.
- **Webhooks normalisés** + **idempotence** et rejeu contrôlé face aux callbacks non fiables.
- **Statuts cohérents** unifiés entre opérateurs et **journal de transactions** complet.
- Gestion des **échecs et remboursements**, avec une machine à états claire.

**Ce que ça démontre.** Une architecture d'agrégation propre et extensible, qui absorbe la diversité des opérateurs derrière un contrat stable — le socle de tout produit d'encaissement en Afrique.

### Stack
NestJS · PostgreSQL · adaptateurs opérateurs · Webhooks · API-first

> **MVP** — passerelle fonctionnelle, non déployée en production à grande échelle.`,
    translations: {
      en: {
        title: "Unified Payment Gateway (MoMo / Airtel / cards)",
        desc: "An MVP unified payment gateway: one API to collect via MoMo, Airtel Money and cards, with adapters, webhooks and idempotency.",
        content: `## Unified Payment Gateway — MVP

**The idea.** Give merchants **one API** to collect payments, whatever the method: **MTN MoMo, Airtel Money, cards**. The gateway hides each operator's complexity — one integration instead of five.

**What I built (MVP)**
- **One API** for initiation and capture, with a **per-operator adapter** (strategy pattern) so a new PSP is added without touching the core.
- **Normalised webhooks** + **idempotency** and controlled replay against unreliable callbacks.
- **Consistent statuses** unified across operators and a complete **transaction ledger**.
- **Failure and refund** handling with a clear state machine.

**What it demonstrates.** A clean, extensible aggregation architecture that absorbs operator diversity behind a stable contract — the foundation of any collection product in Africa.

### Stack
NestJS · PostgreSQL · operator adapters · Webhooks · API-first

> **MVP** — functional gateway, not deployed to production at scale.`,
      },
    },
  },
  {
    slug: "scoring-nano-credit",
    title: "Scoring & nano-crédit mobile — inclusion financière",
    date: "2025-03-01",
    tags: ["Scoring", "Nano-crédit", "Inclusion financière", "Data", "Mobile Money", "Fintech", "Étude"],
    categories: ["poc-prototype", "data-integration"],
    description:
      "Étude/POC d'un scoring léger pour du nano-crédit mobile basé sur l'historique Mobile Money — inclusion financière.",
    content: `## Scoring & nano-crédit mobile — étude / POC

**Le contexte.** Beaucoup n'ont pas d'historique bancaire, mais **un historique Mobile Money**. C'est une base pour du **nano-crédit** responsable et de l'inclusion financière.

**Ce que j'étudie**
- Signaux de **scoring** à partir de l'usage Mobile Money (régularité, flux).
- Règles d'octroi et garde-fous (plafonds, anti-surendettement).
- Éthique & conformité des données.

### Stack
Python/Node · PostgreSQL · règles + features simples

> **Étude / POC** — modélisation et prototype, non déployé en production.`,
    translations: {
      en: {
        title: "Scoring & mobile nano-credit — financial inclusion",
        desc: "Study/POC of a lightweight scoring for mobile nano-credit based on Mobile Money history — financial inclusion.",
        content: `## Scoring & mobile nano-credit — study / POC

**The context.** Many have no banking history, but **a Mobile Money history**. That's a basis for responsible **nano-credit** and financial inclusion.

**What I study**
- **Scoring** signals from Mobile Money usage (regularity, flows).
- Lending rules and safeguards (limits, over-indebtedness prevention).
- Data ethics & compliance.

### Stack
Python/Node · PostgreSQL · rules + simple features

> **Study / POC** — modelling and prototype, not deployed to production.`,
      },
    },
  },
  {
    slug: "sre-paiements",
    title: "Observabilité & SRE pour plateformes de paiement",
    date: "2025-01-01",
    tags: ["SRE", "Observabilité", "Fiabilité", "Kubernetes", "SLA", "Paiements", "DevOps", "POC"],
    categories: ["poc-prototype", "devops-infrastructure"],
    description:
      "POC reliant mon socle DevOps aux paiements : observabilité, SLO/SLA et résilience pour des systèmes transactionnels critiques.",
    content: `## Observabilité & SRE pour plateformes de paiement — POC

**L'angle.** Un système de paiement ne tolère ni panne silencieuse, ni transaction perdue. Ce POC relie mon socle **DevOps/SRE** aux exigences des **paiements**.

**Ce que je prototype**
- **Observabilité** : métriques, traces, logs corrélés autour de la transaction.
- **SLO/SLA** et alerting sur les parcours critiques (échecs, latence, réconciliation).
- **Résilience** : reprises, idempotence, dégradation contrôlée sur Kubernetes.

### Stack
Kubernetes/k3s · Docker · observabilité · Nginx

> **POC** — banc d'essai fiabilité, non déployé en production.`,
    translations: {
      en: {
        title: "Observability & SRE for payment platforms",
        desc: "A POC connecting my DevOps foundation to payments: observability, SLO/SLA and resilience for critical transactional systems.",
        content: `## Observability & SRE for payment platforms — POC

**The angle.** A payment system tolerates neither silent failure nor a lost transaction. This POC connects my **DevOps/SRE** foundation to the demands of **payments**.

**What I prototype**
- **Observability**: metrics, traces, logs correlated around the transaction.
- **SLO/SLA** and alerting on critical paths (failures, latency, reconciliation).
- **Resilience**: retries, idempotency, controlled degradation on Kubernetes.

### Stack
Kubernetes/k3s · Docker · observability · Nginx

> **POC** — reliability test bed, not deployed to production.`,
      },
    },
  },
  // ── DevOps / Infra / IA — labs & POC (homelab et bancs d'essai, honnêtement étiquetés).
  {
    slug: "cluster-kubernetes-kubeadm",
    title: "Cluster Kubernetes from scratch (kubeadm)",
    date: "2026-01-15",
    tags: ["Kubernetes", "kubeadm", "containerd", "Calico", "HA", "Linux", "DevOps", "Lab"],
    categories: ["poc-prototype", "devops-infrastructure"],
    description:
      "Lab : montage d'un cluster Kubernetes de zéro avec kubeadm — control plane, nœuds workers, CNI, stockage et durcissement.",
    content: `## Cluster Kubernetes from scratch avec kubeadm — lab

**Pourquoi.** Comprendre Kubernetes en profondeur, c'est le monter soi-même — pas via un cluster managé. Ce lab installe un cluster **kubeadm** de bout en bout pour maîtriser chaque brique.

**Ce que je monte**
- **Bootstrap du control plane** avec \`kubeadm init\`, jonction des workers via \`kubeadm join\`.
- **Runtime containerd** + **CNI** (Calico/Flannel) pour le réseau des pods.
- **Ingress NGINX**, stockage persistant, et \`kube-vip\`/HAProxy pour un control plane **HA**.
- **Durcissement** : RBAC, NetworkPolicies, secrets, mises à jour de version.

### Stack
Kubernetes · kubeadm · containerd · Calico · Ingress NGINX · Linux

> **Lab / POC** — banc d'essai d'infrastructure, non destiné à la production.`,
    translations: {
      en: {
        title: "Kubernetes cluster from scratch (kubeadm)",
        desc: "Lab: building a Kubernetes cluster from scratch with kubeadm — control plane, worker nodes, CNI, storage and hardening.",
        content: `## Kubernetes cluster from scratch with kubeadm — lab

**Why.** To understand Kubernetes deeply, you build it yourself — not via a managed cluster. This lab installs a **kubeadm** cluster end to end to master every building block.

**What I build**
- **Control plane bootstrap** with \`kubeadm init\`, joining workers via \`kubeadm join\`.
- **containerd runtime** + **CNI** (Calico/Flannel) for pod networking.
- **NGINX Ingress**, persistent storage, and \`kube-vip\`/HAProxy for an **HA** control plane.
- **Hardening**: RBAC, NetworkPolicies, secrets, version upgrades.

### Stack
Kubernetes · kubeadm · containerd · Calico · NGINX Ingress · Linux

> **Lab / POC** — infrastructure test bed, not intended for production.`,
      },
    },
  },
  {
    slug: "k3s-edge-lightweight",
    title: "k3s — Kubernetes léger pour edge & homelab",
    date: "2025-12-01",
    tags: ["k3s", "Kubernetes", "Edge", "Homelab", "Traefik", "GitOps", "DevOps", "Lab"],
    categories: ["poc-prototype", "devops-infrastructure"],
    description:
      "Lab : cluster k3s léger (edge/homelab) — installation multi-nœuds, Traefik, stockage local et déploiement d'apps.",
    content: `## k3s — Kubernetes léger pour edge & homelab

**L'idée.** Tous les projets n'ont pas besoin d'un cluster lourd. **k3s** offre un Kubernetes conforme mais minimal, idéal pour l'**edge**, l'IoT et le **homelab** — parfait pour héberger mes propres services.

**Ce que je configure**
- Installation **multi-nœuds** k3s (server + agents), embarquant **Traefik** et **containerd**.
- **Stockage local** (local-path) et volumes persistants.
- Déploiement d'applications réelles (services, bases, reverse proxy).
- Comparaison **k3s vs kubeadm** : coût, empreinte, cas d'usage.

### Stack
k3s · Kubernetes · Traefik · Helm · Linux

> **Lab / POC** — cluster de démonstration, non destiné à la production.`,
    translations: {
      en: {
        title: "k3s — lightweight Kubernetes for edge & homelab",
        desc: "Lab: a lightweight k3s cluster (edge/homelab) — multi-node install, Traefik, local storage and app deployment.",
        content: `## k3s — lightweight Kubernetes for edge & homelab

**The idea.** Not every project needs a heavy cluster. **k3s** offers a conformant but minimal Kubernetes, ideal for **edge**, IoT and the **homelab** — perfect for hosting my own services.

**What I configure**
- **Multi-node** k3s install (server + agents), bundling **Traefik** and **containerd**.
- **Local storage** (local-path) and persistent volumes.
- Deploying real applications (services, databases, reverse proxy).
- **k3s vs kubeadm** comparison: cost, footprint, use cases.

### Stack
k3s · Kubernetes · Traefik · Helm · Linux

> **Lab / POC** — demo cluster, not intended for production.`,
      },
    },
  },
  {
    slug: "gitops-cicd-argocd",
    title: "GitOps & CI/CD — pipeline déclaratif",
    date: "2025-10-01",
    tags: ["GitOps", "Argo CD", "CI/CD", "GitHub Actions", "Kubernetes", "Helm", "DevOps", "POC"],
    categories: ["poc-prototype", "ci-cd", "devops-infrastructure"],
    description:
      "POC : chaîne GitOps — build/test en CI, images conteneurisées, déploiement continu piloté par Argo CD sur Kubernetes.",
    content: `## GitOps & CI/CD — pipeline déclaratif — POC

**Le principe.** L'état du cluster **vit dans Git**. On ne \`kubectl apply\` plus à la main : on pousse un commit, et l'infrastructure se réconcilie automatiquement.

**Ce que je prototype**
- **CI** : build, tests, lint, image Docker signée, push registry (GitHub Actions).
- **CD GitOps** : **Argo CD** surveille le dépôt et applique les manifests/Helm.
- **Rollback** par revert Git, environnements (dev/stag/prod) par branches/overlays.
- **Kustomize/Helm** pour paramétrer sans dupliquer.

### Stack
Argo CD · GitHub Actions · Kubernetes · Helm · Kustomize · Docker

> **POC** — chaîne de démonstration, non déployée en production.`,
    translations: {
      en: {
        title: "GitOps & CI/CD — declarative pipeline",
        desc: "POC: a GitOps chain — build/test in CI, containerised images, continuous deployment driven by Argo CD on Kubernetes.",
        content: `## GitOps & CI/CD — declarative pipeline — POC

**The principle.** The cluster's state **lives in Git**. No more manual \`kubectl apply\`: you push a commit, and the infrastructure reconciles automatically.

**What I prototype**
- **CI**: build, tests, lint, signed Docker image, registry push (GitHub Actions).
- **GitOps CD**: **Argo CD** watches the repo and applies manifests/Helm.
- **Rollback** via Git revert, environments (dev/stag/prod) by branches/overlays.
- **Kustomize/Helm** to parameterise without duplication.

### Stack
Argo CD · GitHub Actions · Kubernetes · Helm · Kustomize · Docker

> **POC** — demo chain, not deployed to production.`,
      },
    },
  },
  {
    slug: "iac-terraform-ansible",
    title: "Infrastructure as Code — Terraform & Ansible",
    date: "2025-08-01",
    tags: ["Terraform", "Ansible", "IaC", "Provisioning", "Immutable", "Cloud", "DevOps", "Lab"],
    categories: ["poc-prototype", "devops-infrastructure"],
    description:
      "Lab : provisionner et configurer une infra reproductible — Terraform pour les ressources, Ansible pour la configuration.",
    content: `## Infrastructure as Code — Terraform & Ansible — lab

**L'objectif.** Rendre l'infrastructure **reproductible et versionnée** : plus de serveurs configurés à la main, plus de dérive de configuration.

**Ce que je construis**
- **Terraform** : provisioning déclaratif des ressources (VMs, réseau, DNS), state géré.
- **Ansible** : configuration idempotente des hôtes (paquets, users, services, durcissement).
- **Cattle, not pets** : reconstruire l'infra depuis zéro à l'identique.
- Secrets, modules réutilisables, et pipeline \`plan → apply\`.

### Stack
Terraform · Ansible · Linux · Cloud · Git

> **Lab / POC** — socle d'automatisation, non destiné à la production.`,
    translations: {
      en: {
        title: "Infrastructure as Code — Terraform & Ansible",
        desc: "Lab: provision and configure reproducible infrastructure — Terraform for resources, Ansible for configuration.",
        content: `## Infrastructure as Code — Terraform & Ansible — lab

**The goal.** Make infrastructure **reproducible and versioned**: no more hand-configured servers, no more configuration drift.

**What I build**
- **Terraform**: declarative resource provisioning (VMs, network, DNS), managed state.
- **Ansible**: idempotent host configuration (packages, users, services, hardening).
- **Cattle, not pets**: rebuild the infra from scratch, identically.
- Secrets, reusable modules, and a \`plan → apply\` pipeline.

### Stack
Terraform · Ansible · Linux · Cloud · Git

> **Lab / POC** — automation foundation, not intended for production.`,
      },
    },
  },
  {
    slug: "observabilite-prometheus-grafana",
    title: "Stack d'observabilité — Prometheus, Grafana, Loki",
    date: "2025-06-01",
    tags: ["Observabilité", "Prometheus", "Grafana", "Loki", "Alerting", "SRE", "DevOps", "POC"],
    categories: ["poc-prototype", "devops-infrastructure"],
    description:
      "POC : stack d'observabilité complète sur Kubernetes — métriques (Prometheus), dashboards (Grafana), logs (Loki) et alerting.",
    content: `## Stack d'observabilité — Prometheus / Grafana / Loki — POC

**Pourquoi.** On ne pilote pas ce qu'on ne mesure pas. Une plateforme sans observabilité tombe en panne **en silence**.

**Ce que je déploie**
- **Prometheus** : collecte des métriques, règles d'alerte, service discovery.
- **Grafana** : dashboards (latence, erreurs, saturation — méthode RED/USE).
- **Loki** : agrégation des logs corrélés aux métriques.
- **Alertmanager** : routage des alertes, SLO/SLA, astreinte.

### Stack
Prometheus · Grafana · Loki · Alertmanager · Kubernetes

> **POC** — banc d'essai SRE, non déployé en production.`,
    translations: {
      en: {
        title: "Observability stack — Prometheus, Grafana, Loki",
        desc: "POC: a complete observability stack on Kubernetes — metrics (Prometheus), dashboards (Grafana), logs (Loki) and alerting.",
        content: `## Observability stack — Prometheus / Grafana / Loki — POC

**Why.** You can't run what you don't measure. A platform without observability fails **silently**.

**What I deploy**
- **Prometheus**: metric collection, alert rules, service discovery.
- **Grafana**: dashboards (latency, errors, saturation — RED/USE method).
- **Loki**: log aggregation correlated with metrics.
- **Alertmanager**: alert routing, SLO/SLA, on-call.

### Stack
Prometheus · Grafana · Loki · Alertmanager · Kubernetes

> **POC** — SRE test bed, not deployed to production.`,
      },
    },
  },
  {
    slug: "llm-selfhosted-mlops",
    title: "LLM auto-hébergé & MLOps — inférence privée",
    date: "2026-03-01",
    tags: ["IA", "LLM", "Ollama", "vLLM", "MLOps", "Kubernetes", "GPU", "DevOps", "POC"],
    categories: ["poc-prototype", "devops-infrastructure", "api-webservice"],
    description:
      "POC DevOps × IA : héberger et servir des modèles LLM en privé (Ollama/vLLM) sur Kubernetes — inférence, mise à l'échelle et coûts.",
    content: `## LLM auto-hébergé & MLOps — POC DevOps × IA

**L'angle.** Croiser mon socle **DevOps** et l'**IA** : servir des modèles de langage **en privé**, sans dépendre d'une API tierce, avec la maîtrise des données et des coûts.

**Ce que je prototype**
- **Serving** de modèles ouverts via **Ollama / vLLM**, exposés en API OpenAI-compatible.
- Déploiement sur **Kubernetes/k3s**, gestion **GPU** et mise à l'échelle.
- **Observabilité** de l'inférence (latence, tokens/s, coût par requête).
- Cache, quantization et arbitrages **coût/performance**.

### Stack
Ollama · vLLM · Kubernetes · Docker · GPU · API-first

> **POC** — banc d'essai IA/MLOps, non déployé en production.`,
    translations: {
      en: {
        title: "Self-hosted LLM & MLOps — private inference",
        desc: "DevOps × AI POC: host and serve LLMs privately (Ollama/vLLM) on Kubernetes — inference, scaling and cost.",
        content: `## Self-hosted LLM & MLOps — DevOps × AI POC

**The angle.** Cross my **DevOps** foundation with **AI**: serve language models **privately**, without depending on a third-party API, keeping control of data and cost.

**What I prototype**
- **Serving** open models via **Ollama / vLLM**, exposed as an OpenAI-compatible API.
- Deployment on **Kubernetes/k3s**, **GPU** management and scaling.
- **Inference observability** (latency, tokens/s, cost per request).
- Caching, quantization and **cost/performance** trade-offs.

### Stack
Ollama · vLLM · Kubernetes · Docker · GPU · API-first

> **POC** — AI/MLOps test bed, not deployed to production.`,
      },
    },
  },
  {
    slug: "rag-assistant-devops",
    title: "Assistant RAG — recherche augmentée sur mes données",
    date: "2026-04-01",
    tags: ["IA", "RAG", "Embeddings", "pgvector", "LLM", "NestJS", "DevOps", "POC"],
    categories: ["poc-prototype", "api-webservice", "data-integration"],
    description:
      "POC IA : assistant RAG (Retrieval-Augmented Generation) sur une base documentaire — embeddings, pgvector, orchestration et garde-fous.",
    content: `## Assistant RAG — recherche augmentée — POC IA

**L'idée.** Un LLM ne connaît pas *mes* documents. Le **RAG** lui donne accès à une base documentaire à jour, sans réentraînement, avec des réponses **sourcées**.

**Ce que je prototype**
- **Ingestion & chunking** de documents, génération d'**embeddings**.
- Recherche vectorielle avec **pgvector** (PostgreSQL), reranking.
- Orchestration LLM + contexte, **citations** et garde-fous anti-hallucination.
- API **NestJS** et intégration au socle auto-hébergé (voir LLM MLOps).

### Stack
NestJS · pgvector · PostgreSQL · Embeddings · LLM · Docker

> **POC** — prototype IA, non déployé en production.`,
    translations: {
      en: {
        title: "RAG Assistant — augmented search over my data",
        desc: "AI POC: a RAG (Retrieval-Augmented Generation) assistant over a document base — embeddings, pgvector, orchestration and guardrails.",
        content: `## RAG Assistant — augmented search — AI POC

**The idea.** An LLM doesn't know *my* documents. **RAG** gives it access to an up-to-date document base, without retraining, with **sourced** answers.

**What I prototype**
- **Ingestion & chunking** of documents, **embedding** generation.
- Vector search with **pgvector** (PostgreSQL), reranking.
- LLM + context orchestration, **citations** and anti-hallucination guardrails.
- **NestJS** API and integration with the self-hosted stack (see LLM MLOps).

### Stack
NestJS · pgvector · PostgreSQL · Embeddings · LLM · Docker

> **POC** — AI prototype, not deployed to production.`,
      },
    },
  },
  {
    slug: "reverse-proxy-tls",
    title: "Reverse-proxy & TLS — Traefik / Nginx + Let's Encrypt",
    date: "2025-11-15",
    tags: ["Nginx", "Traefik", "TLS", "Let's Encrypt", "Reverse-proxy", "Sécurité", "DevOps", "Lab"],
    categories: ["poc-prototype", "devops-infrastructure", "reverse-proxy"],
    description:
      "Lab : exposer plusieurs services derrière un reverse-proxy avec TLS automatique — Traefik/Nginx, Let's Encrypt, routage et durcissement.",
    content: `## Reverse-proxy & TLS automatique — lab

**Le besoin.** Faire cohabiter plusieurs applications sur un même hôte, chacune joignable en HTTPS, sans jongler avec les ports ni renouveler les certificats à la main.

**Ce que je configure**
- **Traefik / Nginx** comme reverse-proxy : routage par domaine/sous-domaine, load-balancing.
- **TLS automatique** via **Let's Encrypt** (ACME), renouvellement sans interruption.
- **Durcissement** : en-têtes de sécurité, HSTS, redirections HTTP→HTTPS, rate-limiting.
- Découverte dynamique des services (labels Docker) et middlewares.

### Stack
Traefik · Nginx · Let's Encrypt · Docker · Linux

> **Lab / POC** — banc d'essai réseau, non destiné à la production.`,
    translations: {
      en: {
        title: "Reverse-proxy & TLS — Traefik / Nginx + Let's Encrypt",
        desc: "Lab: expose several services behind a reverse proxy with automatic TLS — Traefik/Nginx, Let's Encrypt, routing and hardening.",
        content: `## Reverse-proxy & automatic TLS — lab

**The need.** Run several applications on one host, each reachable over HTTPS, without juggling ports or renewing certificates by hand.

**What I configure**
- **Traefik / Nginx** as a reverse proxy: per-domain/subdomain routing, load balancing.
- **Automatic TLS** via **Let's Encrypt** (ACME), renewal without downtime.
- **Hardening**: security headers, HSTS, HTTP→HTTPS redirects, rate limiting.
- Dynamic service discovery (Docker labels) and middlewares.

### Stack
Traefik · Nginx · Let's Encrypt · Docker · Linux

> **Lab / POC** — network test bed, not intended for production.`,
      },
    },
  },
  {
    slug: "coolify-selfhosted-paas",
    title: "Coolify — PaaS auto-hébergé (alternative Heroku/Vercel)",
    date: "2025-09-15",
    tags: ["Coolify", "PaaS", "Self-hosted", "Docker", "CI/CD", "DevOps", "Production"],
    categories: ["platform-deployment", "self-hosted-platform", "devops-infrastructure"],
    description:
      "En production : mise en place d'un PaaS Coolify pour déployer apps & bases en un clic sur une infra souveraine — utilisé pour de vrais projets (dont IO Life Science).",
    content: `## Coolify — PaaS auto-hébergé, en production

**L'idée.** Retrouver le confort d'un Heroku/Vercel (déploiement au push, bases managées, logs) **mais sur ma propre infrastructure** — maîtrise des coûts, des données et de la souveraineté.

**Ce que j'ai mis en place (en production)**
- Installation et exploitation de **Coolify** sur serveurs Linux, connectés aux dépôts Git.
- **Déploiement au push** : build automatique, images Docker, environnements par branche.
- Bases de données managées, stockage, variables d'environnement et **webhooks**.
- **TLS automatique** (Let's Encrypt), logs, redémarrages et sauvegardes.
- Utilisé pour héberger de **vrais projets** (dont **IO Life Science**) — pas seulement un banc d'essai.

**Ce que ça démontre.** Une autonomie DevOps complète : offrir aux équipes une expérience de déploiement moderne sur une infra maîtrisée, à moindre coût.

### Stack
Coolify · Docker · Linux · Git · Let's Encrypt · Nginx

> Déployé et exploité **en production** pour des projets réels.`,
    translations: {
      en: {
        title: "Coolify — Self-hosted PaaS (Heroku/Vercel alternative)",
        desc: "In production: a self-hosted Coolify PaaS to deploy apps & databases in one click on sovereign infra — used for real projects (including IO Life Science).",
        content: `## Coolify — self-hosted PaaS, in production

**The idea.** Get the comfort of a Heroku/Vercel (push-to-deploy, managed databases, logs) **but on my own infrastructure** — control over cost, data and sovereignty.

**What I set up (in production)**
- Installed and operated **Coolify** on Linux servers, connected to Git repositories.
- **Push-to-deploy**: automatic builds, Docker images, per-branch environments.
- Managed databases, storage, environment variables and **webhooks**.
- **Automatic TLS** (Let's Encrypt), logs, restarts and backups.
- Used to host **real projects** (including **IO Life Science**) — not just a test bed.

**What it demonstrates.** Full DevOps autonomy: giving teams a modern deployment experience on controlled, low-cost infrastructure.

### Stack
Coolify · Docker · Linux · Git · Let's Encrypt · Nginx

> Deployed and operated **in production** for real projects.`,
      },
    },
  },
  {
    slug: "backup-pra-disaster-recovery",
    title: "Sauvegarde & PRA — reprise après sinistre",
    date: "2025-07-15",
    tags: ["Backup", "PRA", "Disaster Recovery", "restic", "RPO/RTO", "Sécurité", "DevOps", "POC"],
    categories: ["poc-prototype", "devops-infrastructure", "cloud-setup"],
    description:
      "POC : stratégie de sauvegarde et plan de reprise d'activité — sauvegardes chiffrées, tests de restauration, objectifs RPO/RTO.",
    content: `## Sauvegarde & PRA — reprise après sinistre — POC

**Pourquoi.** Une sauvegarde qu'on n'a jamais restaurée n'est pas une sauvegarde. Ce POC construit une stratégie **testée** de sauvegarde et de reprise.

**Ce que je prototype**
- **Sauvegardes chiffrées** et incrémentales (restic/borg) vers stockage objet (S3-compatible).
- **Règle 3-2-1**, rotation et rétention.
- **Tests de restauration** réguliers et automatisés (la partie qu'on oublie).
- Objectifs **RPO/RTO** et runbook de bascule.

### Stack
restic/borg · S3-compatible · cron · Linux · chiffrement

> **POC** — banc d'essai résilience, non déployé en production.`,
    translations: {
      en: {
        title: "Backup & DR — disaster recovery",
        desc: "POC: a backup strategy and disaster-recovery plan — encrypted backups, restore tests, RPO/RTO objectives.",
        content: `## Backup & DR — disaster recovery — POC

**Why.** A backup you've never restored isn't a backup. This POC builds a **tested** backup and recovery strategy.

**What I prototype**
- **Encrypted, incremental backups** (restic/borg) to object storage (S3-compatible).
- **3-2-1 rule**, rotation and retention.
- **Regular, automated restore tests** (the part everyone forgets).
- **RPO/RTO** objectives and a failover runbook.

### Stack
restic/borg · S3-compatible · cron · Linux · encryption

> **POC** — resilience test bed, not deployed to production.`,
      },
    },
  },
  {
    slug: "secrets-management-vault",
    title: "Gestion des secrets — Vault & chiffrement",
    date: "2025-05-15",
    tags: ["Vault", "Secrets", "Chiffrement", "SOPS", "Sécurité", "Zero-trust", "DevOps", "POC"],
    categories: ["poc-prototype", "devops-infrastructure", "auth-system"],
    description:
      "POC : centraliser et sécuriser les secrets (Vault/SOPS) — rotation, accès contrôlé, chiffrement, zéro secret en clair dans le code.",
    content: `## Gestion des secrets — Vault & chiffrement — POC

**Le problème.** Les secrets traînent partout : fichiers \`.env\`, variables CI, dépôts Git. Un seul fuite et tout tombe.

**Ce que je prototype**
- **HashiCorp Vault** : stockage central, **accès contrôlé** (policies), audit.
- **Rotation** dynamique des secrets et baux à durée de vie.
- **SOPS + age/GPG** pour chiffrer les secrets versionnés en Git (GitOps-friendly).
- **Zéro secret en clair** : injection au runtime, moindre privilège.

### Stack
Vault · SOPS · age/GPG · Kubernetes · CI/CD

> **POC** — banc d'essai sécurité, non déployé en production.`,
    translations: {
      en: {
        title: "Secrets management — Vault & encryption",
        desc: "POC: centralise and secure secrets (Vault/SOPS) — rotation, controlled access, encryption, zero plaintext secrets in code.",
        content: `## Secrets management — Vault & encryption — POC

**The problem.** Secrets lie around everywhere: \`.env\` files, CI variables, Git repos. One leak and everything falls.

**What I prototype**
- **HashiCorp Vault**: central storage, **controlled access** (policies), audit.
- **Dynamic rotation** of secrets and time-limited leases.
- **SOPS + age/GPG** to encrypt secrets versioned in Git (GitOps-friendly).
- **Zero plaintext secrets**: runtime injection, least privilege.

### Stack
Vault · SOPS · age/GPG · Kubernetes · CI/CD

> **POC** — security test bed, not deployed to production.`,
      },
    },
  },
  {
    slug: "homelab-proxmox-virtualisation",
    title: "Homelab — virtualisation Proxmox & réseau",
    date: "2025-03-15",
    tags: ["Proxmox", "Virtualisation", "VLAN", "pfSense", "Homelab", "Réseau", "DevOps", "Lab"],
    categories: ["poc-prototype", "devops-infrastructure", "cloud-setup", "self-hosted-platform"],
    description:
      "Lab : homelab de virtualisation Proxmox — VMs & conteneurs LXC, segmentation réseau (VLAN), pare-feu et services auto-hébergés.",
    content: `## Homelab — virtualisation Proxmox & réseau — lab

**L'objectif.** Un vrai terrain de jeu infra à la maison pour tester en conditions proches du réel : virtualisation, réseau segmenté, services auto-hébergés.

**Ce que je construis**
- **Proxmox VE** : VMs et conteneurs **LXC**, snapshots, templates.
- **Réseau** : segmentation **VLAN**, pare-feu (pfSense/OPNsense), DNS interne.
- Services auto-hébergés (Git, monitoring, reverse-proxy) sur cette base.
- Sauvegardes et haute disponibilité entre nœuds.

### Stack
Proxmox VE · LXC · VLAN · pfSense · Linux

> **Lab** — infrastructure d'expérimentation personnelle.`,
    translations: {
      en: {
        title: "Homelab — Proxmox virtualisation & networking",
        desc: "Lab: a Proxmox virtualisation homelab — VMs & LXC containers, network segmentation (VLAN), firewall and self-hosted services.",
        content: `## Homelab — Proxmox virtualisation & networking — lab

**The goal.** A real infra playground at home to test in near-real conditions: virtualisation, segmented networking, self-hosted services.

**What I build**
- **Proxmox VE**: VMs and **LXC** containers, snapshots, templates.
- **Networking**: **VLAN** segmentation, firewall (pfSense/OPNsense), internal DNS.
- Self-hosted services (Git, monitoring, reverse proxy) on this base.
- Backups and high availability across nodes.

### Stack
Proxmox VE · LXC · VLAN · pfSense · Linux

> **Lab** — personal experimentation infrastructure.`,
      },
    },
  },
  {
    slug: "service-mesh-observability",
    title: "Service mesh — trafic, mTLS & résilience (Istio/Linkerd)",
    date: "2026-02-20",
    tags: ["Service Mesh", "Istio", "Linkerd", "mTLS", "Kubernetes", "Microservices", "DevOps", "POC"],
    categories: ["poc-prototype", "devops-infrastructure"],
    description:
      "POC : maillage de services sur Kubernetes — mTLS automatique, gestion fine du trafic (canary), résilience et observabilité.",
    content: `## Service mesh — trafic, mTLS & résilience — POC

**L'angle.** Quand les microservices se multiplient, la sécurité et le routage entre services deviennent le point dur. Un **service mesh** les industrialise.

**Ce que je prototype**
- **mTLS automatique** entre services (chiffrement + identité), zero-trust.
- **Gestion du trafic** : canary, blue/green, retries, timeouts, circuit-breaking.
- **Observabilité** native : traces, métriques, topologie des appels.
- Comparaison **Istio vs Linkerd** (complexité, empreinte, cas d'usage).

### Stack
Istio/Linkerd · Kubernetes · mTLS · Envoy · observabilité

> **POC** — banc d'essai microservices, non déployé en production.`,
    translations: {
      en: {
        title: "Service mesh — traffic, mTLS & resilience (Istio/Linkerd)",
        desc: "POC: a service mesh on Kubernetes — automatic mTLS, fine-grained traffic control (canary), resilience and observability.",
        content: `## Service mesh — traffic, mTLS & resilience — POC

**The angle.** As microservices multiply, security and routing between services become the hard part. A **service mesh** industrialises them.

**What I prototype**
- **Automatic mTLS** between services (encryption + identity), zero-trust.
- **Traffic management**: canary, blue/green, retries, timeouts, circuit-breaking.
- Native **observability**: traces, metrics, call topology.
- **Istio vs Linkerd** comparison (complexity, footprint, use cases).

### Stack
Istio/Linkerd · Kubernetes · mTLS · Envoy · observability

> **POC** — microservices test bed, not deployed to production.`,
      },
    },
  },
  // ── OpenFGA / autorisation fine (ReBAC, modèle Zanzibar) — série de POC.
  //    Ancrés dans une pratique réelle d'OpenFGA (Nanocreatives, Focus Suite),
  //    déclinés en bancs d'essai honnêtement étiquetés.
  {
    slug: "openfga-multitenant-saas",
    title: "OpenFGA — Autorisation multi-tenant SaaS",
    date: "2026-05-01",
    tags: ["OpenFGA", "ReBAC", "Multi-tenant", "SaaS", "Zanzibar", "IAM", "Sécurité", "MVP"],
    categories: ["auth-system", "api-webservice", "poc-prototype"],
    description:
      "MVP en usage réel (Focus Suite) : isolation stricte des tenants et autorisation fine par organisation avec OpenFGA — chaque client cloisonné, rôles au plus près du métier.",
    content: `## OpenFGA — Autorisation multi-tenant SaaS — MVP

**Le problème.** Dans un SaaS multi-tenant, une erreur d'autorisation = fuite de données entre clients. Le RBAC classique explose en complexité dès que les règles deviennent contextuelles.

**Ce que j'ai construit (utilisé dans Focus Suite)**
- Modèle **OpenFGA** (relation-based) : \`organization\`, \`team\`, \`resource\`, héritage de permissions.
- **Isolation par tenant** garantie par des checks systématiques (\`check(user, relation, object)\`) à chaque accès.
- Rôles métier (owner, admin, member, viewer) exprimés en **relations**, pas en code — on change une règle sans redéployer.
- Requêtes \`list-objects\` pour afficher « tout ce que ce user peut voir » sans requêtes N+1.

**Ce que ça démontre.** Une autorisation fine, traçable et maintenable, réellement intégrée à un produit — la sécurité comme fonctionnalité, pas comme rustine.

### Stack
OpenFGA · NestJS · PostgreSQL · API-first

> **MVP** — modèle d'autorisation intégré et fonctionnel (Focus Suite).`,
    translations: {
      en: {
        title: "OpenFGA — Multi-tenant SaaS Authorization",
        desc: "An MVP in real use (Focus Suite): strict tenant isolation and per-organisation fine-grained authorization with OpenFGA — each client isolated, roles close to the business.",
        content: `## OpenFGA — Multi-tenant SaaS Authorization — MVP

**The problem.** In a multi-tenant SaaS, one authorization mistake = a data leak between clients. Classic RBAC explodes in complexity as soon as rules become contextual.

**What I built (used in Focus Suite)**
- **OpenFGA** relation-based model: \`organization\`, \`team\`, \`resource\`, permission inheritance.
- **Tenant isolation** guaranteed by systematic checks (\`check(user, relation, object)\`) on every access.
- Business roles (owner, admin, member, viewer) expressed as **relations**, not code — change a rule without redeploying.
- \`list-objects\` queries to show "everything this user can see" without N+1 queries.

**What it demonstrates.** Fine-grained, traceable, maintainable authorization actually shipped in a product — security as a feature, not a patch.

### Stack
OpenFGA · NestJS · PostgreSQL · API-first

> **MVP** — integrated, functional authorization model (Focus Suite).`,
      },
    },
  },
  {
    slug: "openfga-document-sharing",
    title: "OpenFGA — Partage de documents (style Google Docs)",
    date: "2026-04-15",
    tags: ["OpenFGA", "ReBAC", "Partage", "Permissions", "Collaboration", "Sécurité", "POC"],
    categories: ["poc-prototype", "auth-system"],
    description:
      "POC : permissions de partage granulaires (viewer/commenter/editor), liens partagés et héritage par dossier avec OpenFGA.",
    content: `## OpenFGA — Partage de documents façon Google Docs — POC

**L'idée.** Reproduire le modèle de partage le plus exigeant du web : viewer / commenter / editor, partage par lien, héritage dossier → document, groupes.

**Ce que je prototype**
- Modèle **OpenFGA** : \`document\`, \`folder\`, \`group\`, relations \`viewer\`/\`commenter\`/\`editor\`/\`owner\`.
- **Héritage** : les droits d'un dossier se propagent à ses documents.
- Partage par **lien public** et par groupe, révocation instantanée.

### Stack
OpenFGA · NestJS · PostgreSQL

> **POC** — banc d'essai autorisation, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA — Document Sharing (Google Docs-style)",
        desc: "POC: granular sharing permissions (viewer/commenter/editor), shared links and per-folder inheritance with OpenFGA.",
        content: `## OpenFGA — Google Docs-style document sharing — POC

**The idea.** Reproduce the web's most demanding sharing model: viewer / commenter / editor, link sharing, folder → document inheritance, groups.

**What I prototype**
- **OpenFGA** model: \`document\`, \`folder\`, \`group\`, relations \`viewer\`/\`commenter\`/\`editor\`/\`owner\`.
- **Inheritance**: a folder's rights propagate to its documents.
- Sharing via **public link** and by group, with instant revocation.

### Stack
OpenFGA · NestJS · PostgreSQL

> **POC** — authorization test bed, not deployed to production.`,
      },
    },
  },
  {
    slug: "openfga-org-hierarchy",
    title: "OpenFGA — Hiérarchie organisationnelle & héritage",
    date: "2026-03-20",
    tags: ["OpenFGA", "ReBAC", "Hiérarchie", "RBAC", "Permissions", "Sécurité", "POC"],
    categories: ["poc-prototype", "auth-system"],
    description:
      "POC : modéliser org → département → équipe → ressource avec héritage de droits et délégation, en relations OpenFGA.",
    content: `## OpenFGA — Hiérarchie organisationnelle — POC

**Le contexte.** Les grandes structures ont des droits qui descendent la hiérarchie : un directeur voit ce que voient ses équipes. Coder ça en dur est ingérable.

**Ce que je prototype**
- Modèle **OpenFGA** : \`org\` → \`department\` → \`team\` → \`resource\`, relations d'héritage.
- **Délégation** temporaire (remplacement, congés) sans dupliquer les règles.
- Requêtes \`list-objects\` pour « tout ce que ce user peut voir ».

### Stack
OpenFGA · NestJS · PostgreSQL

> **POC** — modélisation hiérarchique, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA — Organisational Hierarchy & Inheritance",
        desc: "POC: model org → department → team → resource with rights inheritance and delegation, in OpenFGA relations.",
        content: `## OpenFGA — Organisational hierarchy — POC

**The context.** Large structures have rights that flow down the hierarchy: a director sees what their teams see. Hard-coding that is unmanageable.

**What I prototype**
- **OpenFGA** model: \`org\` → \`department\` → \`team\` → \`resource\`, inheritance relations.
- **Temporary delegation** (cover, leave) without duplicating rules.
- \`list-objects\` queries for "everything this user can see".

### Stack
OpenFGA · NestJS · PostgreSQL

> **POC** — hierarchical modelling, not deployed to production.`,
      },
    },
  },
  {
    slug: "openfga-fintech-approvals",
    title: "OpenFGA — Approbations & accès paiements (fintech)",
    date: "2026-02-10",
    tags: ["OpenFGA", "ReBAC", "Fintech", "Paiements", "Séparation des tâches", "Sécurité", "POC"],
    categories: ["poc-prototype", "auth-system", "api-webservice"],
    description:
      "POC : qui peut initier / approuver / voir une transaction — séparation des tâches et plafonds d'approbation modélisés avec OpenFGA.",
    content: `## OpenFGA — Autorisation des paiements — POC

**L'enjeu.** En fintech, l'autorisation EST le contrôle interne : séparation des tâches (celui qui initie ≠ celui qui approuve), plafonds, périmètres.

**Ce que je prototype**
- Relations **OpenFGA** : \`initiator\`, \`approver\`, \`viewer\` sur une \`transaction\` / \`wallet\`.
- **Séparation des tâches** (SoD) imposée par le modèle, pas par le code applicatif.
- Périmètres par marché/compte et pistes d'audit des décisions d'accès.

### Stack
OpenFGA · NestJS · PostgreSQL · Paiements

> **POC** — banc d'essai conformité, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA — Payment Approvals & Access (fintech)",
        desc: "POC: who can initiate / approve / view a transaction — separation of duties and approval limits modelled with OpenFGA.",
        content: `## OpenFGA — Payment authorization — POC

**The stakes.** In fintech, authorization IS the internal control: separation of duties (whoever initiates ≠ whoever approves), limits, scopes.

**What I prototype**
- **OpenFGA** relations: \`initiator\`, \`approver\`, \`viewer\` on a \`transaction\` / \`wallet\`.
- **Separation of duties** (SoD) enforced by the model, not by application code.
- Per-market/account scopes and audit trails of access decisions.

### Stack
OpenFGA · NestJS · PostgreSQL · Payments

> **POC** — compliance test bed, not deployed to production.`,
      },
    },
  },
  {
    slug: "openfga-neobank-accounts",
    title: "OpenFGA — Comptes partagés & délégation bancaire",
    date: "2026-01-15",
    tags: ["OpenFGA", "ReBAC", "Néo-banque", "Comptes joints", "Délégation", "Banque", "POC"],
    categories: ["poc-prototype", "auth-system"],
    description:
      "POC : comptes joints, procurations et délégation d'accès (mandataire, comptable) pour une néo-banque, modélisés avec OpenFGA.",
    content: `## OpenFGA — Comptes partagés & délégation — POC

**Le besoin.** Un compte bancaire n'a pas un seul « propriétaire » : comptes joints, procurations, mandataires, comptable de l'entreprise. Le modèle d'accès doit refléter ces relations.

**Ce que je prototype**
- Relations **OpenFGA** : \`holder\`, \`co-holder\`, \`delegate\`, \`accountant\` sur un \`account\`.
- **Délégation** à durée limitée et périmètre restreint (lecture seule, virements plafonnés).
- Révocation immédiate et traçabilité.

### Stack
OpenFGA · NestJS · PostgreSQL · Banque

> **POC** — modélisation bancaire, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA — Shared Accounts & Banking Delegation",
        desc: "POC: joint accounts, powers of attorney and access delegation (proxy, accountant) for a neo-bank, modelled with OpenFGA.",
        content: `## OpenFGA — Shared accounts & delegation — POC

**The need.** A bank account rarely has a single "owner": joint accounts, powers of attorney, proxies, the company accountant. The access model must reflect these relations.

**What I prototype**
- **OpenFGA** relations: \`holder\`, \`co-holder\`, \`delegate\`, \`accountant\` on an \`account\`.
- **Delegation** with limited duration and restricted scope (read-only, capped transfers).
- Immediate revocation and traceability.

### Stack
OpenFGA · NestJS · PostgreSQL · Banking

> **POC** — banking modelling, not deployed to production.`,
      },
    },
  },
  {
    slug: "openfga-keycloak-integration",
    title: "OpenFGA + Keycloak — identité & autorisation fine",
    date: "2025-12-05",
    tags: ["OpenFGA", "Keycloak", "OIDC", "IAM", "ReBAC", "Sécurité", "POC"],
    categories: ["poc-prototype", "auth-system", "api-webservice"],
    description:
      "POC : combiner Keycloak (authentification/OIDC) et OpenFGA (autorisation fine) — identité forte + permissions relationnelles.",
    content: `## OpenFGA + Keycloak — identité & autorisation — POC

**L'architecture.** Séparer proprement **authentification** (qui es-tu — Keycloak/OIDC) et **autorisation** (as-tu le droit — OpenFGA). Deux responsabilités, deux briques.

**Ce que je prototype**
- **Keycloak** : login, OIDC, tokens, fédération d'identité.
- **OpenFGA** : décisions d'autorisation fine à partir de l'identité Keycloak.
- Middleware qui enchaîne \`verify token\` → \`check permission\`.

### Stack
Keycloak · OpenFGA · NestJS · OIDC

> **POC** — intégration IAM, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA + Keycloak — identity & fine-grained authorization",
        desc: "POC: combine Keycloak (authentication/OIDC) and OpenFGA (fine-grained authorization) — strong identity + relationship-based permissions.",
        content: `## OpenFGA + Keycloak — identity & authorization — POC

**The architecture.** Cleanly separate **authentication** (who are you — Keycloak/OIDC) and **authorization** (are you allowed — OpenFGA). Two responsibilities, two building blocks.

**What I prototype**
- **Keycloak**: login, OIDC, tokens, identity federation.
- **OpenFGA**: fine-grained authorization decisions from the Keycloak identity.
- Middleware chaining \`verify token\` → \`check permission\`.

### Stack
Keycloak · OpenFGA · NestJS · OIDC

> **POC** — IAM integration, not deployed to production.`,
      },
    },
  },
  {
    slug: "openfga-api-gateway",
    title: "OpenFGA — Middleware d'autorisation API Gateway",
    date: "2025-11-10",
    tags: ["OpenFGA", "API Gateway", "Middleware", "ReBAC", "Microservices", "Sécurité", "POC"],
    categories: ["poc-prototype", "auth-system", "api-webservice"],
    description:
      "POC : centraliser l'autorisation au niveau de la passerelle API — chaque requête vérifiée contre OpenFGA avant d'atteindre les services.",
    content: `## OpenFGA — Autorisation à la passerelle — POC

**L'idée.** Plutôt que de disséminer les checks dans chaque microservice, centraliser l'autorisation à la **passerelle** : un seul point de décision, cohérent.

**Ce que je prototype**
- Middleware gateway qui traduit route + méthode → \`check(user, relation, object)\` OpenFGA.
- **Cache** des décisions et évaluation à faible latence.
- Refus explicite et journalisation des accès.

### Stack
OpenFGA · Nginx/Gateway · NestJS · Microservices

> **POC** — banc d'essai d'architecture, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA — API Gateway authorization middleware",
        desc: "POC: centralise authorization at the API gateway — every request checked against OpenFGA before it reaches the services.",
        content: `## OpenFGA — Authorization at the gateway — POC

**The idea.** Rather than scattering checks across every microservice, centralise authorization at the **gateway**: a single, consistent decision point.

**What I prototype**
- Gateway middleware translating route + method → \`check(user, relation, object)\` OpenFGA.
- **Decision cache** and low-latency evaluation.
- Explicit denial and access logging.

### Stack
OpenFGA · Nginx/Gateway · NestJS · Microservices

> **POC** — architecture test bed, not deployed to production.`,
      },
    },
  },
  {
    slug: "openfga-healthcare-consent",
    title: "OpenFGA — Consentement & accès dossiers santé",
    date: "2025-10-01",
    tags: ["OpenFGA", "ReBAC", "Santé", "Consentement", "Confidentialité", "Sécurité", "POC"],
    categories: ["poc-prototype", "auth-system"],
    description:
      "POC : accès aux dossiers médicaux piloté par le consentement du patient (soignant traitant, urgences, famille) avec OpenFGA.",
    content: `## OpenFGA — Consentement patient & accès santé — POC

**L'enjeu.** En santé, l'accès à un dossier dépend du **consentement** et du contexte : médecin traitant, spécialiste référé, urgences, proche autorisé.

**Ce que je prototype**
- Relations **OpenFGA** : \`treating_doctor\`, \`referred\`, \`emergency\`, \`guardian\` sur un \`record\`.
- **Consentement** du patient comme relation révocable.
- Accès d'urgence tracé (« break glass ») et auditable.

### Stack
OpenFGA · NestJS · PostgreSQL

> **POC** — modélisation confidentialité, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA — Consent & health-record access",
        desc: "POC: access to medical records driven by patient consent (treating physician, emergency, family) with OpenFGA.",
        content: `## OpenFGA — Patient consent & health access — POC

**The stakes.** In healthcare, access to a record depends on **consent** and context: treating doctor, referred specialist, emergency, authorised relative.

**What I prototype**
- **OpenFGA** relations: \`treating_doctor\`, \`referred\`, \`emergency\`, \`guardian\` on a \`record\`.
- Patient **consent** as a revocable relation.
- Traced emergency access ("break glass") and auditable.

### Stack
OpenFGA · NestJS · PostgreSQL

> **POC** — confidentiality modelling, not deployed to production.`,
      },
    },
  },
  {
    slug: "openfga-marketplace",
    title: "OpenFGA — Permissions marketplace multi-acteurs",
    date: "2025-08-20",
    tags: ["OpenFGA", "ReBAC", "Marketplace", "E-commerce", "Multi-vendeur", "Sécurité", "POC"],
    categories: ["poc-prototype", "auth-system"],
    description:
      "POC : autorisation d'une marketplace (vendeur, gestionnaire de boutique, admin plateforme, client) et périmètres produits avec OpenFGA.",
    content: `## OpenFGA — Permissions marketplace — POC

**Le contexte.** Une marketplace mélange des acteurs aux droits très différents : vendeurs sur leurs boutiques, gestionnaires, admins plateforme, clients.

**Ce que je prototype**
- Relations **OpenFGA** : \`store\` → \`product\`/\`order\`, rôles \`vendor\`/\`manager\`/\`platform_admin\`.
- Un vendeur n'agit que sur **sa** boutique ; l'admin plateforme voit tout.
- Délégation à des gestionnaires et périmètres par catégorie.

### Stack
OpenFGA · NestJS · PostgreSQL · E-commerce

> **POC** — modélisation multi-acteurs, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA — Multi-actor marketplace permissions",
        desc: "POC: marketplace authorization (vendor, store manager, platform admin, customer) and product scopes with OpenFGA.",
        content: `## OpenFGA — Marketplace permissions — POC

**The context.** A marketplace mixes actors with very different rights: vendors on their stores, managers, platform admins, customers.

**What I prototype**
- **OpenFGA** relations: \`store\` → \`product\`/\`order\`, roles \`vendor\`/\`manager\`/\`platform_admin\`.
- A vendor acts only on **their** store; the platform admin sees everything.
- Delegation to managers and per-category scopes.

### Stack
OpenFGA · NestJS · PostgreSQL · E-commerce

> **POC** — multi-actor modelling, not deployed to production.`,
      },
    },
  },
  {
    slug: "openfga-modeling-patterns",
    title: "OpenFGA — Patterns de modélisation & migration RBAC→ReBAC",
    date: "2025-06-15",
    tags: ["OpenFGA", "ReBAC", "RBAC", "Zanzibar", "Architecture", "Sécurité", "Étude"],
    categories: ["poc-prototype", "auth-system"],
    description:
      "Étude/POC : catalogue de patterns OpenFGA (groupes, héritage, propriété, partage) et méthode de migration d'un RBAC existant vers le ReBAC.",
    content: `## OpenFGA — Patterns & migration RBAC→ReBAC — étude / POC

**Le fil rouge de la série.** Après plusieurs POC, ce travail consolide les **patterns réutilisables** et une méthode de migration depuis un RBAC classique.

**Ce que je documente / prototype**
- Patterns : **groupes**, **héritage**, **propriété**, **partage**, **délégation temporaire**.
- Méthode de **migration RBAC → ReBAC** : mapper rôles → relations sans big-bang.
- Tests d'autorisation (assertions \`check\`) comme filet de sécurité.

### Stack
OpenFGA · modélisation · NestJS · tests

> **Étude / POC** — synthèse et bonnes pratiques, non déployé en production.`,
    translations: {
      en: {
        title: "OpenFGA — Modelling patterns & RBAC→ReBAC migration",
        desc: "Study/POC: a catalogue of OpenFGA patterns (groups, inheritance, ownership, sharing) and a method to migrate an existing RBAC to ReBAC.",
        content: `## OpenFGA — Patterns & RBAC→ReBAC migration — study / POC

**The through-line of the series.** After several POCs, this work consolidates the **reusable patterns** and a migration method from classic RBAC.

**What I document / prototype**
- Patterns: **groups**, **inheritance**, **ownership**, **sharing**, **temporary delegation**.
- **RBAC → ReBAC migration** method: map roles → relations without a big bang.
- Authorization tests (\`check\` assertions) as a safety net.

### Stack
OpenFGA · modelling · NestJS · tests

> **Study / POC** — synthesis and best practices, not deployed to production.`,
      },
    },
  },
  {
    slug: "focus-suite",
    title: "Focus Suite — Plateforme SaaS de gestion",
    date: "2023-09-01",
    tags: ["NestJS", "Next.js", "OpenFGA", "RH & Paie", "SaaS", "Multi-tenant"],
    categories: ["web-app", "api-webservice"],
    description:
      "Lead developer de Focus Suite : l'outil tout-en-un qui pilote toute la vie de l'entreprise — employés, paie, contrats, facturation, temps, absences et tâches.",
    projectUrl: "https://pro.focus-suite.com",
    content: `## Focus Suite — piloter toute l'entreprise depuis un seul outil

**Le problème.** Gérer une entreprise, c'est jongler avec des dizaines d'outils qui ne se parlent pas : un pour la paie, un autre pour les contrats, un tableur pour les absences, un logiciel à part pour la facturation. Les données sont éclatées, ressaisies, et personne n'a de vision d'ensemble.

**La réponse.** En tant que **lead developer**, j'ai conçu et piloté **Focus Suite**, un outil **puissant et tout-en-un** qui réunit la gestion des ressources humaines et de l'activité dans une seule plateforme cohérente, sécurisée et temps réel.

### Ce que Focus Suite gère
- **Employés** — dossiers, rôles, organisation, cycle de vie complet.
- **Contrats** — création, suivi et échéances des contrats.
- **Paie** — calcul et gestion de la paie, connectée aux données RH.
- **Temps & activités** — pointage, activités des employés, **heures supplémentaires**.
- **Absences & congés** — demandes, validations, soldes.
- **Tâches** — affectation et suivi de l'activité opérationnelle.
- **Facturation** — édition et suivi des factures, reliés aux données de l'entreprise.

### Sous le capot
- **Multi-tenant natif** — chaque organisation a son espace isolé, ses données, ses règles.
- **Autorisation fine avec OpenFGA** — qui voit quoi, qui peut quoi, au plus près du métier et traçable.
- **Architecture évolutive** — back **NestJS** modulaire, front **Next.js**, API-first.

### Stack
NestJS · Next.js · TypeScript · PostgreSQL · OpenFGA · Docker

> Un produit pensé pour durer : propre, documenté, et prêt à grandir avec ses utilisateurs.`,
  },
  {
    slug: "civis-cms",
    title: "Civis — CMS institutionnel (ministères RDC)",
    date: "2023-06-01",
    tags: ["Strapi", "Next.js", "CMS", "Gouvernement", "Multi-site", "PostgreSQL"],
    categories: ["web-app", "platform-deployment"],
    description:
      "Civis : un CMS institutionnel déployé pour des ministères en RDC, pour publier et gouverner des contenus officiels à grande échelle.",
    projectUrl: "https://cms.internal.nncrtvs.xyz/", // lien staging (no-prod), non public
    content: `## Civis — publier l'information publique, avec exigence

**Le contexte.** Une administration publique ne publie pas comme une entreprise : chaque contenu engage l'institution. Il faut des rôles, des validations, une traçabilité — et une fiabilité sans faille.

**Le projet.** **Civis** est un **CMS institutionnel** bâti sur **Strapi** (back headless) et **Next.js** (front), **utilisé par des ministères en République Démocratique du Congo** pour créer, valider et diffuser leurs contenus officiels.

### Points forts
- **Headless (Strapi + Next.js)** — un back CMS souple, un front rapide et sur-mesure.
- **Multi-site** — plusieurs entités administrées depuis une même base.
- **Workflow éditorial** — rédaction, relecture, validation puis publication.
- **Robuste et déployable** — pensé pour des environnements réglementés.

### Stack
Strapi · Next.js · PostgreSQL · Docker

> _Lien de démonstration interne (staging) : cms.internal.nncrtvs.xyz — non accessible publiquement._`,
  },
  {
    slug: "ordre-des-pharmaciens-cg",
    title: "Ordre des Pharmaciens du Congo",
    date: "2023-04-01",
    tags: ["WordPress", "PHP", "Institutionnel", "Vitrine", "SEO"],
    categories: ["web-app", "showcase-site"],
    description:
      "Le site institutionnel de l'Ordre des Pharmaciens du Congo : une vitrine officielle, claire et crédible, au service des membres et du public.",
    projectUrl: "https://ordredespharmaciens.cg/",
    content: `## Ordre des Pharmaciens du Congo — la vitrine d'une institution

**L'enjeu.** Un ordre professionnel a besoin d'une présence en ligne qui inspire **confiance et autorité** : informer le public, servir ses membres, incarner l'institution.

**La réalisation.** J'ai conçu et développé le **site institutionnel officiel** de l'Ordre — moderne, clair, rapide, pensé pour durer.

### Ce qui a été livré
- **Présentation de l'institution** — missions, organisation, actualités.
- **Espace membres & public** — informations et services accessibles à tous.
- **SEO & accessibilité** — visible sur les moteurs, lisible par tous.
- **Performance** — chargement rapide, responsive sur tous les écrans.

### Stack
WordPress · PHP · SEO · Responsive

> Une vitrine sobre et crédible, à la hauteur d'une institution nationale.`,
  },
  {
    slug: "nutrisports-shop",
    title: "Nutrisports Shop — E-commerce",
    date: "2023-05-01",
    tags: ["WordPress", "WooCommerce", "E-commerce", "Paiement", "Catalogue"],
    categories: ["web-app", "api-webservice"],
    description:
      "Nutrisports Shop : une boutique e-commerce complète — catalogue, panier, paiement et gestion des commandes de bout en bout.",
    projectUrl: "https://nutrisports-shop.com/",
    content: `## Nutrisports Shop — vendre en ligne, sans friction

**L'objectif.** Offrir à Nutrisports une **boutique en ligne complète** : un parcours d'achat fluide côté client, et une gestion simple côté commerçant.

**La réalisation.** Une plateforme e-commerce de bout en bout, du catalogue au paiement, jusqu'au suivi des commandes.

### Fonctionnalités clés
- **Catalogue produits** — recherche, filtres, fiches détaillées.
- **Panier & commande** — parcours d'achat rapide et rassurant.
- **Paiement intégré** — transactions sécurisées.
- **Back-office** — gestion des produits, stocks et commandes.

### Stack
WordPress · WooCommerce · Paiement · Responsive

> Une expérience d'achat pensée pour convertir, sur une base e-commerce éprouvée.`,
  },
  {
    slug: "societe-cg",
    title: "Societe.cg — Plateforme web",
    date: "2023-03-01",
    tags: ["WordPress", "PHP", "Vitrine", "Congo", "SEO"],
    categories: ["web-app", "showcase-site"],
    description:
      "Societe.cg — plateforme web livrée en production chez Nanocreatives : conception, intégration sur mesure, performance et SEO, du cadrage à l'exploitation.",
    projectUrl: "https://societe.cg",
    content: `## Societe.cg — une plateforme web livrée en production

**Le contexte.** Une organisation a besoin d'une présence digitale crédible : un site rapide, clair et bien référencé, capable de porter son image et de convertir ses visiteurs. J'ai pris en charge **Societe.cg** de bout en bout — du cadrage jusqu'à l'exploitation en production.

**Ma contribution.** Conception de l'architecture d'information, **intégration WordPress sur mesure** (thème, gabarits, composants réutilisables), structuration éditoriale et optimisation continue. J'ai porté autant le front que la mise en ligne réelle : hébergement, déploiement, sécurité de base et **SEO technique**.

### Ce que j'ai livré
- **Intégration sur mesure** — thème et gabarits taillés pour le besoin, pas un template générique.
- **Performance web** — temps de chargement maîtrisés, images optimisées, bonnes pratiques Core Web Vitals.
- **SEO technique** — structure sémantique, métadonnées, indexation propre.
- **Mise en production & exploitation** — déploiement, suivi, maintenance.

### Stack
WordPress · PHP · SEO · Performance · Responsive

> Livré en production et exploité — une base saine, rapide et maintenable.`,
    translations: {
      en: {
        title: "Societe.cg — Web Platform",
        desc: "Societe.cg — a web platform shipped to production at Nanocreatives: bespoke design and integration, performance and SEO, from scoping to operations.",
        content: `## Societe.cg — a web platform shipped to production

**The context.** An organisation needs a credible digital presence: a fast, clear, well-ranked site that carries its brand and converts visitors. I owned **Societe.cg** end to end — from scoping to running it in production.

**My contribution.** Information architecture, **bespoke WordPress integration** (theme, templates, reusable components), editorial structuring and continuous optimisation. I handled both the front end and the real go-live: hosting, deployment, baseline security and **technical SEO**.

### What I delivered
- **Bespoke integration** — theme and templates built for the need, not a generic template.
- **Web performance** — controlled load times, optimised images, Core Web Vitals best practices.
- **Technical SEO** — semantic structure, metadata, clean indexing.
- **Go-live & operations** — deployment, monitoring, maintenance.

### Stack
WordPress · PHP · SEO · Performance · Responsive

> Shipped to production and operated — a clean, fast, maintainable foundation.`,
      },
    },
  },
  {
    slug: "bralima",
    title: "Bralima — Site corporate",
    date: "2023-10-01",
    tags: ["WordPress", "PHP", "Corporate", "Vitrine", "SEO"],
    categories: ["web-app", "showcase-site"],
    description:
      "Site corporate de Bralima : une présence digitale à la hauteur d'un grand groupe industriel — image de marque, contenus institutionnels, performance et SEO.",
    projectUrl: "https://bralima.net/",
    content: `## Bralima — la présence digitale d'un grand groupe industriel

**L'enjeu.** Pour un acteur industriel majeur, le site corporate n'est pas un détail : c'est la **carte de visite institutionnelle** de la marque. Il doit inspirer la solidité, refléter l'envergure du groupe et servir plusieurs publics — clients, partenaires, presse, candidats.

**La réalisation.** J'ai conçu et intégré un **site corporate** moderne, structuré autour de l'identité du groupe : présentation des activités, des engagements et des actualités, avec une exécution soignée et une attention forte à la crédibilité perçue.

### Points forts
- **Identité de marque** — un design à la mesure d'un grand groupe, cohérent et affirmé.
- **Architecture éditoriale** — activités, engagements RSE, actualités, organisés pour chaque audience.
- **Performance & SEO** — pages rapides, responsive, structure sémantique et référencement propre.
- **Fiabilité** — un site institutionnel qui doit rester disponible et à jour.

### Stack
WordPress · PHP · SEO · Performance · Responsive

> Une vitrine corporate crédible, durable et à la hauteur de la marque.`,
    translations: {
      en: {
        title: "Bralima — Corporate Website",
        desc: "Bralima's corporate website: a digital presence worthy of a major industrial group — brand image, institutional content, performance and SEO.",
        content: `## Bralima — the digital presence of a major industrial group

**The stakes.** For a major industrial player, the corporate website is no detail: it is the brand's **institutional business card**. It must convey solidity, reflect the group's scale and serve several audiences — clients, partners, press, candidates.

**The build.** I designed and integrated a modern **corporate website**, structured around the group's identity: activities, commitments and news, with careful execution and strong attention to perceived credibility.

### Highlights
- **Brand identity** — a design worthy of a major group, coherent and assertive.
- **Editorial architecture** — activities, CSR commitments, news, organised per audience.
- **Performance & SEO** — fast, responsive pages, semantic structure and clean ranking.
- **Reliability** — an institutional site that must stay available and up to date.

### Stack
WordPress · PHP · SEO · Performance · Responsive

> A credible, durable corporate showcase worthy of the brand.`,
      },
    },
  },
  {
    slug: "retailix-partners",
    title: "Retailix Partners — Plateforme B2B retail",
    date: "2023-07-01",
    tags: ["WordPress", "PHP", "Retail", "B2B", "SEO"],
    categories: ["web-app", "showcase-site"],
    description:
      "Retailix Partners : la plateforme B2B des acteurs du retail — présentation de l'offre, crédibilité, génération de leads qualifiés et SEO.",
    projectUrl: "https://retailixpartners.com/",
    content: `## Retailix Partners — la plateforme B2B du retail

**Le projet.** Concevoir et intégrer **Retailix Partners**, un site **B2B** dédié au secteur du retail. L'objectif n'est pas seulement de « présenter » : il faut inspirer confiance à des décideurs, clarifier une offre complexe et **générer des contacts qualifiés**.

**L'approche.** Un parcours pensé pour la cible B2B : messages clés en tête, preuves et bénéfices structurés, appels à l'action orientés conversion. Le tout dans une intégration **WordPress sur mesure**, facile à faire vivre côté client.

### Ce qui a été construit
- **Discours B2B** — offre clarifiée, orientée décideurs, hiérarchie de l'information soignée.
- **Génération de leads** — parcours et CTA pensés pour convertir le visiteur en contact.
- **Intégration sur mesure** — thème et contenus maintenables sans dépendance technique.
- **Performance & SEO** — rapide, responsive, bien référencé sur les requêtes métier.

### Stack
WordPress · PHP · SEO · Performance · Responsive

> Une plateforme B2B crédible, pensée pour convertir et durer.`,
    translations: {
      en: {
        title: "Retailix Partners — B2B Retail Platform",
        desc: "Retailix Partners: the B2B platform for retail players — offering presentation, credibility, qualified lead generation and SEO.",
        content: `## Retailix Partners — the B2B retail platform

**The project.** Design and integrate **Retailix Partners**, a **B2B** website for the retail sector. The goal isn't merely to "present": it must earn decision-makers' trust, clarify a complex offering and **generate qualified leads**.

**The approach.** A journey built for a B2B audience: key messages up front, structured proof and benefits, conversion-oriented calls to action — all in a **bespoke WordPress integration** that's easy for the client to maintain.

### What was built
- **B2B narrative** — clarified offering, decision-maker focus, careful information hierarchy.
- **Lead generation** — journeys and CTAs designed to turn visitors into contacts.
- **Bespoke integration** — maintainable theme and content, no technical lock-in.
- **Performance & SEO** — fast, responsive, well-ranked on business queries.

### Stack
WordPress · PHP · SEO · Performance · Responsive

> A credible B2B platform, built to convert and to last.`,
      },
    },
  },
  {
    slug: "iolifescience-infra",
    title: "IO Life Science — Infrastructure & DevOps",
    date: "2023-08-01",
    tags: ["WordPress", "DevOps", "Docker", "Coolify", "Nginx", "Infrastructure"],
    categories: ["platform-deployment", "self-hosted-platform"],
    description:
      "IO Life Science : mise en place et provisioning de l'infrastructure hébergeant le site — serveurs, Coolify, déploiement et mise en production.",
    projectUrl: "https://iolifescience.com/",
    content: `## IO Life Science — l'infrastructure qui fait tourner le produit

**L'enjeu.** Derrière chaque site fiable, il y a une **infrastructure maîtrisée** : des serveurs propres, des déploiements reproductibles, une mise en ligne sans surprise.

**La réalisation.** J'ai **provisionné et configuré l'infrastructure** d'iolifescience.com (site **WordPress**) : préparation des serveurs, mise en place de **Coolify** pour accélérer les déploiements, reverse-proxy et TLS, puis pilotage de la mise en production.

### Ce qui a été mis en place
- **Provisioning serveurs** — environnements propres et sécurisés.
- **Coolify (PaaS auto-hébergé)** — déploiements rapides pour les équipes.
- **Reverse proxy & TLS** — Nginx, certificats, routage.
- **Hébergement WordPress** — site en production, fiable et rapide.

### Stack
WordPress · Linux · Docker · Coolify · Nginx

> L'infrastructure invisible qui rend le produit possible — et rapide à livrer.`,
  },
];

async function seedFeaturedProjects() {
  for (const p of FEATURED_PROJECTS) {
    const payload = {
      title: p.title,
      date: p.date,
      tags: JSON.stringify(p.tags),
      categories: JSON.stringify(p.categories),
      image: livePreview(p.projectUrl ?? null),
      description: p.description,
      content: p.content,
      published: true,
      projectUrl: p.projectUrl ?? null,
      githubUrl: null,
      videoUrl: null,
      translations: JSON.stringify(
        (p as { translations?: unknown }).translations ?? {},
      ),
    };
    await db.project.upsert({
      where: { slug: p.slug },
      create: { slug: p.slug, ...payload },
      update: payload,
    });
  }
  console.log(`✓ Featured projects (${FEATURED_PROJECTS.length}) upserted`);

  // Authoritative: purge legacy projects not in the current set (MDX + featured).
  // Old rows carried generic categories (Web, DevOps, API, Mobile, Backend…)
  // that duplicated the descriptive ones and polluted the category filter.
  const mdxDir = path.join(process.cwd(), "src/content/project");
  const mdxSlugs = fs.existsSync(mdxDir)
    ? fs.readdirSync(mdxDir).filter((f) => f.endsWith(".mdx")).map((f) => f.replace(/\.mdx$/, ""))
    : [];
  const knownSlugs = [...mdxSlugs, ...FEATURED_PROJECTS.map((p) => p.slug)];
  const purged = await db.project.deleteMany({ where: { slug: { notIn: knownSlugs } } });
  if (purged.count > 0) console.log(`✓ Legacy projects purged: ${purged.count}`);
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
      "Ingénieur logiciel senior doublé d'une responsabilité DevOps de premier plan : je conçois autant que j'opère. Côté plateforme, je pilote l'infrastructure de bout en bout — orchestration Kubernetes (k8s) & k3s, conteneurisation Docker, chaînes CI/CD, provisioning et durcissement de serveurs Linux, reverse-proxy Nginx & TLS, observabilité (métriques, logs, alerting). Côté logiciel, je conçois des services backend robustes et des APIs fiables, avec une exigence forte sur la sécurité, la résilience et la maîtrise des coûts. Mon fil rouge : rendre les systèmes prévisibles — déploiements reproductibles, reprise sur incident, moindre privilège — pour des environnements à forte contrainte technique.",
    skills: ["Kubernetes", "k3s", "Docker", "CI/CD", "Linux", "Nginx", "Cloud", "Observabilité", "SRE", "Fiabilité", "Sécurité", "Backend", "API REST"],
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
      "e-Bourse est un projet institutionnel à fort enjeu financier de l'administration publique congolaise : digitaliser la gestion et le décaissement des bourses. J'y conçois et développe l'application mobile (React Native / Expo) et son backend mobile (BFF) en Spring Boot — parcours et écrans de bout en bout, APIs taillées pour le mobile, authentification forte et sécurisation des flux à caractère financier. J'apporte une attention particulière à la fiabilité et à la performance : idempotence des opérations sensibles, gestion des états de décaissement, traçabilité, et une expérience accessible aux usagers dans des conditions réseau contraintes. L'objectif : une chaîne fiable, sécurisée et auditable, du terminal de l'usager jusqu'au système financier de l'État.",
    skills: ["React Native", "Expo", "Spring Boot", "Java", "BFF", "API REST", "PostgreSQL", "Sécurité", "Finance publique", "Fintech", "Décaissement", "Temps réel"],
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
      "Fondateur et dirigeant de Slaega. Je porte une vision d'innovation et d'excellence technique : transformer des idées ambitieuses en réalisations concrètes, structurer des produits robustes et évolutifs, et inspirer une nouvelle génération d'ingénieurs. Slaega est aussi mon laboratoire de R&D : j'y mène des études et prototypes (POC/MVP) sur les paiements et le Mobile Money (MTN MoMo, Airtel Money), les paiements instantanés, l'internet banking et les néo-banques, ainsi que sur la sécurité des transactions — un profil à la fois technique et stratégique.",
    skills: ["Leadership", "Vision produit", "Stratégie", "Architecture", "Entrepreneuriat", "R&D", "Fintech", "Paiements", "Sécurité"],
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
    skills: ["Next.js", "React Native", "Node.js", "NestJS", "Microservices", "API-first", "Multi-tenant", "SaaS", "CI/CD", "Coolify", "Docker", "Cloud", "IAM", "Keycloak", "OpenFGA", "Cerbos", "Architecture"],
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
      "En freelance pour Baye Conception, j'ai pris en charge des solutions digitales sur mesure de bout en bout : cadrage et analyse des besoins, architecture, développement front & back, intégration, tests et mise en production. Au-delà du code, un rôle de conseil technique — arbitrer les choix d'architecture, fiabiliser les livraisons et accélérer le time-to-market. J'ai travaillé en autonomie, avec une exigence de qualité et de pragmatisme adaptée à des délais courts et des budgets maîtrisés.",
    skills: ["Full-Stack", "Architecture", "API", "Cloud", "CI/CD", "React", "Next.js", "Conseil"],
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
      "Développeur backend sur des systèmes d'intégration au cœur du SI : faire dialoguer des applications hétérogènes de façon fiable. Je conçois des middlewares et des APIs sécurisées, j'orchestre des services et j'intègre des données multi-sources (synchronisation, transformation, cohérence) entre plateformes qui ne se parlaient pas. Focus sur la robustesse des échanges (gestion des erreurs, reprises, idempotence), la sécurité des accès et la maintenabilité — avec monitoring et supervision pour garder les flux sous contrôle. Un travail d'ingénierie d'intégration où la donnée doit arriver juste, à temps, et en sécurité.",
    skills: ["Node.js", "Middleware", "API", "API REST", "Intégration de données", "Intégration système", "Data", "Backend", "Sécurité", "Temps réel"],
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
      "Première immersion au sein de l'administration des finances publiques : développement et amélioration d'outils numériques internes soutenant les opérations administratives et financières. Full-stack sur l'ensemble du cycle (analyse, conception, front & back, tests), j'ai découvert les exigences propres au secteur public — rigueur, traçabilité, fiabilité — qui structurent aujourd'hui ma façon de concevoir des systèmes à enjeux. Une première pierre qui m'a ramené, des années plus tard, sur des projets institutionnels d'envergure comme e-Bourse.",
    skills: ["Full-Stack", "Frontend", "Backend", "Transformation digitale", "Finance publique"],
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
      "Mes débuts d'ingénieur, au contact direct du terrain : j'ai équipé des PME locales (boutiques, pharmacies) d'outils sur mesure — gestion de stocks, systèmes de tontines et petits outils financiers. De l'analyse des besoins à la modélisation des données jusqu'au développement front & back et au support IT, j'ai porté ces projets seul, de A à Z. C'est là que j'ai appris à traduire un besoin métier concret en logiciel utile, fiable et adopté — une base solide qui irrigue encore ma pratique, notamment sur les usages financiers en contexte africain.",
    skills: ["Full-Stack", "Django", "Gestion de stock", "PME", "Support IT", "Fintech"],
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
  // Authoritative: remove legacy / duplicate experiences not in this set.
  await db.experience.deleteMany({ where: { id: { notIn: EXPERIENCES.map((e) => e.id) } } });
  console.log(`✓ Experiences (${EXPERIENCES.length}) upserted (+ legacy purged)`);
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
  // Authoritative: remove any legacy stats (e.g. from the old seed-cms) not in this set.
  await db.stat.deleteMany({ where: { id: { notIn: STATS.map((s) => s.id) } } });
  console.log(`✓ Stats (${STATS.length}) upserted (+ legacy purged)`);
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
      "Pipelines CI/CD, conteneurs Docker, orchestration Kubernetes (k8s) & k3s, Coolify, déploiement et monitoring sur cloud (AWS, Azure, OpenStack).",
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
  await db.service.deleteMany({ where: { id: { notIn: SERVICES.map((s) => s.id) } } });
  console.log(`✓ Services (${SERVICES.length}) upserted (+ legacy purged)`);
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
  await db.contactField.deleteMany({ where: { name: { notIn: CONTACT_FIELDS.map((f) => f.name) } } });
  console.log(`✓ Contact fields (${CONTACT_FIELDS.length}) upserted (+ legacy purged)`);
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
  await db.aboutBlock.deleteMany({ where: { id: { not: "about-block-main" } } });
  console.log("✓ AboutBlock upserted (+ legacy purged)");
}

// ═══════════════════════════════════════════════════════════════════════════
//  7. ABOUT PAGE — /about singleton (CV-enriched)
// ═══════════════════════════════════════════════════════════════════════════
const ABOUT_PAGE = {
  label: "Apprenez à me connaître",
  title: "À propos",
  intro:
    "Salut ! Je suis Seba Gedeon Matsoula Malonga — architecte logiciel & ingénieur full-stack basé à Brazzaville, avec une expérience couvrant des projets institutionnels, des missions de conseil et des solutions métiers à enjeux financiers.",
  body: `Architecte logiciel, ingénieur full-stack et DevOps, je transforme des besoins complexes en **systèmes fiables, sécurisés et durables**. Ma marque de fabrique : relier la vision produit à l'exécution technique — de l'architecture jusqu'à la mise en production et l'exploitation.

Mon terrain de jeu couvre **plusieurs univers**. Des projets institutionnels à fort enjeu financier — comme *e-Bourse*, la digitalisation du décaissement des bourses de l'État. Des plateformes métier pour des entreprises privées — ventes, facturation, achats, RH, paie, audit — avec une exigence forte de sécurité (**Keycloak** pour l'identité, **OpenFGA** et **Cerbos** pour l'autorisation fine). Et une **R&D appliquée en fintech** : sécurité du Mobile Money, paiements instantanés, internet banking et néo-banques — un profil à la fois technique et stratégique.

Ma vraie force reste le **DevOps et l'administration système** : je conçois, provisionne et opère l'infrastructure de bout en bout. Orchestration **Kubernetes (k8s) & k3s**, conteneurisation Docker, **Coolify** pour accélérer les équipes, reverse-proxy Nginx & TLS, pipelines CI/CD, durcissement de serveurs Linux et observabilité — sur AWS, Azure et OpenStack. Objectif : des systèmes prévisibles, résilients et sous contrôle.

Côté développement, ma stack quotidienne : **Spring Boot, NestJS, Next.js, Laravel, Flutter, Expo, Go**. J'aime particulièrement les **architectures distribuées**, les microservices et l'orchestration multi-systèmes (ERP, CRM, CMS, SaaS) — là où la complexité doit devenir simple à opérer.`,
  highlights: [
    {
      title: "DevOps & Administration système",
      items: [
        "Kubernetes (k8s) & k3s — orchestration & clusters",
        "Docker, Coolify, Nginx (reverse-proxy & TLS)",
        "Provisioning & durcissement de serveurs Linux",
        "Pipelines CI/CD (GitLab / GitHub Actions)",
        "Cloud & IaaS : AWS, Azure, OpenStack",
        "Monitoring, mise en production & exploitation",
      ],
    },
    {
      title: "Ce que je peux réaliser",
      items: [
        "Infrastructure fiable, scalable et sécurisée",
        "Projets numériques à enjeux financiers et institutionnels",
        "Automatisation et optimisation de processus",
        "Sécurisation des accès et des données sensibles",
        "Travail en environnements réglementés",
      ],
    },
    {
      title: "Stack principale",
      items: ["Spring Boot", "NestJS", "Next.js", "Laravel", "Flutter", "Expo (React Native)", "Go", "LangChain", "n8n"],
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
  await db.aboutPage.deleteMany({ where: { id: { not: "about-page-main" } } });
  console.log("✓ AboutPage upserted (+ legacy purged)");
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
  await db.faqItem.deleteMany({ where: { id: { notIn: FAQ_ITEMS.map((f) => f.id) } } });
  console.log(`✓ FAQ items (${FAQ_ITEMS.length}) upserted (+ legacy purged)`);
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
  await db.processStep.deleteMany({ where: { id: { notIn: PROCESS_STEPS.map((p) => p.id) } } });
  console.log(`✓ Process steps (${PROCESS_STEPS.length}) upserted (+ legacy purged)`);
}

// ═══════════════════════════════════════════════════════════════════════════
//  9b. PENSÉES / ÉCRITS — croyances, vision, réflexions, chansons
//      CREATE-ONLY: seeds starter content once, then leaves it fully to the CMS.
//      Never overwrites edits, never purges entries the author adds himself.
// ═══════════════════════════════════════════════════════════════════════════
const PENSEES = [
  // Devises réelles de l'auteur — ses propres mots.
  {
    id: "pensee-devise-king",
    kind: "devise",
    title: "Vise la vie de king",
    subtitle: "",
    body: "",
    link: "",
  },
  {
    id: "pensee-devise-likolo",
    kind: "devise",
    title: "Marche la tête haute, vise le sommet — likolo",
    subtitle: "",
    body: "",
    link: "",
  },
  {
    id: "pensee-devise-rebond",
    kind: "devise",
    title: "Quand je tombe, je rebondis",
    subtitle: "",
    body: "J'ai appris à rebondir : quand je tombe, je vais de l'avant, le regard devant.",
    link: "",
  },
  // Vision — starter à éditer librement depuis le CMS.
  {
    id: "pensee-vision-1",
    kind: "vision",
    title: "Le talent n'a pas de frontière",
    subtitle: "Ma vision",
    body:
      "Depuis Brazzaville, je veux prouver qu'on peut construire ici des choses qui tiennent tête au monde entier. L'avenir se bâtit partout — pas seulement ailleurs.",
    link: "",
  },
  // Chansons — on LIE vers le son, sans jamais réécrire les paroles.
  {
    id: "pensee-song-no-limite",
    kind: "chanson",
    title: "No Limite",
    subtitle: "Seba G",
    body: "",
    link: "https://audiomack.com/seba-g/song/no-limite",
  },
];

async function seedPensees() {
  // Purge de l'ancien contenu de démarrage fictif (paroles inventées) —
  // ciblé par id, ne touche jamais aux écrits créés depuis le CMS.
  await db.pensee.deleteMany({
    where: { id: { in: ["pensee-chanson-1", "pensee-croyance-1", "pensee-pensee-1"] } },
  });

  for (const [i, p] of PENSEES.entries()) {
    await db.pensee.upsert({
      where: { id: p.id },
      create: {
        id: p.id,
        kind: p.kind,
        title: p.title,
        subtitle: p.subtitle,
        body: p.body,
        link: p.link,
        order: i,
        published: true,
      },
      // create-only: leave the author's CMS edits untouched on re-seed.
      update: {},
    });
  }
  console.log(`✓ Pensées (${PENSEES.length}) ensured (create-only, CMS-owned)`);
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

// Keys whose value is authoritative in code and should be re-synced on every
// deploy (overwrite). Others are create-only so admin edits survive.
const SITE_CONFIG_OVERWRITE = new Set(["theme"]);

async function seedSiteConfig() {
  for (const [key, value] of Object.entries(SITE_CONFIG)) {
    const json = JSON.stringify(value);
    const update = SITE_CONFIG_OVERWRITE.has(key) ? { value: json } : {};
    await db.siteConfig.upsert({ where: { key }, create: { key, value: json }, update });
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
  await seedPensees();
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
