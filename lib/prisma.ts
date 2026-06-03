import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/app/generated/prisma/client";

/*
  Prisma v7 uses Driver Adapters instead of the old binary connector.
  PrismaPg wraps the `pg` Pool and translates Prisma's query engine calls
  into standard node-postgres queries.

  The singleton pattern (storing on globalThis) prevents connection pool
  exhaustion during Next.js dev hot-reloads — each file save would otherwise
  create a new Pool with up to ~10 connections each.
*/

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL is not set");

  // Neon (and most hosted PostgreSQL) requires SSL. Local postgres does not.
  // We detect this by checking if the URL is not pointing to localhost/127.0.0.1.
  const isLocal =
    connectionString.includes("localhost") ||
    connectionString.includes("127.0.0.1");

  const pool = new Pool({
    connectionString,
    ssl: isLocal ? false : { rejectUnauthorized: false },
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
