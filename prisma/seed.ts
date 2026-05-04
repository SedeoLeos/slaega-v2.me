/**
 * Seed script — migrates existing MDX projects + JSON experiences to SQLite.
 * Run once: npx tsx prisma/seed.ts
 */
import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { PrismaClient } from "../src/generated/prisma/client";
import { buildAdapter } from "../src/lib/db-adapter";

const db = new PrismaClient({
  adapter: buildAdapter(process.env.DATABASE_URL!),
});

const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

async function main() {
  // ── Projects ──────────────────────────────────────────────────────────────
  const projectsDir = path.join(process.cwd(), "src/content/project");
  if (fs.existsSync(projectsDir)) {
    const files = fs.readdirSync(projectsDir).filter((f) => f.endsWith(".mdx"));
    console.log(`Seeding ${files.length} projects…`);

    for (const file of files) {
      const raw = fs.readFileSync(path.join(projectsDir, file), "utf-8");
      const { data, content } = matter(raw);
      const slug = file.replace(/\.mdx$/, "");

      const existing = await db.project.findUnique({ where: { slug } });
      if (existing) { console.log(`  skip (exists): ${slug}`); continue; }

      await db.project.create({
        data: {
          slug,
          title: String(data.title ?? slug),
          date: String(data.date ?? new Date().toISOString().split("T")[0]),
          tags: JSON.stringify(Array.isArray(data.tags) ? data.tags : []),
          categories: JSON.stringify(Array.isArray(data.categories) ? data.categories : []),
          image: String(data.image ?? "/img.jpg"),
          description: content.replace(/^#{1,6}\s+.*$/gm, "").replace(/^\s*$/gm, "").split("\n").find((l) => l.trim())?.trim() ?? "",
          content,
          published: true,
        },
      });
      console.log(`  created: ${slug}`);
    }
  }

  // ── Experiences ───────────────────────────────────────────────────────────
  const expDir = path.join(process.cwd(), "src/content/experience");
  if (fs.existsSync(expDir)) {
    const files = fs.readdirSync(expDir).filter((f) => f.endsWith(".json"));
    console.log(`Seeding ${files.length} experiences…`);

    for (const file of files) {
      const exp = JSON.parse(fs.readFileSync(path.join(expDir, file), "utf-8"));

      const existing = await db.experience.findUnique({ where: { id: exp.id } });
      if (existing) { console.log(`  skip (exists): ${exp.id}`); continue; }

      await db.experience.create({
        data: {
          id: exp.id,
          company: exp.company,
          role: exp.role,
          startDate: exp.startDate,
          endDate: exp.endDate ?? null,
          current: Boolean(exp.current),
          description: exp.description,
          skills: JSON.stringify(Array.isArray(exp.skills) ? exp.skills : []),
          location: exp.location ?? "",
          companyUrl: exp.companyUrl ?? null,
        },
      });
      console.log(`  created: ${exp.id}`);
    }
  }

  console.log("✅ Seed complete");
}

main().catch(console.error).finally(() => db.$disconnect());
