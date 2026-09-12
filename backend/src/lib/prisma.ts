import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { env } from "./env";

// Reuse a single PrismaClient across hot reloads in dev instead of
// exhausting Postgres connections with a new client per reload.
declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

// Prisma 7 no longer connects using a URL embedded in the schema file —
// the client needs an explicit driver adapter at runtime.
const adapter = new PrismaPg({ connectionString: env.databaseUrl });

export const prisma = global.__prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}
