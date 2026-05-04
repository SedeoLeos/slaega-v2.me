// Re-export the Prisma adapter as the canonical project repository.
// To switch database backends, change only DATABASE_URL (and prisma.config.ts provider).
export { prismaProjectAdapter as projectRepository } from "./adapters/prisma.adapter";
