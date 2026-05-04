/**
 * Seed initial data for Stat, AboutBlock, ContactField models.
 * Run once: pnpm tsx prisma/seed-cms.ts
 */
import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { buildAdapter } from "../src/lib/db-adapter";

const db = new PrismaClient({
  adapter: buildAdapter(process.env.DATABASE_URL!),
});

async function main() {
  console.log("🌱 Seeding CMS data…");

  // ── Stats (banner) ─────────────────────────────────────────
  const statsCount = await db.stat.count();
  if (statsCount === 0) {
    await db.stat.createMany({
      data: [
        { value: "30+",  label: "Projets livrés",     color: "green",  order: 0 },
        { value: "5",    label: "Années d'expérience", color: "rose",  order: 1 },
        { value: "10+",  label: "Stack maîtrisée",    color: "amber",  order: 2 },
        { value: "100%", label: "Engagement",         color: "dark",   order: 3 },
      ],
    });
    console.log("✓ 4 stats created");
  } else {
    console.log(`↪ ${statsCount} stat(s) already present, skipping`);
  }

  // ── AboutBlock (banner small card) ──────────────────────────
  const aboutCount = await db.aboutBlock.count();
  if (aboutCount === 0) {
    await db.aboutBlock.create({
      data: {
        label: "À propos de moi",
        body: "Architecte logiciel & ingénieur full-stack — solutions métiers et institutionnelles à enjeux financiers.",
        ctaText: "En savoir plus",
        ctaHref: "/about",
        published: true,
        order: 0,
      },
    });
    console.log("✓ AboutBlock created");
  } else {
    console.log(`↪ AboutBlock already present, skipping`);
  }

  // ── ContactField (form) ─────────────────────────────────────
  const fieldsCount = await db.contactField.count();
  if (fieldsCount === 0) {
    await db.contactField.createMany({
      data: [
        {
          name: "name",
          label: "Nom",
          type: "text",
          placeholder: "Votre nom",
          required: true,
          options: "[]",
          order: 0,
          published: true,
        },
        {
          name: "email",
          label: "Email",
          type: "email",
          placeholder: "vous@exemple.com",
          required: true,
          options: "[]",
          order: 1,
          published: true,
        },
        {
          name: "subject",
          label: "Sujet",
          type: "select",
          placeholder: "Choisir un sujet",
          required: false,
          options: JSON.stringify([
            "Mission freelance",
            "Conseil technique",
            "Recrutement",
            "Question générale",
            "Autre",
          ]),
          order: 2,
          published: true,
        },
        {
          name: "message",
          label: "Message",
          type: "textarea",
          placeholder: "Décrivez votre projet…",
          required: true,
          options: "[]",
          order: 3,
          published: true,
        },
      ],
    });
    console.log("✓ 4 contact fields created");
  } else {
    console.log(`↪ ${fieldsCount} contact field(s) already present, skipping`);
  }

  console.log("Done.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
