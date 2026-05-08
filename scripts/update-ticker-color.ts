import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { buildAdapter } from "../src/lib/db-adapter";

const db = new PrismaClient({ adapter: buildAdapter(process.env.DATABASE_URL!) });

async function main() {
  // Read existing ticker config
  const row = await db.siteConfig.findUnique({ where: { key: "ticker" } });
  const existing = row ? JSON.parse(row.value) : {};

  // Update only bgColor and textColor
  const updated = { ...existing, bgColor: "#0E0E0E", textColor: "#FFFFFF" };
  await db.siteConfig.upsert({
    where:  { key: "ticker" },
    create: { key: "ticker", value: JSON.stringify(updated) },
    update: { value: JSON.stringify(updated) },
  });

  console.log("✓ Ticker bgColor updated to #0E0E0E");
}

main().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
