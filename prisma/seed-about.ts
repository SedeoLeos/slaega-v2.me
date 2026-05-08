/**
 * Seed the AboutPage singleton with CV-enriched content.
 * Run once: pnpm tsx prisma/seed-about.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { buildAdapter } from "../src/lib/db-adapter";

const db = new PrismaClient({
  adapter: buildAdapter(process.env.DATABASE_URL!),
});

const ABOUT_CONTENT = {
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
      items: [
        "Spring Boot",
        "NestJS",
        "Next.js",
        "Laravel",
        "Flutter",
        "Expo (React Native)",
        "Go",
        "LangChain",
        "n8n",
      ],
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

async function main() {
  console.log("🌱 Seeding AboutPage…");

  // Delete existing rows then create one fresh (singleton)
  await db.aboutPage.deleteMany({});

  await db.aboutPage.create({
    data: {
      ...ABOUT_CONTENT,
      highlights: JSON.stringify(ABOUT_CONTENT.highlights),
    },
  });

  console.log("✓ AboutPage seeded with CV-enriched content");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
